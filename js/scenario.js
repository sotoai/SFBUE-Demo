/* All scenario content. One company, two seats.
   Editing this file changes the demo's world without touching the machinery. */

export const DOMAINS = [
  { id: 'perception', name: 'Perception', signal: 'Inquire', reads: 'Noticing what is missing or unstated' },
  { id: 'systems',    name: 'Systems',    signal: 'Discern', reads: 'Seeing how parts constrain each other' },
  { id: 'reasoning',  name: 'Reasoning',  signal: 'Analyze', reads: 'Weighing evidence against a claim' },
  { id: 'execution',  name: 'Execution',  signal: 'Check',   reads: 'Checking a claim against a source' },
  { id: 'growth',     name: 'Growth',     signal: 'Correct', reads: 'Moving or holding a position, with the reason stated' },
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
    brief: `Kado runs one charging cafe on a corner in Oakland and wants three by next fall. They have a pilot and no position.

Build the launch concept. It has to decide three things: who Kado is for, what it stands for, and where the next corners go. Everything you need is in the evidence pack, including six months of session data and a note from their founder about the highway.

Five working days. Bring me something Elena Voss could act on Monday morning, including the visuals you would put in front of her. If you change your mind partway through, do not clean it up. I want to see the turn.`,
    wants: 'Whether she can hear what the data says over what the founder wants, and tell the difference between changing her mind and losing her nerve. I already know she can write.',
  },
  enterprise: {
    key: 'enterprise',
    place: 'Kado · Brand and Sites',
    evaluatorSeat: 'Manager view',
    learnerSeat: 'Professional view',
    evaluator: { name: 'Priya Raman', role: 'VP Brand and Sites. Three corners to open, one calendar.' },
    learner: { name: 'Theo Marchetti', role: 'Senior Manager, Sites and Launch. Came from a coffee chain’s real estate team.' },
    stakes: 'in the world',
    brief: `Corners two and three open by next fall. We have a pilot and no position.

Own the launch concept. It decides who Kado is for, what it stands for, and where the next corners go. The evidence pack has the session log and Elena’s note from January.

Five working days. I need something Elena can act on Monday, including the visuals we would put in front of her. If you change your mind partway through, leave the turn in the document. I want to see it.`,
    wants: 'Whether he will tell Elena the interchange is the wrong first corner, and put the cost of saying so in writing.',
  },
}

export const PRODUCT = {
  name: 'Kado',
  maker: 'One corner, Alder Street, Oakland',
  what: 'A cafe where you plug your electric car in at the corner and get a good half hour inside while it charges. Open six months. The document decides where corners two and three go.',
  facts: [
    { k: '996 of 1,200', v: 'pilot sessions were drivers who live within 3 miles of the corner.' },
    { k: '36 of 1,200', v: 'sessions began more than 40 miles from home. The road trip is 3 percent of the pilot.' },
    { k: '150 of 200', v: 'regulars cannot plug in where they park at night. Their car sleeps on the street.' },
    { k: '25 min / 31 min', v: 'a charge to 80 percent takes 25 minutes. The median stay is 31. People finish their coffee.' },
  ],
}

/* The first draft. Competent, fluent, and wrong in exactly one place. */
export const DRAFT = [
  {
    id: 'audience',
    heading: 'Who it is for',
    body: 'Kado is for the driver who bought the future and still spends Tuesday night hunting a plug. The car is quiet, the software is lovely, and the charging is a chore nobody designed. We take the worst half hour of owning an electric car and hand it back.',
  },
  {
    id: 'position',
    heading: 'What it stands for',
    body: 'Kado stands for the half hour, not the charge. Every other charger sells speed and apologizes for the wait. We built the wait worth keeping: a warm room, a short menu, a table by the glass where your car sits in view. The charge is table stakes. The half hour is why you come back.',
  },
  {
    id: 'channel',
    heading: 'Where the next corners go',
    flawed: true,
    body: 'Put the first corners on the road. Our customer is the driver between cities: distance is when a battery becomes a fear, and fear is when a brand gets chosen. The Route 92 interchange sees forty times the passing traffic of any neighborhood corner, and a driver we rescue once will tell that story for years. Win the road first. The neighborhood follows on its own.',
  },
  {
    id: 'first-year',
    heading: 'First year',
    body: 'Open corner two in spring and corner three by fall. Review the pilot numbers monthly. Keep the menu short.',
  },
]

