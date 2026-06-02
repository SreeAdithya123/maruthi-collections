import { useState } from 'react';
import { site } from '../data/site';

const OCCASIONS = ['Wedding', 'Festive', 'Daily', 'Gift', 'Other'];
const FIELD =
  'w-full border bg-ivory px-4 py-3 font-sans text-sm text-ink outline-none transition-colors duration-300 placeholder:text-ink-soft/60 focus:border-zari-gold';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', occasion: 'Wedding', message: '' });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const text =
      `Namaskaram Sai Priyanka,\n\n` +
      `Name: ${form.name || '—'}\n` +
      `Phone: ${form.phone || '—'}\n` +
      `Occasion: ${form.occasion}\n` +
      `Looking for: ${form.message || '—'}`;
    window.open(`https://wa.me/${site.phoneTel.replace('+', '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-roman text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={set('name')}
            placeholder="Your name"
            className={FIELD}
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
        <div>
          <label className="mb-2 block font-roman text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">
            Phone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            placeholder="+91 …"
            className={FIELD}
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block font-roman text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">
          Occasion
        </label>
        <select
          value={form.occasion}
          onChange={set('occasion')}
          className={FIELD}
          style={{ borderColor: 'var(--border)' }}
        >
          {OCCASIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block font-roman text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">
          Tell us what you&rsquo;re looking for
        </label>
        <textarea
          rows={3}
          value={form.message}
          onChange={set('message')}
          placeholder="A maroon Banarasi for a December wedding…"
          className={`${FIELD} resize-none`}
          style={{ borderColor: 'var(--border)' }}
        />
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto">
        Send Enquiry
      </button>
    </form>
  );
}
