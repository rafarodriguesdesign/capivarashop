// Renderiza a animação do Tucanoo quadro a quadro com o Chromium (Playwright).
// Uso:
//   node render.js <anim.html> <pasta-saida> [fps=30] [escala=2] [tempos]
//   tempos (opcional): lista separada por vírgula, ex. "0,0.5,1.2" -> renderiza só esses instantes
// Sem "tempos", renderiza um loop completo (window.LOOP segundos) em <fps> quadros por segundo.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const [, , htmlArg, outDir, fpsArg = '30', scaleArg = '2', timesArg] = process.argv;
  if (!htmlArg || !outDir) {
    console.error('uso: node render.js <anim.html> <pasta-saida> [fps] [escala] [tempos]');
    process.exit(1);
  }
  const fps = Number(fpsArg);
  const scale = Number(scaleArg);
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1080 },
    deviceScaleFactor: scale,
  });
  const url = htmlArg.startsWith('file:') ? htmlArg : 'file://' + path.resolve(htmlArg);
  await page.goto(url);
  await page.waitForFunction(() => typeof window.renderFrame === 'function');

  let jobs;
  if (timesArg) {
    jobs = timesArg.split(',').map((s, i) => ({ t: Number(s), name: `t_${s}` }));
  } else {
    const loop = await page.evaluate(() => window.LOOP);
    const n = Math.round(loop * fps);
    jobs = [...Array(n).keys()].map((i) => ({ t: i / fps, name: `f_${String(i).padStart(4, '0')}` }));
  }

  for (const { t, name } of jobs) {
    await page.evaluate((tt) => window.renderFrame(tt), t);
    await page.screenshot({
      path: path.join(outDir, `${name}.png`),
      clip: { x: 0, y: 0, width: 1080, height: 1080 },
      animations: 'disabled',
    });
  }
  await browser.close();
  console.log(`ok: ${jobs.length} quadro(s) em ${outDir}`);
})();
