import { ImageResponse } from "next/og";
import { headers } from "next/headers";
import { pickLang, t } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export const alt = "cigtime";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const copy = t(pickLang((await headers()).get("accept-language")));
  // The rooftop photo behind the title; fall back to a flat night if it cannot be fetched.
  const photo = await fetch(`${SITE_URL}/scenes/og.jpg`)
    .then(async (response) => (response.ok ? `data:image/jpeg;base64,${Buffer.from(await response.arrayBuffer()).toString("base64")}` : null))
    .catch(() => null);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#161c24",
          position: "relative",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 80px",
          width: "100%",
        }}
      >
        {photo ? (
          <img alt="" height={630} src={photo} style={{ left: 0, position: "absolute", top: 0 }} width={1200} />
        ) : null}
        <div style={{ display: "flex", fontSize: 34, fontWeight: 600, opacity: 0.75 }}>cigtime</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 110, fontWeight: 900, lineHeight: 1, textTransform: "uppercase" }}>
            {copy.heroTitle}
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 500, maxWidth: 760, opacity: 0.85 }}>
            {copy.heroLead}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#f2a23c" }}>cigtime.com</div>
      </div>
    ),
    size,
  );
}
