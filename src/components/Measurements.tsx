const contact = [
  { label: "Email", value: "sebastiano.nicoras@gmail.com", href: "mailto:sebastiano.nicoras@gmail.com" },
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

        <div id="contact" className="flex flex-col items-center" style={{ marginTop: "0px", gap: "16px" }}>
          {contact.map((c) => (
            <a key={c.label} href={c.href} className="text-xs md:text-sm tracking-[0.1em] md:tracking-[0.15em] text-neutral-600 text-center break-all" target={c.label === "Instagram" ? "_blank" : undefined} rel={c.label === "Instagram" ? "noopener noreferrer" : undefined}>
              <span className="text-neutral-400">{c.label.toUpperCase()} — </span>
              {c.value}
            </a>
          ))}

          <a href="/Sebastian_Nicoras_CompCard.pdf" download style={{ marginTop: "40px", display: "inline-block", background: "#f5f5f5", color: "#111111", padding: "18px 48px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Download Comp Card
          </a>

          <p className="text-neutral-400 text-center" style={{ marginTop: "64px", fontSize: "10px", letterSpacing: "0.05em" }}>
            © {new Date().getFullYear()} Sebastiano Nicoras. All rights reserved.
            <br />
            All images are property of Sebastiano Nicoras and may not be copied, reproduced, or used without written permission.
          </p>
        </div>
      </div>
    </section>
  );
}