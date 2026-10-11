// WebGL versions of the non-cigarette ritual objects (candy, incense, coffee, candle).
// Loaded on demand from RitualScene3D so three.js stays out of every other page.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type RitualHandle = { dispose(): void };

type Built = {
  root: THREE.Group;
  update(progress: number, time: number, dt: number): void;
  // Where the 2D ambient smoke/sparks should come from, if anywhere.
  ember?: THREE.Object3D;
  emberRate?: (progress: number) => number;
  view?: { y: number; z: number; look: number };
};

type MountOptions = {
  getProgress: () => number;
  ember: HTMLElement | null;
  reducedMotion: boolean;
};

// Must match the canvas height in RitualScene3D (150% of its box).
const CANVAS_HEADROOM = 1.5;

export function mountRitual(canvas: HTMLCanvasElement, objectKey: string, options: MountOptions): RitualHandle | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas, powerPreference: "low-power" });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const env = pmrem.fromScene(envScene, 0.04).texture;
  envScene.traverse((o) => disposeObject(o));
  scene.environment = env;
  scene.environmentIntensity = 0.35;

  // Night light: cool sky from above, warm street light from the front left, blue rim behind.
  scene.add(new THREE.HemisphereLight(0x8fa3c0, 0x1a1410, 0.55));
  const key = new THREE.DirectionalLight(0xffb36b, 1.7);
  key.position.set(-2.2, 3, 2.4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x7aa2ff, 1.3);
  rim.position.set(2.6, 1.6, -2.2);
  scene.add(rim);

  const built = buildObject(objectKey);
  const view = built.view ?? { look: 0.78, y: 2.25, z: 5.1 };
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, view.y, view.z);
  const stage = new THREE.Group();
  stage.add(contactShadow(objectKey === "candy" || objectKey === "ballpop" ? 1.2 : 2.3));
  stage.add(built.root);
  scene.add(stage);

  const pointer = { x: 0, y: 0 };
  function onPointer(event: PointerEvent) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  }
  if (!options.reducedMotion) window.addEventListener("pointermove", onPointer, { passive: true });

  let width = 0;
  let height = 0;
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // The canvas is CANVAS_HEADROOM taller than the object's box so smoke can rise
    // past it. Widen the view to match and aim higher so the object stays in the box.
    const base = THREE.MathUtils.degToRad(30);
    const half = Math.tan(base / 2);
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(half * CANVAS_HEADROOM));
    const distance = Math.hypot(view.y - view.look, view.z);
    camera.lookAt(0, view.look + (CANVAS_HEADROOM - 1) * distance * half, 0);
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  const emberWorld = new THREE.Vector3();
  let lastRate = "";
  function placeEmber(progress: number) {
    const el = options.ember;
    if (!el || !built.ember || !built.emberRate) return;
    built.ember.getWorldPosition(emberWorld).project(camera);
    el.style.left = `${canvas.offsetLeft + ((emberWorld.x + 1) / 2) * width}px`;
    el.style.top = `${canvas.offsetTop + ((1 - emberWorld.y) / 2) * height}px`;
    const rate = built.emberRate(progress).toFixed(2);
    if (rate !== lastRate) {
      lastRate = rate;
      el.setAttribute("data-ember", rate);
    }
  }

  let frame = 0;
  let last = performance.now();
  let time = 0;
  function tick(now: number) {
    frame = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    const progress = Math.min(1, Math.max(0, options.getProgress()));

    if (!options.reducedMotion) {
      stage.rotation.y += (pointer.x * 0.28 - stage.rotation.y) * 0.04;
      stage.rotation.x += (pointer.y * 0.06 - stage.rotation.x) * 0.04;
    }
    built.update(progress, time, dt);
    renderer.render(scene, camera);
    placeEmber(progress);
  }
  frame = requestAnimationFrame(tick);

  return {
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      options.ember?.removeAttribute("data-ember");
      scene.traverse((o) => disposeObject(o));
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

// Candies stand on a long stick, so the camera aims higher and sits a bit further back.
const CANDY_VIEW = { look: 1.2, y: 2.5, z: 6.2 };

function buildObject(objectKey: string): Built {
  if (objectKey === "candy") return { ...buildCandy(), view: CANDY_VIEW };
  if (objectKey === "ballpop") return { ...buildBallPop(), view: CANDY_VIEW };
  if (objectKey === "incense") return buildIncense();
  if (objectKey === "coffee") return buildCoffee();
  return buildCandle();
}

// ---------------------------------------------------------------- candle

function buildCandle(): Built {
  const root = new THREE.Group();

  const brass = new THREE.MeshStandardMaterial({ color: 0x8a6a45, metalness: 0.75, roughness: 0.32 });
  root.add(new THREE.Mesh(lathe([[0, 0], [0.92, 0], [1.0, 0.035], [1.03, 0.1], [0.95, 0.085], [0.6, 0.055], [0, 0.055]]), brass));

  const wax = new THREE.MeshPhysicalMaterial({
    color: 0xe6d6b8,
    emissive: 0xffffff,
    emissiveIntensity: 0.8,
    emissiveMap: verticalGlowTexture(),
    roughness: 0.48,
    sheen: 0.4,
    sheenColor: new THREE.Color(0xffe2b0),
  });
  const waxGeometry = new THREE.CylinderGeometry(0.38, 0.39, 1, 64, 1, true);
  waxGeometry.translate(0, 0.5, 0);
  const body = new THREE.Mesh(waxGeometry, wax);
  body.position.y = 0.055;
  root.add(body);

  // Melted pool on top, slightly glossier than the sides.
  const pool = new THREE.Mesh(
    new THREE.CircleGeometry(0.385, 64).rotateX(-Math.PI / 2),
    new THREE.MeshPhysicalMaterial({ color: 0xf7e3b6, emissive: 0xffa850, emissiveIntensity: 0.25, roughness: 0.12, clearcoat: 1 }),
  );
  root.add(pool);

  const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.014, 0.13, 8), new THREE.MeshStandardMaterial({ color: 0x1d1a17, roughness: 0.9 }));
  root.add(wick);

  const flame = new THREE.Group();
  const outer = new THREE.Sprite(new THREE.SpriteMaterial({ blending: THREE.AdditiveBlending, depthWrite: false, map: flameTexture(), transparent: true }));
  const core = new THREE.Sprite(
    new THREE.SpriteMaterial({ blending: THREE.AdditiveBlending, color: 0xbfd4ff, depthWrite: false, map: flameTexture(), opacity: 0.55, transparent: true }),
  );
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({ blending: THREE.AdditiveBlending, color: 0xff9a40, depthWrite: false, map: softDotTexture(), opacity: 0.35, transparent: true }),
  );
  halo.scale.setScalar(1.1);
  flame.add(halo, outer, core);
  root.add(flame);

  const light = new THREE.PointLight(0xffa040, 3, 5, 2);
  root.add(light);

  const smoke = new Wisps(root, { color: 0xd8d2c8, count: 14, life: [2.2, 3.4], opacity: 0.08, rise: 0.4, size: [0.05, 0.4], spread: 0.02, sway: 0.18 });

  return {
    root,
    ember: flame,
    emberRate: (p) => 0.25 * (1 - p * 0.5),
    update(progress, time, dt) {
      const height = 1.5 * (1 - progress * 0.8);
      body.scale.y = height;
      const top = 0.055 + height;
      pool.position.y = top - 0.035;
      wick.position.y = top + 0.025;

      const strength = 1 - progress * 0.45;
      const flicker = 1 + Math.sin(time * 13.1) * 0.05 + Math.sin(time * 23.7) * 0.035 + Math.sin(time * 5.3) * 0.04;
      flame.position.set(Math.sin(time * 2.1) * 0.012, top + 0.3 * strength, 0);
      outer.scale.set(0.24 * strength, 0.58 * strength * flicker, 1);
      core.scale.set(0.09 * strength, 0.24 * strength * flicker, 1);
      core.position.y = -0.1 * strength;
      halo.material.opacity = 0.28 * strength * flicker;
      light.position.set(0, top + 0.2, 0.05);
      light.intensity = 3.2 * strength * flicker;
      wax.emissiveIntensity = 0.8 * strength * flicker;

      smoke.origin.set(flame.position.x, flame.position.y + 0.22 * strength, 0);
      smoke.update(dt, time, 0.6);
    },
  };
}

