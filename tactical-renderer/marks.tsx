/**
 * Marcadores desenhados sobre a quadra: jogadores, bola, trajetórias, zonas.
 *
 * Componentes pequenos e sem estado. Nenhuma regra tática vive aqui — eles
 * apenas desenham o que o engine informou (regra de dependência do documento
 * de arquitetura, seção 5).
 */

import type { CourtPoint } from '../tactical-engine/domain/types'
import { toSvg } from './CourtSvg'

type PlayerMarkerProps = {
  readonly at: CourtPoint
  readonly color: string
  readonly label: string
  readonly recovering?: boolean
}

export function PlayerMarker({
  at,
  color,
  label,
  recovering = false,
}: PlayerMarkerProps) {
  const { cx, cy } = toSvg(at)
  return (
    <g>
      {recovering && (
        <circle cx={cx} cy={cy} r={16} fill={color} opacity={0.18} />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={9}
        fill={color}
        stroke="#0f172a"
        strokeWidth={1.5}
      />
      <text
        x={cx}
        y={cy + 3.5}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill="#0f172a"
      >
        {label}
      </text>
    </g>
  )
}

export function Ball({ at, color }: { at: CourtPoint; color: string }) {
  const { cx, cy } = toSvg(at)
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill={color}
      stroke="#0f172a"
      strokeWidth={1}
    />
  )
}

type TrajectoryProps = {
  readonly from: CourtPoint
  readonly to: CourtPoint
  /** 0 = reta. Valores maiores curvam a trajetória. */
  readonly arc?: number
  readonly color: string
  /** Trajetória "fantasma" da escolha do usuário, na comparação visual. */
  readonly ghost?: boolean
}

export function Trajectory({
  from,
  to,
  arc = 0.25,
  color,
  ghost = false,
}: TrajectoryProps) {
  const a = toSvg(from)
  const b = toSvg(to)

  // Ponto de controle deslocado perpendicularmente ao segmento, proporcional
  // ao comprimento — o arco acompanha a distância do golpe.
  const dx = b.cx - a.cx
  const dy = b.cy - a.cy
  const len = Math.hypot(dx, dy)
  const nx = len === 0 ? 0 : -dy / len
  const ny = len === 0 ? 0 : dx / len
  const offset = len * arc

  const ctrlX = (a.cx + b.cx) / 2 + nx * offset
  const ctrlY = (a.cy + b.cy) / 2 + ny * offset

  return (
    <path
      d={`M ${a.cx} ${a.cy} Q ${ctrlX} ${ctrlY} ${b.cx} ${b.cy}`}
      fill="none"
      stroke={color}
      strokeWidth={ghost ? 2 : 2.75}
      strokeLinecap="round"
      strokeDasharray={ghost ? '5 5' : undefined}
      opacity={ghost ? 0.5 : 1}
    />
  )
}

type ZoneHighlightProps = {
  readonly at: CourtPoint
  readonly color: string
  readonly radius?: number
}

export function ZoneHighlight({
  at,
  color,
  radius = 34,
}: ZoneHighlightProps) {
  const { cx, cy } = toSvg(at)
  return (
    <circle
      cx={cx}
      cy={cy}
      r={radius}
      fill={color}
      opacity={0.22}
      stroke={color}
      strokeWidth={1.5}
      strokeOpacity={0.5}
    />
  )
}
