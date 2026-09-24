<script setup lang="ts">
import { MCP_PATH, MCP_SERVER_NAME, MCP_TOOLS } from '#shared/mcp'

const { entries } = useLibrary()
const config = useRuntimeConfig()
const { show: toast } = useToast()

const endpoint = `${config.public.siteUrl}${MCP_PATH}`
const tools = Object.values(MCP_TOOLS)

interface ClientSetup {
  id: string
  label: string
  /** Dónde va la configuración o qué pasos seguir. */
  where: string
  code?: string
  steps?: string[]
}

const clients: ClientSetup[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    where: 'En la terminal, dentro de cualquier proyecto:',
    code: `claude mcp add --transport http ${MCP_SERVER_NAME} ${endpoint}`,
  },
  {
    id: 'claude',
    label: 'Claude (web y desktop)',
    where: 'Desde la configuración de tu cuenta:',
    steps: [
      'Abrí Configuración → Conectores.',
      'Elegí «Agregar conector personalizado».',
      `Nombre: Golden Path · URL: ${endpoint}`,
      'No pide autenticación: la biblioteca es pública.',
    ],
  },
  {
    id: 'cursor',
    label: 'Cursor',
    where: 'En ~/.cursor/mcp.json (global) o .cursor/mcp.json (por proyecto):',
    code: JSON.stringify({ mcpServers: { [MCP_SERVER_NAME]: { url: endpoint } } }, null, 2),
  },
  {
    id: 'vscode',
    label: 'VS Code',
    where: 'En .vscode/mcp.json:',
    code: JSON.stringify({ servers: { [MCP_SERVER_NAME]: { type: 'http', url: endpoint } } }, null, 2),
  },
]

/** Parte una descripción en texto y `código` (las tools usan backticks). */
function withCode(value: string) {
  return value.split(/(`[^`]+`)/).filter(Boolean).map(part => ({
    code: part.startsWith('`'),
    text: part.replace(/^`|`$/g, ''),
  }))
}

const activeClient = ref(clients[0]!.id)
const current = computed(() => clients.find(client => client.id === activeClient.value) ?? clients[0]!)

const examples = [
  '¿Qué dice Golden Path sobre usar worktrees con varios agentes en paralelo?',
  'Revisá mi setup de agentes contra las entradas de gobierno de agentes y decime qué me falta.',
  'Explicame qué es un ADE según el glosario de Golden Path y dame la entrada donde se desarrolla.',
]

async function copy(value: string, what: string) {
  try {
    await navigator.clipboard.writeText(value)
    toast(`${what} copiado`)
  }
  catch {
    toast('No se pudo copiar: seleccioná el texto a mano')
  }
}

useHead({ title: 'Conectar agentes (MCP)' })
useSeoMeta({
  description: `Conectá Claude, Cursor o VS Code a Golden Path por MCP: tu agente puede buscar y leer las ${entries.length} entradas y el glosario mientras trabaja. Público, gratuito y de sólo lectura.`,
  ogTitle: 'Conectar agentes (MCP) · Golden Path',
  ogType: 'website',
})
</script>

