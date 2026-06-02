export default function SectionDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-2 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-zari-gold/50" />
      <span className="h-2 w-2 rotate-45 bg-zari-gold/70" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-zari-gold/50" />
    </div>
  );
}
