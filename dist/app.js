const manifest = [
  { file: "hermes-como-agente-operativo.md", area: "Hermes", glyph: "✦", hue: "rgba(236,95,189,.24)" },
  { file: "hermes-preset-instalacion.md", area: "Hermes", glyph: "◇", hue: "rgba(168,106,255,.24)" },
  { file: "caso-hermes-operaciones.md", area: "Hermes", glyph: "◈", hue: "rgba(87,217,232,.22)" },
  { file: "backup-versionado-crm.md", area: "CRM versionado", glyph: "▣", hue: "rgba(237,195,94,.25)" },
  { file: "arquitectura-read-only.md", area: "CRM versionado", glyph: "⌁", hue: "rgba(87,217,232,.22)" },
  { file: "mapa-procesos-verificacion.md", area: "CRM versionado", glyph: "⌘", hue: "rgba(168,106,255,.24)" },
  { file: "01-orca-como-ade.md", area: "Orca", glyph: "◉", hue: "rgba(237,195,94,.25)" },
  { file: "02-workspaces-y-worktrees.md", area: "Orca", glyph: "⑂", hue: "rgba(87,217,232,.22)" },
  { file: "03-orquestacion.md", area: "Orca", glyph: "✣", hue: "rgba(236,95,189,.24)" },
  { file: "04-hosts-ssh.md", area: "Orca", glyph: "⌁", hue: "rgba(168,106,255,.24)" },
  { file: "05-agent-terminals.md", area: "Orca", glyph: "▤", hue: "rgba(87,217,232,.22)" },
  { file: "06-continuidad-y-observabilidad.md", area: "Orca", glyph: "◌", hue: "rgba(237,195,94,.25)" },
  { file: "07-setup-windows-wsl.md", area: "Orca", glyph: "⊞", hue: "rgba(168,106,255,.24)" },
  { file: "08-acceso-portatil.md", area: "Orca", glyph: "↗", hue: "rgba(87,217,232,.22)" },
  { file: "09-caso-cockpit-multiagente.md", area: "Orca", glyph: "◈", hue: "rgba(236,95,189,.24)" },
  { file: "modelos-guiados-entorno-politica.md", area: "Gobierno de agentes", glyph: "⚿", hue: "rgba(237,195,94,.25)" },
  { file: "terminal-vs-web-superficies-trabajo.md", area: "Gobierno de agentes", glyph: "⌨", hue: "rgba(87,217,232,.22)" },
  { file: "guia-escalado-modelos.md", area: "Gobierno de agentes", glyph: "△", hue: "rgba(168,106,255,.24)" },
  { file: "amp-fabrica-agentes-cloud.md", area: "Gobierno de agentes", glyph: "◌", hue: "rgba(87,217,232,.22)" },
  { file: "opendesign-direccion-visual-agentes.md", area: "Diseño agéntico", glyph: "✦", hue: "rgba(236,95,189,.24)" },
  { file: "opendesign-integracion-local-cli-proxy.md", area: "Diseño agéntico", glyph: "⌁", hue: "rgba(87,217,232,.22)" },
  { file: "caso-tablero-continuidad-operativa.md", area: "Casos de producto", glyph: "◌", hue: "rgba(87,217,232,.22)" },
  { file: "caso-widgets-crm-flujos-guiados.md", area: "Casos de producto", glyph: "◆", hue: "rgba(236,95,189,.24)" }
];

const areaOrder = ["Toda la biblioteca", "Gobierno de agentes", "Orca", "Diseño agéntico", "Hermes", "CRM versionado", "Casos de producto"];
const areaGlyphs = { "Toda la biblioteca": "◎", Hermes: "✦", "CRM versionado": "▣", Orca: "◉", "Gobierno de agentes": "⚿", "Diseño agéntico": "✦", "Casos de producto": "◆" };
const typeLabels = { concept: "Concepto", guide: "Guía", editorial: "Editorial", "case-study": "Caso real", collection: "Colección" };

