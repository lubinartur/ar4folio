import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-background text-white min-h-screen flex items-center justify-center p-6 font-sans">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-display font-bold mb-4 text-white">
              Something went wrong
            </h1>
            <p className="text-neutral-400 mb-6">
              An unexpected error occurred. Please refresh the page to continue.
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-sm font-mono uppercase tracking-widest text-neutral-300 hover:text-white transition-colors"
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
