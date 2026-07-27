import Image from "next/image";

export default function Hero() {
  return (
    <section className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center px-6" style={{ paddingTop: "80px", paddingBottom: "64px" }}>
      <h1
        className="text-center tracking-[0.25em] text-5xl md:text-7xl"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        SEBASTIAN NICORAS
      </h1>

      <p className="text-xs md:text-sm uppercase tracking-[0.5em] text-gray-500" style={{ marginTop: "1.25rem" }}>
        MEN&apos;S FASHION MODEL
      </p>

      <div className="w-full max-w-md" style={{ marginTop: "1.5rem", marginBottom: "0" }}>
        <Image
          src="/portfolio/IMG_5192.jpeg"
          alt="Sebastian Nicoras"
          width={700}
          height={1050}
          priority
          className="w-full h-auto"
        />
      </div>

      <p className="text-sm tracking-[0.2em] text-center text-gray-700" style={{ marginTop: "2rem", marginBottom: "0" }}>
        181 CM · 74 KG · CHEST 99 · WAIST 81 · SHOES 42
      </p>

      <a href="#selected-work" className="border border-black px-8 py-4 uppercase tracking-[0.3em] text-xs hover:bg-black hover:text-white transition" style={{ marginTop: "3rem" }}>
        View Portfolio
      </a>
    </section>
  );
}