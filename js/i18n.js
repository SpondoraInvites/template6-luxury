// ─────────────────────────────────────────────────────────────────────────────
// i18n — English / Bengali (EN · বাংলা) support.
//
// Translatable strings live in the dictionary below. Elements in index.html
// opt in declaratively:
//   data-i18n="key"            → element textContent is swapped
//   data-i18n-attrs="a:k; a:k" → listed attributes get t(key) as their value
// JavaScript-generated text (RSVP message, share text, audio labels,
// lightbox chrome, countdown digits) calls t(key) / localDigits(str) directly.
//
// The choice persists in localStorage and defaults to Bengali for bn*
// browsers. Changing language dispatches `invitation:lang` so feature
// modules can re-render anything they cached.
// ─────────────────────────────────────────────────────────────────────────────

const STRINGS = {
  en: {
    'meta.title': 'Samiha & Rayan — Wedding Invitation',

    'lang.label': 'Language',

    'names.samiha': 'Samiha',
    'names.rayan': 'Rayan',
    'names.and': '&',
    'names.whole': 'Samiha & Rayan',

    // Cover (tap-to-reveal page)
    'cover.title': 'You are invited',
    'cover.cue': 'Tap to open the invitation',
    'cover.blessing': 'With the blessings of their families',
    'cover.skip': 'Skip',
    'cover.skipAria': 'Skip the opening animation',

    // Hero
    'main.invocation': 'Together with their noble families',
    'main.announce': 'request the honour of your presence',
    'main.invite': 'joyfully invite you to celebrate their wedding',
    'main.saveDate': 'Save the date',
    'main.dateLine': 'Friday, February 19, 2027 · 4:00 PM',
    'main.scrollCue': 'Scroll ↓',

    // Message
    'message.title': 'A Celebration of Love',
    'message.quote': '“Whatever our souls are made of, his and mine are the same.” — Emily Brontë',
    'message.body': 'Please join us as we begin this new chapter surrounded by the people we hold dearest.',

    // Countdown
    'countdown.title': 'Counting Down',
    'countdown.fallback': 'To the day we say I do',
    'countdown.aria': 'Countdown to the wedding ceremony',
    'cd.days': 'Days',
    'cd.hours': 'Hours',
    'cd.minutes': 'Minutes',
    'cd.seconds': 'Seconds',

    // Story
    'story.title': 'Our Story',
    'story.one.title': 'The First Hello',
    'story.one.body': 'A chance meeting at a family gathering — one conversation that neither of us wanted to end.',
    'story.two.title': 'The Decision',
    'story.two.body': 'With our families’ blessings, we said yes to a lifetime of growing together in faith and friendship.',
    'story.three.title': 'The Beginning',
    'story.three.body': 'Now, surrounded by the people we love, we prepare to begin our new life — and we want you there.',

    // Celebrations
    'events.title': 'The Celebrations',
    'events.intro': 'Three evenings of music, laughter and blessings — dress theme: plum & rose gold.',
    'event.mehndi.tag': 'Mehndi Night',
    'event.mehndi.head': 'An evening of henna, dhol and dancing',
    'event.mehndi.when': 'Thursday, February 18, 2027 · 6:00 PM',
    'event.mehndi.venue': 'The Courtyard, House 42, Road 9, Baridhara, Dhaka',
    'event.nikah.tag': 'Nikah · Main Ceremony',
    'event.nikah.head': 'The wedding, witnessed by family and friends',
    'event.nikah.when': 'Friday, February 19, 2027 · 4:00 PM',
    'event.nikah.venue': 'Meridian Grand Ballroom, Gulshan Avenue, Dhaka 1212',
    'event.walima.tag': 'Walima Reception',
    'event.walima.head': 'A festive dinner celebrating the newlyweds',
    'event.walima.when': 'Saturday, February 20, 2027 · 7:00 PM',
    'event.map': 'Map',
    'event.calendar': 'Calendar',

    // Gallery
    'gallery.title': 'Moments & Memories',
    'gallery.intro': 'A few glimpses of us and of the details we love.',
    'gallery.alt': 'Placeholder — replace with a couple photo',

    // When & Where
    'details.title': 'When & Where',
    'details.date': 'Date',
    'details.time': 'Time',
    'details.venue': 'Venue',
    'details.address': 'Address',
    'details.dateValue': 'Friday, February 19, 2027',
    'details.timeValue': '4:00 PM',
    'details.venueValue': 'Meridian Grand Ballroom',
    'details.addressValue': 'Gulshan Avenue, Dhaka 1212, Bangladesh',
    'details.cta': 'Add to Google Calendar',

    // Venue
    'venue.title': 'Getting There',
    'venue.body': 'The celebration takes place at the heart of Gulshan, Dhaka.',
    'venue.mapTitle': 'Map of the venue',
    'venue.cta': 'Open in Google Maps',

    // Share
    'share.cta': 'Share this invitation',
    'share.copy': 'Copy link',
    'share.email': 'Email',

    // RSVP
    'rsvp.title': 'Will You Join Us?',
    'rsvp.deadline': 'Kindly respond by 25 January 2027',
    'rsvp.name': 'Your name',
    'rsvp.namePlaceholder': 'Full name',
    'rsvp.nameError': 'Please tell us your name',
    'rsvp.attend': 'Will you attend?',
    'rsvp.accept': 'Joyfully accept',
    'rsvp.decline': 'Regretfully decline',
    'rsvp.guests': 'Number of guests',
    'rsvp.g1': '1 guest',
    'rsvp.g2': '2 guests',
    'rsvp.g3': '3 guests',
    'rsvp.g4': '4 or more guests',
    'rsvp.note': 'A note for us (optional)',
    'rsvp.notePlaceholder': 'Wishes, dietary needs, questions…',
    'rsvp.send': 'Send via WhatsApp',
    'rsvp.emailLink': 'or reply by email',

    // Closing
    'closing.title': 'With Heartfelt Gratitude',
    'closing.body': 'Your presence and prayers are the greatest gift. We look forward to celebrating with you.',

    // JS-generated strings
    'js.rsvp.subject': 'Samiha & Rayan — RSVP',
    'js.rsvp.nameField': 'Name:',
    'js.rsvp.attending': 'Attending:',
    'js.rsvp.guestsField': 'Guests:',
    'js.share.text': 'Samiha & Rayan\nFriday, February 19, 2027 · 4:00 PM — Meridian Grand Ballroom, Dhaka',
    'js.share.copied': 'Copied!',
    'js.share.subject': 'Samiha & Rayan — Wedding',
    'js.audio.play': 'Play background music',
    'js.audio.pause': 'Pause background music',
    'js.lightbox.close': 'Close',
    'js.lightbox.prev': 'Previous photo',
    'js.lightbox.next': 'Next photo',
  },

  bn: {
    'meta.title': 'সামিহা ও রায়ান — বিয়ের আমন্ত্রণ',

    'lang.label': 'ভাষা',

    'names.samiha': 'সামিহা',
    'names.rayan': 'রায়ান',
    'names.and': 'ও',
    'names.whole': 'সামিহা ও রায়ান',

    'cover.title': 'আপনাকে আমন্ত্রণ জানানো হচ্ছে',
    'cover.cue': 'আমন্ত্রণ দেখতে ট্যাপ করুন',
    'cover.blessing': 'দুই পরিবারের আশীর্বাদে',
    'cover.skip': 'এড়িয়ে যান',
    'cover.skipAria': 'শুরুর অ্যানিমেশন এড়িয়ে যান',

    'main.invocation': 'সম্মানিত দুই পরিবারের সাথে',
    'main.announce': 'আপনার মহিমান্বিত উপস্থিতি কামনা করছে',
    'main.invite': 'তাঁদের বিয়ের আনন্দ ভাগ করে নিতে আপনাকে আমন্ত্রণ জানাচ্ছে',
    'main.saveDate': 'তারিখ সংরক্ষণ করুন',
    'main.dateLine': 'শুক্রবার, ১৯ ফেব্রুয়ারি ২০২৭ · বিকাল ৪:০০',
    'main.scrollCue': 'স্ক্রল ↓',

    'message.title': 'ভালোবাসার উদযাপন',
    'message.quote': '“যা কিছু আমাদের আত্মার তৈরি, তাঁরটি আর আমারটি একই।” — এমিলি ব্রন্টি',
    'message.body': 'প্রিয়তম মানুষদের মাঝে আমরা যেখানে জীবনের নতুন অধ্যায় শুরু করছি, আপনিও যেন সেখানে থাকেন।',

    'countdown.title': 'গণনা চলছে',
    'countdown.fallback': 'বিয়ের দিন পর্যন্ত',
    'countdown.aria': 'বিয়ের অনুষ্ঠানের কাউন্টডাউন',
    'cd.days': 'দিন',
    'cd.hours': 'ঘণ্টা',
    'cd.minutes': 'মিনিট',
    'cd.seconds': 'সেকেন্ড',

    'story.title': 'আমাদের গল্প',
    'story.one.title': 'প্রথম সাক্ষাৎ',
    'story.one.body': 'পারিবারিক আয়োজনে কাকতালীয় দেখা — এমন এক আলাপ, যা কেউই শেষ করতে চাইনি।',
    'story.two.title': 'সিদ্ধান্ত',
    'story.two.body': 'পরিবারের আশীর্বাদে আমরা হ্যাঁ বললাম — বিশ্বাস ও বন্ধুত্বে একসাথে জীবন গড়ে তোলার শপথে।',
    'story.three.title': 'সূচনা',
    'story.three.body': 'এখন প্রিয় মানুষদের মাঝে আমরা নতুন জীবন গড়ার প্রস্তুতি নিচ্ছি — আর সেই মুহূর্তে আপনিও একান্ত কাঙ্ক্ষিত।',

    'events.title': 'উদযাপনের আয়োজন',
    'events.intro': 'সঙ্গীত, হাসি আর আশীর্বাদে ভরা তিনটি সন্ধ্যা — পোশাকের থিম: বেগুনি ও রোজ গোল্ড।',
    'event.mehndi.tag': 'মেহেদি রাত',
    'event.mehndi.head': 'মেহেদি, ঢোল আর নাচে ভরা এক সন্ধ্যা',
    'event.mehndi.when': 'বৃহস্পতিবার, ১৮ ফেব্রুয়ারি ২০২৭ · সন্ধ্যা ৬:০০',
    'event.mehndi.venue': 'দ্য কোর্টইয়ার্ড, বাড়ি ৪২, রোড ৯, বারিধরা, ঢাকা',
    'event.nikah.tag': 'নিকাহ · মূল অনুষ্ঠান',
    'event.nikah.head': 'পরিবার ও বন্ধুদের সাক্ষীতে বিয়ের প্রধান অনুষ্ঠান',
    'event.nikah.when': 'শুক্রবার, ১৯ ফেব্রুয়ারি ২০২৭ · বিকাল ৪:০০',
    'event.nikah.venue': 'মেরিডিয়ান গ্র্যান্ড বলরুম, গুলশান এভিনিউ, ঢাকা ১২১২',
    'event.walima.tag': 'ওয়ালিমা রিসেপশন',
    'event.walima.head': 'নবদম্পতির সম্মানে আয়োজিত আনন্দময় ডিনার',
    'event.walima.when': 'শনিবার, ২০ ফেব্রুয়ারি ২০২৭ · সন্ধ্যা ৭:০০',
    'event.map': 'ম্যাপ',
    'event.calendar': 'ক্যালেন্ডার',

    'gallery.title': 'মুহূর্ত ও স্মৃতি',
    'gallery.intro': 'আমাদের কিছু মুহূর্ত আর যেসব খুঁটিনাটি আমরা ভালোবাসি তার ঝলক।',
    'gallery.alt': 'প্লেসহোল্ডার — দম্পতির ছবি বসিয়ে নিন',

    'details.title': 'কখন ও কোথায়',
    'details.date': 'তারিখ',
    'details.time': 'সময়',
    'details.venue': 'স্থান',
    'details.address': 'ঠিকানা',
    'details.dateValue': 'শুক্রবার, ১৯ ফেব্রুয়ারি ২০২৭',
    'details.timeValue': 'বিকাল ৪:০০',
    'details.venueValue': 'মেরিডিয়ান গ্র্যান্ড বলরুম',
    'details.addressValue': 'গুলশান এভিনিউ, ঢাকা ১২১২, বাংলাদেশ',
    'details.cta': 'গুগল ক্যালেন্ডারে যোগ করুন',

    'venue.title': 'কীভাবে যাবেন',
    'venue.body': 'উদযাপন হবে ঢাকার গুলশানের প্রাণকেন্দ্রে।',
    'venue.mapTitle': 'স্থানের ম্যাপ',
    'venue.cta': 'গুগল ম্যাপসে খুলুন',

    'share.cta': 'এই আমন্ত্রণটি শেয়ার করুন',
    'share.copy': 'লিংক কপি করুন',
    'share.email': 'ইমেইল',

    'rsvp.title': 'আপনি কি আসবেন?',
    'rsvp.deadline': 'অনুগ্রহ করে ২৫ জানুয়ারি ২০২৭-এর মধ্যে জানিয়ে দিন',
    'rsvp.name': 'আপনার নাম',
    'rsvp.namePlaceholder': 'সম্পূর্ণ নাম',
    'rsvp.nameError': 'অনুগ্রহ করে আপনার নাম লিখুন',
    'rsvp.attend': 'আপনি কি উপস্থিত থাকবেন?',
    'rsvp.accept': 'আনন্দের সাথে আসব',
    'rsvp.decline': 'দুঃখের সাথে আসব না',
    'rsvp.guests': 'অতিথির সংখ্যা',
    'rsvp.g1': '১ জন অতিথি',
    'rsvp.g2': '২ জন অতিথি',
    'rsvp.g3': '৩ জন অতিথি',
    'rsvp.g4': '৪ বা তার বেশি অতিথি',
    'rsvp.note': 'আমাদের জন্য নোট (ঐচ্ছিক)',
    'rsvp.notePlaceholder': 'শুভেচ্ছা, খাবারের বিশেষ চাহিদা, প্রশ্ন…',
    'rsvp.send': 'হোয়াটসঅ্যাপে পাঠান',
    'rsvp.emailLink': 'অথবা ইমেইলে উত্তর দিন',

    'closing.title': 'আন্তরিক কৃতজ্ঞতা',
    'closing.body': 'আপনার উপস্থিতি আর দোয়াই আমাদের সবচেয়ে বড় উপহার। আপনাদের সাথে এই আনন্দ ভাগ করে নেওয়ার অপেক্ষায়।',

    'js.rsvp.subject': 'সামিহা ও রায়ান — আরএসভিপি',
    'js.rsvp.nameField': 'নাম:',
    'js.rsvp.attending': 'উপস্থিতি:',
    'js.rsvp.guestsField': 'অতিথি:',
    'js.share.text': 'সামিহা ও রায়ান\nশুক্রবার, ১৯ ফেব্রুয়ারি ২০২৭ · বিকাল ৪:০০ — মেরিডিয়ান গ্র্যান্ড বলরুম, ঢাকা',
    'js.share.copied': 'কপি হয়েছে!',
    'js.share.subject': 'সামিহা ও রায়ান — বিয়ের আমন্ত্রণ',
    'js.audio.play': 'ব্যাকগ্রাউন্ড সংগীত চালান',
    'js.audio.pause': 'ব্যাকগ্রাউন্ড সংগীত বন্ধ করুন',
    'js.lightbox.close': 'বন্ধ করুন',
    'js.lightbox.prev': 'আগের ছবি',
    'js.lightbox.next': 'পরের ছবি',
  },
}

