// アプリ（npm run dev で起動中）のライブ会場をスマホ表示で操作し、高解像度の連番 JPG（30fps）を書き出す。
// 時計（タイマー / rAF / CSS アニメーション）を仮想化して 1 フレームずつ進めるので、カクつかずに 1170x2532 で撮れる。
// usage: node record.cjs <outDir>   → <outDir>/{L1,L2,L3}/0001.jpg ...
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = process.argv[2] || "frames";
const BASE = process.env.BASE_URL || "http://localhost:5173";
const FPS = 30;

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ctx.clock.install();
  const p = await ctx.newPage();
  await p.goto(`${BASE}/live/neon-horizon-2026`);
  await p.evaluate(() => document.fonts.ready);
  await ctx.clock.runFor(3000);
  await p.waitForSelector(".pb-safe [role=group] button");

  // CSS アニメーションを仮想時計に同期させる
  await p.evaluate(() => {
    window.__anim = new Map();
    window.__syncAnim = () => {
      const now = performance.now();
      for (const a of document.getAnimations()) {
        if (!window.__anim.has(a)) window.__anim.set(a, now);
        a.pause();
        a.currentTime = now - window.__anim.get(a);
      }
    };
  });

  const btns = await p.$$(".pb-safe [role=group] button");
  let clip = null, n = 0;
  const frame = async () => {
    await ctx.clock.runFor(1000 / FPS);
    await p.evaluate(() => window.__syncAnim());
    if (clip) await p.screenshot({ path: path.join(OUT, clip, `${String(++n).padStart(4, "0")}.jpg`), type: "jpeg", quality: 90 });
  };
  const hold = async (sec) => { for (let i = 0; i < Math.round(sec * FPS); i++) await frame(); };
  const press = async (b, sec) => {
    const bb = await b.boundingBox();
    await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
    await p.mouse.down(); await hold(sec); await p.mouse.up();
  };
  const startClip = (name) => { clip = name; n = 0; fs.mkdirSync(path.join(OUT, name), { recursive: true }); };

  await hold(1.5);
  startClip("L1"); // リアクション連打 → ステージにエモジが飛ぶ
  await hold(0.3);
  for (let k = 0; k < 4; k++) { await press(btns[k], 0.5); await hold(0.15); }
  await press(btns[0], 2.5);
  await hold(0.8);

  clip = null;
  await p.getByRole("tab", { name: /サイリウム/ }).click();
  await hold(0.6);
  startClip("L2"); // サイリウムの色を切り替える
  await hold(0.3);
  const swatches = await p.$$("[role=radio]");
  for (const s of swatches.slice(0, 4)) { await s.click(); await hold(0.8); }
  await press(btns[2], 1.6);

  clip = null;
  await p.getByRole("tab", { name: /観客/ }).click();
  await hold(0.6);
  startClip("L3"); // 観客席がリアクションで跳ねる
  await hold(0.3);
  await press(btns[4], 2.5);
  await press(btns[0], 3);

  await browser.close();
  for (const c of ["L1", "L2", "L3"]) console.log(c, fs.readdirSync(path.join(OUT, c)).length);
})();
