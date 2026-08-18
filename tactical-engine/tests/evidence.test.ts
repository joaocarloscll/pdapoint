import { describe, expect, it } from 'vitest'

import {
  ALL_ANCHORS,
  ANCHOR_IDS,
  RALLY_LENGTH_SHARE,
  findAnchor,
} from '../../content/evidence'
import { golden001 } from '../../content/scenarios/golden-001'
import { validateScenario } from '../validator/invariants'

describe('âncoras medidas', () => {
  it('todo id é único', () => {
    expect(ANCHOR_IDS.size).toBe(ALL_ANCHORS.length)
  })

  it('todo valor é uma probabilidade e declara onde foi lido', () => {
    for (const a of ALL_ANCHORS) {
      expect(a.value, a.id).toBeGreaterThan(0)
      expect(a.value, a.id).toBeLessThanOrEqual(1)
      expect(a.onde.trim(), a.id).not.toBe('')
      expect(a.condicionamento.trim(), a.id).not.toBe('')
    }
  })

  it('toda âncora carrega a referência da fonte, nunca citação vazia', () => {
    for (const a of ALL_ANCHORS) {
      expect(a.source.referencia, a.id).toContain('10.1371/journal.pone.0286076')
      expect(a.source.oQueSustenta.trim(), a.id).not.toBe('')
    }
  })

  it('nenhuma âncora se declara verificada por humano antes de estar', () => {
    // O artefato foi lido nesta máquina, mas a Regra 2 de § 00.1 exige um
    // humano. Enquanto ninguém assinar, os campos ficam nulos — e é o teste
    // que impede alguém de preenchê-los por conveniência.
    for (const a of ALL_ANCHORS) {
      if (a.source.verificadaPor !== null) {
        expect(a.source.verificadaEm, a.id).not.toBeNull()
      }
    }
  })

  it('encontra âncora por id e devolve undefined para id inexistente', () => {
    expect(findAnchor('pl2023-fs-curto-rapida')?.value).toBe(0.81)
    expect(findAnchor('nao-existe')).toBeUndefined()
  })

  it('a vantagem do primeiro saque é maior que a do segundo, em toda superfície', () => {
    // Não é enfeite: é o achado central do artigo. Se um dia alguém digitar um
    // número errado na tabela, esta relação quebra antes de virar conteúdo.
    for (const surface of ['saibro', 'grama', 'rapida'] as const) {
      const fs = findAnchor(`pl2023-fs-${surface}`)
      const ss = findAnchor(`pl2023-ss-${surface}`)
      expect(fs?.value, surface).toBeGreaterThan(ss?.value ?? 1)
    }
  })

  it('a distribuição de duração de rally soma 1 em cada superfície', () => {
    for (const r of RALLY_LENGTH_SHARE) {
      expect(r.curto + r.medio + r.longo, r.surface).toBeCloseTo(1, 2)
    }
  })

  it('o rally curto predomina em toda superfície', () => {
    for (const r of RALLY_LENGTH_SHARE) {
      expect(r.curto, r.surface).toBeGreaterThan(r.medio + r.longo)
    }
  })
})

describe('invariante 17 — número medido aponta para a medição', () => {
  const base = golden001

  const withProbability = (
    p: (typeof golden001.choices)[number]['winProbability'],
  ) => {
    const [first, ...rest] = base.choices
    if (first === undefined) throw new Error('cenário sem escolhas')
    return { ...base, choices: [{ ...first, winProbability: p }, ...rest] }
  }

  it('aceita o cenário canônico contra o registro real', () => {
    const result = validateScenario(base, { knownAnchorIds: ANCHOR_IDS })
    expect(result.issues.filter((i) => i.invariant === 17)).toEqual([])
  })

  it('rejeita "measured" sem âncora', () => {
    const result = validateScenario(
      withProbability({ value: 0.5, basis: 'measured', note: 'x' }),
      { knownAnchorIds: ANCHOR_IDS },
    )
    expect(result.issues.map((i) => i.code)).toContain('unanchored-probability')
  })

  it('rejeita "derived" sem âncora', () => {
    const result = validateScenario(
      withProbability({ value: 0.5, basis: 'derived', note: 'x' }),
      { knownAnchorIds: ANCHOR_IDS },
    )
    expect(result.issues.map((i) => i.code)).toContain('unanchored-probability')
  })

  it('rejeita âncora que não existe no registro', () => {
    const result = validateScenario(
      withProbability({
        value: 0.5,
        basis: 'measured',
        note: 'x',
        anchorId: 'pl2023-inventada',
      }),
      { knownAnchorIds: ANCHOR_IDS },
    )
    expect(result.issues.map((i) => i.code)).toContain('unknown-anchor')
  })

  it('estimativa pode citar âncora — é a faixa medida mais próxima', () => {
    const result = validateScenario(
      withProbability({
        value: 0.5,
        basis: 'estimated',
        note: 'x',
        anchorId: 'pl2023-fs-curto-rapida',
      }),
      { knownAnchorIds: ANCHOR_IDS },
    )
    expect(result.issues.filter((i) => i.invariant === 17)).toEqual([])
  })

  it('sem registro conhecido, não inventa erro de âncora', () => {
    // Validar um cenário isolado (num teste, numa ferramenta) não deve falhar
    // só porque o chamador não passou o registro.
    const result = validateScenario(
      withProbability({
        value: 0.5,
        basis: 'measured',
        note: 'x',
        anchorId: 'pl2023-inventada',
      }),
    )
    expect(result.issues.map((i) => i.code)).not.toContain('unknown-anchor')
  })
})
