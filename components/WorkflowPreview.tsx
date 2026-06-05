'use client'

import { type PatternType } from '@/lib/projects'

interface Props {
  pattern: PatternType
  accent:  string
}

/* ── Shared SVG primitives ──────────────────────────────────── */

function GridBg({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0L0 0 0 24" fill="none" stroke="rgba(255,255,255,0.028)" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="560" height="200" fill={`url(#${id})`} />
    </>
  )
}

function NodeRect({
  x, y, w = 64, h = 28, accent, label, glow = false,
}: {
  x: number; y: number; w?: number; h?: number
  accent: string; label: string; glow?: boolean
}) {
  return (
    <g>
      {glow && (
        <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} rx={8}
          fill="none" stroke={accent} strokeOpacity={0.22} strokeWidth={3}
          style={{ filter: `blur(4px)` }} />
      )}
      <rect x={x} y={y} width={w} height={h} rx={6}
        fill={accent} fillOpacity={0.12}
        stroke={accent} strokeOpacity={0.38} strokeWidth={1} />
      <text x={x + w / 2} y={y + h / 2 + 3.5}
        textAnchor="middle" fontFamily="monospace" fontSize={7.5}
        fill={accent} fillOpacity={0.72}
        style={{ userSelect: 'none' }}>
        {label}
      </text>
    </g>
  )
}

function Dot({ x, y, accent }: { x: number; y: number; accent: string }) {
  return <circle cx={x} cy={y} r={2.5} fill={accent} fillOpacity={0.5} />
}

function DashLine({
  x1, y1, x2, y2, accent,
}: { x1: number; y1: number; x2: number; y2: number; accent: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={accent} strokeOpacity={0.25} strokeWidth={1}
      strokeDasharray="4 4" />
  )
}

/* ── Pattern: pipeline (AI Media Monitoring) ──────────────── */
function PipelinePattern({ accent }: { accent: string }) {
  const W = 60, H = 26, Y = 87, GAP = 14
  const TOTAL = 6 * W + 5 * GAP
  const START = (560 - TOTAL) / 2
  const labels = ['SCHEDULE', 'RSS SCAN', 'CLAUDE AI', 'GMAIL', 'NOTION', 'TELEGRAM']
  const nodes = labels.map((label, i) => ({ x: START + i * (W + GAP), label }))

  return (
    <g>
      {nodes.map((n, i) => {
        const next = nodes[i + 1]
        return (
          <g key={n.label}>
            {next && (
              <>
                <DashLine x1={n.x + W} y1={Y + H / 2} x2={next.x} y2={Y + H / 2} accent={accent} />
                <Dot x={n.x + W} y={Y + H / 2} accent={accent} />
                <Dot x={next.x} y={Y + H / 2} accent={accent} />
              </>
            )}
            <NodeRect x={n.x} y={Y} w={W} h={H} accent={accent} label={n.label} glow={i === 2} />
          </g>
        )
      })}
    </g>
  )
}

/* ── Pattern: hub (6-Agent System) ───────────────────────── */
function HubPattern({ accent }: { accent: string }) {
  const CX = 280, CY = 100
  const satellites = [
    { label: 'RESEARCH',  x: 86,  y: 44  },
    { label: 'SUPPLIER',  x: 248, y: 30  },
    { label: 'AD CREATE', x: 408, y: 44  },
    { label: 'ANALYTICS', x: 408, y: 128 },
    { label: 'STORE OPS', x: 248, y: 142 },
    { label: 'SUPPORT',   x: 86,  y: 128 },
  ]
  const SW = 72, SH = 24, CW = 88, CH = 32

  return (
    <g>
      {satellites.map(s => {
        const sx = s.x + SW / 2, sy = s.y + SH / 2
        return (
          <g key={s.label}>
            <DashLine x1={sx} y1={sy} x2={CX} y2={CY} accent={accent} />
            <Dot x={sx} y={sy} accent={accent} />
          </g>
        )
      })}
      <Dot x={CX} y={CY} accent={accent} />
      {satellites.map(s => (
        <NodeRect key={s.label} x={s.x} y={s.y} w={SW} h={SH} accent={accent} label={s.label} />
      ))}
      <NodeRect x={CX - CW / 2} y={CY - CH / 2} w={CW} h={CH}
        accent={accent} label="ORCHESTRATOR" glow />
    </g>
  )
}

