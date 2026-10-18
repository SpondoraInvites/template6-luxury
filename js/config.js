// ─────────────────────────────────────────────────────────────────────────────
// CENTRAL WEDDING CONFIGURATION — edit this file only.
// The names, messages and numbers below are SAMPLE DATA — replace before use.
// Text content for the page lives in index.html; this file holds the data the
// JavaScript needs: event timing, RSVP destinations and audio settings.
// ─────────────────────────────────────────────────────────────────────────────

export const config = {
  couple: {
    title: 'Samiha & Rayan — Wedding',
  },

  // Main ceremony — drives the countdown (IANA timezone, explicit offset).
  event: {
    iso: '2027-02-19T16:00:00+06:00', // Friday 19 February 2027, 4:00 PM
  },

  venue: {
    mapsQuery: 'Meridian Grand Ballroom Gulshan Avenue Dhaka',
  },

  // RSVP destinations — SAMPLE DATA. The form opens WhatsApp with a pre-filled
  // reply; the email link is the fallback channel.
  rsvp: {
    whatsapp: '8801700000000', // SAMPLE: international format, no + or dashes
    email: 'rsvp@example.com', // SAMPLE
  },

  // Background music (assets/audio/music.mp3), started on the visitor's first
  // gesture, looped, volume-faded, preference persisted. See
  // assets/audio/PROVENANCE.md.
  audio: {
    ready: true,
    src: 'assets/audio/music.mp3',
    volume: 0.5,
  },
}
