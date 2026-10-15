> Historical funathon concept. The active product is now physical compression to PNG with one hydraulic press. See README.md for current behavior, setup, limits and tests. The archive-compression roadmap below is retained for reference only.

# 🗜️💥 CRUSHR 9000 — The Most Dramatic File Compressor Ever Built

> *"Why compress a file quietly when you can destroy it with a hydraulic press first?"*

**Hackathon Track:** Useless Projects
**Tagline:** Your file gets smaller. Your dignity does not.
**Real compression ratio:** Surprisingly decent (it's just ZIP/gzip under the hood).
**Entertainment ratio:** Infinite.

---

## 1. The Idea

CRUSHR 9000 is a web-based file compressor. You drag a file in. Instead of a boring progress bar, you watch your file get **brutally, theatrically destroyed** by a machine chosen specifically for that file type. When the carnage ends, you download a (genuinely) compressed file.

Every file type gets its own unique, ridiculous torture chamber. Because a PDF deserves a different fate than a JPEG.

---

## 2. The Torture Chambers (Animation Per File Type)

| File Type | Machine | Animation Description | Funny Caption |
|---|---|---|---|
| **PDF** | 🏭 Hydraulic Press | Giant press descends slowly, PDF pages scream "NOT THE MARGINS!", squishes into a thin sheet with ink splatter | *"Portable? Not anymore."* |
| **Word (.doc/.docx)** | 🐘 Elephant Stomp | A cartoon elephant stomps the doc; Clippy cameo begs for mercy | *"It looks like you're trying to survive. Not today."* |
| **Excel (.xls/.xlsx)** | 🪨 Wrecking Ball | Cells shatter into flying numbers, a single `#REF!` floats away sadly | *"Pivot table? More like pivot to rubble."* |
| **PowerPoint (.ppt/.pptx)** | 🚀 Rocket Launch | Slides stacked on a rocket, launched into space, return as a tiny pellet | *"Death by PowerPoint, reversed."* |
| **Images (.jpg/.png/.gif)** | 🥤 Juicer | Pixels squeezed through a juicer, pixel juice drips into a cup | *"Freshly squeezed pixels."* |
| **Video (.mp4/.mov/.mkv)** | 🧻 Trash Compactor | Film reel gets crushed by walls closing in, Star-Wars style | *"Don't worry, it's just a 4K movie."* |
| **Audio (.mp3/.wav)** | 🎸 Steamroller | Sound waves flattened into a straight line, a sad "womp womp" plays | *"Bass: removed."* |
| **Code (.js/.py/.java)** | 🐛 Bug Zapper | Code lines fly into a zapper, bugs and semicolons fry together | *"Fixed all bugs by deleting everything."* |
| **Text (.txt/.md)** | 🔥 Shredder | Paper strips through an office shredder, confetti everywhere | *"This file has been 'reviewed'."* |
| **Archives (.zip/.rar)** | 🪆 Matryoshka Smash | Smash a zip, a smaller zip pops out, repeat 5 times, tiny zip at the end | *"Compressing a compressed file. Bold."* |
| **Executables (.exe)** | 💣 Piñata | Hit with a bat, candy spills out (actually bytes) | *"Viruses not included."* |
| **Fonts / unknown** | 🕳️ Black Hole | File gets sucked into a singularity, spat out smaller | *"We don't know what this is. Into the void."* |
| **Giant files (>100MB)** | 🌋 Volcano | Sacrificed into a volcano, returns as obsidian | *"The gods accept your offering."* |
| **Empty / tiny files** | 🔬 Tweezers | Tiny tweezers carefully pick at a 3-byte file | *"Compressing nothing since 2026."* |

---

## 3. Tech Stack

- **Frontend:** React + Vite (or plain HTML/JS if time is short)
- **Animation:** Lottie / GSAP / CSS keyframes + Canvas for particle effects
- **Sound:** Howler.js (crunch, squish, boing, sad trombone)
- **Compression:** `fflate` or `pako` (in-browser gzip/zip) — no server needed!
- **File type detection:** file extension + MIME type + `file-type` npm package (magic bytes)
- **Optional backend:** Node.js + Express with `archiver` for heavy files
- **Hosting:** Vercel / Netlify / GitHub Pages

---

## 4. Features

### Core
- [ ] Drag & drop upload zone (with a wobbling, nervous-looking file icon)
- [ ] Auto-detect file type
- [ ] Pick the matching torture machine
- [ ] Play animation while *actually* compressing in the background
- [ ] Download the compressed file (`yourfile.crushed.zip`)
- [ ] Show before/after size with dramatic stats

### Ridiculous Extras
- [ ] **Pain Meter:** Shows how much the file "suffered" (0–100%)
- [ ] **Fake Progress Bar:** Goes to 99%, stays for 10 seconds, then jumps back to 42%
- [ ] **Screaming Files:** Text-to-speech or sound effect of file screaming (can be muted)
- [ ] **Funeral Mode:** After compression, a tiny funeral plays for the original file ("Here lies report_final_v7_REAL.pdf")
- [ ] **Compression Insurance:** Pay $0 to "protect" your file from the crush (always fails)
- [ ] **Certificate of Destruction:** Downloadable fake PDF certificate
- [ ] **Leaderboard:** "Most Violently Compressed File Today"
- [ ] **Random Mode:** Roulette wheel picks a random machine
- [ ] **Mercy Button:** Click it and the machine pauses for 1 second, then continues anyway
- [ ] **Therapy Mode:** Compressed file gets a motivational quote ("You're small, but you matter.")
- [ ] **Achievement Unlocked popups:** "Crushed 10 PDFs", "Destroyed a Resume"

---

## 5. Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────┐
│  Drop Zone   │ ──▶ │ File Type Router │ ──▶ │ Animation     │
└──────────────┘     └──────────────────┘     │ Scene (per    │
                              │               │ type)         │
                              ▼               └───────┬───────┘
                     ┌──────────────────┐             │
                     │ Compression Core │ ◀───────────┘
                     │ (fflate / pako)  │   (runs in parallel)
                     └────────┬─────────┘
                              ▼
                     ┌──────────────────┐
                     │ Results Screen   │
                     │ + Download + 🎉  │
                     └──────────────────┘
```

### Suggested Folder Structure

```
crushr-9000/
├── public/
│   └── sounds/            # crunch.mp3, scream.mp3, sad-trombone.mp3
├── src/
│   ├── components/
│   │   ├── DropZone.jsx
│   │   ├── ResultsScreen.jsx
│   │   ├── PainMeter.jsx
│   │   └── FuneralScene.jsx
│   ├── scenes/            # one per file type
│   │   ├── HydraulicPress.jsx
│   │   ├── ElephantStomp.jsx
│   │   ├── WreckingBall.jsx
│   │   ├── RocketLaunch.jsx
│   │   ├── Juicer.jsx
│   │   ├── TrashCompactor.jsx
│   │   ├── Steamroller.jsx
│   │   ├── BugZapper.jsx
│   │   ├── Shredder.jsx
│   │   ├── Matryoshka.jsx
│   │   ├── Pinata.jsx
│   │   ├── BlackHole.jsx
│   │   └── Volcano.jsx
│   ├── utils/
│   │   ├── detectType.js
│   │   ├── compress.js
│   │   └── captions.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

---

## 6. Key Code Sketches

### File type → scene router

```js
// utils/detectType.js
const MAP = {
  pdf: 'HydraulicPress',
  doc: 'ElephantStomp', docx: 'ElephantStomp',
  xls: 'WreckingBall', xlsx: 'WreckingBall',
  ppt: 'RocketLaunch', pptx: 'RocketLaunch',
  jpg: 'Juicer', jpeg: 'Juicer', png: 'Juicer', gif: 'Juicer',
  mp4: 'TrashCompactor', mov: 'TrashCompactor', mkv: 'TrashCompactor',
  mp3: 'Steamroller', wav: 'Steamroller',
  js: 'BugZapper', py: 'BugZapper', java: 'BugZapper',
  txt: 'Shredder', md: 'Shredder',
  zip: 'Matryoshka', rar: 'Matryoshka',
  exe: 'Pinata',
};

export function pickScene(file) {
  if (file.size > 100 * 1024 * 1024) return 'Volcano';
  if (file.size < 10) return 'Tweezers';
  const ext = file.name.split('.').pop().toLowerCase();
  return MAP[ext] || 'BlackHole';
}
```

### Real compression (in-browser)

```js
// utils/compress.js
import { zipSync } from 'fflate';

export async function compress(file) {
  const buf = new Uint8Array(await file.arrayBuffer());
  const zipped = zipSync({ [file.name]: buf }, { level: 9 });
  return new Blob([zipped], { type: 'application/zip' });
}
```

### Run animation and compression together

```js
async function handleFile(file) {
  const scene = pickScene(file);
  setScene(scene);                       // starts the animation
  const [blob] = await Promise.all([
    compress(file),
    sleep(6000),                         // minimum drama time
  ]);
  setResult({ blob, before: file.size, after: blob.size });
}
```

### Fake progress bar

```js
// Reaches 99%, panics, drops to 42%, then finishes
const keyframes = [0, 30, 70, 99, 99, 99, 42, 60, 100];
```

---

## 7. Animation Implementation Tips

- **Hydraulic press:** Two CSS `translateY` transitions + `scaleY` squash on the file icon. Add screen-shake via a `@keyframes shake` on the container.
- **Particle effects:** Use `canvas-confetti` for shredder/piñata; custom canvas for juice drops and pixel debris.
- **Sound sync:** Trigger crunch sound exactly at the frame where the press touches the file.
- **Lottie:** Grab free animations from LottieFiles and swap in for elephants/rockets if drawing from scratch is too slow.
- **Time-saver:** Start with 3 scenes (Press, Shredder, Black Hole) as MVP. Add the rest as time permits.

---

## 8. 24-Hour Hackathon Timeline

| Hours | Task |
|---|---|
| 0–2 | Set up Vite + React, drop zone, file detection |
| 2–4 | Real compression with fflate + download button |
| 4–10 | Build 3 MVP scenes (Press, Shredder, Black Hole) |
| 10–14 | Add Pain Meter, captions, sound effects |
| 14–18 | Build remaining scenes (Elephant, Rocket, Juicer…) |
| 18–21 | Extras: Funeral Mode, Certificate, Achievements |
| 21–23 | Polish, bug fixes, deploy |
| 23–24 | Record demo video, write pitch |

---

## 9. Demo Pitch Script (60 seconds)

> "Ever compressed a file and thought, *this is far too peaceful*? Meet **CRUSHR 9000**. Drop in a PDF — watch a hydraulic press flatten it. Drop in a Word doc — an elephant stomps on it. Spreadsheet? Wrecking ball. Every file type gets a unique, completely unnecessary death. And yes, it actually compresses your files. Our compression ratio is real. Our dignity is not. CRUSHR 9000 — because efficiency is boring."

---

## 10. Judging Angles (Useless Project Track)

- ✅ **Uselessness:** Takes 10x longer than a normal compressor
- ✅ **Over-engineering:** 13 bespoke animation scenes for a solved problem
- ✅ **Humor:** Funeral mode, fake progress bar, mercy button that lies
- ✅ **Actually works:** Real downloadable compressed output
- ✅ **Demo-ability:** Instantly understandable and shareable

---

## 11. Stretch Goals

- 🎮 Let the user *control* the press with the mouse
- 📱 Mobile shake-to-crush
- 🔊 Voice commands: "CRUSH IT"
- 🧑‍🤝‍🧑 Multiplayer: two people crush files, highest damage wins
- 🤖 AI-generated eulogy for each file (using Claude API)
- 🥚 Easter egg: Upload a `.crushr` file and the machine refuses, saying "I can't crush myself."

---

## 12. Getting Started

```bash
npm create vite@latest crushr-9000 -- --template react
cd crushr-9000
npm install fflate howler gsap canvas-confetti file-type
npm run dev
```

---

**Now go forth and crush responsibly. Or irresponsibly. It's a useless hackathon.** 🛠️💥
