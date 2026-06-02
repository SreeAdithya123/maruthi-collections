import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import HeroCanvas from '../components/HeroCanvas';
import Marquee from '../components/Marquee';
import AboutCurator from '../components/AboutCurator';
import VideoScrollText from '../components/VideoScrollText';
import CollectionStack from '../components/CollectionStack';
import RegionGrid from '../components/RegionGrid';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';

export default function Home() {
  useRevealOnScroll([]);

  return (
    <>
      <HeroCanvas />
      <Marquee />
      <AboutCurator />
      <VideoScrollText />
      <CollectionStack />
      <RegionGrid />
      <Testimonials />
      <ContactSection />
    </>
  );
}
