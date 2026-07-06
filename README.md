# UIDL — UI Description Language

Formato compacto para que una IA describa paginas web gastando **76% menos tokens** que generando HTML directo.

La IA dice **que** mostrar. El renderer decide **como**.

## Ejemplo

```
UIDL/1
theme dark

h1 "Dashboard"
metrics 3
  "Usuarios" "1.2k" green "activos"
  "Revenue" "$45k" blue
  "Errores" "0.3%" red

chart bar "Ventas por region"
  x "Norte" "Sur" "Este"
  y 120 85 95

table "Detalle"
  cols Nombre Score Grade
  row Alice 95 A
  row Bob 82 B
```

Eso son ~80 tokens. El equivalente en HTML+CSS+JS son ~600. El renderer genera un archivo `.html` standalone con Chart.js que se abre con doble click.

## Uso

```bash
node generate.js examples/dashboard_anfaia.uidl output/dashboard.html
```

## Componentes

| Componente | Descripcion |
|---|---|
| `h1` `h2` `h3` | Titulos |
| `text` | Parrafo (estilos: highlight, insight, dim) |
| `hr` | Separador |
| `metrics N` | Grid de tarjetas KPI |
| `chart bar\|line\|pie\|radar\|scatter` | Graficos (Chart.js) |
| `table` | Tabla con `cols` + `row` |
| `cards N` | Grid de tarjetas informativas |
| `list` | Lista con bullets |
| `code` | Bloque de codigo |
| `collapse` | Seccion plegable |

## Tokens comparados

| Formato | Tokens (est.) | Ahorro |
|---|---|---|
| HTML+CSS+JS directo | ~1471 | — |
| JSON spec | ~818 | 44% |
| **UIDL** | **~360** | **76%** |

Benchmark: dashboard con 6 metricas, 2 graficos, 1 tabla, 2 bloques de texto, 1 grid de cards.

## MCP Server

En `mcp/` hay un MCP server TypeScript con el tool `render_page(spec)` para Claude Code.

```bash
cd mcp && npm install && npm run build
```

Configurar en `~/.claude/settings.json`:

```json
"ui-renderer": {
  "command": "node",
  "args": ["<ruta>/mcp/dist/index.js"]
}
```

## Stack

- HTML + CSS + JS vanilla
- Chart.js via CDN
- Sin React. Sin npm. Sin build.
- El MCP server usa TypeScript + @modelcontextprotocol/sdk

## Reglas del formato

1. Primera linea: `UIDL/1`
2. Globals: `theme` (dark/light), `layout` (stack/grid)
3. Componentes en columna 0, propiedades indentadas 2 espacios
4. Strings con espacios entre comillas dobles
5. Numeros se parsean automaticamente
6. Colores por nombre (red, green, blue...) o hex (#4f46e5)
7. Lineas vacias cierran el bloque indentado

## Licencia

MIT
