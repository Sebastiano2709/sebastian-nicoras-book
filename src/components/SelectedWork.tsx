import { portfolio } from "@/data/portfolio";
import { LightboxTrigger } from "@/components/Lightbox";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function SelectedWork() {
  const allImages = portfolio.map((img) => `/portfolio/${img}`);

  return (
    <section id="portfolio" className="w-full px-0 md:px-12" style={{ paddingTop: "16px", paddingBottom: "16px" }}>
      <div className="columns-1 md:columns-2" style={{ maxWidth: "1400px", marginLeft: "auto", marginRight: "auto", columnGap: "32px" }}>
        {allImages.map((src, i) => (
          <div key={src} style={{ breakInside: "avoid", marginBottom: "24px" }}>
            <RevealOnScroll>
              <LightboxTrigger images={allImages} index={i}>
                <img src={src} alt="" className="w-full h-auto object-cover" />
              </LightboxTrigger>
            </RevealOnScroll>
          </div>
        ))}
      </div>
    </section>
  );
}