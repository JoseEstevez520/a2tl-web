<p align="center">
  <h1 align="center">uidl</h1>
  <p align="center">
    <strong>Formato compacto para que una IA genere paginas web gastando 76% menos tokens</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/tokens-76%25_ahorro-orange?style=flat-square" alt="Token savings">
    <img src="https://img.shields.io/badge/MCP-compatible-blue?style=flat-square" alt="MCP">
    <img src="https://img.shields.io/badge/dependencias-0-brightgreen?style=flat-square" alt="Zero deps">
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
  </p>
</p>

---

> La IA dice **que** mostrar. El renderer decide **como**. Ningun token se gasta en CSS, HTML ni JavaScript.

## El problema

Cuando una IA genera una pagina con graficos, produce ~1500 tokens de HTML+CSS+JS. El 80% es boilerplate. UIDL comprime la misma pagina en ~360 tokens y un renderer local genera el HTML.

```
IA genera UIDL (~360 tok)  →  Renderer local  →  HTML standalone (doble click)
```

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

Eso son ~80 tokens. Genera un `.html` con Chart.js, responsive, tema dark, listo para abrir.

## Uso

```bash
node generate.js examples/dashboard_anfaia.uidl output/dashboard.html
```

## Componentes

| Componente | Que hace | Sintaxis |
|---|---|---|
| `h1` `h2` `h3` | Titulos | `h1 "Texto"` |
| `text` | Parrafo con estilo | `text "..." highlight\|insight\|dim` |
| `hr` | Separador | `hr` |
| `metrics N` | Grid de KPIs | `"label" "valor" color "nota"` |
| `chart bar` | Barras | `x` + `y` |
| `chart line` | Lineas (multiserie) | `x` + `series "nombre" datos color` |
| `chart pie` | Circular | `"segmento" valor` |
| `chart radar` | Radar | `axes` + `series` |
| `chart scatter` | Dispersion | `x` + `y` |
| `table` | Tabla | `cols` + `row` |
| `cards N` | Grid de tarjetas | `card "titulo" "sub" "valor"` |
| `list` | Lista bullets | lineas indentadas |
| `code` | Bloque codigo | `code lang` + lineas indentadas |
| `collapse` | Plegable | contenido indentado |

## Benchmark

| Formato | Tokens | Ahorro |
|---|---|---|
| HTML+CSS+JS directo | ~1471 | — |
| JSON spec | ~818 | 44% |
| **UIDL** | **~360** | **76%** |

Dashboard con 6 metricas, 2 graficos, 1 tabla, 2 bloques de texto, 1 grid de cards.

## MCP Server

En `mcp/` hay un server MCP con el tool `render_page(spec)` — recibe UIDL, genera HTML y lo abre en el navegador.

```bash
cd mcp && npm install && npm run build
```

Registrar en Claude Code:

```bash
claude mcp add ui-renderer -- node /ruta/a/mcp/dist/index.js
```

## Tech stack

<p>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white" alt="Chart.js">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/MCP_SDK-1C3C3C?style=for-the-badge" alt="MCP SDK">
</p>

| Capa | Detalle |
|---|---|
| **Renderer** | HTML + CSS + JS vanilla. Sin React. Sin build. |
| **Graficos** | Chart.js via CDN (bar, line, pie, radar, scatter) |
| **Estilo** | "Pale" — minimalismo real. Sistema tipografico, spacing generoso, sin decoracion |
| **MCP** | TypeScript + @modelcontextprotocol/sdk, tool render_page |

## Reglas del formato

1. Primera linea: `UIDL/1`
2. Componentes en columna 0, propiedades indentadas 2 espacios
3. Strings con espacios entre comillas dobles
4. Numeros se parsean automaticamente
5. Colores por nombre (`red`, `green`, `blue`...) o hex (`#4f46e5`)
6. Lineas vacias cierran el bloque indentado
7. Comentarios con `//`

## Origen

Construido como parte de la investigacion [ANFAIA](https://anfaia.org) sobre generacion de UI eficiente en tokens para agentes IA (julio 2026). La idea: en vez de que la IA genere 2000 lineas de React, que emita 40 lineas de spec y un renderer local haga el resto.

## Licencia

MIT

---

<p align="center">
  <em>La tecnologia se adapta a nosotros, no nosotros a ella.</em>
</p>
