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
export type ProjectCategory = 'Lead & Sales' | 'Marketing & Content' | 'Operations' | 'Security' | 'SaaS'

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
  workflowImage?:  string
  workflowImage2?: string
}

export const ALL_PROJECTS: ProjectData[] = [
  {
    name:        'OnlyStamps',
    type:        'SaaS Product',
    description: 'Digital loyalty stamp card PWA for cafes - customers earn stamps via a server-signed QR code, track Bronze/Silver/Gold tier progress, and redeem rewards. Staff scan-and-award flow syncs instantly through Supabase Realtime.',
    stack:       ['Next.js 15', 'TypeScript', 'Supabase', 'Tailwind CSS', 'PWA'],
    metrics:     [{ value: '60s', label: 'QR Token TTL' }, { value: '3', label: 'Reward Tiers' }],
    accent:      '#0EA5E9',
    category:    'SaaS',
    keywords:    ['onlystamps', 'loyalty app', 'stamp card', 'loyalty pwa', 'cafe rewards', 'digital stamp card', 'loyalty program saas'],
    pills:       ['NEXT.JS 15', 'SUPABASE', 'PWA'],
    pattern:     'launch',
    workflowImage: '/workflows/OnlyStamps.png',
    problem:     'Paper loyalty cards get lost, can\'t be validated in real time, and give cafe owners no visibility into repeat customers or reward redemption.',
    solution:    'Customers open the PWA to display a server-signed QR code that rotates every 60 seconds. Staff scan it, the API validates the token and awards a stamp, and Supabase Realtime pushes the update straight to the customer\'s home screen with an instant fill animation. Tier progress (Bronze, Silver, Gold) and reward eligibility update automatically as stamps accrue.',
    result:      'A fully digital, tamper-resistant loyalty system - no physical cards, real-time stamp sync between staff and customer, and tier-gated rewards that run themselves.',
  },
  {
    name:        'UGC Ads Veo & Sora & Grok',
    type:        'n8n Automation',
    description: 'Scheduled pipeline that reads product briefs from Google Sheets, routes to four AI video models (Veo 3.1, Nano+Veo, Sora 2, Grok), generates AI video prompts via OpenRouter, and writes finished UGC-style 9:16 selfie video URLs back to the sheet automatically.',
    stack:       ['n8n', 'Veo 3.1', 'Sora 2', 'Grok', 'Google Sheets', 'OpenRouter', 'Kie.AI'],
    metrics:     [{ value: '4', label: 'AI Video Models' }, { value: '9:16', label: 'UGC Format' }],
    accent:      '#F59E0B',
    category:    'Marketing & Content',
    keywords:    ['ugc ads', 'ugc video', 'veo', 'sora', 'grok video', 'ai ugc', 'ai video ads', 'ugc automation', 'veo sora grok'],
    pills:       ['N8N', 'VEO 3.1', 'SORA 2'],
    pattern:     'branch',
    workflowImage: '/workflows/UGC Ads Veo & Sora & Grok.png',
    problem:     'Creating UGC-style video ads at scale requires briefing creators, waiting on deliveries, and iterating on content that still looks staged - a slow, expensive loop with inconsistent output.',
    solution:    'Fill a Google Sheet row with product name, photo URL, ICP, features, and preferred video model. A scheduled trigger picks it up, routes to the matching AI video branch (Veo 3.1, Nano+Veo 3.1, Sora 2, or Grok), generates a hyper-realistic selfie-style prompt via OpenRouter, fires the Kie.AI generation API, polls until complete, and writes the finished video URL back to the sheet. Four parallel pipelines, one workflow.',
    result:      'UGC-style 9:16 vertical videos generated automatically from a spreadsheet. Four AI video models running in parallel - pick the one that fits your budget and quality bar.',
    pipeline: [
      { num: '01', integration: 'GOOGLE SHEETS -> READ',    title: 'Product Brief Intake',    desc: 'Scheduled trigger reads rows from the UGC sheet - product name, photo, ICP, features, setting, and chosen model.' },
      { num: '02', integration: 'N8N -> SWITCH',            title: 'Route by AI Model',        desc: 'Switch node fans out to four branches: Veo 3.1 (direct), Nano+Veo (image-first), Sora 2, or Grok.' },
      { num: '03', integration: 'OPENROUTER -> PROMPT GEN', title: 'UGC Prompt Generation',    desc: 'OpenRouter AI writes a hyper-realistic selfie-style video prompt tailored to the ICP, product features, and chosen model.' },
      { num: '04', integration: 'KIE.AI -> GENERATE',       title: 'AI Video Generation',      desc: 'HTTP request fires the generation job to Kie.AI. Nano+Veo branch first generates a reference image via NanoBanana, then feeds it to Veo.' },
      { num: '05', integration: 'N8N -> POLL',              title: 'Async Status Check',       desc: 'Wait nodes poll the task status on interval until the video is ready.' },
      { num: '06', integration: 'GOOGLE SHEETS -> UPDATE',  title: 'Write Video URL',          desc: 'Finished video URL written back to the matching row. Status set to Finished.' },
    ],
  },
  {
    name:        'AbandonedCart Recovery System',
    type:        'n8n Automation',
    description: 'Two-workflow system: Capture & Sequence runs a 48hr 3-touch recovery (email x2 + WhatsApp) on every abandoned Shopify checkout. Order Suppressor fires in parallel on purchase - marks the row CONVERTED in real-time so no touch ever fires after the customer buys.',
    stack:       ['n8n', 'Shopify', 'Gmail', 'Twilio (WhatsApp)', 'Google Sheets'],
    metrics:     [{ value: '48hr', label: 'Recovery Window' }, { value: '0', label: 'Post-Purchase Sends' }],
    accent:      '#8B5CF6',
    category:    'Lead & Sales',
    keywords:    ['abandoned cart', 'cart recovery', 'shopify abandoned cart', 'cart sequence', 'abandonedcart capture', 'cart email sequence', 'whatsapp cart recovery', 'order suppressor', 'cart suppressor', 'conversion suppressor'],
    pills:       ['N8N', 'SHOPIFY', 'WHATSAPP'],
    pattern:     'pipeline',
    workflowImage:  '/workflows/AbandonedCart_CaptureAndSequence.png',
    workflowImage2: '/workflows/AbandonedCart_OrderSuppressor.png',
    problem:     'Abandoned checkouts go unrecovered at scale - and generic reminder blasts fire even after the customer already bought, burning trust and wasting sends.',
    solution:    'Two workflows run in parallel. Capture & Sequence: every abandoned checkout is logged as PENDING, then touched at 1hr (scarcity email), 24hr (brand story email), and 48hr (WhatsApp, opt-in gated) - re-checking status before each send. Order Suppressor: the moment an order is created, it extracts the checkout token and marks the sheet row CONVERTED, silently killing any pending touches.',
    result:      'Fully automated 48hr recovery across email and WhatsApp. Conversion-aware in real-time - zero messages sent after purchase.',
    pipeline: [
      { num: '01', integration: 'SHOPIFY -> WEBHOOK',    title: 'Checkout Captured',      desc: 'Fires on checkout/create. Extracts email, name, item, checkout URL, and WhatsApp opt-in flag.' },
      { num: '02', integration: 'GOOGLE SHEETS -> LOG',  title: 'Log as PENDING',         desc: 'Appends a row to the AbandonedCart sheet with status PENDING.' },
      { num: '03', integration: 'GMAIL -> 1HR EMAIL',    title: 'Touch 1: Scarcity',      desc: 'After 1hr, re-reads status. PENDING sends scarcity email. CONVERTED exits silently.' },
      { num: '04', integration: 'GMAIL -> 24HR EMAIL',   title: 'Touch 2: Brand Story',   desc: 'After 24hr, re-reads status. PENDING sends brand story + social proof email.' },
      { num: '05', integration: 'TWILIO -> WHATSAPP',    title: 'Touch 3: WhatsApp',      desc: 'After 48hr, checks opt-in flag. Sends WhatsApp if opted in. Marks row EXPIRED.' },
      { num: '06', integration: 'SHOPIFY -> ORDER',      title: 'Order Suppressor',       desc: 'Parallel workflow. On orders/create, extracts checkout_token and marks the sheet row CONVERTED - stops any pending touch from firing.' },
    ],
  },
  {
    name:        'Automated Invoice Data Entry',
    type:        'n8n Automation',
    description: 'Google Drive-triggered pipeline that watches a folder for new invoices (PDF, JPEG, PNG), routes by file type, uses Groq Vision AI (llama-4-scout) to extract 6 structured fields, validates the data, appends clean records to Google Sheets, and archives every file automatically.',
    stack:       ['n8n', 'Google Drive', 'Groq Vision', 'Google Sheets'],
    metrics:     [{ value: '3', label: 'File Types' }, { value: '6', label: 'Fields Extracted' }],
    accent:      '#10B981',
    category:    'Operations',
    keywords:    ['invoice data entry', 'invoice automation', 'groq vision', 'invoice extraction', 'pdf invoice', 'automated invoice', 'invoice google sheets', 'invoice ocr'],
    pills:       ['N8N', 'GROQ VISION', 'GOOGLE SHEETS'],
    pattern:     'branch',
    workflowImage: '/workflows/invoice-data-entry-workflow.png',
    problem:     'Finance teams waste hours re-keying invoice data from PDFs and images into spreadsheets - a manual process prone to typos, missed entries, and no audit trail.',
    solution:    'Drop any invoice into a monitored Google Drive folder. The pipeline polls every minute, inspects the file type (PDF, JPEG, PNG proceed - unsupported types like Word or CSV auto-reject), downloads it, and encodes it for Groq Vision AI. The llama-4-scout model extracts 6 structured fields as JSON. A validate step checks all required fields are present and normalizes total_amount to a number. Valid records append to the main Invoices Google Sheet; failures with error details go to a separate Error sheet. Every file moves to /Processed or /Rejected automatically.',
    result:      'Zero manual data entry. Invoices processed automatically - clean records in Google Sheets, a full error log for parse failures, and every file archived. Finance team never touches the folder.',
    pipeline: [
      { num: '01', integration: 'GOOGLE DRIVE -> WATCH',  title: 'Watch Folder',         desc: 'Polls a Google Drive folder every 1 minute for new files. Outputs mimeType metadata for routing.' },
      { num: '02', integration: 'N8N -> SWITCH',          title: 'Route by File Type',   desc: 'PDF, JPEG, PNG proceed to AI extraction. All other types (Word, CSV, etc.) route directly to /Rejected.' },
      { num: '03', integration: 'GROQ VISION -> EXTRACT', title: 'AI Field Extraction',  desc: 'Downloads file, builds Groq API payload with base64 encoding. llama-4-scout extracts 6 invoice fields as structured JSON.' },
      { num: '04', integration: 'N8N -> VALIDATE',        title: 'Parse + Validate',     desc: 'Strips markdown fences, parses JSON. Validates all required fields present. Normalizes total_amount. Sets isValid flag.' },
      { num: '05', integration: 'GOOGLE SHEETS -> DRIVE', title: 'Log + Archive',        desc: 'Valid records append to Invoices sheet; invalid to Error sheet. Source file moved to /Processed or /Rejected.' },
    ],
  },
  {
    name:        'Dropshipping AI Content Hub',
    type:        'n8n Automation',
    description: 'Form-triggered workflow with five AI content branches - product research, SEO descriptions, platform ad copy, customer support replies, and 30-day sales analysis. Ollama runs the local LLM; results land in an Airtable Content Review Queue in 1-2 minutes.',
    stack:       ['n8n', 'Ollama (Local LLM)', 'Shopify', 'Airtable'],
    metrics:     [{ value: '5', label: 'Content Branches' }, { value: 'Local', label: 'Ollama LLM' }],
    accent:      '#06B6D4',
    category:    'Marketing & Content',
    keywords:    ['dropshipping ai content', 'content hub', 'dropshipping content', 'ollama workflow', 'shopify content automation', 'ai product description', 'ai ad copy', 'ai content hub', 'dropshipping ai', 'content automation'],
    pills:       ['N8N', 'OLLAMA', 'AIRTABLE'],
    pattern:     'branch',
    workflowImage: '/workflows/Dropshipping AI Content Hub.png',
    problem:     'Running a dropshipping store means constantly producing product descriptions, ad copy, customer replies, and sales analysis - across multiple tools, manually, with no consistent output and no review queue.',
    solution:    'One form. Five AI branches. Select a task type - Research, Description, Ad Copy, Support, or Analysis - and fill in your context. The workflow routes to the right branch, optionally pulls live product or order data from Shopify, builds a structured prompt, and sends it to Ollama (local LLM, no cloud costs). Ad Copy produces three platform-ready variants (Facebook, Instagram, Google). All output lands in Airtable marked Pending Review.',
    result:      'Five content pipelines in one workflow. From form submit to Airtable in 1-2 minutes. Zero cloud AI costs - fully local via Ollama.',
    pipeline: [
      { num: '01', integration: 'N8N -> FORM TRIGGER',   title: 'Content Request',         desc: 'User selects Task Type (Research / Description / Ad Copy / Support / Analysis) and fills in context. Optional Shopify Product ID for live data.' },
      { num: '02', integration: 'N8N -> SWITCH',          title: 'Route by Task Type',      desc: 'Switch node fans out to one of five dedicated branches based on the selected task type.' },
      { num: '03', integration: 'SHOPIFY -> FETCH',       title: 'Live Product/Order Data', desc: 'Description, Ad Copy, and Analysis branches optionally fetch live product details or 30-day order history from Shopify Admin API.' },
      { num: '04', integration: 'N8N -> CODE NODE',       title: 'Prompt Assembly',         desc: 'Combines form input with Shopify data into a role-specific structured prompt tailored to each content type.' },
      { num: '05', integration: 'OLLAMA -> LOCAL LLM',    title: 'AI Content Generation',   desc: 'HTTP request to local Ollama instance. Model generates research, descriptions, ad variants, support replies, or sales insights.' },
      { num: '06', integration: 'AIRTABLE -> SAVE',       title: 'Queue for Review',        desc: 'Output formatted and saved to Airtable Content Review Queue with Task Type, AI Output, Status (Pending Review), and Error Flag.' },
    ],
  },
  {
    name:        'WebSecScan: AI Security Auditor',
    type:        'n8n Automation',
    description: 'Form-triggered security audit that runs two parallel Groq AI agents - one checking headers and security configurations, another scanning for XSS, CSRF, and client-side vulnerabilities. Results merged, graded A-F, and delivered as a professional HTML email report.',
    stack:       ['n8n', 'Groq API', 'Gmail', 'Form Trigger'],
    metrics:     [{ value: '2', label: 'Parallel Agents' }, { value: 'A-F', label: 'Security Grade' }],
    accent:      '#EF4444',
    category:    'Security',
    keywords:    ['websecsan', 'websec scan', 'security audit', 'website security', 'security scanner', 'ai security', 'vulnerability scan', 'groq security', 'xss scan', 'csrf audit'],
    pills:       ['N8N', 'GROQ API', 'GMAIL'],
    pattern:     'pipeline',
    workflowImage: '/workflows/websecscan-workflow.png',
    problem:     'Website owners have no quick way to assess their security posture - manual checks across SSL tools, header scanners, and vulnerability databases take hours and require real technical expertise.',
    solution:    'Submit any URL via a deployment form. The pipeline scrapes the site and fans out to two Groq llama-3.3-70b agents running in parallel: one audits HTTP headers, cookies, and security configurations; the other scans HTML and JavaScript for client-side vulnerabilities including XSS, CSRF, and information disclosure. Both outputs merge, findings are analyzed to assign an A-F security grade, and a professional HTML email with color-coded sections and a mobile-friendly layout lands in your inbox.',
    result:      'Full two-agent security audit - header config, client-side vulnerabilities, grade, critical count, and fix steps - delivered as a professional HTML report. No tools to run, no expertise required.',
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
    description: 'Slack-triggered SEO audit with an Airtable cache layer - fires a single synchronous call to RapidAPI\'s SEO Analyzer, passes results to Groq AI to build a structured markdown report, creates a Google Drive file, and notifies Slack. No polling, no waiting.',
    stack:       ['n8n', 'Slack', 'RapidAPI', 'Groq AI', 'Airtable', 'Google Drive'],
    metrics:     [{ value: 'Sync', label: 'Single API Call' }, { value: 'Cached', label: 'Airtable Layer' }],
    accent:      '#F97316',
    category:    'Marketing & Content',
    keywords:    ['seo site audit', 'seo audit', 'rapidapi seo', 'site audit', 'seo slack', 'seo automation', 'on-page audit', 'seo pipeline', 'groq seo', 'seo analyzer'],
    pills:       ['N8N', 'RAPIDAPI', 'GROQ AI'],
    pattern:     'pipeline',
    workflowImage: '/workflows/SEO Site Audit.png',
    problem:     'Running SEO audits manually means switching between tools, repeating the same pull for domains already checked recently, and waiting on slow async API crawls - wasting time and API credits.',
    solution:    'Send /seo-audit + domain in Slack. The pipeline validates input, checks an Airtable cache first - cache hit returns instantly with zero API spend. On a miss, it fires a single synchronous GET to RapidAPI\'s Website SEO Analyzer (score, title/description/H1 checks, warnings - one call, no polling). Groq AI builds a structured markdown report from the raw data, which is saved to Google Drive, written back to Airtable cache, and delivered via Slack notification.',
    result:      'Full SEO audit from Slack command to Google Drive report in seconds. Cached domains return instantly. Every error state alerts Slack with a run log entry.',
    pipeline: [
      { num: '01', integration: 'SLACK -> TRIGGER',      title: 'Audit Request',      desc: 'User sends /seo-audit + domain in Slack. Input validated - invalid domains error before firing.' },
      { num: '02', integration: 'AIRTABLE -> CACHE',     title: 'Cache Check',        desc: 'Queries Airtable SEO_Cache. Cache hit returns the existing report instantly - zero API spend.' },
      { num: '03', integration: 'RAPIDAPI -> SEO',       title: 'SEO Analysis',       desc: 'Single synchronous GET to RapidAPI Website SEO Analyzer. Returns score, title/description/H1 checks, and warnings in one call.' },
      { num: '04', integration: 'GROQ AI -> REPORT',     title: 'AI Report Build',    desc: 'Groq AI transforms raw API data into a structured, readable markdown audit report. Result cached back to Airtable.' },
      { num: '05', integration: 'GOOGLE DRIVE -> SLACK', title: 'Report & Notify',    desc: 'Creates a Google Drive file with the formatted report. Writes run log. Slack success notification sent.' },
    ],
  },
  {
    name:        'LeadPulse: AI Jobs Qualifier',
    type:        'CRM Automation Pipeline',
    description: 'Gmail-triggered workflow that scores inbound leads with Groq AI and routes them to Airtable with Telegram alerts for hot leads.',
    stack:       ['n8n', 'Groq API', 'Gmail', 'Airtable', 'Telegram'],
    metrics:     [{ value: '0', label: 'Manual Review' }, { value: 'AI', label: 'Lead Scoring' }],
    accent:      '#EA4B71',
    category:    'Lead & Sales',
    keywords:    ['leadpulse', 'lead qualifier', 'lead scoring', 'n8n lead', 'groq', 'email automation', 'lead pulse'],
    pills:       ['N8N', 'GROQ AI', 'GMAIL'],
    pattern:     'branch',
    workflowImage: '/workflows/n8n-lead-qualifier-workflow.png',
    problem:     'Inbound leads arriving via email were being reviewed manually - no scoring, no prioritization, and hot leads were sitting unanswered for hours or getting lost entirely.',
    solution:    'Every inbound email gets scored the moment it lands. Hot leads trigger an instant Telegram alert so you respond first - cold leads get quietly logged without wasting your attention. Your inbox becomes a prioritized pipeline, not a to-do list.',
    result:      'Every inbound lead scored and routed in seconds. Hot leads get a Telegram alert before the email client even refreshes - zero manual triage required.',
  },
  {
    name:        'AI Jobs Scraper + Resume Optimizer',
    type:        'n8n Automation',
    description: 'Slack-triggered pipeline that scrapes live job listings then uses OpenRouter AI to tailor your resume to each job description - producing a ready-to-send Google Doc and Gmail draft per application, automatically.',
    stack:       ['n8n', 'Slack', 'OpenRouter', 'Google Docs', 'Google Drive', 'Gmail', 'JSearch API'],
    metrics:     [{ value: '1', label: 'Slack Command' }, { value: 'AI', label: 'Per-Job Resume' }],
    accent:      '#6366F1',
    category:    'Operations',
    keywords:    ['jobs scraper', 'resume optimizer', 'ai jobs', 'resume tailor', 'job search automation', 'slack jobs', 'openrouter resume', 'jobs scraper resume'],
    pills:       ['N8N', 'OPENROUTER', 'GOOGLE DOCS'],
    pattern:     'pipeline',
    workflowImage: '/workflows/jobs-scraper-workflow.png',
    problem:     'Applying to jobs requires manually rewriting your resume for every listing - a repetitive, time-consuming process that most people skip, sending the same generic CV everywhere.',
    solution:    'Send a job search query in Slack and the pipeline handles the rest. It scrapes live listings, loops through each one, pulls your master resume from Google Docs, and prompts OpenRouter AI to rewrite the relevant sections to match that specific job. Each tailored version is saved as a new Google Doc and a Gmail draft is pre-written if an email address is found.',
    result:      'One Slack command produces a batch of job-matched, AI-tailored resumes - each as a polished Google Doc with a Gmail draft ready to send. Zero manual rewriting.',
    pipeline: [
      { num: '01', integration: 'SLACK -> TRIGGER',       title: 'Job Search Command',  desc: 'User sends a job title or keyword directly in Slack. AI validates the query before anything fires.' },
      { num: '02', integration: 'N8N -> HTTP REQUEST',    title: 'Live Job Scrape',     desc: 'Hits JSearch API with the validated query. Returns real-time listings from major job boards.' },
      { num: '03', integration: 'N8N -> LOOP',            title: 'Per-Job Processing',  desc: 'Splits the results and loops through each listing. Master resume fetched from Google Docs as the base.' },
      { num: '04', integration: 'OPENROUTER -> AI MODEL', title: 'Resume Tailoring',    desc: 'OpenRouter AI rewrites your resume to match each job description. Structured Output Parser enforces clean JSON.' },
      { num: '05', integration: 'GOOGLE DRIVE -> DOCS',   title: 'Resume Generation',   desc: 'Copies the template, injects AI-tailored content. One polished, job-specific Google Doc per listing.' },
      { num: '06', integration: 'GMAIL + SLACK',          title: 'Application Ready',   desc: 'Gmail draft created when an email is found. Full job details posted to your Slack jobs channel.' },
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
