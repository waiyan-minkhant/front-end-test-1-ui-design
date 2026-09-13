"use client";

import styles from "./SlideTwo.module.scss";

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

function BlobColumn() {
  return (
    <div className={styles.blobsColumn}>
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

export function SlideTwo() {
  return (
    <section className={styles.slide} aria-labelledby="slide-two-heading" data-active>
      <h2 id="slide-two-heading" className={styles.srOnly}>
        Fluffy Hugs
      </h2>

      <div className={styles.blobsStage} data-blobs-stage>
        <div className={styles.blobsParallax} data-blobs-parallax>
          <div className={styles.blobsTrack} data-blobs-track>
            <BlobColumn key="a" />
            <BlobColumn key="b" />
          </div>
        </div>
      </div>

      <div className={styles.heroSlot} data-hero-slot aria-hidden="true" />

      <p className={styles.logoOverlay} data-slide-two-logo aria-hidden="true">
        Fluffy Hugs
      </p>
    </section>
  );
}
