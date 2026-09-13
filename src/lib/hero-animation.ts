import rawAnimation from "../../public/assets/animations/hero-character.json";

type LottieLayer = {
  nm: string;
  ks: Record<string, unknown>;
};

type LottieData = {
  layers: LottieLayer[];
  [key: string]: unknown;
};

const HIDDEN_LAYER_NAMES = new Set([
  "Lottie Logo",
  "MUSIC NOTE NULL",
  "Music Note_02",
  "Music Note_03",
  "Music Note_04",
  "FLOOR LINE",
]);

function withoutNotes(data: LottieData): LottieData {
  return {
    ...data,
    layers: data.layers.map((layer) =>
      HIDDEN_LAYER_NAMES.has(layer.nm)
        ? { ...layer, ks: { ...layer.ks, o: { a: 0, k: 0 } } }
        : layer,
    ),
  };
}

export const HERO_LOTTIE = withoutNotes(rawAnimation as LottieData);
export const STILL_FRAME = 30;
export const WALK_SEGMENT = [30, 62] as const;

export const CROWD_HUES = [
  "80deg",
  "110deg",
  "145deg",
  "175deg",
  "205deg",
  "235deg",
  "265deg",
  "295deg",
] as const;
