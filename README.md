<h1 align="center">uidl</h1>
<p align="center">
  <strong>A compact format for AI-generated web pages.</strong><br>
  <em>Same cost as Markdown. But you get charts, cards, and styling.</em>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/89%25_fewer_tokens_than_HTML-orange?style=flat-square" alt="vs HTML">
  <img src="https://img.shields.io/badge/MCP_compatible-blue?style=flat-square" alt="MCP">
  <img src="https://img.shields.io/badge/zero_dependencies-brightgreen?style=flat-square" alt="Zero deps">
  <img src="https://img.shields.io/badge/MIT-green?style=flat-square" alt="License">
</p>

<br>

When an LLM generates a dashboard, it writes thousands of tokens of HTML, CSS, and JS. Most of it is boilerplate. UIDL captures the same page in a compact spec that a local renderer expands instantly.

```
AI writes UIDL (~340 tok)  →  renderer (ms)  →  standalone HTML page
```

<br>

<h2>How it compares</h2>

<table width="100%">
<tr>
<th width="34%"></th>
<th width="22%">Markdown</th>
<th width="22%">UIDL</th>
<th width="22%">Raw HTML</th>
</tr>
<tr>
<td><strong>Tokens</strong></td>
<td>~340</td>
<td>~340</td>
<td>~3,050</td>
</tr>
<tr>
<td><strong>Output</strong></td>
<td>Plain text</td>
<td>Interactive page</td>
<td>Interactive page</td>
</tr>
</table>

<br>

UIDL and Markdown cost roughly the same. The difference is what you get.

We ran 11 adversarial tests to find where each format wins:

<table width="100%">
<tr>
<th width="40%">Content type</th>
<th width="30%">UIDL vs Markdown</th>
<th width="30%">What UIDL adds</th>
</tr>
<tr><td>Dashboards & metrics</td><td><strong>11% smaller</strong></td><td>Charts, KPI cards, themes</td></tr>
<tr><td>Data tables</td><td><strong>11% smaller</strong></td><td>Styled tables, hover</td></tr>
<tr><td>Mixed (text + data)</td><td>~2% larger</td><td>Charts for data portions</td></tr>
<tr><td>Prose-heavy reports</td><td>~2% larger</td><td>Styled blocks, headings</td></tr>
<tr><td>Code documentation</td><td>6% larger</td><td>Syntax blocks</td></tr>
<tr><td>Meeting notes & lists</td><td>19% larger</td><td>Cards, layout</td></tr>
</table>

<br>

UIDL is built for data-rich pages. For pure prose or code, Markdown is more compact. Full test data in [`adversarial/`](adversarial/).

<br>

<h2>Quick start</h2>

```bash
git clone https://github.com/JoseEstevez520/uidl.git
cd uidl
node tools/generate.js examples/analytics.uidl output/analytics.html
```

<br>

<h2>Example</h2>

```
UIDL/1
theme dark

h1 "Analytics Dashboard"
text "Monthly overview — July 2026" dim

metrics 4
  "Active Users" "12.4k" green "+8.2% MoM"
  "MRR" "$84.5k" blue "+12.3% MoM"
  "Churn Rate" "2.1%" red "-0.4pp"
  "Avg Session" "6m 32s" cyan "+18s"

chart line "User Growth"
  x "Jan" "Feb" "Mar" "Apr" "May" "Jun" "Jul"
  series "Active" 8200 8900 9400 10100 10800 11500 12400 green
  series "New" 1200 1400 1100 1500 1300 1600 1800 blue

chart pie "Traffic Sources"
  "Organic" 42 green
  "Direct" 28 blue
  "Referral" 18 purple
  "Social" 12 orange
```

~296 tokens. Produces a standalone HTML page with charts, metrics, and dark theme.

<br>

<h2>More examples</h2>

<table width="100%">
<tr>
<th width="30%">File</th>
<th width="50%">What it generates</th>
<th width="20%">Savings vs HTML</th>
</tr>
<tr><td><code>analytics.uidl</code></td><td>SaaS dashboard — users, revenue, traffic</td><td>90%</td></tr>
<tr><td><code>project-status.uidl</code></td><td>Sprint review — burndown, blockers, team</td><td>90%</td></tr>
<tr><td><code>api-health.uidl</code></td><td>API monitoring — latency, errors, incidents</td><td>87%</td></tr>
<tr><td><code>sales-report.uidl</code></td><td>Monthly sales — regions, products, trends</td><td>89%</td></tr>
<tr><td><code>startup-pitch.uidl</code></td><td>Investor update — MRR, cohorts, runway</td><td>88%</td></tr>
</table>

