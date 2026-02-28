/**
 * Central API URL configuration.
 *
 * REMOTE_API → Render-hosted backend (auth, version check)
 * LOCAL_API  → Local bundled backend (projects, AI, vault, reports)
 *
 * Set NEXT_PUBLIC_RENDER_URL in your .env.local (dev) or at build time
 * once you have your Render service domain.
 */
export const REMOTE_API =
    process.env.NEXT_PUBLIC_RENDER_URL?.replace(/\/$/, '') ??
    'http://127.0.0.1:5000';

export const LOCAL_API = 'http://127.0.0.1:5000';
