/* The organization seat.

   The student surface answers "what can this person do". This one answers the
   questions the person who signs the contract actually asks: where is
   capability thick and thin across my workforce, which work is at risk
   because nobody has ever demonstrated what it needs, who do I put on it,
   and what did any of this change.

   Two lenses over the same engine, because the first buyer is undecided:
   an employer (Kado) and an institution (SFBU). Same components, same
   reading, different nouns. Seeded for this conversation. */

const $ = id => document.getElementById(id)
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

function avatarHTML(name, size = 26) {
  const initials = String(name).split(' ').filter(w => /^[A-Za-z]/.test(w)).slice(-2).map(w => w[0]).join('').toUpperCase()
  const tint = ['#EFDCD4', '#E2C4B9', '#DCD3C4', '#D6DBD2', '#E4DCE6'][[...String(name)].reduce((a, c) => a + c.charCodeAt(0), 0) % 5]
  return `<span class="avatar" style="width:${size}px;height:${size}px;background:${tint};font-size:${Math.round(size * 0.36)}px">${initials}</span>`
}

const ATTRS = ['Perception', 'Systems', 'Reasoning', 'Execution', 'Growth', 'Decision', 'Creation', 'Perspective']

const LENS = {
  enterprise: {
    key: 'enterprise',
    org: 'Kado',
    seat: 'Priya Raman · VP Brand and Sites',
    unitWord: 'team', unitsWord: 'teams', personWord: 'people',
    stats: [
      { k: '38', v: 'people read this quarter, from work they were doing anyway' },
      { k: '1,240', v: 'observations, each quoting the passage it came from' },
      { k: '9 days', v: 'median time to a person\'s first evidenced capability' },
    ],
    units: [
      { name: 'Sites and Launch', n: 7, marks: [3, 2, 3, 4, 0, 3, 1, 1] },
      { name: 'Brand', n: 5, marks: [2, 1, 2, 2, 0, 1, 4, 2] },
      { name: 'Operations', n: 12, marks: [3, 4, 2, 4, 1, 2, 0, 1] },
      { name: 'Engineering', n: 9, marks: [4, 4, 3, 4, 1, 2, 1, 0] },
      { name: 'Finance', n: 5, marks: [2, 3, 4, 3, 0, 3, 0, 1] },
    ],
    risks: [
      { work: 'Corner two site decision', when: 'signs in 6 weeks', needs: ['Decision', 'Perspective'], gap: 'Perspective', note: 'Whoever takes it has to tell Elena the interchange is the wrong first corner. Nobody on Sites and Launch has evidenced writing toward a named person\'s objection.' },
    ],
    query: 'Who can tell a founder they are wrong, and put the cost in writing?',
    candidates: [
      { name: 'Theo Marchetti', unit: 'Sites and Launch', bands: 'Perspective · Supported. Decision · Supported.', quote: 'Elena will read this as walking away from the road. It is not. It is choosing the corner we can win first.', when: 'Corner two memo, two months ago' },
      { name: 'Dani Okafor', unit: 'Operations', bands: 'Decision · Supported. Perspective · Noticed.', quote: 'Hold the second shift until the Fruitvale lease clears. We eat a month of momentum and open with parking we control.', when: 'Staffing plan, five weeks ago' },
    ],
    growth: [
      { name: 'Theo Marchetti', series: [1, 1, 2, 2, 3, 3, 4], note: 'Perspective, seven months' },
      { name: 'Dani Okafor', series: [0, 1, 1, 2, 2, 2, 3], note: 'Decision, seven months' },
      { name: 'Ines Park', series: [0, 0, 1, 1, 1, 2, 2], note: 'Reasoning, seven months' },
      { name: 'Amara Osei', series: [0, 0, 0, 0, 0, 1, 2], note: 'Growth, from this week', live: true },
    ],
    moves: [
      'Give the corner two site call to someone who will have to tell Elena she is wrong, and read what happens. That is the only way Perspective gets evidenced on this team.',
      'Stop sending Operations to the decision-making workshop. Four of them already carry Decision at Supported. The gap is Growth, and no workshop produces it.',
      'Pair the Series A narrative with someone who has reversed a position in public. There is one on the payroll and she is on a studio placement.',
    ],
    ledger: [
      { who: 'Theo Marchetti', attr: 'Perspective', band: 'Supported', to: 'Accepted by two hiring teams', on: 'Jun 2026' },
      { who: 'Dani Okafor', attr: 'Decision', band: 'Supported', to: 'Accepted by one hiring team', on: 'Apr 2026' },
      { who: 'Marcus Bell', attr: 'Execution', band: 'Emerging', to: 'Faded, not refreshed', on: 'Nov 2025', faded: true },
    ],
  },
  university: {
    key: 'university',
    org: 'SFBU',
    seat: 'Prof. Marisol Vega · Applied Launch Studio',
    unitWord: 'studio', unitsWord: 'studios', personWord: 'learners',
    stats: [
      { k: '412', v: 'learners read this term, from work they were doing anyway' },
      { k: '8,900', v: 'observations, each quoting the passage it came from' },
      { k: '2 days', v: 'median time to a learner\'s first evidenced capability' },
    ],
    units: [
      { name: 'Applied Launch', n: 31, marks: [3, 2, 4, 3, 2, 3, 3, 1] },
      { name: 'Product Design', n: 44, marks: [3, 2, 2, 2, 1, 2, 4, 2] },
      { name: 'Data and Decisions', n: 38, marks: [4, 4, 4, 4, 1, 3, 0, 0] },
      { name: 'Venture Studio', n: 22, marks: [2, 2, 3, 2, 2, 4, 2, 2] },
      { name: 'Communication', n: 51, marks: [2, 1, 2, 1, 1, 1, 4, 3] },
    ],
    risks: [
      { work: 'Employer partner review', when: '3 weeks', needs: ['Growth', 'Perspective'], gap: 'Growth', note: 'Partners ask for people who change their mind on evidence. Growth is the thinnest column in the school, because most work here is never wrong in a way that has to be repaired.' },
    ],
    query: 'Which learners can hold a position under pressure, with the reason on the page?',
    candidates: [
      { name: 'Amara Osei', unit: 'Applied Launch', bands: 'Growth · Noticed. Perspective · Noticed.', quote: 'The rewrite sells a shorter wait. We are not selling a wait at all. That is the position.', when: 'Launch concept, this week', live: true },
      { name: 'Jun Watanabe', unit: 'Venture Studio', bands: 'Growth · Supported. Decision · Supported.', quote: 'I was wrong about the pricing floor. The retention data does not support it and I am moving.', when: 'Pricing memo, last term' },
    ],
    growth: [
      { name: 'Jun Watanabe', series: [0, 1, 1, 2, 3, 3, 4], note: 'Growth, two terms' },
      { name: 'Fatima Haddad', series: [1, 2, 2, 3, 3, 4, 4], note: 'Reasoning, two terms' },
      { name: 'Leo Marchetti', series: [0, 0, 1, 1, 2, 2, 2], note: 'Decision, two terms' },
      { name: 'Amara Osei', series: [0, 0, 0, 0, 0, 1, 2], note: 'Growth, from this week', live: true },
    ],
    moves: [
      'Growth is the thinnest column in the school. It is not taught, it is occasioned: give learners work that is wrong in one place and let them find it. The Applied Launch brief already does this and its Growth column shows it.',
      'Communication carries Creation at four and Systems at one. The work in that studio never asks anyone to hold two parts of an argument together. Change the work, not the learners.',
      'Data and Decisions has no evidence in Creation or Perspective. Those learners will meet employers who ask for both.',
    ],
    ledger: [
      { who: 'Jun Watanabe', attr: 'Growth', band: 'Supported', to: 'Accepted by three employers', on: 'May 2026' },
      { who: 'Fatima Haddad', attr: 'Reasoning', band: 'Well evidenced', to: 'Accepted by two employers', on: 'Mar 2026' },
      { who: 'Priya Anand', attr: 'Decision', band: 'Emerging', to: 'Faded, not refreshed', on: 'Sep 2025', faded: true },
    ],
  },
}

