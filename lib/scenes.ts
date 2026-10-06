// One photograph per room, exported as large and small WebP in public/scenes.
const SCENE_SLUGS = ["rooftop", "let-it-out", "unsent-replies", "tiny-rants", "silent"];

export function sceneFor(slug: string) {
  const name = SCENE_SLUGS.includes(slug) ? slug : "rooftop";
  return { large: `/scenes/${name}.webp`, small: `/scenes/${name}-sm.webp` };
}
