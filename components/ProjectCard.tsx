'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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

function WorkflowModal({ project, onClose }: { project: ProjectData; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl flex flex-col"
        style={{ background: 'var(--card-bg)', border: `1px solid ${project.accent}44` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full"
          style={{ background: '#ffffff18', color: '#aaa', fontSize: 18 }}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Workflow image — no overflow:hidden on a flex child (collapses height in some browsers) */}
        <div
          style={{
            background:   '#050508',
            borderBottom: `1px solid ${project.accent}22`,
            borderRadius: '16px 16px 0 0',
            position:     'relative',
            flexShrink:   0,
          }}
        >
          {project.workflowImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.workflowImage}
              alt={`${project.name} workflow`}
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px 16px 0 0' }}
            />
          ) : (
            <div className="relative flex items-center justify-center" style={{ height: 280 }}>
              {/* Grid pattern background */}
              <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`modal-grid-${project.name}`} width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke={project.accent} strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#modal-grid-${project.name})`} />
              </svg>
              <div className="relative z-10 flex flex-col items-center gap-3 text-center px-8">
                <div className="flex items-center gap-2 opacity-40">
                  {(project.pills ?? ['—']).slice(0, 3).map((p, i) => (
                    <div key={p} className="flex items-center gap-2">
                      <div className="px-3 py-1 rounded text-xs font-mono" style={{ border: `1px solid ${project.accent}66`, color: project.accent }}>{p}</div>
                      {i < (project.pills ?? []).slice(0, 3).length - 1 && (
                        <svg width="24" height="2" viewBox="0 0 24 2"><line x1="0" y1="1" x2="24" y2="1" stroke={project.accent} strokeWidth="1" strokeDasharray="4 2" /></svg>
                      )}
                    </div>
                  ))}
                </div>
                <p style={{ color: '#555', fontSize: 13, fontFamily: 'monospace' }}>Workflow screenshot coming soon</p>
              </div>
            </div>
          )}

          {/* Pill tags overlay */}
          {project.pills && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              {project.pills.map(pill => (
                <span
                  key={pill}
                  style={{
                    background:    `${project.accent}33`,
                    border:        `1px solid ${project.accent}66`,
                    color:         project.accent,
                    borderRadius:  999,
                    padding:       '2px 8px',
                    fontSize:      10,
                    fontFamily:    'monospace',
                    letterSpacing: '0.06em',
                    fontWeight:    600,
                    lineHeight:    '1.6',
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal body */}
        <div className="px-7 py-6 flex flex-col gap-5">
          <h2
            style={{
              fontFamily: 'var(--font-display, system-ui)',
              fontWeight: 700,
              fontSize:   22,
              color:      'var(--color-text)',
              lineHeight: 1.2,
            }}
          >
            {project.name}
          </h2>

          {/* How it works */}
          <div>
            <p
              style={{
                fontFamily:    'monospace',
                fontSize:      10,
                fontWeight:    600,
                letterSpacing: '0.12em',
                color:         project.accent,
                textTransform: 'uppercase',
                marginBottom:  8,
              }}
            >
              How it works
            </p>
            <p style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.7 }}>
              {project.solution ?? project.description}
            </p>
          </div>

          {/* Pipeline steps if available */}
          {project.pipeline && project.pipeline.length > 0 && (
            <div>
              <p
                style={{
                  fontFamily:    'monospace',
                  fontSize:      10,
                  fontWeight:    600,
                  letterSpacing: '0.12em',
                  color:         project.accent,
                  textTransform: 'uppercase',
                  marginBottom:  10,
                }}
              >
                Workflow steps
              </p>
              <div className="flex flex-col gap-3">
                {project.pipeline.map(step => (
                  <div key={step.num} className="flex gap-3">
                    <span
                      style={{
                        fontFamily:  'monospace',
                        fontSize:    11,
                        color:       project.accent,
                        opacity:     0.6,
                        flexShrink:  0,
                        paddingTop:  2,
                      }}
                    >
                      {step.num}
                    </span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', margin: 0, lineHeight: 1.4 }}>
                        {step.title}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--color-muted)', margin: 0, lineHeight: 1.6 }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Systems / integrations */}
          <div>
            <p
              style={{
                fontFamily:    'monospace',
                fontSize:      10,
                fontWeight:    600,
                letterSpacing: '0.12em',
                color:         project.accent,
                textTransform: 'uppercase',
                marginBottom:  10,
              }}
            >
              Systems &amp; integrations
            </p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map(s => (
                <span
                  key={s}
                  style={{
                    background:    `${project.accent}18`,
                    border:        `1px solid ${project.accent}44`,
                    color:         project.accent,
                    borderRadius:  6,
                    padding:       '4px 10px',
                    fontSize:      12,
                    fontFamily:    'monospace',
                    letterSpacing: '0.04em',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function ProjectCard({ project, delay = 0 }: Props) {
  const { ref, vis } = useVisible(0.08)
  const [hovered, setHovered]   = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const borderColor = hovered ? project.accent : '#1A1A2E'
  const shadowColor = hovered ? `${project.accent}33` : 'transparent'

  return (
    <>
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
          {/* ── Zone A: Workflow image placeholder ─────────── */}
          <div
            className="relative flex-shrink-0 flex items-center justify-center overflow-hidden"
            style={{ height: 200, background: '#0d0d1a', cursor: 'pointer' }}
            onClick={() => setModalOpen(true)}
            title="Click to view workflow"
          >
            {/* Subtle grid */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`grid-${project.name}`} width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke={project.accent} strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#grid-${project.name})`} />
            </svg>

            {project.workflowImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.workflowImage}
                alt={`${project.name} workflow`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
            ) : (
              <div className="relative z-10 flex flex-col items-center gap-2 opacity-30">
                <div className="flex items-center gap-2">
                  {(project.pills ?? ['—']).slice(0, 3).map((p, i) => (
                    <div key={p} className="flex items-center gap-2">
                      <div className="px-2 py-0.5 rounded text-xs font-mono" style={{ border: `1px solid ${project.accent}66`, color: project.accent }}>{p}</div>
                      {i < (project.pills ?? []).slice(0, 3).length - 1 && (
                        <svg width="16" height="2" viewBox="0 0 16 2"><line x1="0" y1="1" x2="16" y2="1" stroke={project.accent} strokeWidth="1" strokeDasharray="3 2" /></svg>
                      )}
                    </div>
                  ))}
                </div>
                <span style={{ color: '#666', fontSize: 11, fontFamily: 'monospace' }}>click to view workflow</span>
              </div>
            )}

            {/* Pill tags */}
            {project.pills && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                {project.pills.map(pill => (
                  <span
                    key={pill}
                    style={{
                      background:    `${project.accent}33`,
                      border:        `1px solid ${project.accent}66`,
                      color:         project.accent,
                      borderRadius:  999,
                      padding:       '2px 8px',
                      fontSize:      10,
                      fontFamily:    'monospace',
                      letterSpacing: '0.06em',
                      fontWeight:    600,
                      lineHeight:    '1.6',
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
                cursor:      'pointer',
              }}
              onClick={() => setModalOpen(true)}
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

      {modalOpen && <WorkflowModal project={project} onClose={() => setModalOpen(false)} />}
    </>
  )
}
