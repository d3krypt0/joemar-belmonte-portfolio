'use client'

import { useChat } from 'ai/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'
import { ArrowUp, ArrowLeft, ArrowDown, Loader2, Sun, Moon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Message } from 'ai'
import { detectProjectsInText, type ProjectData } from '@/lib/projects'

/* ─── Types ───────────────────────────────────────────────── */
type AvatarState = 'idle' | 'thinking' | 'replying'
type Theme       = 'dark' | 'light'

/* ─── Static data ─────────────────────────────────────────── */
const WELCOME_CHIPS = [
  { text: "I'm losing hours to repetitive work — what can you automate for me?", icon: '⚡' },
  { text: 'How much does an automation project cost?',                            icon: '💰' },
  { text: 'Can you work with the tools my business already uses?',                icon: '🔗' },
]

const CHAT_CHIPS = [
  'How fast can we get started?',
  'Do I need technical knowledge to use it?',
  'What results have your clients seen?',
]

/* ─── ChatApp ─────────────────────────────────────────────── */
export default function ChatApp() {
  const [hasStarted, setHasStarted]   = useState(false)
  const [avatarState, setAvatarState] = useState<AvatarState>('idle')
  const [theme, setTheme]             = useState<Theme>('light')

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef          = useRef<HTMLTextAreaElement>(null)

  const { messages, input, handleInputChange, handleSubmit,
          isLoading, append, setMessages, setInput } = useChat({
    api: '/api/chat',
    onResponse: ()  => setAvatarState('replying'),
    onFinish:   ()  => setTimeout(() => setAvatarState('idle'), 900),
    onError:    ()  => setAvatarState('idle'),
  })

  // Load saved theme once on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved === 'light' || saved === 'dark') setTheme(saved)
  }, [])

  // Sync theme to <html> so CSS variables cascade to the whole page
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (messages.length > 0 && !hasStarted) setHasStarted(true)
  }, [messages.length, hasStarted])

  useEffect(() => {
    if (isLoading) setAvatarState('thinking')
  }, [isLoading])

  useEffect(() => {
    const el = messagesContainerRef.current
    if (!el) return
    // Use scrollTop directly — scrollTo with behavior:'smooth' can propagate
    // to the window on some browsers and reveal the portfolio section below.
    el.scrollTop = el.scrollHeight
  }, [messages, isLoading])

  const handleChipClick = useCallback(
    (text: string) => {
      append({ role: 'user', content: text })
      // Defensive guard: focus changes during the WelcomeView→ChatView transition
      // can trigger a window-level scroll. Reset immediately if it happened.
      setTimeout(() => {
        if (window.scrollY > 0) window.scrollTo(0, 0)
      }, 50)
    },
    [append],
  )

  const handleBack = useCallback(() => {
    setMessages([])
    setHasStarted(false)
    setAvatarState('idle')
  }, [setMessages])

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      return next
    })
  }, [])

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleInputChange(e)
      const el = e.target
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 180)}px`
    },
    [handleInputChange],
  )

  // Use append + setInput instead of forwarding a KeyboardEvent as a FormEvent
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (input.trim() && !isLoading) {
          append({ role: 'user', content: input.trim() })
          setInput('')
          if (textareaRef.current) textareaRef.current.style.height = 'auto'
        }
      }
    },
    [input, isLoading, append, setInput],
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
    <>
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

      {/* Global nav bar */}
      <NavBar theme={theme} onToggleTheme={toggleTheme} />

      {/* Scroll navigation buttons */}
      <ScrollNav />

      {/* ── Chat section: sticky, always takes first viewport ── */}
      <div
        id="top"
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
              messagesContainerRef={messagesContainerRef}
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
    </>
  )
}

/* ─── Scroll indicator ────────────────────────────────────── */
function ScrollIndicator({ targetId }: { targetId: string }) {
  const [visible, setVisible] = useState(true)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest < 60)
  })

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

/* ─── Navigation bar ──────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Ask Me',   href: '#top'      },
  { label: 'Services', href: '#services' },
  { label: 'Work',     href: '#work'     },
  { label: 'Contact',  href: '#contact'  },
]

function NavBar({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 80)
  })

  const handleNav = (href: string) => {
    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-8"
      style={{
        height:         60,
        zIndex:         100,
        background:     scrolled
          ? 'color-mix(in srgb, var(--color-bg) 90%, transparent)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom:   scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        transition:     'background 250ms ease, border-color 250ms ease, backdrop-filter 250ms ease',
      }}
    >
      {/* Brand — terminal logo */}
      <button
        onClick={() => handleNav('#top')}
        className="flex items-center gap-0 flex-shrink-0"
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
      >
        <span className="font-mono font-bold" style={{ fontSize: 15, color: 'var(--color-accent)', letterSpacing: '-0.01em' }}>
          {'>'}&#8203;
        </span>
        <span className="font-mono font-bold" style={{ fontSize: 15, color: 'var(--color-text)', letterSpacing: '0.01em' }}>
          &nbsp;jmrblmnt.ai
        </span>
        <span className="nav-cursor" style={{ color: 'var(--color-accent)', fontFamily: 'monospace', fontWeight: 700, fontSize: 15 }}>_</span>
      </button>

      {/* Links — hidden on mobile */}
      <div className="hidden sm:flex items-center gap-1">
        {NAV_LINKS.map(link => (
          <button
            key={link.label}
            onClick={() => handleNav(link.href)}
            className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150"
            style={{ color: 'var(--color-muted)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Right: theme toggle + Book a Call */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="inline-flex items-center rounded-[6px] font-semibold transition-colors"
          style={{ background: '#00A8E8', color: '#060D14' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00C8FF' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00A8E8' }}
        >
          <span className="hidden sm:block" style={{ fontSize: 12, padding: '8px 18px' }}>Book a Call</span>
          <span className="sm:hidden" style={{ fontSize: 11, padding: '7px 12px' }}>Book Call</span>
        </button>
      </div>
    </nav>
  )
}

/* ─── Scroll navigation buttons (go to top / go to bottom) ── */
function ScrollNav() {
  const [scrollYVal, setScrollYVal] = useState(0)
  const [pageH,      setPageH]      = useState(0)
  const [viewH,      setViewH]      = useState(0)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrollYVal(latest)
    setPageH(document.body.scrollHeight)
  })

  useEffect(() => {
    setViewH(window.innerHeight)
    setPageH(document.body.scrollHeight)
    const ro = new ResizeObserver(() => {
      setViewH(window.innerHeight)
      setPageH(document.body.scrollHeight)
    })
    ro.observe(document.documentElement)
    return () => ro.disconnect()
  }, [])

  const atTop    = scrollYVal < 100
  const atBottom = pageH - scrollYVal - viewH < 60

  const goTop    = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const goBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })

  if (atTop && pageH <= viewH) return null

  const btnStyle: React.CSSProperties = {
    background: 'var(--color-surface)',
    border:     '1px solid var(--color-border)',
    color:      'var(--color-text)',
    boxShadow:  '0 2px 8px rgba(0,0,0,0.2)',
  }

  return (
    <div
      className="fixed flex flex-col gap-2"
      style={{ right: 20, bottom: 100, zIndex: 50 }}
    >
      {!atTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={goTop}
            aria-label="Go to top"
            title="Go to top"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={btnStyle}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-accent)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-accent)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)'
            }}
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </button>
        </motion.div>
      )}

      {!atBottom && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          <button
            onClick={goBottom}
            aria-label="Go to bottom"
            title="Scroll to bottom"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={btnStyle}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-accent)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-accent)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)'
            }}
          >
            <ArrowDown size={16} strokeWidth={2.5} />
          </button>
        </motion.div>
      )}
    </div>
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
  const scrollRef  = useRef<HTMLDivElement>(null)
  const [canLeft,  setCanLeft]  = useState(false)
  const [canRight, setCanRight] = useState(true)

  const checkArrows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    // Double-RAF: useEffect runs after paint but scrollWidth may still be
    // unresolved on the first frame. Two frames guarantees layout is settled.
    let raf1: number, raf2: number
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(checkArrows)
    })
    el.addEventListener('scroll', checkArrows, { passive: true })
    window.addEventListener('resize', checkArrows, { passive: true })
    const ro = new ResizeObserver(checkArrows)
    ro.observe(el)
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      el.removeEventListener('scroll', checkArrows)
      window.removeEventListener('resize', checkArrows)
      ro.disconnect()
    }
  }, [chips, checkArrows])

  const nudge = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -180 : 180, behavior: 'smooth' })
  }

  const arrowStyle: React.CSSProperties = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-muted)',
  }

  return (
    <div className="flex items-center gap-1.5">
      {canLeft && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => nudge('left')}
          aria-label="Scroll left"
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
          style={arrowStyle}
        >
          <ChevronLeft size={12} />
        </button>
      )}
      <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1 min-w-0">
        {chips.map(text => (
          <button
            key={text}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onChipClick(text)}
            className="chip-sm flex-shrink-0"
          >
            {text}
          </button>
        ))}
      </div>
      {canRight && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => nudge('right')}
          aria-label="Scroll right"
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
          style={arrowStyle}
        >
          <ChevronRight size={12} />
        </button>
      )}
    </div>
  )
}

/* ─── Typewriter hook ─────────────────────────────────────── */
function useTypewriter(text: string, speed = 65, startDelay = 400, loopDelay = 3000) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let cancelled = false
    let iv: ReturnType<typeof setInterval> | null = null
    let t:  ReturnType<typeof setTimeout>  | null = null

    function startTyping(delay: number) {
      t = setTimeout(() => {
        if (cancelled) return
        setDisplayed('')
        let i = 0
        iv = setInterval(() => {
          if (cancelled) { clearInterval(iv!); return }
          i++
          setDisplayed(text.slice(0, i))
          if (i >= text.length) {
            clearInterval(iv!)
            iv = null
            t = setTimeout(() => { if (!cancelled) startTyping(0) }, loopDelay)
          }
        }, speed)
      }, delay)
    }

    startTyping(startDelay)

    return () => {
      cancelled = true
      if (t  !== null) clearTimeout(t)
      if (iv !== null) clearInterval(iv)
    }
  }, [text, speed, startDelay, loopDelay])

  return displayed
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
  const NAME     = 'Joemar Belmonte'
  const typedName = useTypewriter(NAME, 65, 400)
  const nameDone  = typedName.length === NAME.length

  return (
    <motion.div
      className="flex flex-col items-center h-full overflow-y-auto px-5 pb-6 gap-4"
      style={{ paddingTop: '70px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -28, transition: { duration: 0.25 } }}
    >
      <motion.div
        initial={{ scale: 0.72, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
      >
        <ProfilePhoto state={avatarState} size={120} />
      </motion.div>

      <motion.div
        className="text-center space-y-1"
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.14, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-display text-[2.2rem] sm:text-[2.8rem] font-bold tracking-tight leading-none">
          Hey, I&apos;m{' '}
          <span style={{ whiteSpace: 'nowrap' }}>
            {typedName}
            {!nameDone && (
              <motion.span
                style={{
                  display:       'inline-block',
                  width:         3,
                  height:        '0.8em',
                  background:    'var(--color-accent)',
                  marginLeft:    2,
                  verticalAlign: 'middle',
                  borderRadius:  1,
                }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </span>
          {nameDone && (
            <>
              {' '}
              <motion.span
                style={{ display: 'inline-block', originX: 0.7, originY: 0.8 }}
                animate={{ rotate: [0, 24, -12, 24, -8, 0] }}
                transition={{ delay: 0.15, duration: 1.1, repeat: 1, repeatDelay: 1.5 }}
              >
                👋
              </motion.span>
            </>
          )}
        </h1>
        <p className="font-mono text-muted text-[0.82rem] tracking-[0.2em] uppercase">
          AI Automation Specialist
          <span className="text-accent/40 mx-2.5">·</span>
          Ex-Cybersecurity · Philippines
        </p>
        <motion.p
          className="text-muted text-[0.9rem] leading-relaxed max-w-[28rem] mx-auto"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5 }}
        >
          10+ years in cybersecurity — now building AI automation systems that run without you.
          n8n, Make.com, multi-agent architectures, and custom tools built security-first from day one.
        </motion.p>
      </motion.div>

      {/* Primary CTA */}
      <motion.div
        className="flex flex-col items-center gap-1.5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36, duration: 0.45 }}
      >
        <a
          href="https://calendly.com/joemarbelmonte-automation/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold rounded-lg transition-colors"
          style={{
            background:  'var(--color-accent)',
            color:       '#060D14',
            padding:     '11px 28px',
            fontSize:    15,
            letterSpacing: '0.01em',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.88' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
        >
          📅 Book a Free Call
        </a>
        <span className="font-mono text-[11px]" style={{ color: 'var(--color-muted)', opacity: 0.65 }}>
          Free 30-min scoping call — no obligation.
        </span>
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
            type="button"
            onMouseDown={(e) => e.preventDefault()}
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
  messagesContainerRef: React.RefObject<HTMLDivElement>
  textareaRef:    React.RefObject<HTMLTextAreaElement>
  onChange:       (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit:       (e: React.FormEvent<HTMLFormElement>) => void
  onKeyDown:      (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onBack:         () => void
  onChipClick:    (text: string) => void
  theme:          Theme
  onToggleTheme:  () => void
}

function ChatView({ avatarState, messages, input, isLoading, messagesContainerRef,
                    textareaRef, onChange, onSubmit, onKeyDown, onBack, onChipClick,
                    theme, onToggleTheme }: ChatViewProps) {
  const userMessageCount = messages.filter(m => m.role === 'user').length
  const showBookingCard  = userMessageCount >= 3

  return (
    <motion.div
      className="flex flex-col h-full pt-[60px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header — sits just below the fixed global NavBar */}
      <header
        className="flex items-center gap-3 px-4 sm:px-5 py-2.5 sticky top-[60px] z-20"
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

      {/* Messages — flex col so mt-auto anchors messages to bottom */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto flex flex-col">
        <div className="max-w-[720px] mx-auto w-full px-5 sm:px-8 py-7 space-y-5 mt-auto">
          {messages.map((m, idx) => {
            const triggerText = m.role === 'assistant'
              ? messages.slice(0, idx).filter(msg => msg.role === 'user').at(-1)?.content
              : undefined
            return <MessageRow key={m.id} message={m} triggerText={triggerText} />
          })}
          {isLoading && <TypingBubble />}

          {showBookingCard && <BookingCard />}
        </div>
      </div>

      {/* Input area */}
      <div
        className="sticky bottom-0 px-5 sm:px-8 pb-4 pt-3"
        style={{
          borderTop:      '1px solid var(--color-border)',
          background:     'color-mix(in srgb, var(--color-bg) 90%, transparent)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-[720px] mx-auto space-y-2.5">
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
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="rounded-xl overflow-hidden"
      style={{
        background:  'var(--color-surface)',
        border:      '1px solid var(--color-border)',
        borderLeft:  '3px solid var(--color-accent)',
      }}
    >
      <div className="p-4 sm:p-5">
        <h3 className="font-display font-semibold text-base" style={{ color: 'var(--color-text)' }}>
          Ready to talk about your project?
        </h3>
        <p className="text-[13px] mt-1" style={{ color: 'var(--color-muted)' }}>
          Pick a time directly below, no redirects.
        </p>
        <div className="mt-4">
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)', cursor: 'pointer' }}
          >
            See My Calendar →
          </button>
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
function MessageRow({ message, triggerText }: { message: Message; triggerText?: string }) {
  const isUser = message.role === 'user'
  const detectedProjects = (!isUser && triggerText) ? detectProjectsInText(triggerText) : []

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