/* ── Pattern: grid (F&B Calculator) ──────────────────────── */
function GridPattern({ accent }: { accent: string }) {
  const cols = ['ITEM', 'QTY', 'COST', 'MARGIN', 'TOTAL']
  const CW = 96, RH = 24
  const startX = (560 - cols.length * CW) / 2
  const startY = 24
  const rows = 5

  const highlightCells: [number, number][] = [[0, 2], [2, 3], [4, 1], [3, 4], [1, 3], [2, 1]]

  return (
    <g>
      {/* Header row */}
      {cols.map((col, ci) => (
        <g key={col}>
          <rect x={startX + ci * CW} y={startY} width={CW} height={RH} rx={0}
            fill={accent} fillOpacity={0.16}
            stroke={accent} strokeOpacity={0.25} strokeWidth={0.8} />
          <text x={startX + ci * CW + CW / 2} y={startY + RH / 2 + 3.5}
            textAnchor="middle" fontFamily="monospace" fontSize={7}
            fill={accent} fillOpacity={0.8}>
            {col}
          </text>
        </g>
      ))}

      {/* Data rows */}
      {Array.from({ length: rows }).map((_, ri) =>
        cols.map((_, ci) => {
          const isHighlighted = highlightCells.some(([r, c]) => r === ri && c === ci)
          return (
            <g key={`${ri}-${ci}`}>
              <rect
                x={startX + ci * CW} y={startY + (ri + 1) * RH}
                width={CW} height={RH}
                fill={isHighlighted ? accent : 'transparent'}
                fillOpacity={isHighlighted ? 0.09 : 0}
                stroke={accent} strokeOpacity={0.12} strokeWidth={0.6}
              />
              {isHighlighted && (
                <text
                  x={startX + ci * CW + CW / 2} y={startY + (ri + 1) * RH + RH / 2 + 3.5}
                  textAnchor="middle" fontFamily="monospace" fontSize={6.5}
                  fill={accent} fillOpacity={0.5}>
                  =SUM()
                </text>
              )}
            </g>
          )
        })
      )}

      {/* Totals row */}
      {cols.map((_, ci) => (
        <rect key={`total-${ci}`}
          x={startX + ci * CW} y={startY + (rows + 1) * RH}
          width={CW} height={RH}
          fill={accent} fillOpacity={ci === cols.length - 1 ? 0.22 : 0.06}
          stroke={accent} strokeOpacity={0.3} strokeWidth={0.8}
        />
      ))}
    </g>
  )
}

/* ── Pattern: branch (n8n Lead Qualifier / MenuCostingAI) ── */
function BranchPattern({ accent }: { accent: string }) {
  const Y = 86, H = 26

  const mainNodes = [
    { x: 32,  w: 64, label: 'EMAIL',    y: Y },
    { x: 144, w: 64, label: 'EXTRACT',  y: Y },
    { x: 256, w: 64, label: 'SCORE AI', y: Y },
    { x: 368, w: 64, label: 'DECISION', y: Y, glow: true },
  ]

  const branchNodes = [
    { x: 470, w: 64, label: 'HOT LEAD', y: 52  },
    { x: 470, w: 64, label: 'NORMAL',   y: 120 },
  ]

  const decX = 368 + 64, decMid = Y + H / 2

  return (
    <g>
      {/* Main chain lines */}
      {mainNodes.slice(0, -1).map((n, i) => {
        const next = mainNodes[i + 1]
        return (
          <g key={`ml-${i}`}>
            <DashLine x1={n.x + n.w} y1={n.y + H / 2} x2={next.x} y2={next.y + H / 2} accent={accent} />
            <Dot x={n.x + n.w} y={n.y + H / 2} accent={accent} />
          </g>
        )
      })}

      {/* Branch lines */}
      {branchNodes.map(bn => (
        <g key={bn.label}>
          <DashLine x1={decX} y1={decMid} x2={bn.x} y2={bn.y + H / 2} accent={accent} />
          <Dot x={bn.x} y={bn.y + H / 2} accent={accent} />
        </g>
      ))}
      <Dot x={decX} y={decMid} accent={accent} />

      {/* Nodes */}
      {mainNodes.map(n => (
        <NodeRect key={n.label} x={n.x} y={n.y} w={n.w} h={H} accent={accent} label={n.label} glow={n.glow} />
      ))}
      {branchNodes.map(bn => (
        <NodeRect key={bn.label} x={bn.x} y={bn.y} w={bn.w} h={H} accent={accent} label={bn.label} />
      ))}
    </g>
  )
}

