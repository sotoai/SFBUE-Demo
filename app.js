import { DOMAINS, WORLDS, PRODUCT, DRAFT, EVIDENCE_PACK, IMAGE_MOMENTS, FOUR_QUESTIONS, BLOCK_TYPES, IMAGE_ACTIONS } from './js/scenario.js'
import { createRecord, bandFor, domainCounts, STRUCTURAL, observe, capture, dispute, relativeTime, GUARDRAILS } from './js/engine.js'
import * as API from './js/api.js'

const $ = id => document.getElementById(id)
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

/* ---------- session ---------- */
const S = {
  stage: 0,
  world: 'university',
  record: createRecord('university'),
  enterpriseRecord: null,
  prediction: [],
  intent: '',
  panelMode: 'hidden',      // hidden | full | narrow
  busy: false,
  imagesNoted: false,
}

/* ---------- fit the stage to the display ---------- */
const DESIGN = { w: 1440, h: 900 }
let SCALE = 1
function fitStage() {
  const w = innerWidth, h = innerHeight
  // A hidden tab or a display still negotiating can report zero. Scaling by
  // zero would blank the stage and it would not come back on its own, so
  // leave the last good scale in place and try again on the next frame.
  if (!w || !h) { requestAnimationFrame(fitStage); return }
  SCALE = Math.max(0.25, Math.min(w / DESIGN.w, h / DESIGN.h, 1))
  const app = $('app')
  const x = Math.max(0, (w - DESIGN.w * SCALE) / 2)
  const y = Math.max(0, (h - DESIGN.h * SCALE) / 2)
  app.style.transform = `translate(${x}px, ${y}px) scale(${SCALE})`
}
addEventListener('resize', fitStage)
addEventListener('visibilitychange', () => { if (!document.hidden) fitStage() })

/* ---------- chrome ---------- */
function setSeat(kind, who, name, place) {
  const s = $('seat')
  s.className = 'seat ' + kind
  $('seatWho').textContent = who
  $('seatName').textContent = name || ''
  $('seatPlace').textContent = place ? '· ' + place : ''
}
function setStrip(what, why, stageLabel) {
  $('stripWhat').textContent = what
  $('stripWhy').textContent = why || ''
  $('stripStage').textContent = stageLabel || ''
}
function integrations() {
  $('intLang').className = 'integration' + (API.state.language ? '' : ' off')
  $('intLang').innerHTML = 'language <b>' + (API.state.language ? 'live' : 'prepared') + '</b>'
  $('intImg').className = 'integration' + (API.state.images ? '' : ' off')
  $('intImg').innerHTML = 'images <b>' + (API.state.images ? 'live' : 'prepared') + '</b>'
}

/* ---------- panel: the evaluator view, whole then narrowed ---------- */
function renderPanel() {
  const body = $('panelBody')
  const counts = domainCounts(S.record)
  const lit = DOMAINS.filter(d => counts[d.id] > 0)
  const w = WORLDS[S.world]
  body.innerHTML = ''

  // Q1 + Q2 collapse while the person is working; Q3 carries the live action.
  const working = S.stage === 4
  const b1 = el('div', 'qblock' + (working ? ' rest' : ''))
  b1.innerHTML = `<div class="q">${FOUR_QUESTIONS[0]}</div>
    <div class="a">${lit.length
      ? 'She moved the document off its first instinct, and said what that cost.'
      : 'Nothing yet. She has not started.'}</div>`
  body.appendChild(b1)

  const b2 = el('div', 'qblock')
  b2.innerHTML = `<div class="q">${FOUR_QUESTIONS[1]}</div>`
  for (const d of DOMAINS) {
    const n = counts[d.id] || 0
    const row = el('div', 'drow' + (n > 0 ? ' lit' : ''))
    row.dataset.domain = d.id
    const marks = [0, 1, 2, 3].map(i => `<i class="${i < Math.min(n, 4) ? 'on' : ''}"></i>`).join('')
    row.innerHTML = `<span class="nm">${d.name}</span><span class="ladder">${marks}</span><span class="band">${n ? bandFor(n) : 'no evidence'}</span>`
    b2.appendChild(row)
  }
  body.appendChild(b2)

  const b3 = el('div', 'qblock')
  b3.innerHTML = `<div class="q">${FOUR_QUESTIONS[2]}</div>`
  if (!S.record.observations.length) {
    b3.appendChild(el('div', 'a', '<span style="color:var(--faint)">Nothing observed yet. Every line here will point at a passage you can read.</span>'))
  }
  const recent = S.record.observations.slice().reverse()
  for (const o of recent) {
    const n = el('div', 'obs' + (o === S.record.observations[S.record.observations.length - 1] ? ' new' : '') + (o.disputed ? ' disputed' : ''))
    n.innerHTML = `<div class="sig">${o.signal} · ${o.domainName}</div>
      <div class="because">${esc(o.because)}</div>
      ${o.quote ? `<div class="quote">${esc(o.quote)}</div>` : ''}
      <div class="meta"><span>${relativeTime(o.elapsed)}</span>${o.proposed ? '<span>proposed</span>' : ''}</div>
      ${o.disputed ? `<div class="dispute">Disputed by Amara: ${esc(o.disputeReason)}</div>` : ''}`
    b3.appendChild(n)
  }
  for (const c of S.record.captured.slice().reverse()) {
    b3.appendChild(el('div', 'captured', esc(c.what) + ' · captured, not read as capability'))
  }
  body.appendChild(b3)

  const b4 = el('div', 'qblock' + (working ? ' rest' : ''))
  b4.innerHTML = `<div class="q">${FOUR_QUESTIONS[3]}</div>
    <div class="a">${lit.length >= 3
      ? 'The same reading runs on every piece of real work, so the record grows without anyone stopping to be assessed.'
      : 'Not yet answerable from one document.'}</div>`
  body.appendChild(b4)

  $('panelSeat').textContent = w.evaluatorSeat
  $('panelTitle').textContent = w.evaluator.name
}

