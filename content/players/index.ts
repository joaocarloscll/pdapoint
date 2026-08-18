/**
 * Padrões de jogadores profissionais — biblioteca qualitativa.
 *
 * Origem: o fundador colou um documento de "deep research" atribuindo
 * estatísticas hiperespecíficas e terminologia inventada a jogadores reais
 * (ver EVIDENCE_SOURCES.md § 00c). Os números não entraram — são fabricados.
 * O que sobrevive aqui é a característica de jogo por trás de cada entrada:
 * reescrita em termos qualitativos, sem percentual, com base em reputação
 * pública amplamente reconhecida (cobertura de tênis, comentário
 * especializado), não em medição.
 *
 * Tier `geral` (PRODUCT.md § 00.1): aceito como base sozinho desde que a
 * classificação nunca finja precisão que não tem. Por isso nenhuma entrada
 * aqui usa número, e a redação evita verbos que implicam medição ("X% das
 * vezes") em favor de frequência qualitativa ("costuma", "tende a").
 *
 * Jogadores retirados são descritos no passado — não porque a característica
 * deixou de ser verdadeira, mas porque afirmar no presente sobre alguém que
 * não compete mais seria impreciso.
 */

import type { SourceRef } from '../../tactical-engine/domain/types'
import type { ProfessionalProfile } from './types'

const REPUTATION_SOURCE: SourceRef = {
  tier: 'geral',
  referencia:
    'Observação de estilo de jogo amplamente reconhecida — cobertura de tênis, ' +
    'comentário especializado (transmissões, análise pós-jogo). Sem estudo único ' +
    'por trás; convenção pública, não medição.',
  oQueSustenta:
    'A característica de jogo qualitativa descrita — não uma taxa, percentual ou ' +
    'métrica. Nenhum número deste jogador foi medido ou verificado por este projeto.',
  verificadaPor: null,
  verificadaEm: null,
}

