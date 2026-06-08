import { Component, ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="frosted-glass-dark rounded-3xl p-8 max-w-lg mx-auto mt-12 text-center space-y-4 border border-red-500/30">
          <div className="w-14 h-14 rounded-full bg-red-950 border border-red-500/30 flex items-center justify-center mx-auto">
            <span className="text-red-400 text-2xl font-extrabold">!</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Something went wrong</h3>
          <p className="text-xs text-slate-400 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-left select-all">
            {this.state.error?.message || "Unknown error"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase transition"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
