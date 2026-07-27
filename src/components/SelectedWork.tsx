import { portfolio } from "@/data/portfolio";
import { LightboxTrigger } from "@/components/Lightbox";

export default function SelectedWork() {
  const allImages = portfolio.map((img) => `/portfolio/${img}`);

  const first = allImages[0];
  const second = allImages.slice(1, 3);
  const third = allImages[3];
  const fourth = allImages.slice(4, 6);
  const fifth = allImages[6];
  const rest = allImages.slice(7);

  return (
    <section id="portfolio" className="w-full px-4 md:px-12 py-12 md:py-20" style={{ maxWidth: "1152px", marginLeft: "auto", marginRight: "auto" }}>
      <h2 className="text-2xl md:text-4xl font-serif text-center" style={{ marginBottom: "56px" }}>Selected Work</h2>

      <div style={{ marginBottom: "40px" }}>
        <LightboxTrigger images={allImages} index={0}><img src={first} alt="" className="w-full h-auto object-cover" /></LightboxTrigger>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "24px", marginBottom: "40px" }}>
        {second.map((src, i) => (
          <LightboxTrigger key={src} images={allImages} index={i + 1}><img src={src} alt="" className="w-full h-auto object-cover" /></LightboxTrigger>
        ))}
      </div>

      <div style={{ marginBottom: "40px" }}>
        <LightboxTrigger images={allImages} index={3}><img src={third} alt="" className="w-full h-auto object-cover" /></LightboxTrigger>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "24px", marginBottom: "40px" }}>
        {fourth.map((src, i) => (
          <LightboxTrigger key={src} images={allImages} index={i + 4}><img src={src} alt="" className="w-full h-auto object-cover" /></LightboxTrigger>
        ))}
      </div>

      <div style={{ marginBottom: "40px" }}>
        <LightboxTrigger images={allImages} index={6}><img src={fifth} alt="" className="w-full h-auto object-cover" /></LightboxTrigger>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: "16px" }}>
        {rest.map((src, i) => (
          <LightboxTrigger key={src} images={allImages} index={i + 7}>
            <div className="aspect-[3/4] overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          </LightboxTrigger>
        ))}
      </div>
    </section>
  );
}