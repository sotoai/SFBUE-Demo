/* Insight derivation.

   Rules applied to the session's tracked state, honesty constraints first:

   1. Every insight cites the work it reads: a quote, a section, an act.
      An insight with no evidence behind it does not render.
   2. Strengths describe what happened. Development areas describe the state
      of the DOCUMENT, never an inferred trait of the person. "Three drafted
      sections stand untested" is a fact about the draft. "Lacks critical
      thinking" would be an inference about a mind, and never appears.
   3. Deterministic: same context, same insights, no model calls. The same
      derivation renders for both seats; only the voice and depth differ.

   ctx = {
     counts,            domain counts from the engine
     observations,      the record's observations, in order
     challenges: { refusals, disputes, thread },
     challengeTexts,    recent thread challenges, verbatim
     drafted: [{ id, heading, untested }],   sections that began machine drafted
     packsOpened,       how many evidence sources have been opened
     working,           whether any work beyond beginning has happened
     name,              the learner's given name, for the teacher voice
   } */

const cap = list => list.slice(0, 3)
const n = (count, one, many) => `${count} ${count === 1 ? one : many}`

export function deriveInsights(ctx) {
  const out = []
  const obsFor = domain => ctx.observations.filter(o => o.domainId === domain)
  const quotesFor = domain => cap(obsFor(domain).filter(o => o.quote).map(o => ({ quote: o.quote, note: o.because })))
  const who = ctx.name

  /* ---------- strengths: what happened, with the evidence ---------- */

  const challengeTotal = ctx.challenges.refusals + ctx.challenges.disputes + ctx.challenges.thread
  if (challengeTotal > 0) {
    const evidence = cap([
      ...obsFor('growth').filter(o => o.quote).map(o => ({ quote: o.quote, note: 'her reason for keeping her own words' })),
      ...ctx.observations.filter(o => o.disputed).map(o => ({ quote: o.disputeReason, note: 'her dispute, kept permanently' })),
      ...ctx.challengeTexts.map(t => ({ quote: t, note: 'pressed in a research thread' })),
    ])
    out.push({
      id: 'challenged', kind: 'strength', weight: challengeTotal,
      learner: {
        head: 'You are challenging what was generated for you.',
        body: `Refusing a fluent rewrite with your reason, pressing a research thread, and disputing a line of your own record are one act: judgment applied to material that arrived sounding finished. The record holds ${n(challengeTotal, 'challenge', 'challenges')}, each with your reasoning attached.`,
      },
      teacher: {
        head: `${who} challenges generated material, with reasons.`,
        body: `${n(challengeTotal, 'challenge is', 'challenges are')} in the record: rewrites refused with a stated reason, research findings pressed, or record lines disputed. The reasons are hers, quoted below, and they are the strongest signal this reading produces.`,
        guidance: 'Ask her to present the challenge she is most confident in, then the one she is least. The distance between the two is the next conversation.',
      },
      evidence,
    })
  }

  if (ctx.counts.reasoning > 0) {
    out.push({
      id: 'evidence-revision', kind: 'strength', weight: ctx.counts.reasoning,
      learner: {
        head: 'You changed the document where the evidence demanded it.',
        body: 'Rewriting a claim after opening the source that contradicts it is the turn the brief asked to see. Typing alone stays dark in this record. This did not.',
      },
      teacher: {
        head: `${who} revised against the evidence, not against feedback.`,
        body: 'The rewrite came after the contradicting source was opened, unprompted by any review. That ordering, read from the work itself, is what separates a change of mind from a compliance edit.',
        guidance: 'Ask what would have needed to be true for the original position to stand. A revision she can argue against is understood, not just made.',
      },
      evidence: quotesFor('reasoning'),
    })
  }

  if (ctx.counts.creation > 0) {
    out.push({
      id: 'visual-argument', kind: 'strength', weight: ctx.counts.creation,
      learner: {
        head: 'Your visuals are carrying argument, not decoration.',
        body: 'By briefing images with an intent, what each must show and why the document needs it, you are building understanding the text alone would not carry.',
      },
      teacher: {
        head: `${who} briefs visuals to carry specific points.`,
        body: 'Each image entered the document through a written brief stating what it must show. The briefs are quoted below; they read as argument, which is what distinguishes composition from decoration.',
        guidance: 'Have her defend one brief aloud: what does the image prove that the paragraph cannot. If she can answer, the image is doing work.',
      },
      evidence: quotesFor('creation'),
    })
  }

  if (ctx.counts.decision > 0) {
    out.push({
      id: 'committed', kind: 'strength', weight: ctx.counts.decision,
      learner: {
        head: 'Your calls carry their costs.',
        body: `A commitment reads as a decision only when its cost is named with it. ${n(ctx.counts.decision, 'call of yours is', 'calls of yours are')} in the record with the price written down.`,
      },
      teacher: {
        head: `${who} commits with the cost named.`,
        body: 'The decision block requires the price of the call to be written beside it, and the record only credits the pair. The named costs are quoted below.',
        guidance: 'Press the cost: is it the real one, and who pays it. A named cost invites a better counter than an unpriced recommendation ever could.',
      },
      evidence: quotesFor('decision'),
    })
  }

  if (ctx.counts.execution > 0) {
    out.push({
      id: 'checked', kind: 'strength', weight: ctx.counts.execution,
      learner: {
        head: 'You are checking claims against sources.',
        body: `${n(ctx.counts.execution, 'check', 'checks')} in the record where the source you opened contradicts the passage you opened it from. That is how fluent wrongness gets caught: not by feel, by looking.`,
      },
      teacher: {
        head: `${who} checks confident claims against the pack.`,
        body: 'Each check below records a source opened against a passage it contradicts. Reading alone is captured without credit; these are the moments the reading found friction.',
        guidance: 'Ask which check surprised her. A check that confirms is reading. A check that surprises is learning, and worth thirty seconds in front of the group.',
      },
      evidence: quotesFor('execution'),
    })
  }

  /* ---------- development: the state of the document, plainly ---------- */

  const drafted = ctx.drafted
  const untested = drafted.filter(d => d.untested)
  if (untested.length > 0) {
    const majority = untested.length * 2 >= drafted.length
    out.push({
      id: 'untested', kind: 'development', weight: untested.length,
      learner: {
        head: majority
          ? 'Most of this document is still generated, and untested.'
          : `${n(untested.length, 'drafted section stands', 'drafted sections stand')} untested.`,
        body: `${untested.length} of the ${drafted.length} drafted ${drafted.length === 1 ? 'section' : 'sections'} ${untested.length === 1 ? 'has' : 'have'} not been asked about, checked against the pack, or revised. Fluent text reads as finished before it is yours. Until a section is questioned, checked, or rewritten, it is the draft's first pass, not your position.`,
      },
      teacher: {
        head: `${untested.length} of ${drafted.length} drafted sections stand untested.`,
        body: 'These sections were machine drafted and have not yet been questioned, checked against a source, or revised. This describes the document, not the student: the reading treats untested generation as work that has not happened yet, never as absence of ability.',
        guidance: 'Do not mark the sections. Ask her to pick one and find the claim the pack disagrees with. The reading will catch the work as it happens, and the panel will move while she watches.',
      },
      evidence: untested.map(d => ({ quote: d.heading, note: 'not yet questioned, checked, or rewritten' })),
    })
  }

  if (ctx.packsOpened === 0 && ctx.working) {
    out.push({
      id: 'pack-closed', kind: 'development', weight: 1,
      learner: {
        head: 'The evidence pack is still closed.',
        body: 'The brief asks that every recommendation hold up against the pack. Nothing can hold up against documents that have not been opened. The pack is one click away, in the assignment.',
      },
      teacher: {
        head: 'The evidence pack has not been opened.',
        body: 'Work has begun, and no source has been opened yet. A statement about the session, not the student: the draft is running on conviction until something in it is checked.',
        guidance: 'Open one source together, against her strongest sentence. One live contradiction teaches the habit faster than any instruction to go read.',
      },
      evidence: [{ quote: 'Four sources, none opened', note: 'the assignment drawer holds the pack' }],
    })
  }

  const strengths = out.filter(i => i.kind === 'strength').sort((a, b) => b.weight - a.weight)
  const development = out.filter(i => i.kind === 'development')
  return [...strengths, ...development]
}
