import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 flex flex-col justify-center" style={{ paddingTop: "120px", paddingBottom: "60px", paddingLeft: "clamp(24px, 8vw, 96px)", paddingRight: "clamp(24px, 8vw, 96px)" }}>
        <p className="uppercase tracking-[0.3em] text-neutral-400" style={{ marginBottom: "24px", fontSize: "20px" }}>
          Sebastian Nicoras
        </p>
        <a href="#portfolio" className="uppercase hover:text-neutral-500 transition" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(40px, 7vw, 88px)", letterSpacing: "0.1em", lineHeight: 1.15 }}>Portfolio</a>
        <a href="#polaroids" className="uppercase hover:text-neutral-500 transition" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(40px, 7vw, 88px)", letterSpacing: "0.1em", lineHeight: 1.15 }}>Polaroids</a>
        <a href="https://instagram.com/sebastiano.nicoras" target="_blank" rel="noopener noreferrer" className="uppercase hover:text-neutral-500 transition" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(40px, 7vw, 88px)", letterSpacing: "0.1em", lineHeight: 1.15 }}>Instagram</a>
      </div>

      <div className="w-full md:w-1/2 relative" style={{ minHeight: "60vh" }}>
        <Image
          src="/portfolio/IMG_5192.jpeg"
          alt="Sebastian Nicoras"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "center 15%" }}
        />
      </div>
    </section>
  );
}