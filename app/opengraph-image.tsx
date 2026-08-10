import { ImageResponse } from "next/og";
import { headers } from "next/headers";
import { pickLang, t } from "@/lib/i18n";

export const alt = "cigtime";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const copy = t(pickLang((await headers()).get("accept-language")));

  return new ImageResponse(
    (
      <div
        style={{
          background: "#171717",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 80px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 600, opacity: 0.55 }}>cigtime</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>
            {copy.heroTaglineTop}
          </div>
          <div style={{ display: "flex", fontSize: 52, fontWeight: 700, opacity: 0.72 }}>
            {copy.heroTaglineBottom}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#f2a65a" }}>
          {copy.heroBadge}
        </div>
      </div>
    ),
    size,
  );
}
