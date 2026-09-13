import { Hero } from "../components/home/Hero";
import { EventInfo } from "../components/home/EventInfo";
import { MessageCards } from "../components/home/MessageCards";
import { Gallery } from "../components/home/Gallery";
import { EnxovalCta } from "../components/home/EnxovalCta";
import { ReasonGenerator } from "../components/home/ReasonGenerator";
import { Timeline } from "../components/home/Timeline";
import { HomeFooter } from "../components/home/HomeFooter";

export function Home() {
  return (
    <>
      <Hero />
      <EventInfo />
      <MessageCards />
      <Gallery />
      <EnxovalCta />
      <ReasonGenerator />
      <Timeline />
      <HomeFooter />
    </>
  );
}
