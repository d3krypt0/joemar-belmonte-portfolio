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
    name:        'SEO Site Audit',
    type:        'n8n Automation',
    description: 'Slack-triggered SEO audit pipeline powered by DataForSEO\'s async API — with an Airtable cache layer, a polling loop with 10-retry timeout, parallel data fetching, and a formatted Google Drive report delivered back to Slack.',
    stack:       ['n8n', 'Slack', 'DataForSEO', 'Airtable', 'Google Drive'],
    metrics:     [{ value: '10x', label: 'Retry Polling' }, { value: 'Cached', label: 'Airtable Layer' }],
    accent:      '#F97316',
    category:    'n8n',
    keywords:    ['seo site audit', 'seo audit', 'dataforseo', 'site audit', 'seo slack', 'seo automation', 'on-page audit', 'seo pipeline'],
    pills:       ['N8N', 'DATAFORSEO', 'AIRTABLE'],
    pattern:     'pipeline',
    workflowImage: '/workflows/SEO Site Audit.png',
    problem:     'Running SEO audits manually means switching between tools, waiting on slow API crawls, and repeating the same pull for domains already checked recently — wasting time and API credits on redundant work.',
    solution:    'Trigger a full site audit by posting a domain in Slack. The pipeline first checks an Airtable cache — if a fresh audit exists, it returns instantly. Otherwise it posts an async crawl task to DataForSEO, polls every 30 seconds (up to 10 retries), fetches summary and page-level data in parallel once ready, merges both streams, and writes a structured markdown report to Google Drive. Every error state — invalid input, task failure, polling timeout — routes to a Slack alert and run log.',
    result:      'Full SEO audit from Slack command to Google Drive report, with zero repeated API spend on recently-audited domains. Every failure mode handled with Slack alerts and Airtable run logs.',
    pipeline: [
      { num: '01', integration: 'SLACK -> TRIGGER',       title: 'Audit Request',       desc: 'User posts a domain to Slack. Input is validated — invalid domains get an error reply before anything fires.' },
      { num: '02', integration: 'AIRTABLE -> CACHE',      title: 'Cache Check',         desc: 'Queries Airtable SEO_Cache for a recent audit of this domain. Cache hit returns instantly — no API call made.' },
      { num: '03', integration: 'DATAFORSEO -> ASYNC',    title: 'Crawl Task Posted',   desc: 'Posts an on_page audit task to DataForSEO. Extracts task_id from the async response for polling.' },
      { num: '04', integration: 'N8N -> POLLING LOOP',    title: 'Polling Loop',        desc: 'Waits 30s then checks tasks_ready. Routes: READY fetches results, TIMEOUT after 10 polls alerts Slack, DEFAULT loops.' },
      { num: '05', integration: 'DATAFORSEO -> PARALLEL', title: 'Parallel Fetch',      desc: 'Fetches OnPage Summary and OnPage Pages simultaneously. Both streams merged into a single item for transform.' },
      { num: '06', integration: 'GOOGLE DRIVE -> SLACK',  title: 'Report & Notify',     desc: 'Formats a structured markdown audit report, creates a Google Drive file, updates Airtable cache, notifies Slack.' },
    ],
  },
  {
    name:        'AI Jobs Scraper + Resume Optimizer',
    type:        'n8n Automation',
    description: 'Slack-triggered pipeline that scrapes live job listings then uses OpenRouter AI to tailor your resume to each job description — producing a ready-to-send Google Doc and Gmail draft per application, automatically.',
    stack:       ['n8n', 'Slack', 'OpenRouter', 'Google Docs', 'Google Drive', 'Gmail', 'JSearch API'],
    metrics:     [{ value: '1', label: 'Slack Command' }, { value: 'AI', label: 'Per-Job Resume' }],
    accent:      '#6366F1',
    category:    'n8n',
    keywords:    ['jobs scraper', 'resume optimizer', 'ai jobs', 'resume tailor', 'job search automation', 'slack jobs', 'openrouter resume', 'jobs scraper resume'],
    pills:       ['N8N', 'OPENROUTER', 'GOOGLE DOCS'],
    pattern:     'pipeline',
    workflowImage: '/workflows/jobs-scraper-workflow.png',
    problem:     'Applying to jobs requires manually rewriting your resume for every listing — a repetitive, time-consuming process that most people skip, sending the same generic CV everywhere.',
    solution:    'Send a job search query in Slack and the pipeline handles the rest. It scrapes live listings, loops through each one, pulls your master resume from Google Docs, and prompts OpenRouter AI to rewrite the relevant sections to match that specific job. Each tailored version is saved as a new Google Doc and a Gmail draft is pre-written if an email address is found.',
    result:      'One Slack command produces a batch of job-matched, AI-tailored resumes — each as a polished Google Doc with a Gmail draft ready to send. Zero manual rewriting.',
    pipeline: [
      { num: '01', integration: 'SLACK -> TRIGGER',       title: 'Job Search Command',  desc: 'User sends a job title or keyword directly in Slack. AI validates the query before anything fires.' },
      { num: '02', integration: 'N8N -> HTTP REQUEST',    title: 'Live Job Scrape',     desc: 'Hits JSearch API with the validated query. Returns real-time listings from major job boards.' },
      { num: '03', integration: 'N8N -> LOOP',            title: 'Per-Job Processing',  desc: 'Splits the results and loops through each listing. Master resume fetched from Google Docs as the base.' },
      { num: '04', integration: 'OPENROUTER -> AI MODEL', title: 'Resume Tailoring',    desc: 'OpenRouter AI rewrites your resume to match each job description. Structured Output Parser enforces clean JSON.' },
      { num: '05', integration: 'GOOGLE DRIVE -> DOCS',   title: 'Resume Generation',   desc: 'Copies the template, injects AI-tailored content. One polished, job-specific Google Doc per listing.' },
      { num: '06', integration: 'GMAIL + SLACK',          title: 'Application Ready',   desc: 'Gmail draft created when an email is found. Full job details posted to your Slack jobs channel.' },
    ],
  },
  {
    name:        'WebSecScan: AI Security Auditor',
    type:        'n8n Automation',
    description: 'Automated website security audit pipeline. Submit a URL, get a full AI-analyzed threat report — SSL, headers, vulnerabilities, and actionable fixes — delivered straight to your inbox.',
    stack:       ['n8n', 'Groq API', 'HTTP Request', 'OWASP Checks', 'Gmail'],
    metrics:     [{ value: 'AI', label: 'Risk Analysis' }, { value: '5', label: 'Audit Stages' }],
    accent:      '#EF4444',
    category:    'n8n',
    keywords:    ['websecsan', 'websec scan', 'security audit', 'website security', 'security scanner', 'ai security', 'vulnerability scan', 'groq security'],
    pills:       ['N8N', 'GROQ API', 'SECURITY'],
    pattern:     'pipeline',
    workflowImage: '/workflows/websecscan-workflow.png',
    problem:     'Website owners have no quick way to assess their security posture — manual checks across SSL tools, header scanners, and vulnerability databases take hours and require technical expertise.',
    solution:    'Submit a URL and the workflow runs automated security checks across SSL, HTTP headers, and known vulnerability patterns. Groq AI analyzes every finding, assigns risk levels, and writes plain-English remediation steps. A formatted report lands in your inbox within minutes.',
    result:      'Full security audit — findings, risk scores, and fix instructions — delivered automatically. No consultant fees, no tool-hopping, no technical knowledge required.',
    pipeline: [
      { num: '01', integration: 'N8N -> WEBHOOK',      title: 'URL Submission',        desc: 'Receives the target website URL via webhook or form trigger. Validates and queues the scan.' },
      { num: '02', integration: 'N8N -> HTTP REQUEST',  title: 'Deep Security Analysis', desc: 'Runs automated checks: SSL certificate validity, HTTP security headers, open ports, and known CVE patterns.' },
      { num: '03', integration: 'N8N -> CLAUDE API',   title: 'AI Risk Assessment',     desc: 'Claude analyzes all findings, assigns severity levels, and generates plain-English remediation steps for each issue.' },
      { num: '04', integration: 'N8N -> CODE',         title: 'Report Formatting',      desc: 'Structures findings into a clean, scannable security report with executive summary and prioritized action items.' },
      { num: '05', integration: 'N8N -> GMAIL',        title: 'Report Delivery',        desc: 'Sends the completed audit report to the specified recipient. Ready to share with clients or dev teams.' },
    ],
  },
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
    solution:    "Every morning at 7AM, your Google Alerts feed gets scanned automatically. Each mention is analyzed for sentiment, a draft reply written in your voice, and queued in Gmail for your approval. Your team gets a full briefing before the workday starts — zero manual searching.",
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
    name:        'LeadPulse: AI Qualifier',
    type:        'CRM Automation Pipeline',
    description: 'Gmail-triggered workflow that scores inbound leads with Groq AI and routes them to Airtable with Telegram alerts for hot leads.',
    stack:       ['n8n', 'Groq API', 'Gmail', 'Airtable', 'Telegram'],
    metrics:     [{ value: '0', label: 'Manual Review' }, { value: 'AI', label: 'Lead Scoring' }],
    accent:      '#EA4B71',
    category:    'n8n',
    keywords:    ['leadpulse', 'lead qualifier', 'lead scoring', 'n8n lead', 'groq', 'email automation', 'lead pulse'],
    pills:       ['N8N', 'GROQ AI', 'GMAIL'],
    pattern:     'branch',
    workflowImage: '/workflows/n8n-lead-qualifier-workflow.png',
    problem:     'Inbound leads arriving via email were being reviewed manually — no scoring, no prioritization, and hot leads were sitting unanswered for hours or getting lost entirely.',
    solution:    'Every inbound email gets scored the moment it lands. Hot leads trigger an instant Telegram alert so you respond first — cold leads get quietly logged without wasting your attention. Your inbox becomes a prioritized pipeline, not a to-do list.',
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
    solution:    'Six specialized AI agents run your store in parallel — researching products, vetting suppliers, writing ad creative, tracking analytics, managing operations, and handling customer messages. Every action that touches money requires your Telegram approval before it fires.',
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
    solution:    'Three live data sources — CJDropshipping, Meta Ads Library, and Google Trends — feed into one unified dashboard in real time. Spot winning products, validate trends, and compare options without switching between tabs or working with stale screenshots.',
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
    solution:    'Upload a recipe or describe your dish — Claude Vision reads the ingredients and calculates your cost, margin, and suggested price in seconds. No spreadsheets, no manual entry. Pro users get AI analysis across their full menu.',
    result:      'Two-tier product live with automated licensing. AI analysis replaces manual costing — margin calculations in seconds, not hours.',
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
