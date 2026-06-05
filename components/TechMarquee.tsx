'use client'

/* Pure-CSS infinite marquee — no animation libraries */

interface Tile {
  name:     string
  iconUrl?: string
  initials?: string
  initColor: string
  bgColor:   string
}

const ROW1: Tile[] = [
  { name: 'n8n',       iconUrl: 'https://cdn.simpleicons.org/n8n/EA4B71',      initColor: '#EA4B71', bgColor: '' },
  { name: 'Claude AI', initials: 'A', initColor: '#D97706',                    bgColor: 'rgba(217,119,6,0.12)' },
  { name: 'Docker',    iconUrl: 'https://cdn.simpleicons.org/docker/2496ED',   initColor: '#2496ED', bgColor: '' },
  { name: 'Node.js',   iconUrl: 'https://cdn.simpleicons.org/nodedotjs/339933',initColor: '#339933', bgColor: '' },
  { name: 'React',     iconUrl: 'https://cdn.simpleicons.org/react/61DAFB',    initColor: '#61DAFB', bgColor: '' },
  { name: 'Next.js',   iconUrl: 'https://cdn.simpleicons.org/nextdotjs/888888',initColor: '#888888', bgColor: '' },
  { name: 'Shopify',   iconUrl: 'https://cdn.simpleicons.org/shopify/96BF48',  initColor: '#96BF48', bgColor: '' },
  { name: 'Airtable',  iconUrl: 'https://cdn.simpleicons.org/airtable/18BFFF', initColor: '#18BFFF', bgColor: '' },
  { name: 'Make.com',  iconUrl: 'https://cdn.simpleicons.org/make/6D00CC',     initColor: '#6D00CC', bgColor: '' },
]

const ROW2: Tile[] = [
  { name: 'Python',    iconUrl: 'https://cdn.simpleicons.org/python/3776AB',   initColor: '#3776AB', bgColor: '' },
  { name: 'Notion',    iconUrl: 'https://cdn.simpleicons.org/notion/888888',   initColor: '#888888', bgColor: '' },
  { name: 'Telegram',  iconUrl: 'https://cdn.simpleicons.org/telegram/26A5E4', initColor: '#26A5E4', bgColor: '' },
  { name: 'Gmail',     iconUrl: 'https://cdn.simpleicons.org/gmail/EA4335',    initColor: '#EA4335', bgColor: '' },
  { name: 'Vercel',    iconUrl: 'https://cdn.simpleicons.org/vercel/888888',   initColor: '#888888', bgColor: '' },
  { name: 'Railway',   iconUrl: 'https://cdn.simpleicons.org/railway/888888',  initColor: '#888888', bgColor: '' },
  { name: 'Meta',      iconUrl: 'https://cdn.simpleicons.org/meta/0082FB',     initColor: '#0082FB', bgColor: '' },
  { name: 'Google',    iconUrl: 'https://cdn.simpleicons.org/google/4285F4',   initColor: '#4285F4', bgColor: '' },
  { name: 'Nginx',     iconUrl: 'https://cdn.simpleicons.org/nginx/009639',    initColor: '#009639', bgColor: '' },
  { name: 'GitHub',    iconUrl: 'https://cdn.simpleicons.org/github/888888',   initColor: '#888888', bgColor: '' },
]

function TileIcon({ tile }: { tile: Tile }) {
  if (tile.initials) {
    return (
      <div
        style={{
          width:         28,
          height:        28,
          borderRadius:  6,
          background:    tile.bgColor || `${tile.initColor}1A`,
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          flexShrink:    0,
          border:        `1px solid ${tile.initColor}33`,
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
        fontFamily:  'var(--font-display, system-ui)',
        fontWeight:  600,
        fontSize:    13,
        color:       'var(--color-text)',
        whiteSpace:  'nowrap',
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
        overflow:    'hidden',
        width:       '100%',
        maskImage:   'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div
        className={reverse ? 'marquee-track-reverse' : 'marquee-track'}
        style={{
          display:  'inline-flex',
          gap:      12,
          padding:  '6px 0',
        }}
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
      className="py-20 sm:py-24 px-5"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
            Tools &amp; Technologies
          </h2>
          <p
            className="mx-auto mt-4 text-[15px] leading-relaxed"
            style={{ color: 'var(--color-muted)', maxWidth: 480 }}
          >
            Mastering the ecosystem of modern automation and AI tools to deliver production-ready solutions.
          </p>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-3">
          <MarqueeRow tiles={ROW1} reverse={false} />
          <MarqueeRow tiles={ROW2} reverse={true}  />
        </div>
      </div>
    </section>
  )
}
