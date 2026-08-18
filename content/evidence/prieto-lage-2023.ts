/**
 * ÂNCORAS MEDIDAS — Prieto-Lage et al. (2023), PLOS ONE
 *
 * Primeiros números `measured` do projeto. Até aqui todo número no PDA Point
 * era estimativa editorial; estes não são.
 *
 * Fonte: Prieto-Lage, I., Paramés-González, A., Torres-Santos, D.,
 * Argibay-González, J. C., Reguera-López-de-la-Osa, X., &
 * Gutiérrez-Santiago, A. (2023). "Match analysis and probability of winning a
 * point in elite men's singles tennis". PLOS ONE 18(9): e0286076.
 * DOI 10.1371/journal.pone.0286076 — CC BY 4.0 (uso comercial permitido com
 * atribuição).
 *
 * Amostra: 4.669 pontos das quartas de final em diante de três Grand Slams de
 * 2021 — Roland Garros (1.660 pontos, saibro), Wimbledon (1.623, grama),
 * US Open (1.386, quadra rápida). 17 jogadores. Metodologia observacional
 * (instrumento OBSTENNIS-S21), kappa inter-observador 0,94.
 *
 * Procedência dos valores: Figura 2 do artigo, lida diretamente do PDF
 * fornecido pelo fundador (SHA-256
 * b70b9777d165eeac8226e3b7a22bddf72bc20dbd176ae312318a0cb4371541f9), conferida
 * contra o texto das páginas 8, 11, 12 e 13. Ver EVIDENCE_SOURCES.md § 00.
 *
 * ---
 *
 * ⚠️ O QUE ESTES NÚMEROS **NÃO** SÃO
 *
 * Não são probabilidades de escolha. São frequências condicionais: "entre os
 * pontos que de fato terminaram em rally curto após primeiro saque, o sacador
 * venceu 81%". Ler isso como "encurtar o rally dá 81% de chance" troca
 * condicionamento por causa — a duração do rally é resultado do ponto, não
 * uma decisão tomada antes dele. O próprio artigo se declara descritivo e
 * recomenda o uso das tabelas como referência, não como prescrição.
 *
 * Por isso servem como **âncora de calibração**: dizem em que faixa vive a
 * vantagem real em cada contexto, e portanto quando um número escrito à mão
 * está fora do que alguém já mediu.
 */

import type { ProbabilityAnchor, SourceRef } from '../../tactical-engine/domain/types'

const PRIETO_LAGE_2023: SourceRef = {
  tier: 'B',
  referencia:
    'Prieto-Lage I, Paramés-González A, Torres-Santos D, Argibay-González JC, ' +
    'Reguera-López-de-la-Osa X, Gutiérrez-Santiago A (2023). Match analysis and ' +
    'probability of winning a point in elite men’s singles tennis. ' +
    'PLOS ONE 18(9): e0286076. DOI 10.1371/journal.pone.0286076. CC BY 4.0.',
  oQueSustenta:
    'Frequência com que o sacador vence o ponto no tênis masculino de elite, ' +
    'segregada por tipo de saque, duração do rally e superfície; e distribuição ' +
    'de duração de rally por superfície.',
  // Preenchido quando o fundador abrir o artigo e assinar a conferência.
  verificadaPor: null,
  verificadaEm: null,
}

const anchor = (
  id: string,
  value: number,
  condicionamento: string,
  surface: ProbabilityAnchor['surface'],
  n: number | null,
  onde: string,
): ProbabilityAnchor => ({
  id,
  value,
  condicionamento,
  surface,
  n,
  onde,
  source: PRIETO_LAGE_2023,
})

/**
 * Probabilidade de o **sacador** vencer o ponto (Figura 2, p. 8).
 *
 * Os `n` são o total de pontos daquela superfície no estudo, não o tamanho de
 * cada célula — o artigo não reporta os denominadores célula a célula. Ficam
 * declarados assim, e não inventados.
 */
