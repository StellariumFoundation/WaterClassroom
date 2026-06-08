import { $ } from "bun";
import { rmSync, existsSync, cpSync, mkdirSync } from "fs";

// Clean dist
if (existsSync("dist")) {
  rmSync("dist", { recursive: true, force: true });
}
mkdirSync("dist", { recursive: true });

// 1. Build Tailwind CSS
console.log("📦 Building Tailwind CSS...");
await $`bun x @tailwindcss/cli -i src/index.css -o dist/index.css --minify`;

// 2. Bundle frontend (React + JSX)
console.log("📦 Bundling frontend...");
await $`bun build src/main.tsx --outfile dist/index.js --minify --sourcemap ${'--external:*.css'}`;

// 3. Bundle server
console.log("📦 Bundling server...");
await $`bun build server.ts --outdir dist --target bun --minify --sourcemap --packages external`;

// 4. Copy static files
console.log("📁 Copying static assets...");
cpSync("index.html", "dist/index.html");
cpSync("public", "dist", { recursive: true });

console.log("✅ Build complete!");