let lens = 'enterprise'

/* ---------- pieces ---------- */

function statBand(L) {
  return `<div class="org-stats">${L.stats.map(s => `<div class="org-stat">
    <div class="org-statk">${esc(s.k)}</div><div class="org-statv">${esc(s.v)}</div></div>`).join('')}</div>`
}

function matrix(L) {
  const dark = ATTRS.map((_, i) => L.units.filter(u => u.marks[i] === 0).length)
  const thinnest = ATTRS[dark.indexOf(Math.max(...dark))]
  return `<div class="card org-card">
    <div class="org-cardhead"><span class="ovl">Where capability is evidenced</span>
      <span class="org-note">${L.units.length} ${L.unitsWord} · eight elemental attributes</span></div>
    <div class="org-matrix">
      <div class="org-mrow org-mhead"><span></span>${ATTRS.map(a => `<span class="org-mattr">${a.slice(0, 4)}</span>`).join('')}</div>
      ${L.units.map(u => `<div class="org-mrow">
        <span class="org-munit">${esc(u.name)}<i>${u.n}</i></span>
        ${u.marks.map((m, i) => `<span class="org-cell b${m}" title="${ATTRS[i]} · ${m ? 'evidenced' : 'no evidence'}"></span>`).join('')}
      </div>`).join('')}
    </div>
    <div class="org-read">${esc(thinnest)} is dark on ${Math.max(...dark)} of ${L.units.length} ${L.unitsWord}. That is a fact about the work those ${L.unitsWord} do, not about the ${L.personWord} in them.</div>
  </div>`
}

