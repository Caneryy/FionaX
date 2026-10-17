# Publishing contributor issues

RevyHubX issues are product specifications for external contributors. The
maintainer prepares and publishes them; contributors implement them. An issue
must never be pre-solved in the repository before it is offered.

## Drips 2026 season

The new Drips season is defined in `scripts/fiona-season-2026.mjs`. It
contains 20 independent, unimplemented tool issues. Each issue requires at
least 30 meaningful file changes inside one new `app/tools/<slug>/` directory
plus its `tests/tools/<slug>/` directory: the standard 17-file scaffold plus
three domain modules, four domain views, three domain tests and three
fixtures. See `docs/TOOL_CONTRACT.md` for the full layout and the
independence guarantees.

Preview and publish the new season with:

```bash
npm run verify:tools
node scripts/publish-fiona-season.mjs --verify
node scripts/publish-fiona-season.mjs
node scripts/publish-fiona-season.mjs --json
npm run issues:drips -- --apply
```

Publication is idempotent by issue title. Because FionaX is approved for the
Stellar Wave Program, applying the `Stellar Wave` GitHub label adds an open
issue to the Program. Verify publication on the public Drips Explore page.
Issues added through GitHub receive Drips' default Trivial complexity; a
maintainer can change the complexity in the Drips dashboard.

## Independence test

An issue is independent only when all of these are true:

- its pull request touches only `app/tools/<slug>/` and `tests/tools/<slug>/`;
- it does not edit `lib/constants.ts`, `lib/tools.generated.ts`, `app/page.tsx`,
  or any other tool's directory;
- its acceptance criteria can be completed without another open issue landing
  first;
- its fixtures, tests and documentation live inside the slice.

`npm run verify:tools -- <slug>` enforces the structural part. Reviewers
enforce the behavioral part using the pull request template.

## Older roadmap track

`docs/ISSUES.md` and `scripts/create-github-issues.mjs` are an earlier,
separate issue track and are unaffected by the Drips 2026 season above.
