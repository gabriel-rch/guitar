// Chord data repository.
// Strings are listed low-E (6th) to high-e (1st), i.e. the order you see them
// left-to-right on a standard chord diagram.
//   frets:   "x" = don't play, 0 = open string, n = press at fret n
//   fingers: 1=index, 2=middle, 3=ring, 4=pinky, null = not fretted
//   baseFret: lowest fret shown in the diagram (1 means the nut is drawn)

const CHORDS = {
  A: {
    name: "A",
    label: "A Major",
    family: "major",
    frets: ["x", 0, 2, 2, 2, 0],
    fingers: [null, null, 1, 2, 3, null],
    baseFret: 1,
    tip: "Cram fingers 1‑2‑3 into the 2nd fret on the D, G and B strings. Keep them arched so the high E rings out.",
  },
  D: {
    name: "D",
    label: "D Major",
    family: "major",
    frets: ["x", "x", 0, 2, 3, 2],
    fingers: [null, null, null, 1, 3, 2],
    baseFret: 1,
    tip: "Three fingers form a little triangle. Only strum from the open D string downward.",
  },
  E: {
    name: "E",
    label: "E Major",
    family: "major",
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [null, 2, 3, 1, null, null],
    baseFret: 1,
    tip: "A big, full chord — strum all six strings. Finger 1 goes on the 3rd (G) string, 1st fret.",
  },
  Em: {
    name: "Em",
    label: "E Minor",
    family: "minor",
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
    baseFret: 1,
    tip: "The friendliest first chord. Two fingers, strum all six strings.",
  },
  Am: {
    name: "Am",
    label: "A Minor",
    family: "minor",
    frets: ["x", 0, 2, 2, 1, 0],
    fingers: [null, null, 2, 3, 1, null],
    baseFret: 1,
    tip: "Same shape as E major, moved over one string set. Don't strum the low E.",
  },
  Dm: {
    name: "Dm",
    label: "D Minor",
    family: "minor",
    frets: ["x", "x", 0, 2, 3, 1],
    fingers: [null, null, null, 2, 3, 1],
    baseFret: 1,
    tip: "A moody, soft chord. Start strumming from the open D string.",
  },
  C: {
    name: "C",
    label: "C Major",
    family: "major",
    frets: ["x", 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    baseFret: 1,
    tip: "Stretch finger 3 up to the 3rd fret on the A string. Keep fingers arched so open strings ring.",
  },
  G: {
    name: "G",
    label: "G Major",
    family: "major",
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, null, null, null, 3],
    baseFret: 1,
    tip: "Spread fingers 2‑1‑3 across the outer strings. A big, ringing chord — strum all six.",
  },
  E7: {
    name: "E7",
    label: "E Dominant 7",
    family: "dominant7",
    frets: [0, 2, 0, 1, 0, 0],
    fingers: [null, 2, null, 1, null, null],
    baseFret: 1,
    tip: "Like E major but lift finger 3 — leaving the D string open gives it that bluesy 7th flavour.",
  },
  A7: {
    name: "A7",
    label: "A Dominant 7",
    family: "dominant7",
    frets: ["x", 0, 2, 0, 2, 0],
    fingers: [null, null, 2, null, 3, null],
    baseFret: 1,
    tip: "An easy two‑finger chord. Don't play the low E string.",
  },
  D7: {
    name: "D7",
    label: "D Dominant 7",
    family: "dominant7",
    frets: ["x", "x", 0, 2, 1, 2],
    fingers: [null, null, null, 2, 1, 3],
    baseFret: 1,
    tip: "A tidy little cluster. Strum from the open D string down.",
  },
};

// Standard string names, low to high, matching the data order above.
const STRING_NAMES = ["E", "A", "D", "G", "B", "e"];
