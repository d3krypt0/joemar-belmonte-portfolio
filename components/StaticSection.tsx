'use client'

import { useEffect, useRef, useState } from 'react'
import { ALL_PROJECTS, type ProjectData, type PipelineNode } from '@/lib/projects'
import ProjectCard from './ProjectCard'
import TechMarquee from './TechMarquee'

/* ─── Intersection-based reveal hook ──────────────────────── */
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

/* ─── Reveal wrapper ──────────────────────────────────────── */
function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, vis } = useVisible(0.08)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    vis ? 1 : 0,
        transform:  vis ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 500ms ease-out ${delay}ms, transform 500ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* ─── Section heading ─────────────────────────────────────── */
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="text-center mb-12 sm:mb-16">
      <span
        className="font-mono text-[11px] uppercase tracking-[0.22em]"
        style={{ color: 'var(--color-accent)' }}
      >
        {eyebrow}
      </span>
      <h2
        className="font-display font-bold text-3xl sm:text-4xl mt-2 leading-tight"
        style={{ color: 'var(--color-text)' }}
      >
        {title}
      </h2>
    </Reveal>
  )
}

/* ─── Pipeline flow (for expanded AI Media Monitoring card) ── */
function PipelineFlow({ nodes, accent }: { nodes: PipelineNode[]; accent: string }) {
  return (
    <>
      {/* Desktop: horizontal */}
      <div className="hidden lg:block mt-8">
        <div className="relative flex items-start">
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              top:       '3.375rem',
              left:      '8%',
              right:     '8%',
              height:    0,
              borderTop: `2px dashed ${accent}4D`,
            }}
          />
          {nodes.map(node => (
            <div
              key={node.num}
              className="flex-1 flex flex-col items-center text-center px-1 relative"
            >
              <div
                className="flex items-end justify-center w-full mb-2"
                style={{ height: '2.5rem' }}
              >
                <span
                  className="font-mono uppercase leading-tight text-center"
                  style={{ fontSize: '8px', color: accent, letterSpacing: '0.08em' }}
                >
                  {node.integration}
                </span>
              </div>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 relative"
                style={{ background: '#1E1B4B', border: `1px solid ${accent}`, zIndex: 1 }}
              >
                <span className="font-mono text-[10px] font-bold text-white">{node.num}</span>
              </div>
              <span
                className="font-display font-bold block mt-2"
                style={{ fontSize: '12px', color: 'var(--color-text)', lineHeight: '1.3' }}
              >
                {node.title}
              </span>
              <span
                className="block mt-1"
                style={{ fontSize: '10.5px', color: 'var(--color-muted)', lineHeight: '1.5' }}
              >
                {node.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical */}
      <div className="lg:hidden flex flex-col mt-6">
        {nodes.map((node, i) => (
          <div key={node.num} className="flex gap-3">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#1E1B4B', border: `1px solid ${accent}` }}
              >
                <span className="font-mono text-[10px] font-bold text-white">{node.num}</span>
              </div>
              {i < nodes.length - 1 && (
                <div
                  className="flex-1 my-1"
                  style={{ width: '2px', borderLeft: `2px dashed ${accent}4D`, minHeight: '28px' }}
                />
              )}
            </div>
            <div className="pb-5 min-w-0">
              <span
                className="font-mono uppercase block mb-0.5"
                style={{ fontSize: '9px', color: accent, letterSpacing: '0.1em' }}
              >
                {node.integration}
              </span>
              <span
                className="font-display font-bold block"
                style={{ fontSize: '13px', color: 'var(--color-text)' }}
              >
                {node.title}
              </span>
              <span
                className="block mt-0.5 leading-relaxed"
                style={{ fontSize: '11px', color: 'var(--color-muted)' }}
              >
                {node.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ─── Expanded card (pipeline-only projects) ──────────────── */
function ExpandedProjectCard({ project, delay = 0 }: { project: ProjectData; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <div
        className="rounded-xl p-5 lg:p-7"
        style={{
          background:  'var(--color-surface)',
          border:      '1px solid var(--color-border)',
          borderLeft:  `3px solid ${project.accent}`,
        }}
      >
        <div className="mb-3">
          <span
            className="font-mono text-[10px] uppercase tracking-widest block"
            style={{ color: 'var(--color-muted)' }}
          >
            {project.type}
          </span>
          <h3
            className="font-display font-bold text-lg mt-1"
            style={{ color: 'var(--color-text)' }}
          >
            {project.name}
          </h3>
        </div>
        <p
          className="text-[14px] leading-relaxed max-w-3xl"
          style={{ color: 'var(--color-muted)' }}
        >
          {project.description}
        </p>
        {project.pipeline && (
          <PipelineFlow nodes={project.pipeline} accent={project.accent} />
        )}
        <div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-6 pt-5"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono"
                style={{
                  background: 'var(--color-surface-2)',
                  color:      project.accent,
                  border:     `1px solid ${project.accent}30`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-6 flex-shrink-0">
            {project.metrics.map(m => (
              <div key={m.label} className="text-left sm:text-right">
                <div className="font-display font-bold text-xl" style={{ color: project.accent }}>
                  {m.value}
                </div>
                <div
                  className="text-[10px] font-mono uppercase tracking-wider mt-0.5"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  )
}

/* ─── Services section ────────────────────────────────────── */
const SERVICES = [
  {
    icon:         '🤖',
    title:        'Multi-Agent AI Systems',
    description:  'Autonomous AI pipelines that handle research, outreach, operations, and customer service — with approval gates so nothing runs without your sign-off.',
    deliverables: ['Claude API agent design', 'n8n orchestration', 'Telegram approval gates', 'Docker deployment', 'Airtable integration'],
  },
  {
    icon:         '⚙️',
    title:        'Business Process Automation',
    description:  'Replace manual workflows with reliable n8n automations connected to your existing tools — CRMs, email, Slack, Shopify, and more.',
    deliverables: ['n8n workflow builds', 'API integrations', 'Data pipelines', 'Internal dashboards', 'Full documentation'],
  },
  {
    icon:         '🛒',
    title:        'eCommerce & Shopify Automation',
    description:  'End-to-end eCommerce infrastructure — store setup, product research systems, supplier pipelines, and Meta Ads integration.',
    deliverables: ['Shopify store build', 'Product research platform', 'Supplier automation', 'Meta Ads API setup', 'Brand launch'],
  },
]

function ServicesSection() {
  return (
    <section id="services" className="py-20 sm:py-28 px-5">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Services" title="What I Build" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 80} className="h-full">
              <div
                className="h-full rounded-xl p-6 flex flex-col"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
                  {s.title}
                </h3>
                <p className="text-[14px] leading-relaxed mb-5" style={{ color: 'var(--color-muted)' }}>
                  {s.description}
                </p>
                <ul className="mt-auto space-y-1.5">
                  {s.deliverables.map(d => (
                    <li key={d} className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--color-muted)' }}>
                      <span style={{ color: 'var(--color-accent)' }}>→</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Work section ────────────────────────────────────────── */
function WorkSection() {
  // Projects with new 3-zone card format
  const cardProjects = ALL_PROJECTS.filter(p => p.pattern && p.problem)
  // Projects with only pipeline view (no 3-zone card data)
  const expandedOnly = ALL_PROJECTS.filter(p => p.pipeline && !p.pattern)

  return (
    <section
      id="work"
      className="py-20 sm:py-28 px-5"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Work" title="Live Systems" />

        {/* 3-column project card grid */}
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))' }}
        >
          {cardProjects.map((p, i) => (
            <ProjectCard key={p.name} project={p} delay={i * 80} />
          ))}
        </div>

        {/* Expanded pipeline-only cards below */}
        {expandedOnly.length > 0 && (
          <div className="mt-5 flex flex-col gap-5">
            {expandedOnly.map((p, i) => (
              <ExpandedProjectCard key={p.name} project={p} delay={i * 80} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── Contact section ─────────────────────────────────────── */
const EMAIL = 'joemarbelmonte.automation@gmail.com'

function CopyEmailButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select a hidden input
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg font-semibold text-[14px] transition-all"
      style={{
        background:   'var(--color-surface)',
        color:        copied ? '#10b981' : 'var(--color-text)',
        border:       `1px solid ${copied ? '#10b981' : 'var(--color-border)'}`,
        cursor:       'pointer',
      }}
    >
      <span style={{ fontSize: 15 }}>{copied ? '✓' : '📋'}</span>
      {copied ? 'Copied!' : EMAIL}
    </button>
  )
}

function ContactSection() {
  return (
    <section
      id="contact"
      className="py-20 sm:py-28 px-5"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Contact" title="Let's Work Together" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — copy + email fallback */}
          <Reveal>
            <h3
              className="font-display font-bold text-2xl sm:text-3xl leading-snug mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              Ready to automate your business?
            </h3>
            <p className="text-[15px] leading-relaxed mb-6" style={{ color: 'var(--color-muted)' }}>
              I take on 2–3 projects per month. Clear scope, production-ready delivery, clean handoff.
              Pick a time on the calendar — the first call is free, no commitment required.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[14px]" style={{ color: 'var(--color-muted)' }}>
                <span style={{ color: 'var(--color-accent)' }}>→</span>
                30-minute discovery call
              </div>
              <div className="flex items-center gap-2 text-[14px]" style={{ color: 'var(--color-muted)' }}>
                <span style={{ color: 'var(--color-accent)' }}>→</span>
                PHT (UTC+8), flexible for any timezone
              </div>
              <div className="flex items-center gap-2 text-[14px]" style={{ color: 'var(--color-muted)' }}>
                <span style={{ color: 'var(--color-accent)' }}>→</span>
                Response within 24 hours
              </div>
            </div>
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
              <p className="text-[13px] mb-3" style={{ color: 'var(--color-muted)' }}>
                Prefer email?
              </p>
              <CopyEmailButton />
            </div>
          </Reveal>

          {/* Right — Calendly inline embed */}
          <Reveal delay={120}>
            <div
              className="rounded-2xl"
              style={{
                border:   '1px solid var(--color-border)',
                overflow: 'hidden',
                height:   740,
              }}
            >
              <iframe
                src="https://calendly.com/joemarbelmonte-automation/30min?hide_gdpr_banner=1"
                width="100%"
                height="740"
                frameBorder="0"
                scrolling="no"
                title="Book a free 30-minute call with Joemar"
                style={{ display: 'block', minWidth: 280 }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─── Divider between chat and portfolio ──────────────────── */
function SectionDivider() {
  return (
    <div
      className="flex flex-col items-center py-8 gap-2"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <span
        className="font-mono text-[10px] uppercase tracking-[0.22em]"
        style={{ color: 'var(--color-muted)', opacity: 0.5 }}
      >
        Portfolio
      </span>
      <div className="w-px h-8" style={{ background: 'var(--color-border)' }} />
    </div>
  )
}

/* ─── Export ──────────────────────────────────────────────── */
export default function StaticSection() {
  return (
    <div style={{ background: 'var(--color-bg)' }}>
      <SectionDivider />
      <ServicesSection />
      <TechMarquee />
      <WorkSection />
      <ContactSection />
      <footer
        className="py-8 px-5 text-center"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <p className="font-mono text-[11px]" style={{ color: 'var(--color-muted)', opacity: 0.4 }}>
          Joemar Belmonte · AI Automation Specialist · Philippines
        </p>
      </footer>
    </div>
  )
}
