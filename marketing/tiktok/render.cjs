// compose.html を 1 フレームずつ描画して ffmpeg で mp4 に書き出す
// usage: node render.js <ad|post> <out.mp4> [audio.wav] [--stills t1,t2,...]
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");

const [variant = "ad", out = `allstand_${variant}.mp4`, audio] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const stillsArg = process.argv.find((a) => a.startsWith("--stills="));
const FPS = 30;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto(`file://${path.join(__dirname, "compose.html")}?v=${variant}`);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(["800 80px 'M PLUS 1p'", "500 40px 'M PLUS 1p'", "900 80px Outfit", "80px 'Noto Color Emoji'"].map((f) => document.fonts.load(f, "あA🔥")));
  });
  if (stillsArg) {
    for (const t of stillsArg.split("=")[1].split(",").map(Number)) {
      await page.evaluate((t) => window.render(t), t);
      await page.screenshot({ path: `${out}_${t}.png` });
    }
    await browser.close();
    return;
  }
  const duration = await page.evaluate(() => window.DURATION);
  const args = ["-y", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-"];
  if (audio) args.push("-i", audio, "-c:a", "aac", "-b:a", "192k", "-shortest");
  args.push("-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out);
  const ff = spawn("ffmpeg", args, { stdio: ["pipe", "inherit", "inherit"] });
  const total = Math.round(duration * FPS);
  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => window.render(t), i / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % 60 === 0) process.stdout.write(`\r${variant}: ${i}/${total}`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  await browser.close();
  console.log(`\n→ ${out}`);
})();
