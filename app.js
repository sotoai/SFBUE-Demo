/* Evolv, the product. Two seats over one record.

   The student works in a document. Their own record fills in beside them as
   they go, from the work, and they can dispute any line of it. The teacher
   sets the brief and reads the same record from the other seat. There is no
   walkthrough here: the state is live, and both views read it. */

import { DOMAINS, WORLDS, PRODUCT, DRAFT, EVIDENCE_PACK, IMAGE_MOMENTS, BLOCK_TYPES, IMAGE_ACTIONS } from './js/scenario.js'
import { createRecord, bandFor, domainCounts, STRUCTURAL, observe, capture, dispute, relativeTime, GUARDRAILS } from './js/engine.js'
import { deriveInsights } from './js/insights.js'
import * as API from './js/api.js'

const $ = id => document.getElementById(id)
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const asEl = n => (n && n.nodeType === 1 ? n : n && n.parentElement) || null

/* ---------- session ---------- */
const S = {
  view: 'student',
  started: null,          // null until begun | 'blank' | 'foundations'
  record: createRecord('university'),
  intent: WORLDS.university.wants,
  busy: false,
}

/* Which blocks have had contradicting evidence surfaced against them, and
   which were already credited for a revision. Typing alone stays dark;
   typing after reading the evidence that contradicts you is Reasoning. */
const evidenceOpened = new Set()
const revisedBlocks = new Set()

/* Provenance: which sections began machine drafted, and what has touched
   them since. This is what lets a development insight say, honestly, that a
   drafted section stands untested: a fact about the document, decidable
   without a model, never an inference about the person. */
const PROV = new Map()
function touchBlock(blockId, how) {
  const p = PROV.get(blockId)
  if (p) p.touched.add(how)
}

/* Challenges pressed in research threads, for the insight that reads them. */
let threadChallenges = 0
const challengeTexts = []

function integrations() {
  $('intLang').className = 'integration' + (API.state.language ? '' : ' off')
  $('intLang').innerHTML = 'language <b>' + (API.state.language ? 'live' : 'prepared') + '</b>'
  $('intImg').className = 'integration' + (API.state.images ? '' : ' off')
  $('intImg').innerHTML = 'images <b>' + (API.state.images ? 'live' : 'prepared') + '</b>'
}

/* ---------- views ---------- */
function switchView(view) {
  S.view = view
  $('studentView').classList.toggle('hide', view !== 'student')
  $('teacherView').classList.toggle('hide', view !== 'teacher')
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.view === view))
  if (location.hash !== '#' + view) history.replaceState(null, '', '#' + view)
  hidePill(); hideAskForm()
  if (view === 'teacher') renderTeacher()
}
$('tabs').addEventListener('click', e => {
  const b = asEl(e.target)?.closest('button')
  if (b) switchView(b.dataset.view)
})
addEventListener('hashchange', () => {
  const v = location.hash === '#teacher' ? 'teacher' : 'student'
  if (v !== S.view) switchView(v)
})

/* ---------- the record, rendered for whoever is looking ---------- */

function recordSummary(counts) {
  const acts = []
  if (counts.reasoning) acts.push('changed her mind where the evidence demanded it')
  if (counts.growth) acts.push('held her ground where it did not')
  if (counts.decision) acts.push('named what the call costs')
  if (acts.length) return 'She ' + acts.slice(0, 2).join(', and ') + '.'
  if (counts.execution) return 'She checked her most confident claim against the log.'
  if (counts.creation) return 'She briefed an image to carry a specific point.'
  return 'Nothing yet. The record only speaks when there is work to point at.'
}

function domainRows(counts, { compressDark }) {
  const wrap = el('div', 'drows')
  const dark = DOMAINS.filter(d => !counts[d.id])
  for (const d of DOMAINS) {
    const n = counts[d.id] || 0
    if (!n && compressDark) continue
    const row = el('div', 'drow' + (n > 0 ? ' lit' : ''))
    row.dataset.domain = d.id
    const marks = [0, 1, 2, 3].map(i => `<i class="${i < Math.min(n, 4) ? 'on' : ''}"></i>`).join('')
    row.innerHTML = `<span class="nm" title="${esc(d.reads)}">${d.name}</span><span class="ladder">${marks}</span><span class="band">${n ? bandFor(n) : 'no evidence'}</span>`
    wrap.appendChild(row)
  }
  if (compressDark && dark.length) {
    wrap.appendChild(el('div', 'darkline', dark.length === DOMAINS.length
      ? 'All eight domains are dark. They stay dark until the work lights them.'
      : `${dark.length} more ${dark.length === 1 ? 'domain stays' : 'domains stay'} dark until the work lights ${dark.length === 1 ? 'it' : 'them'}.`))
  }
  return wrap
}

function observationCard(o, { disputable }) {
  const n = el('div', 'obs' + (o.disputed ? ' disputed' : ''))
  n.innerHTML = `<div class="sig">${o.signal} · ${o.domainName}</div>
    <div class="because">${esc(o.because)}</div>
    ${o.quote ? `<div class="quote">${esc(o.quote)}</div>` : ''}
    <div class="meta"><span>${relativeTime(o.elapsed)}</span>
      ${o.disputed || !disputable ? '' : `<button data-dispute="${o.id}">I disagree</button>`}</div>
    ${o.disputed ? `<div class="dispute">Disputed: ${esc(o.disputeReason)}</div>` : ''}`
  return n
}

