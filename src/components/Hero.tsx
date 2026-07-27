import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16" style={{ paddingTop: "120px", paddingBottom: "60px" }}>
        <p className="uppercase tracking-[0.3em] text-xs text-neutral-400" style={{ marginBottom: "24px" }}>
          Sebastian Nicoras
        </p>
        <a href="#portfolio" className="font-serif leading-[0.95] hover:text-neutral-500 transition" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(48px, 9vw, 110px)" }}>Portfolio</a>
        <a href="#polaroids" className="font-serif leading-[0.95] hover:text-neutral-500 transition" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(48px, 9vw, 110px)" }}>Polaroids</a>
        <a href="https://instagram.com/sebastiano.nicoras" target="_blank" rel="noopener noreferrer" className="font-serif leading-[0.95] hover:text-neutral-500 transition" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(48px, 9vw, 110px)" }}>Instagram</a>
      </div>

      <div className="w-full md:w-1/2 relative" style={{ minHeight: "60vh" }}>
        <Image
          src="/portfolio/IMG_5192.jpeg"
          alt="Sebastian Nicoras"
          fill
          priority
          className="object-cover"
        />
      </div>
    </section>
  );
}