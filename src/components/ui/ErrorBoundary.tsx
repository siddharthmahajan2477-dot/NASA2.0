import { Component, type ReactNode } from 'react'

export default class ErrorBoundary extends Component<{ children: ReactNode; message: string }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <div className="notice" role="alert"><p>{this.props.message}</p><button className="text-button" onClick={() => window.location.reload()}>Reload application</button></div>
    return this.props.children
  }
}
