import { Hero } from "../components/home/Hero";
import { PhotoMarquee } from "../components/home/PhotoMarquee";
import { Destaques } from "../components/home/Destaques";
import { EnxovalCta } from "../components/home/EnxovalCta";
import { PixSection } from "../components/home/PixSection";
import { HomeFooter } from "../components/home/HomeFooter";

export function Home() {
  return (
    <div className="page-transition">
      <Hero />
      <PhotoMarquee />
      <Destaques />
      <EnxovalCta />
      <PixSection />
      <HomeFooter />
    </div>
  );
}
