import { describe, expect, it } from 'vitest'

import { golden001 } from '../../content/scenarios/golden-001'
import type { TacticalScenario } from '../domain/types'
import { validateScenario } from '../validator/invariants'

/** Clona o cenário aplicando uma alteração, para testar cada invariante. */
const mutate = (
  patch: Partial<TacticalScenario>,
): TacticalScenario => ({ ...golden001, ...patch })

const codesOf = (scenario: TacticalScenario): string[] =>
  validateScenario(scenario).issues.map((i) => i.code)

describe('validateScenario — cenário canônico', () => {
  it('golden-001 passa em todos os invariantes', () => {
    const result = validateScenario(golden001)
    expect(result.issues).toEqual([])
    expect(result.valid).toBe(true)
  })
})

describe('invariantes de integridade do grafo', () => {
  it('1 — detecta initialStateId inexistente', () => {
    expect(codesOf(mutate({ initialStateId: 'nao-existe' }))).toContain(
      'missing-initial-state',
    )
  })

  it('2 — detecta escolha referenciada que não existe', () => {
    const broken = mutate({
      states: golden001.states.map((s) =>
        s.id === 's1' ? { ...s, availableChoices: [...s.availableChoices, 'c99'] } : s,
      ),
    })
    expect(codesOf(broken)).toContain('dangling-choice')
  })

  it('3 — detecta transição apontando para estado inexistente', () => {
    const broken = mutate({
      transitions: golden001.transitions.map((t) =>
        t.id === 't1' ? { ...t, toStateId: 'nao-existe' } : t,
      ),
    })
    expect(codesOf(broken)).toContain('transition-bad-target')
  })

  it('4 — detecta estado não terminal sem saída', () => {
    const broken = mutate({
      states: golden001.states.map((s) =>
        s.id === 's1' ? { ...s, availableChoices: [] } : s,
      ),
    })
    expect(codesOf(broken)).toContain('dead-end-state')
  })

  it('5 — detecta estado terminal que ainda pede decisão', () => {
    const broken = mutate({
      states: golden001.states.map((s) =>
        s.id === 's2' ? { ...s, availableChoices: ['c1'] } : s,
      ),
    })
    expect(codesOf(broken)).toContain('terminal-with-choices')
  })

  it('6 — detecta IDs de estado duplicados', () => {
    const first = golden001.states[0]
    if (first === undefined) throw new Error('cenário sem estados')
    const broken = mutate({ states: [...golden001.states, first] })
    expect(codesOf(broken)).toContain('duplicate-state-id')
  })

  it('7 — detecta coordenada fora da quadra', () => {
    const broken = mutate({
      states: golden001.states.map((s) =>
        s.id === 's1' ? { ...s, ball: { x: 1.4, y: 0.5 } } : s,
      ),
    })
    expect(codesOf(broken)).toContain('coordinate-out-of-court')
  })

  it('8 — detecta duração negativa na timeline', () => {
    const broken = mutate({
      transitions: golden001.transitions.map((t) =>
        t.id === 't1'
          ? {
              ...t,
              timeline: [
                { kind: 'pause' as const, startMs: 0, durationMs: -100 },
              ],
            }
          : t,
      ),
    })
    expect(codesOf(broken)).toContain('negative-duration')
  })

  it('9 — detecta ciclo sem guardrail', () => {
    // s2 deixa de ser terminal e volta para s1, fechando um ciclo
    const broken = mutate({
      states: golden001.states.map((s) => {
        if (s.id !== 's2') return s
        const { terminal: _terminal, ...rest } = s
        return { ...rest, availableChoices: ['c4'] }
      }),
      choices: [
        ...golden001.choices,
        {
          id: 'c4',
          stateId: 's2',
          label: 'voltar',
          shotIntent: 'reset' as const,
          winProbability: {
            value: 0.5,
            basis: 'estimated' as const,
            note: 'teste',
          },
          explanation: 'fecha um ciclo, para teste',
        },
      ],
      transitions: [
        ...golden001.transitions,
        {
          id: 't4',
          fromStateId: 's2',
          choiceId: 'c4',
          toStateId: 's1',
          scoreDelta: 0,
          timeline: [],
        },
      ],
    })
    expect(codesOf(broken)).toContain('unguarded-cycle')
  })

  it('2 — detecta escolha disponível sem transição correspondente', () => {
    const broken = mutate({
      transitions: golden001.transitions.filter((t) => t.id !== 't1'),
    })
    expect(codesOf(broken)).toContain('choice-without-transition')
  })
})

