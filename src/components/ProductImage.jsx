import SareeSwatch from './SareeSwatch';

/**
 * Renders a saree's first uploaded photo when it has one, otherwise falls back
 * to the designed gradient swatch. `className` controls size/shape for both.
 */
export default function ProductImage({ saree, className = '', motifSize = '4rem', angle }) {
  const src = saree?.images?.[0];
  if (src) {
    return (
      <img
        src={src}
        alt={saree.title}
        loading="lazy"
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <SareeSwatch
      swatch={saree.swatch}
      accent={saree.accent}
      motif={saree.motif}
      angle={angle}
      motifSize={motifSize}
      className={className}
    />
  );
}