function flashDomain(domainId) {
  const row = $('panelBody')?.querySelector(`.drow[data-domain="${domainId}"]`)
  if (row) { row.classList.add('just'); setTimeout(() => row.classList.remove('just'), 1200) }
}

function record(hit, ctx) {
  const entry = observe(S.record, hit, ctx)
  if (entry) { renderPanel(); flashDomain(entry.domainId) }
  return entry
}

/* ---------- margin column ---------- */
function addNote(kind, ovl, title, body) {
  const m = $('margin')
  const n = el('div', 'note ' + kind)
  n.innerHTML = `<span class="ovl f">${ovl}</span>
    <div class="qtext">${esc(title)}</div>
    ${body ? `<div class="atext">${esc(body)}</div>` : '<div class="atext"><span class="think"><i></i><i></i><i></i></span></div>'}`
  m.prepend(n)
  return n
}

/* ---------- the document editor ---------- */
let selInfo = null

function renderDoc() {
  const c = $('center')
  c.innerHTML = ''
  const doc = el('div', 'doc fade')
  doc.innerHTML = `<h1>Launch concept. ${PRODUCT.name}.</h1>
    <div class="docmeta">${PRODUCT.maker} · draft, five working days</div>`
  for (const b of DRAFT) {
    const block = el('div', 'block')
    block.dataset.block = b.id
    block.innerHTML = `<button class="gutter-add" title="Add below">+</button>
      <span class="ovl">${b.heading}</span>
      <p class="body" contenteditable="true" spellcheck="false" data-block="${b.id}">${esc(b.body)}</p>`
    doc.appendChild(block)
  }
  c.appendChild(doc)
  $('margin').classList.remove('hide')
}

function hidePill() { $('pill').classList.remove('on'); selInfo = null }

const asEl = n => (n && n.nodeType === 1 ? n : n && n.parentElement) || null

document.addEventListener('mouseup', e => {
  if (asEl(e.target)?.closest('#pill')) return
  setTimeout(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || S.stage !== 4) return hidePill()
    const text = sel.toString().trim()
    const p = asEl(sel.anchorNode)?.closest('p.body')
    if (!text || text.length < 4 || !p) return hidePill()
    const r = sel.getRangeAt(0).getBoundingClientRect()
    selInfo = { text, blockId: p.dataset.block, p }
    const pill = $('pill')
    pill.classList.add('on')
    const cx = r.left + r.width / 2
    const x = Math.min(Math.max(12, cx - pill.offsetWidth / 2), innerWidth - pill.offsetWidth - 12)
    pill.style.left = x + 'px'
    pill.style.top = Math.max(8, r.top - pill.offsetHeight - 10) + 'px'
  }, 10)
})

$('pill').addEventListener('click', async e => {
  const act = asEl(e.target)?.closest('button')?.dataset.act
  if (!act || !selInfo || S.busy) return
  const info = selInfo
  hidePill()
  window.getSelection()?.removeAllRanges()
  if (act === 'ask') await doAsk(info)
  if (act === 'update') await doUpdate(info)
  if (act === 'tag') await doTag(info)
  if (act === 'image') await doImage(info)
})