/* ── Pattern: funnel (DropshipIQ) ─────────────────────────── */
function FunnelPattern({ accent }: { accent: string }) {
  const sources  = [{ x: 48,  label: 'CJ API' }, { x: 245, label: 'META ADS' }, { x: 442, label: 'TRENDS' }]
  const SW = 70, SH = 24, SY = 34

  const CW = 140, CH = 28, CX = 210, CY = 96

  const outputs = [
    { x: 28,  label: 'RESEARCH' },
    { x: 148, label: 'WINNING' },
    { x: 268, label: 'COMPARE' },
    { x: 388, label: 'WATCHLIST' },
  ]
  const OW = 80, OH = 22, OY = 152

  return (
    <g>
      {/* Source to center lines */}
      {sources.map(s => {
        const sx = s.x + SW / 2, sy = SY + SH
        return (
          <g key={s.label}>
            <DashLine x1={sx} y1={sy} x2={CX + CW / 2} y2={CY} accent={accent} />
            <Dot x={sx} y={sy} accent={accent} />
          </g>
        )
      })}

      {/* Center to output lines */}
      {outputs.map(o => {
        const ox = o.x + OW / 2
        return (
          <g key={o.label}>
            <DashLine x1={CX + CW / 2} y1={CY + CH} x2={ox} y2={OY} accent={accent} />
            <Dot x={ox} y={OY} accent={accent} />
          </g>
        )
      })}
      <Dot x={CX + CW / 2} y={CY + CH} accent={accent} />

      {/* Source nodes */}
      {sources.map(s => (
        <NodeRect key={s.label} x={s.x} y={SY} w={SW} h={SH} accent={accent} label={s.label} />
      ))}

      {/* Central dashboard */}
      <NodeRect x={CX} y={CY} w={CW} h={CH} accent={accent} label="DASHBOARD" glow />

      {/* Output tab nodes */}
      {outputs.map(o => (
        <NodeRect key={o.label} x={o.x} y={OY} w={OW} h={OH} accent={accent} label={o.label} />
      ))}
    </g>
  )
}

/* ── Pattern: launch ─────────────────────────────────────── */
function LaunchPattern({ accent }: { accent: string }) {
  const nodes = [
    { x: 48,  label: 'PLAN'   },
    { x: 182, label: 'BUILD'  },
    { x: 316, label: 'TEST'   },
    { x: 450, label: 'SHIP'   },
  ]
  const W = 90, H = 26, Y = 80, MY = 140

  return (
    <g>
      {nodes.map((n, i) => {
        const next = nodes[i + 1]
        const cx = n.x + W / 2
        return (
          <g key={n.label}>
            {next && (
              <>
                <DashLine x1={n.x + W} y1={Y + H / 2} x2={next.x} y2={Y + H / 2} accent={accent} />
                <Dot x={n.x + W} y={Y + H / 2} accent={accent} />
              </>
            )}
            {/* Milestone line */}
            <line x1={cx} y1={Y + H} x2={cx} y2={MY}
              stroke={accent} strokeOpacity={0.2} strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={cx} cy={MY} r={5}
              fill={accent} fillOpacity={0.15}
              stroke={accent} strokeOpacity={0.45} strokeWidth={1} />
            <NodeRect x={n.x} y={Y} w={W} h={H} accent={accent} label={n.label} glow={i === 3} />
          </g>
        )
      })}
    </g>
  )
}

/* ── Export ───────────────────────────────────────────────── */
export default function WorkflowPreview({ pattern, accent }: Props) {
  const gridId = `wfg-${accent.replace('#', '')}-${pattern}`

  return (
    <div style={{ width: '100%', height: 200, background: '#080808', overflow: 'hidden', position: 'relative' }}>
      <svg
        viewBox="0 0 560 200"
        width="100%"
        height="200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        <GridBg id={gridId} />
        {pattern === 'pipeline' && <PipelinePattern accent={accent} />}
        {pattern === 'hub'      && <HubPattern      accent={accent} />}
        {pattern === 'grid'     && <GridPattern     accent={accent} />}
        {pattern === 'branch'   && <BranchPattern   accent={accent} />}
        {pattern === 'funnel'   && <FunnelPattern   accent={accent} />}
        {pattern === 'launch'   && <LaunchPattern   accent={accent} />}
      </svg>
    </div>
  )
}
