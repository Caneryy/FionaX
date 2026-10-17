#!/usr/bin/env node
/**
 * Enforces the independence contract in docs/TOOL_CONTRACT.md for one tool,
 * or every tool when no slug is given.
 *
 *   npm run verify:tools -- fee-stats
 *   npm run verify:tools
 */

import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const toolsDir = path.join(root, "app", "tools");
const testsDir = path.join(root, "tests", "tools");

// Tools shipped before docs/TOOL_CONTRACT.md existed; grandfathered out of the
// 30-file and required-layout checks below, same as the contract says.
const LEGACY_TOOLS = new Set([
  "address-validator",
  "balance-viewer",
  "trustline-checker",
  "payment-qr",
  "transaction-lookup",
  "freighter-connect",
  "testnet-faucet"
]);

const REQUIRED_FILES = [
  "manifest.ts",
  "page.tsx",
  "types.ts",
  "schema.ts",
  "copy.ts",
  "lib/format.ts",
  "README.md"
];

async function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const full = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      out.push(...(await walk(full)));
    } else {
      out.push(full);
    }
  }
  return out;
}

async function verifyTool(slug) {
  const dir = path.join(toolsDir, slug);
  const errors = [];

  if (!existsSync(dir)) {
    return [`app/tools/${slug} does not exist`];
  }

  if (LEGACY_TOOLS.has(slug)) {
    if (!existsSync(path.join(dir, "manifest.ts"))) {
      errors.push(`app/tools/${slug}/manifest.ts is missing`);
    }
    return errors;
  }

  for (const file of REQUIRED_FILES) {
    if (!existsSync(path.join(dir, file))) {
      errors.push(`app/tools/${slug}/${file} is missing`);
    }
  }

  const manifestPath = path.join(dir, "manifest.ts");
  if (existsSync(manifestPath)) {
    const source = await readFile(manifestPath, "utf8");
    const declared = source.match(/slug:\s*"([^"]+)"/)?.[1];
    if (declared !== slug) {
      errors.push(`app/tools/${slug}/manifest.ts declares slug "${declared}", expected "${slug}"`);
    }
  }

  const toolFiles = await walk(dir);
  const testFiles = await walk(path.join(testsDir, slug));
  const allFiles = [...toolFiles, ...testFiles];

  if (allFiles.length < 30) {
    errors.push(`app/tools/${slug} has ${allFiles.length} files; the contract requires at least 30`);
  }

  for (const file of allFiles) {
    const relativeToRoot = path.relative(root, file);
    const touchesOtherTool =
      /^app\/tools\/([a-z0-9-]+)\//.test(relativeToRoot) && !relativeToRoot.startsWith(`app/tools/${slug}/`);
    const touchesOtherTests =
      /^tests\/tools\/([a-z0-9-]+)\//.test(relativeToRoot) && !relativeToRoot.startsWith(`tests/tools/${slug}/`);
    if (touchesOtherTool || touchesOtherTests) {
      errors.push(`${relativeToRoot} is outside app/tools/${slug}/ and tests/tools/${slug}/`);
    }
  }

  return errors;
}

async function discoverSlugs() {
  if (!existsSync(toolsDir)) return [];
  const dirents = await readdir(toolsDir, { withFileTypes: true });
  return dirents.filter((d) => d.isDirectory()).map((d) => d.name).sort();
}

async function main() {
  const requested = process.argv[2];
  const slugs = requested ? [requested] : await discoverSlugs();
  let failed = false;

  for (const slug of slugs) {
    const errors = await verifyTool(slug);
    if (errors.length > 0) {
      failed = true;
      console.error(`[verify-tools] ${slug}:`);
      for (const error of errors) console.error(`  - ${error}`);
    } else {
      console.log(`[verify-tools] ${slug}: OK`);
    }
  }

  if (failed) process.exit(1);
}

main();
