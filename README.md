<p align="center">
  <h1 align="center">uidl</h1>
  <p align="center">
    <strong>Compact DSL for AI-generated web pages. 11% fewer tokens than Markdown, 89% fewer than HTML.</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/tokens-89%25_vs_HTML-orange?style=flat-square" alt="Token savings">
    <img src="https://img.shields.io/badge/MCP-compatible-blue?style=flat-square" alt="MCP">
    <img src="https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square" alt="Zero deps">
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
  </p>
</p>

---

The AI writes **what** to show. The renderer handles **how**. Zero tokens wasted on CSS, HTML boilerplate, or JS.

```
AI generates UIDL (~343 tok)  →  Local renderer (ms)  →  Standalone HTML page
```

### Same data, three formats, measured (average across 5 examples)

|            | Markdown | UIDL   | Raw HTML |
|------------|----------|--------|----------|
| Bytes      | 1,349    | 1,199  | 10,688   |
| Tokens (~) | ~385     | ~343   | ~3,054   |
| Output     | Plain text | Styled page with charts | Styled page with charts |

UIDL uses **11% fewer tokens than Markdown** and produces a full interactive page with Chart.js charts, metric cards, and responsive styling. Same data, same LLM. See [`bench/RESULTS.md`](bench/RESULTS.md) for the full breakdown.

## Why this matters

LLMs already generate dashboards, reports, and data pages. The bottleneck is cost and speed — every page costs thousands of tokens in HTML/CSS/JS boilerplate. At scale, that's slow and expensive.

UIDL separates content from presentation. The AI emits a compact spec. A local renderer expands it to full HTML with Chart.js charts, responsive tables, and styled components. The spec is small enough to stream in real time, and the renderer is deterministic.

## Quick start

```bash
# Clone and generate a page
git clone https://github.com/JoseEstevez520/uidl.git
cd uidl
node tools/generate.js examples/analytics.uidl output/analytics.html

# Or use the CLI
node tools/cli.js render examples/analytics.uidl
```

## Example

```
UIDL/1
theme dark

h1 "SaaS Analytics Dashboard"
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
  "Organic Search" 42 green
  "Direct" 28 blue
  "Referral" 18 purple
  "Social" 12 orange
```

~296 tokens. Generates a standalone HTML page with Chart.js charts, responsive metrics cards, and dark theme styling.

## Examples

| Example | Description | UIDL tokens | HTML tokens | Savings |
|---|---|---|---|---|
| `analytics.uidl` | SaaS analytics dashboard with users, revenue, traffic | ~296 | ~2,963 | 90% |
| `project-status.uidl` | Sprint review with burndown, blockers, team board | ~283 | ~2,931 | 90% |
| `api-health.uidl` | API monitoring with latency, errors, incidents | ~396 | ~3,095 | 87% |
| `sales-report.uidl` | Monthly sales by region, product, and team | ~333 | ~3,060 | 89% |
| `startup-pitch.uidl` | Investor update with MRR, cohorts, unit economics | ~397 | ~3,208 | 88% |

Generate any example:
```bash
node tools/generate.js examples/sales-report.uidl output/sales-report.html
```

## Preview

Each example generates a fully styled HTML page. Here's what the output includes:

- **analytics.uidl** — Dark theme. 4 metric cards (users, MRR, churn, session time), line chart for user growth, bar chart for revenue by plan, pie chart for traffic sources, table with top pages.
- **project-status.uidl** — Light theme. Sprint metrics, milestone progress bars, team workload table, burndown line chart, blockers list, deadline cards.
- **api-health.uidl** — Dark theme. Uptime/latency/error metrics, response time line chart (P50/P95/P99), endpoint bar chart, error breakdown pie chart, incident table.
- **sales-report.uidl** — Light theme. Revenue metrics, regional bar chart, year-over-year trend lines, product performance table, revenue share pie chart.
- **startup-pitch.uidl** — Dark theme. MRR/ARR/runway metrics, growth line chart, unit economics cards, cohort retention table, revenue segmentation pie chart.

## Components

| Component | Syntax |
|---|---|
| `h1` `h2` `h3` | `h1 "Text"` |
| `text` | `text "..." highlight\|insight\|dim` |
| `metrics N` | `"label" "value" color "note"` |
| `chart bar\|line\|pie\|radar\|scatter` | `x` + `y` or `series` |
| `table` | `cols` + `row` |
| `cards N` | `card "title" "sub" "value"` |
| `list` | `- "item"` |
| `code` | `code lang` + indented lines |
| `collapse` | indented content |
| `hr` | `hr` |

## 3 ways to use

### CLI

```bash
node tools/generate.js input.uidl output.html
# or
node tools/cli.js render input.uidl
```

### MCP Server

```bash
cd tools/mcp && npm install && npm run build
claude mcp add uidl -- node /path/to/uidl/tools/mcp/dist/index.js
```

### Agent skill

Copy `skill/uidl.md` into your prompt system. The agent learns the format natively.

## Format rules

1. First line: `UIDL/1`
2. Components at column 0, properties indented 2 spaces
3. Strings with spaces in double quotes
4. Colors by name (`red`, `green`, `blue`) or hex (`#4f46e5`)
5. Empty lines close blocks
6. Comments with `//`

## Repo structure

```
uidl/
├── tools/           # Parse and render
│   ├── parser.js    # UIDL text → JSON spec
│   ├── renderer.js  # JSON spec → standalone HTML
│   ├── generate.js  # CLI: file → file
│   ├── cli.js       # CLI with browser open
│   └── mcp/         # MCP server
├── skill/           # Teach any AI agent the format
│   └── uidl.md
├── examples/        # Sample .uidl specs
├── tests/           # Test suite
└── README.md
```

## Testing

```bash
npm test
```

Runs parser and renderer against all examples. Verifies parsing, rendering, HTML structure, and token savings.

## Origin

Built during research on token-efficient UI generation for AI agents.

## License

MIT
