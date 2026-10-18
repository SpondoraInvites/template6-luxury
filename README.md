# template6-luxury — "Plum Night & Rose Gold"

A luxury, animated wedding invitation in an art-deco night style: a deep
plum velvet cover with a rose-gold deco arch, twinkling stars and an
interlocked-rings monogram; a cinematic tap-gated reveal; then a pearl,
blush-tinted site with scroll choreography throughout (vendored GSAP +
ScrollTrigger — no CDN, no build step; everything is offline deployable).

## Run & edit

Open `index.html`, or serve the folder for ES modules:

```
npm run serve          # python3 -m http.server 8126
```

Works on any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages):
drag the folder in — one URL per couple is the shareable link.

## What's inside

```
index.html            Page skeleton, inline SVG ornamentation (arcs/gems/fans)
styles.css            Theme (palette tokens, type, layout) plus cover states
js/main.js            Boot entry — fail-safe if GSAP ever fails to load
js/config.js          Edit-me: event date/time, RSVP WhatsApp number & email
js/cover.js           The cinematic reveal choreography (tap → arch → rings
                      → arch dissolves, monogram glides to centre → panels
                      part → starburst → enter)
js/scroll.js          Per-section scroll animations + live countdown +
                      ambient petal/spark drift
js/rsvp.js            RSVP form → opens WhatsApp with a pre-filled reply
                      (formatted text). Fallback: `mailto:` link.
js/share.js           Share menu (copy link / WhatsApp / Messenger /
                      Telegram / email) + floating share button
js/lightbox.js        Gallery lightbox (keyboard + swipe)
js/audio.js           Background-music toggle with fade + persistence
vendor/gsap/          Vendored GSAP + ScrollTrigger (no CDN)
assets/gallery/       900×900 placeholder art — drop real photos here
                      (JPGs rename to gallery-N.jpg, update index.html)
assets/audio/         Looped background track (placeholder CC0 piano)
```

## Editing the invitation

1. `js/config.js` — date/time (`event.iso`), the RSVP WhatsApp number and
   email. All other content (names, story, three celebrations, address,
   gallery captions) lives in `index.html` marked by section comments.
2. The Google Calendar links and the map embed are in `index.html`; update
   the `dates=`/`text=` params and the map query (`.../maps?q=...`).
3. Replace `assets/gallery/gallery-*.svg` with real photos (square crops
   look best — the grid is square), keeping filenames or fixing links.
4. The `assets/audio/music.mp3` is a placeholder; keep a proper licence
   note in `assets/audio/PROVENANCE.md` before shipping a production track.

## Accessibility & resilience

- The page is fully readable with JavaScript disabled: the cover simply
  never shows, the countdown shows its fallback line, and the share menu
  stays put (copy/WhatsApp/read only). An inline 3s boot guard restores the
  static page if the modules ever fail to boot (e.g. GSAP didn't load).
- The cover is `role="dialog"` (non-modal), the Skip button is reachable,
  the page beneath the cover is `inert` while it's up, and focus is handed
  to the hero heading after entry. `Escape` closes the lightbox / share
  menus.
- Reduced-motion is intentionally ignored, matching the family's annual
  policy (animations always play; the cover can still be skipped).

## Sample data — replace before going live!

Names (Samiha & Rayan), date (19/18/20 February 2027), venue, WhatsApp
number and email are SAMPLES throughout; every template ships as a blank
canvas for a new couple.
