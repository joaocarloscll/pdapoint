/**
 * Padrões de jogadores profissionais — biblioteca qualitativa.
 *
 * Origem: o fundador colou um documento de "deep research" atribuindo
 * estatísticas hiperespecíficas a jogadores reais, sem citação nenhuma (ver
 * EVIDENCE_SOURCES.md § 00c). Os números não entraram — são fabricados. Um
 * segundo pacote, mais disciplinado, trouxe fonte real e citável por padrão
 * (§ 00e) — esse conteúdo entrou, com tier B/C quando a fonte sustenta e
 * `geral` quando é reputação pública sem estudo específico.
 *
 * Em nenhum dos dois casos entra número. O que sobrevive é a característica
 * de jogo por trás de cada entrada: reescrita em termos qualitativos, sem
 * percentual, com base em reputação pública amplamente reconhecida ou em
 * fonte tier B/C real.
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

/**
 * Tier C — livro de treinador com trajetória verificável.
 *
 * Crespo, M., & Reid, M. (2003). *Tennis Tactics: Winning Patterns of Play.*
 * Human Kinetics. Já catalogado em EVIDENCE_SOURCES.md § 04.4. Miguel Crespo é
 * o mesmo autor da revisão sistemática da ITF citada em § 00b.2 — convergência
 * entre pacotes de pesquisa independentes, não coincidência de nome.
 */
const COACHING_BOOK_SOURCE: SourceRef = {
  tier: 'C',
  referencia:
    'Crespo, M., & Reid, M. (2003). Tennis Tactics: Winning Patterns of Play. ' +
    'Human Kinetics. Ver EVIDENCE_SOURCES.md § 04.4.',
  oQueSustenta:
    'O padrão de jogo qualitativo descrito, como convenção de manual de ensino — ' +
    'não uma taxa de sucesso medida para este jogador específico.',
  verificadaPor: null,
  verificadaEm: null,
}

/**
 * Tier B — periódico de análise de performance.
 *
 * Martín-Lorente, E., Campos, J., & Crespo, M. (2017). "The inside out forehand
 * as a tactical pattern in men's professional tennis". International Journal of
 * Performance Analysis in Sport, 17(4). DOI 10.1080/24748668.2017.1349528.
 * Estuda o padrão em 11 jogadores do top-14 ATP (2011–2014) de forma agregada —
 * sustenta que o padrão é real e documentado no profissional, não que este
 * jogador específico foi medido individualmente no artigo.
 */
const INSIDE_OUT_FOREHAND_STUDY_SOURCE: SourceRef = {
  tier: 'B',
  referencia:
    'Martín-Lorente E, Campos J, Crespo M (2017). The inside out forehand as a ' +
    'tactical pattern in men’s professional tennis. International Journal of ' +
    'Performance Analysis in Sport 17(4). DOI 10.1080/24748668.2017.1349528.',
  oQueSustenta:
    'Que o forehand inside-out/inside-in é um padrão tático documentado e usado ' +
    'por jogadores de elite para cobrir o lado mais fraco e criar ângulos mais ' +
    'agressivos — sustentado para o padrão em geral, não medido individualmente ' +
    'para este jogador.',
  verificadaPor: null,
  verificadaEm: null,
}

