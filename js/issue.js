/* Issue One: the first product, for discussion.

   A presentation layer over the working product, for the decision-making
   team. The right column becomes an issue of an in-house journal set in the
   product's own type: masthead, standfirst, numbered decisions, open
   questions set apart, pull quotes lifted verbatim from the document,
   footnotes carrying every honest caveat, and two figures. Fig. 1 is the live
   record itself, re-parented into the column so the private mirror sits
   inside the essay about it and keeps filling as the reader works. Fig. 2 is
   the public claim, illustrated.

   Honesty rules, in code:
   - Three status words only: in the prototype, illustrated, not built.
   - Every illustrated surface carries three signals: the tag, the word in
     its caption, and a footnote. Nothing illustrated uses the accent.
   - The column reflows beside the product and never covers it. Close it
     and the product is unchanged.
   - Product state is written only through the api the product hands over. */

import { DOMAINS, WORLDS } from './scenario.js'
import { domainEvidence, bandFor } from './engine.js'

const $ = id => document.getElementById(id)
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const fmt = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

/* ---------- the issue ---------- */

const ISSUE = {
  masthead: {
    kicker: 'Prototype description · Working draft for discussion',
    title: 'First Product',
    standfirst: 'A working definition of the first product to take to market: the decisions already made, the questions this team needs to settle, and the terms for outside vendor involvement. It builds on the Evolv work, stripped to fundamentals, and carries forward the Evolv UI and layout.',
    dateline: 'For the SFBU decision-making team · August 2026',
    line: 'The product is on your left and it is live. Every section of this column points at something on the page you can click. Where a surface is illustrated for this conversation rather than built, the column says so, in a footnote, every time.',
  },
  sections: [
    {
      id: 'premise', folio: '01', kicker: 'The premise',
      blocks: [
        { kind: 'p', lede: true, text: 'The learner is the backbone of the platform. Every session strengthens a per-user knowledge graph, and the stronger that graph gets, the more tailored the environment becomes. That compounding graph is the asset.' },
        { kind: 'pull', text: 'Protecting it is a first-class constraint on how we build, how we market, and which partners we choose. Everything below follows from this.' },
        { kind: 'status', tag: 'in the prototype' },
        { kind: 'product', text: 'The graph is real and it is small. Open your profile and follow any attribute back through the evidence to the passage and the source it came from. Every node is state the platform holds; every edge is a link it can defend.' },
        { kind: 'try', label: 'Try it: open your profile', act: 'profile' },
        { kind: 'fig', id: 'record', caption: 'Fig. 1 · Live. The record from this session, learner\'s view.' },
      ],
      notes: [{ n: 1, text: 'In the prototype the graph is built from this session alone. Nothing carries across sessions yet, and that carry is the whole of the compounding claim. It is the first thing to build, not the first thing to show.' }],
    },
    {
      id: 'product', folio: '02', kicker: 'The product',
      blocks: [
        { kind: 'p', lede: true, text: 'A two-sided loop. An evaluator authors a brief with explicit success criteria.' },
        { kind: 'status', tag: 'in the prototype' },
        { kind: 'product', text: 'On the Teacher tab the brief is a sheet, and under it one field: what you are trying to find out. That field is the success criteria in the evaluator\'s own words, and it is the only thing the evaluator writes.' },
        { kind: 'try', label: 'Try it on the Teacher tab: read the brief you set', act: 'teacherBrief' },
        { kind: 'p', text: 'The learner interrogates the brief, then chooses a blank canvas or an AI first draft.' },
        { kind: 'status', tag: 'in the prototype' },
        { kind: 'product', text: 'Interrogating the brief is a real exchange, typed or spoken, before any writing. Asking a real question sharpens the record the same way writing does. The evidence pack is four documents you can open and read here, not four summaries of documents.' },
        { kind: 'try', label: 'Try it: ask about the assignment', act: 'discuss' },
        { kind: 'p', text: 'Two ways to begin. Start from a blank page and the three decisions in the brief are scaffolded, empty. Draft the foundations and the first pass is written for you, live, section by section, from the founder\'s conviction and before the data, so it reads fluent and is wrong in one place. Starting text is never read as capability. What you do with it is.' },
        { kind: 'try', label: 'Try it: draft the foundations', act: 'begin', needs: 'notStarted', cue: 'Work has begun. The begin choice is behind you; reload to see it again.' },
        { kind: 'p', text: 'The learner works in a document editor where highlights, research, and attached reasoning feed the Evidence Engine.' },
        { kind: 'status', tag: 'in the prototype' },
        { kind: 'product', text: 'Select any passage. Update proposes a rewrite beside your words, never in place of them; keeping yours asks for one line of why, and that line is the attached reasoning. Ask opens a question in the margin. Tag for research opens a thread that reaches the document only through a proposal you accept or refuse. Picture it briefs an image with what it must show. Move a passage and the order becomes part of the argument.' },
        { kind: 'try', label: 'Try it: select a sentence in Where the next corners go', act: 'select', needs: 'started', cue: 'Begin work, then select any passage.' },
        { kind: 'query', text: 'Typing alone stays dark: a rule we hold in v1, or the first thing the first buyer asks us to soften?', note: 'q-typing' },
        { kind: 'p', text: 'The session ends in a capability mirror: what was demonstrated, at what level, and where the thin spots are. The Captured, Cataloged, Coached spine stays.' },
        { kind: 'status', tag: 'in the prototype' },
        { kind: 'product', text: 'In the prototype the mirror does not wait for the end. It fills beside the work: an insight in sentences, eight attributes with a band where there is evidence and dark where there is none, and every line quoting the passage it read. The gray lines, captured and not read as capability, are Captured. The observations are Cataloged. The guide in the discussion and the research threads is Coached.' },
        { kind: 'try', label: 'Try it: open an insight', act: 'insight', needs: 'observation', cue: 'Do a piece of work first; insights appear as the work does.' },
        { kind: 'p', text: 'Coaching adapts to demonstrated capability, with the evaluator setting the ceiling.' },
        { kind: 'status', tag: 'not built', label: 'Coaching ceiling' },
      ],
      notes: [
        { n: 2, text: 'Voice needs the speech vendor on the server; typed discussion works everywhere. Both are labeled on the page.' },
        { n: 3, text: 'The draft comes from the language vendor when it is live and from prepared text when it is not. The page says which.' },
        { n: 4, text: 'Reasoning attaches only where the product asks for it: the why on a kept passage, the argument in a thread, the cost beside a decision. Nothing is inferred from typing alone.' },
        { n: 5, text: 'No ceiling exists in the prototype; coaching today is one register for everyone. The control belongs on the brief sheet, beside what you are trying to find out.' },
      ],
    },
    {
      id: 'mirror', folio: '03', kicker: 'The product · the mirror splits',
      blocks: [
        { kind: 'p', lede: true, text: 'The mirror splits into two surfaces with a gate between them.' },
        { kind: 'p', text: 'The private mirror is the full picture: strengths, gaps, working patterns, interests. It belongs to the learner alone. No institution or employer ever sees it, so it can be blunt, and it can be wrong without consequence.' },
        { kind: 'status', tag: 'in the prototype' },
        { kind: 'product', text: 'The record in Fig. 1 is the private mirror. Every line can be disputed in the learner\'s own words, the dispute is kept, and a disputed line stops counting. That is what lets a blunt reading be a fair one.' },
        { kind: 'try', label: 'Try it: dispute a line', act: 'dispute', needs: 'observation', cue: 'Do a piece of work first; there is nothing to dispute yet.' },
        { kind: 'query', text: 'The Teacher tab shows the whole record, with guidance on what to do next. The document says no institution sees the private mirror. The product\'s own earlier rule, still on the Teacher tab, says a record the person cannot see is surveillance; the document\'s stricter rule says the institution sees only claims. Both are defensible. Only one can ship. Is the evaluator inside the loop, a coach who sees the mirror while the work is live, or outside it, a third party who sees only claims?', note: 'q-evaluator' },
        { kind: 'p', text: 'The public claim is thin and specific: demonstrated this capability, at this level, on this work, on this date. Nothing crosses from mirror to claim unless the learner publishes it.' },
        { kind: 'status', tag: 'illustrated' },
        { kind: 'product', text: 'Publish this sits beside I disagree on every line of the record. Publish one and it appears below as a claim: the attribute, the band, the work, the date, and the date it fades. Disputes and evidence requirements live only on this small surface, which is what keeps claims credible to third parties without making the whole system feel like surveillance.' },
        { kind: 'try', label: 'Try it: publish a line of the record', act: 'publish', needs: 'observation', cue: 'Do a piece of work first; there is nothing to publish yet.' },
        { kind: 'fig', id: 'claims', caption: 'Fig. 2 · The public claim · Illustrated', lines: ['What crosses: this line.', 'What stays: the passages, the observations, the disputes, the dark rows.'] },
        { kind: 'query', text: 'Does the passage cross with the claim, or only the claim?', note: 'q-gate' },
      ],
      notes: [{ n: 6, text: 'Publishing writes to this session in this browser. No claim is issued, nothing leaves the page, and there is no third party on the other side yet. I disagree in the record is the learner correcting their own mirror; the disputes the document means are a third party contesting a published claim, and they belong on the claim, which is not built.' }],
    },
    {
      id: 'decisions', folio: '04', kicker: 'Decisions made',
      blocks: [
        { kind: 'decision', n: 1, status: 'decided', head: 'Ownership splits by layer.', body: 'The learner owns their demonstrated capability, their reasoning history, and every conclusion the system derives about them. All of it travels with the person. The organization owns the briefs, rubrics, and role context it authored. Vendors own none of it.',
          product: 'On the page, the brief sheet is the organization\'s layer. The record and the graph behind it are the learner\'s. In the graph\'s four columns, Read is the organization\'s layer; Made, Evidenced, and Profile travel with the person. Nothing here yet packs the record to leave with them; the graph is the shape of what would travel.',
          tryLabel: 'Try it on the Teacher tab: the brief beside her record', act: 'teacherBrief' },
        { kind: 'decision', n: 2, status: 'illustrated', head: 'Claims fade unless refreshed by new work.', body: 'Nothing certified two years ago stands on its own in this field. Refreshing happens naturally through continued use, which turns staying current into a reason to stay on the platform rather than a chore bolted on.',
          product: 'In the ledger every claim carries the date it stands until. One row is drawn faded, from an earlier session that was never refreshed, so the room can see what fading looks like before deciding how long a claim should stand.',
          tryLabel: 'Try it: compare the standing claim with the faded one', act: 'ledger',
          query: 'How long should a claim stand, and is fading an expiry or an age? The ledger uses six months so there is something to argue with.', note: 'q-fade' },
        { kind: 'decision', n: 3, status: 'open to debate', head: 'Brief authoring ships three ways.', body: 'System-drafted from artifacts the organization already has (tickets, docs, role descriptions) with manager approval; a library of role-based briefs; and learner-authored briefs validated by a manager. All three are options. One must be the default, because briefs are where quality lives or dies and we cannot build three first-class experiences at once. Suggested default: system-drafted, since it puts the least work on the least motivated party.',
          product: 'The brief on the Teacher tab was written by hand; none of the three paths is built. The nearest thing on the page is Draft the foundations, which does for the learner\'s draft what system-drafting would do for the brief: a first pass, then a person\'s approval.',
          tryLabel: 'Try it on the Teacher tab: the brief, as authored today', act: 'teacherBrief',
          query: 'Which authoring path is the default?', note: 'q-authoring' },
        { kind: 'decision', n: 4, status: 'decided', head: 'History backfill is out of scope for v1.', body: 'Importing a learner\'s past platform data (Google, YouTube, X, Meta) via GDPR and CCPA requests was considered and dropped. Cold start is carried by first-session quality instead.',
          product: 'The record on this page begins empty and says so. Nothing is imported, and nothing is recorded while you read. That is the cold start, and the second open question is whether one session can carry it.' },
      ],
      notes: [{ n: 7, text: 'The faded row is an example and says so. Six months is a placeholder, not a decision.' }],
    },
    {
      id: 'questions', folio: '05', kicker: 'Open questions for this team',
      blocks: [
        { kind: 'question', head: 'First buyer: enterprise or university.', body: 'Current lean is enterprise, but this is deliberately open. Decide on criteria rather than preference. The SFBU relationship is an access advantage in either motion.',
          board: ['which buyer pays fastest', 'whose brief-authoring burden we can realistically carry at launch', 'where existing work artifacts are dense enough to auto-draft good briefs', 'which buyer will fund an asset designed to walk out the door with the individual'],
          product: 'The prototype carries both briefs for the same work: Prof. Vega\'s to Amara, and Priya Raman\'s to Theo at Kado. Only the university one is wired to the page. Read the other and notice how little of the product would change.',
          tryLabel: 'Try it: read the enterprise brief', act: 'enterprise', status: 'illustrated' },
        { kind: 'question', head: 'First session: what makes session one worth returning to before any compounding exists.', body: 'The candidate answer is the AI first draft plus a capability mirror specific enough after one piece of work to feel uncanny. This has to be proven in the prototype, not asserted.',
          product: 'That is what the page on the left is for. Draft the foundations, work one passage against the pack, and read the record. Whether it feels uncanny is a judgment only the room can make, and it should make it here, not from this column.',
          tryLabel: 'Try it: start the first session', act: 'begin', needs: 'notStarted', cue: 'The session is under way on the left. Read the record in Fig. 1 and judge.', note: 'q-session', status: 'in the prototype, to be judged' },
      ],
      notes: [],
    },
    {
      id: 'vendor', folio: '06', kicker: 'Vendor dependence',
      blocks: [
        { kind: 'p', lede: true, text: 'One rule governs it: whoever owns the inference layer owns the moat.' },
        { kind: 'p', text: 'Outside vendors can build the shell: the editor, the UI, infrastructure, integrations, identity. The knowledge graph schema, the Evidence Engine, the inference layer that produces conclusions about people, and claim issuance stay in-house, or at minimum are contractually ours with source escrow and zero vendor rights to the data or derived models. No vendor holds or processes the private mirror in a form it can read.' },
        { kind: 'pull', text: 'The test for every contract: if this vendor disappeared tomorrow, do we still own everything that compounds?' },
        { kind: 'status', tag: 'in the prototype', label: 'At prototype scale' },
        { kind: 'product', text: 'Top right, two indicators: language and images, each live or prepared. The drafts, the research replies, and the bounded semantic reads run through a language vendor behind our proxy; the images through another. The rules that decide what counts as evidence run in the page and need no vendor. The language model may propose one signal from a closed list, and anything outside it is discarded. Turn the vendors off and the record still fills.' },
        { kind: 'try', label: 'Try it: open the trace', act: 'trace' },
        { kind: 'query', text: 'A line in the record marked read, not counted by rule came from the bounded semantic channel, and today that channel sends the passage to the language vendor. The proposal is discarded outside the closed list, but the vendor read the passage. Under the draft\'s rule, that reading runs in-house or under escrow. Which, and by when?', note: 'q-vendor' },
      ],
      notes: [{ n: 8, text: 'Claim issuance and the compounding graph do not exist yet, so nothing about them is vendor-held today. The semantic reading of passages is, at prototype scale. The rule is written for what comes next.' }],
    },
    {
      id: 'risks', folio: '07', kicker: 'Risks worth naming',
      blocks: [
        { kind: 'risk', n: 1, text: 'Holding rich private mirrors makes us a target, so learner sovereignty has to be architectural, not a clause in the terms.', product: 'On the page: dispute is on every line, and disputed lines stop counting. That is a habit, not yet an architecture.' },
        { kind: 'risk', n: 2, text: 'Third-party trust depends on publishing being selective but honest, so publishing must feel like an achievement, not an exposure.', product: 'On the page: the gate is one quiet control and the ledger is thin on purpose. Whether it feels like an achievement is a design question still open.' },
        { kind: 'risk', n: 3, text: 'Three authoring paths means three quality bars; hold the default to first-class and the others to functional.' },
        { kind: 'risk', n: 4, text: 'The prototype should prove the loop, not the polish; the demo aesthetic is already proven.' },
      ],
      notes: [],
    },
  ],
  colophon: 'Issue One. Set in the product\'s own type, one accent, on paper. Nothing here is a picture of the product; it is the product, with notes. Close the column and it is unchanged.',
}

