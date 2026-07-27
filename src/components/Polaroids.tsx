import Image from "next/image";
import { LightboxTrigger } from "@/components/Lightbox";

const polaroids = [
  "RBV_4872.jpg",
  "RBV_4860.jpg",
  "RBV_4862.jpg",
  "RBV_4896.jpg",
  "RBV_4864.jpg",
  "RBV_4895.jpg",
  "RBV_4897.jpg",
  "RBV_4867.jpg",
];

const sectionStyle: React.CSSProperties = {
  width: "100%",
  background: "#ffffff",
  padding: "128px 0",
};

const innerStyle: React.CSSProperties = {
  maxWidth: "1152px",
  margin: "0 auto",
  padding: "0 24px",
};

const headingStyle: React.CSSProperties = {
  marginBottom: "5rem",
  textAlign: "center",
  fontSize: "3rem",
  letterSpacing: "0.35em",
  fontFamily: "var(--font-cormorant)",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "1.5rem",
};

const frameStyle: React.CSSProperties = {
  overflow: "hidden",
  background: "#f5f5f5",
};

const imgStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "auto",
  objectFit: "cover",
  transition: "transform 0.5s",
};

export default function Polaroids() {
  const allImages = polaroids.map((img) => `/polaroids/${img}`);

  return (
    <section id="polaroids" style={sectionStyle}>
      <div style={innerStyle}>
        <h2 style={headingStyle}>POLAROIDS</h2>

        <div style={gridStyle}>
          {polaroids.map((src, i) => (
            <LightboxTrigger key={src} images={allImages} index={i}>
              <div style={frameStyle}>
                <Image
                  src={`/polaroids/${src}`}
                  alt=""
                  width={700}
                  height={1000}
                  style={imgStyle}
                />
              </div>
            </LightboxTrigger>
          ))}
        </div>
      </div>
    </section>
  );
}