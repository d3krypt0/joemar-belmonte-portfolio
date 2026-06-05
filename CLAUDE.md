# CLAUDE.md — AI Automation Specialist Interactive Portfolio

## Project Context

An interactive portfolio website for an AI Automation Specialist. The primary audience is potential clients and employers evaluating technical capability and design sensibility. The aesthetic should feel cutting-edge, precise, and intelligent — not generic tech.

---

## Design Philosophy

### Read the Room First

Before any code, declare a one-line design read:
> "Reading this as: `<page kind>` for `<audience>`, with a `<vibe>` language, leaning toward `<aesthetic family>`."

Infer from brief signals — vibe words, referenced brands, audience type. If genuinely ambiguous, ask **one** clarifying question. Never a multi-question dump.

### Three Dials

Set these explicitly for each feature. Defaults for this portfolio:

| Dial | Value | Range |
|---|---|---|
| `DESIGN_VARIANCE` | 8 | 1 = Perfect Symmetry → 10 = Artsy Chaos |
| `MOTION_INTENSITY` | 7 | 1 = Static → 10 = Cinematic / Physics |
| `VISUAL_DENSITY` | 4 | 1 = Art Gallery → 10 = Cockpit |

---

## Stack

- **Framework:** React or Next.js (Server Components by default)
- **Styling:** Tailwind v4 — use `@tailwindcss/postcss` or Vite plugin, NOT `tailwindcss` in postcss.config.js
- **Animation:** Motion (`import { motion } from "motion/react"`) for UI; GSAP + ScrollTrigger for scroll-pinned/hijack work. Never mix both in the same component tree.
- **Icons:** `@phosphor-icons/react` first, then `hugeicons-react`, `@radix-ui/react-icons`, `@tabler/icons-react`. Never hand-roll SVG paths. One family per project. Never lucide-react unless explicitly requested.
- **Fonts:** Always `next/font` or self-hosted `@font-face`. Never `<link>` to Google Fonts in production.
- **State:** `useMotionValue` / `useTransform` for continuous values (mouse, scroll, pointer). Never `useState` for these — it re-renders the tree on every frame.

---

## Aesthetic Rules

### Typography

- Pair a **distinctive display font** with a **refined body font**. Good starting points: `Geist` + `Geist Mono`, `Satoshi` + `JetBrains Mono`, `Cabinet Grotesk` + `Inter Tight`
- **NEVER** use Inter, Arial, Roboto, or system fonts as the default display face
- **Serifs are discouraged** unless the brief explicitly names one or the aesthetic is genuinely editorial/heritage. If justified, pick from: PP Editorial New, GT Sectra Display, Tiempos Headline, Cormorant Garamond — rotate each time, never repeat
- **Banned as default serifs:** `Fraunces`, `Instrument_Serif` (LLM favorites, avoid)
- Italic descender check: any italic word with `y g j p q` needs `leading-[1.1]` min + `pb-1` reserve

### Color

- Max **1 accent color**. Saturation < 80%.
- **No AI-purple gradients** by default. Use neutral bases (Zinc / Slate / Stone) with a single high-contrast accent
- **One palette for the whole page.** Lock it. No warm-grey page with a blue CTA in section 7.
- No pure `#000000` or `#ffffff`. Use off-blacks (zinc-950) and off-whites.

### Layout

- `DESIGN_VARIANCE: 8` means: asymmetric grids, overlap, diagonal flow, generous negative space, grid-breaking elements
- **Anti-center bias**: at DESIGN_VARIANCE > 4, no centered Hero/H1. Force split-screen, left-aligned content, or scroll-pinned structures
- **Hero must fit the initial viewport**: headline ≤ 2 lines, subtext ≤ 20 words AND ≤ 4 lines, CTA visible without scroll
- **Hero top padding cap**: `pt-24` max. Content should not float halfway down.
- **Hero stack discipline**: max 4 text elements (eyebrow OR brand strip, headline, subtext, CTAs). No trust strips, no tagline below CTAs.
- **Viewport stability**: ALWAYS `min-h-[100dvh]`. NEVER `h-screen`.
- **Grid over flex math**: NEVER `w-[calc(33%-1rem)]`. ALWAYS `grid grid-cols-3 gap-6`.

