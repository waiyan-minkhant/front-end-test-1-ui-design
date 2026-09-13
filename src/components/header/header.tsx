"use client";

import { useEffect, useRef } from "react";
import { SLIDE_CHANGE_EVENT, type SlideChangeDetail } from "@/lib/slides";
import styles from "./header.module.scss";

export function Header() {
  const logoRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) {
      return;
    }

    const setHidden = (hidden: boolean) => {
      logo.classList.toggle(styles.logoHidden, hidden);
      logo.toggleAttribute("data-hidden", hidden);
      if (hidden) {
        logo.setAttribute("aria-hidden", "true");
      } else {
        logo.removeAttribute("aria-hidden");
      }
    };

    const onChange = (event: Event) => {
      const { index } = (event as CustomEvent<SlideChangeDetail>).detail;
      setHidden(index === 1);
    };

    window.addEventListener(SLIDE_CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener(SLIDE_CHANGE_EVENT, onChange);
    };
  }, []);

  return (
    <header className={styles.root}>
      <p ref={logoRef} className={styles.logo}>
        Fluffy Hugs
      </p>

      <nav className={styles.socials} aria-label="Social">
        <a className={styles.social} href="#" aria-label="Discord">
          <img src="/assets/icons/discord.png" alt="" />
        </a>
        <a className={styles.social} href="#" aria-label="Facebook">
          <img src="/assets/icons/facebook.png" alt="" />
        </a>
        <a className={styles.social} href="#" aria-label="Twitter">
          <img src="/assets/icons/twitter.png" alt="" />
        </a>
      </nav>

      <a className={styles.collection} href="#">
        <svg
          className={styles.blob}
          viewBox="220 110 460 380"
          preserveAspectRatio="xMidYMax meet"
          aria-hidden="true"
        >
          <g transform="translate(491.89234561494317 296.74076979607696)">
            <path d="M95.5 -98.1C127.3 -63.6 159.2 -31.8 163 3.9C166.9 39.6 142.9 79.2 111 108.5C79.2 137.9 39.6 156.9 -10.3 167.2C-60.1 177.4 -120.2 178.9 -170.2 149.5C-220.2 120.2 -260.1 60.1 -243.3 16.8C-226.5 -26.5 -153 -53 -103 -87.5C-53 -122 -26.5 -164.5 2.7 -167.2C31.8 -169.8 63.6 -132.6 95.5 -98.1" />
          </g>
        </svg>
        <span className={styles.collectionLabel}>view collection</span>
      </a>
    </header>
  );
}
