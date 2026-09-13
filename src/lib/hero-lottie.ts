import lottie, { type AnimationItem } from "lottie-web";
import {
  HERO_LOTTIE,
  HERO_WALK_SLOW,
  STILL_FRAME,
  WALK_SEGMENT,
} from "@/lib/hero-animation";

let anim: AnimationItem | undefined;
let host: HTMLElement | undefined;
let ready = false;
let readyPromise: Promise<void> | undefined;

function waitForLoad(item: AnimationItem) {
  return new Promise<void>((resolve) => {
    if (item.isLoaded) {
      resolve();
      return;
    }
    item.addEventListener("DOMLoaded", () => resolve());
  });
}

export function mountHeroLottie(container: HTMLElement) {
  if (anim && host === container && readyPromise) {
    return readyPromise;
  }

  destroyHeroLottie();
  host = container;
  anim = lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: true,
    autoplay: false,
    animationData: HERO_LOTTIE,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  });
  ready = false;
  readyPromise = waitForLoad(anim).then(() => {
    anim?.goToAndStop(STILL_FRAME, true);
    anim?.pause();
    ready = true;
    sleepHeroLottie();
  });
  return readyPromise;
}

export function whenHeroLottieReady() {
  return readyPromise ?? Promise.resolve();
}

export function playHeroWalkSlow() {
  if (!anim || !ready) {
    return;
  }

  wakeHeroLottie();
  anim.setSpeed(HERO_WALK_SLOW);
  anim.playSegments(WALK_SEGMENT, true);
}

export function pauseHeroRest() {
  if (!anim || !ready) {
    return;
  }

  anim.goToAndStop(STILL_FRAME, true);
  anim.pause();
}

export function sleepHeroLottie() {
  anim?.pause();
  host?.style.setProperty("content-visibility", "hidden");
}

export function wakeHeroLottie() {
  host?.style.removeProperty("content-visibility");
}

export function destroyHeroLottie() {
  anim?.destroy();
  anim = undefined;
  host = undefined;
  ready = false;
  readyPromise = undefined;
}
