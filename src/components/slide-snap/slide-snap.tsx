"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import {
  SLIDE_CHANGE_EVENT,
  SLIDE_SETTLE_EVENT,
  type SlideChangeDetail,
} from "@/lib/slides";
import styles from "./slide-snap.module.scss";

gsap.registerPlugin(Observer);

const WHEEL_THRESHOLD = 1;
const WHEEL_IDLE = 140;
const TOUCH_TOLERANCE = 16;

const wheelDelta = (event: WheelEvent) => {
  if (event.deltaMode === 1) {
    return event.deltaY * 16;
  }
  if (event.deltaMode === 2) {
    return event.deltaY * window.innerHeight;
  }
  return event.deltaY;
};

type SlideSnapProps = {
  children: ReactNode;
};

export function SlideSnap({ children }: SlideSnapProps) {
  const mainRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const main = mainRef.current;
    const track = trackRef.current;
    if (!main || !track) {
      return;
    }

    const pages = [...track.children] as HTMLElement[];
    const slides = [...track.querySelectorAll<HTMLElement>("section")];
    if (slides.length === 0 || pages.length === 0) {
      return;
    }

    const lastIndex = slides.length - 1;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const morphWait = reducedMotion ? 80 : 4000;

    let index = 0;
    let locked = false;
    let armed = true;
    let morphTimer = 0;
    let armTimer = 0;

    const emit = (type: string, next: number, previous: number) => {
      window.dispatchEvent(
        new CustomEvent<SlideChangeDetail>(type, {
          detail: { index: next, previous },
        }),
      );
    };

    const syncLayers = () => {
      pages.forEach((page) => page.toggleAttribute("data-active", true));
      slides.forEach((slide) => slide.toggleAttribute("data-active", true));
    };

    const armWhenIdle = () => {
      window.clearTimeout(armTimer);
      armTimer = window.setTimeout(() => {
        if (!locked) {
          armed = true;
        }
      }, WHEEL_IDLE);
    };

    const unlock = () => {
      locked = false;
      syncLayers();
      armWhenIdle();
    };

    const goTo = (next: number) => {
      const clamped = Math.max(0, Math.min(lastIndex, next));
      if (locked || clamped === index) {
        return;
      }

      locked = true;
      armed = false;
      const previous = index;
      index = clamped;

      window.clearTimeout(morphTimer);
      syncLayers();
      emit(SLIDE_CHANGE_EVENT, index, previous);

      const onSettled = (event: Event) => {
        const { index: settled } = (event as CustomEvent<SlideChangeDetail>)
          .detail;
        if (settled !== index) {
          return;
        }
        window.removeEventListener(SLIDE_SETTLE_EVENT, onSettled);
        window.clearTimeout(morphTimer);
        unlock();
      };

      window.addEventListener(SLIDE_SETTLE_EVENT, onSettled);
      morphTimer = window.setTimeout(() => {
        window.removeEventListener(SLIDE_SETTLE_EVENT, onSettled);
        unlock();
      }, morphWait);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (locked || !armed) {
        armWhenIdle();
        return;
      }

      const dy = wheelDelta(event);
      if (dy > WHEEL_THRESHOLD) {
        goTo(index + 1);
        return;
      }

      if (dy < -WHEEL_THRESHOLD) {
        goTo(index - 1);
      }
    };

    const observer = Observer.create({
      target: window,
      type: "touch,pointer",
      tolerance: TOUCH_TOLERANCE,
      preventDefault: true,
      ignore: "a, button, input, textarea, select",
      onUp: () => goTo(index + 1),
      onDown: () => goTo(index - 1),
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        goTo(index + 1);
        return;
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        goTo(index - 1);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        goTo(lastIndex);
      }
    };

    const onResize = () => {
      gsap.set(track, { y: 0, yPercent: 0, force3D: true });
    };

    const blockTouchScroll = (event: TouchEvent) => {
      event.preventDefault();
    };

    syncLayers();
    gsap.set(track, { y: 0, yPercent: 0, force3D: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", blockTouchScroll, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(morphTimer);
      window.clearTimeout(armTimer);
      observer.kill();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", blockTouchScroll);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <main ref={mainRef} className={styles.root}>
      <div ref={trackRef} className={styles.track} data-slide-track>
        {children}
      </div>
    </main>
  );
}