// ---------------------------------------------------------------- coffee

const CUP_INNER: Array<[number, number]> = [[0.44, 0.17], [0.52, 0.72], [0.565, 1.0]];

function buildCoffee(): Built {
  const root = new THREE.Group();
  const ceramic = new THREE.MeshPhysicalMaterial({ clearcoat: 1, clearcoatRoughness: 0.08, color: 0xefebe4, roughness: 0.28, side: THREE.DoubleSide });

  root.add(new THREE.Mesh(lathe([[0, 0], [0.88, 0], [1.0, 0.05], [1.06, 0.11], [0.97, 0.1], [0.56, 0.045], [0, 0.045]]), ceramic));

  const cup = new THREE.Group();
  cup.position.y = 0.045;
  cup.add(
    new THREE.Mesh(
      lathe([[0, 0], [0.41, 0], [0.45, 0.025], [0.5, 0.14], [0.58, 0.7], [0.625, 1.0], [0.6, 1.025], [0.565, 1.0], ...CUP_INNER.slice(0, 2).reverse(), [0, 0.12]]),
      ceramic,
    ),
  );
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.048, 20, 48, Math.PI * 1.25), ceramic);
  handle.position.set(0.56, 0.55, 0);
  handle.rotation.z = -Math.PI * 0.625;
  cup.add(handle);
  root.add(cup);

  const coffee = new THREE.Mesh(
    new THREE.CircleGeometry(1, 64).rotateX(-Math.PI / 2),
    new THREE.MeshPhysicalMaterial({ clearcoat: 1, clearcoatRoughness: 0.05, map: cremaTexture(), roughness: 0.18 }),
  );
  cup.add(coffee);

  const steam = new Wisps(root, { color: 0xf2efe8, count: 30, life: [2.4, 3.6], opacity: 0.16, rise: 0.38, size: [0.08, 0.4], spread: 0.22, sway: 0.22 });
  const emberPoint = new THREE.Object3D();
  emberPoint.position.set(0, 1.6, 0);
  root.add(emberPoint);

  return {
    root,
    view: { look: 0.6, y: 3.3, z: 4.4 },
    ember: emberPoint,
    emberRate: (p) => 0.2 * (1 - p),
    update(progress, time, dt) {
      const level = THREE.MathUtils.lerp(0.93, 0.19, progress);
      coffee.visible = progress < 0.995;
      coffee.position.y = level;
      coffee.scale.setScalar(innerRadius(level) * 0.995);
      coffee.rotation.y = time * 0.05;

      steam.origin.set(0, 1.08, 0);
      steam.update(dt, time, Math.pow(1 - progress, 0.8));
    },
  };
}

