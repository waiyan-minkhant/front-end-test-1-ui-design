import { preload } from "react-dom";
import { Outfit } from "next/font/google";
import { HomeSplash } from "@/components/home-splash/home-splash";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export default function HomePage() {
  preload("/lottie/main_character.png", {
    as: "image",
    type: "image/png",
    fetchPriority: "high",
  });

  return (
    <HomeSplash loadingClassName={outfit.className}>
      <main>
        <h1>front-end-test-1-ui-design</h1>
      </main>
    </HomeSplash>
  );
}
