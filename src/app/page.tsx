import { preload } from "react-dom";
import { HomeSplash } from "@/components/home-splash/home-splash";
import { Header } from "@/components/header/header";
import { SlideOne } from "@/components/slides/SlideOne";
import { SlideTwo } from "@/components/slides/SlideTwo";
import { SlideThree } from "@/components/slides/SlideThree";

export default function HomePage() {
  preload("/assets/animations/hero-character.png", {
    as: "image",
    type: "image/png",
    fetchPriority: "high",
  });

  return (
    <HomeSplash>
      <Header />
      <main>
        <SlideOne />
        <SlideTwo />
        <SlideThree />
      </main>
    </HomeSplash>
  );
}
