import { headers } from "next/headers";

// Daytime is 6:00-17:59 in the visitor's own time zone (Vercel geolocates it from the IP);
// without that header, or with one Intl rejects, fall back to the server clock.
export async function isDaytime() {
  const zone = (await headers()).get("x-vercel-ip-timezone") ?? undefined;
  let hour = new Date().getHours();
  try {
    hour = Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: zone }).format(new Date()));
  } catch {}
  return hour >= 6 && hour < 18;
}
