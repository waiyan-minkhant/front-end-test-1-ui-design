"use client";

import type { CSSProperties } from "react";
import styles from "./SlideThree.module.scss";

const BLOBS = [
  {
    id: "a",
    className: styles.blobA,
    fill: "#ffbdb5",
    transform: "translate(436.4344102145184 299.84726666602955)",
    d: "M91.9 -87.4C130.7 -53 181.9 -26.5 203.9 22.1C226 70.7 219.1 141.4 180.3 170.4C141.4 199.4 70.7 186.7 10.1 176.6C-50.4 166.4 -100.9 158.9 -134.2 129.9C-167.5 100.9 -183.8 50.4 -188.1 -4.4C-192.5 -59.2 -185 -118.3 -151.7 -152.7C-118.3 -187 -59.2 -196.5 -16.3 -180.2C26.5 -163.9 53 -121.7 91.9 -87.4",
  },
  {
    id: "b",
    className: styles.blobB,
    fill: "#bad8ff",
    transform: "translate(446.86592977952944 316.93485901742724)",
    d: "M143.2 -174.5C162 -124.5 137.2 -62.2 125 -12.3C112.7 37.7 112.9 75.4 94.2 121.4C75.4 167.4 37.7 221.7 1.5 220.2C-34.6 218.6 -69.3 161.3 -95.3 115.3C-121.3 69.3 -138.6 34.6 -142.8 -4.1C-146.9 -42.9 -137.8 -85.8 -111.8 -135.8C-85.8 -185.8 -42.9 -242.9 9.7 -252.6C62.2 -262.2 124.5 -224.5 143.2 -174.5",
  },
  {
    id: "c",
    className: styles.blobC,
    fill: "#bfe7ff",
    transform: "translate(469.4291937286572 347.15066545103156)",
    d: "M86.7 -102C120.4 -53 161.2 -26.5 180.2 19C199.2 64.6 196.5 129.2 162.8 149.8C129.2 170.5 64.6 147.2 12 135.2C-40.5 123.2 -81.1 122.4 -123.4 101.7C-165.7 81.1 -209.9 40.5 -225 -15.1C-240 -70.7 -226.1 -141.4 -183.8 -190.4C-141.4 -239.4 -70.7 -266.7 -22.1 -244.6C26.5 -222.5 53 -151 86.7 -102",
  },
  {
    id: "d",
    className: styles.blobD,
    fill: "#a9edeb",
    transform: "translate(494.2973413789392 271.16929620154104)",
    d: "M77.6 -74.8C99.1 -56.1 114 -28 135 21C156 70 183 140 161.5 174.2C140 208.3 70 206.7 7.2 199.5C-55.6 192.3 -111.3 179.6 -161.3 145.4C-211.3 111.3 -255.6 55.6 -257.9 -2.2C-260.1 -60.1 -220.2 -120.2 -170.2 -139C-120.2 -157.7 -60.1 -135.1 -16 -119.1C28 -103.1 56.1 -93.6 77.6 -74.8",
  },
  {
    id: "e",
    className: styles.blobE,
    fill: "#ffdaff",
    transform: "translate(441.3535281910439 303.16179560049363)",
    d: "M105.5 -113.7C145.5 -65.5 192.8 -32.8 189.6 -3.1C186.5 26.5 133 53 93 103C53 153 26.5 226.5 -12.7 239.2C-51.9 251.9 -103.7 203.7 -128.7 153.7C-153.7 103.7 -151.9 51.9 -159.5 -7.7C-167.2 -67.2 -184.4 -134.4 -159.4 -182.5C-134.4 -230.7 -67.2 -259.8 -17.2 -242.6C32.8 -225.4 65.5 -161.9 105.5 -113.7",
  },
  {
    id: "f",
    className: styles.blobF,
    fill: "#fff0ff",
    transform: "translate(492.2927666487323 326.0167672742099)",
    d: "M102.2 -131.9C120.9 -83.4 116.7 -41.7 109.1 -7.7C101.4 26.4 90.3 52.8 71.5 78.6C52.8 104.5 26.4 129.7 -22.2 151.9C-70.7 174 -141.4 193.1 -174.9 167.3C-208.4 141.4 -204.7 70.7 -186 18.7C-167.2 -33.2 -133.5 -66.5 -100 -115C-66.5 -163.5 -33.2 -227.2 4.2 -231.5C41.7 -235.7 83.4 -180.4 102.2 -131.9",
  },
  {
    id: "g",
    className: styles.blobG,
    fill: "#f6b4a6",
    transform: "translate(383.65269009925123 291.41760443435317)",
    d: "M156.5 -131.2C206.5 -106.5 253.3 -53.3 253.2 -0.1C253 53 206.1 106.1 156.1 135.6C106.1 165.1 53 171 4.4 166.7C-44.3 162.3 -88.6 147.6 -107.4 118.1C-126.1 88.6 -119.3 44.3 -119.3 0C-119.3 -44.3 -126.1 -88.6 -107.4 -113.3C-88.6 -138 -44.3 -143 4.5 -147.5C53.3 -151.9 106.5 -155.9 156.5 -131.2",
  },
  {
    id: "h",
    className: styles.blobH,
    fill: "#ff9eb0",
    transform: "translate(491.89234561494317 296.74076979607696)",
    d: "M95.5 -98.1C127.3 -63.6 159.2 -31.8 163 3.9C166.9 39.6 142.9 79.2 111 108.5C79.2 137.9 39.6 156.9 -10.3 167.2C-60.1 177.4 -120.2 178.9 -170.2 149.5C-220.2 120.2 -260.1 60.1 -243.3 16.8C-226.5 -26.5 -153 -53 -103 -87.5C-53 -122 -26.5 -164.5 2.7 -167.2C31.8 -169.8 63.6 -132.6 95.5 -98.1",
  },
  {
    id: "i",
    className: styles.blobI,
    fill: "#ade2ca",
    transform: "translate(486.157158768618 272.5778586912495)",
    d: "M89.9 -87.9C126.7 -53 173.9 -26.5 183.8 10C193.8 46.4 166.5 92.9 129.7 142.9C92.9 192.9 46.4 246.4 -8.4 254.8C-63.2 263.2 -126.3 226.3 -174.3 176.3C-222.3 126.3 -255.2 63.2 -258 -2.8C-260.8 -68.8 -233.7 -137.7 -185.7 -172.5C-137.7 -207.3 -68.8 -208.2 -21.2 -187C26.5 -165.9 53 -122.7 89.9 -87.9",
  },
] as const;

