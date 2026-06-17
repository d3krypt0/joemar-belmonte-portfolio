import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

// Reduced-motion preference, but always `false` on the server and on the first
// client render. This keeps SSR and hydration output identical (the real value
// is only read after mount), avoiding the hydration mismatch that would
// otherwise leave reveal-animated content stuck at opacity:0 for users who have
// "reduce motion" enabled.
export function useReducedMotionSafe(): boolean {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted ? !!reduce : false
}

export function useVisible(threshold = 0.1) {
  const ref           = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, vis }
}
