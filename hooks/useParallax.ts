"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

// Eases the pointer position (-1..1) into --px/--py on the element. Layers read the
// variables in CSS, so moving the mouse never triggers a React render.
export function useParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    function tick() {
      x += (targetX - x) * 0.07;
      y += (targetY - y) * 0.07;
      el!.style.setProperty("--px", x.toFixed(3));
      el!.style.setProperty("--py", y.toFixed(3));
      raf = Math.abs(targetX - x) > 0.002 || Math.abs(targetY - y) > 0.002 ? requestAnimationFrame(tick) : 0;
    }

    function onMove(event: PointerEvent) {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}

// Moves a layer opposite to the pointer; bigger values read as closer to the viewer.
export function depth(px: number) {
  return {
    transform: `translate3d(calc(var(--px, 0) * ${-px}px), calc(var(--py, 0) * ${-px / 2}px), 0)`,
  };
}
