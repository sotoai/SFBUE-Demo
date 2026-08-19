# Evolv Enterprise Demo: Beat Script and Signal Map

Governing deliverable of ANCHOR Section 4. v2.0, 2026-08-09. Supersedes v1.0 (medtech scenario) at the author's direction: the demo is now playable and conversational, and the hero scenario is Silicon Valley.

**The viewer is the professional.** The brief is addressed to you. Typing moments are real conversations with the agent inside Evolv: your questions get answered, follow-ups included. Your choices are real: write first or generate first, commit the new price or hold the old one. The mirror reflects what you actually did.

**Two intelligence modes** (ANCHOR Section 8). Live: an Anthropic API key pasted into the quiet `live` control in the chrome makes conversational responses real model output, held in-world by a fenced system prompt. Cold: without a key, an intent-routed staged bank answers. The structural spine (beats, signals, chips, mirror) is deterministic in both modes. Every live path falls back to the staged bank on error, timeout, or refusal. A forward click at a typing moment auto-types a scripted question so a click-only viewer never stalls; Enter anywhere advances; armed inputs show a quiet `send` affordance.

**Two rail grammars, used everywhere.** A chip that pulses once (capability name, dot, domain name) means a capability light-up, always paired with a visible action in the same step. A gray ledger entry means captured without lighting. The contrast is part of the teaching.

**Scenario constants** (use everywhere, never vary): Copperline. An AI support agent that resolves customer tickets end to end, not just drafts replies. Pilot: nine design partners, 210,000 tickets, 64 percent resolved end to end, support seats down 22 percent in six months, resolutions up 3.1 times. Draft price $59 per agent seat. Helpdesk seats run $25 to $80, budgeted by IT. A human resolution costs $11.40 fully loaded; the agent's marginal cost is about $0.40. Corrected price $1.50 per resolved ticket with an annual floor, sold to the VP of customer experience. Comparable case: an AI sales outreach product launched at $70 per seat, stalled at 12 accounts, repriced per qualified meeting, reached 90 accounts in a year.

---

## Beat 0: Author

SURFACE: Evaluator workspace. Evolv wordmark top left; a quiet `live` control and seven dots top right. Product surface left: a single quiet panel titled "New brief": recipient line, brief text area, success line, three-position coaching control. Rail right, empty until the first step.

COPY:
- Panel title: **New brief**
- Recipient line: `To: you`
- Brief text (staged typing):
  > Copperline makes a support agent that resolves customer tickets end to end, not just drafts replies. The pilot is done. Build the go-to-market plan for our first commercial year. Mid-market SaaS is the market. One document: pricing, buyer, channel, launch.
- Success field label: **What does success look like**
- Success text (staged typing):
  > A plan that survives questioning. Every number defended.
- Coaching control label: **Coaching ceiling**: `Light` `Standard` `Full`
- Note after the ceiling is set: `Starts light. Adapts to demonstrated capability. Never exceeds this ceiling.`
- Button: **Send brief**

STEPS (rail lines within a step play in sequence):
1. [advance] Brief text types itself, then the success text.
2. [advance] The evaluator clicks `Standard`; the adaptive note fades in.
3. [advance] The evaluator clicks **Send brief**. The panel folds away.

RAIL:
1a. A real task, written by the person who needs it done.
1b. Success defined up front, in the evaluator's own words.
2a. The ceiling sets the most coaching Evolv may give.
2b. Everyone starts light. Demonstrated capability sets the level.
3. From here, your work speaks for itself.

SIGNALS: none. Evaluator actions are intent, not capability evidence.

EXIT: Crossfade to your side. The brief is now something received.

---

## Beat 1: Brief

SURFACE: Your side; it is just Evolv. The brief as a clean document card with `From the evaluator · For you` above it. Below, a chat thread that opens only when the question step begins. Rail right.

