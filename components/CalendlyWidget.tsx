'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Calendly?: any
  }
}

const BASE_URL = 'https://calendly.com/joemarbelmonte-automation/30min'

function getCalendlyUrl(isDark: boolean) {
  if (isDark) {
    return `${BASE_URL}?hide_gdpr_banner=1&background_color=0D1A26&text_color=E8F4FF&primary_color=00C8FF`
  }
  return `${BASE_URL}?hide_gdpr_banner=1&background_color=FFFFFF&text_color=0D1B2A&primary_color=0090CC`
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const s = document.createElement('script')
    s.src   = src
    s.async = true
    s.onload  = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

function loadStylesheet(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return
  const l = document.createElement('link')
  l.rel  = 'stylesheet'
  l.href = href
  document.head.appendChild(l)
}

export default function CalendlyWidget() {
  const widgetRef          = useRef<HTMLDivElement>(null)
  const [ready, setReady]  = useState(false)
  const [isDark, setIsDark] = useState(false)

  /* ── Load Calendly assets once ────────────────────────── */
  useEffect(() => {
    loadStylesheet('https://assets.calendly.com/assets/external/widget.css')
    loadScript('https://assets.calendly.com/assets/external/widget.js')
      .then(() => setReady(true))
      .catch(() => {/* widget unavailable — skeleton stays */})
  }, [])

  /* ── Watch data-theme changes ─────────────────────────── */
  useEffect(() => {
    const read = () => {
      const el = document.querySelector('[data-theme]')
      return el?.getAttribute('data-theme') === 'dark'
    }
    setIsDark(read())
    const obs = new MutationObserver(() => setIsDark(read()))
    obs.observe(document.body, {
      attributes:      true,
      attributeFilter: ['data-theme'],
      subtree:         true,
    })
    return () => obs.disconnect()
  }, [])

  /* ── Re-init widget when theme changes ────────────────── */
  useEffect(() => {
    if (!ready || !widgetRef.current) return
    widgetRef.current.setAttribute('data-url', getCalendlyUrl(isDark))
    window.Calendly?.initInlineWidgets()
  }, [ready, isDark])

  return (
    <div className="relative rounded-2xl overflow-hidden calendly-widget-wrap">
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
        data-url={getCalendlyUrl(isDark)}
        style={{ minWidth: 320, width: '100%' }}
      />
    </div>
  )
}
