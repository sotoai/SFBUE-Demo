/* All scenario content. One company, two seats.
   Editing this file changes the demo's world without touching the machinery. */

/* The eight elemental attributes.

   Each carries what it reads (the act the engine looks for) and what grows it
   (the same thing said to the person, so an attribute with no evidence is a
   description of what has not happened yet, never a deficit in them). */
export const DOMAINS = [
  { id: 'perception', name: 'Perception', signal: 'Inquire', reads: 'Noticing what is missing or unstated',
    grows: 'Flagging a claim that needs checking, before anyone asks you to.' },
  { id: 'systems',    name: 'Systems',    signal: 'Discern', reads: 'Seeing how parts constrain each other',
    grows: 'Changing a second passage to keep it consistent with the first.' },
  { id: 'reasoning',  name: 'Reasoning',  signal: 'Analyze', reads: 'Weighing evidence against a claim',
    grows: 'Rewriting a claim after opening the source that contradicts it.' },
  { id: 'execution',  name: 'Execution',  signal: 'Check',   reads: 'Checking a claim against a source',
    grows: 'Opening a source that disagrees with the passage you opened it from.' },
  { id: 'growth',     name: 'Growth',     signal: 'Correct', reads: 'Moving or holding a position, with the reason stated',
    grows: 'Keeping your own words against a rewrite, with your reason on the page.' },
  { id: 'decision',   name: 'Decision',   signal: 'Decide',  reads: 'Committing with the cost named',
    grows: 'Making a call and writing what it costs beside it.' },
  { id: 'creation',   name: 'Creation',   signal: 'Compose', reads: 'Making something new that carries an argument',
    grows: 'Briefing an image to carry a point the words cannot.' },
  { id: 'perspective', name: 'Perspective', signal: 'Frame', reads: 'Writing toward what another person will resist',
    grows: 'Naming the person who will push back, and writing toward their objection.' },
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
    brief: `Kado is a cafe in Oakland where people charge their electric cars at the curb while they wait inside. The first location has been open six months, and the owners want to open two more by next fall. They have asked our studio for a launch plan.

Your job this week is to write that plan as a short document. It needs to answer three questions with clear recommendations: who Kado's customer is, what the brand should stand for, and where the next two locations should go.

You are not guessing at these. The evidence pack below holds four documents from the company: six months of session data from the chargers, timing data on how long people charge and stay, a survey of a possible highway location, and a note from the founder, Elena Voss, about where she wants the company to go. Read them before you write. Every recommendation in your draft should hold up against what is in them.

Due Friday. Include the images you would put in front of Elena. And if you change your mind about a recommendation partway through, leave the change visible in the document. How your thinking moved matters as much as where it landed.`,
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
    { k: '996 of 1,200', v: 'pilot sessions came from drivers who live within 3 miles of the corner.' },
    { k: '36 of 1,200', v: 'sessions began more than 40 miles from home. The road trip is 3 percent of the pilot.' },
    { k: '150 of 200', v: 'regulars cannot plug in where they park at night. Their car sleeps on the street.' },
    { k: '25 min / 31 min', v: 'a charge to 80 percent takes 25 minutes. The median stay is 31. People finish their coffee.' },
  ],
}

/* The draft so far. The brief asks the writer to decide three things, and the
   sections are those three decisions, so the headings carry their own
   provenance. Competent, fluent, and wrong in exactly one place. */
