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

export default function Polaroids() {
  const allImages = polaroids.map((img) => `/polaroids/${img}`);

  return (
    <section id="polaroids" className="w-full bg-white py-16 md:py-32">
      <div className="px-6" style={{ maxWidth: "1152px", marginLeft: "auto", marginRight: "auto" }}>
        <h2 className="mb-12 md:mb-20 text-center text-3xl md:text-5xl tracking-[0.2em] md:tracking-[0.35em]" style={{ fontFamily: "var(--font-cormorant)" }}>POLAROIDS</h2>

        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "24px" }}>
          {polaroids.map((src, i) => (
            <LightboxTrigger key={src} images={allImages} index={i}>
              <div className="overflow-hidden bg-neutral-100">
                <Image src={`/polaroids/${src}`} alt="" width={700} height={1000} className="block w-full h-auto object-cover transition-transform duration-500" />
              </div>
            </LightboxTrigger>
          ))}
        </div>
      </div>
    </section>
  );
}