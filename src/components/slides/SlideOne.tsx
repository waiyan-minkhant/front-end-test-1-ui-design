"use client";

import type { CSSProperties } from "react";
import { CROWD_HUES } from "@/lib/hero-animation";
import {
  CROWD_LAYOUT,
  CROWD_STILL_SIZES,
  getCrowdStill,
  getHeroStill,
} from "@/lib/crowd-stills";
import styles from "./SlideOne.module.scss";

type CrowdCharacter = {
  id: number;
  row: number;
  col: number;
  hue: string;
  delay: string;
  isHero?: boolean;
  isHeroRow?: boolean;
  isFront?: boolean;
};

const CELLS: Array<{ row: number; col: number }> = [
  ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => ({ row: 0, col })),
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((col) => ({ row: 1, col })),
  ...[0, 1, 2, 3, 4, 5, 6].map((col) => ({ row: 2, col })),
  ...[0, 1, 2, 3, 4].map((col) => ({ row: 3, col })),
  ...[0, 1, 2, 3, 4, 5].map((col) => ({ row: 4, col })),
  ...[0, 1, 2, 3, 4, 5].map((col) => ({ row: 5, col })),
  { row: 4, col: -1 },
  { row: 5, col: -2 },
  { row: 5, col: -1 },
  { row: 3, col: -1 },
  { row: 3, col: 5 },
];

const CHARACTERS: CrowdCharacter[] = CELLS.map((cell, index) => {
  const isHero = cell.row === 3 && cell.col === 2;

  return {
    id: index + 1,
    row: cell.row,
    col: cell.col,
    hue: isHero ? "0deg" : CROWD_HUES[index % CROWD_HUES.length],
    delay: `${((index * 7) % 10) * 0.045}s`,
    isHero,
    isHeroRow: cell.row === 3,
    isFront: cell.row > 3,
  };
});

type CharacterStyle = CSSProperties & {
  "--row": number;
  "--col": number;
  "--bob-delay": string;
  "--hue": string;
  "--crop-w": number;
  "--crop-h": number;
  "--anchor-x": string;
  "--anchor-y": string;
  "--walk-left": string;
  "--walk-top": string;
  "--walk-w": string;
  "--walk-h": string;
};

export function SlideOne() {
  return (
    <section
      className={styles.slide}
      aria-labelledby="slide-one-heading"
      data-active
    >
      <h1 id="slide-one-heading" className={styles.srOnly}>
        Hello, friend
      </h1>

      <div className={styles.backdrop} data-slide-one-backdrop />

      <div className={styles.crowdLayer} data-crowd-layer>
        {CHARACTERS.filter((character) => !character.isHero).map(
          (character) => {
            const still = getCrowdStill(character.hue);
            const style = {
              "--row": character.row,
              "--col": character.col,
              "--bob-delay": character.delay,
              "--hue": character.hue,
              "--crop-w": CROWD_LAYOUT.widthRatio,
              "--crop-h": CROWD_LAYOUT.heightRatio,
              "--anchor-x": CROWD_LAYOUT.anchorX,
              "--anchor-y": CROWD_LAYOUT.anchorY,
            } as CharacterStyle;

            return (
              <div
                key={character.id}
                className={styles.character}
                data-crowd
                data-hero-row={character.isHeroRow ? "true" : undefined}
                data-front={character.isFront ? "true" : undefined}
                style={style}
              >
                <div className={styles.crowdMove} data-crowd-move>
                  <img
                    className={styles.still}
                    src={still.src}
                    srcSet={still.srcSet}
                    sizes={CROWD_STILL_SIZES}
                    alt=""
                    draggable={false}
                    decoding="async"
                  />
                </div>
              </div>
            );
          },
        )}
      </div>

      {CHARACTERS.filter((character) => character.isHero).map((character) => {
        const still = getHeroStill();
        const style = {
          "--row": character.row,
          "--col": character.col,
          "--bob-delay": character.delay,
          "--hue": character.hue,
          "--crop-w": CROWD_LAYOUT.widthRatio,
          "--crop-h": CROWD_LAYOUT.heightRatio,
          "--anchor-x": CROWD_LAYOUT.anchorX,
          "--anchor-y": CROWD_LAYOUT.anchorY,
          "--walk-left": CROWD_LAYOUT.walkLeft,
          "--walk-top": CROWD_LAYOUT.walkTop,
          "--walk-w": CROWD_LAYOUT.walkWidth,
          "--walk-h": CROWD_LAYOUT.walkHeight,
        } as CharacterStyle;

        return (
          <div
            key={character.id}
            className={`${styles.character} ${styles.hero}`}
            data-hero
            data-hero-row="true"
            style={style}
          >
            <div className={styles.heroMove} data-hero-move>
              <div className={styles.heroSpin} data-hero-spin>
                <div className={styles.heroBreath} data-hero-breath>
                  <div className={styles.heroFigure}>
                    <div className={styles.lottieWrap} data-hero-lottie>
                      <div
                        className={styles.lottieHost}
                        data-hero-lottie-host
                      />
                    </div>
                    <div className={styles.walkWrap} data-hero-walk>
                      <img
                        className={styles.walk}
                        alt=""
                        draggable={false}
                        decoding="async"
                      />
                    </div>
                    <div className={styles.stillWrap} data-hero-still>
                      <div className={styles.bitmap} data-hero-bitmap>
                        <img
                          className={styles.still}
                          src={still.src}
                          srcSet={still.srcSet}
                          sizes={CROWD_STILL_SIZES}
                          alt=""
                          draggable={false}
                          decoding="async"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
