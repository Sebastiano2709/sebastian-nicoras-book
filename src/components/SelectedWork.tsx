import { portfolio } from "@/data/portfolio";
import { LightboxTrigger } from "@/components/Lightbox";

export default function SelectedWork() {
  const allImages = portfolio.map((img) => `/portfolio/${img}`);

  return (
    <section id="portfolio" className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: "12px" }}>
        {allImages.map((src, i) => (
          <LightboxTrigger key={src} images={allImages} index={i}>
            <div className="aspect-[3/4] overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          </LightboxTrigger>
        ))}
      </div>
    </section>
  );
}