function innerRadius(y: number) {
  for (let i = 1; i < CUP_INNER.length; i++) {
    const [r0, y0] = CUP_INNER[i - 1];
    const [r1, y1] = CUP_INNER[i];
    if (y <= y1) return THREE.MathUtils.lerp(r0, r1, THREE.MathUtils.clamp((y - y0) / (y1 - y0), 0, 1));
  }
  return CUP_INNER[CUP_INNER.length - 1][0];
}

// ---------------------------------------------------------------- incense

function buildIncense(): Built {
  const root = new THREE.Group();

  const glaze = new THREE.MeshPhysicalMaterial({ clearcoat: 0.7, clearcoatRoughness: 0.2, color: 0x2a3838, roughness: 0.35 });
  root.add(new THREE.Mesh(lathe([[0, 0], [0.72, 0], [0.8, 0.04], [0.83, 0.11], [0.76, 0.11], [0.69, 0.055], [0, 0.055]]), glaze));
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 16), new THREE.MeshStandardMaterial({ color: 0xb08a4a, metalness: 0.8, roughness: 0.3 }));
  bead.position.y = 0.08;
  root.add(bead);

  const stick = new THREE.Group();
  stick.position.set(0, 0.1, 0);
  stick.rotation.z = -0.32;
  root.add(stick);

  const bamboo = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.017, 0.36, 10).translate(0, 0.18, 0), new THREE.MeshStandardMaterial({ color: 0xc9a46a, roughness: 0.7 }));
  stick.add(bamboo);
  const coated = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.03, 1, 14).translate(0, 0.5, 0), new THREE.MeshStandardMaterial({ color: 0x6b4430, roughness: 0.9 }));
  coated.position.y = 0.36;
  stick.add(coated);
  const ash = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.028, 1, 14).translate(0, 0.5, 0), new THREE.MeshStandardMaterial({ color: 0x9d988f, roughness: 1 }));
  stick.add(ash);

  const ember = new THREE.Mesh(
    new THREE.SphereGeometry(0.034, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0x3a1a0a, emissive: 0xff5a14, emissiveIntensity: 3 }),
  );
  ember.scale.y = 0.8;
  stick.add(ember);
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({ blending: THREE.AdditiveBlending, color: 0xff7a2a, depthWrite: false, map: softDotTexture(), opacity: 0.5, transparent: true }),
  );
  glow.scale.setScalar(0.2);
  ember.add(glow);
  const light = new THREE.PointLight(0xff7a2a, 0.8, 1.6, 2);
  ember.add(light);

  // Ash that has dropped into the dish.
  const flakeMaterial = new THREE.MeshStandardMaterial({ color: 0x7d7870, roughness: 1 });
  const flakes = Array.from({ length: 9 }, (_, index) => {
    const flake = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.04 + (index % 3) * 0.02, 7), flakeMaterial);
    const angle = index * 2.4;
    const radius = 0.2 + (index % 4) * 0.1;
    flake.position.set(0.3 + Math.cos(angle) * radius * 0.5, 0.075, Math.sin(angle) * radius * 0.45);
    flake.rotation.set(Math.PI / 2, angle, 0);
    flake.visible = false;
    root.add(flake);
    return flake;
  });

  const smoke = new Wisps(root, { color: 0xdcd8d2, count: 40, life: [2.6, 4], opacity: 0.2, rise: 0.42, size: [0.04, 0.42], spread: 0.01, sway: 0.3 });
  const tipWorld = new THREE.Vector3();

  return {
    root,
    ember,
    emberRate: () => 0.5,
    update(progress, time, dt) {
      const length = 1.45 * (1 - progress * 0.88);
      coated.scale.y = length;
      const ashLength = Math.min(0.13, 0.03 + progress * 0.5);
      const top = 0.36 + length;
      ash.position.y = top;
      ash.scale.y = ashLength;
      ember.position.y = top;
      const pulse = 0.85 + Math.sin(time * 3.1) * 0.1 + Math.sin(time * 7.7) * 0.05;
      (ember.material as THREE.MeshStandardMaterial).emissiveIntensity = 3 * pulse;
      glow.material.opacity = 0.45 * pulse;
      light.intensity = 0.8 * pulse;

      flakes.forEach((flake, index) => {
        flake.visible = progress > (index + 1) / (flakes.length + 1);
      });

      root.updateMatrixWorld();
      ash.localToWorld(tipWorld.set(0, 1, 0));
      root.worldToLocal(tipWorld);
      smoke.origin.copy(tipWorld);
      smoke.update(dt, time, 1);
    },
  };
}

