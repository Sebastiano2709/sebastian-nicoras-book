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
    <section id="measurements" className="w-full bg-white pt-16 pb-48 md:pt-32 md:pb-56">
      <div className="px-8 md:px-6" style={{ maxWidth: "768px", marginLeft: "auto", marginRight: "auto" }}>
        <h2
          className="mb-16 md:mb-20 text-center text-3xl md:text-5xl tracking-[0.2em] md:tracking-[0.35em]"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          SEBASTIAN NICORAS
        </h2>
        <p className="mb-20 md:mb-28 text-center text-xs tracking-[0.3em] text-neutral-400">
          MEASUREMENTS
        </p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:gap-x-12 md:gap-y-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="border-b border-neutral-200 pb-3">
              <p className="text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.25em] text-neutral-400">
                {s.label.toUpperCase()}
              </p>
              <p className="mt-1 text-sm md:text-base text-neutral-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div id="contact" className="mt-16 md:mt-24 flex flex-col items-center gap-3">
          {contact.map((c) => (
            <a key={c.label} href={c.href} className="text-xs md:text-sm tracking-[0.1em] md:tracking-[0.15em] text-neutral-600 text-center break-all" target={c.label === "Instagram" ? "_blank" : undefined} rel={c.label === "Instagram" ? "noopener noreferrer" : undefined}>
              <span className="text-neutral-400">{c.label.toUpperCase()} — </span>
              {c.value}
            </a>
          ))}

          <a href="/Sebastian_Nicoras_CompCard.pdf" download className="mt-5 inline-block border border-black px-6 py-3 text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase text-black text-center">
            Download Comp Card (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}