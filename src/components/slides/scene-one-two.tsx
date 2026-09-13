"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import {
  HOME_READY_EVENT,
  SLIDE_BOB_HOLD,
  SLIDE_CHANGE_EVENT,
  SLIDE_MORPH_DURATION,
  SLIDE_SETTLE_EVENT,
  SLIDE_WARM_EVENT,
  type SlideChangeDetail,
} from "@/lib/slides";
import {
  HERO_WALK_NORMAL,
  HERO_WALK_SLOW,
  isHeroWalkReady,
  pauseHeroWalk,
  playHeroWalk,
  primeHeroWalk,
  setHeroWalkSpeed,
} from "./hero-lottie";
import { SlideOne } from "./SlideOne";
import { SlideTwo } from "./SlideTwo";
import { SlideThree } from "./SlideThree";
import styles from "./scene-one-two.module.scss";

export function SceneOneTwo() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) {
      return;
    }

    const crowdLayer = scene.querySelector<HTMLElement>("[data-crowd-layer]");
    const crowdChars = [...scene.querySelectorAll<HTMLElement>("[data-crowd]")];
    const crowd = [...scene.querySelectorAll<HTMLElement>("[data-crowd-move]")];
    const hero = scene.querySelector<HTMLElement>("[data-hero]");
    const move = scene.querySelector<HTMLElement>("[data-hero-move]");
    const spin = scene.querySelector<HTMLElement>("[data-hero-spin]");
    const breath = scene.querySelector<HTMLElement>("[data-hero-breath]");
    const still = scene.querySelector<HTMLElement>("[data-hero-still]");
    const heroLive = scene.querySelector<HTMLElement>("[data-hero-live]");
    const heroBitmap = scene.querySelector<HTMLElement>("[data-hero-bitmap]");
    const walk = scene.querySelector<HTMLElement>("[data-hero-walk]");
    const bobs = hero ? [hero, ...crowdChars] : crowdChars;
    const backdrop = scene.querySelector<HTMLElement>(
      "[data-slide-one-backdrop]",
    );
    const blobsStage = scene.querySelector<HTMLElement>("[data-blobs-stage]");
    const blobsParallax = scene.querySelector<HTMLElement>(
      "[data-blobs-parallax]",
    );
    const blobsTrack = scene.querySelector<HTMLElement>("[data-blobs-track]");
    const logo = scene.querySelector<HTMLElement>("[data-slide-two-logo]");
    const slot = scene.querySelector<HTMLElement>("[data-hero-slot]");
    const slot3 = scene.querySelector<HTMLElement>("[data-hero-slot-3]");
    const threeStage = scene.querySelector<HTMLElement>(
      "[data-slide-three-stage]",
    );
    const threeBlobsTrack = scene.querySelector<HTMLElement>(
      "[data-three-blobs-track]",
    );
    const threeAnimalsTrack = scene.querySelector<HTMLElement>(
      "[data-three-animals-track]",
    );

    if (
      !crowdLayer ||
      crowd.length === 0 ||
      crowd.length !== crowdChars.length ||
      !hero ||
      !move ||
      !spin ||
      !breath ||
      !still ||
      !heroLive ||
      !heroBitmap ||
      !walk ||
      !backdrop ||
      !blobsStage ||
      !blobsParallax ||
      !blobsTrack ||
      !logo ||
      !slot ||
      !slot3 ||
      !threeStage ||
      !threeBlobsTrack ||
      !threeAnimalsTrack
    ) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = reducedMotion ? 0 : SLIDE_MORPH_DURATION;
    const bobAt = reducedMotion ? 0 : SLIDE_BOB_HOLD;
    const ease = "power3.inOut";

    let heroX = 0;
    let heroY = 0;
    let heroScale = 1;
    let heroX3 = 0;
    let heroY3 = 0;
    let heroScale3 = 1;
    const crowdX: number[] = [];
    const crowdY: number[] = [];
    let bobTimer = 0;

    const freezeBobAtRest = () => {
      bobs.forEach((el) => {
        el.style.animation = "none";
      });
    };

    const pauseBob = () => {
      bobs.forEach((el) => {
        el.style.animationPlayState = "paused";
      });
    };

    const restartBob = () => {
      bobs.forEach((el) => {
        el.style.animation = "none";
      });
      void scene.offsetWidth;
      bobs.forEach((el) => {
        el.style.removeProperty("animation");
        const delay =
          getComputedStyle(el).getPropertyValue("--bob-delay").trim() || "0s";
        el.style.animationDelay = delay;
        el.style.animationPlayState = "running";
      });
    };

    const cancelHold = () => {
      window.clearTimeout(bobTimer);
      bobTimer = 0;
    };

    const hold = (fn: () => void) => {
      cancelHold();
      bobTimer = window.setTimeout(() => {
        bobTimer = 0;
        fn();
      }, bobAt * 1000);
    };

    const showMorphBitmaps = () => {
      gsap.killTweensOf(heroLive);
      gsap.killTweensOf(heroBitmap);
      gsap.set(heroBitmap, { autoAlpha: 1 });
      gsap.set(heroLive, { autoAlpha: 0 });
    };

    const restoreTicker = () => {
      gsap.ticker.lagSmoothing(500, 33);
    };

    const slotOffset = (
      slotEl: HTMLElement,
      restCx: number,
      restCy: number,
      restW: number,
      restH: number,
    ) => {
      const slotRect = slotEl.getBoundingClientRect();
      const nextScale = Math.min(
        slotRect.width / restW,
        slotRect.height / restH,
      );
      return {
        x: slotRect.left + slotRect.width / 2 - restCx,
        y: slotRect.top + slotRect.height / 2 - restCy,
        scale: Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1,
      };
    };

    const captureTargets = () => {
      const pad = window.innerHeight * 1.8;
      const exitX = window.innerWidth + pad;
      const exitY = window.innerHeight + pad;

      crowd.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const gx = parseFloat(String(gsap.getProperty(el, "x"))) || 0;
        const gy = parseFloat(String(gsap.getProperty(el, "y"))) || 0;
        crowdX[i] = exitX - (rect.left + rect.width / 2 - gx);
        crowdY[i] = exitY - (rect.top + rect.height / 2 - gy);
      });

      const heroRect = move.getBoundingClientRect();
      const mx = parseFloat(String(gsap.getProperty(move, "x"))) || 0;
      const my = parseFloat(String(gsap.getProperty(move, "y"))) || 0;
      const ms = parseFloat(String(gsap.getProperty(move, "scale"))) || 1;
      const restCx = heroRect.left + heroRect.width / 2 - mx;
      const restCy = heroRect.top + heroRect.height / 2 - my;
      const restW = heroRect.width / (ms || 1);
      const restH = heroRect.height / (ms || 1);
      const two = slotOffset(slot, restCx, restCy, restW, restH);
      const three = slotOffset(slot3, restCx, restCy, restW, restH);
      heroX = two.x;
      heroY = two.y;
      heroScale = two.scale;
      heroX3 = three.x;
      heroY3 = three.y;
      heroScale3 = three.scale;
    };

    const captureAtRest = () => {
      const prev = bobs.map((el) => el.style.animation);
      bobs.forEach((el) => {
        el.style.animation = "none";
      });
      captureTargets();
      bobs.forEach((el, i) => {
        el.style.animation = prev[i];
      });
    };

    gsap.set(crowdLayer, { autoAlpha: 1 });
    gsap.set(crowd, { x: 0, y: 0, force3D: true });
    gsap.set(move, {
      x: 0,
      y: 0,
      scale: 1,
      transformOrigin: "50% 50%",
      force3D: true,
    });
    gsap.set(spin, { rotation: 0 });
    gsap.set(breath, { y: 0, rotation: 0 });
    gsap.set(still, { autoAlpha: 1 });
    gsap.set(heroLive, { autoAlpha: 0 });
    gsap.set(heroBitmap, { autoAlpha: 1 });
    gsap.set(walk, { autoAlpha: 0 });
    gsap.set(backdrop, { autoAlpha: 1 });
    gsap.set(blobsStage, { autoAlpha: 0 });
    gsap.set(blobsParallax, { yPercent: 0 });
    gsap.set(logo, { autoAlpha: 0 });
    gsap.set(threeStage, { autoAlpha: 0 });
    gsap.set([threeBlobsTrack, threeAnimalsTrack], { x: 0, xPercent: 0 });

    let idle: gsap.core.Tween | undefined;
    let drift: gsap.core.Tween | undefined;
    let blobDrift: gsap.core.Tween | undefined;
    let animalDrift: gsap.core.Tween | undefined;
    let puff: gsap.core.Timeline | undefined;
    let settleIndex = 1;
    let settlePrevious = 0;

    const emitSettle = () => {
      window.dispatchEvent(
        new CustomEvent<SlideChangeDetail>(SLIDE_SETTLE_EVENT, {
          detail: { index: settleIndex, previous: settlePrevious },
        }),
      );
    };

    const stopIdle = () => {
      idle?.kill();
      idle = undefined;
      gsap.set(breath, { y: 0, rotation: 0 });
    };

    const startIdle = () => {
      if (reducedMotion || idle) {
        return;
      }

      idle = gsap.to(breath, {
        y: 10,
        rotation: 1.5,
        duration: 2.4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    };

    const stopDrift = () => {
      drift?.kill();
      drift = undefined;
      gsap.set(blobsTrack, { y: 0, yPercent: 0 });
    };

    const makeDrift = (fromProgress = 0) => {
      const tile = blobsTrack.firstElementChild as HTMLElement | null;
      const tileH = tile?.offsetHeight ?? 0;
      if (!tileH) {
        return;
      }

      const seconds = tileH / Math.max(window.innerHeight / 5.5, 1);
      drift?.kill();
      gsap.set(blobsTrack, { yPercent: 0 });
      drift = gsap.fromTo(
        blobsTrack,
        { y: 0 },
        {
          y: -tileH,
          duration: seconds,
          ease: "none",
          repeat: -1,
        },
      );
      if (fromProgress) {
        drift.progress(fromProgress);
      }
    };

    const startDrift = () => {
      if (reducedMotion || drift) {
        return;
      }

      makeDrift(0);
    };

    const restartDrift = () => {
      if (!drift) {
        return;
      }

      makeDrift(drift.progress());
    };

    const makeXDrift = (
      track: HTMLElement,
      pxPerSecond: number,
      fromProgress = 0,
    ) => {
      const tile = track.firstElementChild as HTMLElement | null;
      const tileW = tile?.offsetWidth ?? 0;
      if (!tileW) {
        return;
      }

      const seconds = tileW / Math.max(pxPerSecond, 1);
      gsap.set(track, { xPercent: 0 });
      const tween = gsap.fromTo(
        track,
        { x: 0 },
        {
          x: -tileW,
          duration: seconds,
          ease: "none",
          repeat: -1,
        },
      );
      if (fromProgress) {
        tween.progress(fromProgress);
      }
      return tween;
    };

    const stopPuff = () => {
      puff?.kill();
      puff = undefined;
      gsap.set(scene.querySelectorAll("[data-animal-puff]"), {
        scaleX: 1,
        scaleY: 1,
      });
    };

    const startPuff = () => {
      if (reducedMotion || puff) {
        return;
      }

      const tile = threeAnimalsTrack.firstElementChild as HTMLElement | null;
      if (!tile) {
        return;
      }

      const count = tile.querySelectorAll("[data-animal-puff]").length;
      const tiles = [...threeAnimalsTrack.children] as HTMLElement[];
      puff = gsap.timeline({ repeat: -1 });

      for (let i = 0; i < count; i += 1) {
        const pair = tiles
          .map(
            (field) =>
              field.querySelectorAll<HTMLElement>("[data-animal-puff]")[i],
          )
          .filter(Boolean);
        if (pair.length === 0) {
          continue;
        }

        puff
          .to(pair, {
            scaleX: 1.08,
            scaleY: 1.34,
            duration: 0.48,
            ease: "back.out(2.2)",
            transformOrigin: "50% 48%",
          })
          .to(pair, {
            scaleX: 1,
            scaleY: 1,
            duration: 0.55,
            ease: "power2.inOut",
          })
          .to({}, { duration: 0.28 });
      }
    };

    const resetThreeTracks = () => {
      gsap.set([threeBlobsTrack, threeAnimalsTrack], { x: 0, xPercent: 0 });
    };

    const stopThreeLoops = (reset = true) => {
      blobDrift?.kill();
      animalDrift?.kill();
      blobDrift = undefined;
      animalDrift = undefined;
      stopPuff();
      if (reset) {
        resetThreeTracks();
      }
    };

    const makeThreeDrifts = (blobProgress = 0, animalProgress = 0) => {
      blobDrift?.kill();
      animalDrift?.kill();
      blobDrift = makeXDrift(
        threeBlobsTrack,
        window.innerWidth / 18,
        blobProgress,
      );
      animalDrift = makeXDrift(
        threeAnimalsTrack,
        window.innerWidth / 10,
        animalProgress,
      );
    };

    const startThreeLoops = () => {
      if (reducedMotion) {
        return;
      }

      if (!blobDrift || !animalDrift) {
        makeThreeDrifts(0, 0);
      }
      startPuff();
    };

    const restartThreeLoops = () => {
      if (!blobDrift && !animalDrift) {
        return;
      }

      const blobProgress = blobDrift?.progress() ?? 0;
      const animalProgress = animalDrift?.progress() ?? 0;
      makeThreeDrifts(blobProgress, animalProgress);
    };

    const morph = gsap.timeline({
      paused: true,
      defaults: { ease },
      onComplete: () => {
        emitSettle();
        hold(() => {
          restoreTicker();
          startIdle();
          startDrift();
        });
      },
      onReverseComplete: () => {
        stopIdle();
        stopDrift();
        pauseHeroWalk();
        setHeroWalkSpeed(HERO_WALK_SLOW);
        gsap.set(move, {
          x: 0,
          y: 0,
          scale: 1,
          transformOrigin: "50% 50%",
        });
        gsap.set(spin, { rotation: 0 });
        emitSettle();
        restoreTicker();
        restartBob();
      },
    });

    morph
      .to(
        crowd,
        {
          x: (i) => crowdX[i] ?? 0,
          y: (i) => crowdY[i] ?? 0,
          duration,
        },
        0,
      )
      .to(
        crowdLayer,
        {
          autoAlpha: 0,
          duration: duration * 0.4,
          ease: "none",
        },
        duration * 0.25,
      )
      .to(backdrop, { autoAlpha: 0, duration: duration * 0.55 }, 0)
      .to(blobsStage, { autoAlpha: 1, duration }, 0)
      .to(blobsParallax, { yPercent: -20, duration }, 0)
      .to(logo, { autoAlpha: 1, duration: duration * 0.7 }, duration * 0.2)
      .fromTo(
        move,
        { x: 0, y: 0, scale: 1, transformOrigin: "50% 50%" },
        {
          x: () => heroX,
          y: () => heroY,
          scale: () => heroScale,
          transformOrigin: "50% 50%",
          duration,
        },
        0,
      )
      .to(spin, { rotation: -90, duration }, 0)
      .to(still, { autoAlpha: 0, duration: duration * 0.35 }, duration * 0.28)
      .to(
        walk,
        {
          autoAlpha: 1,
          duration: duration * 0.35,
          onStart: playHeroWalk,
        },
        duration * 0.28,
      );

    const morph23 = gsap.timeline({
      paused: true,
      defaults: { ease, immediateRender: false },
      onComplete: () => {
        emitSettle();
        hold(() => {
          restoreTicker();
          startThreeLoops();
        });
      },
      onReverseComplete: () => {
        stopThreeLoops(true);
        setHeroWalkSpeed(HERO_WALK_SLOW);
        applyHeroToSlot2();
        emitSettle();
        hold(() => {
          restoreTicker();
          startIdle();
          startDrift();
        });
      },
    });

    morph23
      .fromTo(
        move,
        {
          x: () => heroX,
          y: () => heroY,
          scale: () => heroScale,
          transformOrigin: "50% 50%",
        },
        {
          x: () => heroX3,
          y: () => heroY3,
          scale: () => heroScale3,
          transformOrigin: "50% 50%",
          duration,
        },
        0,
      )
      .fromTo(spin, { rotation: -90 }, { rotation: 0, duration }, 0)
      .to(blobsStage, { autoAlpha: 0, duration }, 0)
      .to(logo, { autoAlpha: 0, duration: duration * 0.45 }, 0)
      .to(threeStage, { autoAlpha: 1, duration }, 0);

    const invalidateMove = (timeline: gsap.core.Timeline) => {
      timeline.getTweensOf(move).forEach((tween) => {
        tween.invalidate();
      });
      timeline.getTweensOf(spin).forEach((tween) => {
        tween.invalidate();
      });
    };

    const applyHeroToSlot2 = () => {
      captureTargets();
      gsap.set(move, { x: heroX, y: heroY, scale: heroScale });
      gsap.set(spin, { rotation: -90 });
    };

    const applyHeroToSlot3 = () => {
      captureTargets();
      invalidateMove(morph23);
      morph23.progress(morph23.progress(), true);
      gsap.set(move, { x: heroX3, y: heroY3, scale: heroScale3 });
      gsap.set(spin, { rotation: 0 });
    };

    const jumpToSlide1 = () => {
      cancelHold();
      stopIdle();
      stopDrift();
      stopThreeLoops();
      setHeroWalkSpeed(HERO_WALK_SLOW);
      pauseHeroWalk();
      morph23.progress(0, true);
      freezeBobAtRest();
      morph.progress(0, true);
      gsap.set(move, {
        x: 0,
        y: 0,
        scale: 1,
        transformOrigin: "50% 50%",
      });
      gsap.set(spin, { rotation: 0 });
      restoreTicker();
      restartBob();
      emitSettle();
    };

    const jumpToSlide3 = () => {
      cancelHold();
      stopIdle();
      stopDrift();
      pauseBob();
      showMorphBitmaps();
      primeHeroWalk();
      playHeroWalk();
      setHeroWalkSpeed(HERO_WALK_NORMAL);
      captureTargets();
      invalidateMove(morph23);
      morph.progress(1, true);
      morph23.progress(1, true);
      restoreTicker();
      startThreeLoops();
      emitSettle();
    };

    const onChange = (event: Event) => {
      const { index, previous } = (event as CustomEvent<SlideChangeDetail>)
        .detail;

      settleIndex = index;
      settlePrevious = previous;

      if (Math.abs(index - previous) > 1) {
        if (index === 0) {
          jumpToSlide1();
          return;
        }
        if (index === 2) {
          jumpToSlide3();
        }
        return;
      }

      if (index === 1 && previous === 0) {
        cancelHold();
        stopIdle();
        pauseBob();
        showMorphBitmaps();
        setHeroWalkSpeed(HERO_WALK_SLOW);
        primeHeroWalk();
        gsap.ticker.lagSmoothing(0);
        morph.play();
        return;
      }

      if (index === 0 && previous === 1) {
        cancelHold();
        stopIdle();
        stopDrift();
        pauseHeroWalk();
        freezeBobAtRest();
        captureTargets();
        gsap.set(move, {
          x: heroX,
          y: heroY,
          scale: heroScale,
          transformOrigin: "50% 50%",
        });
        gsap.set(spin, { rotation: -90 });
        gsap.ticker.lagSmoothing(0);
        morph.reverse();
        return;
      }

      if (index === 2 && previous === 1) {
        cancelHold();
        stopIdle();
        stopDrift();
        captureTargets();
        invalidateMove(morph23);
        setHeroWalkSpeed(HERO_WALK_NORMAL);
        gsap.ticker.lagSmoothing(0);
        morph23.play();
        return;
      }

      if (index === 1 && previous === 2) {
        cancelHold();
        stopThreeLoops(false);
        captureTargets();
        invalidateMove(morph23);
        setHeroWalkSpeed(HERO_WALK_SLOW);
        gsap.ticker.lagSmoothing(0);
        morph23.reverse();
      }
    };

    let resizeRaf = 0;
    const onResize = () => {
      if (resizeRaf) {
        return;
      }
      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0;
        if (morph.isActive() || morph23.isActive()) {
          return;
        }
        if (morph.progress() === 0) {
          captureAtRest();
          return;
        }
        if (morph23.progress() === 1) {
          applyHeroToSlot3();
          restartThreeLoops();
          return;
        }
        applyHeroToSlot2();
        restartDrift();
      });
    };

    const onHomeReady = () => {
      if (morph.progress() === 0 && morph23.progress() === 0) {
        restartBob();
      }
    };

    captureAtRest();
    window.addEventListener(SLIDE_CHANGE_EVENT, onChange);
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    window.addEventListener(HOME_READY_EVENT, onHomeReady);

    let walkWarmed = false;
    let morphWarmed = false;
    let warmTimer = 0;

    const emitWarm = () => {
      window.dispatchEvent(new Event(SLIDE_WARM_EVENT));
    };

    const maybeEmitWarm = () => {
      if (walkWarmed && morphWarmed) {
        emitWarm();
      }
    };

    const decodeImages = (root: HTMLElement) =>
      Promise.all(
        [...root.querySelectorAll<HTMLImageElement>("img")].map((img) =>
          img.decode().catch(() => undefined),
        ),
      );

    const warmMorph = () => {
      void Promise.all([decodeImages(blobsStage), decodeImages(threeStage)])
        .catch(() => undefined)
        .finally(() => {
          gsap.set([blobsStage, logo], { autoAlpha: 0.001 });
          morph.progress(0.04, true);
          morph.progress(0, true);
          requestAnimationFrame(() => {
            gsap.set(blobsStage, { autoAlpha: 0 });
            gsap.set(logo, { autoAlpha: 0 });
            gsap.set(threeStage, { autoAlpha: 0 });
            morphWarmed = true;
            maybeEmitWarm();
          });
        });
    };

    const warmWalk = (tries = 0) => {
      if (!isHeroWalkReady()) {
        if (tries > 120) {
          walkWarmed = true;
          maybeEmitWarm();
          return;
        }
        warmTimer = window.setTimeout(() => warmWalk(tries + 1), 50);
        return;
      }

      gsap.set(walk, { autoAlpha: 0.001 });
      primeHeroWalk();
      playHeroWalk();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          pauseHeroWalk();
          primeHeroWalk();
          setHeroWalkSpeed(HERO_WALK_SLOW);
          gsap.set(walk, { autoAlpha: 0 });
          walkWarmed = true;
          maybeEmitWarm();
        });
      });
    };

    warmMorph();
    warmWalk();

    return () => {
      window.removeEventListener(SLIDE_CHANGE_EVENT, onChange);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.removeEventListener(HOME_READY_EVENT, onHomeReady);
      window.cancelAnimationFrame(resizeRaf);
      window.clearTimeout(warmTimer);
      cancelHold();
      stopIdle();
      stopDrift();
      stopThreeLoops();
      gsap.ticker.lagSmoothing(500, 33);
      morph.kill();
      morph23.kill();
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      className={styles.scene}
      data-scene-12
      data-snap-page
      data-active
    >
      <SlideThree />
      <SlideTwo />
      <SlideOne />
    </div>
  );
}