const glossary = [
  { term: "ADE", definition: "Agent Development Environment: entorno pensado para ejecutar, organizar y supervisar agentes de desarrollo.", slug: "orca-como-ade" },
  { term: "Agente", definition: "Sistema que usa un modelo, instrucciones y herramientas para razonar y realizar acciones dentro de un alcance definido." },
  { term: "Agent-to-agent", definition: "Delegación entre agentes completos que trabajan en conversaciones y entornos separados, intercambian instrucciones o archivos y devuelven resultados.", slug: "amp-fabrica-agentes-cloud" },
  { term: "Amp", definition: "Entorno de desarrollo agéntico que reúne modelos, threads, máquinas remotas, Git y coordinación bajo una misma plataforma.", slug: "amp-fabrica-agentes-cloud" },
  { term: "CLI", definition: "Interfaz de línea de comandos. Permite trabajar con herramientas y agentes desde una terminal, con acceso directo al proyecto y su entorno.", slug: "terminal-vs-web-superficies-trabajo" },
  { term: "BYOK", definition: "Bring Your Own Key: modalidad donde el usuario aporta una clave API y el consumo se factura directamente en la cuenta del proveedor.", slug: "opendesign-integracion-local-cli-proxy" },
  { term: "CRM", definition: "Sistema que centraliza relaciones, datos y procesos comerciales. En estos casos también actúa como fuente de verdad operativa.", slug: "backup-versionado-crm" },
  { term: "Daemon", definition: "Proceso que permanece ejecutándose en segundo plano y sostiene servicios, sesiones o tareas aunque una interfaz se cierre.", slug: "continuidad-y-observabilidad" },
  { term: "DESIGN.md", definition: "Archivo portable que codifica colores, tipografía, composición y reglas visuales para que distintos agentes produzcan artefactos coherentes.", slug: "opendesign-direccion-visual-agentes" },
  { term: "Harness", definition: "El CLI o entorno que convierte las decisiones del modelo en acciones reales: leer archivos, editar código, ejecutar comandos o pedir permisos.", slug: "modelos-guiados-el-entorno-es-la-politica" },
  { term: "Hermes", definition: "Agente operativo que puede vivir en un servidor, conectarse a canales e integraciones y ejecutar tareas con continuidad.", slug: "hermes-agente-operativo" },
  { term: "MCP", definition: "Model Context Protocol: estándar para conectar agentes con herramientas y fuentes de datos mediante interfaces declaradas." },
  { term: "n8n", definition: "Plataforma de automatización visual usada para coordinar integraciones, webhooks y pasos entre distintos sistemas." },
  { term: "OpenDesign", definition: "Workspace local-first que combina agentes de código, skills, templates y sistemas DESIGN.md para producir artefactos visuales como archivos reales.", slug: "opendesign-direccion-visual-agentes" },
  { term: "Oracle", definition: "Rol de segunda opinión dentro de Amp, usado por el agente principal para consultar razonamiento, planificación o decisiones difíciles.", slug: "amp-fabrica-agentes-cloud" },
  { term: "Orb", definition: "Máquina remota, fresca y aislada donde un agente de Amp puede trabajar con código, herramientas y servicios aunque la computadora del usuario esté apagada.", slug: "amp-fabrica-agentes-cloud" },
  { term: "Runner", definition: "Máquina propia o administrada que Amp puede usar como entorno de ejecución en lugar de un Orb de su infraestructura.", slug: "amp-fabrica-agentes-cloud" },
  { term: "Orca", definition: "ADE y plano de control para organizar agentes, repositorios, workspaces, terminales y hosts sin reemplazar al modelo.", slug: "orca-como-ade" },
  { term: "SSH", definition: "Protocolo seguro para acceder y ejecutar trabajo en otra máquina o entorno, como WSL o un servidor remoto.", slug: "hosts-ssh" },
  { term: "The Dial", definition: "Selector de Amp que expresa cuánto esfuerzo requiere una tarea mediante los modos low, medium, high y ultra, independientemente del modelo asignado detrás.", slug: "amp-fabrica-agentes-cloud" },
  { term: "Thread", definition: "Conversación persistente de Amp que conserva contexto, decisiones, archivos y referencias al trabajo producido por el agente.", slug: "amp-fabrica-agentes-cloud" },
  { term: "Worktree", definition: "Copia de trabajo aislada de Git, asociada a una rama, que permite desarrollar tareas en paralelo sin mezclar archivos.", slug: "workspaces-y-worktrees" },
  { term: "Workspace", definition: "Frente de trabajo visible que agrupa tabs, terminales, editores y una tarea; no equivale por sí mismo al aislamiento de Git.", slug: "workspaces-y-worktrees" },
  { term: "WSL", definition: "Windows Subsystem for Linux: entorno Linux integrado en Windows donde pueden vivir repositorios, runtimes y agentes CLI.", slug: "setup-windows-wsl" }
];

