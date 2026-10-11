"use client";

import { useRef, type ReactNode } from "react";

// A horizontal scroller that mouse users can grab and drag. Touch and trackpads
// keep native scrolling; a drag never counts as a click on the card under it.
export function DragScroll({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const drag = useRef({ down: false, left: 0, moved: false, x: 0 });

  const end = () => {
    drag.current.down = false;
    if (ref.current) ref.current.style.scrollSnapType = "";
  };

  return (
    <ul
      className={`${className} cursor-grab active:cursor-grabbing`}
      onClickCapture={(event) => {
        if (!drag.current.moved) return;
        event.preventDefault();
        event.stopPropagation();
      }}
      onDragStart={(event) => event.preventDefault()}
      onPointerCancel={end}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse" || event.button !== 0 || !ref.current) return;
        drag.current = { down: true, left: ref.current.scrollLeft, moved: false, x: event.clientX };
      }}
      onPointerMove={(event) => {
        const el = ref.current;
        const state = drag.current;
        if (!state.down || !el) return;
        const dx = event.clientX - state.x;
        if (!state.moved) {
          if (Math.abs(dx) < 5) return;
          state.moved = true;
          // Snapping fights a manual scroll, so it is off until the drag ends.
          el.style.scrollSnapType = "none";
          el.setPointerCapture(event.pointerId);
        }
        el.scrollLeft = state.left - dx;
      }}
      onPointerUp={end}
      ref={ref}
    >
      {children}
    </ul>
  );
}
