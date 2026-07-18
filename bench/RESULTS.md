# A2TL-Web vs Markdown vs HTML — Benchmark Results

Benchmark run: July 2026

## Methodology

For each of the 5 examples in `examples/`, an equivalent Markdown file was written containing the exact same data — same numbers, same labels, same structure. The Markdown uses headers, tables, bullet points, bold, and blockquotes — a realistic representation of what an LLM would produce when asked to "generate a report."

Token estimates use the ~3.5 bytes/token heuristic common for English text with markup.

## Results

| Example | MD (bytes) | MD (tokens) | A2TL-Web (bytes) | A2TL-Web (tokens) | HTML (bytes) | HTML (tokens) | A2TL-Web vs MD |
|---------|------------|-------------|-------------------|---------------------|--------------|----------------|----------------|
| analytics | 1,186 | ~339 | 1,037 | ~296 | 10,374 | ~2,964 | **-12.6%** |
| project-status | 1,134 | ~324 | 996 | ~285 | 10,264 | ~2,933 | **-12.2%** |
| api-health | 1,505 | ~430 | 1,388 | ~397 | 10,838 | ~3,097 | **-7.8%** |
| sales-report | 1,346 | ~385 | 1,169 | ~334 | 10,715 | ~3,061 | **-13.2%** |
| startup-pitch | 1,576 | ~450 | 1,404 | ~401 | 11,247 | ~3,213 | **-10.9%** |
| **Average** | **1,349** | **~385** | **1,199** | **~343** | **10,688** | **~3,054** | **-11.1%** |

## Key Finding

A2TL-Web is **11% smaller** than equivalent Markdown on average. The original README claimed it cost 13% more tokens than Markdown — this was based on a single example with a shorter-than-realistic Markdown baseline.

When Markdown is written realistically (tables with alignment rows, headers, bold formatting, blockquotes), A2TL-Web's terse syntax consistently comes in smaller.

## What A2TL-Web adds that Markdown cannot

| Example | A2TL-Web-exclusive features |
|---------|----------------------------|
| analytics | Interactive line/bar/pie charts (Chart.js), color-coded metric cards with trend indicators, dark theme styling |
| project-status | Bar chart for milestones, burndown line chart, styled info cards (deadline, budget, risk), light theme |
| api-health | Multi-series line chart (P50/P95/P99), pie chart for error breakdown, color-coded metric cards, dark theme |
| sales-report | Regional bar chart, YoY trend line chart, pie chart for revenue share, styled highlight cards, light theme |
| startup-pitch | MRR growth line chart, customer growth bar chart, revenue segment pie chart, unit economics cards, dark theme |

Every A2TL-Web example produces a standalone HTML page with:
- **Interactive charts** (line, bar, pie) via Chart.js — Markdown has no chart support
- **Color-coded metric cards** with trend indicators — Markdown only has plain text/tables
- **Styled cards** with semantic grouping — Markdown has no card component
- **Theme support** (dark/light) — Markdown has no theming
- **Responsive layout** — Markdown layout depends entirely on the renderer

## A2TL-Web vs HTML savings

| Example | Saving |
|---------|--------|
| analytics | 90% |
| project-status | 90% |
| api-health | 87% |
| sales-report | 89% |
| startup-pitch | 88% |
| **Average** | **89%** |

A2TL-Web achieves the same visual output as the full HTML while using 89% fewer tokens.

## Summary

```
Markdown:     ~385 tokens  →  Plain text (no charts, no styling, no interactivity)
A2TL-Web:     ~343 tokens  →  Full interactive page (charts, cards, themes, responsive)
HTML:       ~3,054 tokens  →  Full interactive page (same output as A2TL-Web)
```

A2TL-Web is the only format that is both compact (smaller than Markdown) and rich (same output as HTML). It achieves this by separating content specification from presentation — the AI specifies *what* to show, and a local renderer handles *how*.

A2TL-Web is part of the **A2TL** family (Agent to Transformation Language), alongside **a2tl-video** for video generation.
