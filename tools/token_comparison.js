#!/usr/bin/env node
// token_comparison.js — Compara tokens entre HTML directo, JSON spec y UIDL
// Estimacion: ~1 token por cada 3.5 chars para code/structured, ~4 para texto

const fs = require('fs');
const { parseUIDL } = require('./parser');
const { renderHTML } = require('./renderer');

// Estimador de tokens simple (basado en cl100k_base heuristics)
function estimateTokens(text) {
  // Count whitespace-separated tokens
  const words = text.split(/\s+/).filter(w => w.length > 0);
  // For code/structured: roughly 1 token per 3.5 chars
  const byChars = Math.round(text.length / 3.5);
  // Words + extra for punctuation
  const punct = (text.match(/[{}\[\]:,;"'<>\/=()]/g) || []).length;
  const byWords = words.length + Math.round(punct * 0.5);
  // Average both estimates
  return Math.round((byChars + byWords) / 2);
}

// El mismo dashboard en HTML+CSS+JS directo (lo que una IA generaria como Artifact)
const htmlDirect = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard ANFAIA</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; background: #0f0f0f; color: #e5e5e5; padding: 2rem; max-width: 960px; margin: 0 auto; }
h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
.subtitle { color: #a3a3a3; margin-bottom: 1.5rem; }
.metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin: 1rem 0; }
.metric { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 4px; padding: 1rem; }
.metric-label { font-size: 0.8rem; color: #a3a3a3; text-transform: uppercase; letter-spacing: 0.04em; }
.metric-value { font-size: 1.5rem; font-weight: 700; margin: 0.25rem 0; }
.metric-note { font-size: 0.75rem; color: #a3a3a3; }
.highlight { background: #1e1b4b; border-left: 3px solid #c7d2fe; padding: 0.75rem 1rem; margin: 1rem 0; border-radius: 0 4px 4px 0; }
.insight { background: #1e1b4b; border-left: 3px solid #818cf8; padding: 0.75rem 1rem; margin: 1rem 0; border-radius: 0 4px 4px 0; }
.chart-wrap { margin: 1.25rem 0; }
.chart-wrap h3 { margin-bottom: 0.5rem; font-size: 1.05rem; }
table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.875rem; }
th { text-align: left; padding: 0.5rem; border-bottom: 2px solid #2a2a2a; font-size: 0.75rem; text-transform: uppercase; color: #a3a3a3; }
td { padding: 0.5rem; border-bottom: 1px solid #2a2a2a; }
tr:hover td { background: #222; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin: 1rem 0; }
.card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 4px; padding: 1rem; }
.card-title { font-weight: 600; }
.card-sub { font-size: 0.8rem; color: #a3a3a3; }
.card-value { font-size: 0.85rem; color: #818cf8; margin-top: 0.25rem; }
</style>
</head>
<body>
<h1>Dashboard ANFAIA — Fronteras Semanticas</h1>
<p class="subtitle">Benchmark de clasificacion de acceso. Julio 2026.</p>

<div class="metrics">
  <div class="metric"><div class="metric-label">LODO</div><div class="metric-value" style="color:#d97706">78.2%</div><div class="metric-note">techo intrinseco</div></div>
  <div class="metric"><div class="metric-label">Holdout</div><div class="metric-value" style="color:#059669">90.0%</div><div class="metric-note">160 docs nuevos</div></div>
  <div class="metric"><div class="metric-label">Intra-subject</div><div class="metric-value" style="color:#0891b2">93.2%</div><div class="metric-note">5-fold CV</div></div>
  <div class="metric"><div class="metric-label">GER+PII</div><div class="metric-value" style="color:#7c3aed">1.2%</div><div class="metric-note">vs 2.5% sin PII</div></div>
  <div class="metric"><div class="metric-label">Few-shot K=5</div><div class="metric-value" style="color:#059669">80.1%</div><div class="metric-note">rompe el 78%</div></div>
  <div class="metric"><div class="metric-label">Experimentos</div><div class="metric-value" style="color:#ca8a04">36+</div><div class="metric-note">sesion completa</div></div>
</div>

<div class="highlight">La funcion contenido-acceso NO es inyectiva. 78.2% es el techo intrinseco del LODO. Pero 5 ejemplos etiquetados del dominio nuevo lo rompen.</div>

<div class="chart-wrap">
  <h3>LODO por dominio (%)</h3>
  <canvas id="chart1"></canvas>
</div>

<div class="chart-wrap">
  <h3>Few-shot: accuracy vs ejemplos etiquetados</h3>
  <canvas id="chart2"></canvas>
</div>

<div>
  <h3>Errores graves del holdout</h3>
  <table>
    <thead><tr><th>Dominio</th><th>Tipo</th><th>True</th><th>Pred</th><th>Severidad</th></tr></thead>
    <tbody>
      <tr><td>Restauracion</td><td>Certificado formacion</td><td>REST</td><td>PUB</td><td>3</td></tr>
      <tr><td>Restauracion</td><td>Anexo contractual</td><td>REST</td><td>PUB</td><td>3</td></tr>
      <tr><td>Finanzas</td><td>Due diligence</td><td>CONF</td><td>PUB</td><td>2</td></tr>
      <tr><td>Finanzas</td><td>Estrategia precios</td><td>CONF</td><td>PUB</td><td>2</td></tr>
    </tbody>
  </table>
</div>

<div class="insight">14/16 errores son under-classification. PII floor rules reducen GER a la mitad.</div>

<div class="cards">
  <div class="card"><div class="card-title">Mejor modelo</div><div class="card-sub">Intra-subject</div><div class="card-value">93% accuracy</div></div>
  <div class="card"><div class="card-title">Dataset</div><div class="card-sub">PhysioNet CHB-MIT</div><div class="card-value">23 pacientes</div></div>
  <div class="card"><div class="card-title">Framework</div><div class="card-sub">PyTorch + LoRA</div><div class="card-value">Fine-tuning 4-bit</div></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  new Chart(document.getElementById('chart1'), {
    type: 'bar',
    data: {
      labels: ['Legal','Restauracion','Clinica','RRHH','Educacion','Finanzas','Admin','Tecnologia'],
      datasets: [{ data: [90.6,85,81.2,75.6,75.6,75.6,71.9,70], backgroundColor: '#4f46e5cc', borderColor: '#4f46e5', borderWidth: 1, borderRadius: 2 }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#a3a3a3' } }, y: { grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { color: '#a3a3a3' }, beginAtZero: true } } }
  });
  new Chart(document.getElementById('chart2'), {
    type: 'line',
    data: {
      labels: ['0','3','5','10','20','40','160'],
      datasets: [
        { label: 'Accuracy', data: [78.2,79.1,80.1,81.3,82.8,86.7,90.0], borderColor: '#059669', backgroundColor: '#05966922', tension: 0.3, pointRadius: 3, fill: true },
        { label: 'F1-score', data: [75.0,76.1,77.2,78.5,80.0,84.0,88.0], borderColor: '#4f46e5', backgroundColor: '#4f46e522', tension: 0.3, pointRadius: 3, fill: false }
      ]
    },
    options: { responsive: true, plugins: { legend: { labels: { color: '#a3a3a3' } } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { color: '#a3a3a3' } }, y: { grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { color: '#a3a3a3' } } } }
  });
});
</script>
</body>
</html>`;

// JSON spec (UIMin format)
const jsonSpec = JSON.stringify({
  page: { title: "Dashboard ANFAIA — Fronteras Semanticas", subtitle: "Benchmark de clasificacion de acceso. Julio 2026.", theme: "dark" },
  sections: [
    { type: "metrics", items: [
      { label: "LODO", value: "78.2%", color: "orange", note: "techo intrinseco" },
      { label: "Holdout", value: "90.0%", color: "green", note: "160 docs nuevos" },
      { label: "Intra-subject", value: "93.2%", color: "cyan", note: "5-fold CV" },
      { label: "GER+PII", value: "1.2%", color: "purple", note: "vs 2.5% sin PII" },
      { label: "Few-shot K=5", value: "80.1%", color: "green", note: "rompe el 78%" },
      { label: "Experimentos", value: "36+", color: "yellow", note: "sesion completa" }
    ]},
    { type: "text", content: "La funcion contenido-acceso NO es inyectiva. 78.2% es el techo intrinseco del LODO. Pero 5 ejemplos etiquetados del dominio nuevo lo rompen.", style: "highlight" },
    { type: "bar", title: "LODO por dominio (%)", data: { legal: 90.6, restauracion: 85, clinica: 81.2, rrhh: 75.6, educacion: 75.6, finanzas: 75.6, admin: 71.9, tecnologia: 70 } },
    { type: "line", title: "Few-shot: accuracy vs ejemplos etiquetados", x: [0,3,5,10,20,40,160], series: [
      { name: "Accuracy", data: [78.2,79.1,80.1,81.3,82.8,86.7,90.0], color: "green" },
      { name: "F1-score", data: [75.0,76.1,77.2,78.5,80.0,84.0,88.0], color: "blue" }
    ]},
    { type: "table", title: "Errores graves del holdout", columns: ["Dominio","Tipo","True","Pred","Severidad"], rows: [
      ["Restauracion","Certificado formacion","REST","PUB",3],
      ["Restauracion","Anexo contractual","REST","PUB",3],
      ["Finanzas","Due diligence","CONF","PUB",2],
      ["Finanzas","Estrategia precios","CONF","PUB",2]
    ]},
    { type: "text", content: "14/16 errores son under-classification. PII floor rules reducen GER a la mitad.", style: "insight" },
    { type: "cards", items: [
      { title: "Mejor modelo", subtitle: "Intra-subject", value: "93% accuracy" },
      { title: "Dataset", subtitle: "PhysioNet CHB-MIT", value: "23 pacientes" },
      { title: "Framework", subtitle: "PyTorch + LoRA", value: "Fine-tuning 4-bit" }
    ]}
  ]
}, null, 2);

// UIDL format
const uidlText = fs.readFileSync('examples/dashboard_anfaia.uidl', 'utf-8');

// Generated HTML (from UIDL → renderer)
const spec = parseUIDL(uidlText);
const generatedHtml = renderHTML(spec);

// --- Measurements ---
function analyze(name, text) {
  const chars = text.length;
  const lines = text.split('\n').length;
  const tokens = estimateTokens(text);
  return { name, chars, lines, tokens };
}

const results = [
  analyze('HTML+CSS+JS directo', htmlDirect),
  analyze('JSON spec (UIMin)', jsonSpec),
  analyze('UIDL spec', uidlText),
  analyze('HTML generado (por renderer)', generatedHtml)
];

console.log('=== COMPARATIVA DE TOKENS ===');
console.log('Mismo dashboard ANFAIA en diferentes formatos');
console.log('');
console.log('Formato                    | Chars  | Lineas | Tokens (est.) | Ratio vs HTML');
console.log('---------------------------|--------|--------|---------------|-------------');

const baseTokens = results[0].tokens;
for (const r of results) {
  const ratio = (r.tokens / baseTokens * 100).toFixed(1) + '%';
  const saving = r.tokens < baseTokens ? ` (-${(100 - r.tokens/baseTokens*100).toFixed(0)}%)` : '';
  console.log(
    `${r.name.padEnd(27)}| ${String(r.chars).padStart(6)} | ${String(r.lines).padStart(6)} | ${String(r.tokens).padStart(13)} | ${ratio}${saving}`
  );
}

console.log('');
console.log('--- LO QUE GENERA LA IA (output tokens) ---');
console.log(`HTML directo:  ~${results[0].tokens} tokens (lo que Claude genera como Artifact)`);
console.log(`JSON spec:     ~${results[1].tokens} tokens (${(results[1].tokens/results[0].tokens*100).toFixed(0)}% del HTML)`);
console.log(`UIDL spec:     ~${results[2].tokens} tokens (${(results[2].tokens/results[0].tokens*100).toFixed(0)}% del HTML)`);
console.log('');
console.log(`Ahorro UIDL vs HTML directo: ${(100 - results[2].tokens/results[0].tokens*100).toFixed(0)}%`);
console.log(`Ahorro UIDL vs JSON spec:    ${(100 - results[2].tokens/results[1].tokens*100).toFixed(0)}%`);