export const SERVER_WIN_ANCHORS: readonly ProbabilityAnchor[] = [
  anchor('pl2023-todos-saibro', 0.63, 'Todos os pontos', 'saibro', 1660, 'Figura 2'),
  anchor('pl2023-todos-grama', 0.65, 'Todos os pontos', 'grama', 1623, 'Figura 2'),
  anchor('pl2023-todos-rapida', 0.65, 'Todos os pontos', 'rapida', 1386, 'Figura 2'),

  anchor('pl2023-fs-saibro', 0.69, 'Ponto iniciado com primeiro saque', 'saibro', 1081, 'Figura 2'),
  anchor('pl2023-fs-grama', 0.75, 'Ponto iniciado com primeiro saque', 'grama', 1003, 'Figura 2'),
  anchor('pl2023-fs-rapida', 0.75, 'Ponto iniciado com primeiro saque', 'rapida', 882, 'Figura 2'),

  anchor('pl2023-ss-saibro', 0.55, 'Ponto iniciado com segundo saque', 'saibro', 534, 'Figura 2'),
  // n conforme impresso na Tabela 2. Anotado: na linha da grama os três
  // contadores de saque (60 + 1003 + 506) somam 1569, e não os 1623 pontos do
  // torneio; o percentual impresso (34,5%) também não corresponde a 506. Saibro
  // e quadra rápida fecham exatamente. Reproduzimos o publicado e registramos a
  // divergência em EVIDENCE_SOURCES.md § 00 em vez de corrigir por conta própria.
  anchor('pl2023-ss-grama', 0.54, 'Ponto iniciado com segundo saque', 'grama', 506, 'Figura 2'),
  anchor('pl2023-ss-rapida', 0.57, 'Ponto iniciado com segundo saque', 'rapida', 446, 'Figura 2'),

  anchor('pl2023-fs-curto-saibro', 0.77, 'Primeiro saque e rally curto (0–4 golpes)', 'saibro', null, 'Figura 2'),
  anchor('pl2023-fs-curto-grama', 0.8, 'Primeiro saque e rally curto (0–4 golpes)', 'grama', null, 'Figura 2'),
  anchor('pl2023-fs-curto-rapida', 0.81, 'Primeiro saque e rally curto (0–4 golpes)', 'rapida', null, 'Figura 2'),

  anchor('pl2023-fs-medio-saibro', 0.49, 'Primeiro saque e rally médio (5–8 golpes)', 'saibro', null, 'Figura 2'),
  anchor('pl2023-fs-medio-grama', 0.55, 'Primeiro saque e rally médio (5–8 golpes)', 'grama', null, 'Figura 2'),
  anchor('pl2023-fs-medio-rapida', 0.52, 'Primeiro saque e rally médio (5–8 golpes)', 'rapida', null, 'Figura 2'),

  anchor('pl2023-fs-longo-saibro', 0.62, 'Primeiro saque e rally longo (9+ golpes)', 'saibro', null, 'Figura 2'),
  anchor('pl2023-fs-longo-grama', 0.49, 'Primeiro saque e rally longo (9+ golpes)', 'grama', null, 'Figura 2'),
  anchor('pl2023-fs-longo-rapida', 0.43, 'Primeiro saque e rally longo (9+ golpes)', 'rapida', null, 'Figura 2'),

  anchor('pl2023-ss-curto-saibro', 0.54, 'Segundo saque e rally curto (0–4 golpes)', 'saibro', null, 'Figura 2'),
  anchor('pl2023-ss-curto-grama', 0.55, 'Segundo saque e rally curto (0–4 golpes)', 'grama', null, 'Figura 2'),
  anchor('pl2023-ss-curto-rapida', 0.6, 'Segundo saque e rally curto (0–4 golpes)', 'rapida', null, 'Figura 2'),

  anchor('pl2023-ss-medio-saibro', 0.57, 'Segundo saque e rally médio (5–8 golpes)', 'saibro', null, 'Figura 2'),
  anchor('pl2023-ss-medio-grama', 0.51, 'Segundo saque e rally médio (5–8 golpes)', 'grama', null, 'Figura 2'),
  anchor('pl2023-ss-medio-rapida', 0.46, 'Segundo saque e rally médio (5–8 golpes)', 'rapida', null, 'Figura 2'),

  anchor('pl2023-ss-longo-saibro', 0.57, 'Segundo saque e rally longo (9+ golpes)', 'saibro', null, 'Figura 2'),
  anchor('pl2023-ss-longo-grama', 0.61, 'Segundo saque e rally longo (9+ golpes)', 'grama', null, 'Figura 2'),
  anchor('pl2023-ss-longo-rapida', 0.62, 'Segundo saque e rally longo (9+ golpes)', 'rapida', null, 'Figura 2'),
]

/**
 * Distribuição de duração de rally (Tabela 2, p. 7).
 *
 * Não é probabilidade de vencer o ponto — é com que frequência cada duração
 * acontece. Fica separada por isso: misturar as duas na mesma lista seria o
 * primeiro passo para alguém somar as coisas erradas.
 */
export type RallyLengthShare = {
  readonly surface: ProbabilityAnchor['surface']
  readonly curto: number
  readonly medio: number
  readonly longo: number
  readonly n: number
}

export const RALLY_LENGTH_SHARE: readonly RallyLengthShare[] = [
  { surface: 'saibro', curto: 0.649, medio: 0.216, longo: 0.134, n: 1660 },
  { surface: 'grama', curto: 0.774, medio: 0.157, longo: 0.069, n: 1623 },
  { surface: 'rapida', curto: 0.688, medio: 0.18, longo: 0.131, n: 1386 },
]

/**
 * O achado que mais se aproxima do Golden Scenario 001, nas palavras do artigo
 * (Conclusions, p. 13):
 *
 * "The most common point winning combination of shot for the server was the one
 * in which the point started with a first serve, there was a rally of less than
 * five shots and the point ended after a bounce of the ball in the service zone
 * (zone 1) and a subsequent aggressive shot."
 *
 * Traduzindo para a situação do cenário: **bola quicando curta, dentro da
 * quadra, seguida de golpe agressivo é o padrão de finalização mais frequente
 * do profissional.** Isso sustenta a existência do cenário — descritivamente,
 * como manda § 00.2b. Não sustenta o número de cada escolha: ninguém mediu
 * "cruzado curto versus profundo na quadra aberta a partir de bola curta".
 */
export const SHORT_BALL_FINISH_NOTE =
  'Prieto-Lage et al. (2023), Conclusions: a combinação mais frequente de ponto ' +
  'ganho pelo sacador é primeiro saque, rally de menos de cinco golpes, e ' +
  'finalização após um quique na zona de saque seguido de golpe agressivo.'
