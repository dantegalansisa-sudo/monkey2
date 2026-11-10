import { FinalCta } from '../components/Chrome';
import Hero from '../sections/Hero';
import { Audiences, BeatBanner, EventBuilder, Faq, Featured, Genres, NamesBand, Process, Stats } from '../sections/HomeSections';

export default function Home({ ready }: { ready: boolean }) {
  return (
    <>
      <Hero ready={ready} />
      <NamesBand />
      <Genres />
      <Featured />
      <EventBuilder />
      <Process />
      <Audiences />
      <Stats />
      <BeatBanner />
      <Faq limit={4} />
      <FinalCta />
    </>
  );
}