export const DRAFT = [
  {
    id: 'audience',
    tag: 'Decision one of three',
    heading: 'Who Kado is for',
    body: 'Kado is for the driver who bought the future and still spends Tuesday night hunting a plug. The car is quiet, the software is lovely, and the charging is a chore nobody designed. We take the worst half hour of owning an electric car and hand it back.',
  },
  {
    id: 'position',
    tag: 'Decision two of three',
    heading: 'What Kado stands for',
    body: 'Kado stands for the half hour, not the charge. Every other charger sells speed and apologizes for the wait. We built the wait worth keeping: a warm room, a short menu, a table by the glass where your car sits in view. The charge is table stakes. The half hour is why you come back.',
  },
  {
    id: 'channel',
    tag: 'Decision three of three',
    heading: 'Where the next corners go',
    flawed: true,
    body: 'Put the first corners on the road. Our customer is the driver between cities: distance is when a battery becomes a fear, and fear is when a brand gets chosen. The Route 92 interchange sees forty times the passing traffic of any neighborhood corner, and a driver we rescue once will tell that story for years. Win the road first. The neighborhood follows on its own.',
  },
  {
    id: 'first-year',
    tag: 'Beyond the brief',
    heading: 'First year',
    body: 'Open corner two in spring and corner three by fall. Review the pilot numbers monthly. Keep the menu short.',
  },
]

/* The evidence pack: four real documents, not summaries of documents.

   A claim can only be checked against a source that is substantial enough to
   check against, so each one carries its own numbers, and every number in it
   adds up. `body` is the one line preview; `doc` is the document itself.
   `bearsOn` names the sections it speaks to, which is what lets the graph
   draw the link between a document read and a passage it bears on.

   The founder's note deliberately contains a legitimate objection to the
   session log rather than a straw position. The assignment is only worth
   setting if the wrong answer is genuinely tempting. */
