import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', border: '1px solid var(--accent-magenta)' }}>
          <AlertTriangle size={32} color="var(--accent-magenta)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Component Crashed</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem', maxWidth: '300px' }}>
            {this.state.error?.message || 'An unexpected error occurred while rendering this widget.'}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn-primary"
            style={{ background: 'transparent', borderColor: 'var(--text-muted)', color: 'var(--text-main)' }}
          >
            <RefreshCcw size={16} /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