/* Everything the insight rules read, assembled in one place. */
function buildInsightCtx() {
  const counts = domainCounts(S.record)
  const drafted = [...PROV.entries()]
    .filter(([, p]) => p.origin === 'drafted')
    .map(([id, p]) => ({ id, heading: p.heading, untested: p.touched.size === 0 && !evidenceOpened.has(id) }))
  return {
    counts,
    observations: S.record.observations,
    challenges: {
      refusals: counts.growth || 0,
      disputes: S.record.observations.filter(o => o.disputed).length,
      thread: threadChallenges,
    },
    challengeTexts: challengeTexts.slice(-3),
    drafted,
    packsOpened: openedPacks.size,
    working: S.record.observations.length > 0 || S.record.captured.length > 1
      || [...PROV.values()].some(p => p.touched.size > 0),
    name: WORLDS.university.learner.name.split(' ')[0],
  }
}

/* Insight cards. The learner gets the headline and can open the evidence;
   the teacher gets everything, plus what to do with it. */
function insightCards(container, insights, { seat }) {
  if (!insights.length) {
    container.appendChild(el('div', 'a', '<span style="color:var(--faint)">Insights appear as the work does.</span>'))
    return
  }
  for (const ins of insights) {
    const v = seat === 'teacher' ? ins.teacher : ins.learner
    const card = el('div', 'insight ' + ins.kind + (seat === 'teacher' ? ' open' : ''))
    card.innerHTML = `<div class="ihead">${esc(v.head)}</div>
      <div class="ibody">
        <div class="itext">${esc(v.body)}</div>
        ${ins.evidence.map(e => `<div class="iev"><span class="q">${esc(e.quote)}</span><span class="n">${esc(e.note)}</span></div>`).join('')}
        ${seat === 'teacher' && v.guidance ? `<div class="iguide"><span class="ovl f">What to do with this</span>${esc(v.guidance)}</div>` : ''}
      </div>`
    if (seat !== 'teacher') {
      card.querySelector('.ihead').addEventListener('click', () => card.classList.toggle('open'))
    }
    container.appendChild(card)
  }
}

/* The student's sidebar. Insights first, in a summary voice they can open;
   the record itself beneath. Dark domains are one quiet line, not eight
   rows of absence. */
function renderSidebar() {
  const body = $('sideBody')
  const counts = domainCounts(S.record)
  body.innerHTML = ''

  const insWrap = el('div', 'insights')
  insightCards(insWrap, deriveInsights(buildInsightCtx()), { seat: 'learner' })
  body.appendChild(insWrap)

  body.appendChild(el('div', 'sidesplit', 'The record behind it'))
  body.appendChild(domainRows(counts, { compressDark: true }))

  const obsWrap = el('div', 'obslist')
  for (const o of S.record.observations.slice().reverse()) {
    obsWrap.appendChild(observationCard(o, { disputable: true }))
  }
  body.appendChild(obsWrap)
  for (const c of S.record.captured.slice().reverse()) {
    body.appendChild(el('div', 'captured', esc(c.what) + ' · captured, not read as capability'))
  }
  if (S.record.observations.length || S.record.captured.length) {
    body.appendChild(el('div', 'side-foot', 'Every line points at a passage. Dispute any line and the dispute is kept.'))
  }
}

/* The teacher reads the same record, uncompressed: the dark rows are part of
   the map, and absence is never read as weakness. */
function renderTeacher() {
  const w = WORLDS.university
  $('teachBrief').innerHTML = `
    <div class="from"><span class="ovl f">To Amara Osei</span><span class="ovl f">Five working days</span></div>
    <div class="brief-body">${esc(w.brief)}</div>
    <div class="field">
      <span class="ovl">What you are trying to find out</span>
      <textarea id="intent">${esc(S.intent)}</textarea>
    </div>`
  $('teachBrief').querySelector('#intent').addEventListener('input', e => { S.intent = e.target.value })

  const t = $('teachRecord')
  const counts = domainCounts(S.record)
  t.innerHTML = ''
  t.appendChild(el('div', 'teach-line', esc(recordSummary(counts))))

  const insWrap = el('div', 'insights')
  insightCards(insWrap, deriveInsights(buildInsightCtx()), { seat: 'teacher' })
  t.appendChild(insWrap)

  t.appendChild(el('div', 'sidesplit', 'The record behind it'))
  t.appendChild(domainRows(counts, { compressDark: false }))
  const obsWrap = el('div', 'obslist')
  for (const o of S.record.observations.slice().reverse()) {
    obsWrap.appendChild(observationCard(o, { disputable: false }))
  }
  t.appendChild(obsWrap)
  for (const c of S.record.captured.slice().reverse()) {
    t.appendChild(el('div', 'captured', esc(c.what) + ' · captured, not read as capability'))
  }
  const g = el('div', 'card guard')
  g.innerHTML = `<span class="ovl">What this record can and cannot say</span>
    <ul>${GUARDRAILS.map(x => `<li>${x}</li>`).join('')}</ul>`
  t.appendChild(g)
}

function renderRecord() {
  renderSidebar()
  if (S.view === 'teacher') renderTeacher()
}

function flashDomain(domainId) {
  const row = $('sideBody')?.querySelector(`.drow[data-domain="${domainId}"]`)
  if (row) { row.classList.add('just'); setTimeout(() => row.classList.remove('just'), 1200) }
}

function record(hit, ctx) {
  const entry = observe(S.record, hit, ctx)
  if (entry) { renderRecord(); flashDomain(entry.domainId) }
  return entry
}

