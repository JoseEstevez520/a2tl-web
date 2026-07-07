#!/usr/bin/env node
// generate.js — CLI: node generate.js input.uidl [output.html]
// Lee un archivo .uidl, lo parsea y genera un .html standalone

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { parseUIDL } from './parser.js';
import { renderHTML } from './renderer.js';

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  console.log(`
uidl — genera paginas HTML desde specs UIDL

Uso:
  node generate.js <archivo.uidl> [salida.html]

Si no se indica salida, se usa el mismo nombre con .html.

Ejemplo:
  node generate.js examples/dashboard_anfaia.uidl output/dashboard.html
`);
  process.exit(0);
}

const inputFile = args[0];
const outputFile = args[1] || inputFile.replace(/\.uidl$/, '.html');

if (!existsSync(inputFile)) {
  console.error(`Error: no existe "${inputFile}"`);
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
console.log(`  Ahorro:  ${savings}%`);
console.log(`  Theme:   ${spec.theme}`);
console.log(`  Secciones: ${spec.sections.length}`);
