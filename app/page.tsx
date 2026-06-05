'use client'

import { useChat } from 'ai/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUp, ArrowLeft, Loader2, Sun, Moon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Message } from 'ai'
import StaticSection from '@/components/StaticSection'
import { detectProjectsInText, type ProjectData } from '@/lib/projects'

/* ─── Types ───────────────────────────────────────────────── */
type AvatarState = 'idle' | 'thinking' | 'replying'
type Theme       = 'dark' | 'light'

/* ─── Static data ─────────────────────────────────────────── */
const WELCOME_CHIPS = [
  { text: "I'm wasting hours on manual tasks — where do I start?", icon: '⚡' },
  { text: 'What would you automate in my business?',               icon: '🤖' },
  { text: 'Show me a project similar to my industry',              icon: '📂' },
  { text: 'Are you available for new projects?',                   icon: '📅' },
]

const CHAT_CHIPS = [
  'How much does a project cost?',
  'How long does it take?',
  'Can you connect my existing tools?',
  'Book a free strategy call',
]

/* ─── Page ────────────────────────────────────────────────── */
export default function HomePage() {
  const [hasStarted, setHasStarted]   = useState(false)
  const [avatarState, setAvatarState] = useState<AvatarState>('idle')
  const [theme, setTheme]             = useState<Theme>('dark')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef    = useRef<HTMLTextAreaElement>(null)

  const { messages, input, handleInputChange, handleSubmit,
          isLoading, append, setMessages } = useChat({
    api: '/api/chat',
    onResponse: ()  => setAvatarState('replying'),
    onFinish:   ()  => setTimeout(() => setAvatarState('idle'), 900),
    onError:    ()  => setAvatarState('idle'),
  })

  useEffect(() => {
    if (messages.length > 0 && !hasStarted) setHasStarted(true)
  }, [messages.length, hasStarted])

  useEffect(() => {
    if (isLoading) setAvatarState('thinking')
  }, [isLoading])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleChipClick = useCallback(
    (text: string) => append({ role: 'user', content: text }),
    [append],
  )

  const handleBack = useCallback(() => {
    setMessages([])
    setHasStarted(false)
    setAvatarState('idle')
  }, [setMessages])

  const toggleTheme = useCallback(
    () => setTheme(t => (t === 'dark' ? 'light' : 'dark')),
    [],
  )

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleInputChange(e)
      const el = e.target
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 180)}px`
    },
    [handleInputChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (input.trim() && !isLoading) {
          handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
          if (textareaRef.current) textareaRef.current.style.height = 'auto'
        }
      }
    },
    [input, isLoading, handleSubmit],
  )

  const onFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return
      handleSubmit(e)
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
    },
    [input, isLoading, handleSubmit],
  )

  return (
    <div
      data-theme={theme}
      className="bg-bg text-text"
      style={{ position: 'relative', overflowX: 'hidden' }}
    >
      {/* Grid texture */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid-color) 1px, transparent 1px),' +
            'linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          zIndex: 0,
        }}
      />

      {/* Film grain */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '200px 200px',
          zIndex: 0,
        }}
      />

      {/* Theme toggle on welcome screen only */}
      {!hasStarted && (
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      )}

      {/* ── Chat section: sticky, always takes first viewport ── */}
      <div
        className="sticky top-0 h-[100dvh] relative"
        style={{ zIndex: 10 }}
      >
        <AnimatePresence mode="wait">
          {!hasStarted ? (
            <WelcomeView
              key="welcome"
              avatarState={avatarState}
              input={input}
              isLoading={isLoading}
              textareaRef={textareaRef}
              onChipClick={handleChipClick}
              onChange={handleTextareaChange}
              onSubmit={onFormSubmit}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <ChatView
              key="chat"
              avatarState={avatarState}
              messages={messages}
              input={input}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
              textareaRef={textareaRef}
              onChange={handleTextareaChange}
              onSubmit={onFormSubmit}
              onKeyDown={handleKeyDown}
              onBack={handleBack}
              onChipClick={handleChipClick}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          )}
        </AnimatePresence>

        {/* Scroll indicator — points to static section below */}
        <ScrollIndicator targetId="portfolio" />
      </div>

      {/* ── Static portfolio section ───────────────────────── */}
      <div id="portfolio" className="relative" style={{ zIndex: 1 }}>
        <StaticSection />
      </div>
    </div>
  )
}

/* ─── Scroll indicator ────────────────────────────────────── */
function ScrollIndicator({ targetId }: { targetId: string }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollTo}
      aria-label="Scroll to portfolio"
      className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-opacity hover:opacity-70"
      style={{ color: 'var(--color-muted)', opacity: 0.5, zIndex: 20 }}
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.2em]">Portfolio</span>
      <ChevronDown size={14} className="animate-bounce" />
    </button>
  )
}

/* ─── Theme toggle (shared) ───────────────────────────────── */
function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="theme-btn"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex' }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

/* ─── Profile photo ───────────────────────────────────────── */
function ProfilePhoto({ state = 'idle', size = 160 }: { state?: AvatarState; size?: number }) {
  const inner = size - 10

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--glow-color) 0%, transparent 68%)',
          transform:  'scale(1.5)',
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: '1px solid var(--color-accent)', opacity: 0.3 }}
        animate={{ opacity: [0.2, 0.55, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <AnimatePresence>
        {state === 'thinking' && (
          <motion.div
            key="arc"
            className="absolute pointer-events-none"
            style={{ inset: -3 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="48"
                stroke="var(--color-accent)"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="32 270"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="relative rounded-full overflow-hidden"
        style={{ width: inner, height: inner, border: '2px solid var(--color-accent)', opacity: 0.9 }}
        animate={{ scale: [1, 1.015, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/avatar.png"
          alt="Joemar Belmonte"
          fill
          sizes={`${inner}px`}
          className="object-cover object-top"
          priority
        />
      </motion.div>
      <AnimatePresence>
        {state !== 'thinking' && (
          <motion.div
            className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400"
            style={{ border: '2px solid var(--color-bg)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Scrollable chips row ────────────────────────────────── */
function ChipsScroller({ chips, onChipClick }: { chips: string[]; onChipClick: (t: string) => void }) {
  const trackRef             = useRef<HTMLDivElement>(null)
  const [canLeft,  setLeft]  = useState(false)
  const [canRight, setRight] = useState(false)

  const check = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setLeft(el.scrollLeft > 4)
    setRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    check()
    const el = trackRef.current
    el?.addEventListener('scroll', check, { passive: true })
    return () => el?.removeEventListener('scroll', check)
  }, [check])

  const scroll = (dir: 'left' | 'right') =>
    trackRef.current?.scrollBy({ left: dir === 'left' ? -180 : 180, behavior: 'smooth' })

  return (
    <div className="relative flex items-center gap-1">
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
        style={{
          background:    'var(--color-surface)',
          border:        '1px solid var(--color-border)',
          color:         'var(--color-muted)',
          opacity:       canLeft ? 1 : 0,
          pointerEvents: canLeft ? 'auto' : 'none',
        }}
      >
        <ChevronLeft size={13} />
      </button>
      <div ref={trackRef} className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1" onScroll={check}>
        {chips.map(text => (
          <button key={text} onClick={() => onChipClick(text)} className="chip-sm flex-shrink-0">
            {text}
          </button>
        ))}
      </div>
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
        style={{
          background:    'var(--color-surface)',
          border:        '1px solid var(--color-border)',
          color:         'var(--color-muted)',
          opacity:       canRight ? 1 : 0,
          pointerEvents: canRight ? 'auto' : 'none',
        }}
      >
        <ChevronRight size={13} />
      </button>
    </div>
  )
}

/* ─── Welcome screen ──────────────────────────────────────── */
interface WelcomeViewProps {
  avatarState: AvatarState
  input:       string
  isLoading:   boolean
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onChipClick: (text: string) => void
  onChange:    (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit:    (e: React.FormEvent<HTMLFormElement>) => void
  onKeyDown:   (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

function WelcomeView({ avatarState, input, isLoading, textareaRef,
                       onChipClick, onChange, onSubmit, onKeyDown }: WelcomeViewProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full overflow-y-auto px-5 py-14 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -28, transition: { duration: 0.25 } }}
    >
      <motion.div
        initial={{ scale: 0.72, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
      >
        <ProfilePhoto state={avatarState} size={168} />
      </motion.div>

      <motion.div
        className="text-center space-y-2"
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.14, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-display text-[2.6rem] sm:text-[3.2rem] font-bold tracking-tight leading-none">
          Hey, I&apos;m Joemar Belmonte{' '}
          <motion.span
            style={{ display: 'inline-block', originX: 0.7, originY: 0.7 }}
            animate={{ rotate: [0, 22, -12, 22, 0] }}
            transition={{ delay: 0.85, duration: 0.75 }}
          >
            👋
          </motion.span>
        </h1>
        <p className="font-mono text-muted text-[0.82rem] tracking-[0.2em] uppercase">
          AI Automation Specialist
          <span className="text-accent/40 mx-2.5">—</span>
          Philippines
        </p>
        <motion.p
          className="text-muted text-base sm:text-[1.05rem] leading-relaxed max-w-[26rem] mx-auto pt-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5 }}
        >
          I build AI workflows that eliminate repetitive work — from n8n pipelines and Make.com automations
          to custom AI agents that run 24/7. If it can be automated, I&apos;ll build it.
        </motion.p>
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-2 max-w-lg"
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.45 }}
      >
        {WELCOME_CHIPS.map((chip, i) => (
          <motion.button
            key={chip.text}
            onClick={() => onChipClick(chip.text)}
            className="chip"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.32 + i * 0.07 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <span role="img" aria-hidden="true">{chip.icon}</span>
            {chip.text}
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        className="w-full max-w-xl"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.44 }}
      >
        <InputForm
          input={input}
          isLoading={isLoading}
          textareaRef={textareaRef}
          onChange={onChange}
          onSubmit={onSubmit}
          onKeyDown={onKeyDown}
          autoFocus
        />
      </motion.div>

      <motion.p
        className="font-mono text-[11px] opacity-30 text-center"
        style={{ color: 'var(--color-muted)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.7 }}
      >
        Powered by Groq · Llama 3.3
      </motion.p>
    </motion.div>
  )
}

/* ─── Chat screen ─────────────────────────────────────────── */
interface ChatViewProps {
  avatarState:    AvatarState
  messages:       Message[]
  input:          string
  isLoading:      boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
  textareaRef:    React.RefObject<HTMLTextAreaElement>
  onChange:       (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit:       (e: React.FormEvent<HTMLFormElement>) => void
  onKeyDown:      (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onBack:         () => void
  onChipClick:    (text: string) => void
  theme:          Theme
  onToggleTheme:  () => void
}

function ChatView({ avatarState, messages, input, isLoading, messagesEndRef,
                    textareaRef, onChange, onSubmit, onKeyDown, onBack, onChipClick,
                    theme, onToggleTheme }: ChatViewProps) {
  const userMessageCount = messages.filter(m => m.role === 'user').length
  const showBookingCard  = userMessageCount >= 3

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 sm:px-5 py-2.5 sticky top-0 z-20"
        style={{
          borderBottom: '1px solid var(--color-border)',
          background:   'color-mix(in srgb, var(--color-bg) 82%, transparent)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <motion.button
          onClick={onBack}
          className="theme-btn flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          aria-label="Back to home"
        >
          <ArrowLeft size={15} />
        </motion.button>

        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
            style={{ border: '1.5px solid var(--color-accent)', opacity: 0.85 }}
          >
            <Image src="/avatar.png" alt="Joemar" width={36} height={36} className="object-cover object-top w-full h-full" />
          </div>
          <div className="flex flex-col leading-none gap-0.5 min-w-0">
            <span className="font-display font-semibold text-base truncate" style={{ color: 'var(--color-text)' }}>
              Joemar Belmonte
            </span>
            <span className="font-mono text-[11px] tracking-wider truncate" style={{ color: 'var(--color-muted)' }}>
              AI Automation Specialist
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          {isLoading ? (
            <span className="text-[12px] font-mono flex items-center gap-1.5" style={{ color: 'var(--color-accent)' }}>
              <Loader2 size={12} className="animate-spin" />
              thinking...
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[12px] font-mono" style={{ color: 'var(--color-muted)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse 2.5s ease-in-out infinite' }} />
              online
            </span>
          )}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-7 space-y-5">
          {messages.map(m => (
            <MessageRow key={m.id} message={m} />
          ))}
          {isLoading && <TypingBubble />}

          {/* Feature 1: Booking card after 3 user messages */}
          {showBookingCard && <BookingCard />}

          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      {/* Input area */}
      <div
        className="sticky bottom-0 px-4 sm:px-5 pb-4 pt-3"
        style={{
          borderTop:      '1px solid var(--color-border)',
          background:     'color-mix(in srgb, var(--color-bg) 90%, transparent)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-2xl mx-auto space-y-2.5">
          <ChipsScroller chips={CHAT_CHIPS} onChipClick={onChipClick} />
          <InputForm
            input={input}
            isLoading={isLoading}
            textareaRef={textareaRef}
            onChange={onChange}
            onSubmit={onSubmit}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Feature 1: Booking card ─────────────────────────────── */
function BookingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="rounded-xl overflow-hidden"
      style={{
        background:      '#060D14',
        border:          '1px solid #152330',
        borderLeft:      '3px solid #00C8FF',
      }}
    >
      <div className="p-4 sm:p-5">
        <h3 className="font-display font-semibold text-base" style={{ color: '#E8F4FF' }}>
          Ready to talk about your project?
        </h3>
        <p className="text-[13px] mt-1" style={{ color: '#5A7A96' }}>
          Book a free 30-min discovery call — no commitment.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <a
            href="https://calendly.com/joemarbelmonte-automation/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: '#00C8FF', color: '#060D14' }}
          >
            Book a Call →
          </a>
          <a
            href="mailto:joemarbelmonte.automation@gmail.com"
            className="text-[13px] transition-opacity hover:opacity-70"
            style={{ color: '#5A7A96' }}
          >
            or email joemarbelmonte.automation@gmail.com
          </a>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Feature 2: Project card in chat ─────────────────────── */
function ChatProjectCard({ project }: { project: ProjectData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1, ease: 'easeOut' }}
      className="rounded-xl mt-2"
      style={{
        background:  'var(--color-surface)',
        border:      '1px solid var(--color-border)',
        borderLeft:  `3px solid ${project.accent}`,
        maxWidth:    '480px',
      }}
    >
      <div className="p-4">
        <span
          className="font-mono text-[10px] uppercase tracking-widest block"
          style={{ color: 'var(--color-muted)' }}
        >
          {project.type}
        </span>
        <h3 className="font-display font-bold text-base mt-0.5 mb-2" style={{ color: 'var(--color-text)' }}>
          {project.name}
        </h3>
        <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--color-muted)' }}>
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
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
        <div className="flex gap-6 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
          {project.metrics.map(m => (
            <div key={m.label}>
              <div className="font-display font-bold text-xl" style={{ color: project.accent }}>{m.value}</div>
              <div className="text-[10px] font-mono uppercase tracking-wider mt-0.5" style={{ color: 'var(--color-muted)' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Input form ──────────────────────────────────────────── */
interface InputFormProps {
  input:       string
  isLoading:   boolean
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onChange:    (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit:    (e: React.FormEvent<HTMLFormElement>) => void
  onKeyDown:   (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  autoFocus?:  boolean
}

function InputForm({ input, isLoading, textareaRef, onChange, onSubmit, onKeyDown, autoFocus }: InputFormProps) {
  return (
    <form onSubmit={onSubmit} className="relative">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Ask me about my projects, skills, or how I can automate your business…"
        rows={1}
        className="chat-input"
        disabled={isLoading}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        aria-label="Message input"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="send-btn"
        aria-label="Send message"
      >
        {isLoading
          ? <Loader2 size={15} className="animate-spin" />
          : <ArrowUp size={15} strokeWidth={2.5} />}
      </button>
    </form>
  )
}

/* ─── Message row ─────────────────────────────────────────── */
function MessageRow({ message }: { message: Message }) {
  const isUser          = message.role === 'user'
  const detectedProjects = isUser ? [] : detectProjectsInText(message.content)

  return (
    <div>
      <motion.div
        className={`flex gap-3 items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        {!isUser && (
          <div
            className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mb-0.5"
            style={{ border: '1.5px solid var(--color-border)' }}
          >
            <Image src="/avatar.png" alt="Joemar" width={32} height={32} className="object-cover object-top w-full h-full" />
          </div>
        )}
        {isUser ? (
          <div className="user-bubble">{message.content}</div>
        ) : (
          <div className="assistant-bubble">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                pre({ children }) { return <>{children}</> },
                code({ className, children }) {
                  const isBlock = /language-/.test(className ?? '')
                  if (isBlock) {
                    return <pre className="code-block"><code className={className}>{children}</code></pre>
                  }
                  return <code className="inline-code">{children}</code>
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 transition-opacity hover:opacity-70"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {children}
                    </a>
                  )
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </motion.div>

      {/* Feature 2: project cards below assistant message */}
      {detectedProjects.length > 0 && (
        <div className="ml-11 flex flex-col gap-2 mt-1">
          {detectedProjects.map(p => (
            <ChatProjectCard key={p.name} project={p} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Typing indicator ────────────────────────────────────── */
function TypingBubble() {
  return (
    <motion.div
      className="flex gap-3 items-end"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mb-0.5"
        style={{ border: '1.5px solid var(--color-border)' }}
      >
        <Image src="/avatar.png" alt="Joemar" width={32} height={32} className="object-cover object-top w-full h-full" />
      </div>
      <div
        className="px-4 py-3.5 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full block"
            style={{ background: 'var(--color-accent)' }}
            animate={{ y: [0, -5, 0], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 0.65, repeat: Infinity, delay: i * 0.14, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </motion.div>
  )
}
