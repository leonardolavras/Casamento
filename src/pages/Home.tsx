import { Hero } from "../components/home/Hero";
import { PhotoMarquee } from "../components/home/PhotoMarquee";
import { EventInfo } from "../components/home/EventInfo";
import { EnxovalCta } from "../components/home/EnxovalCta";
import { PixSection } from "../components/home/PixSection";
import { HomeFooter } from "../components/home/HomeFooter";

export function Home() {
  return (
    <div className="page-transition">
      <Hero />
      <PhotoMarquee />
      <EventInfo />
      <EnxovalCta />
      <PixSection />
      <HomeFooter />
    </div>
  );
}
