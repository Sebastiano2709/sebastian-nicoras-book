"use client";

import { useIsMobile } from "@/components/useIsMobile";

const statsRow1 = [
  { label: "Height", value: "181 cm / 5'11\"" },
  { label: "Weight", value: "74 kg / 162 lbs" },
  { label: "Chest", value: "99 cm / 39\"" },
  { label: "Waist", value: "81 cm / 31.5\"" },
];

const statsRow2 = [
  { label: "Hair", value: "Black" },
  { label: "Eyes", value: "Brown" },
  { label: "Suit", value: "50 EU" },
  { label: "Shoes", value: "42 EU / 9–9.5 US" },
  { label: "Hips", value: "95 cm / 37\"" },
];

const allStats = [...statsRow1, ...statsRow2];

export default function StatsStrip() {
  const isMobile = useIsMobile();

  if (isMobile === null) return <div id="measurements" style={{ scrollMarginTop: "120px" }} />;

  if (isMobile) {
    return (
      <div id="measurements" style={{ scrollMarginTop: "120px", paddingTop: "24px", paddingBottom: "24px", paddingLeft: "24px", paddingRight: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: "14px", columnGap: "16px", maxWidth: "360px", marginLeft: "auto", marginRight: "auto" }}>
          {allStats.map((s) => (
            <p key={s.label} style={{ fontSize: "13px", letterSpacing: "0.02em", fontWeight: 400 }}>
              <span className="text-neutral-400 uppercase">{s.label}: </span>
              <span className="text-neutral-900" style={{ fontWeight: 500 }}>{s.value}</span>
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="measurements" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", paddingTop: "24px", paddingBottom: "24px", scrollMarginTop: "120px" }}>
      <div className="flex flex-wrap justify-center" style={{ columnGap: "24px" }}>
        {statsRow1.map((s) => (
          <p key={s.label} className="whitespace-nowrap" style={{ fontSize: "13px", letterSpacing: "0.03em", fontWeight: 400 }}>
            <span className="text-neutral-400 uppercase">{s.label} </span>
            <span className="text-neutral-900" style={{ fontWeight: 500 }}>{s.value}</span>
          </p>
        ))}
      </div>
      <div className="flex flex-wrap justify-center" style={{ columnGap: "24px" }}>
        {statsRow2.map((s) => (
          <p key={s.label} className="whitespace-nowrap" style={{ fontSize: "13px", letterSpacing: "0.03em", fontWeight: 400 }}>
            <span className="text-neutral-400 uppercase">{s.label} </span>
            <span className="text-neutral-900" style={{ fontWeight: 500 }}>{s.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
}