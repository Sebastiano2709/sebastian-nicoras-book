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

export default function Polaroids() {
  const allImages = polaroids.map((img) => `/polaroids/${img}`);

  return (
    <section id="polaroids" className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "12px" }}>
        {polaroids.map((src, i) => (
          <LightboxTrigger key={src} images={allImages} index={i}>
            <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
              <img src={`/polaroids/${src}`} alt="" className="w-full h-full object-cover" />
            </div>
          </LightboxTrigger>
        ))}
      </div>
    </section>
  );
}