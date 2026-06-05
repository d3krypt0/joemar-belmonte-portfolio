export interface ProjectMetric {
  value: string
  label: string
}

export interface PipelineNode {
  num:         string
  integration: string
  title:       string
  desc:        string
}

export interface ProjectData {
  name:        string
  type:        string
  description: string
  stack:       string[]
  metrics:     [ProjectMetric, ProjectMetric]
  accent:      string
  keywords?:   string[]
  pipeline?:   PipelineNode[]
}

export const ALL_PROJECTS: ProjectData[] = [
  {
    name:        'DropshipIQ',
    type:        'Full-Stack Intelligence Platform',
    description: 'Product research platform integrating CJDropshipping, Meta Ads Library, and Google Trends. Live dashboards. Zero mock data.',
    stack:       ['Node.js', 'Docker', 'nginx', 'Meta Ads API', 'Google Trends'],
    metrics:     [{ value: '3', label: 'Live APIs' }, { value: '0', label: 'Mock Data' }],
    accent:      '#0090CC',
    keywords:    ['dropshipiq', 'dropship intelligence', 'product research platform'],
  },
  {
    name:        '6-Agent AI Dropshipping System',
    type:        'AI Automation Architecture',
    description: 'Production multi-agent platform using Claude API and n8n. Telegram approval gates for every money-impacting action.',
    stack:       ['Claude API', 'n8n', 'Docker', 'Shopify', 'Airtable', 'Telegram'],
    metrics:     [{ value: '6', label: 'AI Agents' }, { value: 'TG', label: 'Approval Gate' }],
    accent:      '#0078B8',
    keywords:    ['6-agent', 'multi-agent', 'dropshipping system', 'agent pipeline'],
  },
  {
    name:        'MenuCostingAI',
    type:        'SaaS Product — Freemium',
    description: 'AI-powered SaaS for food business costing. Claude Vision API for recipe analysis. Pro tier via LemonSqueezy license key.',
    stack:       ['React', 'Claude API', 'LemonSqueezy', 'Railway'],
    metrics:     [{ value: '2', label: 'Tiers' }, { value: 'AI', label: 'Vision Analysis' }],
    accent:      '#008060',
    keywords:    ['menucosting', 'menu costing', 'restaurant costing', 'saas'],
  },
  {
    name:        'F&B Costing Calculator',
    type:        'Commercial Digital Product',
    description: 'Excel costing tool with 299 formulas and 5-sheet architecture. Built with Python/openpyxl. Sold commercially — market validated.',
    stack:       ['Python', 'openpyxl', 'Excel'],
    metrics:     [{ value: '299', label: 'Formulas' }, { value: '₱249', label: 'Sold' }],
    accent:      '#B45309',
    keywords:    ['f&b', 'costing calculator', 'excel', 'openpyxl'],
  },
  {
    name:        'DropSignal Trend-to-Store Autopilot',
    type:        'End-to-End eCommerce Automation',
    description: 'Fully automated n8n pipeline running every 4 hours. Trend signals to live Shopify listing with zero manual input.',
    stack:       ['n8n', 'Shopify', 'AliExpress API', 'Meta Ads API', 'Airtable'],
    metrics:     [{ value: '4h', label: 'Run Interval' }, { value: '0', label: 'Manual Steps' }],
    accent:      '#7C3AED',
  },
  {
    name:        'n8n Lead Qualifier',
    type:        'CRM Automation Pipeline',
    description: 'Gmail-triggered workflow that scores inbound leads with Groq AI and routes them to Airtable with Telegram alerts for hot leads.',
    stack:       ['n8n', 'Groq API', 'Gmail', 'Airtable', 'Telegram'],
    metrics:     [{ value: '0', label: 'Manual Review' }, { value: 'AI', label: 'Lead Scoring' }],
    accent:      '#059669',
  },
  {
    name:        'AI Media Monitoring & PR System',
    type:        'Make.com Automation — 6 Modules',
    description: 'Automated PR pipeline that scans Google Alerts every morning, runs each mention through Claude AI for sentiment analysis and draft replies, queues Gmail drafts for journalist follow-ups, logs everything to Notion, and sends the team a Telegram briefing — before their first coffee.',
    stack:       ['Make.com', 'Claude API', 'Google Alerts RSS', 'Gmail', 'Notion', 'Telegram Bot'],
    metrics:     [{ value: '6', label: 'Modules' }, { value: '7AM', label: 'Daily Trigger' }],
    accent:      '#7C3AED',
    keywords:    ['media monitoring', 'pr automation', 'make.com', 'google alerts', 'press mentions', 'journalist', 'morning brief', 'media scan'],
    pipeline: [
      { num: '01', integration: 'MAKE.COM → SCHEDULE',          title: 'Daily 7AM Trigger',        desc: 'Pulls active client list from Notion — name, keywords, tone, pending pitches.' },
      { num: '02', integration: 'MAKE.COM → GOOGLE ALERTS RSS', title: 'Media Scan',               desc: "Hits each client's Google Alerts feed. Filters last 24hrs. Extracts headline, URL, source." },
      { num: '03', integration: 'MAKE.COM → CLAUDE API',        title: 'AI Analysis',              desc: "Claude reads each mention. Outputs sentiment, 2-sentence summary, and draft reply in founder's voice." },
      { num: '04', integration: 'MAKE.COM → GMAIL',             title: 'Auto-Draft Queued',        desc: 'If follow-up flagged, Gmail draft created — not sent. Team reviews and hits send.' },
      { num: '05', integration: 'MAKE.COM → NOTION',            title: 'Publications Log Updated', desc: 'Every mention logged: outlet, URL, sentiment, summary. Weekly reports auto-generate.' },
      { num: '06', integration: 'MAKE.COM → TELEGRAM BOT',      title: 'Morning Brief Sent',       desc: 'Team receives: mentions found, sentiment breakdown, drafts queued, urgent items flagged.' },
    ],
  },
]

const DETECTABLE = ALL_PROJECTS.filter(p => p.keywords && p.keywords.length > 0)

export function detectProjectsInText(text: string): ProjectData[] {
  const lower = text.toLowerCase()
  const seen  = new Set<string>()
  return DETECTABLE.filter(p => {
    if (seen.has(p.name)) return false
    const hit = p.keywords!.some(kw => lower.includes(kw.toLowerCase()))
    if (hit) seen.add(p.name)
    return hit
  })
}
