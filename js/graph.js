/* The knowledge graph.

   The platform's premise is that a person grows in elemental attributes, and
   that the only way to refine those is a graph of the person built from what
   they actually do. This module is that graph.

   Every node is state the platform holds. Every edge is a link it can defend:

     source   --bears on-->  section     authored in the pack, not inferred
     section  --cites-->     observation the observation quotes that passage
     observation --evidences--> attribute the engine's rule fired
     dispute  --contests-->  observation the person said so, permanently

   Nothing here infers. An attribute with no path to evidence is drawn empty
   and says what would fill it, which is a statement about the work that has
   not happened, never about the person.

   The layout is deterministic, four columns left to right, because the data
   genuinely flows that way and a physics simulation would turn a legible
   argument into a hairball. */

import { DOMAINS } from './scenario.js'

const COLS = [
  { key: 'source', label: 'Read' },
  { key: 'section', label: 'Made' },
  { key: 'evidence', label: 'Evidenced' },
  { key: 'attribute', label: 'Profile' },
]

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const clip = (s, n) => (String(s).length > n ? String(s).slice(0, n - 1).trim() + '…' : String(s))
const bandStep = c => (c <= 0 ? 0 : c === 1 ? 1 : c === 2 ? 2 : c <= 4 ? 3 : 4)

/* ---------- build ---------- */

export function buildGraph({ record, prov, sources, counts }) {
  const nodes = []
  const edges = []
  const add = (n) => { nodes.push(n); return n }

  for (const s of sources) {
    add({ id: 'src:' + s.id, col: 'source', label: s.label, kind: 'source', detail: s.body })
  }

  for (const [id, p] of prov.entries()) {
    add({ id: 'sec:' + id, col: 'section', label: p.heading, kind: 'section',
      state: p.state, detail: p.text || '' })
    for (const s of sources) {
      if ((s.bearsOn || []).includes(id)) edges.push({ from: 'src:' + s.id, to: 'sec:' + id, kind: 'bears on' })
    }
  }

  for (const o of record.observations) {
    const id = 'obs:' + o.id
    add({ id, col: 'evidence', label: `${o.signal} · ${o.domainName}`, kind: 'observation',
      disputed: o.disputed, detail: o.because, quote: o.quote, elapsed: o.elapsed,
      disputeReason: o.disputeReason })
    if (prov.has(o.section)) edges.push({ from: 'sec:' + o.section, to: id, kind: 'cites' })
    edges.push({ from: id, to: 'att:' + o.domainId, kind: 'evidences' })
  }

  /* Intake that was deliberately not read as capability. It belongs in the
     graph, with no edge to any attribute, because that absence is the point. */
  for (const c of record.captured) {
    const id = 'cap:' + c.id
    add({ id, col: 'evidence', label: clip(c.what, 34), kind: 'capture', detail: c.what })
    if (c.link?.sectionId && prov.has(c.link.sectionId)) edges.push({ from: 'sec:' + c.link.sectionId, to: id, kind: 'captured from' })
    if (c.link?.sourceId) edges.push({ from: 'src:' + c.link.sourceId, to: id, kind: 'captured from' })
  }

  for (const d of DOMAINS) {
    const n = counts[d.id] || 0
    add({ id: 'att:' + d.id, col: 'attribute', label: d.name, kind: 'attribute',
      step: bandStep(n), count: n, reads: d.reads, grows: d.grows, signal: d.signal })
  }

  return { nodes, edges }
}

/* ---------- layout ---------- */

function layout(graph, W) {
  const padTop = 26, rowGap = 26, padBottom = 14
  const colX = [14, W * 0.30, W * 0.56, W * 0.83]
  const byCol = COLS.map(c => graph.nodes.filter(n => n.col === c.key))
  const rows = Math.max(1, ...byCol.map(g => g.length))
  const H = padTop + rows * rowGap + padBottom

  const pos = new Map()
  byCol.forEach((group, ci) => {
    const span = (group.length - 1) * rowGap
    const start = padTop + (rows * rowGap - rowGap - span) / 2
    group.forEach((n, i) => pos.set(n.id, { x: colX[ci], y: start + i * rowGap, ci }))
  })
  return { pos, H, colX }
}

/* ---------- render ---------- */

