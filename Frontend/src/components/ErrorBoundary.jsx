import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // you could log to an external service here
    console.error('ErrorBoundary caught', error, info)
    // store component stack for rendering
    try { this.setState({ error, componentStack: info?.componentStack || '' }) } catch (e) {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-3xl mx-auto mt-8">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <div className="bg-yellow-50 p-4 rounded text-sm text-red-700">
            <div className="font-semibold mb-2">Error:</div>
            <pre className="whitespace-pre-wrap">{this.state.error && (this.state.error.stack || String(this.state.error))}</pre>
            {this.state.componentStack && (
              <>
                <div className="font-semibold mt-3 mb-1">Component stack:</div>
                <pre className="whitespace-pre-wrap text-xs text-gray-700">{this.state.componentStack}</pre>
              </>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
