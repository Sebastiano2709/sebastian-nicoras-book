import { portfolio } from "@/data/portfolio";
import { LightboxTrigger } from "@/components/Lightbox";

export default function SelectedWork() {
  const allImages = portfolio.map((img) => `/portfolio/${img}`);

  return (
    <section id="portfolio" className="w-full" style={{ paddingLeft: "48px", paddingRight: "48px", paddingTop: "48px", paddingBottom: "48px" }}>
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ columnGap: "32px", maxWidth: "1400px", marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
          {allImages.filter((_, i) => i % 2 === 0).map((src) => {
            const i = allImages.indexOf(src);
            return (
              <LightboxTrigger key={src} images={allImages} index={i}>
                <img src={src} alt="" className="w-full h-auto object-cover" />
              </LightboxTrigger>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "64px", marginTop: "80px" }}>
          {allImages.filter((_, i) => i % 2 === 1).map((src) => {
            const i = allImages.indexOf(src);
            return (
              <LightboxTrigger key={src} images={allImages} index={i}>
                <img src={src} alt="" className="w-full h-auto object-cover" />
              </LightboxTrigger>
            );
          })}
        </div>
      </div>
    </section>
  );
}