/* Where the figure numerals sit on the product. First visible match wins. */
const MARKS = [
  { id: '01', section: 'premise', sel: '#sideBody .radarwrap' },
  { id: '02', section: 'product', sel: '#teachBrief .field' },
  { id: '03', section: 'product', sel: '.assignment .discuss, #drawerBody .discuss' },
  { id: '04', section: 'product', sel: '.beginrow' },
  { id: '05', section: 'product', sel: '#doccol .block[data-block="channel"]' },
  { id: '06', section: 'product', sel: '#sideBody .insights' },
  { id: '07', section: 'mirror', sel: '#sideBody .obs' },
  { id: '08', section: 'mirror', sel: '.iss-fig[data-fig="claims"] .iss-figcap' },
  { id: '09', section: 'decisions', sel: '#teachBrief' },
  { id: '10', section: 'decisions', sel: '.claim.faded' },
  { id: '11', section: 'decisions', sel: '#teacherView .teachleft > .ovl' },
  { id: '12', section: 'decisions', sel: '#sideSub' },
  { id: '14', section: 'vendor', sel: '#intLang' },
  { id: '15', section: 'vendor', sel: '#sideBody .proposedtag' },
]

/* ---------- state ---------- */

let api = null
let mode = 'closed'
const CLAIMS = [
  { id: 'ex-1', example: true, faded: true, attribute: 'Reasoning', band: 'Emerging', work: 'Pricing memo. Kado.', on: '3 Nov 2025', standsUntil: '3 May 2026', published: new Set() },
]
const PUBLISHED = new Set()
const NOTES_KEY = 'issue.notes'
const notes = (() => { try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}') } catch { return {} } })()
const saveNotes = () => { try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)) } catch {} }

