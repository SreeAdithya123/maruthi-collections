import { Check } from 'lucide-react';
import {
  PRICE_BANDS,
  TYPES,
  OCCASIONS,
  COLOR_NAMES,
  WOMEN_SIZES,
  KIDS_SIZES,
  colorSwatch,
  occasionLabel,
} from '../data/sarees';

function Section({ title, children }) {
  return (
    <div className="border-b py-5" style={{ borderColor: 'var(--border)' }}>
      <h4 className="mb-3 font-roman text-[0.62rem] uppercase tracking-[0.22em] text-maroon-deep">
        {title}
      </h4>
      {children}
    </div>
  );
}

function CheckRow({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className="flex w-full cursor-pointer items-center gap-2.5 py-1 text-left text-sm text-ink-soft transition-colors hover:text-maroon"
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
          checked ? 'border-maroon bg-maroon' : 'border-ink-soft/40'
        }`}
      >
        {checked && <Check size={11} className="text-ivory" strokeWidth={3} />}
      </span>
      {label}
    </button>
  );
}

function SizeChip({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`min-w-[2.6rem] rounded-[2px] border px-2 py-1 text-center font-roman text-[0.62rem] uppercase tracking-[0.1em] transition ${
        checked ? 'border-maroon bg-maroon text-ivory' : 'border-border text-ink-soft hover:border-maroon hover:text-maroon'
      }`}
    >
      {label}
    </button>
  );
}

export default function SareeFilters({ selected, onToggle, onClear }) {
  const hasAny = Object.values(selected).some((arr) => arr.length);

  return (
    <div>
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
        <span className="font-roman text-[0.65rem] uppercase tracking-[0.22em] text-maroon-deep">
          Refine
        </span>
        {hasAny && (
          <button onClick={onClear} className="font-sans text-xs text-peacock-teal hover:underline">
            Clear all
          </button>
        )}
      </div>

      <Section title="Type">
        {TYPES.map((t) => (
          <CheckRow key={t.slug} label={t.label} checked={selected.type.includes(t.slug)} onChange={() => onToggle('type', t.slug)} />
        ))}
      </Section>

      <Section title="Price">
        {PRICE_BANDS.map((b) => (
          <CheckRow key={b.id} label={b.label} checked={selected.bands.includes(b.id)} onChange={() => onToggle('price', b.id)} />
        ))}
      </Section>

      <Section title="Size">
        <p className="mb-1.5 font-roman text-[0.5rem] uppercase tracking-[0.16em] text-ink-soft/70">Women</p>
        <div className="flex flex-wrap gap-1.5">
          {WOMEN_SIZES.map((s) => (
            <SizeChip key={s} label={s} checked={selected.size.includes(s)} onChange={() => onToggle('size', s)} />
          ))}
        </div>
        <p className="mb-1.5 mt-3 font-roman text-[0.5rem] uppercase tracking-[0.16em] text-ink-soft/70">Girls</p>
        <div className="flex flex-wrap gap-1.5">
          {KIDS_SIZES.map((s) => (
            <SizeChip key={s} label={s} checked={selected.size.includes(s)} onChange={() => onToggle('size', s)} />
          ))}
        </div>
      </Section>

      <Section title="Occasion">
        {OCCASIONS.map((o) => (
          <CheckRow key={o} label={occasionLabel(o)} checked={selected.occasion.includes(o)} onChange={() => onToggle('occasion', o)} />
        ))}
      </Section>

      <Section title="Colour">
        <div className="flex flex-wrap gap-2 pt-1">
          {COLOR_NAMES.map((c) => {
            const active = selected.color.includes(c);
            return (
              <button
                key={c}
                title={c}
                onClick={() => onToggle('color', c)}
                aria-label={c}
                className={`h-7 w-7 rounded-full border-2 transition ${
                  active ? 'scale-110 border-maroon-deep' : 'border-transparent hover:scale-105'
                }`}
                style={{ background: colorSwatch(c)[1] }}
              />
            );
          })}
        </div>
      </Section>
    </div>
  );
}