const CORE_PROFILES: readonly ProfessionalProfile[] = [
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

/**
 * Adicionados em 2026-08-18 a partir de um segundo pacote de pesquisa do
 * fundador (PDA_POINT_DEEP_RESEARCH_COMPLETE). Diferente do primeiro, este
 * catalogava fonte por padrão de forma estruturada — id de fonte, tier,
 * status de revisão — o que permitiu filtrar mecanicamente antes de escrever
 * qualquer texto: só entram padrões cuja fonte citada existe de fato no
 * catálogo do próprio pacote (ver EVIDENCE_SOURCES.md § 00e sobre as ~32
 * referências pendentes encontradas e descartadas por esse motivo) e cujo
 * tipo de fonte não é fórum/rede social isolada.
 */
const ADDED_2026_08_18: readonly ProfessionalProfile[] = [
  {
    id: 'nadal',
    name: 'Rafael Nadal',
    tour: 'ATP',
    patterns: [
      {
        id: 'nadal-serve-forehand-construction',
        situation: 'Devolução administrável após o próprio saque.',
        intent: 'construct',
        tendency:
          'Usava o saque para viabilizar o forehand como arma principal, não só ' +
          'para buscar o ace diretamente — o saque abria caminho para o padrão, em ' +
          'vez de encerrar o ponto sozinho.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'graf',
    name: 'Steffi Graf',
    tour: 'WTA',
    patterns: [
      {
        id: 'graf-forehand-runaround-dominance',
        situation: 'Bola na zona de backhand, com tempo e espaço suficientes.',
        intent: 'attack',
        tendency:
          'Contornava para bater de forehand sempre que o tempo permitia — o ' +
          'forehand era o motor ofensivo principal do seu jogo.',
      },
    ],
    source: COACHING_BOOK_SOURCE,
  },
  {
    id: 'navratilova',
    name: 'Martina Navratilova',
    tour: 'WTA',
    patterns: [
      {
        id: 'navratilova-serve-volley',
        situation: 'Primeiro saque em jogo.',
        intent: 'attack',
        tendency:
          'Sacava e fechava a rede em sequência, usando o próprio saque como ' +
          'preparação para o primeiro voleio — geometria de ataque clássica do ' +
          'saque e voleio.',
      },
    ],
    source: COACHING_BOOK_SOURCE,
  },
  {
    id: 'seles',
    name: 'Monica Seles',
    tour: 'WTA',
    patterns: [
      {
        id: 'seles-early-contact-angle',
        situation: 'Bola que permite contato antecipado, ainda subindo do quique.',
        intent: 'attack',
        tendency:
          'Tomava a bola cedo com golpe plano de duas mãos, o que comprimia o ' +
          'tempo de recuperação do adversário e abria ângulos agudos logo em ' +
          'seguida.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'sampras',
    name: 'Pete Sampras',
    tour: 'ATP',
    patterns: [
      {
        id: 'sampras-serve-volley-first-strike',
        situation: 'Primeiro saque com resposta fraca do adversário.',
        intent: 'attack',
        tendency:
          'Sacava e fechava a rede para o primeiro voleio, somando a pressão do ' +
          'saque à pressão de posição — identidade clássica de saque e voleio.',
      },
    ],
    source: COACHING_BOOK_SOURCE,
  },
  {
    id: 'agassi',
    name: 'Andre Agassi',
    tour: 'ATP',
    patterns: [
      {
        id: 'agassi-early-baseline-depth',
        situation: 'Bola que permite contato antecipado no fundo de quadra.',
        intent: 'attack',
        tendency:
          'Tomava a bola cedo, perto da linha de fundo, priorizando profundidade ' +
          'antes de buscar ângulo agudo na bola seguinte.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'connors',
    name: 'Jimmy Connors',
    tour: 'ATP',
    patterns: [
      {
        id: 'connors-early-flat-pressure',
        situation: 'Devolução ou troca de fundo, bola disponível cedo.',
        intent: 'attack',
        tendency:
          'Tomava a bola cedo e batia plano tanto na devolução quanto no rali, ' +
          'impondo ritmo desde a primeira oportunidade em vez de construir o ' +
          'ponto aos poucos.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'lendl',
    name: 'Ivan Lendl',
    tour: 'ATP',
    patterns: [
      {
        id: 'lendl-inside-out-forehand',
        situation: 'Bola no canto de backhand, com tempo para se deslocar.',
        intent: 'attack',
        tendency:
          'Contornava para o forehand inside-out para controlar a geometria do ' +
          'ponto pelo lado dominante — um padrão que a literatura de análise ' +
          'tática documenta como recorrente no profissional de elite, não uma ' +
          'invenção pessoal do jogador.',
      },
    ],
    source: INSIDE_OUT_FOREHAND_STUDY_SOURCE,
  },
  {
    id: 'kuerten',
    name: 'Gustavo Kuerten',
    tour: 'ATP',
    patterns: [
      {
        id: 'kuerten-backhand-dtl-clay',
        situation: 'Construção cruzada de backhand no saibro.',
        intent: 'attack',
        tendency:
          'Usava a mudança de direção de backhand para a linha como opção de ' +
          'ataque assinatura, dentro de uma construção de ponto majoritariamente ' +
          'cruzada — mão de backhand equilibrada o suficiente para arriscar a ' +
          'redireção sem perder margem.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'mcenroe',
    name: 'John McEnroe',
    tour: 'ATP',
    patterns: [
      {
        id: 'mcenroe-serve-net-close',
        situation: 'Qualquer saque que permita avanço.',
        intent: 'attack',
        tendency:
          'Fechava a rede imediatamente depois do saque, com identidade de saque ' +
          'e voleio extrema mesmo para os padrões da própria época.',
      },
    ],
    source: COACHING_BOOK_SOURCE,
  },
  {
    id: 'borg',
    name: 'Björn Borg',
    tour: 'ATP',
    patterns: [
      {
        id: 'borg-topspin-construction',
        situation: 'Rali neutro de fundo de quadra.',
        intent: 'construct',
        tendency:
          'Construía o ponto com profundidade de topspin pesado e paciência, ' +
          'esperando a abertura em vez de forçar a finalização precoce — ' +
          'identidade de fundo de quadra que marcou a época.',
      },
    ],
    source: COACHING_BOOK_SOURCE,
  },
  {
    id: 'evert',
    name: 'Chris Evert',
    tour: 'WTA',
    patterns: [
      {
        id: 'evert-baseline-consistency',
        situation: 'Rali neutro, sem abertura ainda evidente.',
        intent: 'construct',
        tendency:
          'Sustentava profundidade e consistência de fundo de quadra antes de ' +
          'arriscar a abertura, deixando o erro do adversário fazer o trabalho ' +
          'quando a paciência era maior que a dele.',
      },
    ],
    source: COACHING_BOOK_SOURCE,
  },
  {
    id: 'venus-williams',
    name: 'Venus Williams',
    tour: 'WTA',
    patterns: [
      {
        id: 'venus-serve-first-strike',
        situation: 'Qualquer ponto sacando.',
        intent: 'attack',
        tendency:
          'Usava a potência do saque para já sair na frente do ponto, buscando ' +
          'pressão imediata no golpe seguinte em vez de construir gradualmente.',
      },
    ],
    source: COACHING_BOOK_SOURCE,
  },
  {
    id: 'hingis',
    name: 'Martina Hingis',
    tour: 'WTA',
    patterns: [
      {
        id: 'hingis-placement-over-pace',
        situation: 'Rali em que o adversário aposta em ritmo e potência.',
        intent: 'construct',
        tendency:
          'Priorizava ângulo e colocação sobre potência bruta, usando ' +
          'antecipação e posição de quadra para neutralizar adversárias mais ' +
          'fortes fisicamente — reputação central do seu estilo de jogo.',
      },
    ],
    source: COACHING_BOOK_SOURCE,
  },
  {
    id: 'henin',
    name: 'Justine Henin',
    tour: 'WTA',
    patterns: [
      {
        id: 'henin-one-handed-backhand-dtl',
        situation: 'Bola no lado do backhand, com equilíbrio para acelerar.',
        intent: 'attack',
        tendency:
          'Usava o backhand de uma mão para mudar de direção na linha quando o ' +
          'equilíbrio permitia — golpe considerado um dos mais versáteis do ' +
          'circuito feminino da sua época.',
      },
    ],
    source: COACHING_BOOK_SOURCE,
  },
  {
    id: 'wawrinka',
    name: 'Stan Wawrinka',
    tour: 'ATP',
    patterns: [
      {
        id: 'wawrinka-backhand-dtl',
        situation: 'Construção cruzada de backhand, com equilíbrio ofensivo.',
        intent: 'attack',
        tendency:
          'Constrói cruzado até o backhand ficar equilibrado o suficiente para ' +
          'mudar de direção na linha com aceleração — um dos backhands de uma ' +
          'mão mais temidos do circuito pela capacidade de finalizar de lá.',
      },
    ],
    source: COACHING_BOOK_SOURCE,
  },
  {
    id: 'tsitsipas',
    name: 'Stefanos Tsitsipas',
    tour: 'ATP',
    patterns: [
      {
        id: 'tsitsipas-inside-out-forehand',
        situation: 'Bola no canto de backhand, com tempo para se deslocar.',
        intent: 'attack',
        tendency:
          'Contorna para o forehand inside-out/inside-in para impor o lado ' +
          'dominante — mesmo padrão documentado na literatura de análise tática ' +
          'como recorrente entre jogadores de elite, não uma leitura isolada ' +
          'deste jogador.',
      },
    ],
    source: INSIDE_OUT_FOREHAND_STUDY_SOURCE,
  },
  {
    id: 'osaka',
    name: 'Naomi Osaka',
    tour: 'WTA',
    patterns: [
      {
        id: 'osaka-serve-first-strike',
        situation: 'Qualquer ponto sacando, devolução administrável.',
        intent: 'attack',
        tendency:
          'Combina saque potente com o primeiro golpe de fundo agressivo, ' +
          'buscando decidir o ponto nos dois primeiros golpes em vez de ' +
          'sustentar o rali.',
      },
    ],
    source: REPUTATION_SOURCE,
  },
  {
    id: 'fritz',
    name: 'Taylor Fritz',
    tour: 'ATP',
    patterns: [
      {
        id: 'fritz-serve-forehand-first-strike',
        situation: 'Qualquer ponto sacando.',
        intent: 'attack',
        tendency:
          'Usa o saque para preparar o primeiro forehand de fundo, buscando ' +
          'controlar o ponto cedo através da combinação das duas armas.',
      },
    ],
    source: COACHING_BOOK_SOURCE,
  },
  {
    id: 'de-minaur',
    name: 'Alex de Minaur',
    tour: 'ATP',
    patterns: [
      {
        id: 'de-minaur-counterattack-after-defense',
        situation: 'Depois de uma recuperação defensiva bem-sucedida.',
        intent: 'defend',
        tendency:
          'Usa a velocidade de deslocamento para transformar defesa em ' +
          'contra-ataque assim que recupera uma bola aparentemente perdida, em ' +
          'vez de apenas devolver a bola em jogo.',
      },
    ],
    source: COACHING_BOOK_SOURCE,
  },
]

export const PLAYER_PROFILES: readonly ProfessionalProfile[] = [
  ...CORE_PROFILES,
  ...ADDED_2026_08_18,
]

export function findProfile(id: string): ProfessionalProfile | undefined {
  return PLAYER_PROFILES.find((p) => p.id === id)
}
