#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fionaSeason2026 } from "./fiona-season-2026.mjs";
import { dripsConfig } from "./drips-config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repo = dripsConfig.repository;

const categoryLabels = {
  accounts: "Accounts",
  assets: "Assets & Trustlines",
  payments: "Payments",
  transactions: "Transactions",
  network: "Network & Infrastructure",
  developer: "Developer Utilities"
};

const areaLabels = {
  accounts: "area:stellar",
  assets: "area:stellar",
  payments: "area:stellar",
  transactions: "area:stellar",
  network: "area:stellar",
  developer: "area:dx"
};

const baseFiles = [
  ["manifest.ts", "Homepage metadata consumed by the generated tool registry"],
  ["page.tsx", "Route entry point"],
  ["types.ts", "Input, result, state and error-code types"],
  ["schema.ts", "Raw input validation without requests"],
  ["copy.ts", "All user-facing strings and actionable error text"],
  ["lib/{camel}.ts", "Result-based tool orchestration"],
  ["lib/{camel}.errors.ts", "Transport or decode failure mapping"],
  ["lib/format.ts", "Presentation formatting"],
  ["hooks/use{pascal}.ts", "Idle, loading, success and error state machine"],
  ["components/{pascal}Panel.tsx", "Composition of every state"],
  ["components/{pascal}Form.tsx", "Accessible input controls"],
  ["components/{pascal}Result.tsx", "Successful result overview"],
  ["components/{pascal}EmptyState.tsx", "Pre-interaction guidance"],
  ["README.md", "Behavior, data boundaries and design decisions"]
];

const baseTestFiles = [
  ["{camel}.test.ts", "Domain success and failure cases"],
  ["schema.test.ts", "Input and boundary validation"],
  ["format.test.ts", "Exact display formatting"]
];

function gh(args) {
  return execFileSync("gh", args, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }).trim();
}

function names(slug) {
  const pascal = slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  const camel = pascal[0].toLowerCase() + pascal.slice(1);
  return { pascal, camel };
}

function title(tool) {
  return `[${categoryLabels[tool.category]}] ${tool.title}`;
}