/* Disputes, inline where the line lives. */
$('sideBody').addEventListener('click', e => {
  const id = asEl(e.target)?.closest('button')?.dataset.dispute
  if (!id) return
  const btn = e.target.closest('button')
  const card = btn.closest('.obs')
  if (card.querySelector('.disputerow')) return
  const row = el('div', 'disputerow')
  row.innerHTML = `<input placeholder="What does this line have wrong? Your words.">`
  card.appendChild(row)
  const input = row.querySelector('input')
  input.focus()
  input.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') { row.remove(); return }
    if (ev.key !== 'Enter') return
    const reason = input.value.trim()
    if (!reason) return
    dispute(S.record, id, reason)
    renderRecord()
  })
})

/* ---------- margin notes ---------- */
function addNote(kind, ovl, title, body) {
  const m = $('margin')
  const n = el('div', 'note ' + kind)
  n.innerHTML = `<span class="ovl f">${ovl}</span>
    <div class="qtext">${esc(title)}</div>
    ${body ? `<div class="atext">${esc(body)}</div>` : '<div class="atext"><span class="think"><i></i><i></i><i></i></span></div>'}`
  m.prepend(n)
  return n
}

/* ---------- the assignment, the begin flow, and the canvas ----------

   The student reads the assignment first, then chooses how to begin: a blank
   page scaffolded with the brief's three decisions, or foundations drafted
   for them. Either way the canvas owns the screen afterward, and the
   assignment lives in a drawer they can pull up and put away. */

const openedPacks = new Set()

/* The brief and its evidence pack, rendered into any container. Opening a
   source is captured, not credited; opening the log arms the evidence wiring
   for the section it contradicts. */
function renderAssignment(container, { withActions }) {
  const w = WORLDS.university
  container.innerHTML = `
    <div class="from"><span class="ovl f">From ${esc(w.evaluator.name)} · Applied Launch Studio</span></div>
    <div class="brief-body">${esc(w.brief)}</div>
    <div class="packrow">
      <span class="ovl" style="margin-bottom:2px">The evidence pack</span>
      <div class="packsub">Four documents from Kado. Open any of them here, any time. Your draft should hold up against what they say.</div>
      <div class="packchips">${EVIDENCE_PACK.map(p => `<button data-pack="${p.id}">${esc(p.label)}</button>`).join('')}</div>
      <div class="packbody hide"></div>
    </div>
    ${withActions ? `
    <div class="beginrow">
      <button class="btn" data-begin="blank">Start from a blank page</button>
      <button class="btn solid" data-begin="foundations">Draft the foundations</button>
      <div class="beginhint">Foundations are a first pass at the three decisions, drafted for you to work against. Starting text is never read as your capability. What you do with it is.</div>
    </div>` : ''}`

  container.onclick = e => {
    const begin = asEl(e.target)?.closest('button[data-begin]')
    if (begin) { beginWork(begin.dataset.begin); return }
    const chip = asEl(e.target)?.closest('button[data-pack]')
    if (!chip) return
    const pack = EVIDENCE_PACK.find(p => p.id === chip.dataset.pack)
    const body = container.querySelector('.packbody')
    const already = chip.classList.contains('open')
    container.querySelectorAll('.packchips button').forEach(b => b.classList.remove('open'))
    if (already) { body.classList.add('hide'); return }
    chip.classList.add('open')
    body.classList.remove('hide')
    body.innerHTML = `<span class="ovl f">${esc(pack.label)}</span><p>${esc(pack.body)}</p>`
    if (pack.id === 'log') evidenceOpened.add('channel')
    if (!openedPacks.has(pack.id)) {
      openedPacks.add(pack.id)
      capture(S.record, `Opened ${pack.label}`)
      renderRecord()
    }
  }
}

/* The drawer: the assignment beside the work, put away in one click. */
function openDrawer() {
  renderAssignment($('drawerBody'), { withActions: false })
  $('drawer').classList.add('on')
  $('drawerVeil').classList.add('on')
}
function closeDrawer() {
  $('drawer').classList.remove('on')
  $('drawerVeil').classList.remove('on')
}
$('drawerClose').addEventListener('click', closeDrawer)
$('drawerVeil').addEventListener('click', closeDrawer)

/* Before the work: the assignment is the whole page, and the choice of how
   to begin is the only action on it. */
function renderBegin() {
  const c = $('doccol')
  c.innerHTML = ''
  const wrap = el('div', 'doc beginwrap')
  wrap.innerHTML = `<h1>Launch concept. ${PRODUCT.name}.</h1>
    <div class="docmeta">Read the assignment, then choose how to begin.</div>
    <div class="assignment"></div>`
  c.appendChild(wrap)
  renderAssignment(wrap.querySelector('.assignment'), { withActions: true })
  $('sideSub').textContent = 'Nothing is recorded while you read. The record starts with the work.'
}

function beginWork(mode) {
  S.started = mode
  for (const b of DRAFT) {
    if (b.id === 'first-year') continue
    PROV.set(b.id, { origin: mode === 'foundations' ? 'drafted' : 'blank', heading: b.heading, touched: new Set() })
  }
  capture(S.record, mode === 'foundations' ? 'Began from drafted foundations' : 'Began from a blank page')
  renderRecord()
  $('sideSub').textContent = 'Fills in as you work. Nothing else is collected.'
  renderCanvas()
  if (mode === 'foundations') draftFoundations()
}

/* Foundations, drafted live, one section at a time, so the person watches
   the first pass being written. The draft is a pre-data pass on purpose:
   testing it against the pack is the work. Any section that cannot be
   drafted live falls back to prepared text without comment. */
