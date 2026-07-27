import Image from "next/image";
import { portfolio } from "@/data/portfolio";
import { LightboxTrigger } from "@/components/Lightbox";

const sectionStyle: React.CSSProperties = {
  maxWidth: "860px",
  margin: "0 auto",
  padding: "128px 24px",
};

const headingStyle: React.CSSProperties = {
  textAlign: "center",
  fontSize: "3rem",
  letterSpacing: "0.3em",
  marginBottom: "5rem",
  fontFamily: "var(--font-cormorant)",
};

const bigImgStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  maxWidth: "100%",
  height: "auto",
  marginBottom: "2rem",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "2rem",
  marginBottom: "2rem",
};

const gridStyle3: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "2rem",
};

const gridImgStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  maxWidth: "100%",
  height: "auto",
};

export default function SelectedWork() {
  const allImages = portfolio.map((img) => `/portfolio/${img}`);

  return (
    <section id="selected-work" style={sectionStyle}>
      <h2 style={headingStyle}>SELECTED WORK</h2>

      <LightboxTrigger images={allImages} index={0}>
        <Image
          src={`/portfolio/${portfolio[0]}`}
          alt=""
          width={1400}
          height={1800}
          style={bigImgStyle}
        />
      </LightboxTrigger>

      <div style={gridStyle}>
        <LightboxTrigger images={allImages} index={1}>
          <Image src={`/portfolio/${portfolio[1]}`} alt="" width={700} height={1000} style={gridImgStyle} />
        </LightboxTrigger>
        <LightboxTrigger images={allImages} index={2}>
          <Image src={`/portfolio/${portfolio[2]}`} alt="" width={700} height={1000} style={gridImgStyle} />
        </LightboxTrigger>
      </div>

      <LightboxTrigger images={allImages} index={3}>
        <Image
          src={`/portfolio/${portfolio[3]}`}
          alt=""
          width={1400}
          height={1800}
          style={bigImgStyle}
        />
      </LightboxTrigger>

      <div style={gridStyle}>
        <LightboxTrigger images={allImages} index={4}>
          <Image src={`/portfolio/${portfolio[4]}`} alt="" width={700} height={1000} style={gridImgStyle} />
        </LightboxTrigger>
        <LightboxTrigger images={allImages} index={5}>
          <Image src={`/portfolio/${portfolio[5]}`} alt="" width={700} height={1000} style={gridImgStyle} />
        </LightboxTrigger>
      </div>

      <LightboxTrigger images={allImages} index={6}>
        <Image
          src={`/portfolio/${portfolio[6]}`}
          alt=""
          width={1400}
          height={1800}
          style={bigImgStyle}
        />
      </LightboxTrigger>

      <div style={gridStyle3}>
        {portfolio.slice(7).map((image, i) => (
          <LightboxTrigger key={image} images={allImages} index={7 + i}>
            <Image src={`/portfolio/${image}`} alt="" width={700} height={1000} style={gridImgStyle} />
          </LightboxTrigger>
        ))}
      </div>
    </section>
  );
}