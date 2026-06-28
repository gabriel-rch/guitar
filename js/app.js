// ---------------------------------------------------------------------------
// Tiny hash router + views. No build step, no dependencies.
// ---------------------------------------------------------------------------

const app = document.getElementById("app");

const routes = {
  "": viewHome,
  "chords": viewChords,
  "chord": viewChordDetail, // #/chord/A
  "practice": viewPractice, // Perfect Chord Practice
  "changes": viewChanges, // One Minute Changes
};

function router() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [route, arg] = hash.split("/");
  const view = routes[route] || viewHome;
  app.innerHTML = "";
  app.scrollTo?.(0, 0);
  window.scrollTo(0, 0);
  view(arg);
  updateNav(route);
}

function updateNav(route) {
  document.querySelectorAll(".nav-link").forEach((a) => {
    const r = a.getAttribute("href").replace(/^#\/?/, "").split("/")[0];
    a.classList.toggle("is-active", r === route);
  });
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);

// --- helpers --------------------------------------------------------------

function el(tag, props = {}, ...children) {
  const e = document.createElement(tag);
  for (const k in props) {
    if (k === "class") e.className = props[k];
    else if (k === "html") e.innerHTML = props[k];
    else if (k.startsWith("on") && typeof props[k] === "function")
      e.addEventListener(k.slice(2).toLowerCase(), props[k]);
    else if (props[k] != null) e.setAttribute(k, props[k]);
  }
  for (const c of children.flat()) {
    if (c == null) continue;
    e.append(c.nodeType ? c : document.createTextNode(c));
  }
  return e;
}

function chordCard(key, { mini = false } = {}) {
  const chord = CHORDS[key];
  const card = el("a", { href: `#/chord/${key}`, class: "chord-card reveal" });
  card.appendChild(renderChordDiagram(chord, { size: mini ? 0.85 : 1 }));
  card.appendChild(el("span", { class: "chord-card__name" }, chord.label));
  return card;
}

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------
function viewHome() {
  const wrap = el("section", { class: "home" });

  wrap.appendChild(
    el(
      "header",
      { class: "hero" },
      el("p", { class: "hero__eyebrow reveal" }, "Open string · learn · repeat"),
      el(
        "h1",
        { class: "hero__title reveal" },
        "Practice the ",
        el("em", {}, "fundamentals"),
        " of guitar."
      ),
      el(
        "p",
        { class: "hero__lead reveal" },
        "A small workbench for the first stage of your playing — a clean chord library and the two practice exercises that build real fingers: Perfect Chord Practice and One Minute Changes."
      ),
      el(
        "div",
        { class: "hero__cta reveal" },
        el("a", { href: "#/chords", class: "btn btn--solid" }, "Browse chords"),
        el("a", { href: "#/changes", class: "btn btn--ghost" }, "Start a 1‑minute drill")
      )
    )
  );

  const tools = el("div", { class: "tool-grid" });
  tools.appendChild(
    toolCard(
      "01",
      "Perfect Chord Practice",
      "The four‑step routine for nailing a single chord — place, check, lift, repeat — until every string rings clean.",
      "#/practice"
    )
  );
  tools.appendChild(
    toolCard(
      "02",
      "One Minute Changes",
      "Pick two chords and switch between them as many times as you can in sixty seconds. A buzzer tells you when to stop.",
      "#/changes"
    )
  );
  wrap.appendChild(el("section", { class: "section" }, sectionTitle("Exercises"), tools));

  // chord preview strip
  const strip = el("div", { class: "chord-grid" });
  Object.keys(CHORDS).slice(0, 8).forEach((k) => strip.appendChild(chordCard(k, { mini: true })));
  wrap.appendChild(
    el(
      "section",
      { class: "section" },
      sectionTitle("Chord library", el("a", { href: "#/chords", class: "section__more" }, "See all →")),
      strip
    )
  );

  app.appendChild(wrap);
  stagger();
}

function toolCard(num, title, desc, href) {
  return el(
    "a",
    { href, class: "tool-card reveal" },
    el("span", { class: "tool-card__num" }, num),
    el("h3", { class: "tool-card__title" }, title),
    el("p", { class: "tool-card__desc" }, desc),
    el("span", { class: "tool-card__go" }, "Open exercise →")
  );
}

function sectionTitle(text, extra) {
  return el("div", { class: "section__head" }, el("h2", { class: "section__title" }, text), extra || null);
}

// ---------------------------------------------------------------------------
// Chord library
// ---------------------------------------------------------------------------
function viewChords() {
  const wrap = el("section", { class: "page" });
  wrap.appendChild(pageHead("Chord Library", "The essential beginner chords. Tap any chord to learn how to place it."));

  const families = [
    ["major", "Major chords"],
    ["minor", "Minor chords"],
    ["dominant7", "Dominant 7th chords"],
  ];
  for (const [fam, title] of families) {
    const keys = Object.keys(CHORDS).filter((k) => CHORDS[k].family === fam);
    if (!keys.length) continue;
    const grid = el("div", { class: "chord-grid" });
    keys.forEach((k) => grid.appendChild(chordCard(k)));
    wrap.appendChild(el("div", { class: "section" }, el("h2", { class: "fam-title reveal" }, title), grid));
  }
  app.appendChild(wrap);
  stagger();
}

// ---------------------------------------------------------------------------
// Chord detail
// ---------------------------------------------------------------------------
function viewChordDetail(key) {
  const chord = CHORDS[key];
  if (!chord) return viewChords();
  const wrap = el("section", { class: "page chord-detail" });
  wrap.appendChild(el("a", { href: "#/chords", class: "backlink reveal" }, "← All chords"));

  const head = el(
    "div",
    { class: "detail-head" },
    el(
      "div",
      { class: "detail-diagram reveal" },
      renderChordDiagram(chord, { size: 1.9 })
    ),
    el(
      "div",
      { class: "detail-info reveal" },
      el("p", { class: "detail-kicker" }, chord.family.replace("dominant7", "dominant 7th")),
      el("h1", { class: "detail-title" }, chord.label),
      el("p", { class: "detail-tip" }, chord.tip),
      fingeringList(chord),
      el(
        "div",
        { class: "detail-actions" },
        el("a", { href: `#/practice/${key}`, class: "btn btn--solid" }, "Practice this chord"),
        el("a", { href: "#/changes", class: "btn btn--ghost" }, "Use in 1‑minute changes")
      )
    )
  );
  wrap.appendChild(head);
  app.appendChild(wrap);
  stagger();
}

function fingeringList(chord) {
  const ul = el("ul", { class: "fingering" });
  for (let s = 0; s < 6; s++) {
    const fret = chord.frets[s];
    let txt;
    if (fret === "x") txt = "don't play";
    else if (fret === 0) txt = "open";
    else txt = `fret ${fret}` + (chord.fingers[s] ? ` · finger ${chord.fingers[s]}` : "");
    ul.appendChild(
      el(
        "li",
        { class: fret === "x" ? "is-mute" : "" },
        el("span", { class: "fingering__str" }, STRING_NAMES[s]),
        el("span", { class: "fingering__act" }, txt)
      )
    );
  }
  return ul;
}

// ---------------------------------------------------------------------------
// Perfect Chord Practice  (the 4-step routine)
// ---------------------------------------------------------------------------
const PRACTICE_STEPS = [
  {
    title: "Place your fingers",
    body: "Put each finger down for the chord — one at a time. Aim for the fingertips, arched, and sit just behind the fret (not on top of it, not far back).",
  },
  {
    title: "Play each string",
    body: "Pick the strings one by one, lowest to highest. Listen: does every fretted and open string ring clearly? Find any string that buzzes or sounds dead.",
  },
  {
    title: "Adjust & fix",
    body: "Fix the problem strings. A buzz usually means too far from the fret; a muted string usually means a finger is leaning on it. Nudge, re‑arch, and check again.",
  },
  {
    title: "Lift off & repeat",
    body: "Take your whole hand off the strings, shake it out, then put the chord back down from nothing. Repeat the cycle 5 times — building the muscle memory of finding the shape cleanly.",
  },
];

function viewPractice(key) {
  const wrap = el("section", { class: "page practice" });
  wrap.appendChild(
    pageHead(
      "Perfect Chord Practice",
      "Lock in a single chord with a focused four‑step loop. Choose a chord, then walk through each step."
    )
  );

  const selected = CHORDS[key] ? key : Object.keys(CHORDS)[0];

  const picker = el("div", { class: "picker reveal" });
  picker.appendChild(el("label", { class: "picker__label", for: "practice-chord" }, "Chord"));
  picker.appendChild(chordSelect("practice-chord", selected, (v) => (location.hash = `#/practice/${v}`)));
  wrap.appendChild(picker);

  const panel = el("div", { class: "practice-panel reveal" });
  panel.appendChild(
    el("div", { class: "practice-diagram" }, renderChordDiagram(CHORDS[selected], { size: 1.7 }), el("p", { class: "practice-diagram__name" }, CHORDS[selected].label))
  );

  // stepper
  const stepWrap = el("div", { class: "stepper" });
  let active = 0;
  const dots = [];
  const render = () => {
    stepWrap.innerHTML = "";
    const nav = el("div", { class: "stepper__nav" });
    PRACTICE_STEPS.forEach((s, i) => {
      const dot = el(
        "button",
        {
          class: "stepper__tab" + (i === active ? " is-active" : "") + (i < active ? " is-done" : ""),
          onclick: () => {
            active = i;
            render();
          },
        },
        el("span", { class: "stepper__no" }, String(i + 1)),
        el("span", { class: "stepper__name" }, s.title)
      );
      dots.push(dot);
      nav.appendChild(dot);
    });
    stepWrap.appendChild(nav);

    const cur = PRACTICE_STEPS[active];
    stepWrap.appendChild(
      el(
        "div",
        { class: "step-body" },
        el("p", { class: "step-body__count" }, `Step ${active + 1} of ${PRACTICE_STEPS.length}`),
        el("h3", { class: "step-body__title" }, cur.title),
        el("p", { class: "step-body__text" }, cur.body),
        el(
          "div",
          { class: "step-body__controls" },
          el(
            "button",
            { class: "btn btn--ghost", disabled: active === 0 ? "" : null, onclick: () => { active = Math.max(0, active - 1); render(); } },
            "← Back"
          ),
          active < PRACTICE_STEPS.length - 1
            ? el("button", { class: "btn btn--solid", onclick: () => { active++; render(); } }, "Next step →")
            : el("button", { class: "btn btn--solid", onclick: () => { active = 0; render(); } }, "Run it again ↻")
        )
      )
    );
  };
  render();
  panel.appendChild(stepWrap);
  wrap.appendChild(panel);

  app.appendChild(wrap);
  stagger();
}

// ---------------------------------------------------------------------------
// One Minute Changes
// ---------------------------------------------------------------------------
function viewChanges() {
  const wrap = el("section", { class: "page changes" });
  wrap.appendChild(
    pageHead(
      "One Minute Changes",
      "Pick two chords and switch back and forth as many times as you can in 60 seconds. Press Space to start; a buzzer stops you. Tap your count as you go (or press C)."
    )
  );

  const keys = Object.keys(CHORDS);
  let a = keys[0];
  let b = keys[1];

  const pickers = el("div", { class: "changes-pickers reveal" });
  pickers.appendChild(picker("From", "ch-a", a, (v) => { a = v; refresh(); }));
  pickers.appendChild(el("span", { class: "changes-arrow" }, "⇄"));
  pickers.appendChild(picker("To", "ch-b", b, (v) => { b = v; refresh(); }));
  wrap.appendChild(pickers);

  const stage = el("div", { class: "changes-stage reveal" });
  wrap.appendChild(stage);

  function picker(labelText, id, val, onchange) {
    return el("div", { class: "picker" }, el("label", { class: "picker__label", for: id }, labelText), chordSelect(id, val, onchange));
  }

  // --- timer state ---
  const DURATION = 60;
  let remaining = DURATION;
  let count = 0;
  let timerId = null;
  let running = false;
  let micOn = false;

  function refresh() {
    stage.innerHTML = "";
    stage.appendChild(
      el(
        "div",
        { class: "changes-pair" },
        diagramBlock(a),
        el("div", { class: "changes-swap" }, "⇄"),
        diagramBlock(b)
      )
    );

    const clock = el("div", { class: "clock" }, el("span", { class: "clock__time", id: "clock-time" }, fmt(remaining)));
    const counter = el(
      "button",
      { class: "counter", id: "counter", title: "Tap to count a change (or press C)", onclick: bumpCount },
      el("span", { class: "counter__num", id: "counter-num" }, String(count)),
      el("span", { class: "counter__lbl" }, "changes")
    );

    const controls = el(
      "div",
      { class: "changes-controls" },
      el("button", { class: "btn btn--solid", id: "start-btn", onclick: toggle }, running ? "Stop" : "Start  ⏎"),
      el("button", { class: "btn btn--ghost", onclick: reset }, "Reset")
    );

    stage.appendChild(el("div", { class: "changes-meters" }, clock, counter));
    stage.appendChild(controls);
    // --- microphone auto-count ---
    if (Mic.supported) {
      const meterFill = el("span", { class: "mic-meter__fill", id: "mic-fill" });
      const micBtn = el(
        "button",
        {
          class: "mic-toggle" + (micOn ? " is-on" : ""),
          id: "mic-btn",
          onclick: toggleMic,
        },
        el("span", { class: "mic-toggle__dot" }),
        micOn ? "Listening — auto-counting strums" : "🎤 Auto-count with microphone"
      );
      stage.appendChild(
        el(
          "div",
          { class: "mic" + (micOn ? " is-on" : "") },
          micBtn,
          el("div", { class: "mic-meter", title: "Input level" }, meterFill)
        )
      );
    }

    stage.appendChild(
      el(
        "p",
        { class: "changes-hint" },
        "Tip: press ",
        el("kbd", {}, "Space"),
        " to start/stop and ",
        el("kbd", {}, "C"),
        " to count. ",
        el(
          "span",
          { class: "soon" },
          Mic.supported
            ? "Or let the mic count for you — it listens for strums and bumps the counter while the timer runs."
            : "Automatic mic counting isn't available in this browser."
        )
      )
    );
  }

  async function toggleMic() {
    if (Mic.active) {
      Mic.stop();
      micOn = false;
      refresh();
      return;
    }
    const btn = document.getElementById("mic-btn");
    try {
      if (btn) btn.classList.add("is-loading");
      await Mic.start({
        onOnset: () => bumpCount(),
        onLevel: (lvl) => {
          const f = document.getElementById("mic-fill");
          if (f) f.style.transform = `scaleX(${lvl.toFixed(3)})`;
        },
      });
      micOn = true;
    } catch (e) {
      micOn = false;
      alert("Couldn't access the microphone. Check your browser's mic permission and try again.");
    }
    refresh();
  }

  function diagramBlock(key) {
    return el("div", { class: "changes-diagram" }, renderChordDiagram(CHORDS[key], { size: 1.5 }), el("p", { class: "changes-diagram__name" }, CHORDS[key].label));
  }

  function fmt(s) {
    const m = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, "0");
    return `${m}:${ss}`;
  }

  function setClock() {
    const t = document.getElementById("clock-time");
    if (t) t.textContent = fmt(remaining);
  }
  function setCount() {
    const c = document.getElementById("counter-num");
    if (c) c.textContent = String(count);
  }

  function bumpCount() {
    if (!running) return;
    count++;
    setCount();
    const c = document.getElementById("counter");
    if (c) {
      c.classList.remove("pulse");
      void c.offsetWidth;
      c.classList.add("pulse");
    }
  }

  function toggle() {
    running ? stop(true) : start();
  }

  function start() {
    if (running) return;
    if (remaining <= 0) remaining = DURATION;
    running = true;
    document.getElementById("start-btn").textContent = "Stop";
    document.body.classList.add("is-drilling");
    Sound.tick(); // confirmation blip
    timerId = setInterval(() => {
      remaining--;
      setClock();
      if (remaining <= 3 && remaining > 0) Sound.tick();
      if (remaining <= 0) finish();
    }, 1000);
  }

  function stop(reset_clock) {
    running = false;
    clearInterval(timerId);
    timerId = null;
    const btn = document.getElementById("start-btn");
    if (btn) btn.textContent = "Start  ⏎";
    document.body.classList.remove("is-drilling");
  }

  function finish() {
    stop();
    Sound.buzzer();
    const counter = document.getElementById("counter");
    if (counter) counter.classList.add("done");
  }

  function reset() {
    stop();
    remaining = DURATION;
    count = 0;
    setClock();
    setCount();
    const counter = document.getElementById("counter");
    if (counter) counter.classList.remove("done");
  }

  // keyboard
  const onKey = (e) => {
    if (!location.hash.startsWith("#/changes")) {
      document.removeEventListener("keydown", onKey);
      return;
    }
    if (e.target.tagName === "SELECT") return;
    if (e.code === "Space") {
      e.preventDefault();
      toggle();
    } else if (e.key.toLowerCase() === "c") {
      e.preventDefault();
      bumpCount();
    }
  };
  document.addEventListener("keydown", onKey);

  // release the mic when navigating away from this view
  const onLeave = () => {
    if (!location.hash.startsWith("#/changes")) {
      Mic.stop();
      window.removeEventListener("hashchange", onLeave);
    }
  };
  window.addEventListener("hashchange", onLeave);

  refresh();
  app.appendChild(wrap);
  stagger();
}