export const EVIDENCE_PACK = [
  {
    id: 'log',
    label: 'Pilot session log, 1,200 sessions',
    kind: 'Operating data',
    dateline: 'Alder Street corner · six months to 31 December',
    bearsOn: ['audience', 'channel'],
    body: '996 sessions were drivers who live within 3 miles of the corner. 36 began more than 40 miles from home, 3 percent of the pilot. Of the 200 regulars, 150 cannot plug in where they park at night.',
    doc: [
      { p: 'Every charging session at the Alder Street corner between 1 July and 31 December. Distance is measured from the billing address on the account used to pay.' },
      { h: 'Sessions by distance from home' },
      { table: { cols: ['Distance from home', 'Sessions', 'Share'], rows: [
        ['Within 3 miles', '996', '83%'],
        ['3 to 40 miles', '168', '14%'],
        ['More than 40 miles', '36', '3%'],
        ['Total', '1,200', '100%'],
      ] } },
      { h: 'Arrival time' },
      { table: { cols: ['Time of arrival', 'Sessions'], rows: [
        ['6am to 11am', '174'],
        ['11am to 4pm', '246'],
        ['4pm to 9pm', '588'],
        ['9pm to 6am', '192'],
      ] } },
      { h: 'Who comes back' },
      { p: 'The 1,200 sessions came from 588 distinct vehicles. 200 of them returned five times or more and account for 812 sessions between them. The remaining 388 vehicles visited once.' },
      { p: 'A counter survey asked those 200 regulars where their car spends the night. 150 park on the street or in a shared lot with no outlet. 34 have a garage outlet they describe as shared or unreliable. 16 charge at work.' },
      { note: 'The pilot has only ever run on a neighbourhood corner. It records who came to this location. It cannot record who would have come to a different one.' },
    ],
  },
  {
    id: 'dwell',
    label: 'Charge and stay times, six months',
    kind: 'Operating data',
    dateline: 'Alder Street corner · same period',
    bearsOn: ['position', 'audience'],
    body: 'A charge to 80 percent takes 25 minutes. The median stay is 31 minutes. People order in the first two minutes and leave when they are finished, not when the car is.',
    doc: [
      { p: 'Charge duration is taken from the charger. Stay length is taken from the point of sale and the door counter, matched to the session.' },
      { p: 'Median charge to 80 percent: 25 minutes. Median stay: 31 minutes. The median customer stays six minutes after their car is ready.' },
      { h: 'How long people stay' },
      { table: { cols: ['Stay length', 'Share of sessions'], rows: [
        ['Under 20 minutes', '12%'],
        ['20 to 30 minutes', '34%'],
        ['30 to 45 minutes', '41%'],
        ['Over 45 minutes', '13%'],
      ] } },
      { h: 'What they do inside' },
      { p: '78 percent of orders are placed within the first two minutes of arrival. 852 of the 1,200 sessions include a purchase, and the median ticket is $8.40.' },
      { quote: 'People do not leave when the car is finished. They leave when they are finished.' },
      { p: 'From the six month operating review, written by the site manager.' },
    ],
  },
  {
    id: 'survey',
    label: 'Route 92 interchange survey',
    kind: 'Site assessment',
    dateline: 'Commissioned November · prepared by an outside firm',
    bearsOn: ['channel'],
    body: 'The interchange parcel sees roughly forty times the passing traffic of Alder Street, at 3.1 times the rent. Drivers at the fast chargers already on that corridor wait in their cars with the doors closed.',
    doc: [
      { p: 'A 0.4 acre parcel at the Route 92 interchange, available on a five year lease. Prepared for Kado in November.' },
      { table: { cols: ['Measure', 'Route 92 parcel', 'Alder Street'], rows: [
        ['Vehicles passing per day', '41,000', '1,020'],
        ['Monthly rent', '$9,300', '$3,000'],
      ] } },
      { p: 'The interchange carries roughly forty times the traffic at 3.1 times the rent.' },
      { h: 'What that traffic does' },
      { p: 'We observed 240 charging sessions across the three existing fast charge sites on this corridor, over six weekdays.' },
      { table: { cols: ['Driver behaviour during the charge', 'Sessions'], rows: [
        ['Stayed in the vehicle', '198'],
        ['Left and returned within six minutes', '31'],
        ['Left for longer than six minutes', '11'],
      ] } },
      { p: '198 of the 240 drivers, just over four in five, stayed in their vehicle for the whole charge. Of those who got out, most used a restroom and came back.' },
      { note: 'Passing traffic is a count of vehicles, not of visits. Nothing in this survey establishes that a driver who passes would stop, or that a driver who stops would come inside.' },
    ],
  },
  {
    id: 'note',
    label: 'Elena Voss, founder, January note',
    kind: 'Internal memo',
    dateline: 'To the team · 14 January',
    bearsOn: ['position', 'channel'],
    body: 'One page on the night she was stranded at 4 percent outside Gilroy, and why Kado exists so nobody has that night again. Her line about the alternative: the neighbourhood is where chargers go to be ignored.',
    doc: [
      { p: 'I want to write down why this company exists before we decide where it goes next, because I think the two questions are the same question.' },
      { p: 'Four years ago I was at 4 percent outside Gilroy at ten at night, doing the arithmetic on whether I would make the next exit. I made it. The charger there worked. I sat in that car for forty minutes in the dark with nowhere to go and nothing open, and I decided somebody should build the other version of that night.' },
      { quote: 'The neighbourhood is where chargers go to be ignored.' },
      { p: 'Here is my argument, and I want it argued with rather than humoured. A brand is chosen in the moment it is needed, not in the moment it is convenient. Nobody tells a story about the charger four streets from their flat. They tell the story about the one that saved them.' },
      { p: 'I know what the pilot data says. I would ask you to notice what it cannot say. We put our only corner in a neighbourhood, so it measured neighbours. That is not a finding about demand, it is a finding about where we put the corner.' },
      { p: 'If you are going to tell me the road is wrong, tell me with something the pilot could not have produced by construction. I will listen. I would rather be corrected in January than in September.' },
    ],
  },
]

/* People in this world who will push back. Naming one in the text, and
   writing toward what they will resist, is what Perspective reads. */
export const STAKEHOLDERS = /\bElena\b|\bVoss\b|\bthe founder\b/i

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
  { signal: 'Frame', domainName: 'Perspective', because: 'Wrote toward a named person’s stated objection rather than around it.', quote: 'Elena will read this as walking away from the road. It is not. It is choosing the corner we can win first.', when: 'two months ago, seeded' },
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
