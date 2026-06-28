// Renders a standard chord-box diagram as an SVG element.
// Usage: el.appendChild(renderChordDiagram(CHORDS.A, { size: 1 }));

function renderChordDiagram(chord, opts = {}) {
  const SVG = "http://www.w3.org/2000/svg";
  const scale = opts.size || 1;

  const STRINGS = 6;
  const FRETS = 5; // number of fret cells shown

  // Geometry (unscaled units)
  const padX = 26;
  const padTop = 40; // room for the X/O markers and base-fret label
  const padBottom = 26; // room for string-name labels
  const cellW = 26;
  const cellH = 30;
  const gridW = cellW * (STRINGS - 1);
  const gridH = cellH * FRETS;
  const W = gridW + padX * 2;
  const H = gridH + padTop + padBottom;

  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("width", W * scale);
  svg.setAttribute("height", H * scale);
  svg.setAttribute("class", "chord-diagram");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${chord.label} chord diagram`);

  const ns = (tag, attrs) => {
    const e = document.createElementNS(SVG, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  };

  const x = (s) => padX + s * cellW; // string index 0..5 (low E -> high e)
  const y = (f) => padTop + f * cellH; // fret line index 0..FRETS

  const base = chord.baseFret || 1;
  const nutVisible = base === 1;

  // Nut (thick) or top fret line
  if (nutVisible) {
    svg.appendChild(
      ns("rect", { x: x(0) - 1, y: padTop - 4, width: gridW + 2, height: 4, class: "cd-nut" })
    );
  }

  // Fret lines
  for (let f = 0; f <= FRETS; f++) {
    svg.appendChild(
      ns("line", { x1: x(0), y1: y(f), x2: x(STRINGS - 1), y2: y(f), class: "cd-fret" })
    );
  }
  // String lines
  for (let s = 0; s < STRINGS; s++) {
    svg.appendChild(
      ns("line", { x1: x(s), y1: y(0), x2: x(s), y2: y(FRETS), class: "cd-string" })
    );
  }

  // Base-fret label when not starting at the nut
  if (!nutVisible) {
    const lbl = ns("text", { x: x(0) - 12, y: y(0) + cellH * 0.7, class: "cd-basefret" });
    lbl.textContent = base + "fr";
    svg.appendChild(lbl);
  }

  // Markers above the nut + dots
  for (let s = 0; s < STRINGS; s++) {
    const fret = chord.frets[s];
    const topY = padTop - 16;

    if (fret === "x") {
      const t = ns("text", { x: x(s), y: topY, class: "cd-mark cd-mute" });
      t.textContent = "×";
      svg.appendChild(t);
    } else if (fret === 0) {
      svg.appendChild(ns("circle", { cx: x(s), cy: topY - 4, r: 5, class: "cd-open" }));
    } else {
      const rel = fret - base + 1; // 1-based cell from top of the shown window
      const cy = y(rel) - cellH / 2;
      svg.appendChild(ns("circle", { cx: x(s), cy, r: 10, class: "cd-dot" }));
      const fnum = chord.fingers[s];
      if (fnum) {
        const t = ns("text", { x: x(s), y: cy, class: "cd-finger" });
        t.textContent = fnum;
        svg.appendChild(t);
      }
    }
  }

  // String name labels along the bottom
  for (let s = 0; s < STRINGS; s++) {
    const t = ns("text", { x: x(s), y: y(FRETS) + 16, class: "cd-strlabel" });
    t.textContent = STRING_NAMES[s];
    svg.appendChild(t);
  }

  return svg;
}
