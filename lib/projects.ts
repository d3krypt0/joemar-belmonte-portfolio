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

export type PatternType     = 'pipeline' | 'hub' | 'grid' | 'branch' | 'funnel' | 'launch'
export type ProjectCategory = 'n8n' | 'Make.com' | 'Web Dev' | 'Digital Templates'

export interface ProjectData {
  name:           string
  type:           string
  description:    string
  stack:          string[]
  metrics:        [ProjectMetric, ProjectMetric]
  accent:         string
  category?:      ProjectCategory
  keywords?:      string[]
  pipeline?:      PipelineNode[]
  pills?:         string[]
  pattern?:       PatternType
  problem?:       string
  solution?:      string
  result?:        string
  workflowImage?: string
}

export const ALL_PROJECTS: ProjectData[] = [
  {
    name:        'AI Media Monitoring & PR System',
    type:        'Make.com Automation',
    description: 'Automated PR pipeline that scans Google Alerts every morning, runs each mention through Claude AI for sentiment analysis and draft replies, queues Gmail drafts for journalist follow-ups, logs everything to Notion, and sends the team a Telegram briefing.',
    stack:       ['Make.com', 'Claude API', 'Google Alerts RSS', 'Gmail', 'Notion', 'Telegram Bot'],
    metrics:     [{ value: '6', label: 'Modules' }, { value: '7AM', label: 'Daily Trigger' }],
    accent:      '#7C3AED',
    category:    'Make.com',
    keywords:    ['media monitoring', 'pr automation', 'make.com', 'google alerts', 'press mentions', 'journalist', 'morning brief', 'media scan'],
    pills:       ['MAKE.COM', 'CLAUDE API', 'NOTION'],
    pattern:     'pipeline',
    workflowImage: '/workflows/pr-pulse-workflow.png',
    problem:     'PR teams were manually googling client mentions daily, missing follow-up windows, and spending hours on media monitoring with no structured logging.',
    solution:    "Built a Make.com automation that scans Google Alerts RSS at 7AM, runs mentions through Claude for sentiment analysis and draft replies in the founder's voice, queues Gmail drafts, logs to Notion, and sends a Telegram brief.",
    result:      'Zero manual media scanning. Follow-up drafts auto-queued for human review. Team briefed before 8AM every day.',
    pipeline: [
      { num: '01', integration: 'MAKE.COM -> SCHEDULE',          title: 'Daily 7AM Trigger',        desc: 'Pulls active client list from Notion — name, keywords, tone, pending pitches.' },
      { num: '02', integration: 'MAKE.COM -> GOOGLE ALERTS RSS', title: 'Media Scan',               desc: "Hits each client's Google Alerts feed. Filters last 24hrs. Extracts headline, URL, source." },
      { num: '03', integration: 'MAKE.COM -> CLAUDE API',        title: 'AI Analysis',              desc: "Claude reads each mention. Outputs sentiment, 2-sentence summary, and draft reply in founder's voice." },
      { num: '04', integration: 'MAKE.COM -> GMAIL',             title: 'Auto-Draft Queued',        desc: 'If follow-up flagged, Gmail draft created — not sent. Team reviews and hits send.' },
      { num: '05', integration: 'MAKE.COM -> NOTION',            title: 'Publications Log Updated', desc: 'Every mention logged: outlet, URL, sentiment, summary. Weekly reports auto-generate.' },
      { num: '06', integration: 'MAKE.COM -> TELEGRAM BOT',      title: 'Morning Brief Sent',       desc: 'Team receives: mentions found, sentiment breakdown, drafts queued, urgent items flagged.' },
    ],
  },
  {
    name:        'n8n Lead Qualifier',
    type:        'CRM Automation Pipeline',
    description: 'Gmail-triggered workflow that scores inbound leads with Groq AI and routes them to Airtable with Telegram alerts for hot leads.',
    stack:       ['n8n', 'Groq API', 'Gmail', 'Airtable', 'Telegram'],
    metrics:     [{ value: '0', label: 'Manual Review' }, { value: 'AI', label: 'Lead Scoring' }],
    accent:      '#EA4B71',
    category:    'n8n',
    keywords:    ['lead qualifier', 'lead scoring', 'n8n lead', 'groq', 'email automation'],
    pills:       ['N8N', 'GROQ AI', 'GMAIL'],
    pattern:     'branch',
    workflowImage: '/workflows/n8n-lead-qualifier-workflow.png',
    problem:     'Inbound leads arriving via email were being reviewed manually — no scoring, no prioritization, and hot leads were sitting unanswered for hours or getting lost entirely.',
    solution:    'Built an n8n workflow triggered by Gmail that extracts email data, scores the lead using Groq AI (Llama), parses the AI response, then branches — PASS leads log to Airtable silently, while hot leads log to Airtable AND fire an instant Telegram alert.',
    result:      'Every inbound lead scored and routed in seconds. Hot leads get a Telegram alert before the email client even refreshes — zero manual triage required.',
  },
  {
    name:        '6-Agent AI Dropshipping System',
    type:        'AI Automation Architecture',
    description: 'Production multi-agent platform using Claude API and n8n. Telegram approval gates for every money-impacting action.',
    stack:       ['Claude API', 'n8n', 'Docker', 'Shopify', 'Airtable', 'Telegram'],
    metrics:     [{ value: '6', label: 'AI Agents' }, { value: 'TG', label: 'Approval Gate' }],
    accent:      '#0078B8',
    category:    'n8n',
    keywords:    ['6-agent', 'multi-agent', 'dropshipping system', 'agent pipeline'],
    pills:       ['N8N', 'AI AGENT', 'CLAUDE API'],
    pattern:     'hub',
    workflowImage: '/workflows/ai-dropshipping-agent-workflow.png',
    problem:     'Running a dropshipping store required constant manual research, supplier checks, and ad monitoring — consuming hours daily with no consistency.',
    solution:    'Built a 6-agent Claude API + n8n pipeline covering product research, supplier sourcing, ad creative, analytics, store ops, and customer service. Telegram approval gates ensure no financial action fires without human sign-off.',
    result:      'Fully automated research-to-launch pipeline running 24/7. Manual research time reduced from hours to minutes per day.',
  },
  {
    name:        'DropshipIQ: Product Intelligence Platform',
    type:        'Full-Stack Intelligence Platform',
    description: 'Product research platform integrating CJDropshipping, Meta Ads Library, and Google Trends. Live dashboards. Zero mock data.',
    stack:       ['Node.js', 'Docker', 'nginx', 'Meta Ads API', 'Google Trends'],
    metrics:     [{ value: '3', label: 'Live APIs' }, { value: '0', label: 'Mock Data' }],
    accent:      '#0090CC',
    category:    'Web Dev',
    keywords:    ['dropshipiq', 'dropship intelligence', 'product research platform'],
    pills:       ['NODE.JS', 'DOCKER', 'META ADS API'],
    pattern:     'funnel',
    workflowImage: '/workflows/dropshipiq-screenshot.png',
    problem:     'Product research required manually checking multiple platforms — CJDropshipping, Meta Ads, Google Trends — with no unified view and constant risk of stale data.',
    solution:    'Built a full-stack platform integrating all three APIs via Docker Compose and nginx. Live dashboards with real data — Research, Winning Products, Compare, and Watchlist tabs.',
    result:      'Zero mock data. 3 live APIs. Product scoring and trend validation in one place — research time cut by 80%.',
  },
  {
    name:        'MenuCostingAI',
    type:        'SaaS Product — Freemium',
    description: 'AI-powered SaaS for food business costing. Claude Vision API for recipe analysis. Pro tier via LemonSqueezy license key.',
    stack:       ['React', 'Claude API', 'LemonSqueezy', 'Railway'],
    metrics:     [{ value: '2', label: 'Tiers' }, { value: 'AI', label: 'Vision Analysis' }],
    accent:      '#008060',
    category:    'Web Dev',
    keywords:    ['menucosting', 'menu costing', 'restaurant costing', 'saas'],
    pills:       ['REACT', 'CLAUDE API', 'SAAS'],
    pattern:     'branch',
    workflowImage: '/workflows/menucosting-ai-screenshot.png',
    problem:     'Food business owners were calculating recipe costs manually in spreadsheets — error-prone, slow, and with no AI-assisted analysis.',
    solution:    'Built a freemium SaaS with React frontend, Express backend on Railway, and Claude Vision API for AI-powered recipe analysis. Pro tier gated via LemonSqueezy license key.',
    result:      'Two-tier product live with automated licensing. AI analysis replaces manual costing — margin calculations in seconds, not hours.',
  },
  {
    name:        'Food & Business Costing Calculator',
    type:        'Commercial Digital Product',
    description: 'Excel costing tool with 299 formulas and 5-sheet architecture. Built with Python/openpyxl. Sold commercially — market validated.',
    stack:       ['Python', 'openpyxl', 'Excel'],
    metrics:     [{ value: '299', label: 'Formulas' }, { value: '₱249', label: 'Sold' }],
    accent:      '#B45309',
    category:    'Digital Templates',
    keywords:    ['f&b', 'costing calculator', 'excel', 'openpyxl'],
    pills:       ['PYTHON', 'OPENPYXL', 'EXCEL'],
    pattern:     'grid',
    workflowImage: '/workflows/food-costing-calculator-screenshot.png',
    problem:     'Small food businesses had no affordable, structured tool for recipe costing, margin calculation, and P&L simulation.',
    solution:    'Built a 5-sheet Excel tool programmatically with Python/openpyxl — Ingredient Library, Recipe Builder, Menu Simulator, P&L, and Settings. 299 live formulas throughout.',
    result:      'Sold commercially at ₱249. Market-validated digital product with zero manual formula entry required by the buyer.',
  },
  {
    name:        'DropSignal Trend-to-Store Autopilot',
    type:        'End-to-End eCommerce Automation',
    description: 'Fully automated n8n pipeline running every 4 hours. Trend signals to live Shopify listing with zero manual input.',
    stack:       ['n8n', 'Shopify', 'AliExpress API', 'Meta Ads API', 'Airtable'],
    metrics:     [{ value: '4h', label: 'Run Interval' }, { value: '0', label: 'Manual Steps' }],
    accent:      '#7C3AED',
    category:    'n8n',
    keywords:    ['dropsignal', 'trend-to-store', 'dropshipping autopilot', 'shopify automation'],
    pills:         ['N8N', 'SHOPIFY', 'META ADS API'],
    pattern:       'launch',
    workflowImage: '/workflows/dropsignal-workflow.png',
    problem:       'Manually tracking viral product trends across Reddit and AliExpress was a full-time job — by the time a product was spotted, sourced, and listed, the trend window had closed.',
    solution:      'Built a fully automated n8n pipeline running every 4 hours. Fetches market signals, scores virality with AI, sources AliExpress suppliers, generates product content, creates Shopify listings, and launches Facebook campaigns for qualifying products — zero manual input.',
    result:        'Complete trend-to-live-store automation in a single unattended sequence. Hot products go from signal detection to live Shopify listing and active Facebook campaign in under one cycle.',
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
