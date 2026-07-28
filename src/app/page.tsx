import Hero from "@/components/Hero";
import StatsStrip from "@/components/StatsStrip";
import Polaroids from "@/components/Polaroids";
import SelectedWork from "@/components/SelectedWork";
import Measurements from "@/components/Measurements";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <main style={{ maxWidth: "1600px", margin: "0 auto" }}>
      <Nav />
      <Hero />
      <StatsStrip />
      <Polaroids />
      <SelectedWork />
      <Measurements />
    </main>
  );
}