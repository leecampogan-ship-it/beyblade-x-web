"use client";

import { Component, type ReactNode } from "react";

interface Props {
  fallback: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Catches WebGL / Three.js runtime errors so a failing scene never breaks the page. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[3D scene] falling back to static illustration:", error);
    }
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
