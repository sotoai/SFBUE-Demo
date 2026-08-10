/* Where the API lives.

   Running locally, the Node server serves both this page and the API from the
   same origin, so the base stays empty and requests go to /api/...

   On the public page there is no server at all, so requests go to the proxy
   that holds the keys. Put its address here after deploying it, and the
   public demo becomes live. Leave it empty and the page still works, using
   prepared content, and says so in the top right. */

const PROXY = ''   // for example: https://evolv-proxy.vercel.app

export const API_BASE = location.hostname.endsWith('github.io') ? PROXY : ''
export const api = path => `${API_BASE}${path}`