<br>

<h2>Components</h2>

<table width="100%">
<tr><th width="20%">Component</th><th width="35%">Syntax</th><th width="45%">Example</th></tr>
<tr><td>Headings</td><td><code>h1 "Text"</code></td><td><code>h1 "Dashboard"</code></td></tr>
<tr><td>Text</td><td><code>text "..." style</code></td><td><code>text "Alert" highlight</code></td></tr>
<tr><td>Metrics</td><td><code>metrics N</code></td><td><code>"Users" "1.2k" green "active"</code></td></tr>
<tr><td>Charts</td><td><code>chart bar|line|pie</code></td><td><code>chart bar "Revenue"</code> + <code>x</code> + <code>y</code></td></tr>
<tr><td>Tables</td><td><code>table "Title"</code></td><td><code>cols</code> + <code>row</code> per line</td></tr>
<tr><td>Cards</td><td><code>cards N</code></td><td><code>card "Title" "Sub" "Value"</code></td></tr>
<tr><td>Lists</td><td><code>list "Title"</code></td><td><code>- "Item"</code> per line</td></tr>
<tr><td>Code</td><td><code>code lang</code></td><td>Indented lines below</td></tr>
<tr><td>Separator</td><td><code>hr</code></td><td>Horizontal rule</td></tr>
</table>

<p>Text styles: <code>dim</code> (muted) · <code>highlight</code> (alert) · <code>insight</code> (info)</p>

<br>

<h2>Brand / Theming</h2>

UIDL specs look the same regardless of who uses them. Branding lives in a JSON preset that the renderer applies — the LLM never generates CSS.

Add `brand <name>` to your spec header:

```
UIDL/1
theme dark
brand skillnet

h1 "Training Dashboard"
```

Create a theme file in `tools/mcp/themes/`:

```json
{
  "name": "skillnet",
  "base": "dark",
  "colors": {
    "accent": "#6366f1",
    "accent-2": "#22d3ee",
    "success": "#10b981"
  },
  "font": "Plus Jakarta Sans",
  "radius": "10px",
  "footer": "Generado con SkillNet"
}
```

That's it. The renderer swaps colors, font, and footer. No build step, no dependencies. If no brand is specified, everything works exactly as before.

**Built-in presets:**

| Preset | Base | Accent | Font |
|--------|------|--------|------|
| `default` | dark | `#818cf8` (indigo) | Inter |
| `skillnet` | dark | `#6366f1` / `#22d3ee` | Plus Jakarta Sans |

**CLI:** `node tools/mcp/dist/cli.js render input.uidl --brand skillnet`

**MCP:** `render_page(spec: "...", brand: "skillnet")`

<br>

<h2>Extending: custom components</h2>

UIDL ships with 10 components. If you need more, add your own -- it's ~15 lines of code.

See [docs/extending.md](docs/extending.md) for a step-by-step guide.

The format stays compact. The renderer is where customization lives.

<br>

<h2>3 ways to use</h2>

**CLI** — generate HTML from a spec:
```bash
node tools/generate.js input.uidl output.html
```

**MCP Server** — let your AI agent call `render_page` directly:
```bash
cd tools/mcp && npm install && npm run build
claude mcp add uidl -- node /path/to/uidl/tools/mcp/dist/index.js
```

**Agent skill** — copy [`skill/uidl.md`](skill/uidl.md) into your prompt system. The agent learns the format natively.

<br>

<h2>Format rules</h2>

1. First line: `UIDL/1`
2. Components at column 0, sub-items indented 2 spaces
3. Strings with spaces in double quotes
4. Colors by name (`red`, `green`, `blue`) or hex (`#4f46e5`)
5. Empty lines close blocks · Comments with `//`

<br>

<h2>Project structure</h2>

```
uidl/
├── skill/           Teach any AI agent the format
├── tools/           Parser, renderer, CLI, MCP server + themes/
├── examples/        Sample .uidl specs
├── bench/           Token comparison data
├── adversarial/     UIDL vs Markdown test cases
└── tests/           86 tests
```

```bash
npm test    # run all tests
```

<br>

---

<p align="center">
  Built during research on token-efficient UI generation for AI agents.<br>
  MIT License
</p>
