/* The capability passport.

   The organization seat shows the platform at the scale a buyer runs it.
   This shows the thing that makes the platform inevitable: one person's
   record, compounding across years and organizations, owned by them and
   carried out of every building they leave.

   A transcript is a list of things somebody sat. A resume is a claim with
   nothing behind it. This is neither: it is the work, still attached. */

const $ = id => document.getElementById(id)
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

function face(name, size = 44) {
  const initials = String(name).split(' ').slice(-2).map(w => w[0]).join('').toUpperCase()
  return `<span class="avatar" style="width:${size}px;height:${size}px;background:#E2C4B9;font-size:${Math.round(size * 0.34)}px">${initials}</span>`
}

const YEARS = ['2026', '2027', '2028', '2029', '2030', '2031', '2032']

const PASSPORT = {
  who: 'Amara Osei',
  line: 'Portable. Owned by her. Nothing here was awarded, and nothing here can be taken back by an institution.',
  places: [
    { org: 'SFBU · Applied Launch Studio', from: 0, to: 1, kind: 'Studied' },
    { org: 'Kado · Sites and Launch', from: 1, to: 4, kind: 'Worked' },
    { org: 'Meridian Labs · Product', from: 4, to: 6, kind: 'Works' },
  ],
  depth: {
    Perception: [1, 2, 2, 3, 3, 4, 4],
    Systems: [0, 1, 2, 2, 3, 3, 4],
    Reasoning: [1, 2, 3, 3, 4, 4, 4],
    Execution: [1, 2, 2, 3, 3, 3, 4],
    Growth: [1, 1, 2, 3, 3, 4, 4],
    Decision: [0, 1, 2, 3, 3, 4, 4],
    Creation: [1, 1, 2, 2, 3, 3, 3],
    Perspective: [0, 1, 1, 2, 3, 3, 4],
  },
  works: [
    { year: '2026', org: 'SFBU', title: 'Launch concept. Kado.', showed: 'Growth, Reasoning, Perspective', live: true },
    { year: '2027', org: 'SFBU', title: 'Capstone. Retail siting under uncertainty.', showed: 'Systems, Decision' },
    { year: '2028', org: 'Kado', title: 'Corner two site recommendation.', showed: 'Decision, Perspective' },
    { year: '2029', org: 'Kado', title: 'Pricing memo, reversed on the retention data.', showed: 'Growth, Reasoning' },
    { year: '2031', org: 'Meridian', title: 'Category narrative for a launch that moved twice.', showed: 'Creation, Growth' },
  ],
  claims: [
    { attr: 'Growth', band: 'Well evidenced', by: 'Accepted by Kado, then by Meridian Labs', on: 'Refreshed 2031' },
    { attr: 'Decision', band: 'Well evidenced', by: 'Accepted by two hiring teams', on: 'Refreshed 2030' },
    { attr: 'Perspective', band: 'Supported', by: 'Accepted by Meridian Labs', on: 'Refreshed 2032' },
    { attr: 'Creation', band: 'Supported', by: 'Published, not yet claimed by anyone', on: 'Faded 2029, refreshed 2031' },
  ],
  travels: ['Every observation, with the passage it quoted', 'Her reasoning, in her own words', 'Every conclusion the system drew about her', 'Her disputes, permanently'],
  stays: ['The briefs each organization wrote', 'Their rubrics and role context', 'Their own commercial data'],
  case: [
    { k: '41', v: 'pieces of real work read across six years' },
    { k: '0', v: 'examinations sat, hours proctored, or self-assessments filed' },
    { k: '3', v: 'organizations that accepted a claim she carried in with her' },
  ],
  flywheel: [
    'Ordinary work is read, so evidence accrues without anyone stopping to be assessed.',
    'The record gets denser, so the reading gets sharper and the next brief gets better aimed.',
    'She carries it out the door, so the next organization inherits a person who is already legible.',
    'Which makes her more valuable there, and the work she is given harder, and the record denser still.',
  ],
}