function risks(L) {
  return `<div class="card org-card">
    <div class="org-cardhead"><span class="ovl">Work at risk</span>
      <span class="org-note">what is coming, against what has been demonstrated</span></div>
    ${L.risks.map(r => `<div class="org-risk${r.gap ? ' gap' : ''}">
      <div class="org-riskhead"><span class="org-riskwork">${esc(r.work)}</span><span class="org-when">${esc(r.when)}</span></div>
      <div class="org-needs">${r.needs.map(n => `<span class="org-need${n === r.gap ? ' missing' : ''}">${esc(n)}</span>`).join('')}
        <span class="org-verdict">${r.gap ? 'no evidence for ' + esc(r.gap) : 'covered'}</span></div>
      <div class="org-risknote">${esc(r.note)}</div>
    </div>`).join('')}
  </div>`
}

function staffing(L) {
  return `<div class="card org-card">
    <div class="org-cardhead"><span class="ovl">Who has done this before</span>
      <span class="org-note">answered from evidence, not from a profile someone wrote about themselves</span></div>
    <div class="org-query">${esc(L.query)}</div>
    ${L.candidates.map((c, i) => `<div class="org-cand">
      <div class="org-candrank">${avatarHTML(c.name, 34)}</div>
      <div class="org-candbody">
        <div class="org-candname">${esc(c.name)}<span class="org-candunit">${esc(c.unit)}</span>${c.live ? '<span class="org-live">live in this session</span>' : ''}</div>
        <div class="org-candbands">${esc(c.bands)}</div>
        <div class="org-candquote">${esc(c.quote)}</div>
        <div class="org-candwhen">${esc(c.when)}</div>
      </div>
    </div>`).join('')}
    <div class="org-read">Every line above quotes work the person actually did. Nothing here is self-reported, and nothing here came from an assessment anyone sat.</div>
  </div>`
}

/* ---------- render ---------- */

export function renderOrg() {
  const host = $('orgView')
  if (!host) return
  const L = LENS[lens]
  host.innerHTML = `<div class="orgwrap">
    <div class="org-head">
      <div>
        <span class="ovl f">${esc(L.seat)}</span>
        <h2 class="org-title">${esc(L.org)} · capability, read from work</h2>
      </div>
      <div class="org-lens">
        <button data-lens="enterprise" class="${lens === 'enterprise' ? 'on' : ''}">Employer</button>
        <button data-lens="university" class="${lens === 'university' ? 'on' : ''}">Institution</button>
      </div>
    </div>
    <div class="org-illus">Seeded for this conversation. The student surface is live; this one shows the same reading at the scale a ${lens === 'enterprise' ? 'workforce' : 'school'} would run it.</div>
    ${statBand(L)}
    ${matrix(L)}
    <div class="org-two">${risks(L)}${staffing(L)}</div>
    <div class="org-punch">The work has to change, not the ${esc(L.personWord)}.</div>
  </div>`

  host.querySelector('.org-lens').addEventListener('click', e => {
    const b = e.target.closest('button')
    if (!b) return
    lens = b.dataset.lens
    renderOrg()
  })
}

export function setLens(next) { lens = next; renderOrg() }
