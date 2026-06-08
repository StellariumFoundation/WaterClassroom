import { $, build as bunBuild } from "bun";
import { rmSync, existsSync, cpSync, mkdirSync } from "fs";
import { join } from "path";

const DIST = join(import.meta.dir, "dist");

// Clean dist
if (existsSync(DIST)) {
  rmSync(DIST, { recursive: true, force: true });
}
mkdirSync(DIST, { recursive: true });

// 1. Build Tailwind CSS
console.log("📦 Building Tailwind CSS...");
await $`bun x @tailwindcss/cli -i src/index.css -o ${join(DIST, "index.css")} --minify`;

// 2. Bundle frontend (React + JSX) using Bun's JavaScript API
console.log("📦 Bundling frontend...");
const frontendResult = await bunBuild({
  entrypoints: [join(import.meta.dir, "src", "main.tsx")],
  outdir: DIST,
  naming: { entry: "index.[ext]", asset: "[name].[ext]" },
  minify: true,
  sourcemap: "external",
  external: ["*.css"],
});
if (frontendResult.success) {
  console.log(`  Bundled ${frontendResult.outputs.length} outputs:`);
  frontendResult.outputs.forEach(o => console.log(`    ${o.path}`));
} else {
  console.error("❌ Frontend bundle failed:", frontendResult.logs);
  process.exit(1);
}

// 3. Bundle server
console.log("📦 Bundling server...");
const serverResult = await bunBuild({
  entrypoints: [join(import.meta.dir, "server.ts")],
  outdir: DIST,
  naming: "[name].[ext]",
  target: "bun",
  minify: true,
  sourcemap: "external",
  packages: "external",
});
if (serverResult.success) {
  console.log(`  Bundled ${serverResult.outputs.length} outputs`);
} else {
  console.error("❌ Server bundle failed:", serverResult.logs);
  process.exit(1);
}

// 4. Copy static files
console.log("📁 Copying static assets...");
cpSync(join(import.meta.dir, "index.html"), join(DIST, "index.html"));
cpSync(join(import.meta.dir, "public"), DIST, { recursive: true });

console.log("✅ Build complete!");
