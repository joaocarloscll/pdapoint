/**
 * Quadra em SVG, vista de cima.
 *
 * O renderer converte coordenadas normalizadas (0..1) para o viewBox. Isso
 * mantém o mesmo cenário correto em qualquer resolução ou proporção, e é o que
 * permite que replay e temas funcionem sem recalcular conteúdo.
 */

import type { ReactNode } from 'react'

import type { CourtPoint } from '../tactical-engine/domain/types'
import type { CourtTheme } from './theme'

/** Sistema de coordenadas interno do SVG. */
export const VIEW_W = 360
export const VIEW_H = 540

/** Margem entre a borda do SVG e a linha externa da quadra. */
const PAD_X = 24
const PAD_Y = 30

export const toSvg = (p: CourtPoint): { cx: number; cy: number } => ({
  cx: PAD_X + p.x * (VIEW_W - PAD_X * 2),
  cy: PAD_Y + p.y * (VIEW_H - PAD_Y * 2),
})

type CourtSvgProps = {
  readonly theme: CourtTheme
  /** Marcadores, bola e trajetórias desenhados sobre a quadra. */
  readonly children?: ReactNode
  readonly title: string
}

export function CourtSvg({ theme, children, title }: CourtSvgProps) {
  const left = PAD_X
  const right = VIEW_W - PAD_X
  const top = PAD_Y
  const bottom = VIEW_H - PAD_Y
  const midY = (top + bottom) / 2
  const width = right - left
  const height = bottom - top

  // Corredores de simples a 1/8 da largura de cada lado.
  const singlesInset = width / 8
  // Linha de saque a 1/4 da meia-quadra.
  const serviceInset = height / 4

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={title}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title>{title}</title>

      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill={theme.courtOuter} />
      <rect
        x={left}
        y={top}
        width={width}
        height={height}
        fill={theme.courtInner}
        stroke={theme.lines}
        strokeWidth={2}
      />

      {/* corredores de simples */}
      <line
        x1={left + singlesInset}
        y1={top}
        x2={left + singlesInset}
        y2={bottom}
        stroke={theme.lines}
        strokeWidth={1.5}
      />
      <line
        x1={right - singlesInset}
        y1={top}
        x2={right - singlesInset}
        y2={bottom}
        stroke={theme.lines}
        strokeWidth={1.5}
      />

      {/* linhas de saque */}
      <line
        x1={left + singlesInset}
        y1={midY - serviceInset}
        x2={right - singlesInset}
        y2={midY - serviceInset}
        stroke={theme.lines}
        strokeWidth={1.5}
      />
      <line
        x1={left + singlesInset}
        y1={midY + serviceInset}
        x2={right - singlesInset}
        y2={midY + serviceInset}
        stroke={theme.lines}
        strokeWidth={1.5}
      />
      {/* linha central de saque */}
      <line
        x1={(left + right) / 2}
        y1={midY - serviceInset}
        x2={(left + right) / 2}
        y2={midY + serviceInset}
        stroke={theme.lines}
        strokeWidth={1.5}
      />

      {/* rede */}
      <line
        x1={left - 8}
        y1={midY}
        x2={right + 8}
        y2={midY}
        stroke={theme.net}
        strokeWidth={3}
        strokeDasharray="3 3"
      />

      {children}
    </svg>
  )
}