// ---------------------------------------------------------------- candy (lollipop)

function buildCandy(): Built {
  const root = new THREE.Group();
  const holder = new THREE.Group();
  holder.position.y = 1.78;
  holder.rotation.z = -0.14;
  root.add(holder);

  // Swirled disc: flat faces carry the spiral, a torus rounds off the edge.
  const swirl = swirlTexture();
  const candyMaterial = new THREE.MeshPhysicalMaterial({
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    emissive: 0xffffff,
    emissiveIntensity: 0.18,
    emissiveMap: swirl,
    map: swirl,
    roughness: 0.14,
  });
  const edgeMaterial = new THREE.MeshPhysicalMaterial({ clearcoat: 1, clearcoatRoughness: 0.04, color: 0xd9302f, roughness: 0.14 });
  const disc = new THREE.Group();
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.2, 96).rotateX(Math.PI / 2), [edgeMaterial, candyMaterial, candyMaterial]);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.1, 20, 96), edgeMaterial);
  disc.add(face, rim);
  holder.add(disc);

  const stick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.034, 0.034, 1.7, 16).translate(0, -0.85, 0),
    new THREE.MeshStandardMaterial({ color: 0xf4efe6, roughness: 0.75 }),
  );
  holder.add(stick);

  const sparkle = new THREE.Sprite(
    new THREE.SpriteMaterial({ blending: THREE.AdditiveBlending, depthWrite: false, map: softDotTexture(), opacity: 0, transparent: true }),
  );
  sparkle.position.set(-0.22, 0.26, 0.2);
  holder.add(sparkle);

  const fresh = new THREE.Color(0xffffff);
  const faded = new THREE.Color(0xe9dcd4);

  return {
    root,
    update(progress, time) {
      holder.position.y = 1.78 + Math.sin(time * 0.9) * 0.05;
      holder.rotation.y = Math.sin(time * 0.35) * 0.6;

      // Licked down to nothing: the disc shrinks onto the stick tip and its
      // colours soften, so only the bare stick is left at the end.
      const size = 1 - progress;
      disc.visible = size > 0.01;
      disc.scale.set(size, size, 0.35 + size * 0.65);
      candyMaterial.color.lerpColors(fresh, faded, progress * 0.8);
      edgeMaterial.color.setHex(0xd9302f).lerp(faded, progress * 0.6);

      sparkle.position.set(-0.22 * size, 0.26 * size, 0.2 * size);
      sparkle.material.opacity = Math.max(0, Math.sin(time * 1.3)) ** 8 * 0.6 * size;
      sparkle.scale.setScalar(0.16 + Math.sin(time * 1.3) * 0.04);
    },
  };
}

