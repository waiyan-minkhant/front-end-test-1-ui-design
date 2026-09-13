import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const JSON_PATH = path.join(ROOT, "public/assets/animations/hero-character.json");
const LOTTIE_PATH = path.join(ROOT, "node_modules/lottie-web/build/player/lottie.min.js");
const OUT_DIR = path.join(ROOT, "public/assets/crowd");
const LAYOUT_PATH = path.join(ROOT, "src/lib/crowd-layout.ts");

const HIDDEN_LAYER_NAMES = [
  "Lottie Logo",
  "MUSIC NOTE NULL",
  "Music Note_02",
  "Music Note_03",
  "Music Note_04",
  "FLOOR LINE",
];

const CROWD_HUES = [
  "80deg",
  "110deg",
  "145deg",
  "175deg",
  "205deg",
  "235deg",
  "265deg",
  "295deg",
];

const SOURCE_SIZE = 750;
const RASTER_SIZE = 2048;
const OUTPUT_1X = 768;
const OUTPUT_2X = 1536;
const HERO_1X = 1024;
const HERO_2X = 2048;
const STILL_FRAME = 30;
const WEBP_QUALITY = 0.92;

function withoutNotes(data) {
  return {
    ...data,
    layers: data.layers.map((layer) =>
      HIDDEN_LAYER_NAMES.includes(layer.nm)
        ? { ...layer, ks: { ...layer.ks, o: { a: 0, k: 0 } } }
        : layer,
    ),
  };
}

function hueSlug(hue) {
  return hue.replace("deg", "");
}

function formatLayout(layout) {
  return `export const CROWD_LAYOUT = {
  widthRatio: ${layout.widthRatio},
  heightRatio: ${layout.heightRatio},
  anchorX: ${JSON.stringify(layout.anchorX)},
  anchorY: ${JSON.stringify(layout.anchorY)},
  walkLeft: ${JSON.stringify(layout.walkLeft)},
  walkTop: ${JSON.stringify(layout.walkTop)},
  walkWidth: ${JSON.stringify(layout.walkWidth)},
  walkHeight: ${JSON.stringify(layout.walkHeight)},
} as const;
`;
}

const animationData = withoutNotes(
  JSON.parse(await readFile(JSON_PATH, "utf8")),
);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: RASTER_SIZE, height: RASTER_SIZE });
await page.setContent("<!doctype html><title>bake</title>");
await page.addScriptTag({ path: LOTTIE_PATH });

