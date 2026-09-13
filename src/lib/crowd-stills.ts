"use client";

import { useEffect, useState } from "react";
import lottie, { type AnimationItem } from "lottie-web";
import { CROWD_HUES, HERO_LOTTIE, STILL_FRAME } from "@/lib/hero-animation";

function stillPixelSize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  return Math.min(1536, Math.max(1280, Math.round(window.innerHeight * dpr)));
}

export type CrowdStills = {
  svg: string;
  natural: string;
  byHue: Record<string, string>;
};

let stillsPromise: Promise<CrowdStills> | undefined;
let stillsCache: CrowdStills | undefined;

function waitForLoad(anim: AnimationItem) {
  return new Promise<void>((resolve) => {
    if (anim.isLoaded) {
      resolve();
      return;
    }
    anim.addEventListener("DOMLoaded", () => resolve());
  });
}

function canvasToUrl(canvas: HTMLCanvasElement) {
  return new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not encode crowd still"));
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
}

function tint(source: HTMLCanvasElement, hue: string) {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not tint crowd still");
  }
  ctx.filter = `hue-rotate(${hue})`;
  ctx.drawImage(source, 0, 0);
  ctx.filter = "none";
  return canvas;
}

async function rasterizeNatural() {
  const size = stillPixelSize();
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText =
    "position:absolute;left:-9999px;top:0;width:" +
    size +
    "px;height:" +
    size +
    "px;overflow:hidden;pointer-events:none;";
  document.body.append(host);

  const anim = lottie.loadAnimation({
    container: host,
    renderer: "svg",
    loop: false,
    autoplay: false,
    animationData: HERO_LOTTIE,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  });

  try {
    await waitForLoad(anim);
    anim.goToAndStop(STILL_FRAME, true);
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    const svg = host.querySelector("svg");
    if (!svg) {
      throw new Error("Crowd still SVG missing");
    }

    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const idleSvg = svg.cloneNode(true) as SVGElement;
    idleSvg.removeAttribute("width");
    idleSvg.removeAttribute("height");
    idleSvg.setAttribute("width", "100%");
    idleSvg.setAttribute("height", "100%");
    const svgUrl = URL.createObjectURL(
      new Blob([new XMLSerializer().serializeToString(idleSvg)], {
        type: "image/svg+xml;charset=utf-8",
      }),
    );

    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
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

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Crowd still canvas missing");
    }
    ctx.drawImage(image, 0, 0, size, size);
    return { canvas, svgUrl };
  } finally {
    anim.destroy();
    host.remove();
  }
}

async function buildCrowdStills(): Promise<CrowdStills> {
  const { canvas: naturalCanvas, svgUrl } = await rasterizeNatural();
  const natural = await canvasToUrl(naturalCanvas);
  const byHue: Record<string, string> = { "0deg": natural };

  for (const hue of CROWD_HUES) {
    byHue[hue] = await canvasToUrl(tint(naturalCanvas, hue));
  }

  return { svg: svgUrl, natural, byHue };
}

export function prefetchCrowdStills() {
  if (!stillsPromise) {
    stillsPromise = buildCrowdStills().then((value) => {
      stillsCache = value;
      return value;
    });
  }
  return stillsPromise;
}

export function getCrowdStillSrc(stills: CrowdStills, hue: string) {
  return stills.byHue[hue] ?? stills.natural;
}

export function useCrowdStills() {
  const [stills, setStills] = useState<CrowdStills | null>(stillsCache ?? null);

  useEffect(() => {
    let cancelled = false;
    void prefetchCrowdStills().then((value) => {
      if (!cancelled) {
        setStills(value);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return stills;
}
