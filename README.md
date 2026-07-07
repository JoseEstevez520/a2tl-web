<p align="center">
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
</p>

---

When an LLM generates a dashboard, it writes thousands of tokens of HTML, CSS, and JavaScript. Most of that is boilerplate. UIDL captures the same page in a compact spec that a local renderer expands to HTML instantly.

```
AI writes UIDL (~340 tok)  →  renderer (ms)  →  standalone HTML page
```

<br>

## How it compares

|            | Markdown | UIDL   | Raw HTML |
|------------|----------|--------|----------|
| Tokens     | ~340     | ~340   | ~3,050   |
| Output     | Plain text | Interactive page | Interactive page |

UIDL and Markdown cost roughly the same tokens. The difference is what you get: plain text vs a styled page with Chart.js charts, metric cards, and responsive layout.

We ran 11 adversarial tests to find where each format wins:

| Content type | UIDL vs Markdown | What UIDL adds |
|---|---|---|
| Dashboards & metrics | **11% smaller** | Charts, KPI cards, colored themes |
| Data tables | **11% smaller** | Styled tables, hover effects |
| Mixed (text + data) | **~2% larger** | Charts for the data portions |
| Prose-heavy reports | **~2% larger** | Styled headings, insight blocks |
| Code documentation | **6% larger** | Syntax-highlighted blocks |
| Meeting notes & lists | **19% larger** | Styled cards and layout |

UIDL is built for data-rich pages. For pure prose or code, Markdown is more compact. Full test data in [`adversarial/`](adversarial/).

<br>

## Quick start

```bash
git clone https://github.com/JoseEstevez520/uidl.git
cd uidl
node tools/generate.js examples/analytics.uidl output/analytics.html
```

<br>

## Example

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

## More examples

| File | What it generates | Savings vs HTML |
|---|---|---|
| `analytics.uidl` | SaaS dashboard — users, revenue, traffic | 90% |
| `project-status.uidl` | Sprint review — burndown, blockers, team | 90% |
| `api-health.uidl` | API monitoring — latency, errors, incidents | 87% |
| `sales-report.uidl` | Monthly sales — regions, products, trends | 89% |
| `startup-pitch.uidl` | Investor update — MRR, cohorts, runway | 88% |

<br>

## Components

| Component | Syntax | Example |
|---|---|---|
| Headings | `h1 "Text"` | `h1 "Dashboard"` |
| Text | `text "..." style` | `text "Note" highlight` |
| Metrics | `metrics N` | KPI cards with color and subtitle |
| Charts | `chart bar\|line\|pie` | `chart bar "Revenue"` + `x` + `y` |
| Tables | `table "Title"` | `cols` + `row` per line |
| Cards | `cards N` | `card "Title" "Sub" "Value"` |
| Lists | `list "Title"` | `- "Item"` per line |
| Code | `code lang` | Indented lines |
| Separator | `hr` | Horizontal rule |

Text styles: `dim` (muted), `highlight` (alert), `insight` (info).

<br>

## 3 ways to use

**CLI** — generate HTML from a spec file:
```bash
node tools/generate.js input.uidl output.html
```

**MCP Server** — let your AI agent call `render_page` directly:
```bash
cd tools/mcp && npm install && npm run build
claude mcp add uidl -- node /path/to/uidl/tools/mcp/dist/index.js
```

**Agent skill** — teach any AI the format by copying `skill/uidl.md` into your prompt system.

<br>

## Format rules

1. First line: `UIDL/1`
2. Components at column 0, sub-items indented 2 spaces
3. Strings with spaces go in double quotes
4. Colors by name (`red`, `green`, `blue`) or hex (`#4f46e5`)
5. Empty lines close blocks
6. Comments with `//`

<br>

## Repo structure

```
uidl/
├── skill/           Teach any AI agent the format
│   └── uidl.md
├── tools/           Parse and render
│   ├── parser.js
│   ├── renderer.js
│   ├── generate.js
│   └── mcp/         MCP server (TypeScript)
├── examples/        Sample .uidl specs
├── bench/           Token comparison data
├── adversarial/     Adversarial test cases (UIDL vs Markdown)
└── tests/           Test suite (86 tests)
```

<br>

## Testing

```bash
npm test
```

86 tests covering parser, renderer, all examples, and edge cases.

<br>

---

<p align="center">
  Built during research on token-efficient UI generation for AI agents.<br>
  MIT License.
</p>
