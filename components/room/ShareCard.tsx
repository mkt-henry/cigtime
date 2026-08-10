"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

type ShareLang = "en" | "es";

const COPY: Record<ShareLang, { button: string; done: string; caption: string; tagline: string }> = {
  en: {
    button: "Share your cigtime",
    done: "Copied — go let it out",
    caption: "Take your cigtime. A place to let it out.",
    tagline: "Take your cigtime.",
  },
  es: {
    button: "Comparte tu cigtime",
    done: "Copiado — ve a desahogarte",
    caption: "Tómate tu cigtime. Un lugar para desahogarte.",
    tagline: "Tómate tu cigtime.",
  },
};

function getSiteUrl() {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "https://cigtime.app";
}

export function ShareCard({ thought, lang }: { thought: string | null; lang: ShareLang }) {
  const [done, setDone] = useState(false);
  const copy = COPY[lang];

  async function handleShare() {
    const url = getSiteUrl();
    const quoted = thought ? `"${thought}"` : copy.tagline;
    const text = `${quoted}\n\n${copy.caption}`;

    try {
      const blob = await renderShareImage(thought, copy.tagline, url);
      const file = blob ? new File([blob], "cigtime.png", { type: "image/png" }) : null;

      const navAny = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
      };

      if (file && navAny.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({ files: [file], text, title: "cigtime" });
        return;
      }

      if (navigator.share) {
        await navigator.share({ text, url, title: "cigtime" });
        return;
      }

      // Desktop fallback: copy the caption + drop the image as a download.
      await navigator.clipboard?.writeText(`${text}\n${url}`);
      if (blob) downloadBlob(blob, "cigtime.png");
      setDone(true);
      window.setTimeout(() => setDone(false), 2600);
    } catch {
      // User cancelled the native sheet, or sharing is unavailable — no-op.
    }
  }

  return (
    <button
      className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line px-4 text-sm font-semibold transition hover:border-ink"
      onClick={handleShare}
      type="button"
    >
      {done ? <Check size={18} aria-hidden /> : <Share2 size={18} aria-hidden />}
      {done ? copy.done : copy.button}
    </button>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Draws a square, social-ready card on a canvas and returns a PNG blob.
function renderShareImage(
  thought: string | null,
  tagline: string,
  url: string,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const size = 1080;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve(null);
      return;
    }

    // Background — ink with a warm ember glow rising from the bottom.
    ctx.fillStyle = "#171717";
    ctx.fillRect(0, 0, size, size);
    const glow = ctx.createRadialGradient(size / 2, size + 120, 80, size / 2, size + 120, 720);
    glow.addColorStop(0, "rgba(242, 166, 90, 0.35)");
    glow.addColorStop(1, "rgba(242, 166, 90, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);

    // Wordmark.
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "600 34px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("cigtime", 80, 110);

    // The thought, centered and wrapped.
    const body = thought ? `“${thought}”` : tagline;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    const fontSize = body.length > 90 ? 56 : body.length > 50 ? 68 : 80;
    ctx.font = `800 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
    wrapText(ctx, body, size / 2, size / 2, size - 200, fontSize * 1.28);

    // Footer tagline + url.
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "700 38px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(tagline, size / 2, size - 150);
    ctx.fillStyle = "#f2a65a";
    ctx.font = "600 30px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(url.replace(/^https?:\/\//, ""), size / 2, size - 100);

    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);

  const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + index * lineHeight);
  });
}
