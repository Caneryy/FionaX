# The RevyHubX tool contract

Every new tool in RevyHubX is a **self-contained slice**: one directory under
`app/tools/<slug>/`, plus its own test directory under `tests/tools/<slug>/`,
that owns its logic, validation, state, UI, tests and fixtures. Nothing about
a tool lives outside those two directories.

This document is the specification each Drips 2026 season issue is written
against. `npm run verify:tools -- <slug>` enforces it.

---

## Why this exists

RevyHubX already gives every tool its own route file
(`app/tools/<slug>/page.tsx`), so two contributors never collide on routing.
The one shared file left was `lib/constants.ts`, which every new tool had to
edit by hand to appear on the homepage — a guaranteed merge conflict the
moment two tool pull requests were open at once.

`scripts/generate-tools.mjs` removes that last shared edit. It scans
`app/tools/<slug>/manifest.ts` for every tool directory and writes
`lib/tools.generated.ts` (gitignored, regenerated on `predev`, `prebuild`,
`pretest` and `postinstall`). Listing a tool on the homepage is a side effect
of creating its directory — not a separate edit.

**Adding a tool means creating `app/tools/<slug>/` and `tests/tools/<slug>/`
and editing nothing else.** Two contributors working on two different tools
cannot conflict, because they never touch the same file.

The seven tools that shipped before this contract existed (`address-validator`,
`balance-viewer`, `trustline-checker`, `payment-qr`, `transaction-lookup`,
`freighter-connect`, `testnet-faucet`) are grandfathered out of the file-count
and layout rules below; they only need the `manifest.ts` that makes them
visible to the generator. Every tool published through the Drips 2026 season
must follow the full contract.

---

## Required layout

```
app/tools/<slug>/
├── manifest.ts                     homepage metadata (title, icon, status)
├── page.tsx                        route entry, re-exports the panel
├── types.ts                        the tool's own types and error codes
├── schema.ts                       raw input → validated request, no requests
├── copy.ts                         every user-facing string
├── lib/
│   ├── <domain>.ts                 the tool's logic
│   ├── <domain>.errors.ts          failure mapping to this tool's codes
│   └── format.ts                   presentation helpers
├── hooks/
│   └── use<Name>.ts                idle / loading / success / error state machine
├── components/
│   ├── <Name>Panel.tsx             composes every state
│   ├── <Name>Form.tsx              accessible input controls
│   ├── <Name>Result.tsx            success view
│   └── <Name>EmptyState.tsx        pre-interaction guidance
└── README.md                       behavior, data boundaries, design decisions

tests/tools/<slug>/
├── <domain>.test.ts                 domain success and failure cases
├── schema.test.ts                   input and boundary validation
├── format.test.ts                   exact display formatting
└── fixtures/
    └── *.fixture.ts                 deterministic test data
```

A tool published through the Drips 2026 season adds task-specific modules
under `lib/`, views under `components/`, and fixtures beyond this base list —
see the issue body for the exact file table. **At least 30 meaningful files
across `app/tools/<slug>/` and `tests/tools/<slug>/` combined.** Empty or
duplicated files do not count.

## Shared files a tool may read, never write

A tool may **import** from these without ever editing them:

- `lib/stellar/*` — Horizon/Friendbot clients and the Stellar SDK helpers.
- `components/ui/*` and `components/stellar/*` — shared presentation and
  Stellar-specific components (`Card`, `Button`, `CharacterPanel`,
  `StatusMessage`, `AddressInput`, `NetworkProvider`, ...).
- `lib/tool-manifest.ts` — the `ToolManifest` type.

If a tool genuinely needs a new shared primitive, that is a sign the issue
should propose the primitive as its own, separate issue first — not bundle a
shared-file edit into an unrelated tool's pull request.

## Independence test

A tool issue is independent only when all of these are true:

- its pull request touches only `app/tools/<slug>/` and `tests/tools/<slug>/`;
- it does not edit `lib/constants.ts`, `lib/tools.generated.ts`,
  `app/page.tsx`, or any other tool's directory;
- its acceptance criteria can be completed without another open issue landing
  first;
- its fixtures, tests and documentation live inside the slice.

`npm run verify:tools -- <slug>` enforces the structural part. Reviewers
enforce the behavioral part using the pull request template.
