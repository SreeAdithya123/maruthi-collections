import { Component } from 'react';

/**
 * Stops any single component (e.g. a WebGL failure) from white-screening the
 * whole site. Shows a quiet, on-brand fallback instead.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Maruthi UI error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-ivory px-6 text-center">
            <span className="font-display text-3xl italic text-maroon">Maruthi Collections</span>
            <p className="max-w-sm text-ink-soft">
              Something slipped a thread. Please refresh — or call Sai Priyanka directly at
              <a href="tel:+918639232932" className="text-maroon">
                {' '}
                +91 86392 32932
              </a>
              .
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
