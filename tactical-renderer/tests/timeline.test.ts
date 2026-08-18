import { describe, expect, it } from 'vitest'

import { golden001 } from '../../content/scenarios/golden-001'
import { zoneOf } from '../../tactical-engine/graph/guardrails'
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
    for (const zone of [
      'opp-left-deep',
      'own-center-short',
      'opp-right-deep',
      'own-right-deep',
    ] as const) {
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

/**
 * `zoneOf` e `zoneCenter` precisam concordar.
 *
 * Quando discordavam, o destaque visual aparecia na metade errada da quadra:
 * a bola caía no fundo do adversário e o brilho acendia atrás do jogador.
 * O bug era invisível no código — só aparecia olhando a tela.
 */
describe('zoneOf e zoneCenter são consistentes', () => {
  const TODAS = [
    'opp-left-deep',
    'opp-center-deep',
    'opp-right-deep',
    'opp-left-short',
    'opp-center-short',
    'opp-right-short',
    'own-left-short',
    'own-center-short',
    'own-right-short',
    'own-left-deep',
    'own-center-deep',
    'own-right-deep',
  ] as const

  it('o centro de uma zona pertence a essa mesma zona', () => {
    for (const zone of TODAS) {
      expect(zoneOf(zoneCenter(zone))).toBe(zone)
    }
  })

  it('a metade do adversário fica antes da rede e a nossa depois', () => {
    for (const zone of TODAS) {
      const p = zoneCenter(zone)
      if (zone.startsWith('opp-')) expect(p.y).toBeLessThan(0.5)
      else expect(p.y).toBeGreaterThan(0.5)
    }
  })

  it('o fundo de cada metade é o mais distante da rede', () => {
    expect(zoneCenter('opp-center-deep').y).toBeLessThan(
      zoneCenter('opp-center-short').y,
    )
    expect(zoneCenter('own-center-deep').y).toBeGreaterThan(
      zoneCenter('own-center-short').y,
    )
  })

  it('classifica os cantos corretamente', () => {
    expect(zoneOf({ x: 0.1, y: 0.05 })).toBe('opp-left-deep')
    expect(zoneOf({ x: 0.9, y: 0.05 })).toBe('opp-right-deep')
    expect(zoneOf({ x: 0.1, y: 0.95 })).toBe('own-left-deep')
    expect(zoneOf({ x: 0.9, y: 0.95 })).toBe('own-right-deep')
    // Junto à rede, dos dois lados.
    expect(zoneOf({ x: 0.5, y: 0.45 })).toBe('opp-center-short')
    expect(zoneOf({ x: 0.5, y: 0.55 })).toBe('own-center-short')
  })
})

/**
 * O quique fecha o ponto: a bola toca a quadra e sai.
 */
describe('quique', () => {
  it('fica ativo apenas dentro da própria janela', () => {
    const q: TimelineEvent = {
      kind: 'bounce',
      startMs: 200,
      durationMs: 400,
      at: { x: 0.8, y: 0.1 },
    }
    expect(sampleTimeline([q], base, 100).bounce).toBeNull()
    expect(sampleTimeline([q], base, 400).bounce?.at.x).toBeCloseTo(0.8, 6)
    expect(sampleTimeline([q], base, 700).bounce).toBeNull()
  })

  it('o progresso vai de 0 a 1 ao longo do quique', () => {
    const q: TimelineEvent = {
      kind: 'bounce',
      startMs: 0,
      durationMs: 400,
      at: { x: 0.5, y: 0.5 },
    }
    expect(sampleTimeline([q], base, 0).bounce?.progress).toBeCloseTo(0, 6)
    expect(sampleTimeline([q], base, 200).bounce?.progress).toBeCloseTo(0.5, 6)
    expect(sampleTimeline([q], base, 400).bounce?.progress).toBeCloseTo(1, 6)
  })

  it('toda transição do cenário termina com quique e saída da bola', () => {
    for (const t of golden001.transitions) {
      const quiques = t.timeline.filter((e) => e.kind === 'bounce')
      expect(quiques.length).toBeGreaterThan(0)

      // O último golpe começa depois do quique: é a bola saindo.
      const golpes = t.timeline.filter((e) => e.kind === 'move-ball')
      const ultimoGolpe = golpes[golpes.length - 1]!
      const ultimoQuique = quiques[quiques.length - 1]!
      expect(ultimoGolpe.startMs).toBeGreaterThanOrEqual(ultimoQuique.startMs)
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
      zone: 'opp-right-deep',
      tone: 'opportunity',
    }
    expect(sampleTimeline([highlight], base, 100).activeZone).toBeNull()
    expect(sampleTimeline([highlight], base, 600).activeZone?.zone).toBe('opp-right-deep')
    expect(sampleTimeline([highlight], base, 1200).activeZone).toBeNull()
  })

  it('é determinística — o mesmo instante dá o mesmo quadro', () => {
    const a = sampleTimeline([ballMove], base, 372)
    const b = sampleTimeline([ballMove], base, 372)
    expect(a).toEqual(b)
  })
})

/**
 * Transições com dois golpes — o seu e a resposta do adversário.
 *
 * Foi aqui que a primeira versão errou: o renderer desenhava a trajetória do
 * primeiro golpe animada pelo progresso do segundo.
 */
describe('transição com dois golpes', () => {
  const golpe1: TimelineEvent = {
    kind: 'move-ball',
    startMs: 0,
    durationMs: 500,
    from: { x: 0.6, y: 0.6 },
    to: { x: 0.2, y: 0.4 },
    arc: 0,
    easing: 'linear',
  }
  const golpe2: TimelineEvent = {
    kind: 'move-ball',
    startMs: 800,
    durationMs: 500,
    from: { x: 0.2, y: 0.4 },
    to: { x: 0.9, y: 0.8 },
    arc: 0,
    easing: 'linear',
  }
  const dois = [golpe1, golpe2]

  it('expõe os dois golpes, cada um com seu progresso', () => {
    const frame = sampleTimeline(dois, base, 250)
    expect(frame.shots).toHaveLength(2)
    expect(frame.shots[0]?.progress).toBeCloseTo(0.5, 6)
    expect(frame.shots[1]?.progress).toBe(0)
  })

  it('durante o segundo golpe, o primeiro já está inteiro', () => {
    const frame = sampleTimeline(dois, base, 1050)
    expect(frame.shots[0]?.progress).toBe(1)
    expect(frame.shots[1]?.progress).toBeCloseTo(0.5, 6)
  })

  it('a bola segue o golpe em curso, não o seguinte', () => {
    // Em t=250 o segundo golpe ainda não saiu: a bola tem de estar no primeiro.
    const meio1 = sampleTimeline(dois, base, 250)
    expect(meio1.ball.x).toBeGreaterThan(0.2)
    expect(meio1.ball.x).toBeLessThan(0.6)

    // No intervalo entre os golpes, fica onde o primeiro a deixou.
    const entre = sampleTimeline(dois, base, 700)
    expect(entre.ball.x).toBeCloseTo(0.2, 6)
    expect(entre.ball.y).toBeCloseTo(0.4, 6)

    // Durante o segundo, já percorre a segunda trajetória.
    const meio2 = sampleTimeline(dois, base, 1050)
    expect(meio2.ball.x).toBeGreaterThan(0.2)
    expect(meio2.ball.y).toBeGreaterThan(0.4)
  })

  it('antes de tudo começar, a bola está na origem do primeiro golpe', () => {
    const frame = sampleTimeline(dois, base, 0)
    expect(frame.ball.x).toBeCloseTo(0.6, 6)
    expect(frame.ball.y).toBeCloseTo(0.6, 6)
  })

  it('no fim, a bola está no destino do último golpe', () => {
    const frame = sampleTimeline(dois, base, 1300)
    expect(frame.ball.x).toBeCloseTo(0.9, 6)
    expect(frame.ball.y).toBeCloseTo(0.8, 6)
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

  it('o estado de destino registra onde a bola quicou, não onde ela saiu', () => {
    // A animação segue além do quique — a bola sai de quadra — mas o estado
    // guarda o ponto de toque, que é onde o ponto foi decidido. Ancorar a
    // verificação no último quadro passaria a cobrar do engine uma posição
    // que é só acompanhamento visual.
    for (const transition of golden001.transitions) {
      const to = golden001.states.find((s) => s.id === transition.toStateId)
      if (to === undefined) throw new Error('estado ausente')

      const quiques = transition.timeline.filter((e) => e.kind === 'bounce')
      const ultimo = quiques[quiques.length - 1]
      if (ultimo === undefined || ultimo.kind !== 'bounce') {
        throw new Error('transição sem quique')
      }

      expect(ultimo.at.x).toBeCloseTo(to.ball.x, 6)
      expect(ultimo.at.y).toBeCloseTo(to.ball.y, 6)
    }
  })

  it('as posições dos jogadores no fim coincidem com o estado de destino', () => {
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

      expect(frame.playerA.x).toBeCloseTo(to.players.a.position.x, 6)
      expect(frame.playerA.y).toBeCloseTo(to.players.a.position.y, 6)
      expect(frame.playerB.x).toBeCloseTo(to.players.b.position.x, 6)
      expect(frame.playerB.y).toBeCloseTo(to.players.b.position.y, 6)
    }
  })
})
