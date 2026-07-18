# A2TL-Web

**AI agent writes a compact spec. Renderer builds a full HTML page. 76% fewer tokens than raw HTML.**

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](tools/mcp/)
[![Tests](https://img.shields.io/badge/tests-86%20passing-brightgreen.svg)](tests/)

```
UIDL/1
theme dark

h1 "Q3 Revenue"
metrics 2
  "MRR" "$84.5k" green "+12%"
  "Churn" "2.1%" red "-0.4pp"
chart line "Growth"
  x "Apr" "May" "Jun" "Jul"
  series "Revenue" 62 71 78 84 blue
```

360 tokens. Renders to a standalone HTML page with charts, metrics, and theming -- the HTML equivalent takes ~1,471 tokens.

---

## Why A2TL-Web

| | A2TL-Web | Raw HTML |
|---|---|---|
| **Tokens (dashboard)** | ~360 | ~1,471 |
| **Savings** | **76%** | baseline |
| **Output** | Standalone HTML page | Standalone HTML page |
| **Charts, cards, themes** | Built in | Manual CSS/JS |

The agent describes *what* to show. The renderer decides *how*.

---

## Quick start

```bash
npx a2tl-web render examples/analytics.uidl -o output/analytics.html
```

Or clone and run directly:

```bash
git clone https://github.com/JoseEstevez520/a2tl-web.git
cd a2tl-web
node tools/generate.js examples/analytics.uidl output/analytics.html
```

---

## Three ways to use

**CLI** -- generate HTML from a spec:
```bash
a2tl-web render input.uidl -o output.html
```

**MCP Server** -- AI agents call `render_page` directly:
```bash
cd tools/mcp && npm install && npm run build
claude mcp add a2tl-web -- node /path/to/tools/mcp/dist/index.js
```

**Agent skill** -- copy [`skill/uidl.md`](skill/uidl.md) into your prompt system. The agent learns the format natively.

---

## Components

Format identifier: `UIDL/1`

| Component | Syntax | Notes |
|---|---|---|
| Headings | `h1`, `h2`, `h3` | `h1 "Dashboard"` |
| Text | `text "..." style` | Styles: `dim`, `highlight`, `insight` |
| Metrics | `metrics N` | KPI cards with value, color, subtitle |
| Chart | `chart line\|bar\|pie "Title"` | Series data with colors |
| Table | `table "Title"` | `cols` + `row` per line |
| Cards | `cards N` | Grouped content cards |
| List | `list "Title"` | `- "Item"` per line |
| Code | `code lang` | Syntax-highlighted block |
| Collapse | `collapse "Title"` | Expandable section |
| Separator | `hr` | Horizontal rule |

Full spec and examples: [`docs/extending.md`](docs/extending.md)

---

## Brand and theming (v1.2.0)

Branding lives in a JSON preset -- the agent never generates CSS.

```
UIDL/1
theme dark
brand skillnet
```

```bash
a2tl-web render input.uidl --brand skillnet
```

Built-in presets:

| Preset | Base | Accent | Font |
|---|---|---|---|
| `default` | dark | `#818cf8` | Inter |
| `skillnet` | dark | `#6366f1` | Plus Jakarta Sans |

Custom themes go in `tools/mcp/themes/`. See [`docs/extending.md`](docs/extending.md).

---

## Format rules

1. First line: `UIDL/1`
2. Components at column 0, sub-items indented 2 spaces
3. Strings with spaces in double quotes
4. Colors by name (`red`, `green`, `blue`) or hex (`#4f46e5`)
5. Empty lines close blocks
6. Comments with `//`

---

## Project structure

```
a2tl-web/
  skill/        Agent prompt for learning the format
  tools/        Parser, renderer, CLI, MCP server, themes
  examples/     Sample .uidl specs
  tests/        86 tests
  docs/         Extending and full spec
```

```bash
npm test
```

---

## A2TL family

Part of **A2TL** (Agent to Transformation Language) -- compact formats where AI agents describe intent and renderers handle output.

| Project | What it does |
|---|---|
| **a2tl-web** (this repo) | Web pages from compact specs |
| **a2tl-video** | Videos from compact specs |

---

MIT License
