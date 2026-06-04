import ContactForm from './ContactForm';
import { site } from '../data/site';
import HanumanFigure from './HanumanFigure';

function Block({ head, children }) {
  return (
    <div>
      <span className="font-roman text-[0.6rem] uppercase tracking-[0.24em] text-zari-gold">
        {head}
      </span>
      <div className="mt-2 text-[0.98rem] leading-relaxed text-ink-soft">{children}</div>
    </div>
  );
}

export default function ContactSection() {
  return (
    <section id="visit" className="grid bg-ivory md:grid-cols-2">
      {/* Left — Hanuman mark */}
      <div className="relative border-b md:border-b-0 md:border-r" style={{ borderColor: 'var(--border)' }}>
        <HanumanFigure />
      </div>

      {/* Right — visit panel */}
      <div className="flex flex-col justify-center px-6 py-16 md:px-14 md:py-20">
        <span className="label-roman">Come to Nidadavole</span>
        <h2 className="mt-4 font-display text-4xl font-light leading-tight text-maroon-deep md:text-5xl">
          Visit the <em className="italic text-zari-gold">boutique.</em>
        </h2>
        <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-ink-soft">
          Maruthi Collections is not on Amazon. It is a small, quiet boutique in Nidadavole —
          and the best way to choose your saree is to feel the silk between your fingers. Walk
          in, or call Sai Priyanka directly.
        </p>

        {/* Form */}
        <div className="mt-9">
          <ContactForm />
        </div>

        {/* Divider */}
        <div className="my-9 h-px w-full" style={{ background: 'var(--border)' }} />

        {/* Details */}
        <div className="grid gap-7 sm:grid-cols-2">
          <Block head="Address">
            {site.addressLines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </Block>
          <Block head="Call the Curator">
            <span className="block">{site.owner}</span>
            <a href={`tel:${site.phoneTel}`} className="block text-maroon hover:text-maroon-deep">
              {site.phoneDisplay}
            </a>
          </Block>
          <Block head="Open">
            {site.hours.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </Block>
        </div>

        {/* Actions */}
        <div className="mt-9 flex flex-wrap gap-3">
          <a href={`tel:${site.phoneTel}`} className="btn-primary">
            Call {site.phoneDisplay}
          </a>
          <a href={site.whatsapp} target="_blank" rel="noreferrer" className="btn-ghost">
            WhatsApp Sai Priyanka →
          </a>
        </div>
      </div>
    </section>
  );
}
