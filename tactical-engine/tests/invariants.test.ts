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
          classification: 'situacional' as const,
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

describe('invariantes de evidência — PRODUCT.md § 00.1 como código', () => {
  it('11 — bloqueia publicação sem fonte verificada por humano', () => {
    const broken = mutate({ status: 'publicada' })
    expect(codesOf(broken)).toContain('published-without-verified-source')
  })

  it('11 — fonte PENDENTE não passa de rascunho', () => {
    const broken = mutate({ status: 'revisada' })
    expect(codesOf(broken)).toContain('pending-source-beyond-draft')
  })

  it('11 — golden-001 é rascunho, portanto fonte pendente é aceitável', () => {
    expect(golden001.status).toBe('rascunho')
    expect(codesOf(golden001)).not.toContain('pending-source-beyond-draft')
  })

  it('12 — classificação forte exige fonte tier B', () => {
    // Fonte tier C verificada, mas há escolha classificada como "padrao"
    const broken = mutate({
      status: 'publicada',
      source: {
        tier: 'C',
        referencia: 'Manual de federação, 2020',
        oQueSustenta: 'convenção de treinamento sobre bola curta',
        verificadaPor: 'Fulano',
        verificadaEm: '2026-08-18',
      },
    })
    expect(codesOf(broken)).toContain('classification-exceeds-source')
  })

  it('12 — fonte tier B sustenta classificação forte', () => {
    const ok = mutate({
      status: 'publicada',
      source: {
        tier: 'B',
        referencia: 'Autor et al. (2024), IJRSS, DOI 10.x',
        oQueSustenta: 'frequência de escolha em bola curta no profissional',
        verificadaPor: 'Fulano',
        verificadaEm: '2026-08-18',
      },
    })
    expect(codesOf(ok)).not.toContain('classification-exceeds-source')
  })

  it('13 — rejeita citação decorativa (oQueSustenta vazio)', () => {
    const broken = mutate({
      status: 'publicada',
      source: {
        tier: 'B',
        referencia: 'Autor et al. (2024)',
        oQueSustenta: '   ',
        verificadaPor: 'Fulano',
        verificadaEm: '2026-08-18',
      },
    })
    expect(codesOf(broken)).toContain('decorative-citation')
  })

  it('um cenário totalmente verificado publica sem erros', () => {
    const publishable = mutate({
      status: 'publicada',
      reviewer: 'Sicrano',
      source: {
        tier: 'B',
        referencia: 'Autor et al. (2024), IJRSS 7(1), DOI 10.x',
        oQueSustenta:
          'distribuição de escolha de alvo em bola curta atacável no circuito profissional',
        verificadaPor: 'Fulano',
        verificadaEm: '2026-08-18',
      },
    })
    expect(validateScenario(publishable).issues).toEqual([])
  })
})
