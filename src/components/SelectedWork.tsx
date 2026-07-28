"use client";

import { portfolio } from "@/data/portfolio";
import { LightboxTrigger } from "@/components/Lightbox";
import RevealOnScroll from "@/components/RevealOnScroll";
import { useIsMobile } from "@/components/useIsMobile";

export default function SelectedWork() {
  const allImages = portfolio.map((img) => `/portfolio/${img}`);
  const isMobile = useIsMobile();

  if (isMobile === null) return <section id="portfolio" className="w-full" />;

  if (isMobile) {
    return (
      <section id="portfolio" className="w-full">
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "10px", paddingRight: "10px" }}>
          {allImages.map((src, i) => (
            <RevealOnScroll key={src}>
              <LightboxTrigger images={allImages} index={i}>
                <img src={src} alt="" className="w-full h-auto object-cover" />
              </LightboxTrigger>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="w-full">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", maxWidth: "1400px", marginLeft: "auto", marginRight: "auto", paddingTop: "16px", paddingBottom: "16px", paddingLeft: "48px", paddingRight: "48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
          {allImages.filter((_, i) => i % 2 === 0).map((src) => {
            const i = allImages.indexOf(src);
            return (
              <RevealOnScroll key={src}>
                <LightboxTrigger images={allImages} index={i}>
                  <img src={src} alt="" className="w-full h-auto object-cover" />
                </LightboxTrigger>
              </RevealOnScroll>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "64px", marginTop: "80px" }}>
          {allImages.filter((_, i) => i % 2 === 1).map((src) => {
            const i = allImages.indexOf(src);
            return (
              <RevealOnScroll key={src}>
                <LightboxTrigger images={allImages} index={i}>
                  <img src={src} alt="" className="w-full h-auto object-cover" />
                </LightboxTrigger>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}