async function draftFoundations() {
  const questions = {
    audience: "Who is Kado's customer?",
    position: 'What should the brand stand for?',
    channel: "Where do the next two corners go? Start from the founder's January conviction about the road.",
  }
  for (const b of DRAFT) {
    if (!questions[b.id]) continue
    let p = document.querySelector(`p.body[data-block="${b.id}"]`)
    if (!p) return
    p.innerHTML = '<span class="think"><i></i><i></i><i></i></span>'
    const text = await API.draftSection(b.heading, questions[b.id], b.body)
    p = document.querySelector(`p.body[data-block="${b.id}"]`)
    if (!p) return
    p.textContent = text
  }
  const meta = document.querySelector('#doccol .doc .docmeta')
  if (meta && API.state.language) meta.textContent = 'Foundations drafted just now, before the data. Edit anything, and keep only what holds up against the pack.'
}

/* The canvas: the primary surface, labeled as what it is. */
function renderCanvas() {
  const c = $('doccol')
  c.innerHTML = ''

  const bar = el('div', 'canvasbar')
  bar.innerHTML = `<span class="ovl">Draft canvas</span>
    <span class="canvastitle">Launch concept. ${PRODUCT.name}.</span>
    <span class="grow"></span>
    <button class="ghostbtn" id="btnAssignment">assignment</button>`
  c.appendChild(bar)
  bar.querySelector('#btnAssignment').addEventListener('click', openDrawer)

  const doc = el('div', 'doc')
  const foundations = S.started === 'foundations'
  doc.innerHTML = `<div class="docmeta">${foundations
    ? 'Foundations drafted for you, before the data. Edit anything, and keep only what holds up against the pack.'
    : 'Your page. The three decisions from the brief are scaffolded below.'}</div>
    <div class="howto">Select any passage to update it, ask about it, tag it for research, or picture it. Your record fills in on the right as you work. The assignment stays one click away, top right.</div>`

  for (const b of DRAFT) {
    if (b.id === 'first-year') continue
    const block = el('div', 'block')
    block.dataset.block = b.id
    const ph = {
      audience: 'Who is Kado’s customer? Make the call, and support it from the pack.',
      position: 'What should the brand stand for? One clear position.',
      channel: 'Where do the next two corners go? Name the cost of your choice.',
    }[b.id] || 'Write here.'
    block.innerHTML = `<button class="gutter-add" title="Add below">+</button>
      <span class="ovl"><span class="tag">${b.tag ? esc(b.tag) + ' · ' : ''}</span>${b.heading}</span>
      <p class="body" contenteditable="true" spellcheck="false" data-block="${b.id}" data-ph="${esc(ph)}"></p>`
    doc.appendChild(block)
  }
  c.appendChild(doc)
}

/* Typing alone stays dark. Typing after opening the evidence that contradicts
   the passage is Reasoning, and the record can tell the two apart. */
let editSnapshot = null
document.addEventListener('focusin', e => {
  const p = asEl(e.target)?.closest('p.body')
  if (p) editSnapshot = { blockId: p.dataset.block, text: p.textContent }
})
document.addEventListener('focusout', e => {
  const p = asEl(e.target)?.closest('p.body')
  if (!p || !editSnapshot || editSnapshot.blockId !== p.dataset.block) return
  const changed = p.textContent.trim() !== editSnapshot.text.trim()
  // A revision needs something to revise: first words on a blank section are
  // writing, not a change of position, whatever was read beforehand.
  const hadText = editSnapshot.text.trim().length > 0
  const id = p.dataset.block
  editSnapshot = null
  if (!changed) return
  touchBlock(id, 'revised')
  renderRecord()
  if (!hadText || revisedBlocks.has(id)) return
  if (evidenceOpened.has(id)) {
    revisedBlocks.add(id)
    record(STRUCTURAL.revisedAfterEvidence({ evidenceOpened: true }),
      { quote: p.textContent.trim().slice(0, 120), section: id })
  }
})

/* ---------- selection pill ---------- */
let selInfo = null
function hidePill() { $('pill').classList.remove('on'); selInfo = null }

document.addEventListener('mouseup', e => {
  if (asEl(e.target)?.closest('#pill, #askform')) return
  setTimeout(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || S.view !== 'student') return hidePill()
    const text = sel.toString().trim()
    const p = asEl(sel.anchorNode)?.closest('p.body')
    if (!text || text.length < 4 || !p) return hidePill()
    const r = sel.getRangeAt(0).getBoundingClientRect()
    selInfo = { text, blockId: p.dataset.block, p }
    const pill = $('pill')
    pill.classList.add('on')
    const cx = r.left + r.width / 2
    pill.style.left = Math.min(Math.max(12, cx - pill.offsetWidth / 2), innerWidth - pill.offsetWidth - 12) + 'px'
    pill.style.top = Math.max(8, r.top - pill.offsetHeight - 10) + 'px'
  }, 10)
})

$('pill').addEventListener('click', async e => {
  const act = asEl(e.target)?.closest('button')?.dataset.act
  if (!act || !selInfo || S.busy) return
  const info = selInfo
  const pillRect = $('pill').getBoundingClientRect()
  hidePill()
  window.getSelection()?.removeAllRanges()
  if (act === 'ask') openAskForm(info, pillRect)
  if (act === 'update') await doUpdate(info)
  if (act === 'tag') await doTag(info)
  if (act === 'image') openBriefSheet(info)
})

/* ---------- ask, through an inline form rather than an OS dialog ---------- */
function hideAskForm() { $('askform').classList.remove('on') }
function openAskForm(info, at) {
  const f = $('askform')
  f.classList.add('on')
  f.style.left = Math.min(Math.max(12, at.left), innerWidth - 340) + 'px'
  f.style.top = Math.max(8, at.top) + 'px'
  const input = $('askInput')
  input.value = ''
  input.placeholder = 'Ask about this passage'
  input.focus()
  const go = () => { const q = input.value.trim(); if (!q) return; hideAskForm(); doAsk(info, q) }
  $('askGo').onclick = go
  input.onkeydown = ev => { if (ev.key === 'Enter') go(); if (ev.key === 'Escape') hideAskForm() }
}

