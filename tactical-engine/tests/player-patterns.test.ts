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

  it('nenhum padrão usa a terminologia inventada do documento rejeitado', () => {
    const jargaoInventado = /\bVAST\b|\bVACC\b|\bBHP\b|VON CRAMM|Expected Shot Value/i
    for (const profile of PLAYER_PROFILES) {
      for (const pattern of profile.patterns) {
        expect(pattern.tendency, `${profile.id}/${pattern.id}`).not.toMatch(
          jargaoInventado,
        )
      }
    }
  })

  it('toda fonte é tier "geral" e declara que não é medição', () => {
    for (const profile of PLAYER_PROFILES) {
      expect(profile.source.tier, profile.id).toBe('geral')
      expect(profile.source.oQueSustenta.trim(), profile.id).not.toBe('')
    }
  })

  it('findProfile encontra por id e devolve undefined para id inexistente', () => {
    expect(findProfile('alcaraz')?.name).toBe('Carlos Alcaraz')
    expect(findProfile('jogador-que-nao-existe')).toBeUndefined()
  })
})