export const PLAYER_PROFILES: readonly ProfessionalProfile[] = [
  {
    id: 'swiatek',
    name: 'Iga Świątek',
    tour: 'WTA',
    patterns: [
      {
        id: 'swiatek-forehand-runaround',
        situation: 'Bola ao meio ou levemente à esquerda, ritmo de rally neutro.',
        intent: 'attack',
        tendency:
          'Tende a contornar para bater de forehand com topspin pesado, mesmo em ' +
          'bolas que dariam para devolver de backhand, buscando o corredor aberto ' +
          'na diagonal.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'alcaraz',
    name: 'Carlos Alcaraz',
    tour: 'ATP',
    patterns: [
      {
        id: 'alcaraz-drop-shot',
        situation: 'Rali neutro prolongado, adversário estabilizado atrás da linha.',
        intent: 'finish',
        tendency:
          'Conhecido por variar com drop shot como forma de romper o padrão do rali, ' +
          'sobretudo quando o adversário já foi empurrado para trás da linha de base.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'fonseca',
    name: 'João Fonseca',
    tour: 'ATP',
    patterns: [
      {
        id: 'fonseca-flat-forehand',
        situation: 'Bola dentro da quadra, ainda no início do ponto.',
        intent: 'attack',
        tendency:
          'Reconhecido pela imprensa especializada por um forehand potente e mais ' +
          'plano que o padrão do circuito, usado para atacar cedo em vez de construir ' +
          'o ponto.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'sinner',
    name: 'Jannik Sinner',
    tour: 'ATP',
    patterns: [
      {
        id: 'sinner-flat-pace',
        situation: 'Rali de ritmo — qualquer momento em que a bola está disponível cedo.',
        intent: 'attack',
        tendency:
          'Joga de forma plana e agressiva nos dois lados, tomando a bola cedo para ' +
          'não dar tempo de recuperação ao adversário.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'ruud',
    name: 'Casper Ruud',
    tour: 'ATP',
    patterns: [
      {
        id: 'ruud-topspin-construction',
        situation: 'Construção de rali no saibro.',
        intent: 'construct',
        tendency:
          'Constrói o ponto com forehand de topspin pesado e alta margem sobre a rede, ' +
          'historicamente mais efetivo em quadras de saibro do que em superfícies rápidas.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'serena-williams',
    name: 'Serena Williams',
    tour: 'WTA',
    patterns: [
      {
        id: 'serena-backhand-power',
        situation: 'Bola interna ou curta no lado do backhand.',
        intent: 'finish',
        tendency:
          'Tinha um backhand tão agressivo quanto o forehand — o que a dispensava de ' +
          'sempre contornar para o lado dominante, incomum no circuito da época.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'sharapova',
    name: 'Maria Sharapova',
    tour: 'WTA',
    patterns: [
      {
        id: 'sharapova-second-serve-attack',
        situation: 'Devolução de segundo saque do adversário.',
        intent: 'attack',
        tendency:
          'Era conhecida por atacar diretamente o segundo saque, aproveitando a menor ' +
          'velocidade para antecipar e assumir a iniciativa do ponto.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'djokovic',
    name: 'Novak Djokovic',
    tour: 'ATP',
    patterns: [
      {
        id: 'djokovic-return-block',
        situation: 'Devolução de primeiro saque potente.',
        intent: 'defend',
        tendency:
          'Um dos devolvedores mais consistentes da história do tênis, com bloqueio ' +
          'de devolução profundo ao centro geométrico da quadra contra saques fortes.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'medvedev',
    name: 'Daniil Medvedev',
    tour: 'ATP',
    patterns: [
      {
        id: 'medvedev-deep-return-position',
        situation: 'Devolução contra saque de alta velocidade.',
        intent: 'defend',
        tendency:
          'Costuma devolver bem atrás da linha de fundo contra saques potentes, ' +
          'absorvendo o ritmo em vez de arriscar um retorno agressivo.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'murray',
    name: 'Andy Murray',
    tour: 'ATP',
    patterns: [
      {
        id: 'murray-defensive-variety',
        situation: 'Sob pressão, deslocado da posição central.',
        intent: 'defend',
        tendency:
          'Tinha grande variedade defensiva, misturando slice cruzado e lob para ' +
          'quebrar o ritmo do adversário e ganhar tempo de recuperação.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'haddad-maia',
    name: 'Beatriz Haddad Maia',
    tour: 'WTA',
    patterns: [
      {
        id: 'haddad-maia-lefty-serve-angle',
        situation: 'Saque no lado da vantagem, canhota contra destro.',
        intent: 'serve',
        tendency:
          'Como canhota, usa o saque com efeito para explorar um ângulo pouco comum ' +
          'para devolvedores destros, que enfrentam menos esse padrão no circuito.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'zverev',
    name: 'Alexander Zverev',
    tour: 'ATP',
    patterns: [
      {
        id: 'zverev-backhand-depth',
        situation: 'Troca cruzada de backhand.',
        intent: 'construct',
        tendency:
          'Constrói o ponto com profundidade consistente de backhand, historicamente ' +
          'preferindo sustentar o rali a subir à rede em busca de finalização precoce.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'halep',
    name: 'Simona Halep',
    tour: 'WTA',
    patterns: [
      {
        id: 'halep-defense-to-offense',
        situation: 'Sob pressão angulada, ainda dentro de alcance.',
        intent: 'defend',
        tendency:
          'Reconhecida pela movimentação defensiva lateral e pela capacidade de ' +
          'converter uma bola defensiva em bola de ataque pelo corredor que se abre.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'simon',
    name: 'Gilles Simon',
    tour: 'ATP',
    patterns: [
      {
        id: 'simon-low-pace-attrition',
        situation: 'Rali contra adversário de perfil agressivo.',
        intent: 'neutralize',
        tendency:
          'Jogava com ritmo propositalmente reduzido e bolas sem profundidade extra, ' +
          'testando a paciência de adversários que dependiam do ritmo do próprio golpe.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'federer',
    name: 'Roger Federer',
    tour: 'ATP',
    patterns: [
      {
        id: 'federer-slice-approach',
        situation: 'Bola de meia altura, no meio da quadra.',
        intent: 'attack',
        tendency:
          'Usava o slice para cortar o ritmo do rali e criar oportunidades de subida ' +
          'à rede, em vez de depender só de golpes de fundo para atacar.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'musetti',
    name: 'Lorenzo Musetti',
    tour: 'ATP',
    patterns: [
      {
        id: 'musetti-one-handed-backhand',
        situation: 'Bola alta ou de ritmo acelerado no lado do backhand.',
        intent: 'attack',
        tendency:
          'Um dos poucos jogadores de elite do circuito atual com backhand de uma mão, ' +
          'usado tanto para fatiar e variar quanto para acelerar quando a bola permite.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'sabalenka',
    name: 'Aryna Sabalenka',
    tour: 'WTA',
    patterns: [
      {
        id: 'sabalenka-power-both-wings',
        situation: 'Desde a devolução, contra qualquer saque não decisivo.',
        intent: 'attack',
        tendency:
          'Aposta em potência nos dois lados já a partir da devolução, buscando ditar ' +
          'o ponto desde os primeiros golpes em vez de construir gradualmente.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'muchova',
    name: 'Karolína Muchová',
    tour: 'WTA',
    patterns: [
      {
        id: 'muchova-touch-and-net',
        situation: 'Bola curta ou de baixa velocidade, com espaço para variar.',
        intent: 'finish',
        tendency:
          'Tem um repertório de variação pouco comum no circuito atual, misturando ' +
          'toque, mudanças de ritmo e subidas ocasionais à rede.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'barty',
    name: 'Ashleigh Barty',
    tour: 'WTA',
    patterns: [
      {
        id: 'barty-slice-variety',
        situation: 'Rali estagnado, sem ângulo claro para nenhum lado.',
        intent: 'neutralize',
        tendency:
          'Combinava slice de backhand variado com subidas oportunistas à rede — um ' +
          'estilo de variação pouco comum no circuito feminino da sua época.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'isner',
    name: 'John Isner',
    tour: 'ATP',
    patterns: [
      {
        id: 'isner-serve-dependency',
        situation: 'Qualquer ponto sacando.',
        intent: 'serve',
        tendency:
          'Dependia de um saque excepcionalmente potente para encerrar pontos ' +
          'rapidamente, reduzindo deliberadamente a exposição a rallies longos.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'dimitrov',
    name: 'Grigor Dimitrov',
    tour: 'ATP',
    patterns: [
      {
        id: 'dimitrov-backhand-versatility',
        situation: 'Bola no lado do backhand, ritmo variável.',
        intent: 'construct',
        tendency:
          'Tem um backhand de uma mão versátil, usado tanto para fatiar e variar o ' +
          'ritmo quanto para acelerar quando a oportunidade aparece.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
]

export function findProfile(id: string): ProfessionalProfile | undefined {
  return PLAYER_PROFILES.find((p) => p.id === id)
}
