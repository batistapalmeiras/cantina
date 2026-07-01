#!/usr/bin/env node
/**
 * sort-imports.js
 * Sorts imports in .ts/.tsx files into labelled groups without blank lines between groups.
 *
 * Groups (in order):
 *   // React      → react, react-dom, react-router-dom, react-hook-form, @hookform
 *   // Libs       → other external libraries (styled-components, lucide-react, zod, etc.)
 *   // Components → deeper relative imports (../../components, ../../hooks, etc.)
 *   // Local      → same-directory relative imports (./components, ../domain, etc.)
 */

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) process.exit(0);

const ext = path.extname(filePath);
if (!['.ts', '.tsx'].includes(ext)) process.exit(0);

let content;
try {
  content = fs.readFileSync(filePath, 'utf8');
} catch {
  process.exit(0);
}

// Remove ALL import-related comments and blank lines to start fresh
content = content.replace(/^\/\/ (React|Libs|Components|Local)\n/gm, '');

// Extract import statements (supports multi-line)
function extractImports(src) {
  const lines = src.split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trimStart();

    if (/^import\s/.test(trimmed) || /^import\{/.test(trimmed)) {
      const startLine = i;
      let chunk = lines[i];

      while (
        i < lines.length - 1 &&
        !/ from ['"]/.test(lines[i]) &&
        !/^import\s+['"]/.test(lines[i].trimStart())
      ) {
        i++;
        chunk += '\n' + lines[i];
      }

      result.push({ text: chunk.trimEnd(), startLine, endLine: i });
      i++;
      continue;
    }

    // Skip blank lines in import section if we have imports
    if (trimmed === '' && result.length > 0) {
      i++;
      continue;
    }

    // Stop when we hit non-import code
    if (result.length > 0) break;

    i++;
  }

  return { imports: result, firstLine: result[0]?.startLine ?? 0, lastLine: result[result.length - 1]?.endLine ?? 0 };
}

function getSource(text) {
  const m = text.match(/from\s+['"]([^'"]+)['"]/);
  if (m) return m[1];
  const s = text.match(/^import\s+['"]([^'"]+)['"]/);
  return s ? s[1] : '';
}

const REACT_RE = /^(react|react-dom|react-router-dom|react-hook-form|@hookform)(\/|$)/;

function classify(source) {
  if (REACT_RE.test(source)) return 0;
  if (/^[a-zA-Z@]/.test(source)) return 1;
  if (/^\.\.\//.test(source)) return 2;
  if (/^\.\//.test(source)) return 3;
  return 1;
}

const GROUP_LABEL = ['// React', '// Libs', '// Components', '// Local'];

const { imports, firstLine, lastLine } = extractImports(content);
if (imports.length === 0) process.exit(0);

// Group and sort
const groups = [[], [], [], []];
for (const imp of imports) {
  const src = getSource(imp.text);
  groups[classify(src)].push(imp.text);
}
for (const g of groups) {
  g.sort((a, b) => getSource(a).localeCompare(getSource(b)));
}

// Build new import block with no blank lines between groups
const sections = [];
for (let i = 0; i < groups.length; i++) {
  if (groups[i].length > 0) {
    sections.push(GROUP_LABEL[i] + '\n' + groups[i].join('\n'));
  }
}
const newImportBlock = sections.join('\n');

// Replace
const lines = content.split('\n');
const before = lines.slice(0, firstLine).join('\n');
const after = lines.slice(lastLine + 1).join('\n');

const newContent =
  (before ? before + '\n' : '') +
  newImportBlock +
  (after ? '\n' + after : '');

if (newContent !== content) {
  fs.writeFileSync(filePath, newContent, 'utf8');
}
