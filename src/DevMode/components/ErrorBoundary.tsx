/**
 * ErrorBoundary Component
 * Catches and handles errors in DevMode components
 */

import { h, Component } from 'preact';

interface ErrorBoundaryProps {
  fallback?: (error: Error, errorInfo: any) => any;
  onError?: (error: Error, errorInfo: any) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[DevMode] Component error:', error, errorInfo);
    
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
    
    // Call error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Log to external service if needed
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService(error: Error, errorInfo: any) {
    // In production, send to error tracking service
    if (typeof window !== 'undefined' && (window as any).errorTracker) {
      (window as any).errorTracker.log({
        error: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: Date.now(),
        context: 'DevMode'
      });
    }
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.state.errorInfo);
      }
      
      // Default error UI
      return (
        <div class="error-boundary">
          <div class="error-boundary__content">
            <svg class="error-boundary__icon" width="48" height="48" viewBox="0 0 24 24">
              <path fill="#f44336" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <h3 class="error-boundary__title">Something went wrong</h3>
            <p class="error-boundary__message">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <details class="error-boundary__details">
              <summary>Error Details</summary>
              <pre class="error-boundary__stack">
                {this.state.error?.stack}
              </pre>
            </details>
            <button 
              class="error-boundary__reset"
              onClick={this.reset}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}