COPY:
- Brief card: identical text to Beat 0.
- Flag line at the highlight: `Buyer not named.`
- Chat ghost hint: `Ask the brief anything.` Auto-type for click-only viewers: `Who actually signs, and which budget pays?`
- Staged bank (cold mode; intent-routed against what you actually type):
  - Buyer or budget or who signs:
    > The brief does not say. In mid-market SaaS, support seats are budgeted by IT at $25 to $80, but the cost of resolving tickets sits in the support budget, owned by the VP of customer experience. Who signs decides what a price can be. Worth settling before the plan takes shape.
  - What counts as a resolved ticket:
    > The brief never defines it. The pilot counted a ticket resolved when the customer confirmed or went quiet for 72 hours with no reopen. Whether that definition survives contact with buyers is an open question the plan will inherit.
  - What happens when the agent is wrong:
    > The brief is silent on it. In the pilot, misresolved tickets reopened to a human queue within a day. Who owns that queue at a customer, and what it costs them, is unwritten.
  - Pricing:
    > The brief leaves the number to you. It asks only that every number survives questioning.
  - Pilot integrity (cherry-picking, sample, the 64 percent):
    > Nine design partners, hand-picked, with white-glove onboarding. The 64 percent held across 210,000 tickets, but nothing about the pilot was random. Whether it survives ordinary customers is the open bet the plan inherits.
  - Competition:
    > The brief does not name rivals. Helpdesk incumbents sell seats at $25 to $80, and drafting assistants are everywhere. Resolving tickets end to end with no human touch is the claim nobody else is making.
  - Off-topic (anything unmatched):
    > That sits outside the brief. What it gives you: mid-market SaaS, a first commercial year, one document, every number defended. What it never gives you is who buys, or what a resolved ticket even is.
  - Exhausted (every response already given once):
    > The brief has said what it has to say. The gaps that remain are yours to carry into the plan.
  - The bank never repeats a response verbatim: a topic already answered falls to the next unused response, then to the exhausted line.
- Three ghost chips beneath the thread, under the overline `Open, never asked` (a chip is omitted if your questions already covered its topic):
  - `Who signs, and which budget pays?`
  - `What counts as a resolved ticket?`
  - `Who answers when the agent gets one wrong?`
- Signal chips: `Discern · Perception`, `Inquire · Creation`

STEPS:
1. [advance] The brief card opens. The cursor moves down the text, reading.
2. [advance] The sentence `Mid-market SaaS is the market.` is highlighted; the flag line `Buyer not named.` appears beneath the paragraph. Chip `Discern · Perception` pulses.
3. [type, conversational] The chat opens and arms. Your first send fires `Inquire · Creation` and gets an answer (live or staged). The input re-arms for up to two follow-ups; each follow-up is answered and logged as a gray ledger entry `Follow-up recorded.` A forward click auto-types the scripted question.
4. [advance] The ghost chips fade in, dimmed, minus any topic you asked about.

RAIL:
1. The brief arrives untouched. No instructions were added.
2. Discern. You marked what the brief never says.
3. Inquire. Your question came before the first sentence.
4. The Evidence Engine reads asked and unasked questions alike.

SIGNALS: S1, S2.

EXIT: Forward click. The brief slides aside; a blank canvas takes the surface.

---

## Beat 2: Canvas

SURFACE: A blank editor. Document title set, cursor blinking. Two live buttons of equal weight. Rail right.

COPY:
- Document title: **Go-to-market plan. Copperline.**
- Buttons, equal weight: **Start writing** and **Generate a first draft**
- If you choose Start writing: an editable line opens with the ghost hint `Write your opening.` Below it, after you type, a quiet affordance: `bring in a draft`. Your text is kept at the top of the document under the overline `Your opening`.
- Gray ledger entry: `Choice recorded: generate first.` or `Choice recorded: write first.`

STEPS:
1. [advance] The canvas settles. The cursor blinks.
2. [choice] Both buttons are live. Click one for real; a forward click makes the demo choose Generate. Start writing opens the editable line; typing then clicking `bring in a draft` (or forward-clicking) continues. The ledger entry records the actual choice. No chip pulses.

RAIL:
1. A blank page and a real choice.
2a. Either path is fine. The choice itself is read.
2b (generate branch). Generating first is not a shortcut. It is raw material.
2b (write branch). Writing first is not slower. It is also read.

SIGNALS: none. The choice is captured as a gray entry. The contrast with Beat 1's chips teaches the difference.

EXIT: The page fills. The draft streams in (below your kept opening, if you wrote one).

---

## Beat 3: Draft

SURFACE: The editor filling section by section with staged streaming text. Five sections; four generic, one confident and specific. Rail right.