/* ---------- render ---------- */

function blockHTML(b) {
  switch (b.kind) {
    case 'p': return `<p class="iss-p${b.lede ? ' iss-lede' : ''}">${esc(b.text)}</p>`
    case 'product': return `<p class="iss-product">${esc(b.text)}</p>`
    case 'pull': return `<blockquote class="iss-pq">${esc(b.text)}</blockquote>`
    case 'status': return `<div class="iss-statusrow">${b.label ? `<span class="iss-statuslabel">${esc(b.label)}</span>` : ''}<span class="iss-tag ${b.tag.replace(/[^a-z]/g, '')}">${esc(b.tag)}</span></div>`
    case 'try': return `<button class="iss-try" data-act="${esc(b.act)}" data-needs="${esc(b.needs || '')}" data-cue="${esc(b.cue || '')}">→ ${esc(b.label)}</button>`
    case 'query': return `<div class="iss-query"><span class="iss-kicker">Editor\'s query · raised by the product, not the document</span><p>${esc(b.text)}</p>${noteInput(b.note)}</div>`
    case 'fig': return `<figure class="iss-fig" data-fig="${b.id}"><figcaption class="iss-figcap">${esc(b.caption)}${(b.lines || []).map(l => `<span class="iss-figline">${esc(l)}</span>`).join('')}</figcaption><div class="iss-fighost" data-host="${b.id}"></div></figure>`
    case 'decision': return `<div class="iss-dec"><span class="iss-num">${b.n}</span><div class="iss-decbody">
        <div class="iss-dechead">${esc(b.head)}<span class="iss-tag ${b.status.replace(/[^a-z]/g, '')}">${esc(b.status)}</span></div>
        <p class="iss-p">${esc(b.body)}</p>
        ${b.product ? `<p class="iss-product">${esc(b.product)}</p>` : ''}
        ${b.tryLabel ? `<button class="iss-try" data-act="${esc(b.act)}">→ ${esc(b.tryLabel)}</button>` : ''}
        ${b.query ? `<div class="iss-query"><span class="iss-kicker">Editor\'s query</span><p>${esc(b.query)}</p>${noteInput(b.note)}</div>` : ''}
      </div></div>`
    case 'question': return `<div class="iss-q"><h4>${esc(b.head)}</h4>${b.status ? `<span class="iss-tag ${b.status.replace(/[^a-z]/g, '')}">${esc(b.status)}</span>` : ''}
        <p class="iss-p">${esc(b.body)}</p>
        ${b.board ? boardHTML(b.board) : ''}
        ${b.product ? `<p class="iss-product">${esc(b.product)}</p>` : ''}
        ${b.tryLabel ? `<button class="iss-try" data-act="${esc(b.act)}" data-needs="${esc(b.needs || '')}" data-cue="${esc(b.cue || '')}">→ ${esc(b.tryLabel)}</button>` : ''}
        ${b.note ? noteInput(b.note) : ''}
      </div>`
    case 'risk': return `<div class="iss-risk"><span class="iss-risknum">${b.n}</span><div><p class="iss-p">${esc(b.text)}</p>${b.product ? `<p class="iss-product">${esc(b.product)}</p>` : ''}</div></div>`
    default: return ''
  }
}

function noteInput(key) {
  if (!key) return ''
  return `<div class="iss-note"><input data-note="${esc(key)}" placeholder="Where the room lands" value="${esc(notes[key] || '')}"><span class="iss-notesub">kept in this browser only</span></div>`
}

function boardHTML(criteria) {
  const b = notes.board || {}
  return `<div class="iss-board">
    <div class="iss-boardhead"><span></span><span>University</span><span>Enterprise</span></div>
    ${criteria.map((c, i) => `<div class="iss-boardrow"><span class="iss-crit"><i>${i + 1}</i>${esc(c)}</span>
      <button data-board="${i}" data-side="U" class="${b[i] === 'U' ? 'on' : ''}" aria-label="University"></button>
      <button data-board="${i}" data-side="E" class="${b[i] === 'E' ? 'on' : ''}" aria-label="Enterprise"></button></div>`).join('')}
    <div class="iss-notesub">The room\'s tally · tap a cell · kept in this browser only</div>
  </div>`
}

function renderIssue() {
  const host = $('issue')
  const m = ISSUE.masthead
  host.innerHTML = `
    <div class="iss-head">
      <span class="iss-kicker">${esc(m.kicker)}</span>
      <h1 class="iss-title">${esc(m.title)}</h1>
      <p class="iss-stand">${esc(m.standfirst)}</p>
      <div class="iss-date">${esc(m.dateline)}</div>
      <p class="iss-line">${esc(m.line)}</p>
    </div>
    <div class="iss-run">
      <span class="iss-runtitle">First Product</span>
      <span class="iss-folio">${ISSUE.sections.map(s => `<button data-folio="${s.id}">${s.folio}</button>`).join('')}</span>
      <span class="iss-grow"></span>
      <button class="ghostbtn" data-ctl="marks">marks</button>
      <button class="ghostbtn" data-ctl="fold">fold</button>
      <button class="ghostbtn" data-ctl="close">close</button>
    </div>
    ${ISSUE.sections.map(s => `<section class="iss-sec" data-sec="${s.id}">
      <span class="iss-kicker iss-seckicker">${s.folio} · ${esc(s.kicker)}</span>
      ${s.blocks.map(blockHTML).join('')}
      ${s.notes.length ? `<div class="iss-fn">${s.notes.map(n => `<div><sup>${n.n}</sup>${esc(n.text)}</div>`).join('')}</div>` : ''}
    </section>`).join('')}
    <section class="iss-sec iss-minutes" data-sec="minutes">
      <span class="iss-kicker iss-seckicker">Minutes · where the room landed</span>
      <div class="iss-minlist"></div>
      <button class="iss-try" data-ctl="copy">→ Copy the minutes as text</button>
    </section>
    <div class="iss-colophon">${esc(ISSUE.colophon)}</div>`

  renderClaims()
  renderMinutes()
  observeFolio()
}

/* ---------- Fig. 1: the live record, re-parented ---------- */

function adoptRecord() {
  const host = $('issue').querySelector('[data-host="record"]')
  const head = document.querySelector('#sidebar .side-head') || document.querySelector('.iss-fighost .side-head')
  const body = $('sideBody')
  if (!host || !head || !body) return
  if (head.parentElement !== host) host.appendChild(head)
  if (body.parentElement !== host) host.appendChild(body)
}
function restoreRecord() {
  const sidebar = $('sidebar')
  const head = document.querySelector('.iss-fighost .side-head')
  const body = $('sideBody')
  if (!sidebar) return
  if (head && head.parentElement !== sidebar) sidebar.prepend(head)
  if (body && body.parentElement !== sidebar) sidebar.appendChild(body)
}

/* ---------- Fig. 2: the public claim, illustrated ---------- */

function renderClaims() {
  const host = $('issue')?.querySelector('[data-host="claims"]')
  if (!host) return
  const live = CLAIMS.filter(c => !c.example)
  host.innerHTML = `<div class="claims">
    ${live.length ? '' : '<div class="claim empty">Nothing published. The mirror stays private until you choose otherwise.</div>'}
    ${live.map(c => `<div class="claim"><div class="claim-attr">${esc(c.attribute)}</div>
      <div class="claim-meta">${esc(c.band)} · ${esc(c.work)} · ${esc(c.on)} · stands until ${esc(c.standsUntil)} unless refreshed${c.disputedAfter ? ' · disputed in the mirror after publishing' : ''}</div></div>`).join('')}
    ${CLAIMS.filter(c => c.example).map(c => `<div class="claim faded"><div class="claim-attr">${esc(c.attribute)}</div>
      <div class="claim-meta">${esc(c.band)} · ${esc(c.work)} · ${esc(c.on)} · faded ${esc(c.standsUntil)} · not refreshed · example</div></div>`).join('')}
  </div>`
}

function injectPublish() {
  const body = $('sideBody')
  if (!body || mode !== 'open') return
  const record = api.state().record
  body.querySelectorAll('.obs').forEach(card => {
    const btn = card.querySelector('button[data-dispute]')
    const meta = card.querySelector('.meta')
    if (!meta || card.querySelector('[data-publish], .iss-published')) return
    const obs = record.observations.find(o => btn ? o.id === btn.dataset.dispute : false)
    if (!obs || obs.disputed) return
    if (PUBLISHED.has(obs.id)) { meta.appendChild(el('span', 'iss-published', 'published')); return }
    const b = el('button', 'iss-publish', 'Publish this')
    b.dataset.publish = obs.id
    meta.appendChild(b)
  })
}

function publish(obsId) {
  const record = api.state().record
  const o = record.observations.find(x => x.id === obsId)
  if (!o || PUBLISHED.has(obsId)) return
  PUBLISHED.add(obsId)
  const band = bandFor(domainEvidence(record)[o.domainId]) || 'Noticed'
  const now = new Date(), until = new Date(now); until.setMonth(until.getMonth() + 6)
  CLAIMS.push({ id: 'c-' + obsId, obsId, attribute: o.domainName, band, work: 'Launch concept. Kado.', on: fmt(now), standsUntil: fmt(until) })
  renderClaims()
  const btn = document.querySelector(`[data-publish="${obsId}"]`)
  if (btn) btn.replaceWith(el('span', 'iss-published', 'published'))
  injectPublish()
  const claimsFig = $('issue').querySelector('[data-fig="claims"]')
  claimsFig?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  spot('.claims .claim:not(.faded):last-of-type')
}

function syncDisputes() {
  const record = api.state().record
  let changed = false
  for (const c of CLAIMS) {
    if (c.example) continue
    const o = record.observations.find(x => x.id === c.obsId)
    if (o?.disputed && !c.disputedAfter) { c.disputedAfter = true; changed = true }
  }
  if (changed) renderClaims()
}

/* ---------- marks on the product ---------- */

function placeMarks() {
  document.querySelectorAll('.fmark').forEach(n => n.remove())
  document.querySelectorAll('.has-mark').forEach(n => n.classList.remove('has-mark'))
  if (mode !== 'open') return
  for (const mk of MARKS) {
    const target = [...document.querySelectorAll(mk.sel)].find(n => n.offsetParent !== null || n.closest('.issue'))
    if (!target) continue
    target.classList.add('has-mark')
    const b = el('button', 'fmark', mk.id)
    b.dataset.mark = mk.section
    b.title = ISSUE.sections.find(s => s.id === mk.section)?.kicker || ''
    target.appendChild(b)
  }
}

function spot(sel) {
  const n = typeof sel === 'string' ? document.querySelector(sel) : sel
  if (!n) return
  n.classList.add('spot')
  setTimeout(() => n.classList.remove('spot'), 1600)
}

function scrollToSection(id) {
  const sec = $('issue').querySelector(`[data-sec="${id}"]`)
  if (!sec) return
  sec.scrollIntoView({ block: 'start', behavior: 'smooth' })
  sec.classList.add('washed')
  setTimeout(() => sec.classList.remove('washed'), 1000)
}

/* ---------- running head folio ---------- */

let folioObserver = null
function observeFolio() {
  folioObserver?.disconnect()
  const issue = $('issue')
  const buttons = issue.querySelectorAll('.iss-folio button')
  folioObserver = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      const id = e.target.dataset.sec
      buttons.forEach(b => b.classList.toggle('on', b.dataset.folio === id))
    }
  }, { root: issue, rootMargin: '-40% 0px -55% 0px' })
  issue.querySelectorAll('.iss-sec[data-sec]').forEach(s => folioObserver.observe(s))
}

/* ---------- minutes ---------- */

const NOTE_LABELS = {
  'q-typing': 'Typing alone stays dark: hold in v1, or soften?',
  'q-evaluator': 'The evaluator: inside the loop or outside it?',
  'q-gate': 'Does the passage cross with the claim?',
  'q-fade': 'How long should a claim stand?',
  'q-authoring': 'Default authoring path',
  'q-session': 'Does session one feel uncanny?',
  'q-vendor': 'Semantic reading in-house or under escrow, by when?',
}
function renderMinutes() {
  const host = $('issue')?.querySelector('.iss-minlist')
  if (!host) return
  const rows = []
  const b = notes.board || {}
  const crit = ISSUE.sections.find(s => s.id === 'questions').blocks[0].board
  const tally = crit.map((c, i) => `${i + 1}. ${c}: ${b[i] === 'U' ? 'University' : b[i] === 'E' ? 'Enterprise' : 'open'}`)
  rows.push({ q: 'First buyer, by criterion', a: tally.join('; ') })
  for (const [k, label] of Object.entries(NOTE_LABELS)) rows.push({ q: label, a: notes[k] || 'open' })
  host.innerHTML = rows.map(r => `<div class="iss-minrow"><span>${esc(r.q)}</span><span class="${r.a === 'open' ? 'open' : ''}">${esc(r.a)}</span></div>`).join('')
}
function minutesText() {
  const b = notes.board || {}
  const crit = ISSUE.sections.find(s => s.id === 'questions').blocks[0].board
  const lines = ['First Product · minutes', '', 'First buyer, by criterion:']
  crit.forEach((c, i) => lines.push(`  ${i + 1}. ${c}: ${b[i] === 'U' ? 'University' : b[i] === 'E' ? 'Enterprise' : 'open'}`))
  lines.push('')
  for (const [k, label] of Object.entries(NOTE_LABELS)) lines.push(`${label}: ${notes[k] || 'open'}`)
  return lines.join('\n')
}

/* ---------- try it ---------- */

function needsMet(needs) {
  const S = api.state()
  if (!needs) return true
  if (needs === 'started') return !!S.started
  if (needs === 'notStarted') return !S.started
  if (needs === 'observation') return S.record.observations.length > 0
  return true
}

function tryAct(btn) {
  const act = btn.dataset.act
  if (!needsMet(btn.dataset.needs)) {
    const original = btn.textContent
    btn.textContent = btn.dataset.cue || 'Not available yet'
    btn.classList.add('cue')
    setTimeout(() => { btn.textContent = original; btn.classList.remove('cue') }, 3200)
    return
  }
  const S = api.state()
  const acts = {
    profile: () => api.openProfile(),
    teacherBrief: () => { api.switchView('teacher'); setTimeout(() => { $('teachBrief')?.scrollIntoView({ block: 'center' }); spot('#teachBrief .field') }, 80) },
    discuss: () => {
      const inline = document.querySelector('.assignment .discuss input')
      if (inline && !S.started) { inline.scrollIntoView({ block: 'center' }); inline.focus(); spot('.assignment .discuss'); return }
      api.openDrawer()
      setTimeout(() => { const i = document.querySelector('#drawerBody .discuss input'); i?.scrollIntoView({ block: 'center' }); i?.focus(); spot('#drawerBody .discuss') }, 120)
    },
    begin: () => api.beginWork('foundations'),
    select: () => {
      api.switchView('student')
      api.focusBlock('channel')
      const p = document.querySelector('p.body[data-block="channel"]')
      if (!p || !p.firstChild || !p.textContent.trim()) return
      const end = Math.min(p.firstChild.length || 0, 60)
      const r = document.createRange(); r.setStart(p.firstChild, 0); r.setEnd(p.firstChild, end)
      const s = getSelection(); s.removeAllRanges(); s.addRange(r)
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      spot(p.closest('.block'))
    },
    insight: () => { const c = document.querySelector('#sideBody .insight'); c?.classList.add('open'); c?.scrollIntoView({ block: 'center' }); spot(c) },
    dispute: () => { const b = document.querySelector('#sideBody button[data-dispute]'); b?.closest('.obs')?.scrollIntoView({ block: 'center' }); spot(b?.closest('.obs')) },
    publish: () => { const b = document.querySelector('#sideBody [data-publish]'); b?.closest('.obs')?.scrollIntoView({ block: 'center' }); spot(b) },
    ledger: () => { $('issue').querySelector('[data-fig="claims"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); spot('.claim.faded') },
    enterprise: () => {
      const e = WORLDS.enterprise, u = WORLDS.university
      api.openModal(`<span class="ovl f">Present in the prototype\'s content, not wired to the page</span>
        <h3>The same brief, in a company.</h3>
        <p><b>${esc(e.evaluator.name)}</b>, ${esc(e.evaluator.role)} To <b>${esc(e.learner.name)}</b>, ${esc(e.learner.role)}</p>
        <div class="brief-body" style="font-size:14px;margin-top:10px">${esc(e.brief)}</div>
        <p style="margin-top:14px"><span class="ovl f">What she is trying to find out</span>${esc(e.wants)}</p>
        <p style="margin-top:14px;color:var(--faint);font-size:12.5px">The university brief, wired to the page, is from ${esc(u.evaluator.name)} to ${esc(u.learner.name)}. Read both and notice how little of the product would change.</p>`)
    },
    trace: () => $('btnTrace')?.click(),
  }
  acts[act]?.()
}

/* ---------- mode ---------- */

function setMode(next) {
  mode = next
  const issue = $('issue')
  document.body.classList.toggle('reading', next !== 'closed')
  document.body.classList.toggle('folded', next === 'folded')
  issue.hidden = next === 'closed'
  if (next === 'open') {
    if (!issue.dataset.rendered) { renderIssue(); issue.dataset.rendered = '1' }
    adoptRecord()
    injectPublish()
    placeMarks()
    document.body.classList.remove('marks-off')
  } else {
    restoreRecord()
    placeMarks()
  }
  try { sessionStorage.setItem('issue', next) } catch {}
  $('btnIssue')?.classList.toggle('on', next !== 'closed')
}

/* ---------- mount ---------- */

export function mountIssue(productApi) {
  api = productApi
  const issue = $('issue')

  issue.addEventListener('click', e => {
    const t = e.target.closest('button, .iss-figcap')
    if (!t) return
    if (t.dataset.ctl === 'close') return setMode('closed')
    if (t.dataset.ctl === 'fold') return setMode('folded')
    if (t.dataset.ctl === 'marks') { document.body.classList.toggle('marks-off'); return }
    if (t.dataset.ctl === 'copy') { navigator.clipboard?.writeText(minutesText()); t.textContent = '→ Copied'; setTimeout(() => { t.textContent = '→ Copy the minutes as text' }, 1500); return }
    if (t.dataset.folio) return scrollToSection(t.dataset.folio)
    if (t.dataset.act) return tryAct(t)
    if (t.dataset.publish) return publish(t.dataset.publish)
    if (t.dataset.board !== undefined) {
      notes.board = notes.board || {}
      const i = t.dataset.board, side = t.dataset.side
      notes.board[i] = notes.board[i] === side ? null : side
      saveNotes()
      const row = t.closest('.iss-boardrow')
      row.querySelectorAll('button').forEach(b => b.classList.toggle('on', notes.board[i] === b.dataset.side))
      renderMinutes()
      return
    }
  })
  issue.addEventListener('input', e => {
    const k = e.target.dataset?.note
    if (!k) return
    notes[k] = e.target.value
    saveNotes()
    renderMinutes()
  })

  // Publish this lives inside the record, which is inside the column when open.
  document.addEventListener('click', e => {
    const b = e.target.closest?.('[data-publish]')
    if (b) publish(b.dataset.publish)
    const mk = e.target.closest?.('.fmark')
    if (mk) { e.preventDefault(); e.stopPropagation(); scrollToSection(mk.dataset.mark); document.querySelectorAll('.fmark.on').forEach(x => x.classList.remove('on')); mk.classList.add('on') }
  }, true)

  document.addEventListener('evolv:render', () => {
    if (mode !== 'open') return
    adoptRecord()
    injectPublish()
    syncDisputes()
    placeMarks()
  })

  $('btnIssue')?.addEventListener('click', () => setMode(mode === 'closed' ? 'open' : 'closed'))

  // fold spine reopen
  document.body.addEventListener('click', e => {
    if (e.target.closest?.('.iss-spine')) setMode('open')
  })
  const spine = el('button', 'iss-spine', '<span>First Product · for discussion</span><b>open</b>')
  document.body.appendChild(spine)

  const wanted = new URLSearchParams(location.search).has('read') ? 'open' : (sessionStorage.getItem('issue') || 'closed')
  if (wanted !== 'closed') setMode(wanted)
}