const state = { entries: [], area: "Toda la biblioteca", type: "Todos", query: "", active: null };
const el = id => document.getElementById(id);

function parseFrontmatter(source) {
  if (!source.startsWith("---")) return { meta: {}, markdown: source };
  const end = source.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, markdown: source };
  const raw = source.slice(4, end).trim();
  const meta = {};
  raw.split("\n").forEach(line => {
    const idx = line.indexOf(":");
    if (idx < 0) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) value = value.slice(1, -1).split(",").map(v => v.trim()).filter(Boolean);
    meta[key] = value;
  });
  return { meta, markdown: source.slice(end + 4).trim() };
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function inline(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out;
}

function renderMarkdown(source) {
  const lines = source.replace(/\r/g, "").split("\n");
  let html = "", i = 0, list = null;
  const closeList = () => { if (list) { html += `</${list}>`; list = null; } };

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      closeList();
      const lang = line.slice(3).trim();
      const code = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      html += `<pre data-language="${escapeHtml(lang)}"><code>${escapeHtml(code.join("\n"))}</code></pre>`;
      i += 1;
      continue;
    }
    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?\s*:?-+/.test(lines[i + 1])) {
      closeList();
      const cells = row => row.replace(/^\s*\||\|\s*$/g, "").split("|").map(c => c.trim());
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes("|")) rows.push(cells(lines[i++]));
      html += `<table><thead><tr>${head.map(c => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) { closeList(); const n = heading[1].length; html += `<h${n}>${inline(heading[2])}</h${n}>`; i++; continue; }
    if (/^\s*[-*]\s+/.test(line)) {
      if (list !== "ul") { closeList(); list = "ul"; html += "<ul>"; }
      html += `<li>${inline(line.replace(/^\s*[-*]\s+/, ""))}</li>`; i++; continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      if (list !== "ol") { closeList(); list = "ol"; html += "<ol>"; }
      html += `<li>${inline(line.replace(/^\s*\d+\.\s+/, ""))}</li>`; i++; continue;
    }
    closeList();
    if (/^\s*---+\s*$/.test(line)) { html += "<hr>"; i++; continue; }
    if (line.startsWith("> ")) { html += `<blockquote>${inline(line.slice(2))}</blockquote>`; i++; continue; }
    if (!line.trim()) { i++; continue; }
    const paragraph = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,3})\s+/.test(lines[i]) && !/^\s*[-*]\s+/.test(lines[i]) && !/^\s*\d+\.\s+/.test(lines[i]) && !lines[i].startsWith("```") && !lines[i].startsWith("> ")) paragraph.push(lines[i++]);
    html += `<p>${inline(paragraph.join(" "))}</p>`;
  }
  closeList();
  return html;
}

async function loadEntries() {
  try {
    state.entries = await Promise.all(manifest.map(async item => {
      const response = await fetch(`content/${item.file}`);
      if (!response.ok) throw new Error(item.file);
      const raw = await response.text();
      const parsed = parseFrontmatter(raw);
      return { ...item, ...parsed.meta, raw, markdown: parsed.markdown, related: parsed.meta.related || [], tags: parsed.meta.tags || [] };
    }));
    state.entries.sort((a, b) => areaOrder.indexOf(a.area) - areaOrder.indexOf(b.area) || Number(a.order || 0) - Number(b.order || 0));
    el("entry-count").textContent = state.entries.length;
    renderNavigation();
    renderTypeFilters();
    renderCards();
    openFromHash();
  } catch (error) {
    el("cards").innerHTML = `<div class="empty-state"><h3>No pude cargar la biblioteca</h3><p>Falta el archivo ${escapeHtml(error.message)}.</p></div>`;
  }
}

