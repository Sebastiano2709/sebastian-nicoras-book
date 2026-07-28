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
    <section id="polaroids" className="w-full px-3 md:px-12" style={{ paddingTop: "16px", paddingBottom: "16px" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8" style={{ maxWidth: "1400px", marginLeft: "auto", marginRight: "auto" }}>
        <div className="flex flex-col gap-4 md:gap-16">
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
        <div className="flex flex-col gap-4 md:gap-16" style={{ marginTop: "80px" }}>
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