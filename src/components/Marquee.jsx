const WEAVES = [
  'Kanjivaram',
  'Banarasi',
  'Pochampally',
  'Gadwal',
  'Uppada Pattu',
  'Venkatagiri',
  'Mangalagiri',
  'Dharmavaram',
];

function Track() {
  return (
    <div className="marquee-track animate-marquee">
      {WEAVES.concat(WEAVES).map((w, i) => (
        <span key={i} className="flex items-center">
          <span className="px-7 font-roman text-[0.7rem] uppercase tracking-[0.25em] text-white">
            {w}
          </span>
          <span className="inline-block h-1.5 w-1.5 rotate-45 bg-zari-light" />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="relative overflow-hidden bg-maroon py-4">
      <div className="flex w-max">
        <Track />
      </div>
    </div>
  );
}
