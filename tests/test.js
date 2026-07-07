#!/usr/bin/env node
// tests/test.js — UIDL parser + renderer tests (no dependencies)

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseUIDL } from '../tools/parser.js';
import { renderHTML } from '../tools/renderer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const examplesDir = join(__dirname, '..', 'examples');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  PASS  ${message}`);
  } else {
    failed++;
    console.log(`  FAIL  ${message}`);
  }
}

// --- Test 1: Parser basics ---
console.log('\n--- Parser basics ---');

const minimal = `UIDL/1\ntheme dark\nh1 "Hello"`;
const spec = parseUIDL(minimal);
assert(spec.version === 1, 'Parses version');
assert(spec.theme === 'dark', 'Parses theme');
assert(spec.sections.length === 1, 'Parses h1 section');
assert(spec.sections[0].type === 'h1', 'Section type is h1');
assert(spec.sections[0].text === 'Hello', 'Section text is correct');

// --- Test 2: All component types ---
console.log('\n--- Component types ---');

const full = `UIDL/1
theme light

h1 "Title"
h2 "Subtitle"
h3 "Section"
text "A paragraph" highlight
hr

metrics 2
  "Users" "1.2k" green "active"
  "Revenue" "$45k" blue

chart bar "Sales"
  x "Q1" "Q2" "Q3"
  y 120 85 95

chart line "Trend"
  x "Jan" "Feb" "Mar"
  series "A" 10 20 30 green

chart pie "Share"
  "Segment A" 60 blue
  "Segment B" 40 green

table "Data"
  cols Name Score
  row Alice 95
  row Bob 82

cards 2
  card "Card 1" "Sub" "Value"

list "Items"
  - "Item 1"
  - "Item 2"

code javascript
  console.log("hi");

collapse "Details"
  Hidden content here.
`;

const fullSpec = parseUIDL(full);
const types = fullSpec.sections.map(s => s.type);
assert(types.includes('h1'), 'Has h1');
assert(types.includes('h2'), 'Has h2');
assert(types.includes('h3'), 'Has h3');
assert(types.includes('text'), 'Has text');
assert(types.includes('hr'), 'Has hr');
assert(types.includes('metrics'), 'Has metrics');
assert(types.filter(t => t === 'chart').length === 3, 'Has 3 charts');
assert(types.includes('table'), 'Has table');
assert(types.includes('cards'), 'Has cards');
assert(types.includes('list'), 'Has list');
assert(types.includes('code'), 'Has code');
assert(types.includes('collapse'), 'Has collapse');

// Verify metrics parsing
const metricsSection = fullSpec.sections.find(s => s.type === 'metrics');
assert(metricsSection.cols === 2, 'Metrics has 2 columns');
assert(metricsSection.items.length === 2, 'Metrics has 2 items');
assert(metricsSection.items[0].color === 'green', 'Metric color parsed');

// Verify table parsing
const tableSection = fullSpec.sections.find(s => s.type === 'table');
assert(tableSection.columns.length === 2, 'Table has 2 columns');
assert(tableSection.rows.length === 2, 'Table has 2 rows');

// Verify chart parsing
const barChart = fullSpec.sections.find(s => s.type === 'chart' && s.chartType === 'bar');
assert(barChart.x.length === 3, 'Bar chart has 3 x labels');
assert(barChart.series[0].data.length === 3, 'Bar chart has 3 data points');

const pieChart = fullSpec.sections.find(s => s.type === 'chart' && s.chartType === 'pie');
assert(pieChart.pieData.length === 2, 'Pie chart has 2 segments');

// --- Test 3: Renderer output ---
console.log('\n--- Renderer output ---');

