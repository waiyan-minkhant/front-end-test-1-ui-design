"use client";

import { type Ref } from "react";
import { LottieSvg, type LottieHandle } from "lottie-react";
import { HERO_LOTTIE, STILL_FRAME, WALK_SEGMENT } from "@/lib/hero-animation";
import styles from "./SlideOne.module.scss";

type SlideOneCharacterProps = {
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  segment?: readonly [number, number];
  speed?: number;
  lottieRef?: Ref<LottieHandle>;
};

export const HERO_WALK_SLOW = 0.35;
export const HERO_WALK_NORMAL = 1;

let walkHandle: LottieHandle | null = null;
let walkSpeed = HERO_WALK_SLOW;

export function bindHeroWalk(handle: LottieHandle | null) {
  walkHandle = handle;
  walkHandle?.setSpeed(walkSpeed);
}

export function isHeroWalkReady() {
  return walkHandle !== null;
}

export function primeHeroWalk() {
  walkHandle?.seek(WALK_SEGMENT[0]);
}

export function setHeroWalkSpeed(speed: number) {
  walkSpeed = speed;
  walkHandle?.setSpeed(speed);
}

export function playHeroWalk() {
  walkHandle?.setSpeed(walkSpeed);
  walkHandle?.play();
}

export function pauseHeroWalk() {
  walkHandle?.pause();
}

export function SlideOneCharacter({
  className,
  autoplay = false,
  loop = false,
  segment = [STILL_FRAME, STILL_FRAME],
  speed = 1,
  lottieRef,
}: SlideOneCharacterProps) {
  return (
    <LottieSvg
      src={HERO_LOTTIE}
      autoplay={autoplay}
      loop={loop}
      segment={segment}
      speed={speed}
      lottieRef={lottieRef}
      className={className ?? styles.lottie}
      aria-hidden
    />
  );
}
