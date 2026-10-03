---
slug: como-leer-rankings-openrouter
title: Cómo leer los rankings de OpenRouter
type: guide
order: 13
summary: Una guía para interpretar uso, gasto, velocidad y benchmarks de OpenRouter, seguir sus trece secciones de texto y convertir las señales en pruebas comparables.
tags: [openrouter, modelos, rankings, benchmarks, evaluacion, costos, harness]
related: [guia-escalado-modelos, comparar-harness-cli-codex-claude-opencode-cline, modelos-guiados-el-entorno-es-la-politica]
area: Gobierno de agentes
glyph: △
hue: rgba(168,106,255,.24)
---

# Cómo leer los rankings de OpenRouter

*Guía de seguimiento para elegir qué modelos probar*

Revisión del 3 de octubre de 2026 · La portada mostraba datos de uso hasta el 2 de octubre de 2026

Un ranking resulta útil cuando ayuda a tomar una decisión concreta: qué modelo conviene probar, para qué trabajo y con qué costo de equivocarse. El problema aparece cuando una posición se convierte en una conclusión que la medición nunca prometió.

OpenRouter reúne señales de uso real, gasto, velocidad y evaluaciones de capacidad. La propuesta de esta guía es recorrer sus secciones, identificar qué cuenta cada una y convertirlas en un seguimiento repetible. **Primero elegimos qué observar; después verificamos si esa señal mejora nuestro trabajo.**

