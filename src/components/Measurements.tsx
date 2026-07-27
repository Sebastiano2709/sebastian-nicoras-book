const stats = [
  { label: "Height", value: "181 cm / 5'11\"" },
  { label: "Weight", value: "74 kg / 162 lbs" },
  { label: "Chest", value: "99 cm / 39\"" },
  { label: "Waist", value: "81 cm / 31.5\"" },
  { label: "Hips", value: "95 cm / 37\"" },
  { label: "Shoes", value: "42 EU / 9–9.5 US" },
  { label: "Suit", value: "50 EU" },
  { label: "Eyes", value: "Brown" },
  { label: "Hair", value: "Black" },
];

const contact = [
  { label: "Email", value: "sebastiano.nicoras@gmail.com", href: "mailto:sebastiano.nicoras@gmail.com" },
  { label: "Phone", value: "+40 751 978 482", href: "tel:+40751978482" },
  { label: "Instagram", value: "@sebastiano.nicoras", href: "https://instagram.com/sebastiano.nicoras" },
];

export default function Measurements() {
  return (
    <section id="measurements" className="w-full bg-white" style={{ paddingTop: "64px", paddingBottom: "220px" }}>
      <div className="px-8 md:px-6" style={{ maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>
        <h2
          className="text-center text-3xl md:text-5xl tracking-[0.2em] md:tracking-[0.35em]"
          style={{ fontFamily: "var(--font-cormorant)", marginBottom: "48px" }}
        >
          SEBASTIANO NICORAS
        </h2>

        <div className="flex flex-wrap justify-center" style={{ rowGap: "12px", columnGap: "28px" }}>
          {stats.map((s) => (
            <p key={s.label} className="text-xs md:text-sm tracking-[0.05em] whitespace-nowrap">
              <span className="text-neutral-400 uppercase">{s.label} </span>
              <span className="text-neutral-900">{s.value}</span>
            </p>
          ))}
        </div>

        <div id="contact" className="flex flex-col items-center" style={{ marginTop: "96px", gap: "16px" }}>
          {contact.map((c) => (
            <a key={c.label} href={c.href} className="text-xs md:text-sm tracking-[0.1em] md:tracking-[0.15em] text-neutral-600 text-center break-all" target={c.label === "Instagram" ? "_blank" : undefined} rel={c.label === "Instagram" ? "noopener noreferrer" : undefined}>
              <span className="text-neutral-400">{c.label.toUpperCase()} — </span>
              {c.value}
            </a>
          ))}

          <a href="/Sebastian_Nicoras_CompCard.pdf" download className="inline-block border border-black px-6 py-3 text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase text-black text-center" style={{ marginTop: "32px" }}>
            Download Comp Card (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}