function renderNavigation() {
  el("area-nav").innerHTML = areaOrder.map(area => `<button class="area-button" type="button" data-area="${area}" aria-current="${state.area === area}"><span>${areaGlyphs[area]}</span><span>${area}</span></button>`).join("");
  document.querySelectorAll("[data-area]").forEach(button => button.addEventListener("click", () => {
    state.area = button.dataset.area;
    renderNavigation();
    renderCards();
  }));
}

function renderTypeFilters() {
  const types = ["Todos", "concept", "guide", "editorial", "case-study"];
  el("type-filters").innerHTML = types.map(type => `<button class="filter-chip" type="button" data-type="${type}" aria-pressed="${state.type === type}">${type === "Todos" ? "Todos" : typeLabels[type]}</button>`).join("");
  document.querySelectorAll("[data-type]").forEach(button => button.addEventListener("click", () => {
    state.type = button.dataset.type;
    renderTypeFilters();
    renderCards();
  }));
}

function filteredEntries() {
  const q = state.query.trim().toLocaleLowerCase("es");
  return state.entries.filter(entry => {
    const inArea = state.area === "Toda la biblioteca" || entry.area === state.area;
    const inType = state.type === "Todos" || entry.type === state.type;
    const haystack = [entry.title, entry.summary, entry.area, ...(entry.tags || []), entry.markdown].join(" ").toLocaleLowerCase("es");
    return inArea && inType && (!q || haystack.includes(q));
  });
}

function renderCards() {
  const entries = filteredEntries();
  el("active-area").textContent = state.area;
  el("catalog-title").textContent = state.query ? `Resultados para “${state.query}”` : state.area === "Toda la biblioteca" ? "Elegí una puerta de entrada" : `Explorá ${state.area}`;
  el("cards").innerHTML = entries.map((entry, index) => `
    <button class="card" type="button" data-slug="${entry.slug}" style="--card-glow:${entry.hue}">
      <span class="card-top"><span class="card-index">${String(index + 1).padStart(2, "0")}</span><span class="type-pill">${typeLabels[entry.type] || "Entrada"}</span></span>
      <h3>${escapeHtml(entry.title)}</h3>
      <p>${escapeHtml(entry.summary || "")}</p>
      <span class="card-foot"><span>${entry.glyph} ${entry.area}</span><span class="card-arrow">→</span></span>
    </button>`).join("");
  el("empty-state").hidden = entries.length > 0;
  document.querySelectorAll("[data-slug]").forEach(card => card.addEventListener("click", () => openConcept(card.dataset.slug)));
}

function openConcept(slug, updateHash = true) {
  const entry = state.entries.find(item => item.slug === slug);
  if (!entry) return;
  state.active = entry;
  el("reader-area").textContent = entry.area;
  el("reader-title").textContent = entry.title;
  el("reader-type").textContent = typeLabels[entry.type] || "Entrada";
  el("reader-content").innerHTML = renderMarkdown(entry.markdown);
  const related = (entry.related || []).map(slug => state.entries.find(item => item.slug === slug)).filter(Boolean);
  el("reader-related").innerHTML = related.length ? `<p class="related-label">Seguí por acá</p><div class="related-list">${related.map(item => `<button type="button" data-related="${item.slug}">${escapeHtml(item.title)}</button>`).join("")}</div>` : "";
  document.querySelectorAll("[data-related]").forEach(button => button.addEventListener("click", () => openConcept(button.dataset.related)));
  if (!el("reader").open) el("reader").showModal();
  el("reader").querySelector(".reader-frame").scrollTop = 0;
  if (updateHash) history.replaceState(null, "", `#${entry.slug}`);
}

function closeReader() {
  if (el("reader").open) el("reader").close();
  state.active = null;
  history.replaceState(null, "", location.pathname + location.search);
}