async function doAsk(info, q) {
  S.busy = true
  info.p.innerHTML = info.p.innerHTML.replace(esc(info.text), `<span class="asked">${esc(info.text)}</span>`)
  const note = addNote('q', 'Asked about a passage', q, null)
  const fallback = 'The log is direct about it. Of 1,200 pilot sessions, 996 came from drivers who live within 3 miles of the corner. 36 began more than 40 miles from home, 3 percent of the pilot. The regulars are neighbors: 150 of 200 cannot plug in where they park at night.'
  const ans = await API.askAbout(info.text, q, fallback)
  note.querySelector('.atext').textContent = ans
  const contradicts = CONTRADICTS.test(ans)
  touchBlock(info.blockId, 'asked')
  record(STRUCTURAL.openedContradictingSource({ contradicts }),
    { quote: info.text.slice(0, 120), section: info.blockId })
  if (contradicts) evidenceOpened.add(info.blockId)
  renderRecord()
  S.busy = false
}

/* ---------- update: a suggestion never silently replaces a person's words */
async function doUpdate(info) {
  S.busy = true
  const block = info.p.closest('.block')
  const par = el('div', 'parallel')
  par.innerHTML = `<span class="ovl f">Suggested rewrite, not yet applied</span>
    <div class="text"><span class="think"><i></i><i></i><i></i></span></div>
    <div class="acts hide"><button class="btn small solid" data-a="keep">Use this</button>
      <button class="btn small" data-a="discard">Keep mine</button></div>
    <div class="whyrow"><input class="why" placeholder="Why are you keeping yours? One line."></div>`
  block.appendChild(par)
  const flawed = info.blockId === 'channel'
  const fallback = flawed
    ? 'Put the corners where the cars sleep on the street. Of 1,200 pilot sessions, 996 came from within 3 miles. The interchange can wait, and saying so costs the founder her highway story.'
    : 'Kado makes charging time productive and pleasant. In the 25 minutes your car needs, enjoy well made coffee in a thoughtfully designed space. Fast charging, without the wasted wait.'
  const instruction = flawed
    ? 'Make it correct against the evidence, and name the cost of the position.'
    : 'Tighten this passage for an executive reader.'
  const text = await API.rewrite(info.text, instruction, fallback)
  par.querySelector('.text').textContent = text
  par.querySelector('.acts').classList.remove('hide')
  S.busy = false

  par.addEventListener('click', ev => {
    const a = ev.target.closest('button')?.dataset.a
    if (a === 'keep') {
      info.p.textContent = info.p.textContent.replace(info.text, text)
      par.remove()
      touchBlock(info.blockId, 'updated')
      capture(S.record, 'Accepted a rewrite unchanged')
      renderRecord()
    }
    if (a === 'discard') {
      par.querySelector('.whyrow').classList.add('on')
      par.querySelector('.why').focus()
    }
  })
  const commitWhy = () => {
    const reason = par.querySelector('.why').value.trim()
    if (!reason) return
    par.remove()
    touchBlock(info.blockId, 'updated')
    record(STRUCTURAL.refusedRewrite({ reason }), { quote: reason, section: info.blockId })
  }
  par.querySelector('.why').addEventListener('keydown', ev => { if (ev.key === 'Enter') commitWhy() })
  // Blur commits the reason, except when focus is moving to a button inside
  // this proposal: clicking Use this must never be recorded as a refusal.
  par.querySelector('.why').addEventListener('blur', ev => {
    if (par.contains(ev.relatedTarget)) return
    commitWhy()
  })
}

/* ---------- research threads ----------
   Tagging opens a conversation, not a verdict. The person can ask, challenge,
   or reframe, and the thread holds its ground only where the evidence does.
   Nothing reaches the document except through a proposal the person accepts,
   refuses with a reason, or ignores. */

const CONTRADICTS = /996|1,?200|3 miles|3 percent|150|regular|neighbor/i

function threadTranscript(turns) {
  return turns.map(t => (t.who === 'you' ? 'THEM: ' : 'RESEARCH: ') + t.text).join('\n').slice(-3000)
}

function addTurn(note, thread, who, text) {
  const turns = note.querySelector('.turns')
  const t = el('div', 'turn ' + (who === 'you' ? 'you' : 'res'))
  if (text == null) t.innerHTML = '<span class="think"><i></i><i></i><i></i></span>'
  else { t.textContent = text; thread.turns.push({ who, text }) }
  turns.appendChild(t)
  turns.scrollTop = turns.scrollHeight
  return t
}

