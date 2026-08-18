/**
 * Guardrails anti-loop do Point Builder.
 *
 * O "xadrez do tênis" precisa parecer aberto sem permitir loop infinito.
 * A sessão pode ser contínua; o ponto individual nunca é.
 *
 * Valores iniciais do documento de arquitetura, seção 18. Ajustáveis após
 * testes com usuários reais.
 */

import type { TacticalState, CourtZone, CourtPoint } from '../domain/types'

export const MAX_STROKES = 14
export const MAX_STATE_REPEATS = 2
export const MAX_TRANSITIONS = 18

/**
 * Converte um ponto em zona nomeada.
 *
 * A quadra é dividida em três faixas laterais e, em cada metade, duas de
 * profundidade. A rede está em y = 0.5: abaixo dela é a metade do adversário,
 * acima é a nossa.
 */
export function zoneOf(point: CourtPoint): CourtZone {
  const lateral: 'left' | 'center' | 'right' =
    point.x < 0.33 ? 'left' : point.x < 0.67 ? 'center' : 'right'

  // y = 0 é o fundo do adversário; y = 1 é o nosso.
  const half: 'opp' | 'own' = point.y < 0.5 ? 'opp' : 'own'

  // "Fundo" é longe da rede em qualquer uma das metades.
  const depth: 'deep' | 'short' =
    half === 'opp'
      ? point.y < 0.25
        ? 'deep'
        : 'short'
      : point.y > 0.75
        ? 'deep'
        : 'short'

  return `${half}-${lateral}-${depth}` as CourtZone
}

/**
 * Hash canônico de um estado, para detecção de ciclo.
 *
 * Deliberadamente grosseiro: usa zonas em vez de coordenadas exatas, de modo
 * que dois estados praticamente idênticos colidam. Detectar "quase o mesmo
 * estado" é o objetivo — coordenadas exatas quase nunca se repetem e o
 * guardrail nunca dispararia.
 *
 * Composição (documento de arquitetura, seção 18):
 *   phase + zone(bola) + zone(A) + zone(B) + advantage + hitter
 */
export function canonicalHash(state: TacticalState): string {
  return [
    state.phase,
    zoneOf(state.ball),
    zoneOf(state.players.a.position),
    zoneOf(state.players.b.position),
    state.advantage,
    state.hitter,
  ].join('|')
}

/**
 * Decide se a simulação deve ser encerrada por guardrail.
 *
 * Retorna o motivo, ou `null` se o ponto pode continuar.
 */
export function guardrailBreach(
  visitedHashes: readonly string[],
  strokeCount: number,
): 'max-strokes' | 'state-repeat' | null {
  if (strokeCount >= MAX_STROKES) return 'max-strokes'

  const counts = new Map<string, number>()
  for (const hash of visitedHashes) {
    const next = (counts.get(hash) ?? 0) + 1
    counts.set(hash, next)
    if (next > MAX_STATE_REPEATS) return 'state-repeat'
  }

  return null
}
