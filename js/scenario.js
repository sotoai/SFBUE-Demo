/* All scenario content. One product, two seats.
   Editing this file changes the demo's world without touching the machinery. */

export const DOMAINS = [
  { id: 'perception', name: 'Perception', signal: 'Inquire', reads: 'Noticing what is missing or unstated' },
  { id: 'systems',    name: 'Systems',    signal: 'Discern', reads: 'Seeing how parts constrain each other' },
  { id: 'reasoning',  name: 'Reasoning',  signal: 'Analyze', reads: 'Weighing evidence against a claim' },
  { id: 'execution',  name: 'Execution',  signal: 'Test',    reads: 'Checking a claim against a source' },
  { id: 'growth',     name: 'Growth',     signal: 'Correct', reads: 'Changing position when evidence demands' },
  { id: 'decision',   name: 'Decision',   signal: 'Decide',  reads: 'Committing with the cost named' },
  { id: 'creation',   name: 'Creation',   signal: 'Compose', reads: 'Making something new that carries an argument' },
  { id: 'human',      name: 'Human',      signal: 'Frame',   reads: 'Addressing what another person will resist' },
]

export const BANDS = ['Noticed', 'Emerging', 'Supported', 'Well evidenced']

export const WORLDS = {
  university: {
    key: 'university',
    place: 'SFBU · Applied Launch Studio',
    evaluatorSeat: 'Faculty view',
    learnerSeat: 'Student view',
    evaluator: { name: 'Prof. Marisol Vega', role: 'Studio lead. Ran go-to-market for two hardware companies.' },
    learner: { name: 'Amara Osei', role: 'Second term. Strong writer, fast.' },
    stakes: 'inside the artifact',
    brief: `Halden Atelier ships Solveil in February 2027. They have a product and no position.

Build the launch concept document. It has to decide three things: who Solveil is for, what it stands for, and how it reaches the people who actually choose it. Everything you need is in the evidence pack, including their beta install data and a note from their founder.

Five working days. Bring me something Ines Halden could act on Monday morning, including the visuals you would put in front of her. If you change your mind partway through, do not clean it up. Say what changed it.`,
    wants: 'Whether she can notice a fact that contradicts her own draft, and then act against her own momentum. I already know she can write.',
  },
  enterprise: {
    key: 'enterprise',
    place: 'Halden Atelier · Brand and Go-to-Market',
    evaluatorSeat: 'Manager view',
    learnerSeat: 'Professional view',
    evaluator: { name: 'Priya Raman', role: 'VP Brand and Go-to-Market. Four people, one shipping date.' },
    learner: { name: 'Theo Marchetti', role: 'Senior Product Marketing Manager. Four years at Halden.' },
    stakes: 'in the world',
    brief: `Solveil ships in February. We have a product and no position.

Own the launch concept document. It has to decide three things: who Solveil is for, what it stands for, and how it reaches the people who actually choose it. The evidence pack has the beta install data and Ines's note from January.

Five working days. I need something Ines can act on Monday, including the visuals we would put in front of her. If you change your mind partway through, leave the turn in the document. I want to see it.`,
    wants: 'Whether he will tell the founder something she does not want to hear, and attach the cost to it.',
  },
}

export const PRODUCT = {
  name: 'Solveil',
  maker: 'Halden Atelier',
  what: 'A ceiling-integrated daylight surface. A 1.2 by 1.2 metre module that replaces a section of ceiling and reproduces sky light, tuned to a latitude and a date.',
  facts: [
    { k: '140 mm', v: 'Minimum empty depth required above the finished ceiling. Most existing homes do not have it.' },
    { k: '$3,400', v: 'List price per module. A typical interior kitchen takes three.' },
    { k: '11 months', v: 'Median time from the moment a lighting plan is fixed to the day the panel is energised.' },
    { k: '71% / 4%', v: 'Of 71 beta installs, 71% arrived through an architect or lighting designer. 4% came from a homeowner who found the product first.' },
  ],
}

/* The first draft. Competent, fluent, and wrong in exactly one place. */
export const DRAFT = [
  {
    id: 'audience',
    heading: 'Who it is for',
    body: 'Solveil is for people living in rooms that daylight never reaches. Interior kitchens, basement conversions, north-facing studios. The emotional territory is unusually strong: a windowless room that behaves like it has a sky is something people feel before they can explain it.',
  },
  {
    id: 'position',
    heading: 'What it stands for',
    body: 'Solveil stands for daylight as architecture rather than daylight as a fixture. Not a lamp that imitates the sun, but a surface that gives a room a sky it was never built to have.',
  },
  {
    id: 'channel',
    heading: 'How it reaches people',
    flawed: true,
    body: 'Lead with direct to consumer. The story is emotional and emotional stories sell direct, gross margin is 61% against 38% through specification channels, and a direct launch can be standing in weeks rather than quarters. Build the brand with the people who will love it first, and let demand pull the trade along behind it.',
  },
  {
    id: 'first-year',
    heading: 'First year',
    body: 'Launch broadly in spring. Build reference installations in three cities. Review channel performance quarterly and adjust.',
  },
]

