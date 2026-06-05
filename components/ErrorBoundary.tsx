'use client'

import { Component, type ReactNode } from 'react'

interface Props  { children: ReactNode }
interface State  { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100dvh',
            display:   'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050505',
            color: '#efefef',
            fontFamily: 'system-ui, sans-serif',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <p style={{ fontSize: 15, opacity: 0.7 }}>Something went wrong loading the page.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: '1px solid #333',
              background: 'transparent',
              color: '#efefef',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Reload
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
