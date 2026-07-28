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
    <section id="polaroids" className="w-full" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "48px", paddingBottom: "48px" }}>
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ columnGap: "24px", rowGap: "48px", maxWidth: "1600px", marginLeft: "auto", marginRight: "auto" }}>
        {polaroids.map((src, i) => (
          <LightboxTrigger key={src} images={allImages} index={i}>
            <img src={`/polaroids/${src}`} alt="" className="w-full h-auto object-cover" />
          </LightboxTrigger>
        ))}
      </div>
    </section>
  );
}