/**
 * Avaliação de escolhas, no espírito da análise de lances do xadrez.
 *
 * Cada escolha carrega uma probabilidade de vencer o ponto. A qualidade não é
 * escrita à mão: deriva da distância até a melhor opção disponível. Um rótulo
 * derivado nunca contradiz o número que o originou, e corrigir um número
 * reclassifica a escolha sozinho.
 *
 * A diferença em relação ao xadrez é honesta e importante: lá o motor é
 * verdade de campo, aqui não existe equivalente. Por isso cada número declara
 * de onde veio (`ProbabilityBasis`), e o validador recusa publicar estimativa.
 */

import type {
  ChoiceQuality,
  ProbabilityBasis,
  TacticalChoice,
} from '../domain/types'

/**
 * Faixas de qualidade por perda de probabilidade, em pontos percentuais.
 *
 * Calibradas para o tênis, não copiadas do xadrez: um ponto de tênis é muito
 * mais volátil que uma posição de xadrez, então perdas pequenas importam
 * menos e a escala é mais tolerante na ponta boa.
 */
export const QUALITY_BANDS: ReadonlyArray<{
  readonly maxLoss: number
  readonly quality: ChoiceQuality
}> = [
  { maxLoss: 0.0, quality: 'melhor' },
  { maxLoss: 0.03, quality: 'excelente' },
  { maxLoss: 0.08, quality: 'boa' },
  { maxLoss: 0.15, quality: 'imprecisao' },
  { maxLoss: 0.25, quality: 'erro' },
]

const WORST_QUALITY: ChoiceQuality = 'erro-grave'

export type ChoiceEvaluation = {
  readonly choiceId: string
  /** Probabilidade de vencer o ponto com esta escolha. */
  readonly probability: number
  /** Probabilidade da melhor opção disponível no mesmo estado. */
  readonly bestProbability: number
  /** Quanto se perdeu ao não escolher a melhor, de 0 a 1. */
  readonly loss: number
  readonly quality: ChoiceQuality
  /** A procedência mais fraca entre as opções comparadas. */
  readonly basis: ProbabilityBasis
}

/** Ordem da mais fraca para a mais forte, para reportar o elo mais fraco. */
const BASIS_STRENGTH: Record<ProbabilityBasis, number> = {
  estimated: 0,
  derived: 1,
  measured: 2,
}

export function qualityForLoss(loss: number): ChoiceQuality {
  for (const band of QUALITY_BANDS) {
    if (loss <= band.maxLoss) return band.quality
  }
  return WORST_QUALITY
}

/** A maior probabilidade entre as opções, ou 0 se não houver nenhuma. */
export function bestProbabilityOf(
  choices: readonly TacticalChoice[],
): number {
  return choices.reduce(
    (max, c) => Math.max(max, c.winProbability.value),
    0,
  )
}

/**
 * Avalia uma escolha contra as alternativas que o jogador tinha.
 *
 * A comparação é sempre com o que estava disponível naquele estado — é isso
 * que torna a avaliação justa: julga a decisão, não a sorte.
 */
export function evaluateChoice(
  choice: TacticalChoice,
  available: readonly TacticalChoice[],
): ChoiceEvaluation {
  const best = bestProbabilityOf(available)
  const loss = Math.max(0, best - choice.winProbability.value)

  const weakest = available.reduce<ProbabilityBasis>(
    (w, c) =>
      BASIS_STRENGTH[c.winProbability.basis] < BASIS_STRENGTH[w]
        ? c.winProbability.basis
        : w,
    'measured',
  )

  return {
    choiceId: choice.id,
    probability: choice.winProbability.value,
    bestProbability: best,
    loss,
    quality: qualityForLoss(loss),
    basis: weakest,
  }
}

/** Avalia todas as opções de um estado, da melhor para a pior. */
export function rankChoices(
  choices: readonly TacticalChoice[],
): readonly ChoiceEvaluation[] {
  return choices
    .map((c) => evaluateChoice(c, choices))
    .sort((a, b) => b.probability - a.probability)
}

/**
 * Precisão de uma sequência de decisões, de 0 a 100.
 *
 * Cada decisão vale o quanto reteve da melhor opção. Uma escolha de 60% quando
 * a melhor era 80% retém 75%.
 *
 * Deliberadamente não pune o desfecho, só a decisão: no tênis o ponto é
 * volátil, e a escolha certa perde o ponto com frequência. Avaliar resultado
 * ensinaria o jogador a perseguir sorte.
 */
export function accuracyOf(
  evaluations: readonly ChoiceEvaluation[],
): number {
  if (evaluations.length === 0) return 0

  const total = evaluations.reduce((sum, e) => {
    if (e.bestProbability <= 0) return sum + 1
    return sum + Math.min(1, e.probability / e.bestProbability)
  }, 0)

  return (total / evaluations.length) * 100
}
