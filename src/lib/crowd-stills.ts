import { CROWD_LAYOUT } from "@/lib/crowd-layout";
import { CROWD_HUES } from "@/lib/hero-animation";

export { CROWD_LAYOUT };

export type CrowdStill = {
  src: string;
  srcSet: string;
};

function hueSlug(hue: string) {
  return hue.replace("deg", "");
}

function stillFiles(hue: string): CrowdStill {
  const slug = hueSlug(hue);
  const x1 = `/assets/crowd/still-${slug}-1x.webp`;
  const x2 = `/assets/crowd/still-${slug}-2x.webp`;
  return {
    src: x1,
    srcSet: `${x1} 1x, ${x2} 2x`,
  };
}

const BY_HUE: Record<string, CrowdStill> = {
  "0deg": stillFiles("0deg"),
};

for (const hue of CROWD_HUES) {
  BY_HUE[hue] = stillFiles(hue);
}

export const CROWD_STILL_SIZES = `${CROWD_LAYOUT.widthRatio * 150}vh`;

export const HERO_STILL: CrowdStill = {
  src: "/assets/crowd/hero-still-1x.webp",
  srcSet:
    "/assets/crowd/hero-still-1x.webp 1x, /assets/crowd/hero-still-2x.webp 2x",
};

export function getCrowdStill(hue: string) {
  return BY_HUE[hue] ?? BY_HUE["0deg"];
}

export function getHeroStill() {
  return HERO_STILL;
}

function decodeSrc(src: string) {
  const image = new Image();
  image.src = src;
  return image.decode();
}

function srcForDpr(still: CrowdStill) {
  if (window.devicePixelRatio > 1) {
    return still.srcSet.split(", ")[1]?.split(" ")[0] ?? still.src;
  }
  return still.src;
}

let stillsPromise: Promise<void> | undefined;

export function prefetchCrowdStills() {
  if (!stillsPromise) {
    stillsPromise = Promise.all(
      [...Object.values(BY_HUE), HERO_STILL].map((still) =>
        decodeSrc(srcForDpr(still)),
      ),
    ).then(() => undefined);
  }
  return stillsPromise;
}
