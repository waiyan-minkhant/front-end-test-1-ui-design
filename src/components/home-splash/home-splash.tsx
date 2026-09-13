"use client";

import { useEffect, useState, type ReactNode } from "react";
import { prefetchCrowdStills } from "@/lib/crowd-stills";
import { HOME_READY_EVENT, SLIDE_WARM_EVENT } from "@/lib/slides";
import { LoadingScreen } from "@/components/loading-screen/loading-screen";
import styles from "./home-splash.module.scss";

type HomeSplashProps = {
  loadingClassName?: string;
  children: ReactNode;
};

export function HomeSplash({ loadingClassName, children }: HomeSplashProps) {
  const [stillsReady, setStillsReady] = useState(false);
  const [warmed, setWarmed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void prefetchCrowdStills()
      .catch(() => null)
      .then(() => {
        if (!cancelled) {
          setStillsReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onWarm = () => setWarmed(true);
    window.addEventListener(SLIDE_WARM_EVENT, onWarm);
    return () => {
      window.removeEventListener(SLIDE_WARM_EVENT, onWarm);
    };
  }, []);

  const showHome = stillsReady && warmed;

  useEffect(() => {
    if (!showHome) {
      return;
    }

    window.dispatchEvent(new Event(HOME_READY_EVENT));
  }, [showHome]);

  useEffect(() => {
    if (showHome) {
      return;
    }

    const block = (event: Event) => {
      event.preventDefault();
    };

    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", block);
    return () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", block);
    };
  }, [showHome]);

  return (
    <>
      {stillsReady ? (
        <div
          className={styles.home}
          aria-hidden={!showHome}
          style={{ visibility: showHome ? "visible" : "hidden" }}
        >
          {children}
        </div>
      ) : null}
      {showHome ? null : (
        <div className={styles.overlay}>
          <LoadingScreen className={loadingClassName} />
        </div>
      )}
    </>
  );
}
