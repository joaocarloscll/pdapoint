import { describe, expect, it } from 'vitest'

import { golden001 } from '../../content/scenarios/golden-001'
import type { TimelineEvent } from '../../tactical-engine/domain/types'
import { controlPoint, ease, fromSvg, toSvg, zoneCenter } from '../geometry'
import {
  quantizeForReducedMotion,
  sampleTimeline,
  timelineDuration,
  type FrameBase,
} from '../timeline'

const base: FrameBase = {
  ball: { x: 0.5, y: 0.5 },
  playerA: { x: 0.5, y: 0.8 },
  playerB: { x: 0.5, y: 0.2 },
}

const ballMove: TimelineEvent = {
  kind: 'move-ball',
  startMs: 0,
  durationMs: 1000,
  from: { x: 0.2, y: 0.8 },
  to: { x: 0.8, y: 0.2 },
  arc: 0,
  easing: 'linear',
}

describe('geometria', () => {
  it('toSvg e fromSvg são inversas', () => {
    const p = { x: 0.37, y: 0.62 }
    const back = fromSvg(toSvg(p))
    expect(back.x).toBeCloseTo(p.x, 10)
    expect(back.y).toBeCloseTo(p.y, 10)
  })

  it('arc 0 mantém o ponto de controle sobre o segmento', () => {
    const a = toSvg({ x: 0.2, y: 0.8 })
    const b = toSvg({ x: 0.8, y: 0.2 })
    const c = controlPoint(a, b, 0)
    expect(c.cx).toBeCloseTo((a.cx + b.cx) / 2, 10)
    expect(c.cy).toBeCloseTo((a.cy + b.cy) / 2, 10)
  })

  it('easing é limitado a [0,1]', () => {
    expect(ease('ease-out', -1)).toBe(0)
    expect(ease('ease-in', 5)).toBe(1)
    expect(ease('linear', 0.5)).toBeCloseTo(0.5, 10)
  })

  it('zoneCenter devolve pontos dentro da quadra', () => {
    for (const zone of ['deuce-deep', 'center-short', 'net-ad'] as const) {
      const p = zoneCenter(zone)
      expect(p.x).toBeGreaterThan(0)
      expect(p.x).toBeLessThan(1)
      expect(p.y).toBeGreaterThan(0)
      expect(p.y).toBeLessThan(1)
    }
  })
})

describe('sampleTimeline', () => {
  it('em t=0 a bola está na origem do golpe', () => {
    const frame = sampleTimeline([ballMove], base, 0)
    expect(frame.ball.x).toBeCloseTo(0.2, 6)
    expect(frame.ball.y).toBeCloseTo(0.8, 6)
    expect(frame.ballProgress).toBe(0)
  })

  it('no fim a bola está no destino', () => {
    const frame = sampleTimeline([ballMove], base, 1000)
    expect(frame.ball.x).toBeCloseTo(0.8, 6)
    expect(frame.ball.y).toBeCloseTo(0.2, 6)
    expect(frame.ballProgress).toBe(1)
  })

  it('no meio a bola está entre origem e destino', () => {
    const frame = sampleTimeline([ballMove], base, 500)
    expect(frame.ball.x).toBeGreaterThan(0.2)
    expect(frame.ball.x).toBeLessThan(0.8)
    expect(frame.ballProgress).toBeCloseTo(0.5, 6)
  })

  it('mantém o destino depois do fim da timeline', () => {
    const later = sampleTimeline([ballMove], base, 99_999)
    expect(later.ball.x).toBeCloseTo(0.8, 6)
  })

  it('mantém a base antes de o evento começar', () => {
    const delayed: TimelineEvent = { ...ballMove, startMs: 500 }
    const frame = sampleTimeline([delayed], base, 100)
    expect(frame.ball.x).toBeCloseTo(0.2, 6)
  })

  it('desloca o jogador indicado, e só ele', () => {
    const move: TimelineEvent = {
      kind: 'move-player',
      startMs: 0,
      durationMs: 100,
      player: 'b',
      from: { x: 0.2, y: 0.2 },
      to: { x: 0.9, y: 0.2 },
      easing: 'linear',
    }
    const frame = sampleTimeline([move], base, 100)
    expect(frame.playerB.x).toBeCloseTo(0.9, 6)
    expect(frame.playerA).toEqual(base.playerA)
  })

  it('a zona só fica ativa dentro da sua janela', () => {
    const highlight: TimelineEvent = {
      kind: 'highlight-zone',
      startMs: 200,
      durationMs: 800,
      zone: 'ad-deep',
      tone: 'opportunity',
    }
    expect(sampleTimeline([highlight], base, 100).activeZone).toBeNull()
    expect(sampleTimeline([highlight], base, 600).activeZone?.zone).toBe('ad-deep')
    expect(sampleTimeline([highlight], base, 1200).activeZone).toBeNull()
  })

  it('é determinística — o mesmo instante dá o mesmo quadro', () => {
    const a = sampleTimeline([ballMove], base, 372)
    const b = sampleTimeline([ballMove], base, 372)
    expect(a).toEqual(b)
  })
})

describe('duração e movimento reduzido', () => {
  it('duração é o fim do último evento', () => {
    expect(timelineDuration([ballMove])).toBe(1000)
    expect(timelineDuration([])).toBe(0)
  })

  it('quantiza o tempo em posições-chave discretas', () => {
    expect(quantizeForReducedMotion(0, 1000)).toBe(0)
    expect(quantizeForReducedMotion(260, 1000)).toBe(250)
    expect(quantizeForReducedMotion(1000, 1000)).toBe(1000)
  })

  it('nunca ultrapassa a duração total', () => {
    expect(quantizeForReducedMotion(5000, 1000)).toBe(1000)
  })
})

describe('timelines do cenário canônico', () => {
  it('toda transição tem duração positiva e um golpe de bola', () => {
    for (const transition of golden001.transitions) {
      expect(timelineDuration(transition.timeline)).toBeGreaterThan(0)
      expect(
        transition.timeline.some((e) => e.kind === 'move-ball'),
      ).toBe(true)
    }
  })

  it('o quadro final coincide com o estado de destino do engine', () => {
    for (const transition of golden001.transitions) {
      const from = golden001.states.find((s) => s.id === transition.fromStateId)
      const to = golden001.states.find((s) => s.id === transition.toStateId)
      if (from === undefined || to === undefined) throw new Error('estado ausente')

      const frame = sampleTimeline(
        transition.timeline,
        {
          ball: from.ball,
          playerA: from.players.a.position,
          playerB: from.players.b.position,
        },
        timelineDuration(transition.timeline),
      )

      expect(frame.ball.x).toBeCloseTo(to.ball.x, 6)
      expect(frame.ball.y).toBeCloseTo(to.ball.y, 6)
      expect(frame.playerB.x).toBeCloseTo(to.players.b.position.x, 6)
      expect(frame.playerB.y).toBeCloseTo(to.players.b.position.y, 6)
    }
  })
})
