import { describe, expect, it } from 'vitest'

import { golden001 } from '../../content/scenarios/golden-001'
import { canonicalHash, zoneOf } from '../graph/guardrails'
import {
  availableChoices,
  choose,
  currentState,
  isTerminal,
  replay,
  startSession,
  type PlaySession,
} from '../graph/traverse'

const start = (): PlaySession => {
  const result = startSession(golden001)
  if (!result.ok) throw new Error('cenário canônico deveria iniciar')
  return result.value
}

describe('sessão de jogo', () => {
  it('inicia no estado inicial do cenário', () => {
    const session = start()
    expect(session.currentStateId).toBe('s1')
    expect(currentState(session)?.id).toBe('s1')
    expect(isTerminal(session)).toBe(false)
  })

  it('expõe as três escolhas do estado inicial', () => {
    const choices = availableChoices(start())
    expect(choices.map((c) => c.id)).toEqual(['c1', 'c2', 'c3'])
    expect(choices.map((c) => c.label)).toEqual([
      'Cruzado curto',
      'Cruzado profundo',
      'Paralela',
    ])
  })

  it('avança para o estado seguinte e devolve a transição a animar', () => {
    const step = choose(start(), 'c2')
    if (!step.ok) throw new Error('c2 deveria ser válida')

    expect(step.value.session.currentStateId).toBe('s3')
    expect(step.value.transition.id).toBe('t2')
    expect(step.value.session.score).toBe(2)
    expect(isTerminal(step.value.session)).toBe(true)
  })

  it('acumula a sequência de escolhas para replay', () => {
    const step = choose(start(), 'c1')
    if (!step.ok) throw new Error('c1 deveria ser válida')
    expect(step.value.session.choiceSequence).toEqual(['c1'])
    expect(step.value.session.transitionSequence).toEqual(['t1'])
  })

  it('não muta a sessão original', () => {
    const session = start()
    choose(session, 'c1')
    expect(session.choiceSequence).toEqual([])
    expect(session.currentStateId).toBe('s1')
  })
})

describe('rejeições do engine', () => {
  it('rejeita escolha inexistente', () => {
    const result = choose(start(), 'c99')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.kind).toBe('unknown-choice')
  })

  it('rejeita escolha não disponível no estado atual', () => {
    // c1 pertence a s1; após ir para s3 ela não está disponível
    const first = choose(start(), 'c2')
    if (!first.ok) throw new Error('c2 deveria ser válida')
    const second = choose(first.value.session, 'c1')
    expect(second.ok).toBe(false)
    if (!second.ok) expect(second.error.kind).toBe('state-is-terminal')
  })

  it('rejeita decisão a partir de estado terminal', () => {
    const first = choose(start(), 'c1')
    if (!first.ok) throw new Error('c1 deveria ser válida')
    const second = choose(first.value.session, 'c2')
    expect(second.ok).toBe(false)
    if (!second.ok) expect(second.error.kind).toBe('state-is-terminal')
  })
})

describe('replay determinístico', () => {
  it('a mesma sequência produz o mesmo resultado', () => {
    const a = replay(golden001, ['c2'])
    const b = replay(golden001, ['c2'])
    if (!a.ok || !b.ok) throw new Error('replay deveria funcionar')

    expect(a.value.currentStateId).toBe(b.value.currentStateId)
    expect(a.value.score).toBe(b.value.score)
    expect(a.value.transitionSequence).toEqual(b.value.transitionSequence)
  })

  it('replay equivale a jogar passo a passo', () => {
    const stepped = choose(start(), 'c3')
    if (!stepped.ok) throw new Error('c3 deveria ser válida')
    const replayed = replay(golden001, ['c3'])
    if (!replayed.ok) throw new Error('replay deveria funcionar')

    expect(replayed.value.currentStateId).toBe(
      stepped.value.session.currentStateId,
    )
    expect(replayed.value.score).toBe(stepped.value.session.score)
  })

  it('propaga erro de uma sequência inválida', () => {
    const result = replay(golden001, ['c2', 'c1'])
    expect(result.ok).toBe(false)
  })
})

describe('guardrails', () => {
  it('mapeia coordenadas para zonas', () => {
    expect(zoneOf({ x: 0.1, y: 0.9 })).toBe('deuce-deep')
    expect(zoneOf({ x: 0.5, y: 0.4 })).toBe('center-short')
    expect(zoneOf({ x: 0.9, y: 0.1 })).toBe('net-ad')
  })

  it('estados equivalentes colidem no hash canônico', () => {
    const first = golden001.states[0]
    if (first === undefined) throw new Error('cenário sem estados')

    // Deslocamento pequeno, dentro da mesma zona: mesmo hash.
    const nudged = { ...first, ball: { x: first.ball.x + 0.01, y: first.ball.y } }
    expect(canonicalHash(nudged)).toBe(canonicalHash(first))
  })

  it('estados em zonas diferentes produzem hashes diferentes', () => {
    const first = golden001.states[0]
    if (first === undefined) throw new Error('cenário sem estados')

    const moved = { ...first, ball: { x: 0.05, y: 0.05 } }
    expect(canonicalHash(moved)).not.toBe(canonicalHash(first))
  })
})
