/* The evidence engine.

   Two kinds of rule, kept deliberately separate, because the honesty of the
   whole idea depends on the difference.

   STRUCTURAL rules are decidable from the document model alone: a passage was
   revised, a rewrite was refused with a stated reason, a claim was committed
   with a basis. These need no model and they work with the network down.

   SEMANTIC rules ask whether a question was aimed at something. A model may
   propose one signal from the closed list below. It may never invent a signal,
   set a band, or rank a person. If it proposes something outside the list, the
   proposal is discarded.

   Nothing here scores anyone. It records what happened, and how sure we are. */

import { DOMAINS, BANDS } from './scenario.js'

const SIGNAL_BY_ID = Object.fromEntries(DOMAINS.map(d => [d.signal.toLowerCase(), d]))
export const CLOSED_SIGNAL_LIST = DOMAINS.map(d => d.signal)

export function createRecord(worldKey) {
  return {
    world: worldKey,
    startedAt: Date.now(),
    observations: [],           // every observation, in order
    captured: [],               // seen but deliberately not read as capability
  }
}

/* Band is a function of how many separate work moments support a domain.
   It describes the evidence, never the person. */
export function bandFor(count) {
  if (count <= 0) return null
  if (count === 1) return BANDS[0]      // Noticed
  if (count === 2) return BANDS[1]      // Emerging
  if (count <= 4) return BANDS[2]       // Supported
  return BANDS[3]                        // Well evidenced
}

export function domainCounts(record) {
  const counts = {}
  for (const d of DOMAINS) counts[d.id] = 0
  for (const o of record.observations) counts[o.domainId] = (counts[o.domainId] || 0) + 1
  return counts
}

/* ---------- structural rules ---------- */

export const STRUCTURAL = {
  /* Refusing a rewrite, with a reason, is the strongest structural signal
     available: the person kept their own words and said why. */
  refusedRewrite: ({ reason }) => reason && reason.trim().length > 2
    ? { signal: 'Correct', domainId: 'growth', because: 'Kept their own wording against a suggested rewrite, and said why.' }
    : null,

  /* Revising a passage the person originally wrote, after evidence was opened. */
  revisedAfterEvidence: ({ evidenceOpened }) => evidenceOpened
    ? { signal: 'Analyze', domainId: 'reasoning', because: 'Rewrote a claim after opening the evidence behind it.' }
    : null,

  /* Opening a source is checking, not reading. It is only a signal when the
     source contradicts the passage it was opened from. */
  openedContradictingSource: ({ contradicts }) => contradicts
    ? { signal: 'Check', domainId: 'execution', because: 'Opened a source that contradicts the passage it was opened from.' }
    : null,

  /* A commitment is only a decision when a cost is named with it. */
  committedWithCost: ({ basis }) => basis && basis.trim().length > 8
    ? { signal: 'Decide', domainId: 'decision', because: 'Committed to a position and named what it costs.' }
    : null,

  /* An image brief that says what the image must argue, rather than what it
     should look like, is composition in service of the case. */
  briefedImageWithIntent: ({ prompt, intent }) => intent && intent.trim().length > 3
    ? { signal: 'Compose', domainId: 'creation', because: 'Briefed an image to carry a specific point, not to decorate.' }
    : null,

  /* Naming a person who will resist, and writing toward their objection. */
  addressedObjection: ({ named }) => named
    ? { signal: 'Frame', domainId: 'perspective', because: 'Named the person who will push back, and wrote toward their objection.' }
    : null,

  /* Flagging a claim for checking is not reading. It is noticing that
     something load bearing has not been established. Guarded so that tagging
     any stray phrase does not count: the passage has to carry a claim. */
  taggedUncertainty: ({ passage }) => /\d|\bevery\b|\ball\b|\bnever\b|\balways\b|\bmost\b|\bonly\b/i.test(String(passage || ''))
    ? { signal: 'Inquire', domainId: 'perception', because: 'Flagged a claim carrying a number or an absolute, before anyone asked.' }
    : null,

  /* A document is a system: change one part and others stop fitting. Revising
     a second section after a first is the person keeping the whole coherent. */
  alignedAcrossSections: ({ priorSections }) => priorSections > 0
    ? { signal: 'Discern', domainId: 'systems', because: 'Revised a second passage to keep it consistent with the first.' }
    : null,
}

/* ---------- semantic proposal, strictly bounded ---------- */

export function acceptProposal(raw) {
  if (!raw || typeof raw !== 'object') return null
  const signal = String(raw.signal || '').trim()
  const match = SIGNAL_BY_ID[signal.toLowerCase()]
  if (!match) return null                       // outside the closed list, discard
  return {
    signal: match.signal,
    domainId: match.id,
    because: String(raw.because || match.reads).slice(0, 160),
    proposed: true,
  }
}

/* ---------- recording ---------- */

export function observe(record, hit, context = {}) {
  if (!hit) return null
  const domain = DOMAINS.find(d => d.id === hit.domainId)
  if (!domain) return null
  const entry = {
    id: `obs-${record.observations.length + 1}`,
    signal: hit.signal,
    domainId: hit.domainId,
    domainName: domain.name,
    because: hit.because,
    proposed: Boolean(hit.proposed),
    quote: context.quote || '',
    section: context.section || '',
    at: Date.now(),
    elapsed: Date.now() - record.startedAt,
    disputed: false,
    disputeReason: '',
  }
  record.observations.push(entry)
  return entry
}

/* Captured, but deliberately not read as capability. The contrast is the point:
   a reading that can never come back empty is not a reading. */
export function capture(record, what, link = null) {
  const entry = { id: `cap-${record.captured.length + 1}`, what, link, at: Date.now() }
  record.captured.push(entry)
  return entry
}

export function dispute(record, observationId, reason) {
  const o = record.observations.find(x => x.id === observationId)
  if (!o) return null
  o.disputed = true
  o.disputeReason = reason || ''
  return o
}

/* Honest time: minutes into the session, which is what elapsed measures.
   "3 min ago" would freeze and drift into a lie on every later render. */
export function relativeTime(ms) {
  const s = Math.round(ms / 1000)
  if (s < 60) return `at ${s}s`
  const m = Math.round(s / 60)
  return `at ${m} min`
}

/* What the record can and cannot say. Rendered verbatim in the interface. */
export const GUARDRAILS = [
  'One observation is a thing that happened once. It is not a trait.',
  'Every line points at a passage you can read. If it cannot, it does not appear.',
  'A domain with no evidence stays dark. Absence is never inferred as weakness.',
  'The person can dispute any line, and the dispute is kept permanently.',
]
