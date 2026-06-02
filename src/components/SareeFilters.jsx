import { Check } from 'lucide-react';
import {
  PRICE_BANDS,
  WEAVES,
  FABRICS,
  OCCASIONS,
  REGIONS,
  COLOR_NAMES,
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
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-ink-soft transition-colors hover:text-maroon">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
          checked ? 'border-maroon bg-maroon' : 'border-ink-soft/40'
        }`}
      >
        {checked && <Check size={11} className="text-ivory" strokeWidth={3} />}
      </span>
      {label}
    </label>
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

      <Section title="Price">
        {PRICE_BANDS.map((b) => (
          <CheckRow key={b.id} label={b.label} checked={selected.bands.includes(b.id)} onChange={() => onToggle('price', b.id)} />
        ))}
      </Section>

      <Section title="Weave">
        {WEAVES.map((w) => (
          <CheckRow key={w.slug} label={w.label} checked={selected.weave.includes(w.slug)} onChange={() => onToggle('weave', w.slug)} />
        ))}
      </Section>

      <Section title="Fabric">
        {FABRICS.map((f) => (
          <CheckRow key={f} label={f} checked={selected.fabric.includes(f)} onChange={() => onToggle('fabric', f)} />
        ))}
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

      <Section title="Region">
        {REGIONS.map((r) => (
          <CheckRow key={r} label={r} checked={selected.region.includes(r)} onChange={() => onToggle('region', r)} />
        ))}
      </Section>
    </div>
  );
}
