// Gallery lightbox — progressive enhancement: built only when JS + GSAP are
// healthy, from whatever images the gallery holds. Full-screen viewer with
// caption, counter, arrow and keyboard navigation, touch swipe, and focus
// management. The viewer languages itself via i18n (labels re-applied on
// language change through the data-i18n-attrs hooks in its markup).

import { t, localDigits, onLanguageChange } from './i18n.js'

export function initLightbox() {
  const items = [...document.querySelectorAll('.gallery-item img')]
  if (!items.length || !window.gsap) return
  const { gsap } = window

  // ── build the overlay once ──────────────────────────────────────────────
  const overlay = document.createElement('div')
  overlay.className = 'lightbox'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.innerHTML = `
    <button class="lightbox-close" type="button" data-lb="close" data-i18n-attrs="aria-label:js.lightbox.close" aria-label="${t('js.lightbox.close')}">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5 L19 19 M19 5 L5 19"/></svg>
    </button>
    <button class="lightbox-nav lightbox-nav--prev" type="button" data-lb="prev" data-i18n-attrs="aria-label:js.lightbox.prev" aria-label="${t('js.lightbox.prev')}">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 4 L7 12 L15 20"/></svg>
    </button>
    <figure class="lightbox-figure">
      <img alt="">
      <figcaption></figcaption>
    </figure>
    <button class="lightbox-nav lightbox-nav--next" type="button" data-lb="next" data-i18n-attrs="aria-label:js.lightbox.next" aria-label="${t('js.lightbox.next')}">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 4 L17 12 L9 20"/></svg>
    </button>
    <div class="lightbox-counter"></div>`
  document.body.appendChild(overlay)

  const els = {
    img: overlay.querySelector('img'),
    caption: overlay.querySelector('figcaption'),
    counter: overlay.querySelector('.lightbox-counter'),
    close: overlay.querySelector('[data-lb="close"]'),
    prev: overlay.querySelector('[data-lb="prev"]'),
    next: overlay.querySelector('[data-lb="next"]'),
  }

  let index = 0
  let lastFocus = null

  const render = (i) => {
    index = (i + items.length) % items.length
    const source = items[index]
    els.img.src = source.currentSrc || source.src
    els.img.alt = source.alt
    els.caption.textContent = source.alt
    els.counter.textContent = localDigits(`${index + 1} / ${items.length}`)
    // Preload the neighbours so arrow/swipe navigation feels instant.
    for (const n of [index - 1, index + 1]) {
      const im = new Image()
      im.src = items[(n + items.length) % items.length].currentSrc || items[(n + items.length) % items.length].src
    }
    gsap.fromTo(els.img, { autoAlpha: 0.3 }, { autoAlpha: 1, duration: 0.3, ease: 'power1.out', overwrite: true })
  }

  const main = document.getElementById('invitation')

  const open = (i, trigger) => {
    lastFocus = trigger || document.activeElement
    render(i)
    overlay.classList.add('open')
    document.body.classList.add('lightbox-open')
    main?.setAttribute('inert', '') // keep Tab inside the viewer
    els.close.focus()
  }

  const close = () => {
    overlay.classList.remove('open')
    document.body.classList.remove('lightbox-open')
    main?.removeAttribute('inert')
    lastFocus?.focus()
  }

  // ── wiring ──────────────────────────────────────────────────────────────
  items.forEach((img, i) => {
    const figure = img.closest('.gallery-item')
    figure.style.cursor = 'zoom-in'
    figure.setAttribute('tabindex', '0')
    figure.setAttribute('role', 'button')
    figure.setAttribute('aria-label', img.alt)
    figure.addEventListener('click', () => open(i, figure))
    figure.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i, figure) }
    })
  })

  els.close.addEventListener('click', close)
  els.prev.addEventListener('click', () => render(index - 1))
  els.next.addEventListener('click', () => render(index + 1))
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close() })

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowRight') render(index + 1)
    else if (e.key === 'ArrowLeft') render(index - 1)
    else if (e.key === 'Tab') {
      // Small focus loop: close ↔ prev ↔ next.
      const focusables = [els.close, els.prev, els.next]
      const pos = focusables.indexOf(document.activeElement)
      if (!e.shiftKey && (pos === -1 || pos === focusables.length - 1)) { e.preventDefault(); focusables[0].focus() }
      else if (e.shiftKey && (pos === -1 || pos === 0)) { e.preventDefault(); focusables[focusables.length - 1].focus() }
    }
  })

  // Touch swipe.
  let touchX = null
  overlay.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX }, { passive: true })
  overlay.addEventListener('touchend', (e) => {
    if (touchX === null) return
    const dx = e.changedTouches[0].clientX - touchX
    if (Math.abs(dx) > 45) render(index + (dx < 0 ? 1 : -1))
    touchX = null
  }, { passive: true })

  // Language switch: the image alt texts (gallery figures + captions) are
  // re-applied document-wide by i18n; refresh the mirrors kept here.
  onLanguageChange(() => {
    items.forEach((img) => img.closest('.gallery-item')?.setAttribute('aria-label', img.alt))
    els.img.alt = items[index].alt
    els.counter.textContent = localDigits(`${index + 1} / ${items.length}`)
    if (overlay.classList.contains('open')) els.caption.textContent = items[index].alt
  })
}
