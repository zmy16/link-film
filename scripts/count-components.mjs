#!/usr/bin/env node
/**
 * Canonical component-count metric for the Cinematic Premium restyle (Req 9.2).
 *
 * Counts FILES, not exported components: every React component file anywhere in
 * the app tree (app/** and components/**, recursive) that exports at least one
 * React component. A file exporting three components counts once.
 *
 * This is THE single source of truth for every component-count report
 * (baseline, per-task PR reports, and the final task-14 audit). All reports
 * must be produced by running this script so every count uses identical rules.
 *
 * Exclusion list (applies to ALL counts — baseline, per-task, final audit):
 *   1. `*.test.*` / `*.spec.*` / `*.stories.*` files
 *   2. `index.ts` / `index.tsx` barrel files
 *   3. Type-only files (no runtime exports; e.g. `types.ts`, anything whose
 *      exports are all `type`/`interface` only)
 *   4. The token-swatch contrast fixture page (path segment `token-swatch`,
 *      dev/test-only — rendered solely by axe fixtures)
 *   5. Any component defined inside a test file (already covered by rule 1 —
 *      test files are excluded wholesale, so test-helper components never
 *      reach the count)
 *
 * An "exports at least one React component" file is one whose source matches
 * one of the export shapes:
 *   - `export default function X(` / `export default (props) =>` (component-like
 *     name: uppercase first letter for named/arrow, any for default export of
 *     a function returning JSX is heuristically accepted via `function` keyword)
 *   - `export function X(` with X uppercase
 *   - `const X = (...) => ...` + `export ... X` with X uppercase
 *   - `export default X` where X is uppercase-identified in the same file
 *
 * Deliberately regex-based (no AST toolchain dependency) so the script runs
 * with zero extra devDependencies in any checkout.
 *
 * Usage:
 *   node scripts/count-components.mjs            # human-readable report
 *   node scripts/count-components.mjs --json     # machine-readable (CI)
 *
 * Exit code is 0 even when over budget; CI/PR review reads the count.
 * (Over-budget states are a review/merge gate, not a script failure.)
 */

import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SEARCH_DIRS = ["app", "components"];
const EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs"]);

/** Files that are never counted, by design. Encoded here so every report uses identical rules. */
function isExcluded(relPath, base) {
  // 1. test / spec / stories files
  if (/\.(test|spec|stories)\.[a-z]+$/.test(base)) return true;
  // 2. barrel files
  if (/^index\.(ts|tsx|js|jsx)$/.test(base)) return true;
  // 4. token-swatch contrast fixture page (dev/test-only, axe-fixture-rendered)
  const norm = relPath.split(path.sep).join("/");
  if (/(^|\/)token-swatch(\/|$)/.test(norm)) return true;
  return false;
}

/** A file counts only if it exports at least one React component (runtime value, not a type). */
async function exportsReactComponent(absPath) {
  let src;
  try {
    src = await readFile(absPath, "utf8");
  } catch {
    return false;
  }

  const upper = (name) => /^[A-Z]/.test(name);

  // `export default function Name(` — default-exported component
  if (/export\s+default\s+(async\s+)?function\s+([A-Za-z_$][\w$]*)/.test(src)) return true;

  // `export default function (` — anonymous default component
  if (/export\s+default\s+(async\s+)?function\s*\(/.test(src)) return true;

  // `export default SomeName` / `export { SomeName as default }`
  const defaultExportName =
    src.match(/export\s+default\s+([A-Za-z_$][\w$]*)\s*;?/) ??
    src.match(/export\s*\{([^}]+)\}\s*from\s*['"][^'"]+['"]/s);
  if (defaultExportName && upper(defaultExportName[1].trim().split(/\s+as\s+/).pop())) return true;

  // `export function Name(` — named component
  for (const m of src.matchAll(/export\s+(async\s+)?function\s+([A-Za-z_$][\w$]*)/g)) {
    if (upper(m[2])) return true;
  }

  // `const Name = (…) => …` / `function Name(…)` + separate `export { Name }` / `export { Name as … }`
  const exportedNames = new Set();
  for (const m of src.matchAll(
    /export\s*\{([^}]*)\}(?!\s*from)/g
  )) {
    for (const part of m[1].split(",")) {
      const piece = part.trim();
      if (!piece) continue;
      const asName = piece.split(/\s+as\s+/).pop().trim();
      if (asName) exportedNames.add(asName);
    }
  }
  for (const m of src.matchAll(
    /export\s+(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g
  )) {
    exportedNames.add(m[1]);
  }

  if (exportedNames.size > 0) {
    // 3. type-only files export nothing but types — never count.
    const hasRuntimeExport =
      /export\s+(default|function|const|let|var|class)\s/.test(src) ||
      /export\s*\{[^}]*\}(?!\s*from)/.test(src);
    if (!hasRuntimeExport) return false;

    for (const name of exportedNames) {
      if (!upper(name)) continue;
      // Is `name` a component (function/arrow/class) rather than a plain constant?
      const isFn =
        new RegExp(
          `(?:function\\s+${name}\\s*\\(|const\\s+${name}\\s*=\\s*(?:\\(|[A-Za-z_$][\\w$]*\\s*=>|async)|class\\s+${name}\\b)`
        ).test(src);
      if (isFn) return true;
    }
  }

  return false;
}

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      yield* walk(abs);
    } else if (entry.isFile() && EXTENSIONS.has(path.extname(entry.name))) {
      yield abs;
    }
  }
}

async function main() {
  const counted = [];
  const excluded = [];

  for (const dir of SEARCH_DIRS) {
    for await (const abs of walk(path.join(ROOT, dir))) {
      const rel = path.relative(ROOT, abs);
      const base = path.basename(rel);
      if (isExcluded(rel, base)) {
        excluded.push(rel);
        continue;
      }
      if (await exportsReactComponent(abs)) {
        counted.push(rel);
      }
      // Files that export no React component (utils, hooks-only, data, types)
      // are not excluded-list material; they simply do not count.
    }
  }

  counted.sort();
  excluded.sort();

  const budget = 12;
  const target = 10;
  const overBudget = counted.length > budget;

  if (process.argv.includes("--json")) {
    console.log(
      JSON.stringify(
        {
          count: counted.length,
          budget,
          target,
          overBudget,
          files: counted,
          excluded,
        },
        null,
        2
      )
    );
    return;
  }

  console.log("Canonical component count (files, not exported components)");
  console.log(`  app/** + components/**, recursive, ≥1 React component export\n`);
  console.log(`Count: ${counted.length}  (budget ≤ ${budget}, target ≤ ${target})`);
  console.log(overBudget ? "  ⚠ OVER BUDGET — flag in PR and task-1 artifact" : "  ✓ within budget");
  console.log(`\nCounted files (${counted.length}):`);
  for (const f of counted) console.log(`  ${f}`);
  console.log(`\nExcluded files (${excluded.length}):`);
  for (const f of excluded) console.log(`  ${f}`);
}

main();