El recorrido principal cubre las trece subsecciones de Text. También incluye las otras pestañas de Rankings y sus unidades. Los nombres y controles corresponden a la revisión indicada; los ejemplos numéricos son didácticos y no presentan ganadores actuales. [[1]](https://openrouter.ai/rankings)

## La pregunta que conviene hacer antes del primer puesto

Antes de comparar dos modelos, anotá cinco cosas: unidad, población, ventana temporal, agregación y condiciones. Es una ficha mínima que evita conclusiones enormes a partir de números pequeños.

- **Unidad:** tokens, solicitudes, dólares, segundos o puntos de un benchmark. Un cambio de unidad cambia la pregunta.

- **Población:** todo el tráfico elegible, una muestra clasificada, un idioma, una aplicación o una prueba concreta.

- **Ventana:** un día completo, siete días, treinta días o la fecha de un experimento. La fecha de consulta no reemplaza a la fecha de los datos.

- **Agregación:** suma, cuota, variación, mediana o índice compuesto. Un promedio y una mediana pueden contar historias diferentes.

- **Condiciones:** versión, variante, proveedor, esfuerzo de razonamiento, caché, herramientas y harness. El mismo nombre puede cubrir configuraciones distintas.

OpenRouter observa el tráfico que pasa por su plataforma y entra en cada dataset público. Esa población no permite inferir por sí sola la cuota mundial de un laboratorio, su número de clientes o todo su negocio. Los datos privados y las exclusiones documentadas también importan. [[2]](https://openrouter.ai/docs/cookbook/administration/data-api)

## El recorrido por las trece secciones

### 1 Top Models

Es el panorama histórico del volumen semanal de tokens. Permite ver qué modelos sostienen actividad, cuáles aparecen de golpe y cómo cambia el tamaño total del tráfico. La visualización destaca nueve modelos y agrupa el resto en Others. La unidad suma entrada y salida; cada variante se trata por separado. [[1]](https://openrouter.ai/rankings)

**Cómo seguirlo:** compará varias semanas, registrá la escala y mirá el total además de cada color. La escala lineal ayuda a dimensionar diferencias absolutas; la logarítmica facilita ver órdenes de magnitud. Cambiar de escala no modifica los datos, pero sí su apariencia.

**Qué evitar:** interpretar más tokens como más personas o más productividad. Un agente que relee un repositorio, encadena turnos o genera respuestas largas puede mover mucho volumen. Los tokenizadores tampoco segmentan el texto de manera idéntica entre proveedores. [[7]](https://openrouter.ai/docs/api/api-reference/datasets/daily-token-totals-for-top-50-models)

### 2 Leaderboard

La tabla permite ordenar ese uso y elegir modelos abiertos, cerrados o todos. Today, This Week y This Month abarcan respectivamente 1, 7 y 30 días completos, con cierre en UTC. New & Trending compara los últimos siete días con los siete anteriores; exige un millón de tokens en la ventana actual y puede anteponer hasta cinco modelos nuevos. [[1]](https://openrouter.ai/rankings)

El crecimiento compara volúmenes: pasar de 10 a 15 millones de tokens representa un aumento del 50%. No significa subir cincuenta puntos de cuota. Y new señala falta de una base previa comparable, no una tasa de crecimiento infinita.

**Cómo seguirlo:** conservá una vista semanal para la tendencia y una mensual para la persistencia. Separá lanzamientos, variantes gratuitas y versiones estables. Un filtro de apertura cambia el conjunto comparado; no certifica licencias, permisos de uso ni calidad del modelo.

### 3 Top models by task

Esta sección acerca el ranking al trabajo concreto. Permite alternar **Share of spend** y **Share of tokens**. Las tareas se infieren sobre una muestra de prompts y la interfaz indica que corrige las magnitudes por muestreo. La documentación del Auto Router vincula la vista de gasto con una ventana móvil de siete días. [[3]](https://openrouter.ai/docs/guides/routing/routers/auto-router) [[4]](https://openrouter.ai/blog/announcements/introducing-the-new-auto-router/)

El mapa de rectángulos o treemap contiene dos niveles que conviene leer por separado. El área de una tarea indica cuánto representa dentro del total de la métrica elegida. Al abrirla, la lista muestra la participación de cada modelo dentro de esa tarea. El tamaño de Classification y el porcentaje de un modelo en Classification tienen denominadores diferentes.

**Ejemplo:** si una tarea concentra el 10% del gasto y un modelo reúne el 20% del gasto de esa tarea, su porción del total sería el 2%, siempre que ambos porcentajes compartan universo y ventana. Leer el 20% como cuota de todo OpenRouter multiplicaría por diez la interpretación.

Los colores distinguen cuatro familias. En la revisión había 29 etiquetas; conservar sus nombres facilita encontrarlas aunque cambie su posición en el gráfico:

- **General:** Classification, Content Writing, Roleplay & Fiction, Q&A & Knowledge, Conversation, Research & Reports, Customer Support, Summarization, Security Audit, Math, Finance & Trading, Translation y DevOps

- **Agent:** Workflow Execution, Multi-step Planning, Tool Dispatch, Web Search y Memory Extraction

- **Code:** Code Generation, Debugging, File I/O, Code Review, Shell Execution, Frontend & UI, Repo Scanning, DevOps & Config y SQL & Database

- **Data:** Data Extraction y Data Transformation

**Cómo seguirlo:** elegí la tarea más cercana a tu trabajo y alterná gasto y tokens. Si un modelo gana mucho más espacio en gasto, investigá precio, longitud, razonamiento y mezcla de trabajo. Si gana en tokens, investigá volumen y variantes gratuitas. Ninguna de esas diferencias identifica por sí sola qué respuestas fueron correctas.

La clasificación es una estimación de la intención del prompt. Una sesión de programación puede pasar por planificación, lectura de archivos, búsqueda, generación y revisión. No conviene tratar cada casillero como una industria separada ni sumar sus posiciones para inventar una nota general.

**Límite metodológico:** la interfaz explica que los deltas comparan con la ventana anterior, pero no desarrolla allí todos sus detalles. Antes de publicar una variación como puntos porcentuales, verificá la definición concreta. Tampoco se publica en estas vistas una ficha completa de tamaño muestral, precisión del clasificador, intervalos de confianza y tratamiento contable del gasto.

Hay además una diferencia relevante para quien quiera automatizar el seguimiento: la API de clasificaciones documenta cuotas de solicitudes y tokens, excluye other del denominador y ordena modelos por solicitudes. Esos campos no sustituyen automáticamente la cuota de gasto del treemap. Un nombre parecido no garantiza el mismo cálculo. [[5]](https://openrouter.ai/docs/api/api-reference/classifications/task-classification-market-share)

### 4 Cost per session

Acá la pregunta pasa al costo observado de una sesión de agente. La unidad es USD por sesión y el resumen es la mediana, separado por harness. La interfaz revisada mostraba Hermes Agent, Claude Code, Kilo Code y Codex, con tramos de 1, 2 a 9, 10 a 49 y 50 o más turnos.

El tooltip define una ventana de 30 días, uso pago y escala logarítmica. Una sesión se atribuye a un modelo cuando ese modelo procesó al menos el 80% de sus tokens. La referencia del dataset confirma que las aplicaciones no se mezclan, que se publican medianas y que el snapshot se actualiza semanalmente. [[1]](https://openrouter.ai/rankings) [[6]](https://openrouter.ai/docs/api/api-reference/datasets/cost-per-session-by-harness-and-model)

**Cómo seguirlo:** fijá primero el harness y después un tramo comparable. La mediana describe el centro de la distribución: la mitad de las sesiones queda por debajo y la otra mitad por encima. No muestra cuánto cuesta la cola de sesiones difíciles ni alcanza para presupuestar un mes completo.

Una sesión barata puede haber sido simple, corta, abortada o fallida. Una larga puede haber resuelto un trabajo valioso. Para decidir en tu entorno, agregá éxito, reintentos y tiempo de revisión. La regla del 80% también limita la lectura de flujos que reparten mucho trabajo entre varios modelos. La delimitación exacta de sesión y los umbrales de publicación no quedan especificados en la referencia consultada.

### 5 Market Share

Agrupa por autor del modelo y cuenta solicitudes de texto. Absolute muestra magnitudes; Percentage, la parte de cada autor sobre el total del período. El autor del modelo no necesariamente coincide con la empresa que sirve el endpoint. [[1]](https://openrouter.ai/rankings)

**Cómo seguirlo:** mirá ambas vistas. Si un autor pasa de 100 a 120 solicitudes mientras el total pasa de 200 a 300, su volumen crece un 20% y su cuota cae de 50% a 40%. Las dos observaciones son compatibles.

Esta sección permite detectar cambios en la composición del tráfico. Para explicar la causa necesitás más evidencia: lanzamientos, disponibilidad, precios, integraciones o decisiones de routing. No alcanza con que dos curvas se muevan a la vez. Conservá también la fecha del punto observado; el texto resumido y el gráfico pueden referirse a cortes distintos.

### 6 Benchmarks

Esta es la sección para comparar resultados de evaluaciones. El selector revisado reunía trece métricas de tres familias: evaluaciones ejecutadas por OpenRouter, índices de Artificial Analysis y ratings de Design Arena. Conviene conservar esa procedencia junto al puntaje. [[2]](https://openrouter.ai/docs/cookbook/administration/data-api)

- **GPQA Diamond, τ²-Bench Airline y VGI-Bench:** el panel presenta accuracy. Para GPQA Diamond y VGI-Bench, el tooltip precisa mediana de accuracy entre proveedores, medida por OpenRouter. Cada prueba tiene su propio protocolo; conviene abrir su ficha antes de interpretar el porcentaje.

- **Intelligence Index, Coding Index y Agentic Index:** son índices compuestos de Artificial Analysis. Sirven para una preselección general, de código o de agentes. Un valor de índice no debe leerse automáticamente como porcentaje de tareas resueltas.

- **Code Categories, UI Component, Game Development, Data Visualization, 3D, Image y SVG ELO:** son ratings de Design Arena para comparaciones cara a cara. Su escala es relativa al sistema de evaluación y a sus participantes; 1.500 puntos Elo no equivalen a un 75% de calidad.

En una evaluación de exactitud, el denominador son los casos evaluados bajo un protocolo. En un índice compuesto intervienen varias pruebas y sus reglas de combinación. En Elo intervienen comparaciones y resultados relativos. Estas metodologías responden preguntas diferentes: no conviene promediarlas como si compartieran una escala.

**GPQA Diamond** usa un conjunto fijo de preguntas científicas. Su ficha detallada agrega ejecuciones de los últimos 90 días ponderadas por cantidad de preguntas, con un mínimo de cobertura por pareja modelo y proveedor cuya cifra no se explicita. Hay una diferencia que vale conservar: mientras el tooltip del widget describe una mediana entre proveedores, la ficha detallada prioriza el resultado con routing predeterminado y usa la mediana cuando ese resultado falta. Citá la vista exacta de la que sale tu cifra. [[23]](https://openrouter.ai/benchmarks/gpqa-diamond/)

**VGI-Bench** significa Video General Intelligence Bench y evalúa comprensión de videos largos. La implementación de OpenRouter entrega el video y una pregunta de opción múltiple en un turno, con temperatura 0, y corrige la letra final. Usa un conjunto público de 439 preguntas, exige al menos 395 respuestas para incluir una ejecución y considera los últimos 90 días. Sirve para investigar comprensión temporal y audiovisual; su accuracy no es una nota de generación de video. [[21]](https://openrouter.ai/benchmarks/vgi-bench)

**τ²-Bench Airline** evalúa atención al cliente con un usuario simulado y herramientas de aerolínea. El éxito exige el estado final esperado de la base de datos y los mensajes requeridos, sin crédito parcial. La ficha fija el simulador, limita la ejecución a 200 pasos y agrega pruebas de 90 días ponderadas por tareas, con mínimo de 45 por pareja modelo y proveedor. Su resultado principal usa routing predeterminado si existe; en otro caso, la mediana entre proveedores. Esa regla de la ficha detallada no debe generalizarse a todo el widget. [[22]](https://openrouter.ai/benchmarks/tau2-bench-airline/)

También cambia el eje económico. El gráfico ofrece Weighted Avg Input Price, Input List Price y Avg Price Per 100 Requests. Las dos primeras vistas se expresan por millón de tokens de entrada; la tercera usa solicitudes. El precio efectivo de las fichas incorpora el uso observado, donde caché y descuentos pueden separarlo del precio publicado. [[9]](https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b/pricing)

**Cómo seguirlo:** fijá el benchmark y el eje de precio antes de comparar. El precio de entrada deja fuera la salida y otros componentes de tu factura; el promedio por solicitudes depende del tamaño de esas solicitudes. Ninguno equivale sin más a costo por tarea resuelta.

Show Pareto ayuda a encontrar opciones que no quedan superadas simultáneamente en las dos dimensiones elegidas. Si dos candidatos tienen la misma nota y uno cuesta menos, el más caro queda dominado en ese gráfico. Esa conclusión puede cambiar al agregar latencia, confiabilidad, permisos o desempeño en español. La frontera visible tampoco representa modelos que el gráfico no incluyó.

El enlace View all benchmarks lleva a un catálogo más amplio con familias Agents, Media, Artifacts, Reasoning y Search. Sus experimentos pueden evaluar también herramientas, motores de búsqueda y presupuestos. Revisá la ejecución concreta: la última fecha general del catálogo no actualiza retrospectivamente cada tarjeta. [[8]](https://openrouter.ai/benchmarks)

### 7 Fastest models

Tiene dos modos: Highest throughput y Lowest latency. El tooltip de elegibilidad admite modelos con al menos 100.000 solicitudes en las últimas 24 horas. Ese umbral describe quién puede aparecer; por sí solo no especifica cómo se agregaron todos los valores de rendimiento.

Throughput expresa la velocidad de generación en tokens por segundo. La latencia requiere leer su definición en la vista correspondiente: esperar el primer token y recibir la respuesta completa son experiencias distintas. Las fichas de rendimiento de OpenRouter distinguen TTFT y medidas de latencia; no conviene asumir que todos los paneles usan el mismo percentil o ventana. [[10]](https://openrouter.ai/docs/guides/best-practices/latency-and-performance) [[11]](https://openrouter.ai/amazon/nova-2-lite-v1/performance)

**Cómo seguirlo:** compará el mismo endpoint, contexto y configuración. Para una respuesta larga importa la velocidad sostenida; para una interacción breve puede dominar la espera inicial. En un agente, sumá además herramientas, turnos y reintentos. Un modelo rápido escribiendo puede tardar más en terminar el trabajo.

No atribuyas automáticamente el mejor rendimiento de un proveedor a todos los que sirven ese modelo. Si la vista no declara el percentil, la ventana o la ponderación entre proveedores, conservá esa limitación en la comparación.

### 8 Languages

Permite segmentar por idioma natural y alternar magnitud absoluta o porcentaje. Los datos por idioma proceden de muestras extrapoladas; la referencia pública los trata como estimaciones semanales. La cuota se interpreta dentro del idioma seleccionado, no sobre todos los idiomas. [[7]](https://openrouter.ai/docs/api/api-reference/datasets/daily-token-totals-for-top-50-models)

**Cómo seguirlo:** para un producto en español, mirá español aunque el panorama general esté dominado por inglés. Después probá tareas reales: comprensión de consignas, registro, regionalismos, extracción y fidelidad de las respuestas. El tráfico en un idioma no evalúa por sí mismo la calidad en ese idioma.

Una conversación puede mezclar idiomas, código y citas. Sin una definición publicada del clasificador y su error, cambios pequeños merecen cautela. La extrapolación da una estimación de volumen; no elimina el sesgo de selección ni garantiza representatividad de todo uso del español.

### 9 Programming

Aplica una lectura similar a lenguajes de programación, con Python como selección inicial en la revisión. Muestra uso por tokens en una muestra clasificada. Las vistas absolutas y porcentuales conservan la unidad del segmento, que no es una tasa de resolución de problemas. [[1]](https://openrouter.ai/rankings) [[7]](https://openrouter.ai/docs/api/api-reference/datasets/daily-token-totals-for-top-50-models)

**Cómo seguirlo:** compará el lenguaje de tu repositorio y cruzalo con Coding Index o un benchmark de código pertinente. Eso arma una lista de candidatos. La prueba propia debe incluir comprensión del proyecto, un cambio con tests, un bug y una revisión de diff.

Que un modelo aparezca mucho en Python puede reflejar la integración de una aplicación o el volumen de un usuario intensivo. Tampoco identifica framework, dificultad, versión ni resultado final. Un cambio de participación justifica investigar; para reemplazar el modelo hace falta verificar una mejora.

### 10 Context Length

Cuenta solicitudes por la longitud observada de prompt y completion. El selector ofrece menos de 1K, 1K a 10K, 10K a 100K, 100K a 1M y 1M a 10M tokens. La unidad del gráfico es solicitudes, con vista absoluta o porcentual. [[1]](https://openrouter.ai/rankings)

**Cómo seguirlo:** elegí el tramo de tus cargas de trabajo. Ver uso con entradas y salidas extensas puede indicar que vale la pena probar un modelo para documentos largos o repositorios grandes. La ventana máxima anunciada requiere una consulta separada a la ficha del modelo.

La capacidad nominal, la longitud realmente utilizada y la calidad al recuperar información son tres mediciones diferentes. Para validar contexto largo, usá datos relevantes ubicados en distintas partes del material y verificá relaciones entre ellos. Caber en el límite no demuestra comprensión.

### 11 Tool Calls

Presenta la distribución de actividad de herramientas entre modelos. El filtro público tool_calling identifica solicitudes donde se registró al menos una llamada; eso no permite equiparar automáticamente solicitudes con cantidad de llamadas individuales. Al exportar datos, conservá el campo contado por esa vista. [[7]](https://openrouter.ai/docs/api/api-reference/datasets/daily-token-totals-for-top-50-models)

**Cómo seguirlo:** usalo para identificar modelos presentes en flujos con herramientas. Después medí selección de herramienta, argumentos válidos, interpretación del resultado, recuperación de errores y respeto de permisos.

Más actividad puede acompañar un agente útil o un loop improductivo. También puede cambiar por cómo el harness divide una operación. La cuota del gráfico no revela qué porcentaje de llamadas tuvo éxito ni qué porcentaje de todo el tráfico de ese modelo usó herramientas.

### 12 Images

Dentro de Text, Images muestra imágenes procesadas por modelos y permite alternar volumen o participación. Es importante distinguir este bloque de la pestaña superior Image, orientada a generación de imágenes. El dataset documenta por separado entrada image y salida image_output. [[1]](https://openrouter.ai/rankings) [[7]](https://openrouter.ai/docs/api/api-reference/datasets/daily-token-totals-for-top-50-models)

**Cómo seguirlo:** para entender capturas, facturas o gráficos, mirá el uso multimodal y armá pruebas de lectura concretas. Para generar ilustraciones, elegí la pestaña de generación y sus evaluaciones correspondientes.

Una solicitud puede contener más de una imagen. Cantidad de imágenes, solicitudes con imágenes y tokens de imagen no son intercambiables. Y procesar muchas imágenes no demuestra exactitud en OCR, conteo, interpretación espacial o seguimiento visual de instrucciones.

### 13 Top Apps

Ordena aplicaciones y agentes que participan en la atribución pública de uso. El volumen está expresado en tokens y el selector permite cambiar el período. Las apps ocultas o privadas quedan fuera; el dataset puede reunir aliases de una misma aplicación. [[2]](https://openrouter.ai/docs/cookbook/administration/data-api)

**Cómo seguirlo:** cruzalo con los movimientos de modelos. Una integración grande puede alterar la demanda sin que haya cambiado el modelo. La app añade instrucciones, herramientas, memoria y routing, por lo que conviene evaluarla como sistema.

El ranking no cuenta instalaciones, usuarios activos ni toda la actividad de una aplicación fuera de OpenRouter. Tampoco todos los controles llamados trending comparten fórmula: la API de apps describe crecimiento absoluto excedente frente a tres períodos previos, mientras el ranking de modelos compara crecimiento porcentual entre dos ventanas. [[2]](https://openrouter.ai/docs/cookbook/administration/data-api)

## Las otras pestañas también cambian la unidad

La barra superior permite salir de Text. En Image, Video, Speech, Embeddings, Rerank y Transcription, las tablas se ordenan por solicitudes y el gráfico superior puede ofrecer otra unidad. Batch parte de subsolicitudes y también permite ordenar por tokens. Verificá cuál de los dos componentes cambia con cada selector. [[13]](https://openrouter.ai/rankings/image) [[14]](https://openrouter.ai/rankings/video) [[15]](https://openrouter.ai/rankings/speech) [[16]](https://openrouter.ai/rankings/embeddings) [[17]](https://openrouter.ai/rankings/rerank) [[18]](https://openrouter.ai/rankings/transcription) [[19]](https://openrouter.ai/rankings/batch)

- **Image:** el gráfico alterna solicitudes e imágenes. Una solicitud que devuelve varias imágenes cuenta una vez en la tabla por solicitudes.

- **Video:** solicitudes u horas en el gráfico. Un número de solicitudes no informa duración total, resolución ni costo de los clips.

- **Speech:** solicitudes en la vista revisada. Para una prueba propia importan también duración del audio, inteligibilidad, pronunciación y seguimiento del estilo.

- **Embeddings:** solicitudes o tokens en el gráfico. Evaluá además la recuperación con tu corpus; más volumen no demuestra mejores vecinos semánticos.

- **Rerank:** solicitudes o documentos. Un pedido puede reordenar muchos documentos, así que ambos volúmenes responden preguntas distintas.

- **Transcription:** el gráfico alterna solicitudes y caracteres; la tabla conserva solicitudes. Evalúa el uso de transcripción de voz a texto. Para elegir, medí errores sobre audios representativos, acentos y condiciones acústicas.

- **Batch:** el selector Subrequests o Tokens modifica tanto el gráfico como la tabla. Ofrece filtro de texto, embeddings o todas las modalidades. Las subsolicitudes cuentan el trabajo dentro de los lotes, no el número de lotes. Agregá tiempo de finalización, fallos y costo al comparar alternativas.

Las primeras seis pestañas incluyen Top Models, Leaderboard y Market Share. Esta última conserva solicitudes por autor. Batch incluye las dos primeras. No todas las modalidades replican las trece secciones de Text.

En las tablas se mantienen controles de período como Today, This Week, This Month y New & Trending. La disponibilidad de un control no basta para atribuirle todos los umbrales y reglas del ranking de texto; verificá la nota metodológica de esa modalidad antes de reutilizar su cálculo.

## Cinco errores que cambian una decisión

- **Confundir participación y crecimiento.** Pasar de 10% a 15% es ganar 5 puntos porcentuales y crecer 50% respecto de la cuota inicial. Indicá cuál calculaste.

- **Leer una cuota sin su total.** Un segmento puede ganar participación mientras cae su volumen. Guardá ambos cuando estén disponibles.

- **Comparar cortes distintos.** Un día parcial, un cierre UTC y una semana de clasificación no describen exactamente el mismo período.

- **Tratar ausencia como cero.** Un modelo fuera del top visible, sin datos suficientes o sin puntaje publicado puede ser simplemente no observable en esa vista.

- **Explicar correlaciones como causas.** Un lanzamiento, una oferta gratuita o un cambio de routing son hipótesis hasta contar con evidencia adicional.

El límite más importante atraviesa toda la guía: **el uso observado ayuda a elegir candidatos; la aptitud para nuestro trabajo se comprueba con resultados.** OpenRouter también recomienda contrastar benchmarks generales con prompts reales y costo por tarea completada. [[12]](https://openrouter.ai/blog/tutorials/choose-best-ai-model/)

## Una rutina de seguimiento que termina en una prueba

No hace falta mirar todos los paneles cada día. Conviene mantener una pregunta estable y usar las secciones que aportan evidencia para responderla.

1. **Definir el trabajo.** Por ejemplo, revisar cambios de un backend en Python con tests disponibles y sin acceso a producción. Acordar qué cuenta como éxito antes de ver las respuestas.

2. **Elegir el segmento.** Abrir Code Review, Programming en Python y el tramo de contexto habitual. Usar el ranking general como contexto.

3. **Guardar la observación.** Registrar fecha de consulta, fecha de datos, unidad, filtro, período, variante exacta y fuente. Si se usa la API, conservar también los metadatos.

4. **Armar una lista breve.** Incluir el modelo actual, un candidato de costo menor y otro que prometa mayor capacidad. Un pico de uso alcanza para entrar a la prueba, no para ganar.

5. **Fijar condiciones comparables.** Mismo conjunto de casos, contexto, herramientas, presupuesto y criterios de evaluación. Registrar proveedor, esfuerzo y límites; documentar cualquier diferencia necesaria.

6. **Medir el resultado completo.** Éxito, errores relevantes, intentos, tiempo hasta un resultado utilizable, costo total y revisión humana. Contar también fallos y abandonos.

7. **Repetir donde haya variación.** Usar varios intentos cuando corresponda, conservar los casos difíciles y revisar las diferencias pequeñas con prudencia. Separar mejoras consistentes de una buena ejecución aislada.

8. **Tomar una decisión reversible.** Mantener, probar en un entorno acotado o reemplazar. Definir qué deterioro justificaría volver al modelo anterior y cuándo revisar otra vez.

La métrica económica interna puede ser tan concreta como gasto de todos los intentos dividido por tareas aceptadas. Por ejemplo, USD 12 para 30 tareas aceptadas da USD 0,40 por tarea aceptada. Un segundo modelo que gastó USD 9 pero sólo cerró 15 queda en USD 0,60. El precio por token no hacía visible esa diferencia.

El costo de revisión humana conviene registrarlo aparte y, si importa para la decisión, incorporarlo con un criterio explícito. No hace falta fingir una precisión que todavía no existe: un registro consistente vale más que una cifra muy exacta cuyo denominador cambia cada semana.

## Qué merece quedar en el registro

Una ficha útil puede ocupar diez líneas: objetivo; casos y criterio de aceptación; fecha; modelo y variante; proveedor; harness y herramientas; configuración; éxitos sobre intentos; costo y tiempo; decisión. Para el seguimiento público, agregá la vista exacta de OpenRouter y su unidad.

Si un panel no publica tamaño de muestra, incertidumbre, ventana o tratamiento de caché y descuentos, anotá no publicado en vez de completar el hueco por intuición. El estudio histórico State of AI y un panel actual pueden usar taxonomías o métodos distintos; una explicación de 2025 no debe trasladarse automáticamente a la interfaz de 2026.

Para republicar datos, OpenRouter permite reutilización con atribución bajo CC BY 4.0. Guardá el snapshot, citá la fuente y su fecha real, y señalá tus transformaciones. Los ejemplos de respuesta de una documentación describen el formato: sus cifras no son observaciones actuales. [[2]](https://openrouter.ai/docs/cookbook/administration/data-api) [[20]](https://creativecommons.org/licenses/by/4.0/)

## Una política que sobreviva al próximo lanzamiento

El valor de Rankings está en reducir el espacio de búsqueda. Permite detectar dónde aumenta la actividad, qué tareas atraen inversión y qué alternativas merecen una evaluación. El beneficio aparece cuando esa observación termina en una prueba bien definida.

Para Golden Path, el criterio de cierre es práctico: **elegir la combinación de modelo, proveedor y harness que resuelva el trabajo con suficiente calidad, costo y control.** Conservar la evidencia de esa elección hace posible revisarla cuando cambie el catálogo, sin empezar de cero ni perseguir cada nuevo primer puesto.

## Fuentes y acceso directo

Fuentes oficiales consultadas el 3 de octubre de 2026. Los enlaces a Rankings abren vistas dinámicas; sus valores pueden cambiar después de esta revisión. Las capturas de referencia aportadas para la guía corresponden a la navegación de Text y a Top models by task.

1. [Rankings y controles de la interfaz](https://openrouter.ai/rankings)

2. [Data API y criterios del dataset público](https://openrouter.ai/docs/cookbook/administration/data-api)

3. [Auto Router y clasificación por tarea](https://openrouter.ai/docs/guides/routing/routers/auto-router)

4. [Presentación de la clasificación por gasto](https://openrouter.ai/blog/announcements/introducing-the-new-auto-router/)

5. [API de clasificaciones y denominadores](https://openrouter.ai/docs/api/api-reference/classifications/task-classification-market-share)

6. [Coste por sesión y por harness](https://openrouter.ai/docs/api/api-reference/datasets/cost-per-session-by-harness-and-model)

7. [Dataset de rankings y filtros](https://openrouter.ai/docs/api/api-reference/datasets/daily-token-totals-for-top-50-models)

8. [Catálogo de benchmarks](https://openrouter.ai/benchmarks)

9. [Ejemplo de ficha de precios efectivos y de lista](https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b/pricing)

10. [Latencia y rendimiento en OpenRouter](https://openrouter.ai/docs/guides/best-practices/latency-and-performance)

11. [Ejemplo de ficha de rendimiento](https://openrouter.ai/amazon/nova-2-lite-v1/performance)

12. [Cómo elegir un modelo según la tarea](https://openrouter.ai/blog/tutorials/choose-best-ai-model/)

13. [Rankings de generación de imágenes](https://openrouter.ai/rankings/image)

14. [Rankings de video](https://openrouter.ai/rankings/video)

15. [Rankings de voz](https://openrouter.ai/rankings/speech)

16. [Rankings de embeddings](https://openrouter.ai/rankings/embeddings)

17. [Rankings de reranking](https://openrouter.ai/rankings/rerank)

18. [Rankings de transcripción](https://openrouter.ai/rankings/transcription)

19. [Rankings de batch](https://openrouter.ai/rankings/batch)

20. [Licencia de reutilización de los datos](https://creativecommons.org/licenses/by/4.0/)

21. [Protocolo de VGI Bench](https://openrouter.ai/benchmarks/vgi-bench)

22. [Protocolo de tau2 Bench Airline](https://openrouter.ai/benchmarks/tau2-bench-airline/)

23. [Protocolo de GPQA Diamond](https://openrouter.ai/benchmarks/gpqa-diamond/)