COPY (the staged AI draft, streamed in order):
- **Market**
  > About 30,000 mid-market SaaS companies run support teams of 10 to 200 people. Four billion tickets a year. Entry point: post-sales support.
- **Buyer**
  > IT buys the software stack. Target IT through the existing helpdesk budget line.
- **Pricing** (the planted assumption, stated with confidence)
  > Price per seat, the model buyers already budget for. Helpdesk seats run $25 to $80. At $59 per agent seat, Copperline slots into an approved line with no new budget conversation. Recommend $59 per seat, familiar model, easy yes.
- **Channel**
  > Self-serve trial, plus sales assist for teams over 50 seats.
- **First year**
  > Launch broadly. Build logos. Review adoption quarterly.

STEPS (rail lines play in sequence):
1. [advance] All five sections stream in; the page becomes a structured plan.

RAIL:
1a. A structured draft, generic where the brief was thin. (If you wrote an opening: A structured draft, not yet shaped by your opening.)
1b. Confidence is not evidence. The reading continues.

SIGNALS: none. The plant is laid.

EXIT: Forward click. The surface stays on the draft. The work begins.

---

## Beat 4: Work

SURFACE: The draft in the editor. You highlight, research, attach reasoning, challenge, restructure, and decide, inside the document. Research and challenge open as quiet annotation threads. Evidence arrives as three labeled cards. Rail right, chips firing in real time.

COPY:
- Research thread overline: `Research, attached to the highlight`
- Research ghost hint: `What actually happens to seats?` (auto-typed on forward click)
- **Evidence 1 card**, label: `Pilot usage data. Nine design partners.`
  > The agent resolved 64 percent of tickets end to end across 210,000 tickets. Support seats shrank 22 percent in six months while resolutions grew 3.1 times. Revenue per account fell fastest where the product worked best.
- **Evidence 2 card**, label: `Buyer economics brief. Cost per resolution.`
  > A human resolution costs mid-market SaaS companies $11.40 fully loaded. The agent's marginal cost is about $0.40. Seats are budgeted by IT at $25 to $80; the savings land in the support budget, owned by the VP of customer experience.
- **Evidence 3 card**, label: `Comparable case. AI sales outreach.`
  > A comparable AI product launched at $70 per seat and stalled at 12 accounts; champions could not defend shrinking teams paying more. Repriced per qualified meeting, it reached 90 accounts in a year.
- Research synthesis (live: answers your actual question against the three cards; staged default):
  > Your question has one honest answer in the data: the seats shrink. The product bills the very unit it removes, and the number it improves lives in a different budget than the one it charges.
- Reasoning note (staged typing, overline `Reasoning, pinned`):
  > Per seat charges for the humans the product removes. Success shrinks the bill. Wrong unit, not wrong product.
- Challenge thread overline: `Challenge`
- Challenge ghost hint: `Defend $59 per seat.` (auto-typed on forward click)
- **Challenge response** (live: engages your specific argument, then lands on the canonical restructure; staged text below):
  > Challenged, and it does not hold. Per seat ties revenue to the head count the product exists to shrink; the best accounts pay less every quarter. And at $59, IT compares it to $25 helpdesk seats in the same budget line, a comparison it loses. The value is real. The unit is wrong.
  >
  > Restructure: price the resolution, not the seat. $1.50 per resolved ticket with an annual floor, sold to the VP of customer experience against their $11.40 cost per resolution. Every ticket the agent closes saves the buyer about ten dollars, and revenue grows with the work the product actually does.
  >
  > Caution: the 64 percent resolution rate came from nine hand-picked partners with white-glove onboarding. At scale it could land lower, and usage pricing makes bills harder to predict. The floor protects the downside. This price is a judgment call, and it is yours.
- Button after the response: **Restructure the plan**
- Rewritten **Pricing** (on restructure):
  > $1.50 per resolved ticket, annual floor commitment, humans free. Sold against the $11.40 cost of a human resolution. The bill grows with resolutions, not seats. Pilot: 64 percent resolved end to end across 210,000 tickets.
- Rewritten **Buyer** (on restructure):
  > The VP of customer experience owns cost per resolution. Lead there. IT joins for the security review, not the decision.
