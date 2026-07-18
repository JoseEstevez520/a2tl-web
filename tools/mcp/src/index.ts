#!/usr/bin/env node
/**
 * mcp-a2tl-web — MCP server for rendering A2TL-Web specs as HTML pages.
 * Part of the A2TL family (Agent to Transformation Language).
 *
 * Tools:
 *   render_page(spec, format?, filename?) — A2TL-Web/JSON → standalone HTML, opens in browser
 *   list_examples()                       — list available example specs
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { writeFile, readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { exec } from 'node:child_process';
import { parseUIDL, type UIDLSpec, type BrandConfig } from './parser.js';
import { renderHTML } from './renderer.js';

// ── Config ────────────────────────────────────────────────────────────

const OUTPUT_DIR = resolve(join(import.meta.dirname, '..', 'output'));
const EXAMPLES_DIR = resolve(join(import.meta.dirname, '..', '..', 'generative-ui-proto', 'uidl'));
const THEMES_DIR = resolve(join(import.meta.dirname, '..', 'themes'));

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

// ── Load brand themes ────────────────────────────────────────────────

const brands = new Map<string, BrandConfig>();

if (existsSync(THEMES_DIR)) {
  for (const f of readdirSync(THEMES_DIR)) {
    if (!f.endsWith('.json')) continue;
    try {
      const data = JSON.parse(readFileSync(join(THEMES_DIR, f), 'utf-8')) as BrandConfig;
      brands.set(data.name, data);
    } catch { /* skip invalid themes */ }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────

function openInBrowser(filePath: string): void {
  const cmd = process.platform === 'win32' ? `start "" "${filePath}"`
            : process.platform === 'darwin' ? `open "${filePath}"`
            : `xdg-open "${filePath}"`;
  exec(cmd, (err) => {
    if (err) console.error(`No se pudo abrir el navegador: ${err.message}`);
  });
}

function parseSpec(input: string, format: string): UIDLSpec {
  if (format === 'json') {
    const raw = JSON.parse(input);
    // Adapt UIMin JSON format → UIDLSpec
    return {
      version: 1,
      theme: raw.page?.theme || raw.theme || '',
      layout: raw.page?.layout || raw.layout || 'stack',
      title: raw.page?.title || raw.title || '',
      brand: raw.page?.brand || raw.brand,
      sections: raw.sections || [],
    };
  }
  return parseUIDL(input);
}

// ── Server ────────────────────────────────────────────────────────────

const server = new McpServer({
  name: 'mcp-a2tl-web',
  version: '1.0.0',
});

// ── Tool: render_page ─────────────────────────────────────────────────

server.tool(
  'render_page',
  `Render an A2TL-Web spec as a standalone HTML page and open it in the browser.
A2TL-Web is part of the A2TL family (Agent to Transformation Language).

Input: an A2TL-Web spec string (compact text format) or JSON spec.
Output: path to the generated HTML file.

A2TL-Web format example:
  UIDL/1
  theme dark
  brand skillnet
  h1 "My Dashboard"
  metrics 3
    "Users" "1.2k" green
    "Revenue" "$45k" blue
  chart bar "Sales by region"
    x "North" "South" "East"
    y 120 85 95
  table "Details"
    cols Name Score Grade
    row Alice 95 A
    row Bob 82 B

Supported components: h1, h2, h3, text, hr, metrics, chart (bar/line/pie/radar/scatter), table, cards, list, code, collapse.
Brand presets: ${[...brands.keys()].join(', ') || 'default, skillnet'}. Use "brand <name>" in the spec header or pass the brand parameter.`,
  {
    spec: z.string().describe('A2TL-Web or JSON spec string'),
    format: z.enum(['uidl', 'json']).default('uidl').describe('Input format: "uidl" (default, A2TL-Web text format) or "json"'),
    filename: z.string().optional().describe('Output filename (without .html). Defaults to timestamp.'),
    open: z.boolean().default(true).describe('Open in browser after generating'),
    brand: z.string().optional().describe('Brand preset name (e.g. "skillnet"). Overrides spec brand field.'),
  },
  async ({ spec: specInput, format, filename, open: openBrowser, brand: brandOverride }) => {
    try {
      const parsed = parseSpec(specInput, format);
      const brandName = brandOverride || parsed.brand;
      const brandConfig = brandName ? brands.get(brandName) : undefined;
      const html = renderHTML(parsed, brandConfig);

      const name = filename || `page_${Date.now()}`;
      const outPath = join(OUTPUT_DIR, `${name}.html`);
      await writeFile(outPath, html, 'utf-8');

      if (openBrowser) openInBrowser(outPath);

      const uidlTokens = Math.round(specInput.length / 3.5);
      const htmlTokens = Math.round(html.length / 3.5);

      return {
        content: [{
          type: 'text' as const,
          text: [
            `Pagina generada: ${outPath}`,
            `Titulo: ${parsed.title}`,
            `Theme: ${parsed.theme}`,
            `Secciones: ${parsed.sections.length}`,
            `Tokens spec: ~${uidlTokens} | Tokens HTML: ~${htmlTokens} | Ratio: ${(uidlTokens/htmlTokens*100).toFixed(0)}%`,
            openBrowser ? 'Abierta en el navegador.' : '',
          ].filter(Boolean).join('\n'),
        }],
      };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }], isError: true };
    }
  }
);

// ── Tool: list_examples ───────────────────────────────────────────────

server.tool(
  'list_examples',
  'List available A2TL-Web example specs that can be used as reference or rendered.',
  {},
  async () => {
    try {
      const files = await readdir(EXAMPLES_DIR);
      const uidlFiles = files.filter(f => f.endsWith('.uidl'));
      const results: string[] = [];

      for (const f of uidlFiles) {
        const content = await readFile(join(EXAMPLES_DIR, f), 'utf-8');
        const lines = content.split('\n').length;
        const chars = content.length;
        results.push(`${f} (${lines} lineas, ${chars} chars)`);
      }

      return {
        content: [{
          type: 'text' as const,
          text: results.length > 0
            ? `Ejemplos disponibles:\n${results.map(r => `  - ${r}`).join('\n')}\n\nDirectorio: ${EXAMPLES_DIR}`
            : 'No hay ejemplos disponibles.',
        }],
      };
    } catch (e: any) {
      return { content: [{ type: 'text' as const, text: `Error: ${e.message}` }], isError: true };
    }
  }
);

// ── Start ─────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
