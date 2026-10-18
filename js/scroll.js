// Stage-2 scroll choreography: live countdown, per-section scroll
// compositions (masked type, path draws, scrubbed venue deco, rings finale)
// and a limited ambient drift of petals/sparks. Content is visible by
// default; initial hidden states are only applied here when JS + GSAP +
// ScrollTrigger are all healthy, so any failure leaves the readable static
// page. All motion is transform/opacity only and pauses with the tab
// (cover.js pauses the global timeline).

import { config } from './config.js'

const UNITS = ['days', 'hours', 'minutes', 'seconds']

// Direct style mutations: gsap.context().revert() only undoes what GSAP's own
// tweens recorded, so these need a manual snapshot to restore on failure.
function prepDraw(els, prepped) {
  for (const el of els) {
    prepped.push([el, el.getAttribute('style')])
    const len = el.getTotalLength()
    el.style.strokeDasharray = `${len} ${len}`
    el.style.strokeDashoffset = len
  }
}

function countdownParts(iso) {
  const diff = Math.max(0, new Date(iso).getTime() - Date.now())
  const s = Math.floor(diff / 1000)
  return {
    days: String(Math.floor(s / 86400)),
    hours: String(Math.floor(s / 3600) % 24),
    minutes: String(Math.floor(s / 60) % 60),
    seconds: String(s % 60),
    past: diff === 0,
  }
}

