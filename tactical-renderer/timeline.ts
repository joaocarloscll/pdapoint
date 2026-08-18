/**
 * Amostragem da timeline de uma transição.
 *
 * Separado do loop de animação de propósito: amostrar é uma função pura do
 * tempo decorrido, portanto testável sem navegador. O hook apenas fornece o
 * relógio.
 */

import type {
  CourtPoint,
  CourtZone,
  TimelineEvent,
} from '../tactical-engine/domain/types'
import {
  controlPoint,
  ease,
  fromSvg,
  lerpPoint,
  quadraticAt,
  toSvg,
} from './geometry'

export type TimelineFrame = {
  readonly ball: CourtPoint
  readonly playerA: CourtPoint
  readonly playerB: CourtPoint
  /**
   * Fração da trajetória já percorrida, 0→1. Alimenta o desenho progressivo:
   * a linha se desenha conforme a bola avança, em vez de aparecer inteira.
   */
  readonly ballProgress: number
  readonly activeZone: {
    readonly zone: CourtZone
    readonly tone: 'opportunity' | 'risk'
    readonly opacity: number
  } | null
}

export type FrameBase = {
  readonly ball: CourtPoint
  readonly playerA: CourtPoint
  readonly playerB: CourtPoint
}

export function timelineDuration(
  timeline: readonly TimelineEvent[],
): number {
  return timeline.reduce(
    (max, e) => Math.max(max, e.startMs + e.durationMs),
    0,
  )
}

/** Progresso de um evento no instante `elapsed`, já com easing aplicado. */
function progressOf(
  event: TimelineEvent,
  elapsed: number,
  easing: Parameters<typeof ease>[0],
): number {
  if (elapsed <= event.startMs) return 0
  if (elapsed >= event.startMs + event.durationMs) return 1
  if (event.durationMs === 0) return 1
  return ease(easing, (elapsed - event.startMs) / event.durationMs)
}

/**
 * Estado visual da quadra num instante da transição.
 *
 * Antes de um evento começar, mantém a posição de origem; depois que termina,
 * mantém a de destino. Assim o resultado é estável em qualquer ponto do tempo,
 * o que é o que torna replay e scrubbing triviais.
 */
export function sampleTimeline(
  timeline: readonly TimelineEvent[],
  base: FrameBase,
  elapsedMs: number,
): TimelineFrame {
  let ball = base.ball
  let playerA = base.playerA
  let playerB = base.playerB
  let ballProgress = 0
  let activeZone: TimelineFrame['activeZone'] = null

  for (const event of timeline) {
    switch (event.kind) {
      case 'move-ball': {
        const t = progressOf(event, elapsedMs, event.easing)
        const a = toSvg(event.from)
        const b = toSvg(event.to)
        ball = fromSvg(quadraticAt(a, controlPoint(a, b, event.arc), b, t))
        ballProgress = t
        break
      }

      case 'move-player': {
        const t = progressOf(event, elapsedMs, event.easing)
        const position = lerpPoint(event.from, event.to, t)
        if (event.player === 'a') playerA = position
        else playerB = position
        break
      }

      case 'highlight-zone': {
        const start = event.startMs
        const end = event.startMs + event.durationMs
        if (elapsedMs < start || elapsedMs > end) break

        // Entra e sai suavemente, para o destaque não piscar na tela.
        const fade = Math.min(240, event.durationMs / 2)
        const opacity =
          fade === 0
            ? 1
            : Math.min(
                1,
                Math.min(elapsedMs - start, end - elapsedMs) / fade,
              )

        activeZone = { zone: event.zone, tone: event.tone, opacity }
        break
      }

      // Contribuem para a duração total, mas não alteram o quadro.
      case 'pause':
      case 'show-arrow':
      case 'annotation':
        break
    }
  }

  return { ball, playerA, playerB, ballProgress, activeZone }
}

/**
 * Quantiza o tempo para movimento reduzido.
 *
 * A animação é o argumento pedagógico e não pode simplesmente sumir
 * (PRODUCT.md § 03). Com `prefers-reduced-motion`, mantemos a sequência e as
 * mudanças de posição, mas trocamos o movimento contínuo por posições-chave
 * discretas.
 */
export const REDUCED_MOTION_STEPS = 4

export function quantizeForReducedMotion(
  elapsedMs: number,
  totalMs: number,
): number {
  if (totalMs <= 0) return elapsedMs
  const step = totalMs / REDUCED_MOTION_STEPS
  return Math.min(totalMs, Math.round(elapsedMs / step) * step)
}
