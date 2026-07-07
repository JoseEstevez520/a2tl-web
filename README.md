<p align="center">
  <h1 align="center">uidl</h1>
  <p align="center">
    <strong>Compact DSL for AI-generated web pages. 4x fewer tokens than raw HTML.</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/tokens-75%25_savings-orange?style=flat-square" alt="Token savings">
    <img src="https://img.shields.io/badge/MCP-compatible-blue?style=flat-square" alt="MCP">
    <img src="https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square" alt="Zero deps">
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
  </p>
</p>

---

The AI writes **what** to show. The renderer handles **how**. Zero tokens on CSS, HTML, or JS.

```
AI generates UIDL (~450 tok)  →  Local renderer (ms)  →  Standalone HTML
```

### Same page, measured

```
┌────────────┬──────────────┬────────┐
│            │ Raw HTML     │ UIDL   │
├────────────┼──────────────┼────────┤
│ Bytes      │ 6,160        │ 1,541  │
│ Lines      │ 83           │ 43     │
│ Tokens (~) │ ~1,760       │ ~440   │
│ Ratio      │ 100%         │ 25%    │
└────────────┴──────────────┴────────┘
```

Same dashboard, same charts, same data. Same LLM generating both.

## Why this matters

LLMs already generate dashboards, reports, and personalized pages. The bottleneck is cost and speed. Every page costs ~1,760 tokens of HTML boilerplate. At scale, that's slow and expensive.

UIDL separates content from presentation. The AI emits a compact spec. A local renderer expands it to full HTML with charts, tables, and styling. The spec is small enough to stream in real time, and the renderer is deterministic.

## Example

```
UIDL/1
theme dark

h1 "Dashboard"
metrics 3
  "Users" "1.2k" green "active"
  "Revenue" "$45k" blue
  "Errors" "0.3%" red

chart bar "Sales by region"
  x "North" "South" "East"
  y 120 85 95

table "Details"
  cols Name Score Grade
  row Alice 95 A
  row Bob 82 B
```

~80 tokens. Standalone HTML with Chart.js, responsive, dark theme.

## Usage

```bash
node tools/generate.js input.uidl output.html
```

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

## SkillNet prototypes

4 scenarios showing how the same tool generates different UIs per user:

| Prototype | Scenario | UIDL | HTML | Savings |
|---|---|---|---|---|
| `skillnet_pepito_nuevo` | New employee, learning path | ~379 tok | ~2,855 tok | 87% |
| `skillnet_maria_veterana` | Manager, team dashboard | ~439 tok | ~3,103 tok | 86% |
| `skillnet_tutor_revisa` | AI tutor diagnostics | ~505 tok | ~3,081 tok | 84% |
| `skillnet_crossdomain_legal` | Same platform, law firm | ~486 tok | ~3,217 tok | 85% |

## 3 ways to use

### CLI

```bash
node tools/generate.js input.uidl output.html
```

### MCP Server

```bash
cd tools/mcp && npm install && npm run build
claude mcp add uidl -- node /path/to/uidl/tools/mcp/dist/index.js
```

### Agent skill

Copy `skill/uidl.md` into your prompt system. The agent learns the format natively.

## Repo structure

```
uidl/
├── skill/           # Teach any AI agent the format
│   └── uidl.md
├── tools/           # Parse and render
│   ├── parser.js
│   ├── renderer.js
│   ├── generate.js
│   └── mcp/
├── examples/        # .uidl specs
└── README.md
```

`skill/` teaches. `tools/` executes. Pick one or both.

## Format rules

1. First line: `UIDL/1`
2. Components at column 0, properties indented 2 spaces
3. Strings with spaces in double quotes
4. Colors by name (`red`, `green`, `blue`) or hex (`#4f46e5`)
5. Empty lines close blocks
6. Comments with `//`

## Origin

Built during [ANFAIA](https://anfaia.org) research on token-efficient UI generation for AI agents (July 2026).

## License

MIT
