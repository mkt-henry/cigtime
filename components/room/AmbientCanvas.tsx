"use client";

import { useEffect, useRef } from "react";

type Smoke = { x: number; y: number; vx: number; vy: number; r: number; grow: number; age: number; life: number; alpha: number };
type Spark = { x: number; y: number; vx: number; vy: number; age: number; life: number };
type Ripple = { x: number; y: number; age: number };

const MAX_SMOKE = 80;
const WIND_RADIUS = 150;

// Soft smoke and ember sparks over the scene. Smoke rises from whatever element is
// marked data-ember (the burning tip, the flame...) and is pushed around by the pointer;
// every tap sends out a ripple and a few sparks.
export function AmbientCanvas({ intensity }: { intensity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const context = ctx;

    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext("2d")!;
    const gradient = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(236,232,222,1)");
    gradient.addColorStop(0.45, "rgba(236,232,222,0.45)");
    gradient.addColorStop(1, "rgba(236,232,222,0)");
    sctx.fillStyle = gradient;
    sctx.fillRect(0, 0, 64, 64);

    const smoke: Smoke[] = [];
    const sparks: Spark[] = [];
    const ripples: Ripple[] = [];
    const pointer = { x: -999, y: -999, vx: 0, vy: 0 };
    let emitter = { x: 0, y: 0, rate: 0 };
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = performance.now();
    let emitterCheck = 0;
    let carry = 0;
    let time = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function findEmitter() {
      const el = document.querySelector("[data-ember]");
      if (!el) {
        emitter.rate = 0;
        return;
      }
      const rect = el.getBoundingClientRect();
      emitter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        rate: Number(el.getAttribute("data-ember")) || 1,
      };
    }

    function burst(x: number, y: number) {
      ripples.push({ x, y, age: 0 });
      for (let i = 0; i < 9; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 110;
        sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 30, age: 0, life: 0.7 + Math.random() * 0.6 });
      }
    }

    function onDown(event: PointerEvent) {
      burst(event.clientX, event.clientY);
    }

    function onMove(event: PointerEvent) {
      pointer.vx = event.clientX - pointer.x;
      pointer.vy = event.clientY - pointer.y;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      const boost = intensityRef.current;

      emitterCheck -= dt;
      if (emitterCheck <= 0) {
        emitterCheck = 0.15;
        findEmitter();
      }

      if (emitter.rate > 0 && smoke.length < MAX_SMOKE) {
        carry += dt * 7 * emitter.rate * boost;
        while (carry >= 1) {
          carry -= 1;
          smoke.push({
            x: emitter.x + (Math.random() - 0.5) * 6,
            y: emitter.y,
            vx: (Math.random() - 0.5) * 8,
            vy: -(26 + Math.random() * 20),
            r: 5 + Math.random() * 5,
            grow: 7 + Math.random() * 6,
            age: 0,
            life: 5 + Math.random() * 3,
            alpha: 0.09 + Math.random() * 0.07,
          });
        }
      }
      if (boost > 1 && emitter.rate > 0 && Math.random() < dt * 5) {
        sparks.push({ x: emitter.x, y: emitter.y, vx: (Math.random() - 0.5) * 40, vy: -(30 + Math.random() * 50), age: 0, life: 0.9 });
      }

      context.clearRect(0, 0, width, height);

      for (let i = smoke.length - 1; i >= 0; i--) {
        const p = smoke[i];
        p.age += dt;
        if (p.age >= p.life) {
          smoke.splice(i, 1);
          continue;
        }
        // Slow lateral sway, plus a push away from the pointer that grows with how fast it moves.
        p.vx += Math.sin(time * 0.7 + p.y * 0.012) * 10 * dt;
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < WIND_RADIUS && dist > 0.1) {
          const push = (1 - dist / WIND_RADIUS) * (60 + Math.min(240, Math.hypot(pointer.vx, pointer.vy) * 6));
          p.vx += (dx / dist) * push * dt;
          p.vy += (dy / dist) * push * dt * 0.5;
        }
        p.vx *= 1 - 0.8 * dt;
        p.vy *= 1 - 0.3 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.r += p.grow * dt;
        const t = p.age / p.life;
        context.globalAlpha = p.alpha * Math.sin(Math.PI * Math.min(1, t * 1.15));
        context.drawImage(sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }

      context.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.age += dt;
        if (s.age >= s.life) {
          sparks.splice(i, 1);
          continue;
        }
        s.vy += 90 * dt;
        s.vx *= 1 - 1.2 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const a = 1 - s.age / s.life;
        context.globalAlpha = a;
        context.fillStyle = a > 0.5 ? "#ffd29a" : "#f2a65a";
        context.beginPath();
        context.arc(s.x, s.y, 1.2 + a * 1.2, 0, Math.PI * 2);
        context.fill();
      }
      context.globalCompositeOperation = "source-over";

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.age += dt;
        if (r.age >= 0.8) {
          ripples.splice(i, 1);
          continue;
        }
        const t = r.age / 0.8;
        context.globalAlpha = (1 - t) * 0.45;
        context.strokeStyle = "#f5efe2";
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(r.x, r.y, 6 + t * 34, 0, Math.PI * 2);
        context.stroke();
      }
      context.globalAlpha = 1;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas aria-hidden className="pointer-events-none absolute inset-0 z-[5] h-full w-full" ref={canvasRef} />;
}
