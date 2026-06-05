'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Calendly?: any
  }
}

const BASE_URL = 'https://calendly.com/joemarbelmonte-automation/30min'

function getCalendlyUrl(theme: 'dark' | 'light') {
  if (theme === 'dark') {
    return `${BASE_URL}?hide_gdpr_banner=1&background_color=0D1A26&text_color=E8F4FF&primary_color=00C8FF`
  }
  return `${BASE_URL}?hide_gdpr_banner=1&background_color=FFFFFF&text_color=0D1B2A&primary_color=0090CC`
}

export default function CalendlyWidget() {
  const widgetRef      = useRef<HTMLDivElement>(null)
  const [ready, setReady]   = useState(false)
  const [theme, setTheme]   = useState<'dark' | 'light'>('light')

  /* ── Inject Calendly stylesheet once ─────────────────── */
  useEffect(() => {
    if (document.querySelector('link[href*="calendly.com/assets"]')) return
    const link = document.createElement('link')
    link.rel  = 'stylesheet'
    link.href = 'https://assets.calendly.com/assets/external/widget.css'
    document.head.appendChild(link)
  }, [])

  /* ── Watch document data-theme changes ────────────────── */
  useEffect(() => {
    const getTheme = (): 'dark' | 'light' => {
      const el = document.querySelector('[data-theme]')
      return el?.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    }

    setTheme(getTheme())

    const obs = new MutationObserver(() => setTheme(getTheme()))
    obs.observe(document.body, {
      attributes:      true,
      attributeFilter: ['data-theme'],
      subtree:         true,
    })
    return () => obs.disconnect()
  }, [])

  /* ── Re-init widget on theme change ───────────────────── */
  useEffect(() => {
    if (!ready || !widgetRef.current) return
    const url = getCalendlyUrl(theme)
    widgetRef.current.setAttribute('data-url', url)
    window.Calendly?.initInlineWidgets()
  }, [ready, theme])

  return (
    <div className="relative rounded-2xl overflow-hidden calendly-widget-wrap">
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
        onLoad={() => setReady(true)}
      />

      {/* Loading skeleton */}
      {!ready && (
        <div
          className="absolute inset-0 rounded-2xl animate-pulse"
          style={{ background: 'var(--color-surface)' }}
        />
      )}

      {/* Inline widget */}
      <div
        ref={widgetRef}
        className="calendly-inline-widget"
        data-url={getCalendlyUrl(theme)}
        style={{ minWidth: 320, width: '100%' }}
      />
    </div>
  )
}
