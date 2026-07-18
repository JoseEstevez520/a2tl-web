# A2TL-Web Skill — for AI agents

A2TL-Web is part of the **A2TL** family (**A**gent **t**o **T**ransformation **L**anguage) — compact formats where AI agents describe *what* to show and a renderer decides *how*. Siblings: **a2tl-web** (web pages), **a2tl-video** (videos).

Copy this file into your skill/prompt system so the agent can generate A2TL-Web specs without reading examples every time.

## When to use

When the user asks to generate a web page, dashboard, report, or any standalone UI. Instead of writing HTML+CSS+JS, write an A2TL-Web spec and render it.

**Advantage:** ~4x fewer tokens = faster, cheaper, same visual result.

## A2TL-Web format (UIDL/1)

```
UIDL/1
theme dark|light
layout stack

h1 "Main title"
h2 "Subtitle"
text "Paragraph" dim|highlight|insight
hr

metrics N
  "Label" "Value" color "Note"

chart bar "Title"
  x "Cat1" "Cat2" "Cat3"
  y 120 85 95

chart line "Title"
  x "Jan" "Feb" "Mar"
  series "Series 1" 10 20 30 green

chart pie "Title"
  "Segment A" 35 green
  "Segment B" 25 blue

table "Title"
  cols Col1 Col2 Col3
  row "val1" "val2" "val3"

cards N
  card "Title" "Subtitle" "Value"

list "Title"
  - "Item 1"
  - "Item 2"

code javascript
  console.log("hello");

collapse "Expandable title"
  Hidden content.
```

## Rules

- First line: `UIDL/1`
- Strings with spaces in double quotes
- Colors: CSS names (`red`, `green`, `blue`, `cyan`) or hex (`#ff6b6b`)
- Sub-items indented 2 spaces
- Empty lines separate blocks
- Comments: `// text`

## Render

```bash
node tools/generate.js my-spec.uidl output/my-page.html
```

## Full example

```
UIDL/1
theme dark

h1 "API Health Dashboard"
text "Real-time monitoring — Last 24 hours" dim

metrics 4
  "Uptime" "99.97%" green "SLA: 99.9%"
  "Avg Latency" "45ms" blue "P99: 210ms"
  "Error Rate" "0.12%" green "< 0.5% target"
  "Requests" "2.8M" cyan "24h total"

chart line "Response Time (ms)"
  x "00:00" "04:00" "08:00" "12:00" "16:00" "20:00"
  series "P50" 32 28 42 55 48 38 green
  series "P99" 120 105 180 250 195 140 red

table "Recent Incidents"
  cols Time Endpoint Status Duration
  row "14:23" "/api/search" "504" "3m 12s"
  row "09:15" "/api/orders" "500" "45s"
```

~30 lines, ~400 tokens. Generates a complete HTML page with Chart.js charts, responsive layout, and dark theme.

## Extending the renderer

The renderer is extensible. You can add custom components by adding a type to the `Section` union in `parser.ts`, a parse block in `parseUIDL()`, and a render case in `renderSection()`. Each new component is ~15 lines of code across two files.

See [docs/extending.md](docs/extending.md) for a step-by-step guide with a worked example.