const LANGS = Object.keys(STRINGS)
const STORAGE_KEY = 'invitation:lang'

let lang = (() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (STRINGS[stored]) return stored
  } catch { /* private mode */ }
  return (navigator.language || 'en').toLowerCase().startsWith('bn') ? 'bn' : 'en'
})()

const listeners = []

// Current language.
export function getLang() {
  return lang
}

// Translate a key in the active language (falls back to English, then key).
export function t(key) {
  return STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key
}

// Convert 0-9 to Bengali numerals when Bengali is active (countdown digits).
export function localDigits(str) {
  if (lang !== 'bn') return str
  const digits = '০১২৩৪৫৬৭৮৯'
  return str.replace(/\d/g, (n) => digits[+n])
}

// Register a callback that runs whenever the language changes.
export function onLanguageChange(fn) {
  listeners.push(fn)
}

/* ── apply every marked element + document-level state ─────────────────── */
function apply() {
  for (const el of document.querySelectorAll('[data-i18n]')) {
    el.textContent = t(el.dataset.i18n)
  }
  for (const el of document.querySelectorAll('[data-i18n-attrs]')) {
    for (const pair of el.dataset.i18nAttrs.split(';')) {
      const [attr, key] = pair.split(':').map((s) => s.trim())
      if (attr && key) el.setAttribute(attr, t(key))
    }
  }
  document.documentElement.lang = lang
  document.title = t('meta.title')
}

export function initLang() {
  const toggle = document.querySelector('.lang-toggle')
  const buttons = [...(toggle?.querySelectorAll('[data-lang]') ?? [])]

  const render = () => {
    for (const btn of buttons) {
      const active = btn.dataset.lang === lang
      btn.classList.toggle('active', active)
      btn.setAttribute('aria-pressed', String(active))
    }
  }

  const set = (next) => {
    if (!STRINGS[next] || next === lang) return
    lang = next
    try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* private mode */ }
    apply()
    render()
    for (const fn of listeners) fn(lang)
    document.dispatchEvent(new CustomEvent('invitation:lang', { detail: lang }))
  }

  for (const btn of buttons) {
    btn.addEventListener('click', () => set(btn.dataset.lang))
  }

  apply()
  render()
}
