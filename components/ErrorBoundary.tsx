import React from 'react';
import TimeoutError from './TimeoutError';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  isTimeout: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isTimeout: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      isTimeout: error.message.includes('timed out'),
    };
  }

  render() {
    if (this.state.hasError) {
      if (this.state.isTimeout) {
        return <TimeoutError />;
      }
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;