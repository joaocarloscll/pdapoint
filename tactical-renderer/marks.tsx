/**
 * Marcadores desenhados sobre a quadra: jogadores, bola, trajetórias, zonas.
 *
 * Componentes pequenos e sem estado. Nenhuma regra tática vive aqui — eles
 * apenas desenham o que o engine informou (regra de dependência do documento
 * de arquitetura, seção 5).
 */

import type { CourtPoint } from '../tactical-engine/domain/types'
import { svgPathFor, toSvg } from './geometry'

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
    <g>
      <circle cx={cx} cy={cy} r={9} fill={color} opacity={0.25} />
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={color}
        stroke="#0f172a"
        strokeWidth={1}
      />
    </g>
  )
}

type TrajectoryProps = {
  readonly from: CourtPoint
  readonly to: CourtPoint
  /** 0 = reta. Valores maiores curvam a trajetória. */
  readonly arc?: number
  readonly color: string
  /**
   * Fração desenhada, 0→1. A linha acompanha a bola em vez de aparecer
   * inteira — é o que faz a trajetória ser lida como um golpe, e não como um
   * diagrama.
   */
  readonly progress?: number
  /** Trajetória "fantasma" da escolha do usuário, na comparação visual. */
  readonly ghost?: boolean
}

export function Trajectory({
  from,
  to,
  arc = 0.25,
  color,
  progress = 1,
  ghost = false,
}: TrajectoryProps) {
  const drawn = Math.min(1, Math.max(0, progress))

  return (
    <path
      d={svgPathFor(from, to, arc)}
      fill="none"
      stroke={color}
      strokeWidth={ghost ? 2 : 2.75}
      strokeLinecap="round"
      // pathLength normaliza o comprimento para 1, o que permite controlar o
      // traçado sem medir o caminho no DOM.
      pathLength={1}
      strokeDasharray={ghost ? '0.02 0.03' : 1}
      strokeDashoffset={ghost ? 0 : 1 - drawn}
      opacity={ghost ? 0.45 : 1}
    />
  )
}

type ZoneHighlightProps = {
  readonly at: CourtPoint
  readonly color: string
  readonly radius?: number
  readonly opacity?: number
}

export function ZoneHighlight({
  at,
  color,
  radius = 34,
  opacity = 1,
}: ZoneHighlightProps) {
  const { cx, cy } = toSvg(at)
  return (
    <circle
      cx={cx}
      cy={cy}
      r={radius}
      fill={color}
      opacity={0.22 * opacity}
      stroke={color}
      strokeWidth={1.5}
      strokeOpacity={0.5 * opacity}
    />
  )
}

type BounceMarkProps = {
  readonly at: CourtPoint
  readonly color: string
  /** 0 no instante do toque, 1 ao fim do quique. */
  readonly progress: number
}

/**
 * Marca o ponto em que a bola tocou a quadra.
 *
 * Um anel que expande e desvanece. É o sinal que diz "a bola quicou aqui" —
 * sem ele a bola apenas para no alvo, e o ponto não se lê como encerrado.
 */
export function BounceMark({ at, color, progress }: BounceMarkProps) {
  const t = Math.min(1, Math.max(0, progress))
  const { cx, cy } = toSvg(at)

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={4 + t * 16}
        fill="none"
        stroke={color}
        strokeWidth={2.5 * (1 - t) + 0.5}
        opacity={1 - t}
      />
      {/* Marca fina que permanece, indicando onde a bola caiu. */}
      <circle cx={cx} cy={cy} r={2.5} fill={color} opacity={0.9} />
    </g>
  )
}