const html = renderHTML(fullSpec);
assert(html.includes('<!DOCTYPE html>'), 'HTML has doctype');
assert(html.includes('<html'), 'HTML has html tag');
assert(html.includes('<head>'), 'HTML has head');
assert(html.includes('<body>'), 'HTML has body');
assert(html.includes('chart.js'), 'HTML includes Chart.js CDN');
assert(html.includes('<canvas'), 'HTML has canvas for charts');
assert(html.includes('Title'), 'HTML contains title text');
assert(html.includes('<table'), 'HTML has table element');
assert(html.length > 5000, 'HTML output is substantial');

// Dark theme test
const darkSpec = parseUIDL('UIDL/1\ntheme dark\nh1 "Dark"');
const darkHtml = renderHTML(darkSpec);
assert(darkHtml.includes('#0a0a0b'), 'Dark theme has dark background');

// --- Test 4: All examples parse and render ---
console.log('\n--- Example files ---');

const examples = readdirSync(examplesDir).filter(f => f.endsWith('.uidl'));
assert(examples.length >= 5, `Found ${examples.length} example files`);

const expectedSections = {
  'analytics.uidl': { min: 7, hasChart: true, hasTable: true, hasMetrics: true },
  'project-status.uidl': { min: 8, hasChart: true, hasTable: true, hasMetrics: true },
  'api-health.uidl': { min: 8, hasChart: true, hasTable: true, hasMetrics: true },
  'sales-report.uidl': { min: 10, hasChart: true, hasTable: true, hasMetrics: true },
  'startup-pitch.uidl': { min: 10, hasChart: true, hasTable: true, hasMetrics: true },
};

for (const file of examples) {
  const content = readFileSync(join(examplesDir, file), 'utf-8');

  // Parse without error
  let exSpec;
  try {
    exSpec = parseUIDL(content);
    assert(true, `${file}: parses without error`);
  } catch (e) {
    assert(false, `${file}: parse error — ${e.message}`);
    continue;
  }

  // Check section count
  const expected = expectedSections[file];
  if (expected) {
    assert(exSpec.sections.length >= expected.min,
      `${file}: has ${exSpec.sections.length} sections (>= ${expected.min})`);

    const exTypes = exSpec.sections.map(s => s.type);
    if (expected.hasChart) assert(exTypes.includes('chart'), `${file}: has chart`);
    if (expected.hasTable) assert(exTypes.includes('table'), `${file}: has table`);
    if (expected.hasMetrics) assert(exTypes.includes('metrics'), `${file}: has metrics`);
  }

  // Render without error
  let exHtml;
  try {
    exHtml = renderHTML(exSpec);
    assert(true, `${file}: renders without error`);
  } catch (e) {
    assert(false, `${file}: render error — ${e.message}`);
    continue;
  }

  // Validate output
  assert(exHtml.includes('<!DOCTYPE html>'), `${file}: valid HTML doctype`);
  assert(exHtml.length > 5000, `${file}: output is substantial (${exHtml.length} bytes)`);

  // Token savings check
  const uidlTokens = Math.round(content.length / 3.5);
  const htmlTokens = Math.round(exHtml.length / 3.5);
  const savings = ((1 - uidlTokens / htmlTokens) * 100).toFixed(0);
  assert(parseInt(savings) > 70, `${file}: ${savings}% token savings (> 70%)`);
}

// --- Test 5: Edge cases ---
console.log('\n--- Edge cases ---');

// Empty input
const emptySpec = parseUIDL('');
assert(emptySpec.sections.length === 0, 'Empty input returns no sections');
assert(emptySpec.theme === 'light', 'Empty input defaults to light theme');

// Only header line
const headerOnly = parseUIDL('UIDL/1');
assert(headerOnly.version === 1, 'Header-only input parses version');
assert(headerOnly.sections.length === 0, 'Header-only input has no sections');

// Comments are skipped
const withComments = parseUIDL('UIDL/1\n// this is a comment\nh1 "Test"');
assert(withComments.sections.length === 1, 'Comments are skipped');

// --- Summary ---
console.log(`\n${'='.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`${'='.repeat(40)}\n`);

process.exit(failed > 0 ? 1 : 0);
