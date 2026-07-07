#!/usr/bin/env node
// generate.js — CLI: node generate.js input.uidl [output.html]
// Reads a .uidl file, parses it, and generates a standalone .html file

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { parseUIDL } from './parser.js';
import { renderHTML } from './renderer.js';

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  console.log(`
uidl — generate HTML pages from UIDL specs

Usage:
  node generate.js <file.uidl> [output.html]

If no output is specified, the input filename with .html extension is used.

Example:
  node generate.js examples/analytics.uidl output/analytics.html
`);
  process.exit(0);
}

const inputFile = args[0];
const outputFile = args[1] || inputFile.replace(/\.uidl$/, '.html');

if (!existsSync(inputFile)) {
  console.error(`Error: file not found "${inputFile}"`);
  process.exit(1);
}

const uidlText = readFileSync(inputFile, 'utf-8');
const spec = parseUIDL(uidlText);
const html = renderHTML(spec);

const outDir = dirname(outputFile);
if (outDir && !existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

writeFileSync(outputFile, html, 'utf-8');

const uidlTokens = Math.round(uidlText.length / 3.5);
const htmlTokens = Math.round(html.length / 3.5);
const savings = ((1 - uidlTokens / htmlTokens) * 100).toFixed(0);

console.log(`${inputFile} → ${outputFile}`);
console.log(`  UIDL:    ${uidlText.length} bytes (~${uidlTokens} tokens)`);
console.log(`  HTML:    ${html.length} bytes (~${htmlTokens} tokens)`);
console.log(`  Savings: ${savings}%`);
console.log(`  Theme:   ${spec.theme}`);
console.log(`  Sections: ${spec.sections.length}`);
