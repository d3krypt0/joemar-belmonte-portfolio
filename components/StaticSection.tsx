'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { GearSix, Robot, Wrench, Lock, Rocket, MagnifyingGlass, ShieldCheck, ChartLineUp, Briefcase, EnvelopeSimple, CalendarBlank, MapPin, ArrowUp, type Icon } from '@phosphor-icons/react'
import { ALL_PROJECTS, type ProjectData, type PipelineNode, type ProjectCategory } from '@/lib/projects'
import { useVisible, useReducedMotionSafe } from '@/lib/hooks'
import ProjectCard from './ProjectCard'
import TechMarquee from './TechMarquee'

const CalendlyWidget = dynamic(() => import('./CalendlyWidget'), { ssr: false })

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
  const reduce = useReducedMotionSafe()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    reduce ? 1 : vis ? 1 : 0,
        transform:  reduce ? 'none' : vis ? 'translateY(0)' : 'translateY(16px)',
        transition: reduce ? 'none' : `opacity 500ms ease-out ${delay}ms, transform 500ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* ─── Section heading ─────────────────────────────────────── */
function SectionHeading({ eyebrow, title, highlight }: { eyebrow?: string; title: string; highlight?: string }) {
  const parts = highlight && title.includes(highlight) ? title.split(highlight) : null
  return (
    <Reveal className="text-center mb-12 sm:mb-16">
      {eyebrow && (
        <span
          className="font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{ color: 'var(--color-accent)' }}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className="font-display font-bold text-3xl sm:text-4xl mt-2 leading-tight"
        style={{ color: 'var(--color-text)' }}
      >
        {parts
          ? <>{parts[0]}<span style={{ color: 'var(--color-accent)' }}>{highlight}</span>{parts[1]}</>
          : title}
      </h2>
    </Reveal>
  )
}

/* ─── Stats strip (under hero) ────────────────────────────── */
const STATS: { value: string; label: string }[] = [
  { value: '10+',  label: 'Years in Enterprise Tech & Security' },
  { value: '8',    label: 'Production Automation Systems Built' },
  { value: '12+', label: 'Tools & Platforms Integrated' },
]

function StatsStrip() {
  return (
    <section className="py-16 sm:py-20 px-5" style={{ borderTop: '1px solid var(--color-border)' }}>
      <Reveal className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 text-center">
        {STATS.map(stat => (
          <div key={stat.label} className="flex flex-col items-center">
            <span
              className="font-display font-extrabold text-4xl sm:text-5xl leading-none"
              style={{ color: 'var(--color-accent)' }}
            >
              {stat.value}
            </span>
            <span
              className="mt-3 text-sm max-w-[14rem]"
              style={{ color: 'var(--color-muted)' }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </Reveal>
    </section>
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
        className="rounded-xl p-5 lg:p-7 hover-lift"
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
const SERVICES: { icon: Icon; title: string; description: string; deliverables: string[] }[] = [
  {
    icon:         GearSix,
    title:        'Business Process Automation',
    description:  'Custom workflows that connect your tools, trigger on real events, and eliminate repetitive work automatically - lead scoring, CRM routing, media monitoring, and more.',
    deliverables: ['n8n workflow builds', 'Make.com scenarios', 'AI-powered lead scoring & triage', 'Automated email & Telegram reports', 'CRM routing & Airtable logging'],
  },
  {
    icon:         Robot,
    title:        'Multi-Agent AI Systems',
    description:  'Autonomous AI pipelines where multiple specialized agents work in sequence - researching, deciding, and acting. Agents propose actions; you approve via Telegram before execution.',
    deliverables: ['Multi-agent Claude API architecture', 'n8n orchestration layer', 'Telegram approval gates', 'Airtable & Shopify integration', 'Docker self-hosted deployment'],
  },
  {
    icon:         Wrench,
    title:        'Custom Tools & Dashboards',
    description:  'Custom-built tools your team actually uses - live API dashboards, AI-powered SaaS products, and Excel systems built to sell commercially.',
    deliverables: ['React / Next.js platforms', 'Live API integrations (Meta Ads, Trends)', 'Railway / Docker deployment', 'Commercial Excel tools', 'Python automation (openpyxl)'],
  },
]

function ServicesSection() {
  return (
    <section id="services" className="py-20 sm:py-28 px-5" style={{ borderTop: '1px solid var(--color-border)' }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Services" title="What I Build" highlight="I Build" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 80} className="h-full">
              <div
                className="h-full rounded-xl p-6 flex flex-col hover-lift"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="mb-4" style={{ color: 'var(--color-accent)' }}>
                  <s.icon size={30} weight="duotone" />
                </div>
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

/* ─── How It Works (process timeline) ────────────────────── */
const HOW_STEPS: { icon: Icon; title: string; desc: string }[] = [
  {
    icon:  MagnifyingGlass,
    title: 'Discovery Call',
    desc:  'We map your workflow bottlenecks on a free 30-minute call and pinpoint the automations with the highest return. No prep needed, just show me how the work flows today.',
  },
  {
    icon:  ShieldCheck,
    title: 'Architecture & Security Review',
    desc:  'I design your custom automation blueprint with every data flow, integration, and approval gate mapped out. Consequential actions get a human checkpoint. No black boxes, no silent failures.',
  },
  {
    icon:  Wrench,
    title: 'Build & Test',
    desc:  'I build against real APIs and test on real data before anything touches production. You watch it run end to end and sign off before we go live.',
  },
  {
    icon:  Rocket,
    title: 'Launch & Handover',
    desc:  'We deploy live and I walk your team through running it. You get documentation and a recorded walkthrough, not a system only I can operate.',
  },
  {
    icon:  ChartLineUp,
    title: 'Monitor & Evolve',
    desc:  'I watch for silent failures, patch API changes, and add new automations as you grow. Your system gets more capable over time, not more fragile.',
  },
]

function HowItWorks() {
  return (
    <section
      id="process"
      className="py-20 sm:py-28 px-5"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <div className="max-w-3xl mx-auto">
        <SectionHeading eyebrow="Process" title="How We'll Work Together" highlight="Work Together" />

        <div className="relative">
          {/* Vertical connector line behind the nodes */}
          <div
            aria-hidden
            className="absolute top-5 bottom-5"
            style={{ left: 19, width: 2, background: 'var(--color-border)' }}
          />

          <div className="flex flex-col gap-9 sm:gap-11">
            {HOW_STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <div className="flex gap-5">
                  {/* Numbered node */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center relative z-10"
                      style={{
                        background: 'var(--color-surface)',
                        border:     '1px solid var(--color-accent)',
                      }}
                    >
                      <span
                        className="font-mono text-[13px] font-bold tabular-nums"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        {i + 1}
                      </span>
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span style={{ color: 'var(--color-accent)' }}>
                        <s.icon size={18} weight="duotone" />
                      </span>
                      <h3
                        className="font-display font-bold text-[16px] sm:text-[17px] leading-snug"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {s.title}
                      </h3>
                    </div>
                    <p
                      className="text-[14px] leading-relaxed"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Reveal delay={HOW_STEPS.length * 80} className="text-center mt-12">
          <a
            href="https://calendly.com/joemarbelmonte-automation/discovery-call"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-press inline-flex items-center gap-2 rounded-lg font-semibold text-[14px] px-6 py-3 hover:opacity-85"
            style={{ background: 'var(--color-accent)', color: '#050505' }}
          >
            Start with a Free Discovery Call
            <span aria-hidden>→</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── Why Work With Me section ───────────────────────────── */
const WHY_BULLETS: { icon: Icon; title: string; desc: string }[] = [
  {
    icon:  Lock,
    title: '10+ Years Cybersecurity Background',
    desc:  'Every system I build is security-reviewed from the start - auditable data flows, least-privilege API access, and no silent failure points. You get automation that your security team can actually sign off on.',
  },
  {
    icon:  Robot,
    title: 'Multi-Agent Architecture Expertise',
    desc:  'I design and deploy systems where multiple AI agents coordinate - each specialized, each accountable. Not chatbots. Actual agent pipelines with human approval gates on every consequential action.',
  },
  {
    icon:  Rocket,
    title: 'Production Deployments, Not Demos',
    desc:  'The workflows I showcase are live and running - connected to real APIs, processing real data, triggered by real events. I don\'t build prototypes for portfolios. I build systems that run at 2am without me.',
  },
]

function WhySection() {
  return (
    <section
      id="why"
      className="py-20 sm:py-28 px-5"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Differentiators" title="Why Work With Me" highlight="Work With Me" />

        <Reveal className="max-w-3xl mx-auto text-center -mt-6 mb-14">
          <p className="text-[16px] sm:text-[17px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            I turn messy, manual processes into organized, auditable systems that are easy to manage and scale. By combining workflow automation, AI solutions, and custom tooling with a security-first mindset, I help businesses cut busywork, gain visibility, and run more efficiently without trading away control or reliability.
          </p>
        </Reveal>

        <Reveal className="max-w-3xl mx-auto mb-16">
          <div
            className="rounded-xl p-6 sm:p-8"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            <h3 className="font-display font-bold text-xl sm:text-2xl mb-5" style={{ color: 'var(--color-text)' }}>
              About Me
            </h3>
            <div className="flex flex-col gap-4 text-[14px] sm:text-[15px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              <p>
                My background is in enterprise cybersecurity. For over 10 years I worked as a security analyst and engineer across banking, healthcare, and energy, handling penetration testing, application security, and vulnerability management in high-stakes, compliance-sensitive environments.
              </p>
              <p>
                That work trained me to think in systems: map how data flows, find where things break, and design for reliability under pressure. I learned never to trust a process I cannot audit, and to assume anything left unmonitored will eventually fail at the worst possible time.
              </p>
              <p>
                Along the way I kept noticing how much time teams lost to repetitive, manual work, so I started building automations to remove it. n8n and Make.com workflows, custom scripts, and AI agents that connect the tools a business already uses. Seeing the hours those systems gave back is what turned automation from a side interest into my focus.
              </p>
              <p>
                Today I design AI-powered workflow and automation systems that connect apps, streamline operations, and help businesses run more efficiently, built with the same security-first discipline I carried from a decade in enterprise security.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WHY_BULLETS.map((b, i) => (
            <Reveal key={b.title} delay={i * 80} className="h-full">
              <div
                className="h-full rounded-xl p-6 flex flex-col gap-4 hover-lift"
                style={{
                  background:  'var(--color-surface)',
                  border:      '1px solid var(--color-border)',
                  borderLeft:  '3px solid var(--color-accent)',
                }}
              >
                <span style={{ color: 'var(--color-accent)' }}>
                  <b.icon size={30} weight="duotone" />
                </span>
                <h3
                  className="font-display font-bold text-[17px] leading-snug"
                  style={{ color: 'var(--color-text)' }}
                >
                  {b.title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {b.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Experience (professional timeline) ──────────────────── */
const EXPERIENCE: { role: string; org: string; period: string; bullets: string[] }[] = [
  {
    role:   'AI Automation Specialist',
    org:    'Independent / Freelance',
    period: 'January 2026 - Present',
    bullets: [
      'Design and ship production AI automation systems on n8n and Make.com, integrating Claude and OpenAI with CRMs, Slack, Telegram, Airtable, and Shopify.',
      'Built multi-agent pipelines where specialized agents research, decide, and act, with human approval gates on every consequential step.',
      'Architect every build security-first, applying a 10+ year cybersecurity background to auditable data flows and least-privilege API access.',
      'Develop custom full-stack tools and dashboards (React / Next.js, Python, Docker) that turn automations into products clients can operate themselves.',
    ],
  },
  {
    role:   'Senior Security Analyst',
    org:    'Accenture, Inc.',
    period: 'May 2019 - Present',
    bullets: [
      'Performed DAST scans on web applications and APIs, enabling remediation of critical vulnerabilities within SLA.',
      'Reduced false positives by 35% through customized scanning configurations and advanced analysis techniques.',
      'Conducted web application / API penetration testing and thick-client testing for enterprise applications, uncovering and remediating multiple high-severity vulnerabilities.',
      'Delivered comprehensive security reports with actionable recommendations to stakeholders and developers.',
      'Coordinated with development teams to ensure vulnerabilities were remediated within agreed timelines.',
    ],
  },
  {
    role:   'Systems Engineer',
    org:    'Trend Micro Inc.',
    period: 'May 2018 - April 2019',
    bullets: [
      'Provided escalation support for enterprise clients, resolving complex security product issues across email, phone, and chat channels.',
      'Managed high-priority incident cases to resolution, ensuring minimal downtime and customer impact.',
      'Shared expertise through technical knowledge base contributions and internal security trainings.',
    ],
  },
  {
    role:   'Cloud Security Engineer (Technical Support)',
    org:    'Trend Micro Inc.',
    period: 'July 2016 - May 2018',
    bullets: [
      'Delivered technical support to home and small office users, ensuring rapid malware remediation through remote sessions.',
      'Provided first-line triage for security incidents, escalating advanced cases to engineering teams.',
      'Authored technical guides and trained peers on best practices in cloud-based threat detection and prevention.',
    ],
  },
]

function ExperienceSection() {
  return (
    <section
      id="experience"
      className="py-20 sm:py-28 px-5"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <div className="max-w-3xl mx-auto">
        <SectionHeading eyebrow="Experience" title="Where I've Worked" highlight="I've Worked" />

        <div className="relative">
          {/* Vertical connector line behind the nodes */}
          <div
            aria-hidden
            className="absolute top-5 bottom-5"
            style={{ left: 19, width: 2, background: 'var(--color-border)' }}
          />

          <div className="flex flex-col gap-9 sm:gap-11">
            {EXPERIENCE.map((job, i) => (
              <Reveal key={`${job.role}-${job.period}`} delay={i * 80}>
                <div className="flex gap-5">
                  {/* Node */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center relative z-10"
                      style={{
                        background: 'var(--color-surface)',
                        border:     '1px solid var(--color-accent)',
                      }}
                    >
                      <span style={{ color: 'var(--color-accent)' }}>
                        <Briefcase size={18} weight="duotone" />
                      </span>
                    </div>
                  </div>

                  {/* Role content */}
                  <div className="pt-0.5">
                    <h3
                      className="font-display font-bold text-[16px] sm:text-[17px] leading-snug"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {job.role}
                    </h3>
                    <p className="font-mono text-[12px] mt-1 mb-3" style={{ color: 'var(--color-accent)' }}>
                      {job.org} / {job.period}
                    </p>
                    <ul className="space-y-2">
                      {job.bullets.map(b => (
                        <li key={b} className="flex gap-2 text-[14px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                          <span className="flex-shrink-0" style={{ color: 'var(--color-accent)' }}>→</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Work section ────────────────────────────────────────── */
type FilterTab = 'All' | ProjectCategory

const FILTER_TABS: FilterTab[] = ['All', 'Lead & Sales', 'Marketing & Content', 'Operations', 'Security', 'SaaS']

function WorkSection() {
  const [active, setActive] = useState<FilterTab>('All')
  const [query,  setQuery]  = useState('')

  const cards        = ALL_PROJECTS.filter(p => p.pattern && p.problem)
  const expandedOnly = ALL_PROJECTS.filter(p => p.pipeline && !p.pattern)

  const q = query.trim().toLowerCase()
  const matchesCat    = (p: ProjectData) => active === 'All' || p.category === active
  const matchesSearch = (p: ProjectData) =>
    q === '' ||
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.stack.some(s => s.toLowerCase().includes(q))

  const visibleCards    = cards.filter(p => matchesCat(p) && matchesSearch(p))
  const visibleExpanded = expandedOnly.filter(p => matchesCat(p) && matchesSearch(p))
  const isEmpty = visibleCards.length === 0 && visibleExpanded.length === 0

  const all = [...cards, ...expandedOnly]
  const counts = FILTER_TABS.reduce<Record<FilterTab, number>>((acc, tab) => {
    acc[tab] = tab === 'All' ? all.length : all.filter(p => p.category === tab).length
    return acc
  }, {} as Record<FilterTab, number>)

  return (
    <section
      id="work"
      className="py-20 sm:py-28 px-5"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Projects" title="Automation Solutions I've Built" highlight="I've Built" />

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-10">

          {/* Sidebar: search + categories */}
          <Reveal>
            <aside className="lg:sticky lg:top-24 self-start">
              <p
                className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
                style={{ color: 'var(--color-muted)' }}
              >
                Categories
              </p>

              {/* Search */}
              <div className="relative mb-4">
                <MagnifyingGlass
                  size={15}
                  weight="bold"
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--color-muted)' }}
                />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search projects"
                  aria-label="Search projects"
                  className="w-full rounded-lg pl-9 pr-3 py-2 text-[13px] outline-none transition-colors focus:border-[var(--color-accent)]"
                  style={{
                    background: 'var(--color-surface)',
                    border:     '1px solid var(--color-border)',
                    color:      'var(--color-text)',
                  }}
                />
              </div>

              {/* Category list */}
              <ul className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto no-scrollbar lg:overflow-visible pb-1 lg:pb-0">
                {FILTER_TABS.map(tab => {
                  const isActive = active === tab
                  return (
                    <li key={tab} className="flex-shrink-0">
                      <button
                        onClick={() => setActive(tab)}
                        className="btn-press w-full flex items-center justify-between gap-3 rounded-lg px-3.5 py-2 text-[13.5px] text-left whitespace-nowrap"
                        style={{
                          background: isActive ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)' : 'transparent',
                          color:      isActive ? 'var(--color-accent)' : 'var(--color-muted)',
                          fontWeight: isActive ? 600 : 400,
                          cursor:     'pointer',
                        }}
                      >
                        {tab}
                        <span
                          className="font-mono text-[11px] tabular-nums"
                          style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-muted)', opacity: 0.65 }}
                        >
                          {counts[tab]}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </aside>
          </Reveal>

          {/* Cards */}
          <div>
            {visibleCards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleCards.map((p, i) => (
                  <ProjectCard key={p.name} project={p} delay={(i % 2) * 80} />
                ))}
              </div>
            )}

            {visibleExpanded.length > 0 && (
              <div className={`flex flex-col gap-5 ${visibleCards.length > 0 ? 'mt-6' : ''}`}>
                {visibleExpanded.map((p, i) => (
                  <ExpandedProjectCard key={p.name} project={p} delay={i * 80} />
                ))}
              </div>
            )}

            {isEmpty && (
              <div className="py-16 text-center">
                <p className="font-mono text-[13px]" style={{ color: 'var(--color-muted)' }}>
                  No projects match your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Contact section ─────────────────────────────────────── */
function ContactSection() {
  return (
    <section
      id="contact"
      className="py-20 sm:py-28 px-5"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Reveal className="text-center mb-12 sm:mb-16">
          <span
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: 'var(--color-accent)' }}
          >
            Contact
          </span>
          <h2
            className="font-display font-bold text-3xl sm:text-4xl mt-2 leading-tight"
            style={{ color: 'var(--color-text)' }}
          >
            Ready to <span style={{ color: 'var(--color-accent)' }}>automate your business?</span>
          </h2>
          <p
            className="mx-auto mt-3 text-[15px] leading-relaxed"
            style={{ color: 'var(--color-muted)', maxWidth: 520 }}
          >
            Book a free 30-min discovery call or send a message. No commitment, just a conversation about what you need built.
          </p>
        </Reveal>

        {/* Calendly inline widget (no Reveal wrapper - avoids opacity-0 init issues) */}
        <CalendlyWidget />
      </div>
    </section>
  )
}


/* ─── Footer ──────────────────────────────────────────────── */
const FOOTER_NAV: { label: string; href: string }[] = [
  { label: 'Services',   href: '#services'   },
  { label: 'Work',       href: '#work'       },
  { label: 'Process',    href: '#process'    },
  { label: 'About Me',   href: '#why'        },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact',    href: '#contact'    },
]

function Footer() {
  const email    = 'joemarbelmonte.automation@gmail.com'
  const calendly = 'https://calendly.com/joemarbelmonte-automation/discovery-call'

  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
      <div className="max-w-6xl mx-auto px-5 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-5">
            <p className="font-display font-bold text-xl" style={{ color: 'var(--color-text)' }}>
              Joemar Belmonte
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] mt-1" style={{ color: 'var(--color-accent)' }}>
              AI Automation Specialist
            </p>
            <p className="text-[14px] leading-relaxed mt-4 max-w-sm" style={{ color: 'var(--color-muted)' }}>
              Building auditable AI automation systems that connect your tools and run without you, security-first from day one.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              <span className="text-[13px]" style={{ color: 'var(--color-text)' }}>Open for Work</span>
            </div>
          </div>

          {/* Navigate */}
          <div className="lg:col-span-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: 'var(--color-muted)' }}>
              Navigate
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2.5">
              {FOOTER_NAV.map(item => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-[14px] transition-colors hover:text-[var(--color-accent)]"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div className="lg:col-span-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: 'var(--color-muted)' }}>
              Get in touch
            </p>
            <ul className="flex flex-col gap-3">
              <li>
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2.5 text-[14px] transition-colors hover:text-[var(--color-accent)]" style={{ color: 'var(--color-muted)' }}>
                  <EnvelopeSimple size={17} weight="duotone" style={{ color: 'var(--color-accent)' }} />
                  <span className="truncate">{email}</span>
                </a>
              </li>
              <li>
                <a href={calendly} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-[14px] transition-colors hover:text-[var(--color-accent)]" style={{ color: 'var(--color-muted)' }}>
                  <CalendarBlank size={17} weight="duotone" style={{ color: 'var(--color-accent)' }} />
                  Book a discovery call
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5 text-[14px]" style={{ color: 'var(--color-muted)' }}>
                <MapPin size={17} weight="duotone" style={{ color: 'var(--color-accent)' }} />
                Quezon City, Philippines (PHT, UTC+8)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p className="font-mono text-[11px]" style={{ color: 'var(--color-muted)' }}>
            © 2026 Joemar Belmonte. All rights reserved.
          </p>
          <a
            href="#top"
            className="btn-press inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] hover:text-[var(--color-accent)]"
            style={{ color: 'var(--color-muted)' }}
          >
            Back to top
            <ArrowUp size={13} weight="bold" />
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ─── Export ──────────────────────────────────────────────── */
export default function StaticSection() {
  return (
    <div style={{ background: 'var(--color-bg)' }}>
      <StatsStrip />
      <TechMarquee />
      <ServicesSection />
      <WorkSection />
      <HowItWorks />
      <WhySection />
      <ExperienceSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