### Motion

- `MOTION_INTENSITY: 7` means: entry transitions on hero, scroll-reveal on key sections, hover physics on CTAs, spring physics on interactions
- Every animation must have a reason: hierarchy, storytelling, feedback, or state transition. "It looked cool" is not a reason.
- Use `useReducedMotion()` from Motion. All animations `MOTION_INTENSITY > 3` must honor `prefers-reduced-motion`.
- **NEVER** `window.addEventListener("scroll", ...)`. Use `useScroll()`, GSAP ScrollTrigger, IntersectionObserver, or CSS `animation-timeline`.
- **NEVER** `useState` for continuous pointer/scroll values.
- All motion components must be isolated Client Component leaves with `'use client'` at top.

---

## Hard Rules (Pre-Flight Checks)

These are non-negotiable. Violating any = output is not done.

### Em-Dash Ban
**Zero em-dashes (`—` or `–` as separator) anywhere.** Headlines, eyebrows, body, quotes, attribution, buttons, alt text. Use a hyphen `-`, a comma, or restructure the sentence.

### Page Theme Lock
ONE theme (light, dark, or auto) for the whole page. No sections flipping to inverted mode mid-page.

### Color Consistency Lock
One accent color, used consistently across all components on the page.

### Shape Consistency Lock
One corner-radius scale: all-sharp (0), all-soft (12–16px), or all-pill. Document the system. Stick to it everywhere.

### Button Contrast
Every CTA text passes WCAG AA (4.5:1 body, 3:1 large text) against its background. White-on-white = fail.

### CTA Label Discipline
Button text must fit on one line at desktop. Labels ≤ 3 words for primary CTAs ideally. No duplicate CTA intent (one "Contact" label, one "View Work" label — pick one each, use it everywhere).

### Navigation
Single line on desktop. Height ≤ 80px. Hamburger if it doesn't fit at lg (1024px).

### Eyebrow Restraint
Max 1 eyebrow per 3 sections. Hero counts as 1. Count `uppercase tracking` instances before shipping — if `count > ceil(sectionCount / 3)`, fail.

### Section Layout Diversity
At least 4 different layout families across 8 sections. No layout family repeated consecutively.

### No Zigzag Cap Violations
Max 2 consecutive image+text split sections. The 3rd = fail.

### Marquee Cap
Max 1 horizontal scrolling marquee per page.

### Bento Rules
- Exactly N cells for N items. No empty cells.
- At least 2–3 cells need real visual variation (image, gradient, pattern). No all-white-text bento.

### Images
1. Use image generation tool first if available
2. `picsum.photos/seed/{descriptive-seed}/{w}/{h}` for placeholders
3. Never div-based fake screenshots. Never hand-rolled decorative SVGs.

### Logo Walls
Use real SVGs from Simple Icons (`cdn.simpleicons.org/{slug}/{color}`) or devicon. No plain text wordmarks. No category labels below logos.

### Real Images Policy
Even minimalist pages need at least 2–3 real images. A text-only page is incomplete work, not minimalism.

---

## Banned AI Tells

### Visual
- AI-purple gradients on white backgrounds
- Neon outer glows (use inner borders or tinted shadows)
- Excessive gradient text on large headers
- Custom cursors

### Typography
- Inter as default display font
- Mixed font families within a headline for emphasis (use italic/bold of the same font)
- Oversized H1s with no hierarchy beyond raw scale

### Layout
- 3 equal feature cards in a horizontal row
- Section-number eyebrows (`00 / INDEX`, `001 · Capabilities`)
- Split-header (giant left headline + small right explainer paragraph)
- Decoration text strip at hero bottom (`BRAND. MOTION. SPATIAL.`)
- Floating top-right sub-text in section headings
- `border-t` + `border-b` on every row of a long list
- Scoring/progress bars with filled background tracks
- Locale / city / weather strips (unless the brief is explicitly global/place-focused)
- Scroll cues (`↓ scroll`, `Scroll to explore`)

