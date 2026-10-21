"use client";

import { X } from "lucide-react";
import { t, type Lang } from "@/lib/i18n";
import type { Room } from "@/lib/types";

// "About this room": who the room is for and how it works. It stays in the page
// while closed so the room is described even before anyone opens the panel.
export function RoomGuide({
  lang,
  onClose,
  open,
  room,
}: {
  lang: Lang;
  onClose?: () => void;
  open: boolean;
  room: Room;
}) {
  const copy = t(lang);

  return (
    <div
      className={`fixed inset-0 z-40 place-items-center bg-asphalt/60 px-4 backdrop-blur-md ${open ? "grid" : "hidden"}`}
      onClick={(event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        aria-labelledby="room-guide-title"
        className="max-h-[85svh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-slate/95 p-7 shadow-soft"
        id="room-guide"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-4xl font-black uppercase leading-[0.9] text-mist" id="room-guide-title">
            {room.name}
          </h2>
          {onClose ? (
            <button
              aria-label={copy.closeAbout}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-fog transition hover:text-mist"
              onClick={onClose}
              type="button"
            >
              <X size={16} aria-hidden />
            </button>
          ) : null}
        </div>
        <p className="mt-4 leading-relaxed text-mist/85">{lang === "es" ? room.aboutEs : room.about}</p>
        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-fog">{copy.roomsHowTitle}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-fog">{copy.roomsHowBody}</p>
        <dl className="mt-6 space-y-4">
          {copy.faq.slice(0, 4).map((item) => (
            <div key={item.q}>
              <dt className="font-semibold text-mist">{item.q}</dt>
              <dd className="mt-1 text-[15px] leading-relaxed text-fog">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
