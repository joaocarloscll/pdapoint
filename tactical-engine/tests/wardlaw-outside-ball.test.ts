import { describe, expect, it } from 'vitest'

import { wardlawOutsideBall001 } from '../../content/scenarios/wardlaw-outside-ball-001'
import { ANCHOR_IDS } from '../../content/evidence'
import { replay, startSession } from '../graph/traverse'
import { validateScenario } from '../validator/invariants'

describe('Golden Scenario 002 — bola externa em rally cruzado', () => {
  it('passa em todos os invariantes, inclusive contra o registro de âncoras', () => {
    const result = validateScenario(wardlawOutsideBall001, {
      knownAnchorIds: ANCHOR_IDS,
    })
    expect(result.issues).toEqual([])
    expect(result.valid).toBe(true)
  })

  it('inicia neutro: sem vantagem, sem recuperação marcada em nenhum jogador', () => {
    const result = startSession(wardlawOutsideBall001)
    if (!result.ok) throw new Error('cenário deveria iniciar')
    const s1 = wardlawOutsideBall001.states.find(
      (s) => s.id === result.value.currentStateId,
    )
    expect(s1?.advantage).toBe('neutral')
    expect(s1?.players.a.recovering).toBeUndefined()
    expect(s1?.players.b.recovering).toBeUndefined()
  })

  it('manter a diagonal (c1) é a escolha de maior probabilidade e vence o ponto', () => {
    const melhor = Math.max(
      ...wardlawOutsideBall001.choices.map((c) => c.winProbability.value),
    )
    const c1 = wardlawOutsideBall001.choices.find((c) => c.id === 'c1')
    expect(c1?.winProbability.value).toBe(melhor)

    const jogado = replay(wardlawOutsideBall001, ['c1'])
    if (!jogado.ok) throw new Error('c1 deveria ser válida')
    const estado = wardlawOutsideBall001.states.find(
      (s) => s.id === jogado.value.currentStateId,
    )
    expect(estado?.terminal).toBe('unforced_error_b')
  })

  it('mudar de direção sem vantagem (c2) é a pior escolha e perde o ponto', () => {
    const pior = Math.min(
      ...wardlawOutsideBall001.choices.map((c) => c.winProbability.value),
    )
    const c2 = wardlawOutsideBall001.choices.find((c) => c.id === 'c2')
    expect(c2?.winProbability.value).toBe(pior)

    const jogado = replay(wardlawOutsideBall001, ['c2'])
    if (!jogado.ok) throw new Error('c2 deveria ser válida')
    const estado = wardlawOutsideBall001.states.find(
      (s) => s.id === jogado.value.currentStateId,
    )
    expect(estado?.terminal).toBe('unforced_error_a')
  })

  it('diagonal certa sem profundidade (c3) entrega a bola e perde o ponto', () => {
    const jogado = replay(wardlawOutsideBall001, ['c3'])
    if (!jogado.ok) throw new Error('c3 deveria ser válida')
    const estado = wardlawOutsideBall001.states.find(
      (s) => s.id === jogado.value.currentStateId,
    )
    expect(estado?.terminal).toBe('winner_b')
  })

  it('nenhuma probabilidade cita âncora: Wardlaw não publica taxa de acerto', () => {
    // Diferente do cenário 001 (que tem uma âncora real e próxima do tema —
    // duração de rally), aqui não existe medição publicada para calibrar
    // contra. Forçar uma âncora aqui seria fingir uma proximidade que não
    // existe.
    for (const c of wardlawOutsideBall001.choices) {
      expect(c.winProbability.anchorId, c.id).toBeUndefined()
    }
  })

  it('a fonte é tier C, e a classificação nunca finge medição', () => {
    // Regra 1 de PRODUCT.md § 00.1: tier C/geral nunca vira "padrão" — aqui
    // isso se traduz em nenhuma explicação alegando taxa ou percentual.
    expect(wardlawOutsideBall001.source.tier).toBe('C')
    for (const c of wardlawOutsideBall001.choices) {
      expect(c.explanation).not.toMatch(/%/)
    }
  })
})
