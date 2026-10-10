// One photograph per room, exported as large and small WebP in public/scenes.
const SCENE_ALTS: Record<string, string> = {
  rooftop: "City skyline at night seen from a concrete rooftop ledge",
  "let-it-out": "Rain falling on a lit fire escape above a city street at night",
  "unsent-replies": "A glowing phone left on a wet back-door step at night",
  "tiny-rants": "A lit corner convenience store with vending machines on a rainy night",
  silent: "A mug on a foggy balcony railing above a quiet city at dusk",
};

export const HERO_ALT = "Smoke rising from an ashtray on a rooftop ledge over the city at dusk";

export function sceneFor(slug: string) {
  const name = slug in SCENE_ALTS ? slug : "rooftop";
  return { alt: SCENE_ALTS[name], large: `/scenes/${name}.webp`, small: `/scenes/${name}-sm.webp` };
}
