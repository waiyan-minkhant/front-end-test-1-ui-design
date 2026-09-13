export const SLIDE_SNAP_DURATION = 0.65;
export const SLIDE_MORPH_DURATION = 0.8;
export const SLIDE_BOB_HOLD = 0.05;
export const SLIDE_CHANGE_EVENT = "slidechange";
export const SLIDE_SETTLE_EVENT = "slidesettle";
export const SLIDE_WARM_EVENT = "slidewarm";
export const HOME_READY_EVENT = "homeready";

export type SlideChangeDetail = {
  index: number;
  previous: number;
};
