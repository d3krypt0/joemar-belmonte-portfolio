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
    name:        'WebSecScan: AI Security Auditor',
    type:        'n8n Automation',
    description: 'Form-triggered security audit that runs two parallel Groq AI agents — one checking headers and security configurations, another scanning for XSS, CSRF, and client-side vulnerabilities. Results merged, graded A-F, and delivered as a professional HTML email report.',
    stack:       ['n8n', 'Groq API', 'Gmail', 'Form Trigger'],
    metrics:     [{ value: '2', label: 'Parallel Agents' }, { value: 'A-F', label: 'Security Grade' }],
    accent:      '#EF4444',
    category:    'n8n',
    keywords:    ['websecsan', 'websec scan', 'security audit', 'website security', 'security scanner', 'ai security', 'vulnerability scan', 'groq security', 'xss scan', 'csrf audit'],
    pills:       ['N8N', 'GROQ API', 'GMAIL'],
    pattern:     'pipeline',
    workflowImage: '/workflows/websecscan-workflow.png',
    problem:     'Website owners have no quick way to assess their security posture — manual checks across SSL tools, header scanners, and vulnerability databases take hours and require real technical expertise.',
    solution:    'Submit any URL via a deployment form. The pipeline scrapes the site and fans out to two Groq llama-3.3-70b agents running in parallel: one audits HTTP headers, cookies, and security configurations; the other scans HTML and JavaScript for client-side vulnerabilities including XSS, CSRF, and information disclosure. Both outputs merge, findings are analyzed to assign an A-F security grade, and a professional HTML email with color-coded sections and a mobile-friendly layout lands in your inbox.',
    result:      'Full two-agent security audit — header config, client-side vulnerabilities, grade, critical count, and fix steps — delivered as a professional HTML report. No tools to run, no expertise required.',
    pipeline: [
      { num: '01', integration: 'N8N -> FORM TRIGGER',    title: 'URL Submission',        desc: 'User accesses the deployment form, enters a website URL and email. Triggers the full audit pipeline.' },
      { num: '02', integration: 'N8N -> HTTP REQUEST',    title: 'Website Scrape',        desc: 'Scrapes the target to extract HTTP headers, HTML content, and JavaScript files for both agents.' },
      { num: '03', integration: 'GROQ -> PARALLEL',       title: 'Dual Agent Analysis',   desc: 'Two Groq llama-3.3-70b agents run simultaneously. Agent 1: headers, cookies, security configs. Agent 2: XSS, CSRF, info disclosure in HTML/JS.' },
      { num: '04', integration: 'N8N -> MERGE + GRADE',   title: 'Results & Grading',     desc: 'Merges both agent outputs. Counts critical issues and warnings. Assigns A-F security grade. Generates timestamp.' },
      { num: '05', integration: 'GMAIL -> SEND',          title: 'HTML Report Delivery',  desc: 'Formats a color-coded, mobile-friendly HTML email with the grade indicator and prioritized fix steps. Sent via Gmail OAuth.' },
    ],
  },
  {
    name:        'SEO Site Audit',
    type:        'n8n Automation',
    description: 'Slack-triggered SEO audit with an Airtable cache layer — fires a single synchronous call to RapidAPI\'s SEO Analyzer, passes results to Groq AI to build a structured markdown report, creates a Google Drive file, and notifies Slack. No polling, no waiting.',
    stack:       ['n8n', 'Slack', 'RapidAPI', 'Groq AI', 'Airtable', 'Google Drive'],
    metrics:     [{ value: 'Sync', label: 'Single API Call' }, { value: 'Cached', label: 'Airtable Layer' }],
    accent:      '#F97316',
    category:    'n8n',
    keywords:    ['seo site audit', 'seo audit', 'rapidapi seo', 'site audit', 'seo slack', 'seo automation', 'on-page audit', 'seo pipeline', 'groq seo', 'seo analyzer'],
    pills:       ['N8N', 'RAPIDAPI', 'GROQ AI'],
    pattern:     'pipeline',
    workflowImage: '/workflows/SEO Site Audit.png',
    problem:     'Running SEO audits manually means switching between tools, repeating the same pull for domains already checked recently, and waiting on slow async API crawls — wasting time and API credits.',
    solution:    'Send /seo-audit + domain in Slack. The pipeline validates input, checks an Airtable cache first — cache hit returns instantly with zero API spend. On a miss, it fires a single synchronous GET to RapidAPI\'s Website SEO Analyzer (score, title/description/H1 checks, warnings — one call, no polling). Groq AI builds a structured markdown report from the raw data, which is saved to Google Drive, written back to Airtable cache, and delivered via Slack notification.',
    result:      'Full SEO audit from Slack command to Google Drive report in seconds. Cached domains return instantly. Every error state alerts Slack with a run log entry.',
    pipeline: [
      { num: '01', integration: 'SLACK -> TRIGGER',      title: 'Audit Request',      desc: 'User sends /seo-audit + domain in Slack. Input validated — invalid domains error before firing.' },
      { num: '02', integration: 'AIRTABLE -> CACHE',     title: 'Cache Check',        desc: 'Queries Airtable SEO_Cache. Cache hit returns the existing report instantly — zero API spend.' },
      { num: '03', integration: 'RAPIDAPI -> SEO',       title: 'SEO Analysis',       desc: 'Single synchronous GET to RapidAPI Website SEO Analyzer. Returns score, title/description/H1 checks, and warnings in one call.' },
      { num: '04', integration: 'GROQ AI -> REPORT',     title: 'AI Report Build',    desc: 'Groq AI transforms raw API data into a structured, readable markdown audit report. Result cached back to Airtable.' },
      { num: '05', integration: 'GOOGLE DRIVE -> SLACK', title: 'Report & Notify',    desc: 'Creates a Google Drive file with the formatted report. Writes run log. Slack success notification sent.' },
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
    name:        'Automated Invoice Data Entry',
    type:        'n8n Automation',
    description: 'Google Drive-triggered pipeline that watches a folder for new invoices (PDF, JPEG, PNG), routes by file type, uses Groq Vision AI (llama-4-scout) to extract 6 structured fields, validates the data, appends clean records to Google Sheets, and archives every file automatically.',
    stack:       ['n8n', 'Google Drive', 'Groq Vision', 'Google Sheets'],
    metrics:     [{ value: '3', label: 'File Types' }, { value: '6', label: 'Fields Extracted' }],
    accent:      '#10B981',
    category:    'n8n',
    keywords:    ['invoice data entry', 'invoice automation', 'groq vision', 'invoice extraction', 'pdf invoice', 'automated invoice', 'invoice google sheets', 'invoice ocr'],
    pills:       ['N8N', 'GROQ VISION', 'GOOGLE SHEETS'],
    pattern:     'branch',
    workflowImage: '/workflows/invoice-data-entry-workflow.png',
    problem:     'Finance teams waste hours re-keying invoice data from PDFs and images into spreadsheets — a manual process prone to typos, missed entries, and no audit trail.',
    solution:    'Drop any invoice into a monitored Google Drive folder. The pipeline polls every minute, inspects the file type (PDF, JPEG, PNG proceed — unsupported types like Word or CSV auto-reject), downloads it, and encodes it for Groq Vision AI. The llama-4-scout model extracts 6 structured fields as JSON. A validate step checks all required fields are present and normalizes total_amount to a number. Valid records append to the main Invoices Google Sheet; failures with error details go to a separate Error sheet. Every file moves to /Processed or /Rejected automatically.',
    result:      'Zero manual data entry. Invoices processed automatically — clean records in Google Sheets, a full error log for parse failures, and every file archived. Finance team never touches the folder.',
    pipeline: [
      { num: '01', integration: 'GOOGLE DRIVE -> WATCH',  title: 'Watch Folder',         desc: 'Polls a Google Drive folder every 1 minute for new files. Outputs mimeType metadata for routing.' },
      { num: '02', integration: 'N8N -> SWITCH',          title: 'Route by File Type',   desc: 'PDF, JPEG, PNG proceed to AI extraction. All other types (Word, CSV, etc.) route directly to /Rejected.' },
      { num: '03', integration: 'GROQ VISION -> EXTRACT', title: 'AI Field Extraction',  desc: 'Downloads file, builds Groq API payload with base64 encoding. llama-4-scout extracts 6 invoice fields as structured JSON.' },
      { num: '04', integration: 'N8N -> VALIDATE',        title: 'Parse + Validate',     desc: 'Strips markdown fences, parses JSON. Validates all required fields present. Normalizes total_amount. Sets isValid flag.' },
      { num: '05', integration: 'GOOGLE SHEETS -> DRIVE', title: 'Log + Archive',        desc: 'Valid records append to Invoices sheet; invalid to Error sheet. Source file moved to /Processed or /Rejected.' },
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