const result = await page.evaluate(
  async ({ animationData, SOURCE_SIZE, RASTER_SIZE, OUTPUT_1X, OUTPUT_2X, HERO_1X, HERO_2X, STILL_FRAME, CROWD_HUES, WEBP_QUALITY }) => {
    const ALPHA_MIN = 8;
    const CROP_PAD = 0.1;
    const IMAGE_SCALE = 1.27;
    const IMAGE_OFFSET = 0.15;
    const BOX_PIN_X = 0.5;
    const BOX_PIN_Y = 0.2;
    const CANVAS_PIN_X = (BOX_PIN_X + IMAGE_OFFSET) / IMAGE_SCALE;
    const CANVAS_PIN_Y = (BOX_PIN_Y + IMAGE_OFFSET) / IMAGE_SCALE;

    function pct(value) {
      return `${value * 100}%`;
    }

    function waitForLoad(anim) {
      return new Promise((resolve) => {
        if (anim.isLoaded) {
          resolve();
          return;
        }
        anim.addEventListener("DOMLoaded", () => resolve());
      });
    }

    function isPainted(r, g, b, a) {
      return a > ALPHA_MIN && (r < 254 || g < 254 || b < 254);
    }

    function alphaBounds(canvas) {
      const ctx = canvas.getContext("2d");
      const { width, height } = canvas;
      const pixels = ctx.getImageData(0, 0, width, height).data;
      const rowCount = new Array(height).fill(0);
      const colCount = new Array(width).fill(0);
      const minCoverage = Math.max(6, Math.round(6 * (width / SOURCE_SIZE)));

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const i = (y * width + x) * 4;
          if (isPainted(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3])) {
            rowCount[y] += 1;
            colCount[x] += 1;
          }
        }
      }

      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;

      for (let y = 0; y < height; y += 1) {
        if (rowCount[y] >= minCoverage) {
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }

      for (let x = 0; x < width; x += 1) {
        if (colCount[x] >= minCoverage) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
        }
      }

      if (maxX < minX || maxY < minY) {
        return { x: 0, y: 0, w: width, h: height };
      }

      return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
    }

    function paddedCrop(bounds, size) {
      const padX = Math.round(bounds.w * CROP_PAD);
      const padY = Math.round(bounds.h * CROP_PAD);
      const x = Math.max(0, bounds.x - padX);
      const y = Math.max(0, bounds.y - padY);
      const x2 = Math.min(size, bounds.x + bounds.w + padX);
      const y2 = Math.min(size, bounds.y + bounds.h + padY);
      return { x, y, w: Math.max(1, x2 - x), h: Math.max(1, y2 - y) };
    }

    function layoutFromCrop(crop) {
      const pinX = CANVAS_PIN_X * RASTER_SIZE;
      const pinY = CANVAS_PIN_Y * RASTER_SIZE;
      return {
        widthRatio: crop.w / RASTER_SIZE,
        heightRatio: crop.h / RASTER_SIZE,
        anchorX: pct(-(pinX - crop.x) / crop.w),
        anchorY: pct(-(pinY - crop.y) / crop.h),
        walkLeft: pct(-crop.x / crop.w),
        walkTop: pct(-crop.y / crop.h),
        walkWidth: pct(RASTER_SIZE / crop.w),
        walkHeight: pct(RASTER_SIZE / crop.h),
      };
    }

    function scaleCrop(source, crop, outputMax) {
      const scale = outputMax / Math.max(crop.w, crop.h);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(crop.w * scale));
      canvas.height = Math.max(1, Math.round(crop.h * scale));
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        source,
        crop.x,
        crop.y,
        crop.w,
        crop.h,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      return canvas;
    }

    function tint(source, hue) {
      const canvas = document.createElement("canvas");
      canvas.width = source.width;
      canvas.height = source.height;
      const ctx = canvas.getContext("2d");
      ctx.filter = `hue-rotate(${hue})`;
      ctx.drawImage(source, 0, 0);
      ctx.filter = "none";
      return canvas;
    }

    function canvasToWebp(canvas) {
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Could not encode WebP"));
              return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
          },
          "image/webp",
          WEBP_QUALITY,
        );
      });
    }

    const host = document.createElement("div");
    host.style.cssText = `width:${RASTER_SIZE}px;height:${RASTER_SIZE}px;`;
    document.body.append(host);

    const anim = window.lottie.loadAnimation({
      container: host,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
      },
    });

    await waitForLoad(anim);
    anim.goToAndStop(STILL_FRAME, true);
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));

    const svg = host.querySelector("svg");
    if (!svg) {
      throw new Error("Crowd still SVG missing");
    }

    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", String(RASTER_SIZE));
    svg.setAttribute("height", String(RASTER_SIZE));
    const rasterUrl = URL.createObjectURL(
      new Blob([new XMLSerializer().serializeToString(svg)], {
        type: "image/svg+xml;charset=utf-8",
      }),
    );
    const image = new Image();
    image.decoding = "sync";
    image.src = rasterUrl;
    await image.decode();
    URL.revokeObjectURL(rasterUrl);
    anim.destroy();
    host.remove();

    const source = document.createElement("canvas");
    source.width = RASTER_SIZE;
    source.height = RASTER_SIZE;
    const sourceCtx = source.getContext("2d");
    sourceCtx.drawImage(image, 0, 0, RASTER_SIZE, RASTER_SIZE);

    const crop = paddedCrop(alphaBounds(source), RASTER_SIZE);
    const layout = layoutFromCrop(crop);
    const natural1x = scaleCrop(source, crop, OUTPUT_1X);
    const natural2x = scaleCrop(source, crop, OUTPUT_2X);
    const hero1x = scaleCrop(source, crop, HERO_1X);
    const hero2x = scaleCrop(source, crop, HERO_2X);

    const files = [];
    const variants = [{ hue: "0deg", canvas1x: natural1x, canvas2x: natural2x }];

    for (const hue of CROWD_HUES) {
      variants.push({
        hue,
        canvas1x: tint(natural1x, hue),
        canvas2x: tint(natural2x, hue),
      });
    }

    for (const variant of variants) {
      files.push({
        kind: "crowd",
        hue: variant.hue,
        scale: "1x",
        dataUrl: await canvasToWebp(variant.canvas1x),
        width: variant.canvas1x.width,
        height: variant.canvas1x.height,
      });
      files.push({
        kind: "crowd",
        hue: variant.hue,
        scale: "2x",
        dataUrl: await canvasToWebp(variant.canvas2x),
        width: variant.canvas2x.width,
        height: variant.canvas2x.height,
      });
    }

    files.push({
      kind: "hero",
      hue: "0deg",
      scale: "1x",
      dataUrl: await canvasToWebp(hero1x),
      width: hero1x.width,
      height: hero1x.height,
    });
    files.push({
      kind: "hero",
      hue: "0deg",
      scale: "2x",
      dataUrl: await canvasToWebp(hero2x),
      width: hero2x.width,
      height: hero2x.height,
    });

    return { layout, crop, files };
  },
  {
    animationData,
    SOURCE_SIZE,
    RASTER_SIZE,
    OUTPUT_1X,
    OUTPUT_2X,
    HERO_1X,
    HERO_2X,
    STILL_FRAME,
    CROWD_HUES,
    WEBP_QUALITY,
  },
);

await browser.close();
await mkdir(OUT_DIR, { recursive: true });

for (const file of result.files) {
  const dest =
    file.kind === "hero"
      ? path.join(OUT_DIR, `hero-still-${file.scale}.webp`)
      : path.join(OUT_DIR, `still-${hueSlug(file.hue)}-${file.scale}.webp`);
  const base64 = file.dataUrl.slice(file.dataUrl.indexOf(",") + 1);
  await writeFile(dest, Buffer.from(base64, "base64"));
  console.log(
    `${path.relative(ROOT, dest)} ${file.width}x${file.height} (${Buffer.from(base64, "base64").length} bytes)`,
  );
}

await writeFile(LAYOUT_PATH, formatLayout(result.layout));
console.log(`layout → ${path.relative(ROOT, LAYOUT_PATH)}`);
console.log(JSON.stringify({ crop: result.crop, layout: result.layout }, null, 2));