/* What the evidence pack returns when someone actually looks. */
export const EVIDENCE_PACK = [
  { id: 'spec', label: 'Install specification, line 6 and line 11', body: 'Minimum plenum depth 140 mm. Dedicated 24V driver, hard wired, not plug in. The module can only be installed while a ceiling is open.' },
  { id: 'log', label: 'Beta install log, 71 projects', body: '62 homes and 9 workplaces. 71% of projects arrived through an architect or a lighting designer. 4% came from a homeowner who found Solveil first and brought it to their builder.' },
  { id: 'calendar', label: 'Halden project calendar', body: 'Median 11 months from the moment a reflected ceiling plan is fixed to the day a panel is energised. Longest was 26 months.' },
  { id: 'note', label: 'Ines Halden, founder, January note', body: 'Two paragraphs on why she does not want a representative network. She believes specification channels turn design products into commodities, and that Halden will be a consumer brand first.' },
]

/* Image moments in the document.

   Two things worth knowing if you edit these.

   Image models have no reliable notion of "not". An earlier version of the
   first prompt said "windowless" and reliably produced a room with a large
   window, because the word window is in it. Every prompt below therefore
   describes what IS in the room, positively, and never uses the word at all.

   Each moment has a warm asset generated ahead of time by
   scripts/make-images.js. A scripted beat serves that instantly so a room is
   not watching a progress bar. Change the prompt and it generates live. */
export const IMAGE_MOMENTS = {
  audience: {
    warm: 'images/audience.jpg',
    prompt: 'An interior kitchen at the centre of an apartment, fully enclosed by unbroken smooth plaster walls that run uninterrupted from floor to ceiling on every side. Solid continuous walls, flat and blank, with oiled oak cabinetry built along one of them. The single source of illumination is a large luminous rectangular surface set flush into the ceiling, glowing with the low warm colour of seven in the morning and casting a long soft wash of light down one plaster wall and across the stone worktop. The far corners of the room fall into quiet shade. Architectural interior photography, large format camera, calm editorial restraint. Warm neutral palette of pale lime plaster, chalk white, oiled oak and soft ochre. Soft diffuse light, no people, no text, no visible light fittings.',
  },
  position: {
    warm: 'images/position.jpg',
    prompt: 'Looking upward across a wide flat luminous ceiling plane that fills most of the frame, a smooth uninterrupted panel of even pale light reproducing an overcast midday sky, perfectly flush with the surrounding plaster ceiling so the two read as one continuous surface. Below it a quiet empty room with smooth plaster walls and a bare oak floor, softly and evenly lit from above. The light is cool, silvery and diffuse, without glare or hotspots. Architectural interior photography, large format camera, calm editorial restraint. No people, no text, no visible light fittings.',
  },
  channel: {
    warm: 'images/channel.jpg',
    prompt: "A large architect's drafting table seen from above at a slight angle, covered by a reflected ceiling plan drawn in fine technical linework, showing a grid of ceiling panels and their dimensions. A printed lighting schedule lies beside it, along with a metal scale rule, a mechanical pencil and a roll of tracing paper. Morning light rakes across the paper from the left, raising the texture of the drawing. Shallow depth of field, the near edge of the drawing sharp and the far edge softening. Architectural photography, calm editorial restraint, warm neutral palette, no people.",
  },
}

export const FOUR_QUESTIONS = [
  'What differentiated value did the human contribute?',
  'What human capabilities created that value?',
  'How do we know?',
  'How can an organisation develop that at scale?',
]

/* What a person can add to the document.

   Deliberately short. Every entry has to earn its place in a launch concept,
   which is why there is no bullet list, no callout, no divider and no emoji.
   Anything not yet built says so plainly rather than presenting a control that
   quietly does nothing. */
export const BLOCK_TYPES = [
  { group: 'Write', items: [
    { id: 'section',    name: 'Section',    desc: 'A heading and a passage', ready: true },
    { id: 'decision',   name: 'Decision',   desc: 'A call, and what it costs', ready: true },
  ]},
  { group: 'Show', items: [
    { id: 'image',      name: 'Image',      desc: 'Generate a concept visual', ready: true },
    { id: 'upload',     name: 'Upload',     desc: 'Bring in your own file', ready: false },
    { id: 'video',      name: 'Video',      desc: 'Bring a still into motion', ready: false },
  ]},
  { group: 'Evidence', items: [
    { id: 'source',     name: 'Source',     desc: 'Pull a document from the pack', ready: true },
    { id: 'comparison', name: 'Comparison', desc: 'Set two options side by side', ready: false },
    { id: 'widget',     name: 'Live data',  desc: 'Embed a number that keeps updating', ready: false },
  ]},
]

/* Ways an image can move forward. An image is rarely right the first time,
   and every one of these is a different kind of judgement about the work. */
export const IMAGE_ACTIONS = [
  { id: 'refine',  label: 'Refine',  hint: 'Run the same brief again', ready: true },
  { id: 'edit',    label: 'Edit',    hint: 'Change it in words', ready: true },
  { id: 'upscale', label: 'Upscale', hint: 'Raise the resolution', ready: true },
  { id: 'animate', label: 'Animate', hint: 'Turn this still into motion', ready: false },
  { id: 'rebrief', label: 'Rebrief', hint: 'Write a different brief', ready: true },
]
