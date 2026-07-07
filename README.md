<p align="center">
  <h1 align="center">uidl</h1>
  <p align="center">
    <strong>Formato compacto para que una IA genere paginas web gastando 4x menos tokens</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/tokens-85%25_ahorro-orange?style=flat-square" alt="Token savings">
    <img src="https://img.shields.io/badge/MCP-compatible-blue?style=flat-square" alt="MCP">
    <img src="https://img.shields.io/badge/dependencias-0-brightgreen?style=flat-square" alt="Zero deps">
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
  </p>
</p>

---

> La IA dice **que** mostrar. El renderer decide **como**. Ningun token se gasta en CSS, HTML ni JavaScript.

## El problema

Cuando una IA genera una pagina con graficos, produce miles de tokens de HTML+CSS+JS. El 80% es boilerplate. UIDL comprime la misma pagina en ~450 tokens y un renderer local genera el HTML al instante.

```
IA genera UIDL (~450 tok)  →  Renderer local (ms)  →  HTML standalone
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

~80 tokens. Genera un `.html` con Chart.js, responsive, dark theme, listo para abrir.

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
| `chart pie` | Circular | `"segmento" valor color` |
| `chart radar` | Radar | `axes` + `series` |
| `chart scatter` | Dispersion | `x` + `y` |
| `table` | Tabla | `cols` + `row` |
| `cards N` | Grid de tarjetas | `card "titulo" "sub" "valor"` |
| `list` | Lista bullets | `- "item"` |
| `code` | Bloque codigo | `code lang` + lineas indentadas |
| `collapse` | Plegable | contenido indentado |

## Prototipos SkillNet

4 escenarios reales de una plataforma de formacion corporativa, mostrando como la misma herramienta genera UIs completamente distintas segun el usuario:

| Prototipo | Escenario | UIDL | HTML | Ahorro |
|---|---|---|---|---|
| `skillnet_pepito_nuevo` | Empleado nuevo, ruta de aprendizaje | ~379 tok | ~2,855 tok | 87% |
| `skillnet_maria_veterana` | Gerente, dashboard de equipo | ~439 tok | ~3,103 tok | 86% |
| `skillnet_tutor_revisa` | Vista del tutor IA, diagnostico | ~505 tok | ~3,081 tok | 84% |
| `skillnet_crossdomain_legal` | Mismo sistema para un bufete | ~486 tok | ~3,217 tok | 85% |

```bash
node generate.js examples/skillnet_pepito_nuevo.uidl output/pepito.html
```

## Benchmark real

Misma pagina (dashboard de gerente con 4 KPIs, tabla, 2 graficos, 3 cards):

| Formato | Tokens | Ahorro |
|---|---|---|
| HTML+CSS+JS directo | ~1,760 | — |
| **UIDL** | **~440** | **75%** |

Medido con la misma IA generando ambos formatos para la misma pagina.

## 3 formas de usar

### 1. CLI (sin dependencias)

```bash
node generate.js input.uidl output.html
```

### 2. MCP Server (para Claude Code, Cursor, etc.)

```bash
cd mcp && npm install && npm run build
claude mcp add uidl -- node /ruta/a/mcp/dist/index.js
```

El agente usa el tool `render_page(spec)` directamente.

### 3. Skill para agentes

Copia `SKILL.md` en tu sistema de skills/prompts. El agente aprende el formato y genera UIDL directamente, sin necesidad de MCP.

## Reglas del formato

1. Primera linea: `UIDL/1`
2. Componentes en columna 0, propiedades indentadas 2 espacios
3. Strings con espacios entre comillas dobles
4. Numeros se parsean automaticamente
5. Colores por nombre (`red`, `green`, `blue`...) o hex (`#4f46e5`)
6. Lineas vacias cierran el bloque indentado
7. Comentarios con `//`

## Tech stack

| Capa | Detalle |
|---|---|
| **Renderer** | HTML + CSS + JS vanilla. Sin React. Sin build. |
| **Graficos** | Chart.js via CDN |
| **Estilo** | Dark theme por defecto, clean modern look |
| **MCP** | TypeScript + @modelcontextprotocol/sdk |

## Origen

Construido como parte de la investigacion [ANFAIA](https://anfaia.org) sobre generacion de UI eficiente en tokens para agentes IA (julio 2026).

## Licencia

MIT

---

<p align="center">
  <em>La tecnologia se adapta a nosotros, no nosotros a ella.</em>
</p>
