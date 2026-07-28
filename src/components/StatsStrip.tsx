const statsRow1 = [
  { label: "Height", value: "181 cm / 5'11\"" },
  { label: "Weight", value: "74 kg / 162 lbs" },
  { label: "Chest", value: "99 cm / 39\"" },
  { label: "Waist", value: "81 cm / 31.5\"" },
  { label: "Hips", value: "95 cm / 37\"" },
];

const statsRow2 = [
  { label: "Suit", value: "50 EU" },
  { label: "Shoes", value: "42 EU / 9–9.5 US" },
  { label: "Eyes", value: "Brown" },
  { label: "Hair", value: "Black" },
];

export default function StatsStrip() {
  return (
    <div id="measurements" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", paddingTop: "24px", paddingBottom: "24px", scrollMarginTop: "120px" }}>
      <div className="flex flex-wrap justify-center" style={{ columnGap: "20px" }}>
        {statsRow1.map((s) => (
          <p key={s.label} className="whitespace-nowrap" style={{ fontSize: "12px", letterSpacing: "0.02em" }}>
            <span className="text-neutral-400 uppercase">{s.label} </span>
            <span className="text-neutral-900 font-semibold">{s.value}</span>
          </p>
        ))}
      </div>
      <div className="flex flex-wrap justify-center" style={{ columnGap: "20px" }}>
        {statsRow2.map((s) => (
          <p key={s.label} className="whitespace-nowrap" style={{ fontSize: "12px", letterSpacing: "0.02em" }}>
            <span className="text-neutral-400 uppercase">{s.label} </span>
            <span className="text-neutral-900 font-semibold">{s.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
}