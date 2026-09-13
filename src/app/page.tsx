import { preload } from "react-dom";
import { HomeSplash } from "@/components/home-splash/home-splash";
import { Header } from "@/components/header/header";
import { SlideSnap } from "@/components/slide-snap/slide-snap";
import { SceneOneTwo } from "@/components/slides/scene-one-two";

const ANIMALS = [
  "animal-chipmunk",
  "animal-koala",
  "animal-pig",
  "animal-deer",
  "animal-rat",
] as const;

export default function HomePage() {
  preload("/assets/animations/hero-character.png", {
    as: "image",
    type: "image/png",
    fetchPriority: "high",
  });
  preload("/assets/animations/hero-character.json", {
    as: "fetch",
    crossOrigin: "anonymous",
  });
  preload("/assets/crowd/hero-still-2x.webp", {
    as: "image",
    type: "image/webp",
    imageSrcSet:
      "/assets/crowd/hero-still-1x.webp 1x, /assets/crowd/hero-still-2x.webp 2x",
  });
  for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    preload(`/assets/vectors/blob-${n}.svg`, {
      as: "image",
      type: "image/svg+xml",
    });
  }
  for (const animal of ANIMALS) {
    preload(`/assets/vectors/${animal}.svg`, {
      as: "image",
      type: "image/svg+xml",
    });
  }
  preload("/assets/vectors/hanging-cat.png", {
    as: "image",
    type: "image/png",
  });

  return (
    <HomeSplash>
      <Header />
      <SlideSnap>
        <SceneOneTwo />
      </SlideSnap>
    </HomeSplash>
  );
}