export function initScroll() {
  /* ── live countdown — content, not decoration: runs with or without motion ── */
  const nums = Object.fromEntries(UNITS.map((u) => [u, document.querySelector(`.cd-num[data-cd="${u}"]`)]))
  let timer = null
  const renderCountdown = (animate) => {
    const parts = countdownParts(config.event.iso) // clamps past events to zeros
    for (const u of UNITS) {
      const el = nums[u]
      if (!el) continue
      if (el.textContent !== parts[u]) {
        el.textContent = parts[u]
        if (animate && window.gsap) {
          gsap.fromTo(el, { yPercent: -32, autoAlpha: 0.35 },
            { yPercent: 0, autoAlpha: 1, duration: 0.32, ease: 'power1.out', overwrite: 'auto' })
        }
      }
    }
    return parts.past
  }
  if (nums.days) {
    renderCountdown(false)
    timer = setInterval(() => { if (renderCountdown(true)) clearInterval(timer) }, 1000)
  }

  if (!window.gsap || !window.ScrollTrigger) return

  const { gsap, ScrollTrigger } = window
  const PETAL_SVG = '<svg viewBox="0 0 20 28" aria-hidden="true"><path d="M10 1 C16 8 16 18 10 27 C4 18 4 8 10 1 Z"/></svg>'
  const SPARK_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"/></svg>'

  const prepped = []
  let ctx = null
  try {
    // Context is created (and assigned) BEFORE the choreography runs inside
    // it, so a mid-way throw still leaves a live handle to revert with.
    ctx = gsap.context(() => {})
    ctx.add(() => {
      /* 1 · Hero — crest rings, name divider and deco fans ink-draw like the
            section dividers below. The whole reveal is a paused timeline
            gated on the cover: it plays as the cover lifts (invitation:open),
            NOT at page load — otherwise the draws finish behind the cover and
            the visitor never sees them. */
      const heroDraws = document.querySelectorAll('#hero .fan .draw, #hero .crest .draw, #hero .divider .draw')
      prepDraw(heroDraws, prepped)
      gsap.set('#hero .fan .fan-gem', { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%' })
      gsap.set('#hero .fan .dot', { autoAlpha: 0 })
      gsap.set('#hero .divider .flourish-gem', { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%' })

      // Prep every section divider's paths so the per-section timelines
      // below actually ink-draw them into view (without this, the
      // strokeDashoffset tweens animate an unset value → no visible draw).
      for (const svg of document.querySelectorAll('.divider--anim')) {
        prepDraw(svg.querySelectorAll('.draw'), prepped)
      }

      const heroTl = gsap.timeline({ paused: true })
      heroTl
        .to('#hero .crest .draw', { strokeDashoffset: 0, duration: 0.9, stagger: 0.12, ease: 'power1.inOut' }, 0)
        .to('#hero .divider .draw', { strokeDashoffset: 0, duration: 0.7, stagger: 0.12, ease: 'power1.inOut' }, 0.35)
        .to('#hero .divider .flourish-gem', { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.2)' }, 0.75)
        .to('#hero .fan .draw', { strokeDashoffset: 0, duration: 1.4, stagger: 0.05, ease: 'power1.inOut' }, 0.25)
        .to('#hero .fan .dot', { autoAlpha: 1, duration: 0.4 }, 1.2)
        .to('#hero .fan .fan-gem', { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.2)' }, 1.35)

      // Play on the GSAP clock (pauses with a hidden tab) just after the cover
      // starts fading, so the draws kick in as the hero content fades in.
      const cover = document.getElementById('cover')
      const revealHero = () => { gsap.delayedCall(0.45, () => heroTl.play()) }
      if (!cover || cover.dataset.state === 'open') revealHero()
      else document.addEventListener('invitation:open', revealHero, { once: true })

      // Dev replay (?dev=1): rewind the hero draws so the next open re-draws.
      document.addEventListener('invitation:idle', () => {
        heroTl.pause(0)
        for (const el of heroDraws) {
          const len = el.getTotalLength()
          el.style.strokeDasharray = `${len} ${len}`
          el.style.strokeDashoffset = len
        }
        gsap.set('#hero .fan .fan-gem', { scale: 0, autoAlpha: 0 })
        gsap.set('#hero .fan .dot', { autoAlpha: 0 })
        gsap.set('#hero .divider .flourish-gem', { scale: 0, autoAlpha: 0 })
        if (!cover || cover.dataset.state === 'open') heroTl.play()
        else document.addEventListener('invitation:open', revealHero, { once: true })
      })

      // Fans parallax out on scroll once they are on screen
      gsap.to('#hero .fan--tl', {
        yPercent: 14, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('#hero .fan--tr', {
        yPercent: 14, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      })

      /* 2 · Message — masked heading rise, divider draws, quote unveils */
      gsap.set('#message .divider--anim .flourish-gem', { scale: 0, autoAlpha: 0 })
      gsap.timeline({ scrollTrigger: { trigger: '#message', start: 'top 72%' } })
        .fromTo('#message .mask-line', { yPercent: 115 }, { yPercent: 0, duration: 0.85, ease: 'power3.out' }, 0)
        .to('#message .divider--anim .draw', { strokeDashoffset: 0, duration: 0.7, stagger: 0.12, ease: 'power1.inOut' }, 0.1)
        .to('#message .divider--anim .flourish-gem', { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.2)' }, 0.5)
        .fromTo('#message blockquote', { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.3)
        .fromTo('#message blockquote + p', { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.5)

      /* 3 · Countdown — numbers rise out of their cells */
      gsap.fromTo('#countdown .mask-line', { yPercent: 115 }, {
        yPercent: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '#countdown', start: 'top 70%' },
      })

      /* 4 · Story — moments settle in over the diamond separators */
      gsap.timeline({ scrollTrigger: { trigger: '#story', start: 'top 70%' } })
        .fromTo('#story .mask-line', { yPercent: 115 }, { yPercent: 0, duration: 0.85, ease: 'power3.out' }, 0)
        .to('#story .divider--anim .draw', { strokeDashoffset: 0, duration: 0.7, stagger: 0.12, ease: 'power1.inOut' }, 0.15)
        .to('#story .divider--anim .flourish-gem', { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.2)' }, 0.5)
        .fromTo('#story .moment', { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.16, ease: 'power2.out' }, 0.25)

      /* 5 · Events — cards rise in sequence, the featured one last */
      gsap.timeline({ scrollTrigger: { trigger: '#events', start: 'top 70%' } })
        .fromTo('#events .mask-line', { yPercent: 115 }, { yPercent: 0, duration: 0.85, ease: 'power3.out' }, 0)
        .to('#events .divider--anim .draw', { strokeDashoffset: 0, duration: 0.7, stagger: 0.12, ease: 'power1.inOut' }, 0.15)
        .to('#events .divider--anim .flourish-gem', { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.2)' }, 0.5)
        .fromTo('#events .events-intro', { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.45)
        .fromTo('#events .event-card', { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.14, ease: 'power2.out' }, 0.55)

      /* 6 · Gallery — frames unveil with a soft clip + settle */
      gsap.timeline({ scrollTrigger: { trigger: '#gallery', start: 'top 72%' } })
        .fromTo('#gallery .mask-line', { yPercent: 115 }, { yPercent: 0, duration: 0.85, ease: 'power3.out' }, 0)
        .to('#gallery .divider--anim .draw', { strokeDashoffset: 0, duration: 0.7, stagger: 0.12, ease: 'power1.inOut' }, 0.1)
        .to('#gallery .divider--anim .flourish-gem', { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.2)' }, 0.45)
        .fromTo('#gallery .gallery-intro', { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.35)
        .fromTo('#gallery .gallery-item', { clipPath: 'inset(5% 5% 5% 5%)', autoAlpha: 0.001, scale: 1.05 },
          { clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.08, ease: 'power2.out' }, 0.3)

      /* 7 · Details — letterpress rows settle inside the plate */
      gsap.timeline({ scrollTrigger: { trigger: '#details', start: 'top 70%' } })
        .fromTo('#details .mask-line', { yPercent: 115 }, { yPercent: 0, duration: 0.85, ease: 'power3.out' }, 0)
        .to('#details .divider--anim .draw', { strokeDashoffset: 0, duration: 0.7, stagger: 0.12, ease: 'power1.inOut' }, 0.15)
        .to('#details .divider--anim .flourish-gem', { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.2)' }, 0.5)
        .fromTo('#details .details > div', { autoAlpha: 0, y: 26, rotationX: -8, transformOrigin: '50% 0%' },
          { autoAlpha: 1, y: 0, rotationX: 0, duration: 0.7, stagger: 0.11, ease: 'power2.out' }, 0.2)
        .fromTo('#details .cta', { autoAlpha: 0, scale: 0.92 },
          { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, 0.65)

      /* 8 · Venue — chandelier strings draw with scroll, beads sparkle in */
      prepDraw(document.querySelectorAll('#venue .venue-deco .stem, #venue .venue-deco .pendant'), prepped)
      gsap.set('#venue .venue-deco .gem, #venue .venue-deco .venue-gem, #venue .venue-gem', { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%' })
      gsap.set('#venue .venue-deco .dot', { autoAlpha: 0 })
      gsap.timeline({ scrollTrigger: { trigger: '#venue', start: 'top 95%', end: 'top 45%', scrub: 0.6 } })
        .to('#venue .venue-deco .stem', { strokeDashoffset: 0, stagger: 0.2, ease: 'none' }, 0)
        .to('#venue .venue-deco .pendant', { strokeDashoffset: 0, stagger: 0.15, ease: 'none' }, 0.25)
        .to('#venue .venue-deco .dot', { autoAlpha: 1, stagger: 0.04, ease: 'none' }, 0.4)
        .to('#venue .venue-gem', { scale: 1, autoAlpha: 1, ease: 'back.out(2.2)' }, 0.55)
      // Map unhides and settles once the plaque has drawn
      gsap.fromTo(['#venue .map-embed', '#venue .cta', '#venue .share'],
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: '#venue', start: 'top 62%' },
        })

      /* 9 · RSVP — the plate-framed form rises */
      gsap.timeline({ scrollTrigger: { trigger: '#rsvp', start: 'top 70%' } })
        .fromTo('#rsvp .mask-line', { yPercent: 115 }, { yPercent: 0, duration: 0.85, ease: 'power3.out' }, 0)
        .to('#rsvp .divider--anim .draw', { strokeDashoffset: 0, duration: 0.7, stagger: 0.12, ease: 'power1.inOut' }, 0.15)
        .to('#rsvp .divider--anim .flourish-gem', { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.2)' }, 0.5)
        .fromTo('#rsvp .rsvp-form', { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.3)

      /* 10 · Closing — gratitude masks, then the rings finale */
      prepDraw(document.querySelectorAll('#closing .finale .draw'), prepped)
      gsap.set('#closing .finale-gem', { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%' })
      gsap.timeline({ scrollTrigger: { trigger: '#closing', start: 'top 62%' } })
        .fromTo('#closing .mask-line', { yPercent: 115 }, { yPercent: 0, duration: 0.85, stagger: 0.14, ease: 'power3.out' }, 0.05)
        .to('#closing .divider--anim .draw', { strokeDashoffset: 0, duration: 0.7, stagger: 0.12, ease: 'power1.inOut' }, 0.2)
        .to('#closing .divider--anim .flourish-gem', { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.2)' }, 0.6)
        .to('#closing .finale .draw', { strokeDashoffset: 0, duration: 1.05, stagger: 0.12, ease: 'power1.inOut' }, 0.3)
        .to('#closing .finale-gem', { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.2)' }, 1.0)
    })
  } catch (err) {
    ctx?.revert() // kill partial tweens/ScrollTriggers, undo GSAP-set styles
    for (const [el, style] of prepped) style === null ? el.removeAttribute('style') : el.setAttribute('style', style)
    console.warn('[invitation] scroll choreography disabled:', err)
    return
  }

  /* ── ambient drift: layered petals & gold sparks, spawned once the cover opens ── */
  const layer = document.querySelector('.page-petals')
  if (layer) {
    const spawn = () => {
      if (layer.children.length) return
      const utils = gsap.utils
      for (let i = 0; i < 9; i++) {
        const el = document.createElement('span')
        const kind = i % 3 // blush petal · lilac petal · gold spark
        el.className = 'drift' + (kind === 1 ? ' drift--lilac' : kind === 2 ? ' drift--gold' : '')
        el.style.left = 3 + utils.random(0, 92) + '%'
        el.style.width = (kind === 2 ? 8 : 9) + utils.random(0, 9) + 'px'
        el.style.opacity = (0.3 + utils.random(0, 0.3)).toFixed(2)
        el.innerHTML = kind === 2 ? SPARK_SVG : PETAL_SVG
        layer.appendChild(el)
        gsap.fromTo(el, { y: '-9vh', rotation: utils.random(-60, 60) }, {
          y: '112vh',
          rotation: '+=' + utils.random(160, 420),
          duration: utils.random(12, 20),
          delay: utils.random(0, 8),
          repeat: -1,
          ease: 'none',
        })
        gsap.to(el, { x: () => utils.random(-34, 34), duration: utils.random(2.4, 4.6), repeat: -1, yoyo: true, ease: 'sine.inOut' })
      }
    }
    const clear = () => { gsap.killTweensOf(layer.children); layer.replaceChildren() }
    if (document.getElementById('cover')?.dataset.state === 'open') { clear(); spawn() }
    document.addEventListener('invitation:open', spawn)
    document.addEventListener('invitation:idle', clear)
  }
}
