/**
 * Designed stand-in for product photography: a woven gradient swatch with a
 * zari border strip and a faint motif. Reused on cards, the detail gallery,
 * cart thumbnails, etc. Swap for <img> once real photos exist.
 */
export default function SareeSwatch({
  swatch = ['#6B1F25', '#8B2A30'],
  accent = '#D4AC7E',
  motif = '🌸',
  angle = 150,
  motifSize = '7rem',
  showBorder = true,
  className = '',
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(${angle}deg, ${swatch[0]}, ${swatch[1]})` }}
    >
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1.4px)',
          backgroundSize: '13px 13px',
        }}
      />
      {showBorder && (
        <div
          className="absolute inset-y-0 right-0 w-7"
          style={{
            background: `repeating-linear-gradient(45deg, ${accent}, ${accent} 4px, rgba(0,0,0,0.12) 4px, rgba(0,0,0,0.12) 8px)`,
            boxShadow: 'inset 2px 0 6px rgba(0,0,0,0.25)',
          }}
        />
      )}
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.14]"
        style={{ fontSize: motifSize }}
      >
        {motif}
      </span>
    </div>
  );
}