async function doTag(info) {
  S.busy = true
  const m = $('margin')
  const note = el('div', 'note thread')
  note.innerHTML = `<span class="ovl f">Research thread</span>
    <div class="qtext">${esc(info.text.slice(0, 90))}${info.text.length > 90 ? '…' : ''}</div>
    <div class="turns"></div>
    <div class="threadrow"><input placeholder="Ask, challenge, or reframe"></div>
    <div class="threadacts"><button data-t="integrate">Bring it into the doc</button><span class="tstate"></span></div>`
  m.prepend(note)
  const thread = { passage: info.text, blockId: info.blockId, p: info.p, turns: [] }

  touchBlock(info.blockId, 'researched')
  capture(S.record, 'Tagged a passage for research')
  renderRecord()

  const opening = addTurn(note, thread, 'research', null)
  const fallback = 'Two sources bear on this. The corridor count confirms the multiple: the Route 92 parcel sees roughly forty times Alder Street\'s passing traffic, at 3.1 times the rent. The dwell note from the fast chargers on that corridor says what the traffic does: drivers wait in their cars with the doors closed. Traffic is not visits.'
  const leads = await API.researchLeads(info.text, fallback)
  opening.remove()
  addTurn(note, thread, 'research', leads)
  if (CONTRADICTS.test(leads)) evidenceOpened.add(thread.blockId)
  S.busy = false

  const input = note.querySelector('.threadrow input')
  input.addEventListener('keydown', async ev => {
    if (ev.key !== 'Enter' || S.busy) return
    const q = input.value.trim()
    if (!q) return
    input.value = ''
    S.busy = true
    // Transcript is taken before the new question joins it, so the question
    // reaches the model once, as the next message, not twice.
    const transcript = threadTranscript(thread.turns)
    addTurn(note, thread, 'you', q)
    const holding = addTurn(note, thread, 'research', null)
    const replyFallback = 'The pack only goes so far here. What it does hold: 996 of 1,200 sessions came from within 3 miles, and 150 of 200 regulars cannot plug in where they park. Anything past that would need a source Kado does not have yet.'
    const ans = await API.researchReply(thread.passage, transcript, q, replyFallback)
    holding.remove()
    addTurn(note, thread, 'research', ans)
    if (CONTRADICTS.test(ans)) evidenceOpened.add(thread.blockId)
    threadChallenges += 1
    challengeTexts.push(q)
    renderRecord()
    S.busy = false
  })

  note.querySelector('[data-t="integrate"]').addEventListener('click', async () => {
    if (S.busy) return
    const state = note.querySelector('.tstate')
    if (!thread.turns.length) return
    // Never spend a model call on a proposal that cannot be shown.
    if (thread.p.closest('.block').querySelector('.parallel')) {
      state.textContent = 'resolve the open suggestion on this passage first'
      return
    }
    S.busy = true
    state.textContent = 'writing the revision'
    const current = thread.p.textContent.trim()
    const revised = await API.integrateResearch(current, threadTranscript(thread.turns))
    state.textContent = ''
    S.busy = false
    if (!revised) { state.textContent = 'could not draft a revision, the thread stands as notes'; return }
    proposeRevision(thread.p, thread.blockId, revised, 'Suggested revision, from your research')
  })
}

/* A proposal beside the person's words, never in place of them. Shared by
   research integration; the same consent shape the Update flow uses. */
function proposeRevision(p, blockId, text, label) {
  const block = p.closest('.block')
  if (block.querySelector('.parallel')) return
  const par = el('div', 'parallel')
  par.innerHTML = `<span class="ovl f">${esc(label)} · not yet applied</span>
    <div class="text">${esc(text)}</div>
    <div class="acts"><button class="btn small solid" data-a="keep">Use this</button>
      <button class="btn small" data-a="discard">Keep mine</button></div>
    <div class="whyrow"><input class="why" placeholder="Why are you keeping yours? One line."></div>`
  block.appendChild(par)
  par.addEventListener('click', ev => {
    const a = ev.target.closest('button')?.dataset.a
    if (a === 'keep') {
      p.textContent = text
      par.remove()
      touchBlock(blockId, 'updated')
      capture(S.record, 'Integrated a research revision unchanged')
      renderRecord()
    }
    if (a === 'discard') {
      par.querySelector('.whyrow').classList.add('on')
      par.querySelector('.why').focus()
    }
  })
  const commitWhy = () => {
    const reason = par.querySelector('.why').value.trim()
    if (!reason) return
    par.remove()
    record(STRUCTURAL.refusedRewrite({ reason }), { quote: reason, section: blockId })
  }
  par.querySelector('.why').addEventListener('keydown', ev => { if (ev.key === 'Enter') commitWhy() })
  // Blur commits the reason, except when focus is moving to a button inside
  // this proposal: clicking Use this must never be recorded as a refusal.
  par.querySelector('.why').addEventListener('blur', ev => {
    if (par.contains(ev.relatedTarget)) return
    commitWhy()
  })
}

/* ---------- images, briefed in the document rather than an OS dialog ---------- */
function openBriefSheet(info, container) {
  const block = container || info.p.closest('.block')
  if (block.querySelector('.briefsheet')) return
  const moment = IMAGE_MOMENTS[info.blockId] || IMAGE_MOMENTS.audience
  const sheet = el('div', 'briefsheet')
  sheet.innerHTML = `<span class="ovl f">What must this image show?</span>
    <textarea>${esc(moment.prompt)}</textarea>
    <div class="acts"><button class="btn small solid" data-a="go">Generate</button>
      <button class="btn small" data-a="cancel">Cancel</button>
      <span class="hint">Leave the brief as it is and the prepared image is served. Change it and it generates live.</span></div>`
  block.appendChild(sheet)
  const ta = sheet.querySelector('textarea')
  ta.focus()
  sheet.addEventListener('click', async ev => {
    const a = ev.target.closest('button')?.dataset.a
    if (a === 'cancel') sheet.remove()
    if (a === 'go') {
      const p = ta.value.trim()
      if (!p) return
      sheet.remove()
      await doImage(info, block, p, moment)
    }
  })
}

