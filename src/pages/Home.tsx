import { Hero } from "../components/home/Hero";
import { EventInfo } from "../components/home/EventInfo";
import { ParallaxDivider } from "../components/home/ParallaxDivider";
import { Gallery } from "../components/home/Gallery";
import { EnxovalCta } from "../components/home/EnxovalCta";
import { Timeline } from "../components/home/Timeline";
import { HomeFooter } from "../components/home/HomeFooter";
import { GALLERY_PHOTOS } from "../config/site";

export function Home() {
  return (
    <>
      <Hero />
      <EventInfo />

      <ParallaxDivider src={GALLERY_PHOTOS[1]?.src || "/fotos/foto2.jpeg"} />

      <Gallery />

      <EnxovalCta />

      <ParallaxDivider src={GALLERY_PHOTOS[5]?.src || "/fotos/foto6.jpeg"}>
        <p>Cada item é um pedaço do nosso lar</p>
      </ParallaxDivider>

      <Timeline />
      <HomeFooter />
    </>
  );
}
