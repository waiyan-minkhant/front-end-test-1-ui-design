"use client";

import styles from "./SlideTwo.module.scss";

export function SlideTwo() {
  return (
    <section className={styles.slide} aria-labelledby="slide-two-heading">
      <div className={styles.content}>
        <h2 id="slide-two-heading" className={styles.heading}>
          Slide two
        </h2>
        <p className={styles.text}>
          Mid-page placeholder for the cream canvas. Copy and assets stay
          independent of the reference site.
        </p>
      </div>
    </section>
  );
}