async function doImage(info, block, p, moment) {
  S.busy = true
  const fig = el('div', 'figure')
  block.appendChild(fig)
  const unchanged = p.trim() === moment.prompt.trim()
  const shortBrief = p.length > 150 ? p.slice(0, 150).trim() + '…' : p

  if (unchanged && moment.warm) {
    fig.innerHTML = `<img src="${moment.warm}" alt="concept image">
      <div class="cap">${esc(shortBrief)} <span style="color:var(--faint)">· prepared earlier</span></div>`
  } else {
    fig.innerHTML = `<div class="holding"><div class="el">0s</div>
      <div class="pr">${esc(shortBrief)}</div>
      <div class="st">${API.state.images ? 'generating now' : 'images not configured, showing the brief only'}</div></div>`
    const res = await API.generateImage(p, secs => { const t = fig.querySelector('.el'); if (t) t.textContent = secs + 's' })
    if (res.ok) {
      fig.dataset.url = res.url
      fig.innerHTML = `<img src="${res.url}" alt="generated concept image">
        <div class="cap">${esc(shortBrief)} <span style="color:var(--faint)">· generated live in ${res.seconds}s</span></div>`
    } else {
      const why = res.reason === 'not_configured'
        ? 'add MAGNIFIC_API_KEY to .env to generate this live'
        : 'generation unavailable, the brief stands in its place'
      const st = fig.querySelector('.st'); if (st) st.textContent = why
    }
  }

  attachImageBar(fig, { prompt: p, blockId: info.blockId })
  record(STRUCTURAL.briefedImageWithIntent({ prompt: p, intent: p.length > 40 ? p : '' }),
    { quote: shortBrief, section: info.blockId })
  S.busy = false
}

/* An image is rarely right on the first pass. The ways it can change sit
   with it, and instructions are typed inline, in the document's own voice. */
function attachImageBar(fig, ctx) {
  const bar = el('div', 'imgbar')
  bar.innerHTML = IMAGE_ACTIONS.map(a =>
    `<button data-a="${a.id}" title="${a.hint}" ${a.ready ? '' : 'disabled'}>${a.label}${a.ready ? '' : '<span class="soon">soon</span>'}</button>`
  ).join('') + '<span class="spacer"></span><span class="state"></span>'
  fig.appendChild(bar)

  const inlineInput = (placeholder, prefill, onCommit) => {
    if (fig.querySelector('.inline-instruction')) return
    const row = el('div', 'inline-instruction')
    row.innerHTML = `<input placeholder="${esc(placeholder)}">`
    fig.appendChild(row)
    const input = row.querySelector('input')
    input.value = prefill || ''
    input.focus()
    input.addEventListener('keydown', ev => {
      if (ev.key === 'Escape') { row.remove(); return }
      if (ev.key !== 'Enter') return
      const v = input.value.trim()
      if (!v) return
      row.remove()
      onCommit(v)
    })
  }

  bar.addEventListener('click', async e => {
    const a = asEl(e.target)?.closest('button')
    if (!a || a.disabled || S.busy) return
    const action = a.dataset.a
    const url = fig.dataset.url
    const state = bar.querySelector('.state')
    const img = fig.querySelector('img')

    if (action === 'rebrief') { inlineInput('A different brief for this image', ctx.prompt, next => { ctx.prompt = next; runImage(fig, ctx, next, bar) }); return }
    if (action === 'refine') { await runImage(fig, ctx, ctx.prompt, bar); return }
    if (!url) { state.textContent = 'this one was prepared earlier, rebrief it to work on it live'; return }
    if (action === 'edit') {
      inlineInput('Change it in words', '', async instruction => {
        S.busy = true; state.textContent = 'editing 0s'
        if (img) img.style.opacity = '.45'
        const res = await API.editImage(url, instruction, s2 => { state.textContent = `editing ${s2}s` })
        applyImageResult(fig, res, `${ctx.prompt} · edited: ${instruction}`, bar)
        S.busy = false
      })
      return
    }
    if (action === 'upscale') {
      S.busy = true; state.textContent = 'upscaling 0s'
      const res = await API.upscaleImage(url, s2 => { state.textContent = `upscaling ${s2}s` })
      applyImageResult(fig, res, `${ctx.prompt} · upscaled`, bar)
      S.busy = false
    }
  })
}

function applyImageResult(fig, res, caption, bar) {
  const state = bar.querySelector('.state')
  const img = fig.querySelector('img')
  if (res.ok) {
    fig.dataset.url = res.url
    if (img) { img.src = res.url; img.style.opacity = '1' }
    const cap = fig.querySelector('.cap')
    if (cap) cap.innerHTML = `${esc(caption.length > 150 ? caption.slice(0, 150) + '…' : caption)} <span style="color:var(--faint)">· ${res.seconds}s</span>`
    state.textContent = ''
  } else {
    if (img) img.style.opacity = '1'
    state.textContent = res.reason === 'not_configured' ? 'images not configured' : 'that did not come back, the image is unchanged'
  }
}

async function runImage(fig, ctx, promptText, bar) {
  S.busy = true
  const state = bar?.querySelector('.state')
  const img = fig.querySelector('img')
  if (img) img.style.opacity = '.45'
  if (state) state.textContent = 'generating 0s'
  const res = await API.generateImage(promptText, s2 => { if (state) state.textContent = `generating ${s2}s` })
  if (bar) applyImageResult(fig, res, promptText, bar)
  S.busy = false
}

/* ---------- adding to the document ---------- */
const insertMenu = el('div', 'insert-menu')
insertMenu.id = 'insertMenu'
document.body.appendChild(insertMenu)
let insertAfter = null

insertMenu.innerHTML = BLOCK_TYPES.map(g => `
  <div class="grp">${g.group}</div>
  ${g.items.map(i => `
    <button data-type="${i.id}" ${i.ready ? '' : 'disabled'}>
      <span class="nm">${i.name}</span>
      <span class="ds">${i.desc}</span>
      ${i.ready ? '' : '<span class="soon">soon</span>'}
    </button>`).join('')}
`).join('')

