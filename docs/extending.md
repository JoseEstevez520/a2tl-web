# Extending A2TL-Web with custom components

A2TL-Web ships with 10 components. Adding a new one takes ~15 lines across two files. This guide walks through the pattern and a concrete example.

## The pattern

Every component lives in two places:

| File | What to add |
|------|-------------|
| `tools/mcp/src/parser.ts` | Type definition + parse block |
| `tools/mcp/src/renderer.ts` | HTML render case |

Three steps:

1. Add the type to the `Section` union in `parser.ts`
2. Add a parse block in the `parseUIDL()` while-loop in `parser.ts`
3. Add a render case in the `renderSection()` switch in `renderer.ts`

That's it. No registration, no config files, no build plugins.

## Example: adding a `progress` component

Goal: render a styled progress bar from this syntax:

```
progress 75 "Security Training" green
```

### Step 1 -- Add the type

In `parser.ts`, find the `Section` type union and add a new member:

```typescript
export type Section =
  | { type: 'h1' | 'h2' | 'h3'; text: string }
  | { type: 'hr' }
  | { type: 'text'; text: string; style?: string }
  | { type: 'metrics'; cols: number; items: MetricItem[] }
  | { type: 'chart'; chartType: string; title: string; x: (string | number)[]; series: SeriesData[]; color?: string; axes?: string[]; pieData?: PieSlice[] }
  | { type: 'table'; title: string; columns: string[]; rows: (string | number)[][] }
  | { type: 'cards'; cols: number; items: CardItem[] }
  | { type: 'list'; title: string; items: string[] }
  | { type: 'code'; lang: string; text: string }
  | { type: 'collapse'; title: string; content: string }
  | { type: 'progress'; value: number; label: string; color?: string };  // <-- new
```

### Step 2 -- Add the parse block

In `parser.ts`, inside the `while (i < lines.length)` loop in `parseUIDL()`, add a new `if` block. Place it before the final `i++` fallthrough at the bottom. Follow the same pattern as the existing components:

```typescript
    if (cmd === 'progress') {
      const value = typeof t[1] === 'number' ? t[1] : 0;
      const label = t[2] ? String(t[2]) : '';
      const color = t[3] && isColor(t[3]) ? String(t[3]) : undefined;
      result.sections.push({ type: 'progress', value, label, ...(color ? { color } : {}) });
      i++; continue;
    }
```

How this works:
- `t` is the tokenized line. `t[0]` is `"progress"`, `t[1]` is `75`, `t[2]` is `"Security Training"`, `t[3]` is `"green"`.
- `tokenizeLine()` already handles quoted strings and converts bare numbers to `number` type.
- `isColor()` validates named colors and hex codes.
- `i++; continue;` advances past this line and goes to the next component.

### Step 3 -- Add the render case

In `renderer.ts`, add a case to the `renderSection()` switch statement:

```typescript
    case 'progress': {
      const color = resolveColor(sec.color, '#4f46e5');
      const pct = Math.max(0, Math.min(100, sec.value));
      return `<div style="margin:1rem 0;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:1rem 1.25rem;">
        ${sec.label ? `<div style="font-size:0.85rem;font-weight:500;margin-bottom:0.5rem;">${esc(sec.label)}</div>` : ''}
        <div style="background:var(--border);border-radius:4px;height:8px;overflow:hidden;">
          <div style="width:${pct}%;height:100%;background:${color};border-radius:4px;transition:width 0.3s;"></div>
        </div>
        <div style="font-size:0.72rem;color:var(--text-dim);margin-top:0.35rem;">${pct}%</div>
      </div>`;
    }
```

This uses:
- `resolveColor()` to turn `"green"` into `#059669` (or fall back to accent color)
- `esc()` to HTML-escape the label
- CSS variables (`--bg-card`, `--border`, `--radius`, `--text-dim`) so the component respects the current theme

### Result

This spec:

```
UIDL/1
theme dark

h1 "Training Status"

progress 75 "Security Training" green
progress 40 "Compliance Review" orange
progress 100 "Onboarding" blue
```

Renders three styled progress bars inside a dark-themed page, no JavaScript needed.

## Reference: how existing components work

Look at `list` for the simplest component with sub-items:

**Parser** (`parser.ts`, the `list` block):
```typescript
    if (cmd === 'list') {
      const sec = { type: 'list' as const, title: t[1] ? String(t[1]) : '', items: [] as string[] };
      i++;
      while (i < lines.length && lines[i].trim() !== '' && getIndent(lines[i]) > 0) {
        const lt = tokenizeLine(lines[i]);
        const first = String(lt[0] || '');
        sec.items.push((first === '-' || first === '*') ? lt.slice(1).map(String).join(' ') : lt.map(v => String(v)).join(' '));
        i++;
      }
      result.sections.push(sec);
      continue;
    }
```

**Renderer** (`renderer.ts`, the `list` case):
```typescript
    case 'list': {
      let html = `<div class="list-block">${sec.title ? `<h3>${esc(sec.title)}</h3>` : ''}<ul>`;
      for (const item of sec.items) html += `<li>${esc(item)}</li>`;
      return html + '</ul></div>';
    }
```

The pattern: parse builds a typed object, renderer turns it into HTML. Components with indented sub-items use a `while` loop that checks `getIndent(lines[i]) > 0` and collects children until it hits a blank line or unindented line.

## What NOT to do

- **Don't modify the header keywords.** `UIDL/1`, `theme`, `layout`, `brand` are parsed in a separate loop before components. Leave them alone.
- **Don't add components that need JavaScript state.** The renderer produces static HTML (Chart.js is the one exception, and it's self-contained). If your component needs event handlers or state management, it doesn't belong in A2TL-Web.
- **Keep syntax consistent.** Component name at column 0, sub-items indented 2 spaces. Strings with spaces in double quotes. Colors as the last positional argument.
- **Don't forget the type union.** TypeScript will catch this if you skip it -- the parser won't compile if you push a shape that doesn't match `Section`.