/* Ask: a question about a passage. The answer is a source, not a verdict. */
async function doAsk(info) {
  const q = prompt('Ask about this passage:', 'Where does this number actually come from?')
  if (!q) return
  S.busy = true
  info.p.innerHTML = info.p.innerHTML.replace(esc(info.text), `<span class="asked">${esc(info.text)}</span>`)
  const note = addNote('q', 'Asked about a passage', q, null)
  const fallback = 'The beta install log settles it. Across 71 installs, 71% arrived through an architect or a lighting designer and 4% came from a homeowner who found Solveil first. The install specification explains why: 140 mm of plenum depth and a hard wired driver mean the module goes in only while a ceiling is open, which is a construction decision, not a purchase.'
  const ans = await API.askAbout(info.text, q, fallback)
  note.querySelector('.atext').textContent = ans
  record(STRUCTURAL.openedContradictingSource({ contradicts: /71|4%|140|11 month|architect|specif/i.test(ans) }),
    { quote: info.text.slice(0, 120), section: info.blockId })
  S.busy = false
}

/* Update: a suggestion never silently replaces a person's words. */
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
  const fallback = 'Lead through architects and lighting designers. Solveil is specified 11 months before anyone lives in the room, and 71% of beta installs arrived that way against 4% direct. The cost is real: 38% margin instead of 61%, and first revenue arrives later.'
  const text = await API.rewrite(info.text, 'Make it correct against the evidence, and name the cost of the position.', fallback)
  par.querySelector('.text').textContent = text
  par.querySelector('.acts').classList.remove('hide')
  S.busy = false

  par.addEventListener('click', ev => {
    const a = ev.target.closest('button')?.dataset.a
    if (a === 'keep') {
      info.p.textContent = info.p.textContent.replace(info.text, text)
      par.remove()
      capture(S.record, 'Accepted a rewrite unchanged')
      renderPanel()
      setStrip('The rewrite was accepted as written.',
        'Nothing lit. Taking a good suggestion is not evidence of anything yet, and the record says so.')
    }
    if (a === 'discard') {
      par.querySelector('.whyrow').classList.add('on')
      par.querySelector('.why').focus()
    }
  })
  par.querySelector('.why').addEventListener('keydown', ev => {
    if (ev.key !== 'Enter') return
    const reason = ev.target.value.trim()
    if (!reason) return
    par.remove()
    record(STRUCTURAL.refusedRewrite({ reason }), { quote: reason, section: info.blockId })
    setStrip('She kept her own words and said why.',
      'Refusing a fluent suggestion, with a reason, is one of the strongest things the record can see.')
  })
}

/* Tag for research: names what would settle it. */
async function doTag(info) {
  S.busy = true
  const note = addNote('', 'Tagged for research', info.text.slice(0, 90) + (info.text.length > 90 ? '…' : ''), null)
  const fallback = 'Two things would settle it. The beta install log records the source of every one of the 71 projects. Halden\'s project calendar shows the median 11 months from a fixed ceiling plan to an energised panel.'
  const leads = await API.researchLeads(info.text, fallback)
  note.querySelector('.atext').textContent = leads
  capture(S.record, 'Tagged a passage for research')
  renderPanel()
  S.busy = false
}

/* Generate image.

   A scripted beat serves an image prepared earlier, instantly, so a room is
   not watching a counter together. Edit the brief at all and it generates
   live, with real elapsed seconds. The interface says which one happened
   rather than hiding it. */
