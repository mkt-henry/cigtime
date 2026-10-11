"use client";

import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// A dark rounded dropdown for the room HUD. The native <select> popup is a
// square system box that doesn't match the night look.
export function Picker<T extends string | number>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: T) => void;
  options: { label: string; value: T }[];
  value: T;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div className="relative h-full" ref={rootRef}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        className="flex h-full items-center gap-1 rounded-full pl-3 pr-2 outline-none focus-visible:ring-2 focus-visible:ring-sodium"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        {current?.label}
        <ChevronDown aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`} size={14} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-0 top-full z-40 mt-2 min-w-[9.5rem] overflow-hidden rounded-2xl border border-white/15 bg-slate/95 p-1 shadow-soft"
            exit={{ opacity: 0, y: -4 }}
            initial={{ opacity: 0, y: -4 }}
            role="listbox"
            transition={{ duration: 0.15 }}
          >
            {options.map((option) => {
              const selected = option.value === value;
              return (
                <li key={option.value}>
                  <button
                    aria-selected={selected}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none ${
                      selected ? "text-sodium" : "text-mist"
                    }`}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    role="option"
                    type="button"
                  >
                    {option.label}
                    {selected && <Check aria-hidden size={14} />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