describe('invariante 14 — todo caminho resolve o ponto', () => {
  it('golden-001 termina em ponto ganho ou perdido em todo caminho', () => {
    const terminais = golden001.states
      .filter((s) => s.terminal !== undefined)
      .map((s) => s.terminal)

    expect(terminais.length).toBeGreaterThan(0)
    for (const t of terminais) {
      expect(t).not.toBe('neutralized_end')
    }
  })

  it('rejeita cenário de decisão que termina em rally neutralizado', () => {
    const broken = mutate({
      states: golden001.states.map((s) =>
        s.terminal !== undefined
          ? { ...s, terminal: 'neutralized_end' as const }
          : s,
      ),
    })
    expect(codesOf(broken)).toContain('terminal-does-not-resolve-point')
  })

  it('a escolha de maior probabilidade ganha o ponto e as demais perdem', () => {
    const desfecho = (choiceId: string) => {
      const t = golden001.transitions.find((x) => x.choiceId === choiceId)
      return golden001.states.find((s) => s.id === t?.toStateId)?.terminal
    }

    const melhor = Math.max(
      ...golden001.choices.map((c) => c.winProbability.value),
    )

    for (const choice of golden001.choices) {
      const fim = desfecho(choice.id)
      expect(fim).toBe(
        choice.winProbability.value === melhor ? 'winner_a' : 'winner_b',
      )
    }
  })
})

describe('invariantes de evidência — PRODUCT.md § 00.1 como código', () => {
  // Decisão revisada de 2026-08-18: o fundador não quer nível de
  // confiabilidade de publicação científica, quer uma ferramenta útil. O que
  // os testes abaixo defendem mudou de forma: já não é "bloqueia até alguém
  // assinar", é "não deixa passar conteúdo sem base nenhuma, e não deixa
  // mentir sobre a base que tem".

  it('11 — fonte PENDENTE não passa de rascunho', () => {
    // A fonte pendente é montada aqui, e não herdada do cenário: quando
    // golden-001 ganhou fonte real este teste passou a não testar nada, e
    // silenciosamente. Um teste de regra não deve depender do estado
    // circunstancial de um fixture.
    const broken = mutate({
      status: 'revisada',
      source: {
        tier: 'PENDENTE',
        referencia: '',
        oQueSustenta: '',
        verificadaPor: null,
        verificadaEm: null,
      },
    })
    expect(codesOf(broken)).toContain('pending-source-beyond-draft')
  })

  it('11 — golden-001 tem fonte tier B, não pendente', () => {
    expect(golden001.source.tier).toBe('B')
    expect(codesOf(golden001)).not.toContain('pending-source-beyond-draft')
  })

  it('11 — publica sem exigir assinatura humana', () => {
    // Até 2026-08-18 isto era bloqueado (published-without-verified-source).
    // O código que gerava esse erro foi removido, não apenas contornado —
    // este teste falharia de novo se alguém o reintroduzisse.
    const published = mutate({
      status: 'publicada',
      source: {
        tier: 'geral',
        referencia: '',
        oQueSustenta: 'convenção comum de ensino: atacar bola curta com profundidade',
        verificadaPor: null,
        verificadaEm: null,
      },
    })
    expect(codesOf(published)).not.toContain('published-without-verified-source')
  })

  it('publica com probabilidade estimated, sem exigir medição', () => {
    // golden-001 já é exatamente esse caso: as três probabilidades são
    // `estimated`. Antes disso bastava para barrar a publicação
    // (estimated-probability-published); agora não barra mais nada.
    expect(golden001.choices.every((c) => c.winProbability.basis === 'estimated')).toBe(true)
    expect(codesOf(mutate({ status: 'publicada' }))).not.toContain(
      'estimated-probability-published',
    )
  })

  it('publica com fonte tier "geral", sem exigir tier B para as probabilidades', () => {
    // Antes disso era bloqueado (probability-exceeds-source) para qualquer
    // tier abaixo de B. O tier "geral" nem existia.
    const published = mutate({
      status: 'publicada',
      source: {
        tier: 'geral',
        referencia: '',
        oQueSustenta: 'convenção comum de ensino: atacar bola curta com profundidade',
        verificadaPor: null,
        verificadaEm: null,
      },
    })
    expect(codesOf(published)).not.toContain('probability-exceeds-source')
  })

  it('13 — rejeita citação decorativa (oQueSustenta vazio), mesmo sem assinatura humana', () => {
    const broken = mutate({
      status: 'publicada',
      source: {
        tier: 'geral',
        referencia: '',
        oQueSustenta: '   ',
        verificadaPor: null,
        verificadaEm: null,
      },
    })
    expect(codesOf(broken)).toContain('decorative-citation')
  })

  it('o piso mínimo publicável: fonte tier "geral", sem assinatura, sem medição', () => {
    // O caso concreto que a mudança de política existe para permitir: uma
    // tática com lógica que faz sentido, sem artigo por trás, sem ninguém
    // além de quem escreveu tendo revisado.
    const publishable = mutate({
      status: 'publicada',
      source: {
        tier: 'geral',
        referencia: '',
        oQueSustenta: 'convenção comum de ensino: atacar bola curta com profundidade',
        verificadaPor: null,
        verificadaEm: null,
      },
    })
    expect(validateScenario(publishable).issues).toEqual([])
  })
})
