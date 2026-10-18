// Entry point — boots only when dependencies are healthy; any failure falls
// back to the fully readable static page (fail-safe, never traps the user).

import { initCover } from './cover.js'
import { initScroll } from './scroll.js'
import { initRsvp } from './rsvp.js'
import { initShare } from './share.js'
import { initLightbox } from './lightbox.js'
import { initAudio } from './audio.js'

const html = document.documentElement

function failSafe(cause) {
  console.warn('[invitation] fail-safe — serving static page:', cause)
  html.classList.remove('js')
  document.body.classList.remove('cover-active')
  // The gate may already be armed (initCover ran) — unlock the static page.
  document.getElementById('invitation')?.removeAttribute('inert')
  document.getElementById('cover')?.remove()
}

try {
  if (!window.gsap) throw new Error('GSAP unavailable')
  if (window.ScrollTrigger && gsap.registerPlugin) gsap.registerPlugin(ScrollTrigger)

  const coverCtl = initCover()
  // Scroll choreography guards itself: any internal failure just leaves the
  // fully readable static sections (it never throws out).
  initScroll()
  initRsvp()
  initShare()
  initLightbox()
  initAudio()

  // Dev replay: ?dev=1 reveals the replay control.
  if (new URLSearchParams(window.location.search).has('dev')) {
    const replayBtn = document.querySelector('.dev-replay')
    if (replayBtn) {
      replayBtn.hidden = false
      replayBtn.addEventListener('click', () => coverCtl.replay())
    }
  }

  window.__invitationBooted = true
} catch (err) {
  failSafe(err)
}
