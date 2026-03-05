import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Sentry } from "../instrument";
import { Button } from "./ui/button";

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
        <div className="min-h-screen flex items-center justify-center bg-sand-pearl p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <h1 className="text-2xl font-heading text-ocean-deep">
              Something went wrong
            </h1>
            <p className="text-sand-dark">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            {this.state.eventId && (
              <p className="text-xs text-sand-dark/60">
                Error ID: {this.state.eventId}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReload}>
                Refresh Page
              </Button>
              <Button variant="outline" onClick={this.handleGoHome}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
