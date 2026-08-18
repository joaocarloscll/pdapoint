import { describe, expect, it } from 'vitest'

import { golden001 } from '../../content/scenarios/golden-001'
import type { TacticalChoice } from '../domain/types'
import {
  accuracyOf,
  bestProbabilityOf,
  evaluateChoice,
  qualityForLoss,
  rankChoices,
} from '../scoring/evaluate'

const escolha = (id: string, value: number): TacticalChoice => ({
  id,
  stateId: 's1',
  label: id,
  shotIntent: 'attack',
  winProbability: { value, basis: 'estimated', note: 'teste' },
  explanation: '',
})

describe('faixas de qualidade', () => {
  it('perda zero é a melhor escolha', () => {
    expect(qualityForLoss(0)).toBe('melhor')
  })

  it('a escala degrada de forma monotônica', () => {
    const ordem = [
      'melhor',
      'excelente',
      'boa',
      'imprecisao',
      'erro',
      'erro-grave',
    ]
    const perdas = [0, 0.02, 0.06, 0.12, 0.2, 0.5]
    const obtidas = perdas.map(qualityForLoss)

    // Cada perda maior nunca produz qualidade melhor que a anterior.
    const posicoes = obtidas.map((q) => ordem.indexOf(q))
    for (let i = 1; i < posicoes.length; i++) {
      expect(posicoes[i]!).toBeGreaterThanOrEqual(posicoes[i - 1]!)
    }
    expect(obtidas).toEqual(ordem)
  })

  it('as bordas de faixa caem na faixa mais generosa', () => {
    expect(qualityForLoss(0.03)).toBe('excelente')
    expect(qualityForLoss(0.08)).toBe('boa')
    expect(qualityForLoss(0.15)).toBe('imprecisao')
    expect(qualityForLoss(0.25)).toBe('erro')
  })
})

describe('avaliação de uma escolha', () => {
  const opcoes = [escolha('a', 0.8), escolha('b', 0.6), escolha('c', 0.3)]

  it('a melhor opção não tem perda', () => {
    const ev = evaluateChoice(opcoes[0]!, opcoes)
    expect(ev.loss).toBe(0)
    expect(ev.quality).toBe('melhor')
    expect(ev.bestProbability).toBeCloseTo(0.8, 6)
  })

  it('a perda é a distância até a melhor disponível', () => {
    const ev = evaluateChoice(opcoes[1]!, opcoes)
    expect(ev.loss).toBeCloseTo(0.2, 6)
    expect(ev.quality).toBe('erro')
  })

  it('compara com o que estava disponível, não com um ideal abstrato', () => {
    // A mesma escolha de 0.6 é "melhor" quando não há nada acima dela.
    const semMelhores = [opcoes[1]!, opcoes[2]!]
    expect(evaluateChoice(opcoes[1]!, semMelhores).quality).toBe('melhor')
  })

  it('reporta a procedência mais fraca entre as opções comparadas', () => {
    const medida: TacticalChoice = {
      ...escolha('m', 0.9),
      winProbability: { value: 0.9, basis: 'measured', note: 'x' },
    }
    const ev = evaluateChoice(medida, [medida, opcoes[0]!])
    expect(ev.basis).toBe('estimated')
  })
})

describe('ranking', () => {
  it('ordena da maior para a menor probabilidade', () => {
    const r = rankChoices([escolha('c', 0.3), escolha('a', 0.8), escolha('b', 0.6)])
    expect(r.map((e) => e.choiceId)).toEqual(['a', 'b', 'c'])
    expect(r[0]?.quality).toBe('melhor')
  })

  it('bestProbabilityOf é a maior do conjunto', () => {
    expect(bestProbabilityOf([escolha('a', 0.4), escolha('b', 0.7)])).toBeCloseTo(
      0.7,
      6,
    )
    expect(bestProbabilityOf([])).toBe(0)
  })
})

describe('precisão da sessão', () => {
  const opcoes = [escolha('a', 0.8), escolha('b', 0.6)]

  it('escolher sempre a melhor dá 100', () => {
    const ev = evaluateChoice(opcoes[0]!, opcoes)
    expect(accuracyOf([ev, ev])).toBeCloseTo(100, 6)
  })

  it('reflete o quanto se reteve da melhor opção', () => {
    // 0.6 de 0.8 retém 75%.
    const ev = evaluateChoice(opcoes[1]!, opcoes)
    expect(accuracyOf([ev])).toBeCloseTo(75, 6)
  })

  it('sem decisões, a precisão é zero', () => {
    expect(accuracyOf([])).toBe(0)
  })

  it('é a média das decisões', () => {
    const boa = evaluateChoice(opcoes[0]!, opcoes)
    const ruim = evaluateChoice(opcoes[1]!, opcoes)
    expect(accuracyOf([boa, ruim])).toBeCloseTo((100 + 75) / 2, 6)
  })
})

describe('cenário canônico', () => {
  it('toda escolha declara probabilidade dentro de 0–1 e o que a sustenta', () => {
    for (const c of golden001.choices) {
      expect(c.winProbability.value).toBeGreaterThanOrEqual(0)
      expect(c.winProbability.value).toBeLessThanOrEqual(1)
      expect(c.winProbability.note.trim().length).toBeGreaterThan(0)
    }
  })

  it('não há empate entre as opções', () => {
    // Toda jogada tem uma chance diferente de dar certo: empate exato
    // esconderia uma diferença que apenas não foi medida.
    const valores = golden001.choices.map((c) => c.winProbability.value)
    expect(new Set(valores).size).toBe(valores.length)
  })

  it('a qualidade derivada distingue as três opções', () => {
    const qualidades = rankChoices(golden001.choices).map((e) => e.quality)
    expect(qualidades[0]).toBe('melhor')
    expect(new Set(qualidades).size).toBeGreaterThan(1)
  })
})
