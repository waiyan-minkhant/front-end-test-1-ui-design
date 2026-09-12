"use client";

import styles from "./SlideThree.module.scss";

export function SlideThree() {
  return (
    <section className={styles.slide} aria-labelledby="slide-three-heading">
      <div className={styles.content}>
        <h2 id="slide-three-heading" className={styles.heading}>
          Slide three
        </h2>
        <p className={styles.text}>
          Closing viewport placeholder. Scroll and interaction work will hook
          into this section later.
        </p>
      </div>
    </section>
  );
}