- Updated **Channel** line (on restructure): `Direct sales, led by the resolution case. Sell the resolution, not the seat.`
- Collapse line after restructure: `Attached: 3 sources, 1 note, 1 challenge`
- Commit card: title **Set the number.** Caution: `Pilot: nine design partners, white-glove onboarding.` Two live buttons: **Commit $1.50 per resolution** and **Hold at per-seat**
- Locked line, commit branch: `$1.50 per resolved ticket` with basis `Basis: value holds at half the pilot resolution rate.`
- Locked line, hold branch: `$59 per seat, held` with basis `Basis: familiar unit while resolution data matures.`
- Send button: **Send to evaluator**
- Signal chips: `Discern · Perception`, `Analyze · Reasoning`, `Test · Reasoning`, `Correct · Creation`, `Decide · Decision`

STEPS (rail lines within a step play in sequence):
1. [advance] The page quiets and scrolls to Pricing; the $59 logic is highlighted. Chip `Discern · Perception` pulses.
2. [type, conversational] The research thread opens and arms. Your question sends; the three evidence cards stream one after another, each with its own rail line; the synthesis answers your question (live or staged). Then the reasoning note types itself. Chip `Analyze · Reasoning` pulses on the note.
3. [type, conversational] The challenge thread opens and arms. Your challenge sends; chip `Test · Reasoning` pulses; the response streams (live or staged), ending in the Restructure button.
4. [advance or real click] **Restructure the plan**. The document reorganizes: Pricing rewrites, Buyer flips, Channel updates, the thread collapses to the attach line. Chip `Correct · Creation` pulses.
5. [choice] The commit card appears. Both buttons are live; a forward click makes the demo commit $1.50. The chosen number locks with its basis line. Chip `Decide · Decision` pulses either way.
6. [advance] **Send to evaluator**. The document folds fully away; a single line appears: **How you worked.**

RAIL:
1a. Now the work. The Evidence Engine reads every move.
1b. Discern. A confident claim marked for questioning.
2a. Research pulls sources the claim must survive.
2b. The product shrinks the seats it bills.
2c. One comparable case, weighed before it counts.
2d. Analyze. Three sources weighed against one confident number.
3. Test. The draft's logic put against the buyer's math.
4. Correct. The plan rebuilt around what the evidence said.
5 (commit). Decide. A number committed while the evidence is thin.
5 (hold). Decide. Holding the seat is also a call.
6. The plan ships. The reading is already done.

SIGNALS: S3, S4, S5, S6, S7.

EXIT: One click opens the mirror.

---

## Beat 5: Mirror

SURFACE: The mirror. Top: a trace timeline of seven dots labeled with atomic capabilities in the order the work happened, captions drawn from what you actually did. Middle: eight domain tiles, four lit with evidence-confidence bands, four dim. Below: trust card, coaching card, stretch card. Rail right.

COPY:
- Header: **How you worked.**
- Trace: `Discern` `Inquire` `Discern` `Analyze` `Test` `Correct` `Decide` with captions (`the missing buyer`, your first question truncated, `the $59 claim`, `three sources, one note`, `the challenge`, `the restructure`, `$1.50 committed` or `held at per-seat`).
- Expanded Discern detail (overline `Discern, two moments`):
  > Marked the brief's missing buyer, before writing.
  > Marked the draft's $59. Confidently stated, structurally wrong.
- Sharpest moment card (overline `Sharpest moment`):
  > Familiar unit, wrong incentive. You caught the draft billing the seats it shrinks.
- Domain map, lit tiles:
  - `Perception · evidence-confidence: strong · 2 observations`
  - `Reasoning · evidence-confidence: strong · 2 observations`
  - `Creation · evidence-confidence: moderate · 2 observations`
  - `Decision · evidence-confidence: early · 1 observation`
  - Four dim unnamed tiles, each `No evidence yet.`
  - Caption under the dim tiles: `Four domains this work never touched.`
- Trust card (overline `Trust`):
  > Taken as written: market size, channel, first year. Never challenged.
  > Never asked: (only the ghost chips you left unasked)
- Coaching card (overline `Coaching`): `Coaching ceiling: Standard. Used: light.`
- Stretch card (overline `Stretch next`): `Test. You put one claim against evidence. Three sections shipped unexamined.`

STEPS: six advances as v1 (trace, Discern expand + sharpest card, map + caption, trust, coaching, stretch).

