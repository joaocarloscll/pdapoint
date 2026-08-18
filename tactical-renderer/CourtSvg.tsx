/**
 * Quadra em SVG, vista de cima.
 *
 * O renderer converte coordenadas normalizadas (0..1) para o viewBox. Isso
 * mantém o mesmo cenário correto em qualquer resolução ou proporção, e é o que
 * permite que replay e temas funcionem sem recalcular conteúdo.
 */

import type { ReactNode } from 'react'

import { PAD_X, PAD_Y, VIEW_H, VIEW_W } from './geometry'
import type { CourtTheme } from './theme'

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
      // O SVG preenche a caixa e `preserveAspectRatio` (xMidYMid meet, o
      // padrão) encaixa o desenho dentro dela, centralizado e sem distorção.
      //
      // Escolhido em vez de aspect-ratio no CSS porque é o único mecanismo com
      // garantia idêntica em todo navegador: quando altura e largura estão
      // ambas restritas, aspect-ratio perde para a dimensão explícita e a
      // quadra sai estreita. Aqui a proporção é do SVG, não do layout.
      //
      // A proporção nunca é esticada: num produto sobre ângulos e distâncias,
      // uma quadra distorcida mentiria sobre para onde a bola foi.
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <title>{title}</title>

      <rect
        x={0}
        y={0}
        width={VIEW_W}
        height={VIEW_H}
        rx={14}
        fill={theme.courtOuter}
      />
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
