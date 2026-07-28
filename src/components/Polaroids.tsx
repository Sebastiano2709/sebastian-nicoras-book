import { LightboxTrigger } from "@/components/Lightbox";
import RevealOnScroll from "@/components/RevealOnScroll";

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

  return (
    <section id="polaroids" className="w-full">
      <div className="block md:hidden" style={{ display: "flex", flexDirection: "column", gap: "28px", paddingTop: "16px", paddingBottom: "16px" }}>
        {polaroids.map((src, i) => (
          <RevealOnScroll key={src}>
            <LightboxTrigger images={allImages} index={i}>
              <img src={`/polaroids/${src}`} alt="" className="w-full h-auto object-cover" />
            </LightboxTrigger>
          </RevealOnScroll>
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-2 md:px-12" style={{ gap: "32px", maxWidth: "1400px", marginLeft: "auto", marginRight: "auto", paddingTop: "16px", paddingBottom: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "64px", marginTop: "80px" }}>
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