#!/usr/bin/env node
// generate.js — CLI: node generate.js input.uidl [output.html]
// Lee un archivo .uidl, lo parsea y genera un .html standalone

const fs = require('fs');
const path = require('path');
const { parseUIDL } = require('./parser');
const { renderHTML } = require('./renderer');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Uso: node generate.js <archivo.uidl> [salida.html]');
  console.log('  Si no se indica salida, se usa el mismo nombre con .html');
  console.log('');
  console.log('Ejemplo:');
  console.log('  node generate.js examples/dashboard_anfaia.uidl output/dashboard_anfaia.html');
  process.exit(0);
}

const inputFile = args[0];
const outputFile = args[1] || inputFile.replace(/\.uidl$/, '.html');

if (!fs.existsSync(inputFile)) {
  console.error(`Error: no existe "${inputFile}"`);
  process.exit(1);
}

const uidlText = fs.readFileSync(inputFile, 'utf-8');
const spec = parseUIDL(uidlText);
const html = renderHTML(spec);

// Crear directorio de salida si no existe
const outDir = path.dirname(outputFile);
if (outDir && !fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(outputFile, html, 'utf-8');

const tokens_approx = Math.round(uidlText.length / 4); // rough estimate
console.log(`OK: ${inputFile} -> ${outputFile}`);
console.log(`   UIDL: ${uidlText.length} chars (~${tokens_approx} tokens aprox)`);
console.log(`   HTML: ${html.length} chars`);
console.log(`   Secciones: ${spec.sections.length}`);
console.log(`   Theme: ${spec.theme}`);
