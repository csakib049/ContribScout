const path = require('node:path');
const { chromium } = require('C:/Users/Shakib/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { spawnSync } = require('node:child_process');
const http = require('node:http');

const root = path.resolve(__dirname, '..');
const framesDir = path.join(__dirname, 'launch-frames');
const source = path.join(__dirname, 'launch-video-render.html');
const finalVideo = path.join(root, 'ContribScout-Launch.mp4');
const preview = path.join(root, 'ContribScout-Launch-preview.png');
const narration = path.join(__dirname, 'launch-voiceover.mp3');
const ffmpeg = process.env.VIDEO_FFMPEG;

(async () => {
  const fs = require('node:fs');
  fs.mkdirSync(framesDir, { recursive: true });
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    const filePath = path.resolve(root, `.${pathname}`);
    if (!filePath.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    const types = { '.html':'text/html', '.png':'image/png', '.mp3':'audio/mpeg' };
    fs.readFile(filePath, (error, data) => {
      if (error) { response.writeHead(404).end(); return; }
      response.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
      response.end(data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/Feature_images/launch-video-render.html?still=1`;
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required'],
  });
  let framePaths;
  let times;
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    page.on('pageerror', error => console.error('Page error:', error.message));
    await page.goto(url);
    await page.waitForFunction(() => document.querySelector('#narration').readyState >= 1);
    await page.waitForFunction(() => Object.values(window.shots ?? {}).every(img => img.complete));
    const schedule = await page.evaluate(() => window.getLaunchSceneSchedule());
    times = schedule.centers;
    const canvas = page.locator('#film');
    framePaths = [];
    for (let i = 0; i < times.length; i++) {
      await page.evaluate(t => window.renderLaunchFrame(t), times[i]);
      const framePath = path.join(framesDir, `scene-${String(i + 1).padStart(2, '0')}.png`);
      const image = await canvas.evaluate(el => el.toDataURL('image/png'));
      fs.writeFileSync(framePath, Buffer.from(image.split(',')[1], 'base64'));
      framePaths.push(framePath);
    }
    await page.evaluate(t => window.renderLaunchFrame(t), times[times.length - 1]);
    const previewData = await canvas.evaluate(el => el.toDataURL('image/png'));
    fs.writeFileSync(preview, Buffer.from(previewData.split(',')[1], 'base64'));
    console.log(`Rendered ${framePaths.length} scene frames for ${schedule.duration.toFixed(1)} seconds.`);
    await browser.close();

    const intervals = schedule.weights.map(weight => schedule.duration * weight / schedule.totalWeight);
    const args = ['-y'];
    framePaths.forEach((framePath, i) => args.push('-loop', '1', '-framerate', '30', '-t', intervals[i].toFixed(4), '-i', framePath));
    args.push('-i', narration);
    const filters = [];
    for (let i = 0; i < framePaths.length; i++) {
      const duration = intervals[i];
      filters.push(`[${i}:v]fps=30,trim=duration=${duration.toFixed(4)},setpts=PTS-STARTPTS,setsar=1,format=yuv420p,fade=t=in:st=0:d=0.35,fade=t=out:st=${Math.max(0,duration-0.35).toFixed(4)}:d=0.35[v${i}]`);
    }
    filters.push(`${framePaths.map((_,i)=>`[v${i}]`).join('')}concat=n=${framePaths.length}:v=1:a=0[vid]`);
    args.push('-filter_complex', filters.join(';'), '-map', '[vid]', '-map', `${framePaths.length}:a:0`);
    args.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', finalVideo);
    const result = spawnSync(ffmpeg, args, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    if (result.status !== 0) throw new Error(result.stderr || `ffmpeg exited with ${result.status}`);
    console.log(`Created ${finalVideo}`);
  } finally {
    await browser.close().catch(() => {});
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
