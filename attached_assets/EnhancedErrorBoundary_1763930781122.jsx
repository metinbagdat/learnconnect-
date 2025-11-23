// Updated: EnhancedErrorBoundary.jsx
import React from 'react';

class EnhancedErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to analytics service
    this.logError(error, errorInfo);
  }

  logError = async (error, errorInfo) => {
    try {
      // Send error to your error tracking service
      console.error('Component Error:', error, errorInfo);
      
      // You can send this to your backend
      if (this.props.onError) {
        this.props.onError(error, errorInfo);
      }
    } catch (loggingError) {
      console.error('Error logging failed:', loggingError);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>🔄 Something went wrong</h2>
            <p>We're sorry, but something went wrong. Please try refreshing the page.</p>
            {this.props.fallback || (
              <button 
                onClick={() => window.location.reload()}
                className="retry-button"
              >
                Refresh Page
              </button>
            )}
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <pre>{this.state.error?.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;