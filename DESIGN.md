# DESIGN.md

**Visual language for the Evolv Enterprise Demo.** Governed by ANCHOR.md Section 7. v0.1, 2026-08-09.

The one-line brief: modern evolved academic. The restraint of a clean Korean or Japanese brand. Simple, minimal, usable. Bold where it earns it. Non-technical language with room for deeper exploration.

---

## 1. Register

Paper and ink. The demo should feel like a beautifully set document that happens to be alive, not like software. Every visual decision defers to the work on the page. The machinery (rail, light-ups, map) whispers from the margins.

Bold means scale and conviction, not decoration. One large serif line can carry a whole beat. Nothing shouts.

## 2. Palette

Fixed light theme. The demo runs on laptops and projectors; light paper wins in every room.

| Role | Value | Use |
|---|---|---|
| Paper | `#FAF9F5` | Page ground |
| Surface | `#FFFFFF` | Cards, editor sheet |
| Ink | `#1A1915` | Primary text |
| Graphite | `#6E6A61` | Secondary text, rail narration |
| Faint | `#A8A399` | Tertiary, placeholders, unlit map labels |
| Hairline | `#E7E4DC` | All rules and borders, 1px |
| Signal | `#C74E33` | The single accent. Capability light-ups, live cursor moments, the one thing to look at |
| Signal wash | `#C74E3314` | Highlight fills, lit-chip backgrounds |

One accent, used only when the Evidence Engine sees something. The accent is the machinery's voice; if everything is accented, nothing is. Domains are not color-coded; lit versus unlit carries the meaning.

## 3. Typography

System stacks only; the artifact is a single offline file.

- **Display serif** (beat titles, the artifact's own headings, big moments): `"Iowan Old Style", "Palatino Nova", Palatino, Georgia, serif`. Large sizes, tight leading, weight 500 to 600. This is the evolved academic voice.
- **Working sans** (UI, editor body, chat, rail): `-apple-system, "SF Pro Text", "Segoe UI", Inter, sans-serif`. Weight 400; 500 for emphasis. Never bold-heavy.
- **Label voice** (rail source labels, domain names, small wayfinding): working sans at 11px, letterspaced 0.08em, uppercase, Graphite or Faint.

Editor text sets at 15 to 16px with 1.7 line height, max width 66ch. Rail narration at 14px Graphite, one line at a time.

## 4. Layout

- Product surface left, roughly 72 percent. Narration rail right, roughly 28 percent, separated by a single hairline. The rail is part of the object, not a sidebar bolted on.
- Generous margins: 56px or more around the surface at desktop widths. Whitespace does the hierarchy; rules are rare and hairline.
- Chrome is a single thin top bar: the Evolv wordmark left (working sans, lowercase, letterspaced), beat position right as seven small dots. No menus, no icons that do nothing.
- Beat transitions: full-surface crossfade, 300ms. Within a beat, elements enter with a 200ms fade and 4px rise. Nothing bounces, nothing spins, nothing celebrates.

## 5. The rail

- One narration line visible at a time; the previous line fades to Faint and up, then out. Whisper register.
- When a signal fires: a small chip (atomic signal name, label voice) appears under the narration, and the matching domain name in the rail's compact domain list warms from Faint to Signal, gaining one observation dot. The pairing with the on-screen action must be simultaneous and obvious.
- The domain list shows only the four spotlighted domains, with a Faint footer reading `Four of eight domains.` so the full map in the final beat arrives as expansion, not contradiction.
- Armed inputs pair with a quiet `send` affordance in label voice. Enter anywhere advances; Enter in an armed input sends. The input is inert until its step arms it.
- The rail never scrolls and never accumulates a feed. It is a voice, not a log.

## 6. Interaction

- Forward click anywhere on the surface advances, plus Right Arrow and Space. A quiet `continue` affordance sits bottom right in label voice for cold viewers.
- Typeable moments: the field focuses itself, a real caret blinks, any typed input is accepted, Enter yields the staged response. Staged AI responses appear with a brief thinking pause (600 to 900ms) and settle in with the standard fade; no fake token streaming theatrics beyond a simple reveal.
- Highlights in the editor use Signal wash with a hairline Signal underline.

## 6b. Conversation and the live control

- Conversational threads live on the surface (never the rail): your question in weighted text, the agent's answer in Graphite paragraphs, thinking dots between. Threads accumulate within their moment; the rail still shows one line at a time.
- The `live` control sits in the chrome in label voice: Faint when cold, Signal when a key is connected. Its panel is a small centered card over a soft veil; the key field is a hairline input. No security theater, one sentence of plain truth about where the key lives.
- Live and cold modes must be visually indistinguishable in the surface itself; the only tell is the chrome label. The demo's spine never changes with the mode.

## 7. Copy rules

Short declaratives. Sentence case everywhere, including buttons. No exclamation marks. No em dashes. No cheerleading. A board member parses every line in one read. Depth lives in the staged content a viewer clicks into, never in on-screen explanation.
