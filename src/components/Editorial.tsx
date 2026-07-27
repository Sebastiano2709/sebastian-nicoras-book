import Image from "next/image";

export default function Editorial() {
  return (
    <section
  id="editorial"
      style={{
        maxWidth: "1200px",
        margin: "120px auto",
        padding: "0 20px",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "48px",
          textAlign: "center",
          marginBottom: "60px",
          letterSpacing: "6px",
        }}
      >
        EDITORIAL
      </h2>

      {/* Fotografia principală */}
      <Image
        src="/portfolio/IMG_8164.jpeg"
        alt="Editorial Hero"
        width={1200}
        height={1600}
        style={{
          width: "100%",
          height: "auto",
          marginBottom: "30px",
          display: "block",
        }}
      />

      {/* Două fotografii dedesubt */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
        }}
      >
        <Image
          src="/portfolio/IMG_1688.jpeg"
          alt="Editorial 2"
          width={600}
          height={900}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />

        <Image
          src="/portfolio/IMG_5192.jpeg"
          alt="Editorial 3"
          width={600}
          height={900}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </div>
    </section>
  );
}