function showToast(message) {
  const toast = el("toast");
  clearTimeout(showToast.timer);
  clearTimeout(showToast.cleanupTimer);
  toast.textContent = message;
  toast.classList.add("show");
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
    showToast.cleanupTimer = setTimeout(() => {
      if (!toast.classList.contains("show")) toast.textContent = "";
    }, 260);
  }, 2200);
}

async function copyMarkdown() {
  if (!state.active) return;
  try {
    await navigator.clipboard.writeText(state.active.raw);
    showToast("Contexto copiado en Markdown");
  } catch {
    const area = document.createElement("textarea");
    area.value = state.active.raw;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    showToast("Contexto copiado en Markdown");
  }
}

function downloadMarkdown() {
  if (!state.active) return;
  const blob = new Blob([state.active.raw], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.active.slug}.md`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Markdown descargado");
}

function openFromHash() {
  const slug = decodeURIComponent(location.hash.slice(1));
  if (slug) openConcept(slug, false);
}

function renderGlossary() {
  const query = el("glossary-search").value.trim().toLocaleLowerCase("es");
  const matches = glossary.filter(item => `${item.term} ${item.definition}`.toLocaleLowerCase("es").includes(query));
  el("glossary-count").textContent = query ? `${matches.length} ${matches.length === 1 ? "resultado" : "resultados"}` : `${glossary.length} conceptos esenciales`;
  el("glossary-results").innerHTML = matches.length ? matches.map(item => `
    <article class="glossary-item">
      <h3>${escapeHtml(item.term)}</h3>
      <p>${escapeHtml(item.definition)}</p>
      ${item.slug ? `<button type="button" data-glossary-slug="${item.slug}">Leer en contexto <span aria-hidden="true">→</span></button>` : ""}
    </article>`).join("") : `<div class="glossary-empty"><span>◇</span><p>No encontré ese concepto todavía.</p></div>`;
  document.querySelectorAll("[data-glossary-slug]").forEach(button => button.addEventListener("click", () => {
    closeGlossary();
    openConcept(button.dataset.glossarySlug);
  }));
}

function openGlossary() {
  el("glossary-panel").classList.add("open");
  el("glossary-panel").setAttribute("aria-hidden", "false");
  el("glossary-trigger").setAttribute("aria-expanded", "true");
  renderGlossary();
  requestAnimationFrame(() => el("glossary-search").focus());
}

function closeGlossary() {
  el("glossary-panel").classList.remove("open");
  el("glossary-panel").setAttribute("aria-hidden", "true");
  el("glossary-trigger").setAttribute("aria-expanded", "false");
}

function toggleGlossary() {
  el("glossary-panel").classList.contains("open") ? closeGlossary() : openGlossary();
}

el("search-input").addEventListener("input", event => { state.query = event.target.value; renderCards(); });
el("clear-filters").addEventListener("click", () => {
  state.area = "Toda la biblioteca";
  state.type = "Todos";
  state.query = "";
  el("search-input").value = "";
  renderNavigation();
  renderTypeFilters();
  renderCards();
});
el("close-reader").addEventListener("click", closeReader);
el("reader").addEventListener("click", event => { if (event.target === el("reader")) closeReader(); });
el("reader").addEventListener("cancel", event => { event.preventDefault(); closeReader(); });
el("copy-md").addEventListener("click", copyMarkdown);
el("download-md").addEventListener("click", downloadMarkdown);
el("glossary-trigger").addEventListener("click", toggleGlossary);
el("close-glossary").addEventListener("click", closeGlossary);
el("glossary-search").addEventListener("input", renderGlossary);
window.addEventListener("hashchange", openFromHash);
window.addEventListener("keydown", event => {
  if (event.key === "Escape" && el("glossary-panel").classList.contains("open")) {
    closeGlossary();
    el("glossary-trigger").focus();
    return;
  }
  if (event.key === "/" && document.activeElement !== el("search-input") && !el("reader").open) {
    event.preventDefault();
    el("search-input").focus();
  }
});

loadEntries();
