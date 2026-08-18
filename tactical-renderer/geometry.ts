/**
 * Geometria do renderer: conversão de coordenadas, curvas e easing.
 *
 * Todo cálculo de trajetória acontece em espaço SVG, porque o arco precisa
 * parecer correto na tela — em espaço normalizado a quadra não é quadrada e a
 * curva sairia distorcida. `fromSvg` devolve ao espaço normalizado quando o
 * resultado precisa voltar ao domínio.
 */

import type { CourtPoint, CourtZone, Easing } from '../tactical-engine/domain/types'

/**
 * Dimensões oficiais da quadra, em pés (Regras de Tênis da ITF).
 *
 * Ficam explícitas aqui porque a fidelidade geométrica é requisito de domínio,
 * não detalhe visual: o produto ensina o usuário a ler ângulo e distância na
 * quadra. Uma quadra fora de proporção ensina errado — um cruzado pareceria
 * mais aberto do que é.
 */
export const COURT_FEET = {
  length: 78,
  doublesWidth: 36,
  singlesWidth: 27,
  /** Distância da rede até a linha de saque. */
  serviceLineFromNet: 21,
} as const

/** Escala de desenho. Só afeta a resolução do viewBox, não a proporção. */
const PX_PER_FOOT = 6.5

/** Margem entre a borda do SVG e a linha externa da quadra. */
export const PAD_X = 23
export const PAD_Y = 26.5

/** Sistema de coordenadas interno do SVG, derivado das medidas reais. */
export const COURT_W = COURT_FEET.doublesWidth * PX_PER_FOOT
export const COURT_H = COURT_FEET.length * PX_PER_FOOT
export const VIEW_W = COURT_W + PAD_X * 2
export const VIEW_H = COURT_H + PAD_Y * 2

const SPAN_X = VIEW_W - PAD_X * 2
const SPAN_Y = VIEW_H - PAD_Y * 2

export type SvgPoint = { readonly cx: number; readonly cy: number }

export const toSvg = (p: CourtPoint): SvgPoint => ({
  cx: PAD_X + p.x * SPAN_X,
  cy: PAD_Y + p.y * SPAN_Y,
})

export const fromSvg = (p: SvgPoint): CourtPoint => ({
  x: (p.cx - PAD_X) / SPAN_X,
  y: (p.cy - PAD_Y) / SPAN_Y,
})

/**
 * Ponto de controle da curva quadrática que representa a trajetória da bola.
 *
 * Deslocado perpendicularmente ao segmento e proporcional ao seu comprimento,
 * de modo que o arco acompanhe a distância do golpe.
 *
 * Usado tanto para desenhar o caminho quanto para percorrê-lo na animação —
 * os dois precisam da mesma curva, ou a bola sairia de cima da linha.
 */
export function controlPoint(
  from: SvgPoint,
  to: SvgPoint,
  arc: number,
): SvgPoint {
  const dx = to.cx - from.cx
  const dy = to.cy - from.cy
  const len = Math.hypot(dx, dy)
  if (len === 0) return from

  const nx = -dy / len
  const ny = dx / len
  const offset = len * arc

  return {
    cx: (from.cx + to.cx) / 2 + nx * offset,
    cy: (from.cy + to.cy) / 2 + ny * offset,
  }
}

/** Ponto sobre a curva quadrática de Bézier, em t ∈ [0,1]. */
export function quadraticAt(
  from: SvgPoint,
  ctrl: SvgPoint,
  to: SvgPoint,
  t: number,
): SvgPoint {
  const u = 1 - t
  return {
    cx: u * u * from.cx + 2 * u * t * ctrl.cx + t * t * to.cx,
    cy: u * u * from.cy + 2 * u * t * ctrl.cy + t * t * to.cy,
  }
}

export function svgPathFor(
  from: CourtPoint,
  to: CourtPoint,
  arc: number,
): string {
  const a = toSvg(from)
  const b = toSvg(to)
  const c = controlPoint(a, b, arc)
  return `M ${a.cx} ${a.cy} Q ${c.cx} ${c.cy} ${b.cx} ${b.cy}`
}

/** Interpolação linear entre dois pontos normalizados. */
export const lerpPoint = (
  from: CourtPoint,
  to: CourtPoint,
  t: number,
): CourtPoint => ({
  x: from.x + (to.x - from.x) * t,
  y: from.y + (to.y - from.y) * t,
})

const EASINGS: Record<Easing, (t: number) => number> = {
  linear: (t) => t,
  'ease-in': (t) => t * t,
  'ease-out': (t) => 1 - (1 - t) * (1 - t),
  'ease-in-out': (t) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
}

export const ease = (kind: Easing, t: number): number =>
  EASINGS[kind](Math.min(1, Math.max(0, t)))

/**
 * Centro aproximado de uma zona nomeada, para posicionar o destaque visual.
 *
 * Espelha as faixas usadas por `zoneOf` nos guardrails: três faixas laterais e
 * três de profundidade.
 */
export function zoneCenter(zone: CourtZone): CourtPoint {
  const lateral = zone.startsWith('net-')
    ? zone.slice(4)
    : zone.slice(0, zone.lastIndexOf('-'))

  const x = lateral === 'deuce' ? 0.165 : lateral === 'center' ? 0.5 : 0.835
  const y = zone.startsWith('net-') ? 0.125 : zone.endsWith('-deep') ? 0.825 : 0.45

  return { x, y }
}
