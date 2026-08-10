/* Client side of the two integrations. Every call can fail, and every failure
   returns prepared content instead of breaking the demo in front of a room. */

export const state = { language: false, images: false }

export async function loadStatus() {
  try {
    const s = await (await fetch('/api/status')).json()
    state.language = !!s.language
    state.images = !!s.images
  } catch { /* server not reachable; both stay false */ }
  return state
}

const WORLD = `You are the assistant inside Evolv, a work surface where a person is writing a launch concept document. You are part of the product. Never mention being an AI model, Anthropic, or a demo.

THE WORLD, never contradict it:
Halden Atelier ships Solveil in February 2027. Solveil is a ceiling-integrated daylight surface, a 1.2 by 1.2 metre module that replaces a section of ceiling and reproduces sky light tuned to a latitude and a date. It suits rooms without good windows: interior kitchens, basement conversions, north-facing studios, deep floor plates.
Facts: minimum 140 mm of empty depth is required above the finished ceiling, and the driver is hard wired, so the module can only be installed while a ceiling is open. List price $3,400 per module, a typical kitchen takes three. Median 11 months from the moment a reflected ceiling plan is fixed to the day a panel is energised. Across 71 beta installs, 71% arrived through an architect or lighting designer and 4% came from a homeowner who found Solveil first. Direct gross margin is 61%, through specification channels after representative and dealer margin it is 38%. Founder Ines Halden wrote in January that specification channels turn design products into commodities and that Halden will be a consumer brand first.
The document currently recommends leading direct to consumer. That is fluent and structurally wrong: installation is a construction decision made by whoever fixes the ceiling plan, about 11 months ahead, so a consumer campaign creates desire in people who physically cannot buy. The defensible position leads through architects and lighting designers, and names the cost: lower margin, slower first revenue, and a founder who has to be persuaded.

STYLE, absolute: plain prose, no markdown, no lists, no headings, no asterisks. No em dashes, use commas or full stops. No exclamation marks. Never use the words grade, quiz, score, certificate, course, curriculum, or skills. Be concrete and brief. Never flatter.`

async function language(instruction, userText, maxTokens = 220) {
  if (!state.language) return null
  try {
    const r = await fetch('/api/language', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        system: WORLD + '\n\nTASK: ' + instruction,
        messages: [{ role: 'user', content: userText }],
        max_tokens: maxTokens,
        effort: 'low',
      }),
    })
    if (!r.ok) return null
    const d = await r.json()
    return sanitize(d.text)
  } catch { return null }
}

export function sanitize(t) {
  return String(t || '').replace(/—|–/g, ', ').replace(/\s+,/g, ',').replace(/[#*_`>]/g, '').trim()
}

/* ---------- the four editor actions ---------- */

export async function askAbout(passage, question, fallback) {
  const out = await language(
    'The person selected a passage of their own document and asked a question about it. Answer their actual question in two or three sentences, using the world facts. If the passage is wrong, say so plainly and say what the evidence shows. Do not rewrite the passage.',
    `PASSAGE:\n"${passage}"\n\nTHEIR QUESTION: ${question}`,
    260,
  )
  return out || fallback
}

export async function rewrite(passage, instruction, fallback) {
  const out = await language(
    'Rewrite the passage according to the instruction. Return only the rewritten passage, under 80 words, in the same voice. No preamble, no explanation.',
    `PASSAGE:\n"${passage}"\n\nINSTRUCTION: ${instruction || 'Make it sharper and more specific, using the world facts.'}`,
    200,
  )
  return out || fallback
}

export async function researchLeads(passage, fallback) {
  const out = await language(
    'The person tagged this passage for further research. Name the two specific things in the evidence pack that would settle it, in two short sentences. Be concrete about which document and what it would show.',
    `PASSAGE:\n"${passage}"`,
    200,
  )
  return out || fallback
}

/* ---------- images ---------- */

async function pollTask(taskId, onTick) {
  const started = Date.now()
  for (let i = 0; i < 45; i++) {
    await new Promise(res => setTimeout(res, 2500))
    const elapsed = Math.round((Date.now() - started) / 1000)
    if (onTick) onTick(elapsed)
    let s
    try { s = await (await fetch('/api/image/' + taskId)).json() } catch { continue }
    if (s.status === 'COMPLETED') {
      const url = (s.generated || [])[0]
      return url ? { ok: true, url, seconds: elapsed } : { ok: false, reason: 'no_image' }
    }
    if (s.status === 'FAILED') return { ok: false, reason: 'failed' }
  }
  return { ok: false, reason: 'timeout' }
}

/* Change an existing image in words. */
export async function editImage(imageUrl, instruction, onTick) {
  if (!state.images) return { ok: false, reason: 'not_configured' }
  try {
    const r = await fetch('/api/image/edit', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, instruction }),
    })
    const d = await r.json()
    if (!r.ok || !d.task_id) return { ok: false, reason: d.message || 'edit_failed' }
    return pollTask(d.task_id, onTick)
  } catch (e) { return { ok: false, reason: e.message } }
}

/* Raise the resolution of an existing image. */
export async function upscaleImage(imageUrl, onTick) {
  if (!state.images) return { ok: false, reason: 'not_configured' }
  try {
    const r = await fetch('/api/image/upscale', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl }),
    })
    const d = await r.json()
    if (!r.ok || !d.task_id) return { ok: false, reason: d.message || 'upscale_failed' }
    return pollTask(d.task_id, onTick)
  } catch (e) { return { ok: false, reason: e.message } }
}

export async function generateImage(prompt, onTick) {
  if (!state.images) return { ok: false, reason: 'not_configured' }
  try {
    const r = await fetch('/api/image', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt, aspect_ratio: 'widescreen_16_9', resolution: '1k' }),
    })
    const d = await r.json()
    if (!r.ok || !d.task_id) return { ok: false, reason: d.message || 'request_failed' }

    const started = Date.now()
    for (let i = 0; i < 45; i++) {
      await new Promise(res => setTimeout(res, 2500))
      const elapsed = Math.round((Date.now() - started) / 1000)
      if (onTick) onTick(elapsed)
      let s
      try { s = await (await fetch('/api/image/' + d.task_id)).json() } catch { continue }
      if (s.status === 'COMPLETED') {
        const url = (s.generated || [])[0]
        return url ? { ok: true, url, seconds: elapsed } : { ok: false, reason: 'no_image' }
      }
      if (s.status === 'FAILED') return { ok: false, reason: 'failed' }
    }
    return { ok: false, reason: 'timeout' }
  } catch (e) { return { ok: false, reason: e.message } }
}
