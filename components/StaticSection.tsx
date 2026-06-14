'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ALL_PROJECTS, type ProjectData, type PipelineNode, type ProjectCategory } from '@/lib/projects'
import { useVisible } from '@/lib/hooks'
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

/* ─── Pricing table (Shopify-style cards) ────────────────── */
interface PricingTier {
  name:            string
  priceFrom:       string
  priceTo?:        string
  tagline:         string
  items:           string[]
  highlight:       boolean
  limited?:        boolean
  accentOverride?: string
  cta?:            { label: string; url: string }
}

const PRICING_TIERS: PricingTier[] = [
  {
    name:      'SIMPLE AUTOMATION',
    priceFrom: '$300',
    priceTo:   '$1,500',
    tagline:   'Single-process workflows connecting 2-3 tools. Includes AI audit and strategy sessions.',
    items:     ['Basic chatbot setup', '2-3 tool workflow builds', 'Lead capture & notifications', 'AI audit + roadmap ($500-$1,000)'],
    highlight: false,
  },
  {
    name:           'FOUNDING CLIENT',
    priceFrom:      'From $750',
    tagline:        '10+ years of security engineering, now applied to business automation. Founding clients get direct access and below-market rates.',
    items:          [
      'Free Automation Audit (30 min)',
      'Project build from $750',
      '30 days post-launch support',
      'Case study — you approve before publish',
      '5 slots only — limited intake',
    ],
    highlight:      false,
    limited:        true,
    accentOverride: '#F59E0B',
    cta:            { label: 'Book Free Audit', url: 'https://calendly.com/joemarbelmonte-automation/discovery-call' },
  },
  {
    name:      'AI AUTOMATION BUILD',
    priceFrom: '$2,000',
    priceTo:   '$5,000',
    tagline:   'Multi-step AI pipelines with 4+ tool integrations built to run without you.',
    items:     ['Multi-step n8n workflows (4+ tools)', 'AI lead qualification & scoring', 'CRM + Slack + email integration', 'Monitoring, alerting & reporting'],
    highlight: true,
  },
  {
    name:      'ENTERPRISE AI',
    priceFrom: '$5,000',
    priceTo:   '$20,000+',
    tagline:   'Full end-to-end AI agents and large-scale automation across entire business operations.',
    items:     ['End-to-end AI agent systems', 'Multi-agent architectures', 'Large-scale data pipelines', 'Department-wide process automation'],
    highlight: false,
  },
  {
    name:      'MONTHLY RETAINER',
    priceFrom: '$300',
    priceTo:   '$1,000+/mo',
    tagline:   'Ongoing maintenance, prompt updates, API changes, and new feature additions.',
    items:     ['Workflow monitoring & fixes', 'Prompt updates & API changes', 'New automation additions', 'Priority response'],
    highlight: false,
  },
]

