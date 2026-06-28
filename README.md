# Fretwork 🎸

A small, static workbench for learning guitar — built to accompany the beginner
stage of the [JustinGuitar](https://www.justinguitar.com) course.

No build step, no accounts, no tracking. Just plain HTML, CSS and JavaScript that
runs anywhere, including GitHub Pages.

## What's inside

- **Chord library** — the essential beginner chords (major, minor and dominant
  7th), each drawn as a standard chord-box diagram showing finger positions,
  which strings to play open, and which to mute. Tap a chord for placement tips
  and a string-by-string fingering breakdown.
- **Perfect Chord Practice** — the four-step routine for nailing a single chord:
  place → play each string → adjust → lift off & repeat.
- **One Minute Changes** — pick two chords and switch between them as many times
  as you can in 60 seconds. Start/stop with **Space**, count each change with
  **C** (or tap the counter), and a buzzer tells you when time's up. Or enable
  **🎤 Auto-count with microphone** to have the app listen for strums and bump
  the counter for you while the timer runs.

## Run locally

It's fully static — just open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Project layout

```
index.html        # shell + fonts
css/style.css     # all styling
js/chords.js      # chord data (add chords here)
js/diagram.js     # SVG chord-diagram renderer
js/app.js         # hash router, views, timer, Web Audio sounds
```

### Adding a chord

Add an entry to `CHORDS` in `js/chords.js`. Strings are listed low-E → high-e:

```js
G7: {
  name: "G7", label: "G Dominant 7", family: "dominant7",
  frets:   [3, 2, 0, 0, 0, 1],   // "x" = mute, 0 = open, n = fret
  fingers: [3, 2, null, null, null, 1],
  baseFret: 1,
  tip: "…",
}
```

## How mic auto-counting works

The detector (`Mic` in `js/app.js`) doesn't recognise chords — it only needs to
hear *that* a strum happened. It runs the mic through an `AnalyserNode` and
watches **spectral flux** (the frame-to-frame rise in the magnitude spectrum).
A strum is a sudden broadband burst, so when flux spikes above an adaptive noise
floor it registers an onset; a short refractory window keeps one strum from
counting twice. Onsets only increment the counter while the timer is running.

Browsers only grant mic access over `https://` (or `http://localhost`), so use
the local server below rather than opening the file directly when testing the
mic.

---

Built with [Claude Code](https://claude.com/claude-code).
