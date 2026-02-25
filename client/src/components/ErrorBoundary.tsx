import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Sentry } from "../instrument";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  eventId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, eventId: null };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true, eventId: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    Sentry.withScope((scope) => {
      scope.setExtra("componentStack", errorInfo.componentStack);
      scope.setTag("error_boundary", "true");
      scope.setLevel("error");
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <h1 className="text-2xl font-serif text-stone-800">
              Something went wrong
            </h1>
            <p className="text-stone-600">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            {this.state.eventId && (
              <p className="text-xs text-stone-400">
                Error ID: {this.state.eventId}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-stone-800 text-white rounded-md hover:bg-stone-700 transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-100 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