const ANIMAL_PLACEMENT = [
  styles.animalA,
  styles.animalB,
  styles.animalC,
  styles.animalD,
  styles.animalE,
  styles.animalF,
  styles.animalG,
  styles.animalH,
  styles.animalI,
  styles.animalJ,
] as const;

const ANIMALS = [
  {
    id: "chipmunk-1",
    src: "/assets/vectors/animal-chipmunk.svg",
    color: "#e89b4d",
    rotate: 108,
  },
  {
    id: "koala-1",
    src: "/assets/vectors/animal-koala.svg",
    color: "#9a9590",
    rotate: -18,
  },
  {
    id: "rat-1",
    src: "/assets/vectors/animal-rat.svg",
    color: "#c5c0bc",
    rotate: 22,
  },
  {
    id: "pig-1",
    src: "/assets/vectors/animal-pig.svg",
    color: "#f3b6c4",
    rotate: 96,
  },
  {
    id: "koala-2",
    src: "/assets/vectors/animal-koala.svg",
    color: "#f7f4f0",
    rotate: -12,
  },
  {
    id: "deer-1",
    src: "/assets/vectors/animal-deer.svg",
    color: "#2f2f2f",
    rotate: 8,
  },
  {
    id: "rat-2",
    src: "/assets/vectors/animal-rat.svg",
    color: "#1f1f1f",
    rotate: -6,
  },
  {
    id: "pig-2",
    src: "/assets/vectors/animal-pig.svg",
    color: "#f3eee8",
    rotate: 16,
  },
  {
    id: "chipmunk-2",
    src: "/assets/vectors/animal-chipmunk.svg",
    color: "#e8c49a",
    rotate: 12,
  },
  {
    id: "deer-2",
    src: "/assets/vectors/animal-deer.svg",
    color: "#d9a078",
    rotate: -28,
  },
] as const;