// ---------------------------------------------------------------- ball pop

// A round ball candy on a stick in a printed twist wrapper. The wrapper comes
// off first, then the ball is licked down until only the stick is left.
function buildBallPop(): Built {
  const root = new THREE.Group();
  const holder = new THREE.Group();
  holder.position.y = 1.78;
  holder.rotation.z = 0.12;
  root.add(holder);

  const fresh = new THREE.Color(0xff3d6e);
  const faded = new THREE.Color(0xf6c9d4);
  const ballMaterial = new THREE.MeshPhysicalMaterial({
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    color: fresh.clone(),
    emissive: 0x4a0516,
    emissiveIntensity: 0.4,
    roughness: 0.1,
  });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.36, 64, 32), ballMaterial);
  holder.add(ball);

  const stick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.032, 0.032, 1.7, 16).translate(0, -0.85, 0),
    new THREE.MeshStandardMaterial({ color: 0xf4efe6, roughness: 0.75 }),
  );
  holder.add(stick);

  // Printed wrapper: a crinkled shell over the ball and a twisted neck at the stick.
  const wrapperMaterial = new THREE.MeshPhysicalMaterial({
    clearcoat: 0.8,
    map: wrapperTexture(),
    roughness: 0.35,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const wrapper = new THREE.Group();
  const shell = new THREE.Mesh(
    crinkle(new THREE.SphereGeometry(0.385, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.82), 0.012),
    wrapperMaterial,
  );
  const neck = new THREE.Mesh(
    crinkle(lathe([[0.2, 0], [0.07, -0.08], [0.05, -0.14], [0.12, -0.24], [0.15, -0.28]], 40), 0.015),
    wrapperMaterial,
  );
  neck.position.y = -0.31;
  wrapper.add(shell, neck);
  holder.add(wrapper);

  const sparkle = new THREE.Sprite(
    new THREE.SpriteMaterial({ blending: THREE.AdditiveBlending, depthWrite: false, map: softDotTexture(), opacity: 0, transparent: true }),
  );
  holder.add(sparkle);

  return {
    root,
    update(progress, time) {
      holder.position.y = 1.78 + Math.sin(time * 0.9) * 0.05;
      holder.rotation.y = time * 0.25;

      // 0 to 0.3: the wrapper loosens, lifts off and fades.
      const off = THREE.MathUtils.smoothstep(progress, 0.02, 0.3);
      wrapper.visible = off < 0.999;
      wrapper.position.y = off * 0.5;
      wrapper.scale.setScalar(1 + off * 0.35);
      wrapper.rotation.y = off * 1.8;
      wrapperMaterial.opacity = 1 - off;

      // 0.3 to 1: the ball is licked down onto the stick tip until it's gone.
      const licked = THREE.MathUtils.clamp((progress - 0.3) / 0.7, 0, 1);
      const size = 1 - licked;
      ball.visible = size > 0.01;
      ball.scale.setScalar(size);
      ballMaterial.color.lerpColors(fresh, faded, licked * 0.8);

      sparkle.position.set(-0.13 * size, 0.15 * size, 0.32 * size);
      sparkle.material.opacity = Math.max(0, Math.sin(time * 1.3)) ** 8 * 0.6 * off * size;
      sparkle.scale.setScalar(0.14 + Math.sin(time * 1.3) * 0.04);
    },
  };
}

// Bright stripes with a simple daisy, in the spirit of classic ball-pop wrappers.
function wrapperTexture() {
  return canvasTexture(512, (ctx, s) => {
    const stripes = ["#ffd23f", "#ff4f7b", "#ffffff", "#3fb6ff"];
    stripes.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, (index * s) / stripes.length, s, s / stripes.length);
    });
    for (const cx of [s * 0.25, s * 0.75]) {
      const cy = s * 0.42;
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(a) * 34, cy + Math.sin(a) * 34, 26, 14, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#ffb000";
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// Classic lollipop spiral in red, cream, orange and pink.
function swirlTexture() {
  return canvasTexture(512, (ctx, s) => {
    const colors = [[217, 48, 47], [255, 243, 230], [245, 154, 44], [255, 122, 168]];
    const image = ctx.createImageData(s, s);
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const dx = (x - s / 2) / (s / 2);
        const dy = (y - s / 2) / (s / 2);
        const r = Math.hypot(dx, dy);
        const turn = Math.atan2(dy, dx) / (Math.PI * 2);
        const band = Math.floor(((turn + r * 3.2) * 4 % 4 + 4) % 4);
        const [cr, cg, cb] = colors[band];
        const shade = 1 - r * 0.18;
        const i = (y * s + x) * 4;
        image.data[i] = cr * shade;
        image.data[i + 1] = cg * shade;
        image.data[i + 2] = cb * shade;
        image.data[i + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);
  });
}

// ---------------------------------------------------------------- shared bits

type WispOptions = {
  color: number;
  count: number;
  life: [number, number];
  opacity: number;
  rise: number;
  size: [number, number];
  spread: number;
  sway: number;
};

// Soft sprites that rise, sway and fade: smoke for incense/candle, steam for coffee.
class Wisps {
  origin = new THREE.Vector3();
  private items: Array<{ sprite: THREE.Sprite; age: number; life: number; seed: number; x: number; z: number; y: number }>;

  constructor(
    parent: THREE.Object3D,
    private options: WispOptions,
  ) {
    const map = softDotTexture();
    this.items = Array.from({ length: options.count }, (_, index) => {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ color: options.color, depthWrite: false, map, opacity: 0, transparent: true }),
      );
      parent.add(sprite);
      const life = rand(options.life);
      return { age: (index / options.count) * life, life, seed: Math.random() * 100, sprite, x: 0, y: 0, z: 0 };
    });
  }

  update(dt: number, time: number, strength: number) {
    const { opacity, rise, size, spread, sway } = this.options;
    for (const item of this.items) {
      item.age += dt;
      if (item.age >= item.life) {
        item.age = 0;
        item.life = rand(this.options.life);
        item.x = (Math.random() - 0.5) * spread * 2;
        item.z = (Math.random() - 0.5) * spread * 2;
        item.y = 0;
      }
      const k = item.age / item.life;
      item.y += rise * dt * (1 - k * 0.4);
      const drift = Math.sin(time * 0.9 + item.seed) * sway * k + Math.sin(time * 2.3 + item.seed * 2) * sway * 0.25 * k;
      item.sprite.position.set(this.origin.x + item.x + drift, this.origin.y + item.y, this.origin.z + item.z);
      item.sprite.scale.setScalar(THREE.MathUtils.lerp(size[0], size[1], k));
      item.sprite.material.opacity = opacity * strength * Math.sin(Math.PI * k) * (1 - k * 0.3);
    }
  }
}

