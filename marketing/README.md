# Water Classroom — Marketing

Remotion video compositions and marketing asset generators for Water Classroom.

## Setup

```bash
cd marketing
bun install
```

## Usage

### Remotion Video Ads

Open the Remotion Studio for live preview:

```bash
bun run studio
```

Render final MP4 videos:

```bash
bun run render:landscape   # 1920×1080 → ../public/ads/remotion-landscape.mp4
bun run render:portrait    # 1080×1920 → ../public/ads/remotion-portrait.mp4
bun run render:ads         # Both
```

### Hypermotion Videos (Puppeteer + ffmpeg)

These scripts scroll through the HTML ad pages, capture frames, and encode MP4s. Requires Chrome and ffmpeg on PATH.

```bash
bun run render:hypermotion           # Landscape → ../public/ads/hypermotion.mp4
bun run render:hypermotion:portrait  # Portrait → ../public/ads/hypermotion-portrait.mp4
```

### Pitch Deck PDF

Generate a branded PDF from `pitch-deck.html`:

```bash
bun run generate-pdf   # → pitch-deck.pdf
```

## Structure

```
index.ts              — Remotion entry (registerRoot)
Root.tsx              — Composition definitions (landscape + portrait)
WaterClassroomAd.tsx  — Main ad component (7-scene sequence)
Scenes.tsx            — All scene components
theme.ts              — Colors, fonts, timing constants
FontLoader.tsx        — Font loading wrapper
Voiceover.tsx         — Audio crossfade layer
render-hypermotion*.ts — Puppeteer frame-capture renderers
generate-pdf.ts       — Pitch deck PDF generator
pitch-deck.html       — Source HTML for PDF
```
