import { Hero } from "../components/home/Hero";
import { MessageCards } from "../components/home/MessageCards";
import { Gallery } from "../components/home/Gallery";
import { ReasonGenerator } from "../components/home/ReasonGenerator";
import { Timeline } from "../components/home/Timeline";
import { HomeFooter } from "../components/home/HomeFooter";

export function Home() {
  return (
    <>
      <Hero />
      <MessageCards />
      <Gallery />
      <ReasonGenerator />
      <Timeline />
      <HomeFooter />
    </>
  );
}
