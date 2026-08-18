import { describe, expect, it } from 'vitest'

import { golden001 } from '../../content/scenarios/golden-001'
import type { TimelineEvent } from '../../tactical-engine/domain/types'
import {
  COURT_FEET,
  COURT_H,
  COURT_W,
  controlPoint,
  ease,
  fromSvg,
  PAD_X,
  PAD_Y,
  toSvg,
  VIEW_H,
  VIEW_W,
  zoneCenter,
} from '../geometry'
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

/**
 * A quadra desenhada precisa ser a quadra real.
 *
 * Não é preciosismo visual: o produto ensina o usuário a ler ângulo e
 * distância na quadra. Uma quadra fora de proporção ensina errado, e o erro
 * seria invisível — o desenho continuaria "parecendo uma quadra".
 */
describe('fidelidade geométrica da quadra', () => {
  it('a proporção é a da quadra de duplas — 36 × 78 pés', () => {
    const real = COURT_FEET.doublesWidth / COURT_FEET.length
    expect(COURT_W / COURT_H).toBeCloseTo(real, 6)
    expect(real).toBeCloseTo(0.4615, 4)
  })

  it('o viewBox comporta a quadra mais as margens', () => {
    expect(VIEW_W).toBeCloseTo(COURT_W + PAD_X * 2, 6)
    expect(VIEW_H).toBeCloseTo(COURT_H + PAD_Y * 2, 6)
  })

  it('as coordenadas normalizadas cobrem exatamente a quadra', () => {
    const canto = toSvg({ x: 0, y: 0 })
    const oposto = toSvg({ x: 1, y: 1 })
    expect(canto.cx).toBeCloseTo(PAD_X, 6)
    expect(canto.cy).toBeCloseTo(PAD_Y, 6)
    expect(oposto.cx - canto.cx).toBeCloseTo(COURT_W, 6)
    expect(oposto.cy - canto.cy).toBeCloseTo(COURT_H, 6)
  })

  it('a quadra de simples é 27/36 da de duplas', () => {
    const inset =
      (COURT_W * (COURT_FEET.doublesWidth - COURT_FEET.singlesWidth)) /
      (2 * COURT_FEET.doublesWidth)
    const larguraSimples = COURT_W - inset * 2
    expect(larguraSimples / COURT_W).toBeCloseTo(
      COURT_FEET.singlesWidth / COURT_FEET.doublesWidth,
      6,
    )
    expect(larguraSimples / COURT_W).toBeCloseTo(0.75, 6)
  })

  it('a linha de saque fica a 21 pés da rede', () => {
    const inset = (COURT_H * COURT_FEET.serviceLineFromNet) / COURT_FEET.length
    const meiaQuadra = COURT_H / 2
    expect(inset / meiaQuadra).toBeCloseTo(
      COURT_FEET.serviceLineFromNet / (COURT_FEET.length / 2),
      6,
    )
  })

  it('o meio da quadra em y = 0,5 é a rede', () => {
    const rede = toSvg({ x: 0.5, y: 0.5 })
    expect(rede.cy).toBeCloseTo(PAD_Y + COURT_H / 2, 6)
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
