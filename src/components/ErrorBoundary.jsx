import { Component } from 'react';
import { captureError } from '../lib/analytics';
import { createLogger } from '../lib/log';

const log = createLogger('error-boundary');

/**
 * Isolates a subtree so a render-time failure (e.g. WebGL context creation
 * failing on a GPU-less / WebGL-disabled client) degrades to a fallback
 * instead of white-screening the whole site.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    // Always surface in the console (red gutter) — a degraded subtree is a real
    // problem even if the page didn't white-screen.
    log.error('caught a render failure — subtree degraded to fallback:', error);
    // Report to PostHog error tracking so a degraded subtree is visible in data.
    captureError(error, { componentStack: info?.componentStack });
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default ErrorBoundary;
