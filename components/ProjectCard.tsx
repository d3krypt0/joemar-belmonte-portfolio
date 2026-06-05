'use client'

import { useEffect, useRef, useState } from 'react'
import WorkflowPreview from './WorkflowPreview'
import { type ProjectData } from '@/lib/projects'

interface Props {
  project: ProjectData
  delay?:  number
}

function useVisible(threshold = 0.1) {
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

const ZONE_LABELS = {
  problem:  { dot: '#EF4444', text: '#EF4444', word: 'PROBLEM'  },
  solution: { dot: '#00E5A0', text: '#00E5A0', word: 'SOLUTION' },
  result:   { dot: '#00C8FF', text: '#00C8FF', word: 'RESULT'   },
} as const

export default function ProjectCard({ project, delay = 0 }: Props) {
  const { ref, vis } = useVisible(0.08)
  const [hovered, setHovered] = useState(false)

  const borderColor = hovered ? project.accent : '#1A1A2E'
  const shadowColor = hovered ? `${project.accent}33` : 'transparent'

  return (
    <div
      ref={ref}
      style={{
        opacity:    vis ? 1 : 0,
        transform:  vis ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 500ms ease-out ${delay}ms, transform 500ms ease-out ${delay}ms`,
      }}
    >
      <div
        className="flex flex-col overflow-hidden h-full"
        style={{
          background:   'var(--card-bg)',
          border:       `1px solid ${borderColor}`,
          borderRadius: 12,
          boxShadow:    `0 0 0 1px ${shadowColor}`,
          transition:   'border-color 200ms ease, box-shadow 200ms ease',
          cursor:       'default',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Zone A: Workflow preview ─────────────────────── */}
        <div className="relative flex-shrink-0" style={{ height: 200 }}>
          {project.pattern && (
            <WorkflowPreview pattern={project.pattern} accent={project.accent} />
          )}

          {/* Pill tags */}
          {project.pills && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              {project.pills.map(pill => (
                <span
                  key={pill}
                  style={{
                    background:   `${project.accent}33`,
                    border:       `1px solid ${project.accent}66`,
                    color:        project.accent,
                    borderRadius: 999,
                    padding:      '2px 8px',
                    fontSize:     10,
                    fontFamily:   'monospace',
                    letterSpacing: '0.06em',
                    fontWeight:   600,
                    lineHeight:   '1.6',
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Zone B: Identity ─────────────────────────────── */}
        <div className="px-5 pt-4 pb-2">
          <h3
            style={{
              fontFamily:  'var(--font-display, system-ui)',
              fontWeight:  700,
              fontSize:    19,
              color:       'var(--color-text)',
              lineHeight:  1.25,
              margin:      0,
            }}
          >
            {project.name}
          </h3>
        </div>

        {/* ── Zone C: Problem / Solution / Result ──────────── */}
        <div className="px-5 pb-5 flex flex-col gap-3 flex-1">
          {(['problem', 'solution', 'result'] as const).map(key => {
            const text = project[key]
            if (!text) return null
            const meta = ZONE_LABELS[key]
            return (
              <div key={key}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    style={{
                      width: 5, height: 5,
                      borderRadius: '50%',
                      background: meta.dot,
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily:    'monospace',
                      fontSize:      9,
                      fontWeight:    600,
                      letterSpacing: '0.12em',
                      color:         meta.text,
                      textTransform: 'uppercase',
                    }}
                  >
                    {meta.word}
                  </span>
                </div>
                <p
                  style={{
                    fontSize:   13,
                    color:      'var(--color-muted)',
                    lineHeight: 1.6,
                    margin:     0,
                  }}
                >
                  {text}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
