# ANCHOR.md

**Master reference for the Evolv Enterprise Demo** (SFBUE)
v0.1, drafted 2026-08-09

**How to use this document.** Every new Claude Code thread reads this first and states which sections it touches. This document specifies functionality, intent, and standards. It does not dictate code organization; structure is the coding agent's call. When a thread's work changes a decision recorded here, update this document in the same session so it stays the single source of truth.

---

## 0. Bar

Success is observable in two ways: (1) the build team ships the demo without the author in the room, because this document and the beat script answer every intent question; (2) a cold recipient opens the link with no narrator, clicks through alone, and can retell the core idea in one sentence: capability is read from real work, invisibly, while the person just does the job.

Two named failure modes. **Scope creep:** the demo quietly becomes a functioning product. This is a vision artifact; depth beats coverage, and one clean flow beats eight shallow ones. **Forklift:** the demo reads as an LMS with AI bolted on, an incremental advance of institutional education. Nothing on screen may resemble a quiz, a grade, a course, or a certificate.

---

## 1. What this is

A browser-based, playable walkthrough of Evolv's enterprise experience. The viewer is the professional: they type into the surface and converse with the agent for real, while the narration rail names the invisible machinery. Not a slideshow and not a full app:

- Product surface on the left: clean, real-feeling, genuinely typeable. Conversational moments are real exchanges with the agent; structural beats stay deterministic.
- Whisper narration rail on the right: one line at a time, naming the invisible machinery.
- Forward-click pacing throughout. The presenter controls tempo in a room; the rail carries the story alone over email.
- Single hero scenario: an enterprise professional building a go-to-market plan for an emerging product.
- Pitched at where AI realistically lands in roughly six months.

Audience, in order: the SFBUE build team (this is their spec-by-example), then board and partner rooms, then cold email recipients.

---

## 2. First principles (why it looks like nothing institutional)

Education is treated as a primitive and rebuilt from how humans actually learn:

1. Humans learn by doing and failing safely. The atomic unit is a challenge with real stakes and fast feedback, not a lecture.
2. Memory is reconstructive and decays; spaced retrieval beats cramming.
3. Motivation is intrinsic given agency, curiosity, and meaningful difficulty.
4. Understanding is built by connecting new to known; the system must model what the learner already knows.
5. Learners start from different points with different drivers; a fixed path is a bug.
6. Transfer to novel situations is the only outcome that matters.

Bridge to Capability Science: capability is not tested with a quiz, it is observed in the work itself. Assessment is an invisible byproduct of real work, never a separate event. Outcomes are never certification or rote recall; the future worker is valued for aptitude, adaptation, and innate drivers.

---

## 3. The product concept being demonstrated

A two-sided platform.

**Evaluator side.** The demo opens here. The evaluator authors the brief (the real job task), defines what success looks like, and sets the coaching ceiling. Intent lives on this side; it is what makes the thing a product, not a toy.

**Learner side.** An interactive document editor where the artifact is the work. The professional can highlight any passage, research it, attach reasoning and drivers via an AI assistant, and challenge what the AI hands back. Every interaction is captured, cataloged, and coached; the three verbs are the product spine.

**Coaching is adaptive, not a learner dial.** Everyone starts light-touch; the system pulls back as it sees competence. The evaluator sets the ceiling, demonstrated capability sets the level. Struggle stays intact, and coaching interactions are themselves evidence.

