import { portfolio } from "@/data/portfolio";
import { LightboxTrigger } from "@/components/Lightbox";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function SelectedWork() {
  const allImages = portfolio.map((img) => `/portfolio/${img}`);

  return (
    <section id="portfolio" className="w-full px-4 md:px-12" style={{ paddingTop: "16px", paddingBottom: "16px" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8" style={{ maxWidth: "1400px", marginLeft: "auto", marginRight: "auto" }}>
        <div className="flex flex-col gap-5 md:gap-16">
          {allImages.filter((_, i) => i % 2 === 0).map((src) => {
            const i = allImages.indexOf(src);
            return (
              <RevealOnScroll key={src}>
                <LightboxTrigger images={allImages} index={i}>
                  <img src={src} alt="" className="w-full h-auto object-cover" />
                </LightboxTrigger>
              </RevealOnScroll>
            );
          })}
        </div>
        <div className="flex flex-col gap-5 md:gap-16" style={{ marginTop: "80px" }}>
          {allImages.filter((_, i) => i % 2 === 1).map((src) => {
            const i = allImages.indexOf(src);
            return (
              <RevealOnScroll key={src}>
                <LightboxTrigger images={allImages} index={i}>
                  <img src={src} alt="" className="w-full h-auto object-cover" />
                </LightboxTrigger>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}