function lathe(points: Array<[number, number]>, segments = 72) {
  return new THREE.LatheGeometry(
    points.map(([x, y]) => new THREE.Vector2(x, y)),
    segments,
  );
}

// Small random folds so cellophane does not look like glass.
function crinkle(geometry: THREE.BufferGeometry, amount: number) {
  const position = geometry.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    v.fromBufferAttribute(position, i);
    const n = Math.sin(v.x * 37 + v.y * 11) * Math.cos(v.z * 29 - v.y * 17) + Math.sin(Math.atan2(v.z, v.x) * 14) * 0.6;
    const len = Math.hypot(v.x, v.z) || 1;
    v.x += (v.x / len) * n * amount;
    v.z += (v.z / len) * n * amount;
    position.setXYZ(i, v.x, v.y, v.z);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function contactShadow(size: number) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size * 0.7).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ depthWrite: false, map: radialTexture("rgba(0,0,0,0.8)", "rgba(0,0,0,0)"), transparent: true }),
  );
  mesh.position.y = 0.002;
  return mesh;
}

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void, height = size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = height;
  draw(canvas.getContext("2d")!, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function radialTexture(inner: string, outer: string) {
  return canvasTexture(128, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, inner);
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

function softDotTexture() {
  return radialTexture("rgba(255,255,255,1)", "rgba(255,255,255,0)");
}

function flameTexture() {
  return canvasTexture(
    64,
    (ctx) => {
      ctx.translate(32, 92);
      ctx.scale(1, 2.6);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
      g.addColorStop(0, "rgba(255,248,220,1)");
      g.addColorStop(0.35, "rgba(255,196,90,0.95)");
      g.addColorStop(0.7, "rgba(240,110,30,0.45)");
      g.addColorStop(1, "rgba(200,60,10,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.fill();
    },
    128,
  );
}

// Wax glows near the flame: bright at the top of the cylinder, dark lower down.
function verticalGlowTexture() {
  return canvasTexture(
    4,
    (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 0, 64);
      g.addColorStop(0, "#ffc070");
      g.addColorStop(0.12, "#c46a24");
      g.addColorStop(0.4, "#3a1c08");
      g.addColorStop(0.8, "#000000");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 4, 64);
    },
    64,
  );
}

function cremaTexture() {
  return canvasTexture(256, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "#2a160b");
    g.addColorStop(0.62, "#3b2010");
    g.addColorStop(0.86, "#7a4a26");
    g.addColorStop(1, "#a8723f");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

function rand([min, max]: [number, number]) {
  return min + Math.random() * (max - min);
}

function disposeObject(object: THREE.Object3D) {
  const mesh = object as THREE.Mesh;
  mesh.geometry?.dispose();
  const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
  for (const material of materials) {
    for (const value of Object.values(material)) {
      if (value instanceof THREE.Texture) value.dispose();
    }
    material.dispose();
  }
}