function toolFiles(tool) {
  const { pascal, camel } = names(tool.slug);
  const resolve = (file) => file.replaceAll("{pascal}", pascal).replaceAll("{camel}", camel);

  const appFiles = [
    ...baseFiles.map(([file, purpose]) => [`app/tools/${tool.slug}/${resolve(file)}`, purpose]),
    ...tool.modules.map(([file, purpose]) => [`app/tools/${tool.slug}/${file}`, purpose]),
    ...tool.views.map(([file, purpose]) => [`app/tools/${tool.slug}/${file}`, purpose])
  ];

  const moduleTestFiles = tool.modules.map(([file]) => {
    const basename = file.replace(/^lib\//, "").replace(/\.ts$/, "");
    return [`tests/tools/${tool.slug}/${basename}.test.ts`, `Tests for ${file}`];
  });

  const testFiles = [
    ...baseTestFiles.map(([file, purpose]) => [`tests/tools/${tool.slug}/${resolve(file)}`, purpose]),
    ...moduleTestFiles,
    ...tool.fixtures.map((file) => [`tests/tools/${tool.slug}/${file}`, "Deterministic fixture data"])
  ];

  return [...appFiles, ...testFiles];
}

export function validateFionaSeason() {
  if (fionaSeason2026.length !== dripsConfig.batchSize) {
    throw new Error(`The Fiona season must have exactly ${dripsConfig.batchSize} issues.`);
  }
  const slugs = new Set();
  const titles = new Set();
  for (const tool of fionaSeason2026) {
    if (!/^[a-z][a-z0-9-]*$/.test(tool.slug) || slugs.has(tool.slug)) {
      throw new Error(`Invalid or duplicate slug: ${tool.slug}`);
    }
    if (titles.has(tool.title)) throw new Error(`Duplicate title: ${tool.title}`);
    slugs.add(tool.slug);
    titles.add(tool.title);
    if (!areaLabels[tool.category] || !categoryLabels[tool.category]) {
      throw new Error(`Unknown category: ${tool.category}`);
    }
    if (existsSync(path.join(root, "app", "tools", tool.slug))) {
      throw new Error(`Already implemented: ${tool.slug}`);
    }
    if (!existsSync(path.join(root, tool.reference))) {
      throw new Error(`Missing reference implementation: ${tool.reference}`);
    }
    if (tool.criteria.length < 5 || tool.codes.length < 3 || tool.outOfScope.length < 2) {
      throw new Error(`Incomplete specification: ${tool.slug}`);
    }
    if (tool.modules.length !== 3 || tool.views.length !== 4 || tool.fixtures.length !== 3) {
      throw new Error(`Incomplete 30-file layout: ${tool.slug}`);
    }
    const paths = toolFiles(tool).map(([file]) => file);
    if (paths.length < 30 || new Set(paths).size !== paths.length) {
      throw new Error(`The file layout is not at least 30 unique paths: ${tool.slug}`);
    }
    if (paths.some((file) => file.startsWith("/") || file.includes(".."))) {
      throw new Error(`Invalid file path: ${tool.slug}`);
    }
  }
  return fionaSeason2026.length;
}

function issueBody(tool) {
  const fileRows = toolFiles(tool).map(([file, purpose]) => `| \`${file}\` | ${purpose} |`).join("\n");
  const criteria = tool.criteria.map((item) => `- [ ] ${item}`).join("\n");
  const codes = tool.codes.map((code) => `- \`${code}\`: map to specific, actionable copy and cover with a test`).join("\n");
  const boundaries = tool.outOfScope.map((item) => `- ${item}`).join("\n");
  return `## Goal\n\n${tool.summary}\n\n**Data source:** ${tool.source}\n\nThis issue is independent of every other Drips 2026 issue. Implement it entirely inside \`app/tools/${tool.slug}/\` and \`tests/tools/${tool.slug}/\`; the generated homepage registry picks it up automatically. Do not require another tool or pull request to land first.\n\n## Acceptance criteria\n\n${criteria}\n\n## At least 30 meaningful file changes\n\nStart with \`npm run new:tool -- ${tool.slug} "${tool.title}"\`. The scaffold supplies the standard layout; add the modules, views and fixtures below and replace every placeholder with working behavior. Every listed file must contain relevant implementation, coverage, fixture data or documentation; empty or duplicated files do not count. A PR may change more than 30 files inside this slice when justified.\n\n| Required file | Responsibility |\n| --- | --- |\n${fileRows}\n\n## Error outcomes\n\n${codes}\n\n## Shared quality bar\n\n- [ ] Keep all user-facing copy in \`copy.ts\`.\n- [ ] Cover idle, loading, success and error states. For fully offline tools, loading may be a brief local-processing state.\n- [ ] Use strings and \`BigInt\` for Stellar amounts; never accept, display, store or transmit secret keys.\n- [ ] Mock any Horizon/RPC calls with deterministic fixtures under \`tests/tools/${tool.slug}/fixtures/\`.\n- [ ] Test normal, boundary, malformed-input and transport cases where applicable.\n- [ ] Pass \`npm run lint\`, \`npm run test\` and \`npm run verify:tools -- ${tool.slug}\`.\n- [ ] Keep the pull request inside \`app/tools/${tool.slug}/\` and \`tests/tools/${tool.slug}/\`.\n\n${tool.offline ? "This tool is fully offline. Make no Horizon or RPC request from this slice.\n\n" : ""}**Implementation note:** ${tool.notes}\n\n**Reference tool:** \`${tool.reference}\`; also read [the tool contract](../blob/main/docs/TOOL_CONTRACT.md).\n\n## Out of scope\n\n${boundaries}\n`;
}

export function payloads() {
  validateFionaSeason();
  return fionaSeason2026.map((tool) => ({
    slug: tool.slug,
    title: title(tool),
    body: issueBody(tool),
    labels: [...dripsConfig.requiredLabels, "enhancement", "help wanted", "difficulty:advanced", areaLabels[tool.category]],
    fileCount: toolFiles(tool).length
  }));
}

function main() {
  const current = payloads();
  const args = process.argv.slice(2);
  if (args.includes("--verify")) {
    console.log(`[fiona-season] OK: ${current.length} independent issues, each at least 30 distinct files`);
    return;
  }
  if (args.includes("--json")) {
    console.log(JSON.stringify(current, null, 2));
    return;
  }
  const existing = new Set(
    JSON.parse(gh(["issue", "list", "-R", repo, "--state", "all", "--limit", "1000", "--json", "title"])).map((issue) => issue.title)
  );
  const pending = current.filter((issue) => !existing.has(issue.title));
  if (!args.includes("--apply")) {
    console.log(`Fiona season preview: ${pending.length} unpublished of ${current.length} issues`);
    for (const issue of pending) console.log(`${issue.title} (${issue.fileCount} files)`);
    console.log("Run with --apply to publish the unpublished issues.");
    return;
  }
  for (const label of dripsConfig.requiredLabels) {
    gh(["label", "create", label, "-R", repo, "--color", "5555ff", "--force"]);
  }
  for (const issue of pending) {
    const url = gh([
      "issue", "create", "-R", repo,
      "--title", issue.title,
      "--body", issue.body,
      ...issue.labels.flatMap((label) => ["--label", label])
    ]);
    console.log(`${issue.slug}\t${url}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
