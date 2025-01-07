import React from 'react';
import TimeoutError from './TimeoutError';

interface Props {
  children: React.ReactNode;
  error?: Error | null;
}

interface State {
  hasError: boolean;
  isTimeout: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: Boolean(props.error),
      isTimeout: props.error?.message.includes('timed out') || false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      isTimeout: error.message.includes('timed out'),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.error !== prevProps.error) {
      this.setState({
        hasError: Boolean(this.props.error),
        isTimeout: this.props.error?.message.includes('timed out') || false,
      });
    }
  }

  render() {
    if (this.state.hasError || this.props.error) {
      if (this.state.isTimeout || this.props.error?.message.includes('timed out')) {
        return <TimeoutError />;
      }
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;