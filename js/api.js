/* Client side of the two integrations. Every call can fail, and every failure
   returns prepared content instead of breaking the demo in front of a room.

   The page never holds a key and never composes a system prompt. It names a
   task and sends the passage. Whatever is behind the API, the local server or
   the public proxy, owns the instructions. */

import { api } from './config.js'

export const state = { language: false, images: false }

export async function loadStatus() {
  try {
    const s = await (await fetch(api('/api/status'), { signal: AbortSignal.timeout(4000) })).json()
    state.language = !!s.language
    state.images = !!s.images
  } catch { /* server not reachable; both stay false */ }
  return state
}

async function language(task, payload, fallback) {
  if (!state.language) return fallback
  try {
    const r = await fetch(api('/api/language'), {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ task, ...payload }),
      // A stalled call falls back to prepared text instead of freezing the
      // thinking dots in front of a room.
      signal: AbortSignal.timeout(12_000),
    })
    if (!r.ok) return fallback
    const d = await r.json()
    return sanitize(d.text) || fallback
  } catch { return fallback }
}

export function sanitize(t) {
  return String(t || '').replace(/—|–/g, ', ').replace(/\s+,/g, ',').replace(/[#*_`>]/g, '').trim()
}

/* ---------- the four editor actions ---------- */

export async function askAbout(passage, question, fallback) {
  return language('ask', { passage, question }, fallback)
}

export async function rewrite(passage, instruction, fallback) {
  return language('rewrite', { passage, instruction }, fallback)
}

export async function researchLeads(passage, fallback) {
  return language('leads', { passage }, fallback)
}

/* A first pass at one section, drafted before the data is consulted. */
export async function draftSection(heading, question, fallback) {
  return language('draft', { passage: heading, question }, fallback)
}

/* One turn of an interactive research thread on a tagged passage. */
export async function researchReply(passage, thread, question, fallback) {
  return language('research', { passage, thread, question }, fallback)
}

/* The thread's findings, folded back into the passage. Returns null rather
   than a canned guess when it cannot run, so the thread can say so. */
export async function integrateResearch(passage, thread) {
  return language('integrate', { passage, thread }, null)
}

/* ---------- images ---------- */

async function pollTask(taskId, onTick) {
  const started = Date.now()
  for (let i = 0; i < 45; i++) {
    await new Promise(res => setTimeout(res, 2500))
    const elapsed = Math.round((Date.now() - started) / 1000)
    if (onTick) onTick(elapsed)
    let s
    try { s = await (await fetch(api('/api/image/' + taskId))).json() } catch { continue }
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
    const r = await fetch(api('/api/image/edit'), {
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
    const r = await fetch(api('/api/image/upscale'), {
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
    const r = await fetch(api('/api/image'), {
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
      try { s = await (await fetch(api('/api/image/' + d.task_id))).json() } catch { continue }
      if (s.status === 'COMPLETED') {
        const url = (s.generated || [])[0]
        return url ? { ok: true, url, seconds: elapsed } : { ok: false, reason: 'no_image' }
      }
      if (s.status === 'FAILED') return { ok: false, reason: 'failed' }
    }
    return { ok: false, reason: 'timeout' }
  } catch (e) { return { ok: false, reason: e.message } }
}
