import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import ContactSection from '../components/ContactSection';

export default function Visit() {
  useRevealOnScroll([]);

  return (
    <div className="bg-ivory pt-16">
      <ContactSection />
    </div>
  );
}