### Content
- Generic names: "John Doe", "Sarah Chan", "Acme Co"
- Generic avatars (SVG egg icons, Lucide user icons)
- Fake-precise numbers without real data (`99.99%`, `50%`)
- Startup-slop brand names: "Nexus", "SmartFlow", "Cloudly"
- Filler verbs: "Elevate", "Seamless", "Unleash", "Revolutionize"
- "Quietly trusted by" headers
- Version labels in hero (V0.6, BETA, EARLY ACCESS)
- Version footers on marketing pages (v1.4.2, Build 0048)
- Pills/labels overlaid on images
- Photo-credit captions as decoration (`Field study no. 12 · Ines Caetano`)
- Middle-dot (`·`) as the default separator for everything
- Decorative status dots before list/nav items (only for real semantic state)
- `<br>`-broken headlines as a default "design move"
- Generic step labels ("Stage 1", "Phase 01") — use verb-noun directly ("Install", "Configure", "Ship")
- Micro-meta-sentences under eyebrows

### Motion
- `window.addEventListener("scroll", ...)` — hard ban
- `useState` for mouse position / scroll progress
- `requestAnimationFrame` loops that touch React state
- GSAP everywhere "because GSAP is available"

---

## GSAP Canonical Patterns

### Sticky-Stack (Scroll-Pinned Cards)

```tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function StickyStack({ cards }: { cards: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray<HTMLElement>(".stack-card");
      cardEls.forEach((card, i) => {
        if (i === cardEls.length - 1) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: cardEls[cardEls.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });
        gsap.to(card, {
          scale: 0.92,
          opacity: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: cardEls[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={ref} className="relative">
      {cards.map((card, i) => (
        <div key={i} className="stack-card sticky top-0 min-h-[100dvh] flex items-center justify-center">
          {card}
        </div>
      ))}
    </div>
  );
}
```

### Horizontal Pan (Scroll Hijack)

```tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function HorizontalPan({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;
    const ctx = gsap.context(() => {
      const distance = track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section ref={wrap} className="relative overflow-hidden">
      <div ref={track} className="flex h-[100dvh] items-center">
        {children}
      </div>
    </section>
  );
}
```

### Scroll-Reveal Stagger (Motion, no GSAP needed)

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export function RevealStagger({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  return (
    <ul className="grid gap-6">
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          {item}
        </motion.li>
      ))}
    </ul>
  );
}
```

---

## Performance & Accessibility

- Animate only `transform` and `opacity`. Never `top`, `left`, `width`, `height`.
- `will-change: transform` only on elements that will actually animate.
- LCP < 2.5s: hero image must be `next/image priority` or preloaded.
- INP < 200ms: heavy work off main thread.
- CLS < 0.1: reserve space for images, fonts, embeds.
- Grain/noise filters only on `fixed, pointer-events-none` pseudo-elements. Never on scrolling containers.
- Dark mode: design for both modes from the start. Use Tailwind `dark:` variant or CSS variables — pick one strategy, use it everywhere. Test in both modes before finishing.
- No pure `#000000`/`#ffffff`. Off-black and off-white only.
- Breakpoints: `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`. Contain with `max-w-[1400px] mx-auto`.
- High-variance layouts must explicitly collapse to single-column at `< 768px`.

---

## Reference: Pattern Vocabulary

**Heroes:** Asymmetric Split, Editorial Manifesto, Kinetic-Type, Curtain-Reveal, Scroll-Pinned  
**Navigation:** Magnetic Button, Floating Speed Dial, Mega Menu Reveal  
**Layouts:** Bento Grid, Masonry, Sticky-Stack Sections, Split-Screen Scroll  
**Cards:** Parallax Tilt, Spotlight Border, Glassmorphism Panel, Holographic Foil  
**Scroll:** Sticky Scroll Stack, Horizontal Scroll Hijack, Zoom Parallax, Scroll Progress Path  
**Typography:** Kinetic Marquee, Text Mask Reveal, Text Scramble, Circular Text Path  
**Micro-interactions:** Directional Hover-Aware Button, Ripple Click, Animated SVG Drawing, Mesh Gradient Background
