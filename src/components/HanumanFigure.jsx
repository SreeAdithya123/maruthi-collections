/**
 * The Hanuman ("Maruti") brand mark presented as the contact-section visual —
 * a gently floating figure inside a slow gold mandala. Replaces the old Three.js
 * avatar (no WebGL, far lighter).
 */
export default function HanumanFigure() {
  return (
    <div className="relative flex min-h-[480px] items-center justify-center overflow-hidden px-6 py-16 md:min-h-screen">
      {/* Soft warm glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute h-[260px] w-[260px] rounded-full bg-zari-gold/15 blur-3xl md:h-[380px] md:w-[380px]"
      />
      {/* Mandala rings */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute h-[300px] w-[300px] rounded-full border border-zari-gold/30 [animation:spin_30s_linear_infinite] md:h-[440px] md:w-[440px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute h-[244px] w-[244px] rounded-full border border-dashed border-zari-gold/25 [animation:spin_44s_linear_infinite_reverse] md:h-[360px] md:w-[360px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute h-[188px] w-[188px] rounded-full border border-maroon/15 md:h-[280px] md:w-[280px]"
      />

      <div className="relative z-10 flex flex-col items-center">
        <img
          src="/hanuman.png"
          alt="Baby Hanuman — Maruti, the Maruthi Collections brand mark"
          className="h-60 w-auto animate-floaty drop-shadow-[0_18px_40px_rgba(74,20,24,0.18)] md:h-80"
        />
        <p className="mt-5 font-display text-lg italic text-maroon md:text-xl">🙏 Namaskaram</p>
      </div>
    </div>
  );
}