export function graphSVG(graph, { width = 700, focus = null } = {}) {
  const { pos, H, colX } = layout(graph, width)
  const near = new Set()
  if (focus) {
    near.add(focus)
    for (const e of graph.edges) {
      if (e.from === focus) near.add(e.to)
      if (e.to === focus) near.add(e.from)
    }
  }
  const dim = id => (focus && !near.has(id) ? ' dim' : '')

  const edgePaths = graph.edges.map(e => {
    const a = pos.get(e.from), b = pos.get(e.to)
    if (!a || !b) return ''
    const mx = (a.x + b.x) / 2
    const lit = focus && (e.from === focus || e.to === focus)
    return `<path d="M${a.x + 6} ${a.y} C${mx} ${a.y}, ${mx} ${b.y}, ${b.x - 6} ${b.y}"
      class="ge${lit ? ' lit' : (focus ? ' dim' : '')}" fill="none"/>`
  }).join('')

  const nodeMarks = graph.nodes.map(n => {
    const p = pos.get(n.id)
    if (!p) return ''
    const labelRight = n.col !== 'attribute'
    const tx = labelRight ? p.x + 11 : p.x - 11
    const anchor = labelRight ? 'start' : 'end'
    const maxChars = n.col === 'section' ? 26 : n.col === 'evidence' ? 30 : 24
    let mark
    if (n.kind === 'attribute') {
      mark = n.step
        ? `<circle cx="${p.x}" cy="${p.y}" r="6" fill="var(--b${n.step})"/>`
        : `<circle cx="${p.x}" cy="${p.y}" r="6" fill="var(--paper)" stroke="var(--hair)" stroke-width="1.5"/>`
    } else if (n.kind === 'capture') {
      mark = `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="none" stroke="var(--faint)" stroke-width="1.5"/>`
    } else if (n.kind === 'observation') {
      mark = n.disputed
        ? `<circle cx="${p.x}" cy="${p.y}" r="5" fill="var(--paper)" stroke="var(--signal)" stroke-width="1.6"/>`
        : `<circle cx="${p.x}" cy="${p.y}" r="5" fill="var(--signal)"/>`
    } else if (n.kind === 'source') {
      mark = `<rect x="${p.x - 4.5}" y="${p.y - 4.5}" width="9" height="9" rx="1.5" fill="var(--graphite)"/>`
    } else {
      const st = { unwritten: 'var(--dim)', untested: 'var(--b1)', checked: 'var(--b2)', reworked: 'var(--b3)' }[n.state] || 'var(--dim)'
      mark = `<rect x="${p.x - 5}" y="${p.y - 5}" width="10" height="10" rx="2" fill="${st}" stroke="var(--hair)" stroke-width="1"/>`
    }
    const sub = n.kind === 'attribute' && n.count ? ` <tspan class="gcount">${n.count}</tspan>` : ''
    return `<g class="gn${dim(n.id)}" data-node="${esc(n.id)}" tabindex="0" role="button"
        aria-label="${esc(n.label)}">
      <title>${esc(n.detail || n.label)}</title>
      ${mark}
      <text x="${tx}" y="${p.y + 3.5}" text-anchor="${anchor}" class="gl ${n.kind}">${esc(clip(n.label, maxChars))}${sub}</text>
    </g>`
  }).join('')

  const heads = COLS.map((c, i) => {
    const anchor = i === 3 ? 'end' : 'start'
    const x = i === 3 ? colX[i] - 11 : colX[i] - 4
    return `<text x="${x}" y="13" text-anchor="${anchor}" class="gh">${c.label}</text>`
  }).join('')

  return `<svg viewBox="0 0 ${width} ${H}" width="100%" class="kgraph" role="img"
    aria-label="Knowledge graph: sources read, passages made, evidence observed, attributes evidenced">
    ${heads}${edgePaths}${nodeMarks}
  </svg>`
}

/* ---------- detail for a focused node ---------- */

export function nodeDetail(graph, id) {
  const n = graph.nodes.find(x => x.id === id)
  if (!n) return null
  const inbound = graph.edges.filter(e => e.to === id)
  const outbound = graph.edges.filter(e => e.from === id)
  const label = nid => graph.nodes.find(x => x.id === nid)?.label || nid

  const rel = [
    ...inbound.map(e => `${e.kind} · ${label(e.from)}`),
    ...outbound.map(e => `${e.kind} · ${label(e.to)}`),
  ]

  if (n.kind === 'attribute') {
    return {
      title: n.label,
      kicker: `${n.signal} · ${n.reads}`,
      body: n.count
        ? `${n.count} observation${n.count === 1 ? ' points' : 's point'} here, each quoting the passage it came from.`
        : 'No evidence yet. This describes work that has not happened, not a limit in the person.',
      grows: n.grows,
      relations: rel,
    }
  }
  if (n.kind === 'observation') {
    return {
      title: n.label,
      kicker: n.disputed ? 'Disputed, and kept' : 'Observation',
      body: n.detail,
      quote: n.quote,
      note: n.disputed ? `Their dispute: ${n.disputeReason}` : '',
      relations: rel,
    }
  }
  if (n.kind === 'capture') {
    return { title: n.label, kicker: 'Captured', body: 'Taken in and deliberately not read as capability. It has no edge to any attribute, and that is the point.', relations: rel }
  }
  if (n.kind === 'section') {
    const states = { unwritten: 'Not yet written', untested: 'Drafted, still untested', checked: 'Questioned or checked', reworked: 'Made theirs' }
    return { title: n.label, kicker: states[n.state] || 'Passage', body: clip(n.detail, 300), relations: rel }
  }
  return { title: n.label, kicker: 'Source from the pack', body: n.detail, relations: rel }
}