function depthGrid() {
  const rows = Object.entries(PASSPORT.depth)
  return `<div class="pp-grid">
    <div class="pp-row pp-head"><span></span>${YEARS.map(y => `<span class="pp-year">${y}</span>`).join('')}</div>
    ${rows.map(([attr, vals]) => `<div class="pp-row">
      <span class="pp-attr">${attr}</span>
      ${vals.map((v, i) => `<span class="pp-cell b${v}" title="${attr} · ${YEARS[i]}"></span>`).join('')}
    </div>`).join('')}
  </div>`
}

function placesBand() {
  const span = YEARS.length
  return `<div class="pp-places">${PASSPORT.places.map(p => `
    <div class="pp-place" style="grid-column:${p.from + 1} / ${Math.min(p.to + 2, span + 1)}">
      <span class="pp-kind">${p.kind}</span><span class="pp-org">${esc(p.org)}</span>
    </div>`).join('')}</div>`
}

export function renderPassport() {
  const host = $('passportView')
  if (!host) return
  host.innerHTML = `<div class="ppwrap">
    <div class="pp-head-row">
      ${face(PASSPORT.who, 46)}
      <div>
        <span class="ovl f">Capability passport</span>
        <h2 class="pp-title">${esc(PASSPORT.who)}</h2>
      </div>
      <div class="pp-line">${esc(PASSPORT.line)}</div>
    </div>
    <div class="org-illus">Seeded forward from the session running on the Student tab. The first row of work is the one happening right now.</div>

    <div class="card pp-card">
      <div class="org-cardhead"><span class="ovl">Six years, one record</span>
        <span class="org-note">where she was, and what the work evidenced</span></div>
      ${placesBand()}
      ${depthGrid()}
      <div class="org-read">No year here contains an examination. Every cell is work she was doing anyway, read as it happened.</div>
    </div>

    <div class="pp-two">
      <div class="card pp-card">
        <div class="org-cardhead"><span class="ovl">The work behind it</span></div>
        ${PASSPORT.works.map(w => `<div class="pp-work${w.live ? ' live' : ''}">
          <span class="pp-wyear">${w.year}</span>
          <div><div class="pp-wtitle">${esc(w.title)}${w.live ? '<i>live in this session</i>' : ''}</div>
            <div class="pp-wshowed">${esc(w.org)} · ${esc(w.showed)}</div></div>
        </div>`).join('')}
      </div>
      <div class="card pp-card">
        <div class="org-cardhead"><span class="ovl">Claims she carried</span>
          <span class="org-note">published by her, accepted by them, and they fade</span></div>
        ${PASSPORT.claims.map(c => `<div class="pp-claim">
          <div class="pp-cattr">${esc(c.attr)}<span>${esc(c.band)}</span></div>
          <div class="pp-cby">${esc(c.by)}</div>
          <div class="pp-con">${esc(c.on)}</div>
        </div>`).join('')}
      </div>
    </div>

    <div class="card pp-card pp-own">
      <div class="org-cardhead"><span class="ovl">Ownership splits by layer</span></div>
      <div class="pp-owncols">
        <div><span class="ovl f">Travels with her</span>
          ${PASSPORT.travels.map(t => `<div class="pp-o">${esc(t)}</div>`).join('')}</div>
        <div><span class="ovl f">Stays with the organization</span>
          ${PASSPORT.stays.map(t => `<div class="pp-o stay">${esc(t)}</div>`).join('')}</div>
      </div>
    </div>

    <div class="pp-case">
      <div class="pp-stats">${PASSPORT.case.map(s => `<div class="pp-stat">
        <div class="pp-statk">${esc(s.k)}</div><div class="pp-statv">${esc(s.v)}</div></div>`).join('')}</div>
      <div class="card pp-card pp-fly">
        <div class="org-cardhead"><span class="ovl">Why it compounds</span></div>
        ${PASSPORT.flywheel.map((f, i) => `<div class="pp-flyrow"><span>${i + 1}</span><p>${esc(f)}</p></div>`).join('')}
        <div class="pp-punch">A transcript records what a person sat. A resume records what they claim. This records what they did, and it is still attached.</div>
      </div>
    </div>
  </div>`
}
