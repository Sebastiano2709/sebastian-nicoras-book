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

const sectionStyle: React.CSSProperties = {
  width: "100%",
  background: "#ffffff",
  padding: "128px 0",
};

const innerStyle: React.CSSProperties = {
  maxWidth: "768px",
  margin: "0 auto",
  padding: "0 24px",
};

const nameStyle: React.CSSProperties = {
  marginBottom: "1rem",
  textAlign: "center",
  fontSize: "3rem",
  letterSpacing: "0.35em",
  fontFamily: "var(--font-cormorant)",
};

const subStyle: React.CSSProperties = {
  marginBottom: "5rem",
  textAlign: "center",
  fontSize: "0.75rem",
  letterSpacing: "0.3em",
  color: "#a3a3a3",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  columnGap: "3rem",
  rowGap: "1.5rem",
};

const itemStyle: React.CSSProperties = {
  borderBottom: "1px solid #e5e5e5",
  paddingBottom: "0.75rem",
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "0.25em",
  color: "#a3a3a3",
};

const valueStyle: React.CSSProperties = {
  marginTop: "0.25rem",
  fontSize: "1rem",
  color: "#171717",
};

const contactWrapStyle: React.CSSProperties = {
  marginTop: "6rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.75rem",
};

const contactTextStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  letterSpacing: "0.15em",
  color: "#525252",
  textAlign: "center",
};

const downloadBtnStyle: React.CSSProperties = {
  marginTop: "1.25rem",
  display: "inline-block",
  border: "1px solid #1a1a1a",
  padding: "12px 32px",
  fontSize: "0.7rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#1a1a1a",
  textAlign: "center",
};

export default function Measurements() {
  return (
    <section id="measurements" style={sectionStyle}>
      <div style={innerStyle}>
        <h2 style={nameStyle}>SEBASTIAN NICORAS</h2>
        <p style={subStyle}>MEASUREMENTS</p>

        <div style={gridStyle}>
          {stats.map((s) => (
            <div key={s.label} style={itemStyle}>
              <p style={labelStyle}>{s.label.toUpperCase()}</p>
              <p style={valueStyle}>{s.value}</p>
            </div>
          ))}
        </div>

        <div id="contact" style={contactWrapStyle}>
          {contact.map((c) => (
            <a key={c.label} href={c.href} style={contactTextStyle} target={c.label === "Instagram" ? "_blank" : undefined} rel={c.label === "Instagram" ? "noopener noreferrer" : undefined}>
              <span style={{ color: "#a3a3a3" }}>{c.label.toUpperCase()} — </span>
              {c.value}
            </a>
          ))}

          <a href="/Sebastian_Nicoras_CompCard.pdf" download style={downloadBtnStyle}>
            Download Comp Card (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}