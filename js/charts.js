/* Charts for the record. Inline SVG, no libraries, the product's own palette.

   Honesty constraints carried into the drawing:
   - The radar's values are the engine's bands, stepped, never a smoother
     number than the reading actually has. Five axes, because five domains
     currently have readers; the three without readers are named beneath the
     chart rather than drawn at zero, which would read as weakness.
   - The timeline plots real elapsed time. Identity is carried by row, not
     color, and disputed observations are drawn hollow, present but marked.
   - The composition bar is sequential worked-ness in one hue, each segment
     labeled with its state in text, never color alone. */

import { DOMAINS } from './scenario.js'

/* All eight elemental attributes, every one with a reader in the engine. */
const LIVE_AXES = DOMAINS.map(d => ({ id: d.id, name: d.name }))
const BAND_STEPS = ['', 'Noticed', 'Emerging', 'Supported', 'Well evidenced']
const STEP = 360 / LIVE_AXES.length

const bandStep = c => (c <= 0 ? 0 : c === 1 ? 1 : c === 2 ? 2 : c <= 4 ? 3 : 4)

/* ---------- the radar: the record's shape at a glance ---------- */
export function radarSVG(counts, { size = 200, ringLabels = false } = {}) {
  const cx = size / 2, cy = size / 2
  const R = size / 2 - (ringLabels ? 44 : 40)
  const angle = i => (-90 + i * STEP) * Math.PI / 180
  const pt = (i, f) => [cx + Math.cos(angle(i)) * R * f, cy + Math.sin(angle(i)) * R * f]
  const poly = f => LIVE_AXES.map((_, i) => pt(i, f).map(v => v.toFixed(1)).join(',')).join(' ')

  const rings = [0.25, 0.5, 0.75, 1].map(f =>
    `<polygon points="${poly(f)}" fill="none" stroke="var(--hair)" stroke-width="1"/>`).join('')
  const spokes = LIVE_AXES.map((_, i) => {
    const [x, y] = pt(i, 1)
    return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="var(--hair)" stroke-width="1"/>`
  }).join('')

  const steps = LIVE_AXES.map(a => bandStep(counts[a.id] || 0))
  const data = LIVE_AXES.map((_, i) => pt(i, steps[i] / 4).map(v => v.toFixed(1)).join(',')).join(' ')
  const dots = LIVE_AXES.map((a, i) => {
    if (!steps[i]) return ''
    const [x, y] = pt(i, steps[i] / 4)
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="var(--signal)"><title>${a.name} · ${BAND_STEPS[steps[i]]}</title></circle>`
  }).join('')

  const labels = LIVE_AXES.map((a, i) => {
    const [x, y] = pt(i, 1.2)
    const anchor = Math.abs(x - cx) < 8 ? 'middle' : x > cx ? 'start' : 'end'
    const step = steps[i]
    return `<text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="${anchor}"
      font-size="8.5" letter-spacing=".07em" fill="${step ? 'var(--ink)' : 'var(--faint)'}"
      style="text-transform:uppercase">${a.name}</text>`
  }).join('')

  const ringText = ringLabels ? [1, 2, 3, 4].map(s => {
    const [x, y] = pt(0, s / 4)
    return `<text x="${(x + 5).toFixed(1)}" y="${(y - 3).toFixed(1)}" font-size="8" fill="var(--faint)">${BAND_STEPS[s]}</text>`
  }).join('') : ''

  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="The record's five readable domains, by evidence band">
    ${rings}${spokes}
    <polygon points="${data}" fill="var(--signal)" fill-opacity=".10" stroke="var(--signal)" stroke-width="1.5" stroke-linejoin="round"/>
    ${dots}${ringText}${labels}
  </svg>`
}

export const RADAR_CAPTION = 'All eight elemental attributes, at the confidence the evidence supports. Empty axes describe work not yet done.'

/* ---------- the session timeline: when each reading landed ---------- */
export function timelineSVG(record, now = Date.now()) {
  const W = 560, x0 = 96, xEnd = W - 14
  const rows = [...LIVE_AXES, { id: '__captured', name: 'Captured' }]
  const rowH = 24, top = 10
  const H = top + rows.length * rowH + 26
  const elapsedMax = Math.max(now - record.startedAt, 60_000)
  const x = ms => x0 + (Math.min(ms, elapsedMax) / elapsedMax) * (xEnd - x0)
  const rowY = id => top + rows.findIndex(r => r.id === id) * rowH + rowH / 2

  const grid = rows.map(r =>
    `<line x1="${x0}" y1="${rowY(r.id)}" x2="${xEnd}" y2="${rowY(r.id)}" stroke="var(--hair)" stroke-width="1"/>
     <text x="${x0 - 10}" y="${rowY(r.id) + 3}" text-anchor="end" font-size="9.5" letter-spacing=".07em"
       fill="var(--graphite)" style="text-transform:uppercase">${r.name}</text>`).join('')

  const dots = record.observations
    .filter(o => rows.some(r => r.id === o.domainId))
    .map(o => {
      const cxp = x(o.elapsed).toFixed(1), cyp = rowY(o.domainId)
      const t = `<title>${esc(o.because)}${o.quote ? ' · ' + esc(o.quote) : ''}${o.disputed ? ' · disputed' : ''}</title>`
      return o.disputed
        ? `<circle cx="${cxp}" cy="${cyp}" r="4.5" fill="var(--paper)" stroke="var(--signal)" stroke-width="1.5">${t}</circle>`
        : `<circle cx="${cxp}" cy="${cyp}" r="4.5" fill="var(--signal)">${t}</circle>`
    }).join('')

  const ticks = record.captured.map(c =>
    `<rect x="${(x(c.at - record.startedAt) - 1).toFixed(1)}" y="${rowY('__captured') - 5}" width="2" height="10"
       fill="var(--faint)"><title>${esc(c.what)} · captured, not read as capability</title></rect>`).join('')

  const axisY = top + rows.length * rowH + 8
  const mins = Math.max(1, Math.round(elapsedMax / 60_000))
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Every observation and capture, on real elapsed time">
    ${grid}${dots}${ticks}
    <text x="${x0}" y="${axisY + 6}" font-size="9" fill="var(--faint)">start</text>
    <text x="${xEnd}" y="${axisY + 6}" text-anchor="end" font-size="9" fill="var(--faint)">${mins} min</text>
  </svg>`
}

/* ---------- the artifact: how worked each section is ---------- */
export function compositionHTML(sections) {
  // sections: [{ heading, state: 'untested'|'checked'|'reworked', origin }]
  const color = { unwritten: '#F2F0EA', untested: '#E2C4B9', checked: '#D89076', reworked: '#C74E33' }
  const label = { unwritten: 'not yet written', untested: 'drafted, untested', checked: 'questioned or checked', reworked: 'made theirs' }
  return `<div class="compbar">
    ${sections.map(s => `
      <div class="seg">
        <div class="fill" style="background:${color[s.state]}"></div>
        <div class="seghead">${esc(s.heading)}</div>
        <div class="segstate">${s.origin === 'blank' && s.state === 'reworked' ? 'written by hand' : label[s.state]}</div>
      </div>`).join('')}
  </div>`
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
}
