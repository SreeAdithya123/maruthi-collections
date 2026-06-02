import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import AboutCurator from '../components/AboutCurator';
import Testimonials from '../components/Testimonials';
import SectionDivider from '../components/SectionDivider';

export default function Story() {
  useRevealOnScroll([]);

  return (
    <div className="bg-ivory pt-16">
      <AboutCurator />
      <SectionDivider className="pb-4" />
      <Testimonials />
    </div>
  );
}
