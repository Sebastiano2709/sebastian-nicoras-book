"use client";

import { LightboxTrigger } from "@/components/Lightbox";
import RevealOnScroll from "@/components/RevealOnScroll";
import { useIsMobile } from "@/components/useIsMobile";

const polaroids = [
  "RBV_4872.jpg",
  "RBV_4860.jpg",
  "RBV_4862.jpg",
  "RBV_4895.jpg",
  "RBV_4897.jpg",
  "RBV_4867.jpg",
];

export default function Polaroids() {
  const allImages = polaroids.map((img) => `/polaroids/${img}`);
  const isMobile = useIsMobile();

  if (isMobile === null) return <section id="polaroids" className="w-full" />;

  if (isMobile) {
    return (
      <section id="polaroids" className="w-full">
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "7px", paddingRight: "7px" }}>
          {polaroids.map((src, i) => (
            <RevealOnScroll key={src}>
              <LightboxTrigger images={allImages} index={i}>
                <img src={`/polaroids/${src}`} alt="" className="w-full h-auto object-cover" />
              </LightboxTrigger>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="polaroids" className="w-full">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", maxWidth: "1400px", marginLeft: "auto", marginRight: "auto", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "48px", paddingRight: "48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {polaroids.filter((_, i) => i % 2 === 0).map((src) => {
            const i = polaroids.indexOf(src);
            return (
              <RevealOnScroll key={src}>
                <LightboxTrigger images={allImages} index={i}>
                  <img src={`/polaroids/${src}`} alt="" className="w-full h-auto object-cover" />
                </LightboxTrigger>
              </RevealOnScroll>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "80px" }}>
          {polaroids.filter((_, i) => i % 2 === 1).map((src) => {
            const i = polaroids.indexOf(src);
            return (
              <RevealOnScroll key={src}>
                <LightboxTrigger images={allImages} index={i}>
                  <img src={`/polaroids/${src}`} alt="" className="w-full h-auto object-cover" />
                </LightboxTrigger>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}