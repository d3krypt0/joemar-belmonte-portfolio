'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'

export type AvatarState = 'idle' | 'thinking' | 'replying'

interface AvatarProps {
  state?: AvatarState
  size?: number
}

const MOUTH = {
  idle:      'M 80 124 Q 100 135 120 124',
  thinking:  'M 82 126 Q 100 131 118 126',
  replying:  'M 76 122 Q 100 139 124 122',
}

export default function Avatar({ state = 'idle', size = 160 }: AvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false)

  // Randomized blink every 2.5–6 seconds
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const scheduleBlink = () => {
      timeout = setTimeout(
        () => {
          setIsBlinking(true)
          setTimeout(() => {
            setIsBlinking(false)
            scheduleBlink()
          }, 130)
        },
        2500 + Math.random() * 3500,
      )
    }
    scheduleBlink()
    return () => clearTimeout(timeout)
  }, [])

  // Pupils shift up-left when thinking
  const pupilOffset =
    state === 'thinking' ? { x: -2.5, y: -3.5 } : { x: 0, y: 0 }

  // Eyebrows rise slightly when thinking
  const browRaise = state === 'thinking' ? -3 : 0

  const mouthPath = MOUTH[state]

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(0,212,255,0.09) 0%, transparent 68%)',
          transform: 'scale(1.6)',
        }}
      />

      {/* Breathing wrapper */}
      <motion.div
        style={{ width: size, height: size }}
        animate={{ scale: [1, 1.016, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          viewBox="0 0 200 200"
          width={size}
          height={size}
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          <defs>
            <radialGradient id="faceGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#1c1c1c" />
              <stop offset="100%" stopColor="#070707" />
            </radialGradient>
            <radialGradient id="irisGrad" cx="32%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#80f0ff" />
              <stop offset="50%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#0088bb" />
            </radialGradient>
            <radialGradient id="irisGrad2" cx="32%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#80f0ff" />
              <stop offset="50%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#0088bb" />
            </radialGradient>
            <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ── Outer ambient ring ──────────────────── */}
          <motion.circle
            cx="100"
            cy="100"
            r="94"
            stroke="#00d4ff"
            strokeWidth="0.8"
            fill="none"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* ── Spinning arc shown only when thinking ─ */}
          <AnimatePresence>
            {state === 'thinking' && (
              <motion.circle
                key="thinking-arc"
                cx="100"
                cy="100"
                r="94"
                stroke="#00d4ff"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="38 252"
                strokeLinecap="round"
                style={{ transformOrigin: '100px 100px' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.3, repeat: Infinity, ease: 'linear' }}
                initial={{ opacity: 0, scale: 0.92 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>

          {/* ── Face circle ────────────────────────── */}
          <circle cx="100" cy="100" r="83" fill="url(#faceGrad)" />
          <circle cx="100" cy="100" r="83" fill="none" stroke="#282828" strokeWidth="1" />

          {/* ── Left eye ───────────────────────────── */}
          <g transform="translate(70, 90)">
            {/* Socket */}
            <circle r="12" fill="#080808" />
            {/* Iris + highlight — shifts when thinking */}
            <motion.g
              animate={pupilOffset}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            >
              <circle r="7" fill="url(#irisGrad)" filter="url(#eyeGlow)" />
              {/* Main highlight */}
              <circle cx="2.8" cy="-2.8" r="2.8" fill="rgba(255,255,255,0.62)" />
              {/* Small secondary highlight */}
              <circle cx="2.8" cy="-2.8" r="1.1" fill="rgba(255,255,255,0.88)" />
            </motion.g>
            {/* Eyelid — animates height for blinking */}
            <motion.rect
              x="-13"
              y="-13"
              width="26"
              fill="#0f0f0f"
              rx="13"
              animate={{ height: isBlinking ? 26 : 0 }}
              transition={{ duration: 0.07, ease: 'linear' }}
            />
          </g>

          {/* ── Right eye ──────────────────────────── */}
          <g transform="translate(130, 90)">
            <circle r="12" fill="#080808" />
            <motion.g
              animate={pupilOffset}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            >
              <circle r="7" fill="url(#irisGrad2)" filter="url(#eyeGlow)" />
              <circle cx="2.8" cy="-2.8" r="2.8" fill="rgba(255,255,255,0.62)" />
              <circle cx="2.8" cy="-2.8" r="1.1" fill="rgba(255,255,255,0.88)" />
            </motion.g>
            <motion.rect
              x="-13"
              y="-13"
              width="26"
              fill="#0f0f0f"
              rx="13"
              animate={{ height: isBlinking ? 26 : 0 }}
              transition={{ duration: 0.07, ease: 'linear' }}
            />
          </g>

          {/* ── Eyebrows ───────────────────────────── */}
          <motion.path
            d="M 57 78 Q 69 74 83 76"
            stroke="#4a4a4a"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={{ y: browRaise }}
            transition={{ duration: 0.35 }}
          />
          <motion.path
            d="M 117 76 Q 131 74 143 78"
            stroke="#4a4a4a"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={{ y: browRaise }}
            transition={{ duration: 0.35 }}
          />

          {/* ── Nose ───────────────────────────────── */}
          <circle cx="100" cy="113" r="2.2" fill="#2e2e2e" />

          {/* ── Mouth ──────────────────────────────── */}
          <motion.path
            d={mouthPath}
            stroke="#888"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={{ d: mouthPath }}
            transition={{ duration: 0.38, ease: 'easeInOut' }}
          />

          {/* ── Thinking dots ──────────────────────── */}
          <AnimatePresence>
            {state === 'thinking' && [0, 1, 2].map(i => (
              <motion.circle
                key={`dot-${i}`}
                cx={88 + i * 12}
                cy={147}
                r={3.2}
                fill="#00d4ff"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -5, 0] }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.7,
                  repeat: Infinity,
                  delay: i * 0.16,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </AnimatePresence>
        </svg>
      </motion.div>
    </div>
  )
}
