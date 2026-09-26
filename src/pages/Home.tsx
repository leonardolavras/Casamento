import { Hero } from "../components/home/Hero";
import { PhotoMarquee } from "../components/home/PhotoMarquee";
import { EventInfo } from "../components/home/EventInfo";
import { Gallery } from "../components/home/Gallery";
import { EnxovalCta } from "../components/home/EnxovalCta";
import { Timeline } from "../components/home/Timeline";
import { HomeFooter } from "../components/home/HomeFooter";

export function Home() {
  return (
    <>
      <Hero />
      <PhotoMarquee />
      <EventInfo />
      <EnxovalCta />
      <Gallery />
      <Timeline />
      <HomeFooter />
    </>
  );
}
