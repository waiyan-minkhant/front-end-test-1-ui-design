"use client";

import type { CSSProperties } from "react";
import styles from "./SlideThree.module.scss";

const BLOBS = [
  { src: "/assets/vectors/blob-1.svg", className: styles.blobA },
  { src: "/assets/vectors/blob-2.svg", className: styles.blobB },
  { src: "/assets/vectors/blob-3.svg", className: styles.blobC },
  { src: "/assets/vectors/blob-4.svg", className: styles.blobD },
  { src: "/assets/vectors/blob-5.svg", className: styles.blobE },
  { src: "/assets/vectors/blob-6.svg", className: styles.blobF },
  { src: "/assets/vectors/blob-7.svg", className: styles.blobG },
  { src: "/assets/vectors/blob-8.svg", className: styles.blobH },
  { src: "/assets/vectors/blob-9.svg", className: styles.blobI },
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

function BlobField() {
  return (
    <div className={styles.blobField}>
      {BLOBS.map((blob) => (
        <img
          key={blob.src}
          src={blob.src}
          alt=""
          className={[styles.blob, blob.className].join(" ")}
        />
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
