/**
 * Generate a branded PDF of the Water Classroom Investor Pitch Deck.
 * Uses puppeteer-core with the system-installed Chrome browser.
 *
 * Usage:
 *   bun run scripts/generate-pdf.ts
 *
 * Output: pitch-deck.pdf
 */

import puppeteer from "puppeteer-core";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const HTML_FILE = path.resolve(process.cwd(), "pitch-deck.html");
const PDF_FILE = path.resolve(process.cwd(), "pitch-deck.pdf");

function findChrome(): string {
  const commonPaths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  for (const p of commonPaths) {
    if (fs.existsSync(p)) return p;
  }
  // Try to resolve from PATH
  try {
    const which = execSync("which google-chrome chromium chromium-browser chrome 2>/dev/null || where chrome 2>nul || echo not-found")
      .toString().trim().split("\n")[0];
    if (which && which !== "not-found" && fs.existsSync(which)) return which;
  } catch {}
  throw new Error("Could not find Chrome/Chromium installation. Please install Chrome or set CHROME_PATH.");
}

async function main() {
  const chromePath = findChrome();
  console.log(`\n  🔍 Found Chrome at: ${chromePath}`);

  if (!fs.existsSync(HTML_FILE)) {
    console.error(`\n  ❌ HTML file not found: ${HTML_FILE}\n    Run this script from the project root.\n`);
    process.exit(1);
  }

  console.log(`  📄 Reading: pitch-deck.html`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Load the local HTML file
  const htmlContent = fs.readFileSync(HTML_FILE, "utf-8");
  await page.setContent(htmlContent, {
    waitUntil: "networkidle0" as any,
    timeout: 30000,
  });

  // Generate PDF
  await page.pdf({
    path: PDF_FILE,
    format: "A4",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });

  await browser.close();

  const fileSizeKb = (fs.statSync(PDF_FILE).size / 1024).toFixed(1);
  console.log(`  ✅ PDF generated: pitch-deck.pdf (${fileSizeKb} KB, 8 slides)\n`);
}

main().catch((err) => {
  console.error("\n  ❌ PDF generation failed:", err.message, "\n");
  process.exit(1);
});
