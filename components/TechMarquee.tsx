'use client'

import Claude  from '@lobehub/icons/es/Claude'
import Groq    from '@lobehub/icons/es/Groq'
import Make    from '@lobehub/icons/es/Make'
import Meta    from '@lobehub/icons/es/Meta'
import N8n     from '@lobehub/icons/es/N8n'
import Notion  from '@lobehub/icons/es/Notion'
import Railway from '@lobehub/icons/es/Railway'
import Vercel  from '@lobehub/icons/es/Vercel'
import type { IconType } from '@lobehub/icons/es/types'

interface Tile {
  name:       string
  Icon?:      IconType
  iconColor?: string
  iconUrl?:   string
  initials?:  string
  initColor?: string
  bgColor?:   string
}

// ROW1 - Automation & AI
const ROW1: Tile[] = [
  { name: 'n8n',      Icon: N8n.Color },
  { name: 'Make.com', Icon: Make.Color },
  { name: 'Claude',   Icon: Claude.Color },
  { name: 'Groq',     Icon: Groq,   iconColor: '#F55036' },
  { name: 'Airtable', iconUrl: 'https://cdn.simpleicons.org/airtable/18BFFF', initColor: '#18BFFF' },
  { name: 'Notion',   Icon: Notion, iconColor: 'currentColor' },
  { name: 'Gmail',    iconUrl: 'https://cdn.simpleicons.org/gmail/EA4335',    initColor: '#EA4335' },
  { name: 'Telegram', iconUrl: 'https://cdn.simpleicons.org/telegram/26A5E4', initColor: '#26A5E4' },
]

// ROW2 - Web, eCommerce & Deployment
const ROW2: Tile[] = [
  { name: 'React',    iconUrl: 'https://cdn.simpleicons.org/react/61DAFB',     initColor: '#61DAFB' },
  { name: 'Next.js',  iconUrl: 'https://cdn.simpleicons.org/nextdotjs/888888', initColor: '#888888' },
  { name: 'Node.js',  iconUrl: 'https://cdn.simpleicons.org/nodedotjs/339933', initColor: '#339933' },
  { name: 'Python',   iconUrl: 'https://cdn.simpleicons.org/python/3776AB',    initColor: '#3776AB' },
  { name: 'Docker',   iconUrl: 'https://cdn.simpleicons.org/docker/2496ED',    initColor: '#2496ED' },
  { name: 'Vercel',   Icon: Vercel,  iconColor: 'currentColor' },
  { name: 'Railway',  Icon: Railway, iconColor: 'currentColor' },
  { name: 'Shopify',  iconUrl: 'https://cdn.simpleicons.org/shopify/96BF48',   initColor: '#96BF48' },
  { name: 'Meta Ads', Icon: Meta.Color },
]

function TileIcon({ tile }: { tile: Tile }) {
  if (tile.Icon) {
    const Icon = tile.Icon
    return <Icon size={28} color={tile.iconColor} />
  }

  if (tile.initials) {
    return (
      <div
        style={{
          width:          28,
          height:         28,
          borderRadius:   6,
          background:     tile.bgColor || `${tile.initColor}1A`,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          flexShrink:     0,
          border:         `1px solid ${tile.initColor}33`,
        }}
      >
        <span style={{ fontWeight: 800, fontSize: 13, color: tile.initColor, fontFamily: 'system-ui' }}>
          {tile.initials}
        </span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={tile.iconUrl}
      alt={tile.name}
      width={28}
      height={28}
      style={{ objectFit: 'contain', flexShrink: 0 }}
    />
  )
}

function TileItem({ tile }: { tile: Tile }) {
  return (
    <div
      className="marquee-tile"
      style={{
        display:       'inline-flex',
        alignItems:    'center',
        gap:           10,
        padding:       '10px 18px',
        background:    'var(--color-surface)',
        border:        '1px solid var(--color-border)',
        borderRadius:  10,
        flexShrink:    0,
        cursor:        'default',
        transition:    'border-color 150ms ease, background 150ms ease',
      }}
    >
      <TileIcon tile={tile} />
      <span style={{
        fontFamily: 'var(--font-display, system-ui)',
        fontWeight: 600,
        fontSize:   13,
        color:      'var(--color-text)',
        whiteSpace: 'nowrap',
      }}>
        {tile.name}
      </span>
    </div>
  )
}

function MarqueeRow({ tiles, reverse = false }: { tiles: Tile[]; reverse?: boolean }) {
  const doubled = [...tiles, ...tiles]

  return (
    <div
      className="marquee-row-wrap"
      style={{
        overflow:        'hidden',
        width:           '100%',
        maskImage:       'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div
        className={reverse ? 'marquee-track-reverse' : 'marquee-track'}
        style={{ display: 'inline-flex', gap: 12, padding: '6px 0' }}
      >
        {doubled.map((tile, i) => (
          <TileItem key={`${tile.name}-${i}`} tile={tile} />
        ))}
      </div>
    </div>
  )
}

export default function TechMarquee() {
  return (
    <section
      id="tech"
      className="py-20 sm:py-28 px-5"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span
            className="font-mono text-[11px] uppercase tracking-[0.22em] block mb-2"
            style={{ color: 'var(--color-accent)' }}
          >
            // Tech Stack
          </span>
          <h2
            className="font-display font-bold text-3xl sm:text-4xl mt-1 leading-tight"
            style={{ color: 'var(--color-text)' }}
          >
            Tools &amp; <span style={{ color: 'var(--color-accent)' }}>Technologies</span>
          </h2>
          <p
            className="mx-auto mt-4 text-[15px] leading-relaxed"
            style={{ color: 'var(--color-muted)', maxWidth: 480 }}
          >
            Mastering the ecosystem of modern automation and AI tools to deliver production-ready solutions.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <MarqueeRow tiles={ROW1} reverse={false} />
          <MarqueeRow tiles={ROW2} reverse={true}  />
        </div>
      </div>
    </section>
  )
}
