/**
 * Tipos do módulo de padrões de jogadores profissionais.
 *
 * Alimenta o filtro "jogadores profissionais" da Biblioteca (PRODUCT.md § 02).
 * Deliberadamente separado do Tactical State Engine: não há estado, escolha,
 * probabilidade ou desfecho de ponto aqui — é reputação de estilo de jogo,
 * não uma situação jogável.
 *
 * Regra de origem (decisão de 2026-08-18, ver EVIDENCE_SOURCES.md § 00d):
 * toda entrada é observação de estilo de jogo amplamente reconhecida —
 * comentário esportivo, cobertura de imprensa especializada, características
 * publicamente associadas ao jogador. NENHUM número (percentual, taxa,
 * métrica inventada) é aceito aqui. Se um dia houver dado real medido por
 * jogador, ele vai para `content/evidence/`, com âncora e fonte, como
 * qualquer outro número do produto — nunca solto num texto de padrão.
 */

import type { ShotIntent, SourceRef } from '../../tactical-engine/domain/types'

export type Tour = 'ATP' | 'WTA'

export type PlayerPattern = {
  readonly id: string
  /** Quando o padrão se aplica, em 1 frase. */
  readonly situation: string
  readonly intent: ShotIntent
  /** O que o jogador tende a fazer, sem número — reputação, não medição. */
  readonly tendency: string
}

export type ProfessionalProfile = {
  readonly id: string
  readonly name: string
  readonly tour: Tour
  readonly patterns: readonly PlayerPattern[]
  readonly source: SourceRef
}
