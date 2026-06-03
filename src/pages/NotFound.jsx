import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
      <span className="label-roman">404</span>
      <h1 className="mt-4 font-display text-5xl font-light text-maroon-deep">This thread leads nowhere.</h1>
      <p className="mt-3 max-w-sm text-ink-soft">
        The page you&rsquo;re looking for has folded away. Let&rsquo;s find you a saree instead.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/sarees" className="btn-primary">Browse the Collection</Link>
        <Link to="/" className="btn-ghost">Back Home</Link>
      </div>
    </div>
  );
}