function closeInsertMenu() { insertMenu.classList.remove('on'); insertAfter = null }
document.addEventListener('click', e => {
  const add = asEl(e.target)?.closest('.gutter-add')
  if (add) {
    e.stopPropagation()
    insertAfter = add.closest('.block')
    const r = add.getBoundingClientRect()
    insertMenu.classList.add('on')
    insertMenu.style.top = Math.max(8, Math.min(r.bottom + 6, innerHeight - insertMenu.offsetHeight - 12)) + 'px'
    insertMenu.style.left = Math.max(8, Math.min(r.right + 8, innerWidth - insertMenu.offsetWidth - 12)) + 'px'
    return
  }
  if (!asEl(e.target)?.closest('#insertMenu')) closeInsertMenu()
})

insertMenu.addEventListener('click', async e => {
  const b = asEl(e.target)?.closest('button')
  if (!b || b.disabled || !insertAfter) return
  const type = b.dataset.type
  const after = insertAfter
  closeInsertMenu()
  await insertBlock(type, after)
})

async function insertBlock(type, after) {
  const block = el('div', 'block fresh')
  block.dataset.block = 'added-' + Date.now()

  if (type === 'section') {
    block.innerHTML = `<button class="gutter-add" title="Add below">+</button>
      <span class="ovl" contenteditable="true">New section</span>
      <p class="body" contenteditable="true" spellcheck="false" data-block="${block.dataset.block}">Write here.</p>`
    after.after(block)
    setTimeout(() => block.querySelector('p.body')?.focus(), 60)
  }

  if (type === 'decision') {
    block.innerHTML = `<button class="gutter-add" title="Add below">+</button>
      <span class="ovl">Decision</span>
      <div class="decision-block">
        <input class="call" placeholder="The call you are making">
        <span class="lbl">What it costs</span>
        <input class="cost" placeholder="Name the cost. This is the part that makes it a decision.">
      </div>`
    after.after(block)
    setTimeout(() => block.querySelector('.call')?.focus(), 60)
    let committed = false
    const commit = () => {
      if (committed) return
      const call = block.querySelector('.call').value.trim()
      const cost = block.querySelector('.cost').value.trim()
      if (!call || !cost) return
      committed = true
      record(STRUCTURAL.committedWithCost({ basis: cost }), { quote: `${call} · ${cost}`, section: 'decision' })
    }
    block.querySelector('.cost').addEventListener('blur', commit)
    block.querySelector('.cost').addEventListener('keydown', ev => { if (ev.key === 'Enter') commit() })
  }

  if (type === 'source') {
    const pack = EVIDENCE_PACK[Math.floor(Math.random() * EVIDENCE_PACK.length)]
    if (pack.id === 'log') evidenceOpened.add('channel')
    block.innerHTML = `<button class="gutter-add" title="Add below">+</button>
      <span class="ovl">Source</span>
      <div class="card" style="padding:16px 18px;margin-top:6px">
        <span class="ovl f">${esc(pack.label)}</span>
        <p style="font-size:14px;color:var(--graphite);margin-top:6px;line-height:1.55">${esc(pack.body)}</p>
      </div>`
    after.after(block)
    capture(S.record, 'Pulled a source into the document')
    renderRecord()
  }

  if (type === 'image') {
    block.innerHTML = `<button class="gutter-add" title="Add below">+</button><span class="ovl">Image</span>`
    after.after(block)
    openBriefSheet({ text: 'a new image', blockId: 'audience', p: block }, block)
  }

  setTimeout(() => block.classList.remove('fresh'), 1500)
}

/* ---------- modal ---------- */
function openModal(html) { $('modal').innerHTML = html; $('veil').classList.add('on') }
$('veil').addEventListener('click', e => { if (e.target.id === 'veil') $('veil').classList.remove('on') })
document.addEventListener('keydown', e => { if (e.key === 'Escape') $('veil').classList.remove('on') })

$('btnWhy').addEventListener('click', () => openModal(`
  <h3>What is this?</h3>
  <p>Evolv reads capability from ordinary work. A student is writing a launch concept for Kado, a cafe where electric cars charge at the corner. As she works, her record fills in beside her: which capabilities showed up, and where, each line pointing at a passage you can read.</p>
  <ul>
    <li>The evidence is the work itself. Nothing is submitted and nothing is reviewed.</li>
    <li>Every line points at a passage you can read. If it cannot, it does not appear.</li>
    <li>The student sees the same record the teacher sees, and can dispute any line. The dispute is kept permanently.</li>
  </ul>`))

$('btnTrace').addEventListener('click', () => {
  const rows = S.record.observations.map(o =>
    `${o.signal} · ${o.domainName} · ${Math.round(o.elapsed / 1000)}s · structural rule${o.disputed ? ' · DISPUTED' : ''}`).join('<br>')
  openModal(`<h3>Trace</h3>
    <p>Everything the record contains for this session, in order, with real elapsed time.</p>
    <p style="font-family:ui-monospace,Menlo,monospace;font-size:12.5px;line-height:1.9;color:var(--ink)">${rows || 'No observations yet.'}</p>
    <p>${S.record.captured.length} action(s) captured but deliberately not read as capability.</p>`)
})

/* ---------- boot ---------- */
renderBegin()
renderSidebar()
switchView(location.hash === '#teacher' ? 'teacher' : 'student')
integrations()
API.loadStatus().then(integrations).catch(() => {})
