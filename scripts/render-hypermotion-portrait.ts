/**
 * Render Hypermotion Portrait → MP4
 *
 * Opens public/ads/hypermotion-portrait.html in headless Chrome via puppeteer-core,
 * scrolls through every section capturing frames at 24fps, then encodes an MP4
 * with ffmpeg. Portrait 9:16 aspect ratio (1080×1920).
 *
 * Usage:  bun run scripts/render-hypermotion-portrait.ts
 * Output: public/ads/hypermotion-portrait.mp4
 */

import puppeteer from "puppeteer-core";
import { mkdirSync, existsSync, rmSync, statSync } from "fs";
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const ADS_DIR = path.join(PROJECT_ROOT, "public", "ads");
const FRAMES_DIR = path.join(ADS_DIR, "_frames_portrait");
const OUTPUT_VIDEO = path.join(ADS_DIR, "hypermotion-portrait.mp4");

const CHROME_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const VIEWPORT = { width: 1080, height: 1920 };
const FPS = 24;
const FRAME_INTERVAL_MS = Math.floor(1000 / FPS); // ~41.7ms
const SCROLL_DURATION_MS = 32000; // ~32 seconds of scrolling (portrait is taller)
const INTRO_DELAY_MS = 2000; // Wait for hero animations before scrolling

// Clean and create frames directory
if (existsSync(FRAMES_DIR)) {
  rmSync(FRAMES_DIR, { recursive: true, force: true });
}
mkdirSync(FRAMES_DIR, { recursive: true });

console.log("🚀 Launching headless Chrome (portrait 1080x1920)...");
const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  defaultViewport: VIEWPORT,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--autoplay-policy=no-user-gesture-required",
  ],
});

const page = await browser.newPage();

// Calculate total page height
const htmlPath = path.join(ADS_DIR, "hypermotion-portrait.html");
const fileUrl = `file://${htmlPath.replace(/\\/g, "/")}`;
console.log(`📄 Opening ${fileUrl}`);
await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 30000 });

// Wait for initial render and animations
await page.waitForSelector("#hero", { timeout: 10000 });
console.log("⏳ Waiting for intro animations...");
await new Promise((r) => setTimeout(r, INTRO_DELAY_MS));

// Get total page height
const pageHeight = await page.evaluate(() =>
  Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    document.documentElement.offsetHeight
  )
);
console.log(`📏 Page height: ${pageHeight}px`);

// Calculate number of frames and scroll increment
const totalFrames = Math.floor(SCROLL_DURATION_MS / FRAME_INTERVAL_MS);
const scrollIncrement = (pageHeight - VIEWPORT.height) / totalFrames;
console.log(
  `🎞️ Capturing ${totalFrames} frames at ${FPS}fps over ${SCROLL_DURATION_MS / 1000}s`
);
console.log(`   Scroll increment: ${scrollIncrement.toFixed(2)}px/frame`);

// Capture frames while scrolling
let capturedFrames = 0;

for (let i = 0; i < totalFrames; i++) {
  const currentScroll = Math.min(scrollIncrement * i, pageHeight - VIEWPORT.height);
  await page.evaluate((y) => window.scrollTo(0, y), currentScroll);

  // Small delay for render
  await new Promise((r) => setTimeout(r, 10));

  // Capture screenshot
  const framePath = path.join(
    FRAMES_DIR,
    `frame-${String(i).padStart(5, "0")}.png`
  );
  await page.screenshot({ path: framePath });
  capturedFrames++;

  if (capturedFrames % 100 === 0) {
    console.log(`  📸 Captured ${capturedFrames}/${totalFrames} frames`);
  }
}

await browser.close();
console.log(`✅ Captured ${capturedFrames} frames total`);

// Encode video with ffmpeg
console.log("🎬 Encoding MP4 video with ffmpeg...");

const result = spawnSync("ffmpeg", [
  "-y",
  "-framerate",
  String(FPS),
  "-i",
  path.join(FRAMES_DIR, "frame-%05d.png"),
  "-c:v",
  "libx264",
  "-preset",
  "slow",  // slower preset for better compression at 24fps
  "-crf",
  "18",
  "-pix_fmt",
  "yuv420p",
  "-vf",
  "pad=ceil(iw/2)*2:ceil(ih/2)*2",
  OUTPUT_VIDEO,
], {
  stdio: "inherit",
  timeout: 180000,
});

if (result.status === 0) {
  console.log(`✅ Video created: ${OUTPUT_VIDEO}`);

  // Clean up frames
  rmSync(FRAMES_DIR, { recursive: true, force: true });
  console.log("🧹 Cleaned up temporary frames");

  // Show file size
  const stats = existsSync(OUTPUT_VIDEO) ? statSync(OUTPUT_VIDEO) : null;
  if (stats) {
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📦 File size: ${sizeMB} MB`);
  }
} else {
  console.error("❌ FFmpeg encoding failed");
  process.exit(1);
}

console.log("✨ Done! Portrait hypermotion video is ready.");
