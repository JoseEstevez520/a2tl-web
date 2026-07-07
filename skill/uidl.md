# UIDL Skill — para agentes IA

Copia este archivo en tu sistema de skills para que el agente sepa generar UIDL sin tener que leer ejemplos cada vez.

## Cuando usar

Cuando el usuario pida generar una pagina web, dashboard, reporte visual, o cualquier UI standalone. En vez de escribir HTML+CSS+JS, escribir un spec UIDL y renderizarlo.

**Ventaja:** ~4x menos tokens = mas rapido, mas barato, mismo resultado visual.

## Formato UIDL v1

```
UIDL/1
theme dark|light
layout stack

h1 "Titulo principal"
h2 "Subtitulo"
text "Parrafo" dim|highlight|insight
hr

metrics N
  "Label" "Valor" color "Nota"

chart bar "Titulo"
  x "Cat1" "Cat2" "Cat3"
  y 120 85 95

chart line "Titulo"
  x "Ene" "Feb" "Mar"
  series "Serie 1" 10 20 30 green

chart pie "Titulo"
  "Segmento A" 35 green
  "Segmento B" 25 blue

table "Titulo"
  cols Col1 Col2 Col3
  row "val1" "val2" "val3"

cards N
  card "Titulo" "Subtitulo" "Valor"

list "Titulo"
  - "Item 1"
  - "Item 2"

code javascript
  console.log("hello");

collapse "Titulo expandible"
  Contenido oculto.
```

## Reglas

- Primera linea: `UIDL/1`
- Strings con espacios entre comillas dobles
- Colores: nombres CSS (`red`, `green`, `blue`, `cyan`) o hex (`#ff6b6b`)
- Sub-items indentados 2 espacios
- Lineas vacias separan bloques
- Comentarios: `// texto`

## Renderizar

```bash
node generate.js mi-spec.uidl output/mi-pagina.html
```

## Ejemplo completo

```
UIDL/1
theme dark

h1 "Bienvenido, Pepito"
text "Tu plan de formacion esta listo." dim

metrics 4
  "Progreso" "0%" orange "Empezando"
  "Modulos" "4" blue "Plan inicial"
  "Tiempo" "12h" cyan "A tu ritmo"
  "Certs" "0/2" purple "Pendientes"

h2 "Ruta de aprendizaje"

cards 2
  card "Seguridad" "Modulo 1" "Empezar"
  card "POS" "Modulo 2" "Bloqueado"

chart pie "Plan"
  "Seguridad" 35 green
  "POS" 25 blue
  "Atencion" 25 cyan
  "Limpieza" 15 purple
```

40 lineas → pagina HTML completa con graficas, KPIs, y tarjetas. ~379 tokens vs ~2,855 en HTML directo.