function PricingTable() {
  return (
    <Reveal className="mt-20">
      <div style={{ borderTop: '1px solid var(--color-border)', marginBottom: 64 }} />
      <div className="text-center mb-12">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{ color: 'var(--color-accent)' }}
        >
          Pricing
        </span>
        <h2
          className="font-display font-bold text-3xl sm:text-4xl mt-2 leading-tight"
          style={{ color: 'var(--color-text)' }}
        >
          Transparent, Value-Based Rates
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {PRICING_TIERS.map(tier => {
          const accent = tier.accentOverride ?? 'var(--color-accent)'
          return (
            <div
              key={tier.name}
              className="relative rounded-xl p-3.5 flex flex-col"
              style={{
                background: tier.highlight
                  ? 'color-mix(in srgb, var(--color-accent) 5%, var(--color-surface))'
                  : tier.limited
                  ? `color-mix(in srgb, ${tier.accentOverride} 6%, var(--color-surface))`
                  : 'var(--color-surface)',
                border: tier.highlight
                  ? '2px solid var(--color-accent)'
                  : tier.limited
                  ? `2px solid ${tier.accentOverride}99`
                  : '1px solid var(--color-border)',
              }}
            >
              {/* Badges */}
              {tier.highlight && (
                <span
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase whitespace-nowrap"
                  style={{ background: 'var(--color-accent)', color: '#050505' }}
                >
                  Recommended
                </span>
              )}
              {tier.limited && (
                <span
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase whitespace-nowrap"
                  style={{ background: tier.accentOverride, color: '#1a0800' }}
                >
                  Limited
                </span>
              )}

              {/* Plan name */}
              <p
                className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase mb-3"
                style={{ color: accent }}
              >
                {tier.name}
              </p>

              {/* Price */}
              <div className="mb-1 flex items-baseline gap-1 flex-wrap">
                <span
                  className="font-display font-bold tabular-nums"
                  style={{ fontSize: 22, lineHeight: 1, color: 'var(--color-text)' }}
                >
                  {tier.priceFrom}
                </span>
                {tier.priceTo && (
                  <span
                    className="font-display font-semibold"
                    style={{ fontSize: 14, color: 'var(--color-muted)' }}
                  >
                    – {tier.priceTo}
                  </span>
                )}
              </div>
              <p className="text-[10px] mb-3" style={{ color: 'var(--color-muted)' }}>
                {tier.limited ? 'Below-market rate — 5 slots only.' : 'Starting price. Final quote after scoping.'}
              </p>

              {/* Tagline */}
              <p
                className="text-[12px] leading-relaxed mb-3"
                style={{ color: 'var(--color-text)', opacity: 0.8 }}
              >
                {tier.tagline}
              </p>

              {/* Divider */}
              <div className="mb-3" style={{ borderTop: '1px solid var(--color-border)' }} />

              {/* Label */}
              <p
                className="font-mono text-[9px] font-bold tracking-[0.14em] uppercase mb-2"
                style={{ color: 'var(--color-muted)' }}
              >
                {tier.limited ? "What's included" : 'Perfect for'}
              </p>
              <ul className="flex flex-col gap-2 flex-1">
                {tier.items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-[12px]" style={{ color: 'var(--color-muted)' }}>
                    <span style={{ color: accent, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA (Founding Client only) */}
              {tier.cta && (
                <a
                  href={tier.cta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[12px] transition-opacity hover:opacity-85"
                  style={{
                    background: tier.accentOverride,
                    color:      '#1a0800',
                    padding:    '9px 12px',
                  }}
                >
                  → {tier.cta.label}
                </a>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      <p className="mt-5 text-[12px] text-center" style={{ color: 'var(--color-muted)' }}>
        Retainer priced at ~20% of project cost. 30-50% downpayment required to start. Final quote after a free scoping call.
      </p>
    </Reveal>
  )
}

/* ─── Services section ────────────────────────────────────── */
const SERVICES = [
  {
    icon:         '⚙️',
    title:        'Business Process Automation',
    description:  'Custom workflows that connect your tools, trigger on real events, and eliminate repetitive work automatically — lead scoring, CRM routing, media monitoring, and more.',
    deliverables: ['n8n workflow builds', 'Make.com scenarios', 'AI-powered lead scoring & triage', 'Automated email & Telegram reports', 'CRM routing & Airtable logging'],
  },
  {
    icon:         '🤖',
    title:        'Multi-Agent AI Systems',
    description:  'Autonomous AI pipelines where multiple specialized agents work in sequence — researching, deciding, and acting. Agents propose actions; you approve via Telegram before execution.',
    deliverables: ['Multi-agent Claude API architecture', 'n8n orchestration layer', 'Telegram approval gates', 'Airtable & Shopify integration', 'Docker self-hosted deployment'],
  },
  {
    icon:         '🛠️',
    title:        'Custom Tools & Dashboards',
    description:  'Custom-built tools your team actually uses — live API dashboards, AI-powered SaaS products, and Excel systems built to sell commercially.',
    deliverables: ['React / Next.js platforms', 'Live API integrations (Meta Ads, Trends)', 'Railway / Docker deployment', 'Commercial Excel tools', 'Python automation (openpyxl)'],
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
        <PricingTable />
      </div>
    </section>
  )
}

/* ─── Why Work With Me section ───────────────────────────── */
const WHY_BULLETS = [
  {
    icon:  '🔒',
    title: '10+ Years Cybersecurity Background',
    desc:  'Every system I build is security-reviewed from the start — auditable data flows, least-privilege API access, and no silent failure points. You get automation that your security team can actually sign off on.',
  },
  {
    icon:  '🤖',
    title: 'Multi-Agent Architecture Expertise',
    desc:  'I design and deploy systems where multiple AI agents coordinate — each specialized, each accountable. Not chatbots. Actual agent pipelines with human approval gates on every consequential action.',
  },
  {
    icon:  '🚀',
    title: 'Production Deployments, Not Demos',
    desc:  'The workflows I showcase are live and running — connected to real APIs, processing real data, triggered by real events. I don\'t build prototypes for portfolios. I build systems that run at 2am without me.',
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
        <SectionHeading eyebrow="Differentiators" title="Why Work With Me" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WHY_BULLETS.map((b, i) => (
            <Reveal key={b.title} delay={i * 80} className="h-full">
              <div
                className="h-full rounded-xl p-6 flex flex-col gap-4"
                style={{
                  background:  'var(--color-surface)',
                  border:      '1px solid var(--color-border)',
                  borderLeft:  '3px solid var(--color-accent)',
                }}
              >
                <span className="text-3xl">{b.icon}</span>
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

/* ─── Work section ────────────────────────────────────────── */
type FilterTab = 'All' | ProjectCategory

const FILTER_TABS: FilterTab[] = ['All', 'n8n', 'Make.com', 'Web Dev', 'Digital Templates']

function WorkSection() {
  const [active, setActive] = useState<FilterTab>('All')

  const allCard     = ALL_PROJECTS.filter(p => p.pattern && p.problem)
  const expandedOnly = ALL_PROJECTS.filter(p => p.pipeline && !p.pattern)

  const visibleCards    = active === 'All' ? allCard     : allCard.filter(p => p.category === active)
  const visibleExpanded = active === 'All' ? expandedOnly : expandedOnly.filter(p => p.category === active)

  const counts = FILTER_TABS.reduce<Record<FilterTab, number>>((acc, tab) => {
    const all = [...allCard, ...expandedOnly]
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
        <SectionHeading eyebrow="Work" title="Automation Solutions I've Built" />

        {/* Filter tabs */}
        <Reveal className="mb-8 -mt-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {FILTER_TABS.map(tab => {
              const isActive = active === tab
              const count    = counts[tab]
              return (
                <button
                  key={tab}
                  onClick={() => setActive(tab)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[12px] transition-all duration-150"
                  style={{
                    background:  isActive ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)' : 'var(--color-surface)',
                    border:      `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    color:       isActive ? 'var(--color-accent)' : 'var(--color-muted)',
                    cursor:      'pointer',
                  }}
                >
                  {tab}
                  <span
                    className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[9px] font-bold"
                    style={{
                      background: isActive ? 'var(--color-accent)' : 'var(--color-surface-2)',
                      color:      isActive ? '#050505'              : 'var(--color-muted)',
                    }}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Project cards grid */}
        {visibleCards.length > 0 && (
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))' }}
          >
            {visibleCards.map((p, i) => (
              <ProjectCard key={p.name} project={p} delay={i * 80} />
            ))}
          </div>
        )}

        {/* Expanded pipeline-only cards */}
        {visibleExpanded.length > 0 && (
          <div className={`flex flex-col gap-5 ${visibleCards.length > 0 ? 'mt-5' : ''}`}>
            {visibleExpanded.map((p, i) => (
              <ExpandedProjectCard key={p.name} project={p} delay={i * 80} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {visibleCards.length === 0 && visibleExpanded.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-mono text-[13px]" style={{ color: 'var(--color-muted)' }}>
              No projects in this category yet.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── Contact section ─────────────────────────────────────── */
const EMAIL = 'joemarbelmonte.automation@gmail.com'

const INFO_ROWS = [
  { label: 'Location',     value: 'Philippines'           },
  { label: 'Timezone',     value: 'PHT (UTC+8)'           },
  { label: 'Availability', value: 'Open for Projects' },
  { label: 'Response',     value: 'Within 24 hours'       },
  { label: 'Project Min.', value: 'USD 500'               },
  { label: 'Status',       value: 'Open for Work'         },
]

function CopyEmailButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all w-full"
      style={{
        background: 'var(--color-surface-2)',
        color:      copied ? '#10b981' : 'var(--color-text)',
        border:     `1px solid ${copied ? '#10b981' : 'var(--color-border)'}`,
        cursor:     'pointer',
      }}
    >
      <span style={{ fontSize: 14 }}>{copied ? '✓' : '📋'}</span>
      <span className="truncate">{copied ? 'Copied!' : EMAIL}</span>
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
        {/* Header */}
        <Reveal className="text-center mb-12 sm:mb-16">
          <span
            className="font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: 'var(--color-accent)' }}
          >
            // Contact
          </span>
          <h2
            className="font-display font-bold text-3xl sm:text-4xl mt-2 leading-tight"
            style={{ color: 'var(--color-text)' }}
          >
            Ready to automate your business?
          </h2>
          <p
            className="mx-auto mt-3 text-[15px] leading-relaxed"
            style={{ color: 'var(--color-muted)', maxWidth: 520 }}
          >
            Book a free 30-min discovery call or send a message. No commitment, just a conversation about what you need built.
          </p>
        </Reveal>

        {/* Two-column grid: info (fixed 380px) + Calendly widget */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">

          {/* Left — info panel */}
          <Reveal>
            <div
              className="rounded-xl p-6"
              style={{
                background: 'var(--color-surface)',
                border:     '1px solid var(--color-border)',
              }}
            >
              {/* Info rows */}
              <div>
                {INFO_ROWS.map((row, i) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between py-3"
                    style={{
                      borderBottom: i < INFO_ROWS.length - 1 ? '1px solid var(--color-border)' : 'none',
                    }}
                  >
                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.12em]"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {row.label}
                    </span>
                    <span
                      className="text-[13px] font-medium flex items-center gap-1.5 text-right"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {row.label === 'Status' && (
                        <span
                          className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                          style={{ animation: 'pulse 2s ease-in-out infinite' }}
                        />
                      )}
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Email fallback */}
              <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--color-border)' }}>
                <p
                  className="text-[14px] font-semibold mb-3"
                  style={{ fontFamily: 'var(--font-display, system-ui)', color: 'var(--color-text)' }}
                >
                  Prefer email?
                </p>
                <p className="mb-2 text-[12px]" style={{ color: 'var(--color-muted)' }}>
                  Click to copy my email address.
                </p>
                <CopyEmailButton />
                <p className="mt-2 text-[12px]" style={{ color: 'var(--color-muted)' }}>
                  I respond within 24 hours.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right — Calendly inline widget (no Reveal wrapper — avoids opacity-0 init issues) */}
          <CalendlyWidget />
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

/* ─── Credibility strip ───────────────────────────────────── */
const CRED_STATS = [
  { value: '10+',  label: 'Years in Cybersecurity' },
  { value: '9',    label: 'Production Systems Built' },
  { value: '19',   label: 'Live API Integrations' },
  { value: '24/7', label: 'Autonomous Uptime' },
]

function CredibilityStrip() {
  return (
    <Reveal>
      <div
        className="max-w-6xl mx-auto px-5 py-8"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x"
          style={{ '--tw-divide-opacity': 1, borderColor: 'var(--color-border)' } as React.CSSProperties}
        >
          {CRED_STATS.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center px-4"
              style={i > 0 ? { borderLeft: '1px solid var(--color-border)' } : {}}
            >
              <span
                className="font-display font-bold text-3xl tabular-nums"
                style={{ color: 'var(--color-accent)' }}
              >
                {s.value}
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.16em] mt-1"
                style={{ color: 'var(--color-muted)' }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  )
}

/* ─── Export ──────────────────────────────────────────────── */
export default function StaticSection() {
  return (
    <div style={{ background: 'var(--color-bg)' }}>
      <SectionDivider />
      <CredibilityStrip />
      <ServicesSection />
      <WhySection />
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
