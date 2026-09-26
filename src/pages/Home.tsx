import { Hero } from "../components/home/Hero";
import { PhotoMarquee } from "../components/home/PhotoMarquee";
import { EventInfo } from "../components/home/EventInfo";
import { EnxovalCta } from "../components/home/EnxovalCta";
import { Gallery } from "../components/home/Gallery";
import { PixSection } from "../components/home/PixSection";
import { Mural } from "../components/home/Mural";
import { Timeline } from "../components/home/Timeline";
import { HomeFooter } from "../components/home/HomeFooter";

export function Home() {
  return (
    <div className="page-transition">
      <Hero />
      <PhotoMarquee />
      <EventInfo />
      <EnxovalCta />
      <Gallery />
      <PixSection />
      <Mural />
      <Timeline />
      <HomeFooter />
    </div>
  );
}
