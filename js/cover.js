// Cinematic cover, tap-gated. The idle poster — deco arch, interlocked-rings
// monogram, family line, names, tap cue, twinkling stars — is pure CSS,
// visible instantly, and waits indefinitely. A tap anywhere on the cover
// plays the ≈4.4s choreography: tap → cue dissolves → the deco arch draws
// itself line by line → the rings draw beneath it → the arch dissolves while
// the monogram glides to the true centre of the screen → the heavy deco
// panels part to pearl light → a gold starburst → the invitation is entered
// automatically (no second tap). Skippable at any point; dev replay fully
// resets to the idle poster. The entry failsafe runs on GSAP's clock so
// hidden-tab time never counts.

export function initCover() {
  const cover = document.getElementById('cover')
  const body = document.body
  if (!cover || !window.gsap) return { open() {}, replay() {}, isOpen: () => false }

  // While the cover gates the page, the invitation beneath it stays out of
  // the tab order and the accessibility tree.
  const pageMain = document.getElementById('invitation')
  const lockBackground = (lock) => {
    if (!pageMain) return
    lock ? pageMain.setAttribute('inert', '') : pageMain.removeAttribute('inert')
  }

  body.classList.add('cover-active')
  lockBackground(true)

  const q = (sel) => cover.querySelector(sel)
  const qa = (sel) => [...cover.querySelectorAll(sel)]
  const { gsap } = window

  const archDraw = qa('.arch .draw')
  const monoDraw = qa('.mono-art .draw')
  const monoStar = q('.mono-art .mono-star')
  const initials = q('.mono-initials')
  const glow = q('.mono-glow')
  const mono = q('.mono-abs')
  const stars = q('.poster-stars')
  const cue = q('.poster-cue')
  const posterFade = q('.poster-fade')
  const family = q('.poster-family')
  const names = q('.poster-names')
  const beads = q('.poster-beads')
  const light = q('.cover-light')
  const enterNames = q('.cover-enter-names')
  const stripes = q('.cover-stripes')
  const sparksLayer = q('.cover-sparks')
  const panels = [q('.cover-panel--l'), q('.cover-panel--r')]
  const skipBtn = q('.cover-skip')
  const heroTitle = document.querySelector('.hero-names')

  let state = 'idle' // idle → playing → open
  let tl = null
  let failsafe = null
  cover.dataset.state = 'idle'

  /* ── starburst sparks ──────────────────────────────────────────────────── */
  const SPARK_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"/></svg>'
  const sparkTweens = []

  function spawnSparks() {
    stopSparks()
    const utils = gsap.utils
    for (let i = 0; i < 12; i++) {
      const el = document.createElement('span')
      el.className = 'spark'
      el.style.width = el.style.height = (6 + utils.random(0, 8)) + 'px'
      el.innerHTML = SPARK_SVG
      el.style.color = i % 3 === 2 ? 'var(--lilac)' : 'var(--rose)'
      sparksLayer.appendChild(el)
      const angle = (i / 12) * Math.PI * 2 + utils.random(-0.2, 0.2)
      const distance = () => 60 + utils.random(0, Math.min(260, window.innerWidth * 0.34))
      sparkTweens.push(
        gsap.fromTo(el,
          { xPercent: -50, yPercent: -50, x: window.innerWidth * 0.5, y: window.innerHeight * 0.52, scale: 0, rotation: 45 },
          {
            x: () => window.innerWidth * 0.5 + Math.cos(angle) * distance(),
            y: () => window.innerHeight * 0.52 + Math.sin(angle) * distance(),
            scale: 1, rotation: 90,
            duration: utils.random(0.8, 1.5),
            ease: 'power2.out',
          }),
        gsap.to(el, { autoAlpha: 0, scale: 0.4, duration: 0.45, delay: utils.random(1.0, 1.6) }),
      )
    }
  }

  function stopSparks() {
    sparkTweens.forEach((t) => t.kill())
    sparkTweens.length = 0
    sparksLayer.replaceChildren()
  }

  /* ── falling blush petals ──────────────────────────────────────────────── */
  const petalsLayer = q('.cover-petals')
  const petalTweens = []
  const PETAL_SVG = '<svg viewBox="0 0 20 28" aria-hidden="true"><path d="M10 1 C16 8 16 18 10 27 C4 18 4 8 10 1 Z"/></svg>'

  function spawnPetals() {
    stopPetals()
    const utils = gsap.utils
    for (let i = 0; i < 8; i++) {
      const el = document.createElement('span')
      el.className = 'petal' + (i % 3 === 0 ? ' petal--lilac' : i % 3 === 1 ? ' petal--gold' : '')
      el.style.left = 4 + utils.random(0, 92) + '%'
      el.style.width = 9 + utils.random(0, 7) + 'px'
      el.innerHTML = PETAL_SVG
      petalsLayer.appendChild(el)
      petalTweens.push(
        gsap.fromTo(el, { y: '-8vh', rotation: utils.random(-40, 40) }, {
          y: '112vh',
          rotation: '+=' + utils.random(120, 320),
          duration: utils.random(8, 14),
          delay: utils.random(0, 5),
          repeat: -1,
          ease: 'none',
        }),
        gsap.to(el, { x: () => utils.random(-28, 28), duration: utils.random(2, 4), repeat: -1, yoyo: true, ease: 'sine.inOut' }),
      )
    }
  }

  function stopPetals() {
    petalTweens.forEach((t) => t.kill())
    petalTweens.length = 0
    petalsLayer.replaceChildren()
  }

  /* ── line-drawing prep ─────────────────────────────────────────────────── */
  function prepDraw(els) {
    for (const el of els) {
      const len = el.getTotalLength()
      el.style.strokeDasharray = `${len} ${len}`
      el.style.strokeDashoffset = len
    }
  }

  /* ── entry (end of the sequence, skip or failsafe) ─────────────────────── */
  function enter(fast) {
    if (state === 'open') return
    state = 'open'
    cover.dataset.state = 'open'
    document.dispatchEvent(new CustomEvent('invitation:open'))
    if (failsafe) { failsafe.kill(); failsafe = null }
    if (tl) { tl.kill(); tl = null }
    stopPetals()
    stopSparks()
    gsap.killTweensOf([cover, ...panels, mono])
    gsap.set([skipBtn, cue], { autoAlpha: 0 })
    const done = () => {
      body.classList.remove('cover-active')
      cover.setAttribute('aria-hidden', 'true')
      cover.style.display = 'none'
      lockBackground(false)
    }
    gsap.to(cover, { autoAlpha: 0, duration: fast ? 0.25 : 0.5, ease: 'power1.inOut', onComplete: done })
    gsap.fromTo('.hero > :not(.fan)', { autoAlpha: 0, y: 24 }, {
      autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', delay: 0.3,
      clearProps: 'transform,opacity,visibility',
      onComplete: () => heroTitle?.focus({ preventScroll: true }),
    })
  }

  /* ── activation: the visitor's tap starts the choreography ─────────────── */
  function activate() {
    if (state !== 'idle') return
    state = 'playing'
    cover.dataset.state = 'playing'

    // Failsafe on GSAP's clock: pauses with the page (hidden time never counts).
    failsafe = gsap.delayedCall(9.5, () => enter(true))

    prepDraw(archDraw); prepDraw(monoDraw)
    gsap.set(monoStar, { scale: 0, transformOrigin: '50% 50%', rotation: 45 })
    gsap.set(mono, { xPercent: -50, x: 0 })
    gsap.set(glow, { opacity: 0.4 })
    gsap.set(light, { autoAlpha: 0 })
    gsap.set(enterNames, { autoAlpha: 0 })

    // The monogram glide is aimed at the true screen centre. Measure with the
    // transform cleared (idle look is translateX(-50%)), then restore it —
    // the delta tween runs cleanly on top of the baked-in xPercent.
    gsap.set(mono, { x: 0, y: 0, xPercent: 0 })
    const monoRect = mono.getBoundingClientRect()
    const monoDx = window.innerWidth * 0.5 - (monoRect.left + monoRect.width * 0.5)
    const monoDy = window.innerHeight * 0.5 - (monoRect.top + monoRect.height * 0.5)
    gsap.set(mono, { xPercent: -50 })

    const t = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' }, onComplete: () => enter(false) })

    // I · The invitation yields — cue dissolves, then the bottom identity
    // block (names · family line · beads) fades one beat later (0–0.7s)
    t.to(cue, { autoAlpha: 0, duration: 0.35 }, 0)
    t.to([names, family, beads], { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, 0.18)

    // II · The deco arch draws itself, top star glimmers, panel ticks catch
    // the light (0.45–1.9s)
    t.to(archDraw, { strokeDashoffset: 0, duration: 1.35, ease: 'power1.inOut', stagger: 0.06 }, 0.45)

    // III · The interlocked rings draw beneath the arch, initials bloom in,
    // the glow warms (1.0–2.2s)
    t.to(monoDraw, { strokeDashoffset: 0, duration: 1.0, ease: 'power1.inOut', stagger: 0.14 }, 1.05)
    t.to(monoStar, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2.2)' }, 1.55)
    t.fromTo(initials, { autoAlpha: 0.25 }, { autoAlpha: 1, duration: 0.7 }, 1.35)
    t.fromTo(glow, { opacity: 0.4 }, { opacity: 1, duration: 0.9, ease: 'sine.out' }, 1.2)

    // IV · The arch dissolves and the monogram glides alone to the true
    // centre of the screen (2.2–3.2s). GSAP owns the transform from here on:
    // the idle CSS offset lives in xPercent, so x/y tweens run cleanly.
    t.to(archDraw, { autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, 2.25)
    t.to(mono, { x: monoDx, y: monoDy, duration: 0.95, ease: 'power2.inOut' }, 2.25)
    t.to(stars, { autoAlpha: 0, duration: 0.6 }, 2.5)

    // V · The panels part to pearl light — the velvet stripe texture belongs
    // to the closed cover, so it dissolves with the parting (otherwise the
    // dark lines keep printing over the revealed pearl page) (3.15–3.8s)
    t.to(panels[0], { xPercent: -101, duration: 1.15, ease: 'power3.inOut' }, 3.15)
    t.to(panels[1], { xPercent: 101, duration: 1.15, ease: 'power3.inOut' }, 3.15)
    t.to(stripes, { autoAlpha: 0, duration: 0.65, ease: 'power1.out' }, 3.15)
    t.fromTo(light, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'sine.out' }, 3.2)
    t.add(spawnSparks, 3.4)
    t.add(spawnPetals, 3.35)
    t.fromTo(enterNames, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 3.55)
    t.to(mono, { autoAlpha: 0, y: '-=56', scale: 1.08, duration: 0.6, ease: 'power1.in' }, 3.7)

    tl = t
    t.play(0)
  }

  /* ── dev replay: full reset to the idle poster ─────────────────────────── */
  function replay() {
    if (state !== 'open') return
    if (!cover.isConnected) return
    if (failsafe) { failsafe.kill(); failsafe = null }
    if (tl) { tl.kill(); tl = null }
    stopPetals()
    stopSparks()
    const reset = [cover, ...panels, mono, glow, light, initials, cue, skipBtn,
      ...archDraw, ...monoDraw, monoStar, stars, posterFade, family, names, beads, enterNames, stripes]
    gsap.killTweensOf(reset)
    gsap.set(reset, { clearProps: 'all' })
    for (const el of [...archDraw, ...monoDraw]) {
      el.style.strokeDasharray = ''
      el.style.strokeDashoffset = ''
    }
    cover.style.display = ''
    cover.removeAttribute('aria-hidden')
    cover.dataset.state = 'idle'
    state = 'idle'
    body.classList.add('cover-active')
    lockBackground(true)
    cue?.focus({ preventScroll: true })
    window.scrollTo(0, 0)
    document.dispatchEvent(new CustomEvent('invitation:idle'))
  }

  /* ── controls & safety ─────────────────────────────────────────────────── */
  cover.addEventListener('click', (e) => {
    if (e.target.closest('.cover-skip')) return
    activate()
  })
  skipBtn.addEventListener('click', () => {
    if (state === 'playing') tl && tl.progress(1, false)
    else if (state === 'idle') enter(true)
  })

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) gsap.globalTimeline.pause()
    else gsap.globalTimeline.play()
  })

  return { open: () => enter(true), replay, isOpen: () => state === 'open' }
}
