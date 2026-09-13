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
import { HERO_WALK_SLOW, HERO_WALK_SRC } from "@/lib/hero-animation";
import {
  destroyHeroLottie,
  mountHeroLottie,
  pauseHeroRest,
  playHeroWalkAt,
  playHeroWalkSlow,
  setHeroWalkSpeed,
  sleepHeroLottie,
  wakeHeroLottie,
  whenHeroLottieReady,
} from "@/lib/hero-lottie";
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
    const heroBitmap = scene.querySelector<HTMLElement>("[data-hero-bitmap]");
    const lottieWrap = scene.querySelector<HTMLElement>("[data-hero-lottie]");
    const lottieHost = scene.querySelector<HTMLElement>(
      "[data-hero-lottie-host]",
    );
    const walk = scene.querySelector<HTMLElement>("[data-hero-walk]");
    const walkImg = walk?.querySelector<HTMLImageElement>("img");
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
      !heroBitmap ||
      !lottieWrap ||
      !lottieHost ||
      !walk ||
      !walkImg ||
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
      gsap.set(heroBitmap, { autoAlpha: 1 });
    };

    const restoreTicker = () => {
      gsap.ticker.lagSmoothing(500, 33);
    };

    const sleepLayer = (el: HTMLElement) => {
      el.style.contentVisibility = "hidden";
    };

    const wakeLayer = (el: HTMLElement) => {
      el.style.removeProperty("content-visibility");
    };

    const hideApng = () => {
      walkImg.removeAttribute("src");
      gsap.set(walk, { autoAlpha: 0 });
    };

    const showApng = () => {
      walkImg.src = HERO_WALK_SRC;
      gsap.set(walk, { autoAlpha: 1 });
    };

    const coverWithLottie = () => {
      wakeHeroLottie();
      pauseHeroRest();
      gsap.set(lottieWrap, { autoAlpha: 1 });
    };

    const hideLottie = () => {
      pauseHeroRest();
      sleepHeroLottie();
      gsap.set(lottieWrap, { autoAlpha: 0 });
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
    gsap.set(heroBitmap, { autoAlpha: 1 });
    gsap.set(lottieWrap, { autoAlpha: 0 });
    gsap.set(walk, { autoAlpha: 0 });
    gsap.set(backdrop, { autoAlpha: 1 });
    gsap.set(blobsStage, { autoAlpha: 0 });
    gsap.set(blobsParallax, { yPercent: 0 });
    gsap.set(logo, { autoAlpha: 0 });
    gsap.set(threeStage, { autoAlpha: 0 });
    gsap.set([threeBlobsTrack, threeAnimalsTrack], { x: 0, xPercent: 0 });
    sleepLayer(blobsStage);
    sleepLayer(threeStage);

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

    let stillFadeLocked = false;
    let reverseCut: gsap.core.Tween | undefined;

    let walkSpeedTween: gsap.core.Tween | undefined;

    const killWalkSpeed = () => {
      walkSpeedTween?.kill();
      walkSpeedTween = undefined;
    };

    const killReverseCut = () => {
      reverseCut?.kill();
      reverseCut = undefined;
    };

    const cutHeroToStill = () => {
      reverseCut = undefined;
      gsap.set(still, { autoAlpha: 1 });
      hideLottie();
    };

    const morph = gsap.timeline({
      paused: true,
      defaults: { ease },
      onComplete: () => {
        sleepLayer(crowdLayer);
        emitSettle();
        hold(() => {
          restoreTicker();
          startIdle();
          startDrift();
        });
      },
      onReverseComplete: () => {
        stillFadeLocked = false;
        killReverseCut();
        morph.getTweensOf(still).forEach((tween) => {
          tween.paused(false);
          tween.progress(0, true);
        });
        gsap.set(still, { autoAlpha: 1 });
        hideLottie();
        sleepLayer(blobsStage);
        stopIdle();
        stopDrift();
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
      .to(
        still,
        {
          autoAlpha: 0,
          duration: duration * 0.35,
          onStart: () => {
            if (!reducedMotion) {
              playHeroWalkSlow();
            }
          },
          onReverseStart: function () {
            if (stillFadeLocked) {
              this.pause();
            }
          },
        },
        duration * 0.28,
      );

    const morph23 = gsap.timeline({
      paused: true,
      defaults: { ease, immediateRender: false },
      onComplete: () => {
        sleepLayer(blobsStage);
        emitSettle();
        hold(() => {
          restoreTicker();
          startThreeLoops();
        });
      },
      onReverseComplete: () => {
        sleepLayer(threeStage);
        stopThreeLoops(true);
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
      killWalkSpeed();
      killReverseCut();
      stopIdle();
      stopDrift();
      stopThreeLoops();
      wakeLayer(crowdLayer);
      sleepLayer(blobsStage);
      sleepLayer(threeStage);
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
      hideLottie();
      hideApng();
      restoreTicker();
      restartBob();
      emitSettle();
    };

    const jumpToSlide3 = () => {
      cancelHold();
      killWalkSpeed();
      killReverseCut();
      stopIdle();
      stopDrift();
      pauseBob();
      showMorphBitmaps();
      sleepLayer(crowdLayer);
      sleepLayer(blobsStage);
      wakeLayer(threeStage);
      captureTargets();
      invalidateMove(morph23);
      morph.progress(1, true);
      morph23.progress(1, true);
      hideLottie();
      showApng();
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
        killReverseCut();
        stopIdle();
        pauseBob();
        showMorphBitmaps();
        wakeLayer(blobsStage);
        coverWithLottie();
        morph.play();
        return;
      }

      if (index === 0 && previous === 1) {
        cancelHold();
        killWalkSpeed();
        stopIdle();
        stopDrift();
        freezeBobAtRest();
        wakeLayer(crowdLayer);
        captureTargets();
        gsap.set(move, {
          x: heroX,
          y: heroY,
          scale: heroScale,
          transformOrigin: "50% 50%",
        });
        gsap.set(spin, { rotation: -90 });
        stillFadeLocked = true;
        pauseHeroRest();
        wakeHeroLottie();
        gsap.set(lottieWrap, { autoAlpha: 1 });
        killReverseCut();
        if (duration === 0) {
          cutHeroToStill();
        } else {
          reverseCut = gsap.delayedCall(duration * 0.55, cutHeroToStill);
        }
        morph.reverse();
        return;
      }

      if (index === 2 && previous === 1) {
        cancelHold();
        killWalkSpeed();
        stopIdle();
        stopDrift();
        wakeLayer(threeStage);
        captureTargets();
        invalidateMove(morph23);
        showApng();
        hideLottie();
        morph23.play();
        return;
      }

      if (index === 1 && previous === 2) {
        cancelHold();
        killWalkSpeed();
        stopThreeLoops(false);
        wakeLayer(blobsStage);
        captureTargets();
        invalidateMove(morph23);
        coverWithLottie();
        hideApng();
        if (!reducedMotion) {
          playHeroWalkAt(1);
          const proxy = { speed: 1 };
          walkSpeedTween = gsap.to(proxy, {
            speed: HERO_WALK_SLOW,
            duration,
            ease,
            onUpdate: () => setHeroWalkSpeed(proxy.speed),
          });
        }
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
    let lottieWarmed = false;

    const emitWarm = () => {
      window.dispatchEvent(new Event(SLIDE_WARM_EVENT));
    };

    const maybeEmitWarm = () => {
      if (walkWarmed && morphWarmed && lottieWarmed) {
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
      wakeLayer(blobsStage);
      wakeLayer(threeStage);
      void Promise.all([decodeImages(blobsStage), decodeImages(threeStage)])
        .catch(() => undefined)
        .finally(() => {
          gsap.set([blobsStage, logo], { autoAlpha: 0.001 });
          morph.progress(0.04, true);
          morph.progress(0, true);
          hideLottie();
          hideApng();
          requestAnimationFrame(() => {
            gsap.set(blobsStage, { autoAlpha: 0 });
            gsap.set(logo, { autoAlpha: 0 });
            gsap.set(threeStage, { autoAlpha: 0 });
            sleepLayer(blobsStage);
            sleepLayer(threeStage);
            morphWarmed = true;
            maybeEmitWarm();
          });
        });
    };

    const warmWalk = () => {
      const image = new Image();
      image.src = HERO_WALK_SRC;
      void image
        .decode()
        .catch(() => undefined)
        .finally(() => {
          walkWarmed = true;
          maybeEmitWarm();
        });
    };

    const warmLottie = () => {
      void mountHeroLottie(lottieHost)
        .then(() => whenHeroLottieReady())
        .catch(() => undefined)
        .finally(() => {
          hideLottie();
          lottieWarmed = true;
          maybeEmitWarm();
        });
    };

    warmMorph();
    warmWalk();
    warmLottie();

    return () => {
      window.removeEventListener(SLIDE_CHANGE_EVENT, onChange);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.removeEventListener(HOME_READY_EVENT, onHomeReady);
      window.cancelAnimationFrame(resizeRaf);
      cancelHold();
      stopIdle();
      stopDrift();
      stopThreeLoops();
      killWalkSpeed();
      killReverseCut();
      destroyHeroLottie();
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