<template>
  <main id="biblioteca" class="px-4 pb-20 pt-6 md:px-[clamp(22px,5vw,74px)] md:pb-24">
    <header class="mb-12 max-w-[60ch]">
      <p class="mb-2 text-[.78rem] font-bold uppercase tracking-[.16em] text-gold">
        Model Context Protocol
      </p>
      <h1 class="m-0 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-medium leading-[1.05]">
        Conectá tu agente
      </h1>
      <p class="mt-4 text-faint">
        Golden Path tiene un servidor MCP público. Conectalo una vez y tu agente puede buscar, leer y
        citar las {{ entries.length }} entradas y el glosario mientras trabaja, sin copiar y pegar.
        Es de sólo lectura, gratuito y no pide cuenta.
      </p>
      <NuxtLink
        to="/"
        class="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/11 bg-white/4 px-4 py-2.5 font-bold text-ink transition hover:brightness-110"
      >
        ← Volver al catálogo
      </NuxtLink>
    </header>

    <div class="grid max-w-[980px] gap-12">
      <!-- Endpoint -->
      <section aria-labelledby="endpoint">
        <h2 id="endpoint" class="m-0 mb-4 font-display text-[1.7rem] font-medium">Endpoint</h2>
        <div
          class="flex flex-col gap-3 rounded-2xl border border-gold/20 bg-white/2.5 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <code class="min-w-0 break-all font-mono text-[.95rem] text-gold-bright">{{ endpoint }}</code>
          <button
            type="button"
            class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2 text-[.85rem] font-bold text-[#21180b] transition hover:brightness-110 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-cyan"
            @click="copy(endpoint, 'Endpoint')"
          >
            <Icon name="lucide:copy" class="size-4" />
            Copiar URL
          </button>
        </div>
        <p class="mt-3 text-[.85rem] text-dim">
          Transporte Streamable HTTP, sin autenticación. El endpoint sólo acepta POST: si lo abrís en
          el navegador, te trae a esta página.
        </p>
      </section>

      <!-- Instalación por cliente -->
      <section aria-labelledby="instalar">
        <h2 id="instalar" class="m-0 mb-4 font-display text-[1.7rem] font-medium">Instalación</h2>

        <div role="tablist" aria-label="Cliente MCP" class="mb-4 flex flex-wrap gap-2">
          <button
            v-for="client in clients"
            :id="`tab-${client.id}`"
            :key="client.id"
            type="button"
            role="tab"
            :aria-selected="activeClient === client.id"
            :aria-controls="`panel-${client.id}`"
            class="rounded-full border px-4 py-1.5 text-[.85rem] font-semibold transition focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-cyan"
            :class="activeClient === client.id
              ? 'border-gold/45 bg-gold/12 text-gold-bright'
              : 'border-white/9 bg-white/2.5 text-faint hover:border-white/18 hover:text-ink'"
            @click="activeClient = client.id"
          >
            {{ client.label }}
          </button>
        </div>

        <div
          :id="`panel-${current.id}`"
          role="tabpanel"
          :aria-labelledby="`tab-${current.id}`"
          class="rounded-2xl border border-white/7.5 bg-white/2 p-5"
        >
          <p class="m-0 mb-3 text-[.9rem] text-faint">{{ current.where }}</p>

          <div v-if="current.code" class="relative">
            <pre
              class="m-0 overflow-x-auto rounded-xl border border-white/7 bg-[#0b0a18] p-4 pr-14 font-mono text-[.85rem] leading-[1.6] text-[#c9f5f4]"
            ><code>{{ current.code }}</code></pre>
            <button
              type="button"
              :aria-label="`Copiar configuración de ${current.label}`"
              title="Copiar"
              class="absolute right-2.5 top-2.5 grid size-9 place-items-center rounded-lg border border-white/10 bg-white/4 text-faint transition hover:border-gold/30 hover:text-gold-bright focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              @click="copy(current.code!, 'Configuración')"
            >
              <Icon name="lucide:copy" class="size-4" />
            </button>
          </div>

          <ol v-else-if="current.steps" class="m-0 list-decimal space-y-1.5 pl-5 text-[.92rem] text-[#c7c2d3]">
            <li v-for="step in current.steps" :key="step" class="break-words">{{ step }}</li>
          </ol>
        </div>
      </section>

      <!-- Tools -->
      <section aria-labelledby="herramientas">
        <h2 id="herramientas" class="m-0 mb-4 font-display text-[1.7rem] font-medium">Qué puede hacer tu agente</h2>
        <ul class="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
          <li
            v-for="tool in tools"
            :key="tool.name"
            class="rounded-2xl border border-white/7.5 bg-white/2 p-5"
          >
            <p class="m-0 font-display text-[1.15rem] font-medium text-gold-bright">{{ tool.title }}</p>
            <p class="m-0 mt-1 font-mono text-[.78rem] text-cyan">{{ tool.name }}({{ tool.params }})</p>
            <p class="m-0 mt-2.5 text-[.9rem] leading-[1.6] text-[#aaa5b7]">
              <template v-for="(part, index) in withCode(tool.description)" :key="index">
                <code v-if="part.code" class="rounded bg-white/6 px-1 py-px font-mono text-[.82em] text-gold-bright">{{ part.text }}</code>
                <template v-else>{{ part.text }}</template>
              </template>
            </p>
          </li>
        </ul>
      </section>

      <!-- Ejemplos -->
      <section aria-labelledby="ejemplos">
        <h2 id="ejemplos" class="m-0 mb-4 font-display text-[1.7rem] font-medium">Para probarlo</h2>
        <p class="m-0 mb-4 text-[.92rem] text-faint">
          Una vez conectado, pedíselo a tu agente con tus palabras. Por ejemplo:
        </p>
        <ul class="m-0 grid list-none gap-2.5 p-0">
          <li v-for="example in examples" :key="example">
            <button
              type="button"
              class="group flex w-full items-start gap-3 rounded-xl border border-white/7 bg-white/2 px-4 py-3 text-left text-[.92rem] text-[#c7c2d3] transition hover:border-gold/25 hover:bg-white/4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              @click="copy(example, 'Ejemplo')"
            >
              <span class="text-gold" aria-hidden="true">›</span>
              <span class="flex-1">{{ example }}</span>
              <Icon name="lucide:copy" class="mt-0.5 size-4 shrink-0 text-dim transition group-hover:text-gold-bright" />
            </button>
          </li>
        </ul>
      </section>

      <!-- Alternativas -->
      <section aria-labelledby="sin-mcp">
        <h2 id="sin-mcp" class="m-0 mb-4 font-display text-[1.7rem] font-medium">Sin MCP</h2>
        <p class="m-0 text-[.92rem] leading-[1.7] text-faint">
          Si tu herramienta no soporta MCP, pasale uno de estos archivos como contexto:
          <a href="/llms.txt" class="text-cyan underline-offset-4 hover:underline">llms.txt</a>
          (índice con resúmenes y enlaces) o
          <a href="/content.json" class="text-cyan underline-offset-4 hover:underline">content.json</a>
          (la biblioteca completa). Cada entrada también se puede copiar o descargar en Markdown desde
          su página.
        </p>
      </section>
    </div>
  </main>
</template>