const LINES = [
  "ふわふわの動物たちに、",
  "囲まれて暮らしたい",
  "ペットや動物が大好きなあなたへ",
] as const;

type AnimalStyle = CSSProperties & {
  "--animal-color": string;
  "--animal-mask": string;
  "--animal-rotate": string;
};

function BlobShape({
  className,
  fill,
  transform,
  d,
}: (typeof BLOBS)[number]) {
  return (
    <svg
      className={[styles.blob, className].join(" ")}
      viewBox="0 0 900 600"
      aria-hidden
    >
      <g transform={transform}>
        <path d={d} fill={fill} />
      </g>
    </svg>
  );
}

function BlobField() {
  return (
    <div className={styles.blobField}>
      {BLOBS.map((blob) => (
        <BlobShape key={blob.id} {...blob} />
      ))}
    </div>
  );
}

function AnimalSprite({
  src,
  color,
  placement,
  rotate,
}: (typeof ANIMALS)[number] & { placement: string }) {
  const style = {
    "--animal-color": color,
    "--animal-mask": `url("${src}")`,
    "--animal-rotate": `${rotate}deg`,
  } as AnimalStyle;

  return (
    <div className={`${styles.animal} ${placement}`} data-animal style={style}>
      <div className={styles.animalArt}>
        <div className={styles.animalHead}>
          <span className={styles.animalFill} />
        </div>
        <div className={styles.animalBody} data-animal-puff>
          <span className={styles.animalFill} />
        </div>
      </div>
    </div>
  );
}

function AnimalField() {
  return (
    <div className={styles.animalField}>
      {ANIMALS.map((animal, index) => (
        <AnimalSprite
          key={animal.id}
          {...animal}
          placement={ANIMAL_PLACEMENT[index] ?? ""}
        />
      ))}
    </div>
  );
}

function WavyLine({ text, gap }: { text: string; gap?: boolean }) {
  return (
    <p className={`${styles.line} japaneseText ${gap ? styles.lineGap : ""}`}>
      {[...text].map((character, index) => (
        <span
          key={`${character}-${index}`}
          className={styles.char}
          style={{ "--i": index } as CSSProperties}
        >
          {character === " " ? "\u00a0" : character}
        </span>
      ))}
    </p>
  );
}

export function SlideThree() {
  return (
    <section
      className={styles.slide}
      aria-labelledby="slide-three-heading"
      data-active
    >
      <h2 id="slide-three-heading" className={styles.srOnly}>
        ふわふわの動物たちに、囲まれて暮らしたい
      </h2>

      <div className={styles.stage} data-slide-three-stage>
        <div className={styles.blobsStage} data-three-blobs-stage>
          <div className={styles.blobsTrack} data-three-blobs-track>
            <BlobField />
            <BlobField />
          </div>
        </div>

        <div className={styles.animalsStage} data-three-animals-stage>
          <div className={styles.animalsTrack} data-three-animals-track>
            <AnimalField />
            <AnimalField />
          </div>
        </div>

        <div className={styles.heroSlot} data-hero-slot-3 aria-hidden="true" />

        <div className={styles.copy} data-slide-three-copy>
          {LINES.map((line, index) => (
            <WavyLine key={line} text={line} gap={index === LINES.length - 1} />
          ))}
        </div>

        <div className={styles.peel} aria-hidden="true">
          <div className={styles.fold} />
          <img
            className={styles.hangingCat}
            src="/assets/vectors/hanging-cat.png"
            alt=""
            data-hanging-cat
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
