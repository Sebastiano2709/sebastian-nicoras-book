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
    <section id="polaroids" className="w-full px-0 md:px-12" style={{ paddingTop: "16px", paddingBottom: "16px" }}>
      <div className="columns-1 md:columns-2" style={{ maxWidth: "1400px", marginLeft: "auto", marginRight: "auto", columnGap: "32px" }}>
        {polaroids.map((src, i) => (
          <div key={src} style={{ breakInside: "avoid", marginBottom: "24px" }}>
            <RevealOnScroll>
              <LightboxTrigger images={allImages} index={i}>
                <img src={`/polaroids/${src}`} alt="" className="w-full h-auto object-cover" />
              </LightboxTrigger>
            </RevealOnScroll>
          </div>
        ))}
      </div>
    </section>
  );
}