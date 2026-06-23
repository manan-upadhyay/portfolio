import { Component } from 'react';

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

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.warn('[ErrorBoundary] caught:', error?.message);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default ErrorBoundary;