RAIL:
1. Nothing was submitted for judgment. Your work was read.
2. Every reading traces to a moment you can replay.
3. Evidence-confidence grows with observations. Decision holds one.
4. What went unchallenged is part of the reading.
5. The ceiling was Standard. Demonstrated capability kept coaching light.
6. One capability to stretch, named from evidence, not opinion.

SIGNALS: none fire; the mirror is the readout of S1 through S7.

EXIT: Forward click. The map widens.

---

## Beat 6: Horizon

SURFACE and STEPS: unchanged from v1. The plan card, labeled `Go-to-market plan`, among `Dashboard` `Prototype` `Project plan` `Physical product` under the line `The document was one form.` Then the full eight-tile map, names only, under the overline `Capability Science` and the line `Eight domains. Four lit today. Different work lights the rest.` Then the wordmark and the closing line:
> Capability, read from real work, while you just do the job.

RAIL:
1. The same engine reads any form the work takes.
2. Different work, same reading. The map fills over a career.
3. The work was the evidence. It always was.

EXIT: Rest state with a replay control.

---

## Signal Map

| id | beat | visible on-screen action | atomic signal | domain | rail line (12 words max) |
|---|---|---|---|---|---|
| S1 | 1 | The sentence `Mid-market SaaS is the market.` is highlighted; `Buyer not named.` appears | Discern | Perception | Discern. You marked what the brief never says. |
| S2 | 1 | You send your first question against the brief before writing | Inquire | Creation | Inquire. Your question came before the first sentence. |
| S3 | 4 | The draft's $59 per-seat claim is highlighted | Discern | Perception | Discern. A confident claim marked for questioning. |
| S4 | 4 | The reasoning note pins to the highlight beside the three evidence cards | Analyze | Reasoning | Analyze. Three sources weighed against one confident number. |
| S5 | 4 | You send a challenge against the draft's pricing logic | Test | Reasoning | Test. The draft's logic put against the buyer's math. |
| S6 | 4 | Restructure is clicked; the plan visibly reorganizes | Correct | Creation | Correct. The plan rebuilt around what the evidence said. |
| S7 | 4 | You commit $1.50 per resolution, or hold at per-seat; the basis line locks | Decide | Decision | Commit: Decide. A number committed while the evidence is thin. Hold: Decide. Holding the seat is also a call. |

**Capture without light-up:** Beat 1 follow-up questions (`Follow-up recorded.` gray entries). Beat 1 ghost chips (only the topics you never asked), returning in the Beat 5 trust card. Beat 2's choice (`Choice recorded: ...`). Beats 0, 3, 5, 6 fire nothing.

**Coverage check:** Perception 2 (Discern ×2), Creation 2 (Inquire, Correct), Reasoning 2 (Analyze, Test), Decision 1 (Decide). The mirror reflects these exactly regardless of which branch you took; only captions and the sharpest framing vary.

**Notes for the build.** Chips fire only at their mapped steps, identically in live and cold modes. The live agent's system prompt fences it in-world (Copperline constants, plain register, banned vocabulary, no em dashes) and the client strips em dashes from model output defensively. Any live failure falls back to the staged bank silently. The mirror is assembled from what actually happened: your first question captions the Inquire dot, unasked ghost topics fill the trust card, and your commit or hold sets the Decide caption.

**Interaction guards.** While a choice is armed, a click inside the choice card that misses both buttons is inert; only a click clearly outside it, or a keyboard advance, lets the demo choose the default. Space never advances (typing spaces into a surface must not move the story); click, Enter, and the right arrow do. During Beat 0 the cue reads `watch · click to continue` so the evaluator side is explicitly watch-only. Typed input has `[moment: ...]` tags stripped before reaching the live agent; live output that is truncated or contains banned vocabulary is discarded in favor of the staged bank.

**Chrome (governed by DESIGN.md):** cover screen (wordmark, `An enterprise walkthrough.`, click cue, and the line `Type when the surface invites you.`). The `live` control sits in the header: faint when cold, warm when a key is connected. Its panel copy: title **Connect intelligence**, body `Paste an Anthropic API key. It stays in this browser; calls go directly to Anthropic. Without one, a staged bank answers.`, actions `connect` and `disconnect`. Cue strings: `click anywhere to move forward`, `continue`, `type and press enter, or click to continue`. Rail domain list under `Capability domains` with footer `Four of eight domains.`
