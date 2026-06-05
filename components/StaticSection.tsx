'use client'

import { useEffect, useRef, useState } from 'react'
import { ALL_PROJECTS, type ProjectData } from '@/lib/projects'

/* ─── Intersection-based reveal hook ──────────────────────── */
function useVisible(threshold = 0.1) {
  const ref     = useRef<HTMLDivElement>(null)
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

/* ─── Reveal wrapper (opacity + translateY) ───────────────── */
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

/* ─── Animated progress bar ───────────────────────────────── */
function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const { ref, vis } = useVisible(0.1)
  return (
    <div
      ref={ref}
      className="h-1.5 rounded-full overflow-hidden mt-2"
      style={{ background: 'var(--color-surface-2)' }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width:      vis ? `${pct}%` : '0%',
          background: color,
          transition: 'width 800ms cubic-bezier(0.4, 0, 0.2, 1) 250ms',
        }}
      />
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

/* ─── Project card (static, CSS-only animation) ──────────── */
function StaticProjectCard({ project, delay = 0 }: { project: ProjectData; delay?: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <div
        className="h-full rounded-xl p-5 flex flex-col"
        style={{
          background:      'var(--color-surface)',
          border:          '1px solid var(--color-border)',
          borderLeft:      `3px solid ${project.accent}`,
        }}
      >
        {/* Type + name */}
        <div className="mb-3">
          <span
            className="font-mono text-[10px] uppercase tracking-widest block"
            style={{ color: 'var(--color-muted)' }}
          >
            {project.type}
          </span>
          <h3
            className="font-display font-bold text-base mt-1"
            style={{ color: 'var(--color-text)' }}
          >
            {project.name}
          </h3>
        </div>

        {/* Description */}
        <p
          className="text-[13px] leading-relaxed mb-4 flex-1"
          style={{ color: 'var(--color-muted)' }}
        >
          {project.description}
        </p>

        {/* Stack tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
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

        {/* Metrics */}
        <div
          className="flex gap-6 pt-3"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          {project.metrics.map(m => (
            <div key={m.label}>
              <div
                className="font-display font-bold text-xl"
                style={{ color: project.accent }}
              >
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
    </Reveal>
  )
}

/* ─── Services ────────────────────────────────────────────── */
const SERVICES = [
  {
    icon:        '🤖',
    title:       'Multi-Agent AI Systems',
    description: 'Autonomous AI pipelines that handle research, outreach, operations, and customer service — with approval gates so nothing runs without your sign-off.',
    deliverables: [
      'Claude API agent design',
      'n8n orchestration',
      'Telegram approval gates',
      'Docker deployment',
      'Airtable integration',
    ],
  },
  {
    icon:        '⚙️',
    title:       'Business Process Automation',
    description: 'Replace manual workflows with reliable n8n automations connected to your existing tools — CRMs, email, Slack, Shopify, and more.',
    deliverables: [
      'n8n workflow builds',
      'API integrations',
      'Data pipelines',
      'Internal dashboards',
      'Full documentation',
    ],
  },
  {
    icon:        '🛒',
    title:       'eCommerce & Shopify Automation',
    description: 'End-to-end eCommerce infrastructure — store setup, product research systems, supplier pipelines, and Meta Ads integration.',
    deliverables: [
      'Shopify store build',
      'Product research platform',
      'Supplier automation',
      'Meta Ads API setup',
      'Brand launch',
    ],
  },
]

function ServicesSection() {
  return (
    <section className="py-20 sm:py-28 px-5">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Services" title="What I Build" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 80} className="h-full">
              <div
                className="h-full rounded-xl p-6 flex flex-col"
                style={{
                  background: 'var(--color-surface)',
                  border:     '1px solid var(--color-border)',
                }}
              >
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3
                  className="font-display font-bold text-lg mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed mb-5"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {s.description}
                </p>
                <ul className="mt-auto space-y-1.5">
                  {s.deliverables.map(d => (
                    <li
                      key={d}
                      className="flex items-center gap-2 text-[13px]"
                      style={{ color: 'var(--color-muted)' }}
                    >
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

/* ─── Projects ────────────────────────────────────────────── */
function ProjectsSection() {
  return (
    <section
      className="py-20 sm:py-28 px-5"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Work" title="Selected Projects" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ALL_PROJECTS.map((p, i) => (
            <StaticProjectCard key={p.name} project={p} delay={i * 70} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Skills ──────────────────────────────────────────────── */
const SKILLS = [
  {
    tier:  'Core',
    color: '#00C8FF',
    items: [
      { name: 'AI / LLM Engineering',   pct: 95, desc: 'Claude API · Prompt Engineering · Multi-agent Systems · Vision Analysis' },
      { name: 'n8n Automation',          pct: 92, desc: 'Self-hosted Docker · Workflow Design · Approval Gates · API Chaining' },
      { name: 'Full-Stack Dev',          pct: 82, desc: 'Node.js · Express · React · Next.js · TypeScript · Railway' },
      { name: 'Data Tooling & APIs',     pct: 88, desc: 'Meta Ads API · Google Trends · CJDropshipping · Airtable' },
      { name: 'Docker & DevOps',         pct: 80, desc: 'Docker Compose · nginx · Railway · Env Management' },
      { name: 'Excel / openpyxl',        pct: 88, desc: 'Formula Architecture · P&L Modeling · Commercial Product Builds' },
    ],
  },
  {
    tier:  'Operator',
    color: '#64748b',
    items: [
      { name: 'Shopify & eCommerce',  pct: 82, desc: 'Store Setup · Landing Pages · Supplier Integration · Brand Launch' },
      { name: 'Meta Ads Strategy',    pct: 75, desc: 'Campaign Structure · Audience Segmentation · CPA Modeling' },
    ],
  },
  {
    tier:  'Context',
    color: '#10b981',
    items: [
      { name: 'Web Application Security', pct: 98, desc: 'Vulnerability Management · Penetration Testing · Threat Modeling · 10 yrs' },
    ],
  },
]

function SkillsSection() {
  return (
    <section
      className="py-20 sm:py-28 px-5"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Skills" title="Technical Expertise" />
        <div className="space-y-12">
          {SKILLS.map(tier => (
            <div key={tier.tier}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{
                      color:      tier.color,
                      background: `${tier.color}18`,
                      border:     `1px solid ${tier.color}30`,
                    }}
                  >
                    {tier.tier}
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                </div>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {tier.items.map((skill, i) => (
                  <Reveal key={skill.name} delay={i * 60}>
                    <div
                      className="rounded-xl p-5"
                      style={{
                        background: 'var(--color-surface)',
                        border:     '1px solid var(--color-border)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="font-display font-semibold text-sm"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {skill.name}
                        </span>
                        <span
                          className="font-mono text-[11px]"
                          style={{ color: tier.color }}
                        >
                          {skill.pct}%
                        </span>
                      </div>
                      <p
                        className="text-[11px] leading-relaxed mb-2"
                        style={{ color: 'var(--color-muted)' }}
                      >
                        {skill.desc}
                      </p>
                      <ProgressBar pct={skill.pct} color={tier.color} />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Contact ─────────────────────────────────────────────── */
const INFO_ROWS = [
  { label: 'Location',     value: 'Philippines' },
  { label: 'Timezone',     value: 'PHT (UTC+8)' },
  { label: 'Availability', value: 'Part-time · 4 hrs/day' },
  { label: 'Response',     value: 'Within 24 hours' },
  { label: 'Project Min.', value: 'USD 300' },
]

function ContactSection() {
  return (
    <section
      id="contact"
      className="py-20 sm:py-28 px-5"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Contact" title="Let's Work Together" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left */}
          <Reveal>
            <h3
              className="font-display font-bold text-2xl sm:text-3xl leading-snug mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              Ready to automate your business?
            </h3>
            <p
              className="text-[15px] leading-relaxed mb-8"
              style={{ color: 'var(--color-muted)' }}
            >
              I take on 2–3 projects per month. Clear scope, production-ready delivery, clean handoff.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://calendly.com/joemarbelmonte-automation/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-[15px] transition-opacity hover:opacity-85"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                Book a Free Call →
              </a>
              <a
                href="mailto:joemarbelmonte.automation@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-[15px] transition-all hover:opacity-85"
                style={{
                  background: 'var(--color-surface)',
                  color:      'var(--color-text)',
                  border:     '1px solid var(--color-border)',
                }}
              >
                Send an Email
              </a>
            </div>
          </Reveal>

          {/* Right — info table */}
          <Reveal delay={120}>
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--color-border)' }}
            >
              {INFO_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-5 py-3.5 text-[14px]"
                  style={{
                    background:  i % 2 === 0 ? 'var(--color-surface)' : 'transparent',
                    borderBottom: i < INFO_ROWS.length - 1 ? '1px solid var(--color-border)' : undefined,
                  }}
                >
                  <span className="font-mono" style={{ color: 'var(--color-muted)' }}>{row.label}</span>
                  <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{row.value}</span>
                </div>
              ))}
              {/* Status row */}
              <div
                className="flex items-center justify-between px-5 py-3.5 text-[14px]"
                style={{ background: 'var(--color-surface)' }}
              >
                <span className="font-mono" style={{ color: 'var(--color-muted)' }}>Status</span>
                <span className="flex items-center gap-2 font-semibold" style={{ color: '#10b981' }}>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: '#10b981', boxShadow: '0 0 6px #10b98166' }}
                  />
                  Open for Work
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─── Divider with scroll cue ─────────────────────────────── */
function SectionDivider() {
  return (
    <div
      className="flex flex-col items-center py-8 gap-2"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: 'var(--color-muted)', opacity: 0.5 }}>
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
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />

      {/* Footer */}
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