// ---------------------------------------------------------------------------
// Shared UI bits
// ---------------------------------------------------------------------------
function chordSelect(id, value, onchange) {
  const sel = el("select", { id, class: "select", onchange: (e) => onchange(e.target.value) });
  Object.keys(CHORDS).forEach((k) => {
    const o = el("option", { value: k }, CHORDS[k].label);
    if (k === value) o.selected = true;
    sel.appendChild(o);
  });
  return sel;
}

function pageHead(title, lead) {
  return el(
    "header",
    { class: "page-head" },
    el("h1", { class: "page-head__title reveal" }, title),
    lead ? el("p", { class: "page-head__lead reveal" }, lead) : null
  );
}

// Reveal-on-load stagger
function stagger() {
  const items = app.querySelectorAll(".reveal");
  items.forEach((it, i) => {
    it.style.setProperty("--d", `${Math.min(i * 60, 600)}ms`);
    requestAnimationFrame(() => it.classList.add("in"));
  });
}

// ---------------------------------------------------------------------------
// Sound — Web Audio, no asset files
// ---------------------------------------------------------------------------
const Sound = (() => {
  let ctx;
  const ac = () => (ctx ||= new (window.AudioContext || window.webkitAudioContext)());

  function beep(freq, dur, when = 0, type = "sine", gain = 0.15) {
    const c = ac();
    const t = c.currentTime + when;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  return {
    tick() {
      try { beep(880, 0.08, 0, "triangle", 0.08); } catch (e) {}
    },
    buzzer() {
      try {
        // three rising urgent tones
        beep(440, 0.18, 0, "sawtooth", 0.18);
        beep(660, 0.18, 0.2, "sawtooth", 0.18);
        beep(880, 0.45, 0.4, "sawtooth", 0.2);
      } catch (e) {}
    },
  };
})();

// ---------------------------------------------------------------------------
// Mic — strum onset detection for automatic change counting.
//
// We don't need to recognise the chord; we only need to detect *that* a strum
// happened. A strum is a sudden broadband burst of energy, so we watch for
// spikes in spectral flux (the frame-to-frame rise in the magnitude spectrum)
// over an adaptive baseline, with a refractory window so one strum counts once.
// ---------------------------------------------------------------------------
const Mic = (() => {
  let ctx, stream, source, analyser, raf;
  let prevSpec = null;
  let baseline = 0; // rolling average of flux, our adaptive noise floor
  let lastOnset = 0;
  let onOnset = null;
  let onLevel = null;

  const REFRACTORY_MS = 220; // ignore retriggers within this window
  const MIN_FLUX = 0.012; // absolute floor so quiet rooms don't self-trigger
  const FACTOR = 2.6; // flux must exceed baseline by this multiple

  function loop() {
    raf = requestAnimationFrame(loop);
    const bins = analyser.frequencyBinCount;
    const spec = new Float32Array(bins);
    analyser.getFloatFrequencyData(spec); // dBFS, ~ -140..0

    // spectral flux: sum of positive changes, normalised per bin into 0..1-ish
    let flux = 0;
    let level = 0;
    for (let i = 0; i < bins; i++) {
      const cur = (spec[i] + 140) / 140; // -> 0..1
      level += cur;
      if (prevSpec) {
        const d = cur - prevSpec[i];
        if (d > 0) flux += d;
      }
      if (!prevSpec) prevSpec = new Float32Array(bins);
      prevSpec[i] = cur;
    }
    flux /= bins;
    level /= bins;

    if (onLevel) onLevel(Math.min(1, level * 1.6));

    const now = performance.now();
    const isOnset =
      flux > MIN_FLUX &&
      flux > baseline * FACTOR &&
      now - lastOnset > REFRACTORY_MS;

    if (isOnset) {
      lastOnset = now;
      if (onOnset) onOnset();
    } else {
      // only let the baseline drift on non-onset frames
      baseline = baseline * 0.92 + flux * 0.08;
    }
  }

  async function start(handlers = {}) {
    onOnset = handlers.onOnset || null;
    onLevel = handlers.onLevel || null;
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") await ctx.resume();
    source = ctx.createMediaStreamSource(stream);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0;
    source.connect(analyser);
    prevSpec = null;
    baseline = 0;
    lastOnset = 0;
    loop();
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    try { source && source.disconnect(); } catch (e) {}
    try { stream && stream.getTracks().forEach((t) => t.stop()); } catch (e) {}
    try { ctx && ctx.close(); } catch (e) {}
    ctx = stream = source = analyser = null;
    prevSpec = null;
    onOnset = onLevel = null;
  }

  return {
    start,
    stop,
    get active() { return !!raf; },
    supported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
  };
})();
