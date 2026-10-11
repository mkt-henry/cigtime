// One night and one day photograph per room, exported as large and small WebP in public/scenes.
const SCENE_ALTS: Record<string, [night: string, day: string]> = {
  rooftop: [
    "City skyline at night seen from a concrete rooftop ledge",
    "City skyline on a sunny afternoon seen from a concrete rooftop ledge",
  ],
  "let-it-out": [
    "Rain falling on a lit fire escape above a city street at night",
    "A wet fire escape drying in the sun above a city street",
  ],
  "unsent-replies": [
    "A glowing phone left on a wet back-door step at night",
    "A phone left on a sunlit back-door step under leaf shadows",
  ],
  "tiny-rants": [
    "A lit corner convenience store with vending machines on a rainy night",
    "A corner convenience store with vending machines on a clear sunny day",
  ],
  silent: [
    "A mug on a foggy balcony railing above a quiet city at dusk",
    "A mug on a balcony railing above a quiet city on a bright morning",
  ],
};

const HERO_ALTS = [
  "Smoke rising from an ashtray on a rooftop ledge over the city at dusk",
  "Smoke rising from an ashtray on a rooftop ledge over the city in the morning sun",
];

function photo(name: string, alt: string, day: boolean) {
  const base = `/scenes/${name}${day ? "-day" : ""}`;
  return { alt, large: `${base}.webp`, small: `${base}-sm.webp` };
}

export function sceneFor(slug: string, day = false) {
  const name = slug in SCENE_ALTS ? slug : "rooftop";
  return photo(name, SCENE_ALTS[name][day ? 1 : 0], day);
}

export function heroScene(day = false) {
  return photo("hero", HERO_ALTS[day ? 1 : 0], day);
}
