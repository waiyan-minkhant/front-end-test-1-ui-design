# Fluffy Hugs — front-end scene

A three-slide, full-viewport homepage. Scroll, swipe, or keyboard (arrows, space, Home/End) snap between slides. Slides 1–3 share one overlay scene: there is no vertical page translate. The hero character is a single Lottie instance that morphs in place.

## Stack

- Next.js 16 (App Router) + React 19
- GSAP 3 + Observer (wheel/touch lock, morph timelines)
- `lottie-react` (`LottieSvg`) and `lottie-web` (crowd still rasterization)
- Sass modules and design tokens in `src/styles/_variables.scss`

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production: `npm run build` then `npm start`. Lint: `npm run lint`.

## Boot

[`src/components/home-splash/home-splash.tsx`](src/components/home-splash/home-splash.tsx) keeps the loading overlay up until:

1. Crowd stills are ready ([`src/lib/crowd-stills.ts`](src/lib/crowd-stills.ts) rasterizes hue-tinted hero frames)
2. The scene fires `slidewarm` after morph 1→2, walk Lottie, and Slide 2/3 images are decoded

There is no minimum splash duration. When the overlay hides, `homeready` restarts the crowd bob (CSS animations pause while the home layer is `visibility: hidden`).

[`src/app/page.tsx`](src/app/page.tsx) preloads the hero APNG/JSON, blob SVGs, animal SVGs, and hanging cat.

## Scene architecture

[`src/components/slide-snap/slide-snap.tsx`](src/components/slide-snap/slide-snap.tsx) owns input and slide index. All three `<section>`s live in [`SceneOneTwo`](src/components/slides/scene-one-two.tsx) (DOM order: Slide 3, Slide 2, Slide 1). The track does not move on Y; every adjacent change is a morph that ends with `slidesettle`.

```
index 0  Slide 1  crowd, standing hero (bob)
index 1  Slide 2  vertical blob drift, hero on back, slow-mo walk
index 2  Slide 3  dual leftward layers, standing walk, Japanese copy, hanging cat
```

Chrome ([`src/components/header/header.tsx`](src/components/header/header.tsx)) is fixed: logo (hidden on slide 2), socials, “view collection”. Padding tokens: `--chrome-padding-x` / `--chrome-padding-top` / `--chrome-footer-bottom`.

## Morphs

Owned by [`src/components/slides/scene-one-two.tsx`](src/components/slides/scene-one-two.tsx). Duration: `SLIDE_MORPH_DURATION` (0.8s) in [`src/lib/slides.ts`](src/lib/slides.ts). `prefers-reduced-motion` sets duration to 0.

| Transition | Hero | Background |
| --- | --- | --- |
| 1 → 2 | Scale/translate to slide 2 slot, rotate −90°, still → slow walk (`0.35`) | Crowd exits, cream blobs fade in |
| 2 → 3 | Slot 2 → slot 3, rotate −90° → 0° (clockwise), walk speed `1` | Slide 2 blobs/logo out, slide 3 stage in |
| 3 → 2 / 2 → 1 | Reverse of the above; rest pose is pinned so invalidate/resize cannot leave the hero lying | Matching crossfade |

Hero walk control: [`src/components/slides/hero-lottie.tsx`](src/components/slides/hero-lottie.tsx) (`setHeroWalkSpeed`, `playHeroWalk`, `pauseHeroWalk`). Hidden slots: `[data-hero-slot]` (slide 2), `[data-hero-slot-3]` (slide 3; shoes clip below the viewport).

## Slide 3 field

- Blob layer: slower infinite `x` marquee of `public/assets/vectors/blob-*.svg`
- Animal layer: faster marquee; sequential body-clip puff (head static)
- Copy: three Japanese lines, per-character wave; tokens `--font-family-japanese`, `--letter-spacing-japanese-hero`, `--japanese-text-shadow`
- Top-right: CSS paper fold + `public/assets/vectors/hanging-cat.png` (swing from the paws)

Animal art is the SVGs in `/public/assets/vectors` (koala, pig, chipmunk, deer, rat). There are no separate cat/panda files.

## Tokens and assets

- Tokens: [`src/styles/_variables.scss`](src/styles/_variables.scss), globals in [`src/styles/globals.scss`](src/styles/globals.scss)
- Display/body: Next `Fredoka` / `Plus Jakarta Sans`. Japanese stack names `fot-udmarugo-large-pr6n` with Hiragino / Arial Rounded fallbacks (Adobe kit not loaded)
- Hero Lottie: `public/assets/animations/hero-character.json` (notes/floor layers hidden in [`src/lib/hero-animation.ts`](src/lib/hero-animation.ts))