/* What the evidence pack returns when someone actually looks. */
export const EVIDENCE_PACK = [
  { id: 'log', label: 'Pilot session log, 1,200 sessions', body: '996 sessions were drivers who live within 3 miles of the corner. 36 began more than 40 miles from home, 3 percent of the pilot. Of the 200 regulars, 150 cannot plug in where they park at night.' },
  { id: 'dwell', label: 'Charge and stay times, six months', body: 'A charge to 80 percent takes 25 minutes. The median stay is 31 minutes. People order in the first two minutes and leave when they are finished, not when the car is.' },
  { id: 'survey', label: 'Route 92 interchange survey', body: 'The interchange parcel sees roughly forty times the passing traffic of Alder Street, at 3.1 times the rent. The dwell note from the fast chargers already on that corridor: drivers wait in their cars with the doors closed.' },
  { id: 'note', label: 'Elena Voss, founder, January note', body: 'One page on the night she was stranded at 4 percent outside Gilroy, and why Kado exists so nobody has that night again. Her line about the alternative: the neighborhood is where chargers go to be ignored.' },
]

/* Image moments in the document.

   Two things worth knowing if you edit these.

   Image models have no reliable notion of "not". Asking for a street with no
   driveways produces driveways, because the word is in the prompt. Every
   prompt below therefore describes what IS in the frame, positively: cars
   sleeping at the curb, facades rising straight from the sidewalk.

   Each moment has a warm asset generated ahead of time by
   scripts/make-images.js. A scripted beat serves that instantly so a room is
   not watching a progress bar. Change the prompt and it generates live. */
export const IMAGE_MOMENTS = {
  audience: {
    warm: 'images/audience.jpg',
    prompt: 'An Oakland residential street in the evening, apartment facades rising directly from the sidewalk, cars parked nose to tail along both curbs beneath mature street trees. One parked electric car shows a small glowing charge port light. Warm lamplight in the upper windows, the street itself quiet and blue with dusk. Architectural photography, large format camera, calm editorial restraint. Warm neutral palette, soft diffuse light, no people, no text.',
  },
  position: {
    warm: 'images/position.jpg',
    prompt: 'A small warm cafe interior at dusk, an oiled oak counter and a long shared table beside a wide pane of glass, a single person seen from behind at the table reading. Through the glass, one parked electric car beneath a slim lit canopy, a thin cable running to its side. Inside, warm low light on plaster and oak; outside, blue evening. Architectural interior photography, large format camera, calm editorial restraint. Warm neutral palette of chalk white, oiled oak and soft ochre, no text, the person anonymous and facing away.',
  },
  channel: {
    warm: 'images/channel.jpg',
    prompt: 'A corner building at blue hour on a quiet neighborhood street, its glass frontage glowing warmly, three slim charging canopies over a small forecourt with two electric cars cabled beneath them. Apartment buildings recede along both streets, lit windows above dark storefronts, cars parked along the curbs. Architectural photography, large format camera, calm editorial restraint. Warm light against blue dusk, no people, no text.',
  },
}

export const FOUR_QUESTIONS = [
  'What differentiated value did the human contribute?',
  'What human capabilities created that value?',
  'How do we know?',
  'How can an organisation develop that at scale?',
]

/* The enterprise seat's example record. Seeded, and labeled seeded everywhere
   it appears, because the live record in this demo belongs to Amara and stays
   in her seat. Quotes are from Theo's own documents in this world. */
export const SEEDED_THEO = [
  { signal: 'Decide', domainName: 'Decision', because: 'Committed to a position and named what it costs.', quote: 'Hold corner two until the Fruitvale lease clears. We eat a month of momentum and open with parking we control.', when: 'three weeks ago, seeded' },
  { signal: 'Frame', domainName: 'Human', because: 'Wrote toward a named person’s stated objection rather than around it.', quote: 'Elena will read this as walking away from the road. It is not. It is choosing the corner we can win first.', when: 'two months ago, seeded' },
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