**Signals the Evidence Engine reads** (the demo's cataloging layer must trace to these):
- Questions asked against the brief, and questions conspicuously not asked.
- The cold-draft versus generate-first choice itself.
- Every highlight, research call, reasoning attachment, and challenge to AI output.
- Restructuring after new evidence.

**V2, horizon only:** the artifact transcends the document. Same capture-catalog-coach engine; the surface morphs to the task: dashboards, working prototypes, project plans, physical products. Mentioned on the closing slide, never built.

---

## 4. Demo arc

Seven beats. The full beat script (on-screen text plus narration lines) is a separate deliverable governed by this anchor: beat-script.md, v2.0, 2026-08-09, including the complete signal map. The built artifact is index.html, a single self-contained file. A minimal cover screen (wordmark, one line, click cue) precedes Beat 0 and teaches the interaction model; forward click at a typeable moment auto-types the scripted question so a click-only viewer never stalls.

| Beat | Surface | What it demonstrates |
|---|---|---|
| 0. Author | Evaluator writes the brief, defines success, sets coaching ceiling | Intent; the two-sided platform |
| 1. Brief | Learner receives a deliberately incomplete brief with a chat rail to interrogate it | Inquiry as signal; the questions not asked reveal blind spots |
| 2. Canvas | Blank editor, two affordances: start writing or generate a first draft | Agency; the choice itself is a signal |
| 3. Draft | AI lays down a structured but generic plan with one planted shaky assumption in pricing | The critique-and-correct setup |
| 4. Work | Highlight, research, attach reasoning, challenge the AI, restructure | Captured and cataloged; atomic signals lighting domains in real time on the rail |
| 5. Mirror | Not a grade, a mirror: how you reasoned, where you over-trusted the AI, one capability to stretch | Coached; evidence-confidence, defensible not black-box |
| 6. Horizon | What this becomes: artifact morphing, the remaining domains, the full map | Leaves the room imagining the system without building it |

---

## 5. Spotlighted capability domains

Four of Bryce's eight, each tied to a scripted on-screen moment. The other four appear only on the mirror's map and the horizon slide.

| Domain | Demo moment | Atomic signals shown |
|---|---|---|
| Perception | Noticing the brief is incomplete; catching the planted assumption | Discern |
| Creation | Interrogating the brief before writing | Inquire |
| Reasoning | Researching the assumption, weighing evidence | Analyze, Test |
| Decision | Committing to a pricing call under uncertainty | Decide |

Revisable; see Open Problems 1 and 2.

---

## 6. Narration rail standards

- One line at a time, whisper register, twelve words or fewer.
- Names what the system is doing, never sells it. "The Evidence Engine is reading questioning depth," not "Powerful AI insights!"
- Plain language a board member parses in one read. No jargon the product surface hasn't earned.
- Every rail line pairs with a visible on-screen action. No claims about machinery the viewer cannot see happening.

---

## 7. Design standards

- The register is modern evolved academic: the restraint of a clean Korean or Japanese brand. Simple, minimal, usable. Bold through scale and conviction, never decoration. Simple language, engaging, non-technical, with depth available on click rather than explained on screen. The full visual language (palette, type, layout, motion, rail behavior) lives in DESIGN.md, governed by this section.
- Clean aesthetic that feels like its own product, not a slide deck and not a Figma mock.
- Very few words on screen. Lean, direct copy. No cheerleading language anywhere in-product.
- No em dashes in any copy.
- The editor must look like a place real work happens: restrained chrome, generous whitespace, typography doing the hierarchy.

---

## 8. Technical form

- A single self-contained static artifact (one HTML file preferred) that runs from a link with no server.
- Two intelligence modes (decision changed 2026-08-09, superseding the original no-live-calls rule). **Live:** with an Anthropic API key pasted into a quiet connect control (stored in the browser only; calls go directly to Anthropic), conversational moments are answered by a live model held in-world by a fenced system prompt. **Cold:** without a key, an intent-routed staged response bank answers, so the demo runs from a bare link with no setup and never stalls. Every live path falls back to the staged bank on any error, timeout, or refusal.
- The structural spine stays deterministic in both modes: beats, the signal map, chip firings, the mirror, and the horizon never depend on model output.
- Forward-click advances beats; typing moments accept real input, allow follow-ups, and auto-type a scripted question for click-only viewers.
- The viewer's real choices (write first versus generate, commit versus hold) branch visibly and converge structurally; the mirror reflects what the viewer actually did.
- Works cold in a fresh browser. Desktop-first; must not break on a laptop projector.

**Deployment (2026-08-09).** Published at https://sotoai.github.io/SFBUE-Demo/ from https://github.com/sotoai/SFBUE-Demo (public repo, GitHub Pages, `main` branch root). The built artifact is `index.html` at the repo root; there is deliberately only one copy of the demo, so edit `index.html` and push. The repo carries only `index.html`, `README.md`, and `.gitignore`. **ANCHOR.md, beat-script.md, and DESIGN.md are intentionally untracked**: the repo is public, and these carry internal strategy, audience notes, and a named colleague. Publish them only on a deliberate decision, ideally to a private repo or a docs branch.

**Live-path verification (2026-08-09).** From the deployed origin, a browser call to `api.anthropic.com` returns HTTP 401 `invalid x-api-key` for a bogus key, which confirms the network path and CORS both work from `https://sotoai.github.io` with the `anthropic-dangerous-direct-browser-access` header. What remains unverified is the quality of an actual live model response in character; run one exchange with a real key before a room demo.

---

## 9. Terminology contract

Match Bryce's language exactly: **Capability Science, Evidence Engine, Evolv, capability domains** (never skills), **atomic capabilities** (known examples: Analyze, Discern, Inquire, Test, Correct), **evidence-confidence score**. Banned vocabulary anywhere in the demo: grade, test, quiz, score (except evidence-confidence score), certificate, course, curriculum, LMS.

---

## 10. Standing contract for every Claude Code thread

**Bar.** Restated from Section 0: build team ships without the author present; a cold viewer retells the idea in a sentence. Failure modes: scope creep and forklift.

**Gate.** Before any beat or build counts:
- Every beat reads standalone; a viewer with no narrator understands what happened and why it matters.
- Every capability light-up traces to a visible on-screen action and a named atomic signal. No domain lights without cause.
- Every narration line is twelve words or fewer.
- No beat depends on a backend, a network call, or a live model.
- The full arc runs cold from a single link in a fresh browser.
- Nothing beyond the hero scenario is built. The horizon slide is the only place v2 exists.
- "This beat adds nothing a prior beat didn't" is a valid finding; cut the beat rather than pad it.

**Order.** Beat script and signal map first (which on-screen action maps to which atomic signal to which domain), visual language second, clickable build last. Do not shape the script around guessed UI.

**Contracts.** The beat-script format and the signal-map schema (action, atomic signal, domain, rail line) are defined before any fan-out into parallel workstreams.

**Critics.** Fan out build agents by concern, then submit to two critics who were not part of the build. Critic A, cold viewer: opens the link with zero context and five minutes, reports whether the core idea survives, and audits what confused, bored, or read as an LMS. Critic B, framework fidelity: verifies terminology matches Section 9, every light-up traces per the Gate, no invented domains or atomic signals, and no functionality crept past the Fence.

**Bound.** Iterate until both critics pass twice on fresh click-throughs, or three cycles, whichever comes first. If three cycles pass without converging, stop and report what is structurally unfixable.

**Fence.** Done means: a single shareable artifact, the full seven-beat arc, self-narrating, horizon close, both critics signed off. Out of scope for this demo, permanently: a working Evidence Engine or any real assessment logic; live AI calls; accounts, auth, or persistence; higher-ed and K-12 personas; building any v2 artifact form; the four non-spotlighted domains beyond the mirror map; mobile layout beyond not-breaking.

---

## 11. Open problems (top of stack)

1. Confirm the four spotlighted domains and their atomic mappings (Section 5).
2. Reconcile atomic signal names with Bryce's Evidence Engine pilot outline doc (Google Doc, auth-gated; needs manual pull).

7. The on-screen word `evaluator` (Beat 1 header, Beat 4 send button): two independent cold-viewer critics flagged it as the one label that reads assessment-flavored against the "nothing is submitted for judgment" thesis. It is Section 3 canon vocabulary, so the demo keeps it; decide with Bryce whether the learner-facing surface should carry a different word.

**Critic record for the v2 interactive build (Copperline), 2026-08-09.** Critic B (framework fidelity, including the live-agent system prompt and staged bank) passed cycle 1 with zero violations across terminology, trace, fence, and rail; its advisory live-mode risks (moment-tag injection, truncation, banned-vocabulary slips, silent live degradation) were all hardened the same session. Critic A (interactive cold viewer, typing adversarially and choosing contrarian branches) failed cycle 1 on interaction honesty: a single canned answer for every question, the hold-at-per-seat choice lost to a miss-click race, and the watch-only Beat 0 panel swallowing typed input. Fixes: an intent-routed bank with pilot-integrity, competition, and off-topic deflection responses plus a no-repeat rotation; miss-clicks inside an armed choice card made inert; Space no longer advances; a `watch` cue on Beat 0; a stale fast-forward engine bug fixed. Critic A passed cycle 2: typed input engaged rather than parroted, both contrarian choices reflected accurately in the mirror, no LMS reads, nothing broken. Residual polish applied after the pass: unmatched questions deflect rather than borrowing topic answers, and Beat 0 controls are visually inert. Live mode is code-complete but has not been exercised with a real API key (the development browser blocks external calls); verify once with a real key before a room demo.

**Critic record for the v1 scripted build, 2026-08-09 (superseded the same day by the interactive rebuild above; kept for the record).** Critic B (framework fidelity) passed all three cycles clean: zero terminology, trace, fence, or rail violations; seven light-ups map one-to-one to the signal map; mirror counts match firings. Critic A (cold viewer) confirmed the core idea retells in one sentence in all three cycles and failed each cycle on one interaction defect, each root-caused and fixed: cycle 1 dead Enter and pre-arm typing (inputs now inert-then-hidden until armed, Enter is a universal advance, quiet send affordance added); cycle 2 throttled typewriter and rubric drift (time-based typing, Beat 6 bands removed, rail footer `Four of eight domains.`); cycle 3 input row visible one beat before live due to a CSS ordering bug (fixed, and the exact failure sequence replayed clean by the build thread). Accepted tensions, by design: staged responses answer approximately when a viewer types off-script (Section 8, no live model); the horizon names v2 forms without showing them (the Fence); evidence-confidence bands on the mirror read rubric-adjacent to some viewers (Section 9 canon).

Resolved 2026-08-09 (revisable, recorded in beat-script.md and the build):
3. Hero scenario (revised 2026-08-09 at the author's direction, replacing the earlier medtech scenario): Copperline, an AI support agent that resolves customer tickets end to end, crossing from nine design partners into its first commercial year. The planted pricing assumption is $59 per agent seat, the familiar unit; it collapses because the product shrinks the seats it bills (pilot: seats down 22 percent while resolutions grew 3.1 times) and invites a losing comparison with $25 helpdesk seats in IT's budget while the savings land in the support budget. The correction is $1.50 per resolved ticket with an annual floor, sold to the VP of customer experience against their $11.40 cost per human resolution. All numbers are invented and internally consistent.
4. Beat 0 visibly shows the evaluator setting the coaching ceiling with a minimal three-position control (Light / Standard / Full); the rail names what it means. Beat 5's coaching card pays it off.
5. The learner surface carries no separate name. It is just Evolv.
6. The demo ships with the Evolv wordmark only. No SFBUE branding anywhere on screen.

---

## 12. Source spine

- "Capability Science and Innovation Group" (Bryce Barich, 2026-06-18): the eight-domain framework, Evolv and SFBUE definitions, Evidence Science, consortium model.
- "Evidence Engine Pilot" (Barich, 2026-06-23): agentic assessment at the atomic level, the Artifact Challenge MVP, worktrace-based capability and evidence-confidence scoring.
- "SFBUE Board Intro to Capability Science / Evolv" (Barich, 2026-07-29): board deck, Framer workspace, Evolv PRD (Google Drive, 2026-07-16).
- Capability domains: Perception, Reasoning, Creation, Decision, Execution, Human, Systems, Growth.
