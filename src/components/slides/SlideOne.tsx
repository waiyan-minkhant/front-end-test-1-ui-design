"use client";

import styles from "./SlideOne.module.scss";

export function SlideOne() {
  return (
    <section className={styles.slide} aria-labelledby="slide-one-heading">
      <p className={`japaneseText ${styles.japaneseText}`} aria-hidden="true">
        ようこそ
      </p>
      <div className={styles.content}>
        <h1 id="slide-one-heading" className={styles.heading}>
          Slide one
        </h1>
        <p className={styles.text}>
          Full-viewport intro placeholder. Illustration layers will land here
          later.
        </p>
      </div>
    </section>
  );
}
