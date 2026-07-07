<p align="center">
  <h1 align="center">uidl</h1>
  <p align="center">
    <strong>A compact DSL for AI-generated web pages — 4x fewer tokens than raw HTML</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/tokens-75%25_savings-orange?style=flat-square" alt="Token savings">
    <img src="https://img.shields.io/badge/MCP-compatible-blue?style=flat-square" alt="MCP">
    <img src="https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square" alt="Zero deps">
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
  </p>
</p>

---

> The AI decides **what** to show. The renderer decides **how**. Zero tokens wasted on CSS, HTML, or JavaScript.

## The problem

Generative content is the next layer of the web. LLMs are already writing reports, dashboards, and personalized pages — but they generate thousands of tokens of HTML+CSS+JS boilerplate to do it. That's slow, expensive, and wasteful.

UIDL separates **content** from **presentation**. The AI emits a compact spec (~450 tokens) describing what to show. A local renderer expands it into a full standalone HTML page with charts, tables, and styling — instantly, at zero cost.

```
AI generates UIDL (~450 tok)  →  Local renderer (ms)  →  Standalone HTML page
```

This isn't just about saving tokens. It's about making generative UI practical: fast enough for real-time, cheap enough for every user, and deterministic enough to trust.

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

Same dashboard. Same charts. Same data. Measured by having the same LLM generate both formats for the same page.

## How it contributes to generative content

Generative UI means the interface adapts to each user in real time — not pre-designed screens, but pages built on the fly by an AI that knows what you need. The bottleneck is generation speed and cost:

- **Without UIDL:** every page costs ~1,760 tokens and ~3.5 seconds of generation. At scale (hundreds of users, personalized pages), that's expensive and slow.
- **With UIDL:** same page costs ~440 tokens and ~0.9 seconds. The renderer is local, so expansion to HTML is instant. You can generate personalized pages for every user without breaking the budget.

UIDL makes generative content economically viable. The spec is small enough to stream in real time, and the renderer is deterministic — same spec always produces the same page.

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

~80 tokens. Generates a standalone `.html` with Chart.js charts, responsive layout, dark theme, ready to open.

## Usage

```bash
node generate.js examples/dashboard_anfaia.uidl output/dashboard.html
```

## Components

| Component | What it renders | Syntax |
|---|---|---|
| `h1` `h2` `h3` | Headings | `h1 "Text"` |
| `text` | Paragraph with style | `text "..." highlight\|insight\|dim` |
| `hr` | Separator | `hr` |
| `metrics N` | KPI card grid | `"label" "value" color "note"` |
| `chart bar` | Bar chart | `x` + `y` |
| `chart line` | Line chart (multi-series) | `x` + `series "name" data color` |
| `chart pie` | Pie/donut chart | `"segment" value color` |
| `chart radar` | Radar chart | `axes` + `series` |
| `chart scatter` | Scatter plot | `x` + `y` |
| `table` | Styled table | `cols` + `row` |
| `cards N` | Info card grid | `card "title" "sub" "value"` |
| `list` | Bullet list | `- "item"` |
| `code` | Code block | `code lang` + indented lines |
| `collapse` | Collapsible section | indented content |

## SkillNet prototypes

4 real-world scenarios from a corporate training platform, showing how the same tool generates completely different UIs depending on the user:

| Prototype | Scenario | UIDL | HTML | Savings |
|---|---|---|---|---|
| `skillnet_pepito_nuevo` | New employee, learning path | ~379 tok | ~2,855 tok | 87% |
| `skillnet_maria_veterana` | Manager, team dashboard | ~439 tok | ~3,103 tok | 86% |
| `skillnet_tutor_revisa` | AI tutor view, diagnostics | ~505 tok | ~3,081 tok | 84% |
| `skillnet_crossdomain_legal` | Same platform for a law firm | ~486 tok | ~3,217 tok | 85% |

```bash
node generate.js examples/skillnet_pepito_nuevo.uidl output/pepito.html
```

## 3 ways to use

### 1. CLI (zero dependencies)

```bash
node generate.js input.uidl output.html
```

### 2. MCP Server (for Claude Code, Cursor, etc.)

```bash
cd mcp && npm install && npm run build
claude mcp add uidl -- node /path/to/mcp/dist/index.js
```

The agent calls the `render_page(spec)` tool directly.

### 3. Agent skill

Copy `SKILL.md` into your skill/prompt system. The agent learns the format and generates UIDL natively — no MCP needed.

## Format rules

1. First line: `UIDL/1`
2. Components at column 0, properties indented 2 spaces
3. Strings with spaces in double quotes
4. Numbers are auto-parsed
5. Colors by name (`red`, `green`, `blue`...) or hex (`#4f46e5`)
6. Empty lines close the indented block
7. Comments with `//`

## Tech stack

| Layer | Detail |
|---|---|
| **Renderer** | Vanilla HTML + CSS + JS. No React. No build step. |
| **Charts** | Chart.js via CDN |
| **Styling** | Dark theme by default, clean modern look |
| **MCP** | TypeScript + @modelcontextprotocol/sdk |

## Origin

Built as part of [ANFAIA](https://anfaia.org) research on token-efficient UI generation for AI agents (July 2026). The idea: instead of the AI generating 2000 lines of React, it emits 40 lines of spec and a local renderer does the rest.

## License

MIT

---

<p align="center">
  <em>Technology adapts to us, not us to it.</em>
</p>
