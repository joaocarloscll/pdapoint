import { describe, expect, it } from 'vitest'

import { ANCHOR_IDS } from '../../content/evidence'
import { secondServeReturn001 } from '../../content/scenarios/second-serve-return-001'
import { replay, startSession } from '../graph/traverse'
import { validateScenario } from '../validator/invariants'

describe('Golden Scenario 003 — devolução de segundo saque', () => {
  it('passa em todos os invariantes, inclusive contra o registro de âncoras', () => {
    const result = validateScenario(secondServeReturn001, {
      knownAnchorIds: ANCHOR_IDS,
    })
    expect(result.issues).toEqual([])
    expect(result.valid).toBe(true)
  })

  it('é o primeiro cenário na fase de devolução, sem deslocamento de B', () => {
    const result = startSession(secondServeReturn001)
    if (!result.ok) throw new Error('cenário deveria iniciar')
    const s1 = secondServeReturn001.states.find(
      (s) => s.id === result.value.currentStateId,
    )
    expect(s1?.phase).toBe('return')
    expect(s1?.advantage).toBe('neutral')
    // A vantagem aqui é estatística (segundo saque), não posicional: B não
    // está deslocado nem em recuperação, diferente dos cenários 001 e 002.
    expect(s1?.players.b.recovering).toBeUndefined()
  })

  it('avançar e devolver fundo (c1) é a escolha de maior probabilidade e vence', () => {
    const melhor = Math.max(
      ...secondServeReturn001.choices.map((c) => c.winProbability.value),
    )
    const c1 = secondServeReturn001.choices.find((c) => c.id === 'c1')
    expect(c1?.winProbability.value).toBe(melhor)

    const jogado = replay(secondServeReturn001, ['c1'])
    if (!jogado.ok) throw new Error('c1 deveria ser válida')
    const estado = secondServeReturn001.states.find(
      (s) => s.id === jogado.value.currentStateId,
    )
    expect(estado?.terminal).toBe('unforced_error_b')
  })

  it('bloquear sem risco (c3) e forçar o winner cedo (c2) perdem o ponto', () => {
    for (const [choiceId, terminalEsperado] of [
      ['c2', 'unforced_error_a'],
      ['c3', 'winner_b'],
    ] as const) {
      const jogado = replay(secondServeReturn001, [choiceId])
      if (!jogado.ok) throw new Error(`${choiceId} deveria ser válida`)
      const estado = secondServeReturn001.states.find(
        (s) => s.id === jogado.value.currentStateId,
      )
      expect(estado?.terminal, choiceId).toBe(terminalEsperado)
    }
  })

  it('toda probabilidade cita a âncora de segundo saque, para calibração', () => {
    // Diferente do cenário 002 (Wardlaw, sem âncora aplicável), aqui existe
    // uma âncora real e diretamente relacionada — a vantagem embutida do
    // segundo saque. Cada estimativa declara a distância até essa base.
    for (const c of secondServeReturn001.choices) {
      expect(c.winProbability.anchorId, c.id).toBe('pl2023-ss-rapida')
      expect(c.winProbability.basis, c.id).toBe('estimated')
    }
  })

  it('a fonte é tier C e nunca finge percentual na explicação', () => {
    expect(secondServeReturn001.source.tier).toBe('C')
    for (const c of secondServeReturn001.choices) {
      expect(c.explanation).not.toMatch(/%/)
    }
  })
})
