'use client'

import { useEffect } from 'react'

export default function CalendlyWidget() {
  useEffect(() => {
    if (document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) return
    const s = document.createElement('script')
    s.src   = 'https://assets.calendly.com/assets/external/widget.js'
    s.async = true
    document.head.appendChild(s)
  }, [])

  return (
    <div
      className="calendly-inline-widget calendly-widget-wrap"
      data-url="https://calendly.com/joemarbelmonte-automation/30min"
      style={{ minWidth: 320, height: 700 }}
    />
  )
}
