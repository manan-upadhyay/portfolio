import { Component } from 'react';
import { captureError } from '../lib/analytics';

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
    if (import.meta.env.DEV) console.warn('[ErrorBoundary] caught:', error?.message);
    // Report to PostHog error tracking so a degraded subtree is visible in data.
    captureError(error, { componentStack: info?.componentStack });
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default ErrorBoundary;
