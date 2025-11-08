import React, { Component } from 'react';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    // Call custom reset handler if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetError: this.handleReset,
        });
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-soft p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-danger-100 rounded-full mb-4">
              <svg 
                className="w-8 h-8 text-danger-600" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-center text-secondary-900 mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-center text-secondary-600 mb-6">
              We're sorry for the inconvenience. An unexpected error occurred.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-sm font-semibold text-danger-800 mb-2">
                  Error Details (Development Only):
                </p>
                <p className="text-xs text-danger-700 font-mono break-all mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs text-danger-600">
                    <summary className="cursor-pointer font-semibold mb-1">
                      Stack Trace
                    </summary>
                    <pre className="whitespace-pre-wrap overflow-auto max-h-40 p-2 bg-white rounded border border-danger-200">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                fullWidth
                onClick={this.handleReset}
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
            </div>
            
            {this.props.showReportButton && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    // Implement error reporting logic
                    console.log('Report error:', this.state.error);
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 underline"
                >
                  Report this issue
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