async function doImage(info, container) {
  const moment = IMAGE_MOMENTS[info.blockId] || IMAGE_MOMENTS.audience
  const p = prompt('What must this image show?', moment.prompt)
  if (!p) return
  S.busy = true
  const block = container || info.p.closest('.block')
  const fig = el('div', 'figure')
  block.appendChild(fig)

  const unchanged = p.trim() === moment.prompt.trim()
  const shortBrief = p.length > 150 ? p.slice(0, 150).trim() + '…' : p

  if (unchanged && moment.warm) {
    fig.innerHTML = `<img src="${moment.warm}" alt="concept image">
      <div class="cap">${esc(shortBrief)} <span style="color:var(--faint)">· prepared earlier</span></div>`
    if (!S.imagesNoted) {
      S.imagesNoted = true
      setStrip('These are generated by the same model you would use.',
        'The scripted ones are prepared ahead so we are not all watching a counter. Change the brief and it runs live.')
    }
  } else {
    fig.innerHTML = `<div class="holding"><div class="el">0s</div>
      <div class="pr">${esc(shortBrief)}</div>
      <div class="st">${API.state.images ? 'generating now' : 'images not configured, showing the brief only'}</div></div>`
    setStrip('This image is being generated now.', 'The counter is real elapsed time, not a progress bar.')
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

/* ---------- adding to the document ----------
   The plus in the gutter opens one short, grouped list. Anything not built yet
   appears in it, plainly marked, because a person deciding whether this is
   their tool needs to see the shape of it, and a control that silently does
   nothing is worse than an honest label. */

const insertMenu = el('div', 'insert-menu')
insertMenu.id = 'insertMenu'
document.body.appendChild(insertMenu)
let insertAfter = null

function buildInsertMenu() {
  insertMenu.innerHTML = BLOCK_TYPES.map(g => `
    <div class="grp">${g.group}</div>
    ${g.items.map(i => `
      <button data-type="${i.id}" ${i.ready ? '' : 'disabled'}>
        <span class="nm">${i.name}</span>
        <span class="ds">${i.desc}</span>
        ${i.ready ? '' : '<span class="soon">soon</span>'}
      </button>`).join('')}
  `).join('')
}
buildInsertMenu()

function openInsertMenu(btn, block) {
  insertAfter = block
  const r = btn.getBoundingClientRect()
  insertMenu.classList.add('on')
  const top = Math.min(r.bottom + 6, innerHeight - insertMenu.offsetHeight - 12)
  insertMenu.style.top = Math.max(8, top) + 'px'
  // open to the right of the plus so the menu never covers the insights panel
  const left = Math.min(r.right + 8, innerWidth - insertMenu.offsetWidth - 12)
  insertMenu.style.left = Math.max(8, left) + 'px'
}
function closeInsertMenu() { insertMenu.classList.remove('on'); insertAfter = null }

document.addEventListener('click', e => {
  const add = asEl(e.target)?.closest('.gutter-add')
  if (add) { e.stopPropagation(); openInsertMenu(add, add.closest('.block')); return }
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
    setStrip('A section was added.', 'Anything written here is read the same way as the rest of the document.')
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
    setStrip('A decision block was added.', 'A commitment only reads as a decision when the cost is named with it.')
    setTimeout(() => block.querySelector('.call')?.focus(), 60)
    const commit = () => {
      const call = block.querySelector('.call').value.trim()
      const cost = block.querySelector('.cost').value.trim()
      if (!call || !cost) return
      record(STRUCTURAL.committedWithCost({ basis: cost }), { quote: `${call} · ${cost}`, section: 'decision' })
      setStrip('The call was committed with its cost.', 'That is what separates a decision from a preference.')
    }
    block.querySelector('.cost').addEventListener('blur', commit)
    block.querySelector('.cost').addEventListener('keydown', ev => { if (ev.key === 'Enter') commit() })
  }

  if (type === 'source') {
    const pack = EVIDENCE_PACK[Math.floor(Math.random() * EVIDENCE_PACK.length)]
    block.innerHTML = `<button class="gutter-add" title="Add below">+</button>
      <span class="ovl">Source</span>
      <div class="card" style="padding:16px 18px;margin-top:6px">
        <span class="ovl f">${esc(pack.label)}</span>
        <p style="font-size:14px;color:var(--graphite);margin-top:6px;line-height:1.55">${esc(pack.body)}</p>
      </div>`
    after.after(block)
    capture(S.record, 'Pulled a source into the document')
    renderPanel()
    setStrip('A source was pulled in.', 'Reading a source is captured. It only counts as capability when it changes something.')
  }

  if (type === 'image') {
    block.innerHTML = `<button class="gutter-add" title="Add below">+</button><span class="ovl">Image</span>`
    after.after(block)
    const info = { text: 'a new image', blockId: 'audience', p: block }
    await doImage(info, block)
  }

  setTimeout(() => block.classList.remove('fresh'), 1500)
}

/* ---------- moving an image forward ----------
   An image is rarely right on the first pass. These are the ways it can
   change, sitting with the image rather than hidden in a menu. */
function attachImageBar(fig, ctx) {
  const bar = el('div', 'imgbar')
  bar.innerHTML = IMAGE_ACTIONS.map(a =>
    `<button data-a="${a.id}" title="${a.hint}" ${a.ready ? '' : 'disabled'}>${a.label}${a.ready ? '' : '<span class="soon">soon</span>'}</button>`
  ).join('') + '<span class="spacer"></span><span class="state"></span>'
  fig.appendChild(bar)

  bar.addEventListener('click', async e => {
    const a = asEl(e.target)?.closest('button')
    if (!a || a.disabled || S.busy) return
    const action = a.dataset.a
    const url = fig.dataset.url
    const state = bar.querySelector('.state')
    const img = fig.querySelector('img')

    if (action === 'rebrief') {
      const next = prompt('Write a different brief for this image:', ctx.prompt)
      if (!next) return
      ctx.prompt = next
      await runImage(fig, ctx, next, bar)
      return
    }
    if (action === 'refine') { await runImage(fig, ctx, ctx.prompt, bar); return }

    if (!url) { state.textContent = 'this one was prepared earlier, rebrief it to work on it live'; return }

    if (action === 'edit') {
      const instruction = prompt('Change it in words:', 'Make the light cooler and more silvery')
      if (!instruction) return
      S.busy = true; state.textContent = 'editing 0s'
      if (img) img.style.opacity = '.45'
      const res = await API.editImage(url, instruction, s2 => { state.textContent = `editing ${s2}s` })
      applyImageResult(fig, res, `${ctx.prompt} · edited: ${instruction}`, bar)
      S.busy = false
    }

    if (action === 'upscale') {
      S.busy = true; state.textContent = 'upscaling 0s'
      const res = await API.upscaleImage(url, s2 => { state.textContent = `upscaling ${s2}s` })
      applyImageResult(fig, res, `${ctx.prompt} · upscaled`, bar)
      S.busy = false
    }
  })
  return bar
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

/* ---------- modal ---------- */
function openModal(html) { $('modal').innerHTML = html; $('veil').classList.add('on') }
$('veil').addEventListener('click', e => { if (e.target.id === 'veil') $('veil').classList.remove('on') })
$('btnWhy').addEventListener('click', () => openModal(`
  <h3>Is this a rubric?</h3>
  <p>Yes, in one sense. There are named capabilities and there are levels of confidence. Three things are different, and they are the whole point.</p>
  <ul>
    <li>The evidence is the work itself. Nothing was submitted and nothing was reviewed.</li>
    <li>Every line points at a passage you can read. If it cannot, it does not appear.</li>
    <li>The person can dispute any line, and the dispute is kept permanently.</li>
  </ul>
  <p>The rules that read the work are a hand authored first version. The record accumulating here is exactly the input that turns hand authored rules into validated ones. That is what Foundation and Validation means on the roadmap.</p>`))
$('btnTrace').addEventListener('click', () => {
  const rows = S.record.observations.map(o =>
    `${o.signal} · ${o.domainName} · ${Math.round(o.elapsed / 1000)}s · ${o.proposed ? 'proposed by model, accepted from closed list' : 'structural rule'}${o.disputed ? ' · DISPUTED' : ''}`).join('<br>')
  openModal(`<h3>Trace</h3>
    <p>Everything the record contains for this session, in order, with real elapsed time.</p>
    <p style="font-family:ui-monospace,Menlo,monospace;font-size:12.5px;line-height:1.9;color:var(--ink)">${rows || 'No observations yet.'}</p>
    <p>${S.record.captured.length} action(s) captured but deliberately not read as capability.</p>`)
})

/* ---------- stages ---------- */
const stages = [
  { // 0. cold open: the payoff first
    seat: ['', 'Evolv', '', ''],
    what: 'A person caught this. Nothing asked her to.',
    why: 'Start at the end, then show how it was seen.',
    label: 'Cold open',
    render(c) {
      c.innerHTML = `<div class="centerpiece"><div class="inner">
        <div class="claimbad">Lead with direct to consumer. The story is emotional and emotional stories sell direct, gross margin is 61% against 38% through specification channels.</div>
        <div class="against">
          <div><div class="k">140 mm</div><div class="v">of empty ceiling depth required, so the module goes in only while a ceiling is open.</div></div>
          <div><div class="k">11 months</div><div class="v">from a fixed ceiling plan to an energised panel.</div></div>
          <div><div class="k">71% / 4%</div><div class="v">arrived through an architect. Four percent came direct.</div></div>
        </div>
        <p class="lede" style="margin-top:22px;text-align:left">The paragraph is fluent, confident, and wrong. Nobody marked it. Nobody was assessing her. She was writing a launch document on a Tuesday.</p>
      </div></div>`
    },
  },
  { // 1. the four questions
    seat: ['', 'Evolv', '', ''],
    what: 'Four questions a company cannot currently answer.',
    why: 'They are answerable only if someone can read the work itself.',
    label: 'The problem',
    render(c) {
      c.innerHTML = `<div class="centerpiece"><div class="inner" style="text-align:left">
        ${FOUR_QUESTIONS.map(q => `<div class="qline">${q}</div>`).join('')}
        <p class="lede" style="margin-top:26px">Every one of these is asked about people, and answered with self report, a manager's memory, or an exam that measures something else.</p>
      </div></div>`
      const lines = c.querySelectorAll('.qline')
      lines.forEach((l, i) => setTimeout(() => l.classList.add('on'), 260 * i))
    },
  },
  { // 2. evaluator stage
    seat: ['evaluator', 'Faculty view', 'Prof. Marisol Vega', 'SFBU · Applied Launch Studio'],
    what: 'The person who needs the work sets it, in their own words.',
    why: 'Intent lives here. This is what makes it a piece of work and not an exercise.',
    label: 'University · evaluator',
    render(c) {
      const w = WORLDS.university
      c.innerHTML = `<div class="col fade">
        <span class="ovl">The brief she sends</span>
        <div class="card brief-sheet">
          <div class="from"><span class="ovl f">To Amara Osei</span><span class="ovl f">Five working days</span></div>
          <div class="brief-body">${esc(w.brief)}</div>
        </div>
        <div class="card brief-sheet" style="margin-top:16px">
          <span class="ovl">What she is actually trying to find out</span>
          <div class="field" style="border:none;padding-top:8px;margin-top:0">
            <textarea id="intent" placeholder="In her own words">${w.wants}</textarea>
          </div>
          <div class="field">
            <span class="ovl">Which capabilities she expects this work to surface</span>
            <div class="chips" id="predict">${DOMAINS.map(d => `<button class="chip" data-d="${d.id}">${d.name}</button>`).join('')}</div>
            <p class="lede" style="font-size:13px;margin-top:10px;color:var(--faint)">She can be wrong. That is the point of writing it down first.</p>
          </div>
        </div>
        <div class="factgrid">${PRODUCT.facts.map(f => `<div><div class="k">${f.k}</div><div class="v">${f.v}</div></div>`).join('')}</div>
      </div>`
      const pre = ['creation', 'decision', 'execution']
      pre.forEach(id => { const b = c.querySelector(`.chip[data-d="${id}"]`); if (b) b.classList.add('on') })
      S.prediction = [...pre]
      c.querySelector('#predict').addEventListener('click', e => {
        const b = e.target.closest('.chip'); if (!b) return
        b.classList.toggle('on')
        const id = b.dataset.d
        S.prediction = b.classList.contains('on') ? [...S.prediction, id] : S.prediction.filter(x => x !== id)
      })
      c.querySelector('#intent').addEventListener('input', e => { S.intent = e.target.value })
      S.intent = w.wants
    },
  },
  { // 3. the narrowing
    seat: ['learner', 'Student view', 'Amara Osei', 'SFBU · Applied Launch Studio'],
    what: 'The evaluator view moves aside. It does not leave.',
    why: 'Watching is continuous and it is never a separate event.',
    label: 'The narrowing',
    enter() {
      S.panelMode = 'narrow'
      $('panel').classList.remove('hide')
      renderPanel()
    },
    render(c) {
      c.innerHTML = `<div class="centerpiece"><div class="inner">
        <h2 class="display">She opens the document. Nothing else changes.</h2>
        <p class="lede" style="margin-top:14px">No assessment starts. No timer runs. The panel on the left is the faculty view, narrowed. It will fill in as she works, from the work.</p>
      </div></div>`
    },
  },
  { // 4. the work
    seat: ['learner', 'Student view', 'Amara Osei', 'SFBU · Applied Launch Studio'],
    what: 'Select any passage. Update it, ask about it, tag it, or picture it.',
    why: 'Ordinary writing is the entire input. Nothing else is collected.',
    label: 'University · the work',
    enter() { $('panel').classList.remove('hide'); renderPanel() },
    render(c) { renderDoc() },
  },
  { // 5. read back
    seat: ['evaluator', 'Faculty view', 'Prof. Marisol Vega', 'SFBU · Applied Launch Studio'],
    what: 'The four questions, answered from work nobody submitted.',
    why: 'And a prediction the evaluator can lose.',
    label: 'The read back',
    enter() { $('margin').classList.add('hide') },
    render(c) {
      const counts = domainCounts(S.record)
      const observed = DOMAINS.filter(d => counts[d.id] > 0).map(d => d.id)
      const hits = S.prediction.filter(p => observed.includes(p))
      const missed = S.prediction.filter(p => !observed.includes(p))
      const unexpected = observed.filter(o => !S.prediction.includes(o))
      const nm = id => DOMAINS.find(d => d.id === id)?.name || id
      c.innerHTML = `<div class="col fade" style="max-width:960px">
        <h2 class="display">How you worked.</h2>
        <p class="lede" style="margin-top:8px">Nothing was submitted. Nothing was reviewed. This is a read of work that was going to happen anyway.</p>
        <div class="fourcol">
          <div class="qc"><div class="qq">${FOUR_QUESTIONS[0]}</div><div class="aa">${observed.length ? 'She moved the document off its first instinct and named what that cost.' : 'Nothing yet.'}</div></div>
          <div class="qc"><div class="qq">${FOUR_QUESTIONS[1]}</div><div class="aa">${observed.length ? observed.map(nm).join(', ') : 'None observed.'}</div></div>
          <div class="qc"><div class="qq">${FOUR_QUESTIONS[2]}</div><div class="aa">${S.record.observations.length} observation${S.record.observations.length === 1 ? '' : 's'}, each pointing at a passage you can read.</div></div>
          <div class="qc"><div class="qq">${FOUR_QUESTIONS[3]}</div><div class="aa">The same reading runs on the next piece of real work, and the one after.</div></div>
        </div>
        <div class="predict">
          <div class="pc"><span class="ovl">She predicted</span>
            ${S.prediction.length ? S.prediction.map(p => `<div class="row2 ${observed.includes(p) ? 'hit' : 'miss'}"><span class="mark">${observed.includes(p) ? '✓' : '·'}</span>${nm(p)}</div>`).join('') : '<div class="row2">Nothing predicted.</div>'}
          </div>
          <div class="pc"><span class="ovl">The work showed</span>
            ${observed.length ? observed.map(o => `<div class="row2 ${S.prediction.includes(o) ? 'hit' : 'miss'}"><span class="mark">${S.prediction.includes(o) ? '✓' : '+'}</span>${nm(o)}</div>`).join('') : '<div class="row2">Nothing observed.</div>'}
          </div>
          <div class="pc"><span class="ovl">So</span>
            <div class="aa" style="font-size:13.5px;line-height:1.55">${hits.length} of ${S.prediction.length || 0} predictions held.
            ${missed.length ? `She expected ${missed.map(nm).join(' and ')} and the work did not show it. ` : ''}
            ${unexpected.length ? `She did not expect ${unexpected.map(nm).join(' and ')}, and that is where the evidence actually is.` : ''}</div>
          </div>
        </div>
        <p class="lede" style="margin-top:22px">${GUARDRAILS[0]} ${GUARDRAILS[2]}</p>
      </div>`
    },
  },
  { // 6. the learner's own view
    seat: ['self', 'Her own record', 'Amara Osei', 'Visible to her, always'],
    what: 'She sees everything the faculty view sees, and can dispute any line.',
    why: 'A record about a person that the person cannot see is surveillance.',
    label: 'Consent and dispute',
    render(c) {
      c.innerHTML = `<div class="col fade">
        <h2 class="display">Her record, in her hands.</h2>
        <p class="lede" style="margin-top:8px">Same lines, same evidence, one addition: she can disagree, in writing, permanently.</p>
        <div id="mine" style="margin-top:22px"></div>
        <div class="card" style="padding:20px 24px;margin-top:20px">
          <span class="ovl">What is stored</span>
          <ul style="margin:10px 0 0 18px">${GUARDRAILS.map(g => `<li style="font-size:13.5px;color:var(--graphite);margin-bottom:6px">${g}</li>`).join('')}</ul>
        </div>
      </div>`
      const mine = c.querySelector('#mine')
      if (!S.record.observations.length) { mine.innerHTML = '<p class="lede">No observations were made.</p>'; return }
      for (const o of S.record.observations) {
        const n = el('div', 'card', `<div style="padding:16px 20px">
          <div class="sig" style="font-size:10.5px;letter-spacing:.11em;text-transform:uppercase;color:var(--signal)">${o.signal} · ${o.domainName}</div>
          <div style="font-size:14px;margin-top:5px${o.disputed ? ';text-decoration:line-through;opacity:.6' : ''}">${esc(o.because)}</div>
          ${o.quote ? `<div style="font-size:13px;color:var(--graphite);margin-top:7px;padding-left:11px;border-left:1px solid var(--hair);font-style:italic">${esc(o.quote)}</div>` : ''}
          ${o.disputed ? `<div style="font-size:13px;color:var(--signal);margin-top:8px">She disagreed: ${esc(o.disputeReason)}</div>`
            : `<button class="btn small" data-o="${o.id}" style="margin-top:10px">I disagree with this</button>`}
        </div>`)
        n.style.marginBottom = '10px'
        mine.appendChild(n)
      }
      mine.addEventListener('click', e => {
        const id = e.target.closest('button')?.dataset.o
        if (!id) return
        const reason = prompt('What does the record have wrong?', 'The rewrite was not about margin. I kept mine because the founder has to be brought along.')
        if (!reason) return
        dispute(S.record, id, reason)
        stages[6].render($('center'))
        renderPanel()
        setStrip('Her disagreement is now part of the record.', 'It is never deleted, and it travels with the line it disputes.')
      })
    },
  },
  { // 7. the crossing
    seat: ['evaluator', 'Manager view', 'Priya Raman', 'Halden Atelier · Brand and Go-to-Market'],
    what: 'Same engine. Different building.',
    why: 'The middle did not move. Only the application layer around it changed.',
    label: 'The crossing',
    enter() {
      S.world = 'enterprise'
      $('panelSeat').textContent = WORLDS.enterprise.evaluatorSeat
      $('panelTitle').textContent = WORLDS.enterprise.evaluator.name
    },
    render(c) {
      const u = WORLDS.university, e = WORLDS.enterprise
      c.innerHTML = `<div class="col fade" style="max-width:920px">
        <h2 class="display">The same brief, in a company.</h2>
        <div style="display:flex;gap:16px;margin-top:20px">
          <div class="card" style="flex:1;padding:22px 24px">
            <span class="ovl f">${u.place}</span>
            <div style="font-weight:500;margin-top:6px">${u.evaluator.name} → ${u.learner.name}</div>
            <p class="lede" style="font-size:13.5px;margin-top:10px">${esc(u.wants)}</p>
            <div class="ovl f" style="margin-top:14px">Consequence ${u.stakes}</div>
          </div>
          <div class="card" style="flex:1;padding:22px 24px;border-left:2px solid var(--signal)">
            <span class="ovl f">${e.place}</span>
            <div style="font-weight:500;margin-top:6px">${e.evaluator.name} → ${e.learner.name}</div>
            <p class="lede" style="font-size:13.5px;margin-top:10px">${esc(e.wants)}</p>
            <div class="ovl f" style="margin-top:14px">Consequence ${e.stakes}</div>
          </div>
        </div>
        <div class="card" style="padding:22px 24px;margin-top:16px">
          <span class="ovl">What changed between them</span>
          <p class="lede" style="margin-top:8px">The building, the stakes, and the name on the brief. Not the reading. The panel on the left is the same component, holding the same eight domains, fed by the same rules. A professor and a manager are asking one question: what does this person do when the evidence disagrees with them.</p>
        </div>
      </div>`
    },
  },
  { // 8. capability management
    seat: ['evaluator', 'Manager view', 'Priya Raman', 'Halden Atelier · Brand and Go-to-Market'],
    what: 'One record per person. The work changes, not the people.',
    why: 'This is the layer the board deck calls Capability Management.',
    label: 'At scale',
    render(c) {
      const counts = domainCounts(S.record)
      const amara = DOMAINS.map(d => Math.min(counts[d.id] || 0, 3))
      const team = [
        { who: 'Theo Marchetti', marks: [2, 3, 2, 1, 0, 2, 1, 3], note: 'Five observations across seven months, seeded' },
        { who: 'Amara Osei', marks: amara, note: 'This session, live' },
        { who: 'Dani Okafor', marks: [1, 0, 2, 2, 1, 0, 0, 1], note: 'Two projects, seeded' },
      ]
      c.innerHTML = `<div class="col fade" style="max-width:1000px">
        <h2 class="display">What a leader does with this.</h2>
        <p class="lede" style="margin-top:8px">Not a ranking. A map of where evidence exists and where it does not, so the next piece of work can be chosen deliberately.</p>
        <div class="cohort">
          <table><thead><tr><th>Person</th>${DOMAINS.map(d => `<th>${d.name}</th>`).join('')}<th>Record</th></tr></thead>
          <tbody>${team.map(t => `<tr><td class="who">${t.who}</td>${t.marks.map(m => `<td>${m ? `<span class="m b${m}"></span>` : '<span class="m"></span>'}</td>`).join('')}<td style="color:var(--faint);font-size:11.5px">${t.note}</td></tr>`).join('')}</tbody></table>
        </div>
        <div class="card" style="padding:22px 24px;margin-top:18px;border-left:2px solid var(--signal)">
          <span class="ovl">The move this suggests</span>
          <p class="lede" style="margin-top:8px">Nobody here needs a class. Growth has almost no evidence anywhere on this team, because nothing they have shipped required anyone to reverse a position in public. If that capability matters for February, the work has to change, not the people. Give the Solveil channel decision to someone who will have to tell Ines she is wrong.</p>
        </div>
        <p class="lede" style="margin-top:20px">Eight domains. Neither seat produced all of them. The record did.</p>
      </div>`
    },
  },
]

/* ---------- navigation ---------- */
function go(n) {
  if (n < 0 || n >= stages.length) return
  S.stage = n
  const st = stages[n]
  const [kind, who, name, place] = st.seat
  setSeat(kind, who, name, place)
  setStrip(st.what, st.why, `${n + 1} of ${stages.length} · ${st.label}`)
  if (n !== 4) { $('margin').classList.add('hide'); hidePill() }
  if (n < 3) $('panel').classList.add('hide')
  if (st.enter) st.enter()
  st.render($('center'))
  if (n >= 3) renderPanel()
  $('btnBack').disabled = n === 0
  $('btnNext').textContent = n === stages.length - 1 ? 'Replay' : 'Continue'
}
$('btnNext').addEventListener('click', () => S.stage === stages.length - 1 ? location.reload() : go(S.stage + 1))
$('btnBack').addEventListener('click', () => go(S.stage - 1))
document.addEventListener('keydown', e => {
  if (e.target.matches('input,textarea,[contenteditable]')) return
  if (e.key === 'ArrowRight') go(S.stage + 1)
  if (e.key === 'ArrowLeft') go(S.stage - 1)
  if (e.key === 'Escape') $('veil').classList.remove('on')
})

/* ---------- boot ---------- */
fitStage()
await API.loadStatus()
integrations()
go(0)
