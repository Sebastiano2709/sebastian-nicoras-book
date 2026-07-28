import { portfolio } from "@/data/portfolio";
import { LightboxTrigger } from "@/components/Lightbox";

export default function SelectedWork() {
  const allImages = portfolio.map((img) => `/portfolio/${img}`);

  return (
    <section id="portfolio" className="w-full" style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "48px", paddingBottom: "48px" }}>
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ columnGap: "24px", rowGap: "48px", maxWidth: "1600px", marginLeft: "auto", marginRight: "auto" }}>
        {allImages.map((src, i) => (
          <LightboxTrigger key={src} images={allImages} index={i}>
            <img src={src} alt="" className="w-full h-auto object-cover" />
          </LightboxTrigger>
        ))}
      </div>
    </section>
  );
}