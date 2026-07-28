import { LightboxTrigger } from "@/components/Lightbox";

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
    <section id="polaroids" className="w-full" style={{ paddingLeft: "48px", paddingRight: "48px", paddingTop: "48px", paddingBottom: "48px" }}>
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ columnGap: "32px", maxWidth: "1400px", marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
          {polaroids.filter((_, i) => i % 2 === 0).map((src) => {
            const i = polaroids.indexOf(src);
            return (
              <LightboxTrigger key={src} images={allImages} index={i}>
                <img src={`/polaroids/${src}`} alt="" className="w-full h-auto object-cover" />
              </LightboxTrigger>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "64px", marginTop: "80px" }}>
          {polaroids.filter((_, i) => i % 2 === 1).map((src) => {
            const i = polaroids.indexOf(src);
            return (
              <LightboxTrigger key={src} images={allImages} index={i}>
                <img src={`/polaroids/${src}`} alt="" className="w-full h-auto object-cover" />
              </LightboxTrigger>
            );
          })}
        </div>
      </div>
    </section>
  );
}