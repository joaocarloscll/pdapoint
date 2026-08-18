import { describe, expect, it } from 'vitest'

import { PLAYER_PROFILES, findProfile } from '../../content/players'

describe('padrões de jogadores profissionais', () => {
  it('todo id de perfil e de padrão é único', () => {
    const profileIds = PLAYER_PROFILES.map((p) => p.id)
    expect(new Set(profileIds).size).toBe(profileIds.length)

    const patternIds = PLAYER_PROFILES.flatMap((p) => p.patterns.map((x) => x.id))
    expect(new Set(patternIds).size).toBe(patternIds.length)
  })

  it('todo perfil tem pelo menos um padrão, e todo padrão tem texto', () => {
    for (const profile of PLAYER_PROFILES) {
      expect(profile.patterns.length, profile.id).toBeGreaterThan(0)
      for (const pattern of profile.patterns) {
        expect(pattern.situation.trim(), pattern.id).not.toBe('')
        expect(pattern.tendency.trim(), pattern.id).not.toBe('')
      }
    }
  })

  it('nenhum padrão finge medição: sem percentual, sem número solto', () => {
    // Esta é a regra que existe por causa do documento que originou este
    // módulo (EVIDENCE_SOURCES.md § 00c/00d): estilo de jogo é reputação
    // pública qualitativa, nunca estatística inventada anexada a um nome real.
    const numeroSolto = /\d/
    for (const profile of PLAYER_PROFILES) {
      for (const pattern of profile.patterns) {
        expect(pattern.tendency, `${profile.id}/${pattern.id}`).not.toMatch(/%/)
        expect(pattern.tendency, `${profile.id}/${pattern.id}`).not.toMatch(
          numeroSolto,
        )
      }
    }
  })

  it('nenhum padrão usa jargão técnico não medido para este jogador', () => {
    // Correção (EVIDENCE_SOURCES.md § 00c.5): VAST, VACC e "Space-Time VON CRAMM"
    // são reais — métricas de Kovalchik et al. (2020), não invenção. Continuam
    // banidas daqui mesmo assim, mas por outro motivo: são números que exigem
    // medição real por jogador, que este projeto não tem. Usá-las sem o cálculo
    // seria emprestar o verniz de precisão de um framework real para uma
    // afirmação que ele não mede — a mesma armadilha do § 00.6, com um nome
    // diferente. "BHP" segue sem nenhuma confirmação em lugar nenhum.
    const jargaoNaoMedido = /\bVAST\b|\bVACC\b|\bBHP\b|VON CRAMM|Expected Shot Value|Shot IQ/i
    for (const profile of PLAYER_PROFILES) {
      for (const pattern of profile.patterns) {
        expect(pattern.tendency, `${profile.id}/${pattern.id}`).not.toMatch(
          jargaoNaoMedido,
        )
      }
    }
  })

  it('toda fonte é B, C ou geral — nunca PENDENTE — e declara o que sustenta', () => {
    // A maior parte é `geral` (reputação pública, sem estudo específico). Um
    // segundo pacote de pesquisa trouxe padrões com fonte real mais forte —
    // livro de treinador (tier C) e um periódico de performance analysis
    // (tier B, o forehand inside-out de Lendl/Tsitsipas). PENDENTE nunca é
    // aceitável aqui: não existe "candidato" neste módulo, só publicado.
    for (const profile of PLAYER_PROFILES) {
      expect(['B', 'C', 'geral'], profile.id).toContain(profile.source.tier)
      expect(profile.source.oQueSustenta.trim(), profile.id).not.toBe('')
    }
  })

  it('nenhuma fonte tier B/C alega taxa medida para o jogador individual', () => {
    // A âncora real (Martín-Lorente et al. 2017) mede o padrão agregado em 11
    // jogadores do circuito — não este jogador individualmente. O texto tem
    // que deixar isso explícito, para não emprestar precisão de um estudo
    // agregado a uma afirmação sobre uma pessoa específica.
    for (const profile of PLAYER_PROFILES) {
      if (profile.source.tier === 'B') {
        expect(profile.source.oQueSustenta, profile.id).toMatch(
          /não medido individualmente|sustentado para o padrão em geral/,
        )
      }
    }
  })

  it('findProfile encontra por id e devolve undefined para id inexistente', () => {
    expect(findProfile('alcaraz')?.name).toBe('Carlos Alcaraz')
    expect(findProfile('jogador-que-nao-existe')).toBeUndefined()
  })
})
