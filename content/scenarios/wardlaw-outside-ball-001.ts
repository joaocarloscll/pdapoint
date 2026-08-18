/**
 * GOLDEN SCENARIO 002 — Bola externa em rally cruzado: manter ou mudar?
 *
 * STATUS: PUBLICADA.
 *
 * Fonte tier C: as Direcionais de Wardlaw (Wardlaw Directionals), sistema do
 * treinador universitário Paul Wardlaw para seleção de golpe de alta
 * percentagem a partir do fundo de quadra. Verificado por convergência de
 * múltiplas fontes secundárias independentes (fóruns de coaching, plataformas
 * de curso, material de treinadores) descrevendo o mesmo sistema, atribuído
 * ao mesmo autor, de forma consistente — ver EVIDENCE_SOURCES.md § 00c.2.
 * Nenhum documento primário único foi aberto; é um heurístico de ensino
 * amplamente replicado, não um artigo científico.
 *
 * A regra central: numa bola "externa" (que cruza a frente do corpo do
 * jogador), manter a direção de onde ela veio é a jogada de alta
 * percentagem — mudar de direção exige compensar o ângulo natural de
 * deflexão da bola, e isso eleva o erro não forçado. É exatamente a situação
 * modelada aqui: A recebe uma bola externa, funda, na diagonal cruzada, com
 * o adversário já recuperado e centralizado — ou seja, sem vantagem aberta
 * para explorar. A tentação de "trocar de lado" não é uma oportunidade
 * tática, é risco desnecessário.
 *
 * As três probabilidades são `estimated`: Wardlaw não publica taxas de
 * acerto — é convenção de ensino, não medição (tier `geral`/`C` nunca vira
 * `padrão`, PRODUCT.md § 00.1 Regra 1). Nenhuma cita âncora: não há medição
 * publicada sobre "cruzado fundo vs. mudança de direção a partir de bola
 * externa" para calibrar contra.
 *
 * Geometria: A está perto (y alto), B longe (y baixo) — mesma convenção do
 * cenário 001. A recebe a bola no canto direito do seu próprio fundo de
 * quadra (bola externa vinda da diagonal); B já recuperou para o centro do
 * seu próprio fundo — sem posição para explorar, ao contrário do cenário 001.
 */

import type { TacticalScenario } from '../../tactical-engine/domain/types'

export const wardlawOutsideBall001: TacticalScenario = {
  id: 'wardlaw-outside-ball-001',
  version: 1,
  title: 'Bola externa em rally cruzado',
  context:
    'Você recebe uma bola funda e cruzada no seu canto direito — uma bola externa, ' +
    'que cruza a frente do seu corpo. O adversário já recuperou para o centro da ' +
    'quadra dele: não há espaço aberto para atacar, só a tentação de trocar de lado.',
  category: 'rally',
  level: 'intermediaria',
  kind: 'simples',

  initialStateId: 's1',

  states: [
    {
      id: 's1',
      ball: { x: 0.8, y: 0.84 },
      players: {
        a: { position: { x: 0.8, y: 0.84 } },
        b: { position: { x: 0.4, y: 0.2 } },
      },
      phase: 'construction',
      advantage: 'neutral',
      hitter: 'a',
      availableChoices: ['c1', 'c2', 'c3'],
    },
    {
      // Cruzado fundo, mesma diagonal → B pressionado no canto erra na rede.
      id: 's2',
      ball: { x: 0.2, y: 0.49 },
      players: {
        a: { position: { x: 0.55, y: 0.8 } },
        b: { position: { x: 0.12, y: 0.14 } },
      },
      phase: 'defense',
      advantage: 'a',
      hitter: 'b',
      availableChoices: [],
      terminal: 'unforced_error_b',
    },
    {
      // Mudança de direção contra a bola externa → briga com a deflexão, sai fora.
      id: 's3',
      ball: { x: 0.97, y: 0.15 },
      players: {
        a: { position: { x: 0.72, y: 0.78 } },
        b: { position: { x: 0.52, y: 0.22 } },
      },
      phase: 'attack',
      advantage: 'b',
      hitter: 'a',
      availableChoices: [],
      terminal: 'unforced_error_a',
    },
    {
      // Cruzado sem profundidade → B, já centralizado, entra e finaliza.
      id: 's4',
      ball: { x: 0.78, y: 0.92 },
      players: {
        a: { position: { x: 0.62, y: 0.82 } },
        b: { position: { x: 0.24, y: 0.28 } },
      },
      phase: 'defense',
      advantage: 'b',
      hitter: 'b',
      availableChoices: [],
      terminal: 'winner_b',
    },
  ],

  choices: [
    {
      id: 'c1',
      stateId: 's1',
      label: 'Cruzado fundo, mesma direção',
      shotIntent: 'neutralize',
      targetZone: 'opp-left-deep',
      winProbability: {
        value: 0.68,
        basis: 'estimated',
        note:
          'ESTIMATIVA. Premissa: numa bola externa sem vantagem aberta, manter a ' +
          'diagonal é a jogada de alta percentagem das Direcionais de Wardlaw — ' +
          'não força o ângulo de deflexão e mantém o adversário preso ao canto de ' +
          'onde acabou de sair. Precisa de dado de taxa de ponto ganho ao sustentar ' +
          'a diagonal em bola externa neutra.',
      },
      explanation:
        'A bola externa quer sair na mesma diagonal por natureza. Devolvê-la para ' +
        'onde veio não exige compensar ângulo nenhum, e mantém o adversário preso ' +
        'ao canto — mesmo já recuperado, ele segue sem tempo para reabrir a quadra.',
    },
    {
      id: 'c2',
      stateId: 's1',
      label: 'Mudar para a linha (paralela)',
      shotIntent: 'construct',
      targetZone: 'opp-right-deep',
      winProbability: {
        value: 0.22,
        basis: 'estimated',
        note:
          'ESTIMATIVA. Premissa: mudar de direção numa bola externa exige compensar ' +
          'o ângulo natural de deflexão sem nenhuma vantagem de posição que ' +
          'justifique o risco — exatamente a exceção que as Direcionais de Wardlaw ' +
          'reservam a bola interna, não externa. Precisa de dado de taxa de erro não ' +
          'forçado ao mudar direção em bola externa sem vantagem.',
      },
      explanation:
        'Trocar de lado numa bola externa briga com a direção que ela já traz. Sem ' +
        'um adversário fora de posição para justificar o risco, a margem para o ' +
        'erro desaparece — e foi para fora.',
    },
    {
      id: 'c3',
      stateId: 's1',
      label: 'Cruzado, mas sem profundidade',
      shotIntent: 'neutralize',
      targetZone: 'opp-left-short',
      winProbability: {
        value: 0.34,
        basis: 'estimated',
        note:
          'ESTIMATIVA. Premissa: a direção está certa (mesma diagonal), mas a falta ' +
          'de profundidade entrega ao adversário já centralizado uma bola confortável ' +
          'para entrar na quadra e atacar. Precisa de dado de taxa de ponto ganho por ' +
          'profundidade de devolução em rally neutro.',
      },
      explanation:
        'Manter a diagonal é a metade certa da decisão — mas sem profundidade a bola ' +
        'sobra curta exatamente onde o adversário, já recuperado, pode dar um passo ' +
        'para dentro e assumir o ataque.',
    },
  ],

  transitions: [
    {
      id: 't1',
      fromStateId: 's1',
      choiceId: 'c1',
      toStateId: 's2',
      scoreDelta: 4,
      timeline: [
        // Seu golpe: cruzado fundo, mesma diagonal.
        {
          kind: 'move-ball',
          startMs: 0,
          durationMs: 620,
          from: { x: 0.8, y: 0.84 },
          to: { x: 0.14, y: 0.12 },
          arc: 0.22,
          easing: 'ease-out',
        },
        {
          kind: 'move-player',
          startMs: 80,
          durationMs: 560,
          player: 'a',
          from: { x: 0.8, y: 0.84 },
          to: { x: 0.55, y: 0.8 },
          easing: 'ease-in-out',
        },
        {
          kind: 'move-player',
          startMs: 100,
          durationMs: 600,
          player: 'b',
          from: { x: 0.4, y: 0.2 },
          to: { x: 0.12, y: 0.14 },
          easing: 'ease-in-out',
        },
        {
          kind: 'highlight-zone',
          startMs: 620,
          durationMs: 700,
          zone: 'opp-left-deep',
          tone: 'opportunity',
        },
        { kind: 'pause', startMs: 700, durationMs: 220 },
        // A resposta sob pressão: nem sai da rede.
        {
          kind: 'move-ball',
          startMs: 920,
          durationMs: 360,
          from: { x: 0.14, y: 0.12 },
          to: { x: 0.2, y: 0.49 },
          arc: 0.05,
          easing: 'ease-out',
        },
        { kind: 'pause', startMs: 1280, durationMs: 420 },
      ],
    },
    {
      id: 't2',
      fromStateId: 's1',
      choiceId: 'c2',
      toStateId: 's3',
      scoreDelta: -3,
      timeline: [
        {
          kind: 'highlight-zone',
          startMs: 0,
          durationMs: 640,
          zone: 'opp-right-deep',
          tone: 'risk',
        },
        {
          kind: 'move-ball',
          startMs: 0,
          durationMs: 600,
          from: { x: 0.8, y: 0.84 },
          to: { x: 0.97, y: 0.15 },
          arc: 0.2,
          easing: 'ease-out',
        },
        {
          kind: 'move-player',
          startMs: 100,
          durationMs: 560,
          player: 'a',
          from: { x: 0.8, y: 0.84 },
          to: { x: 0.72, y: 0.78 },
          easing: 'ease-in-out',
        },
        // B mal começa a se mover: a bola já saiu antes de chegar até ele.
        {
          kind: 'move-player',
          startMs: 160,
          durationMs: 520,
          player: 'b',
          from: { x: 0.4, y: 0.2 },
          to: { x: 0.52, y: 0.22 },
          easing: 'ease-out',
        },
        { kind: 'bounce', startMs: 600, durationMs: 380, at: { x: 1.06, y: 0.13 } },
        {
          kind: 'move-ball',
          startMs: 620,
          durationMs: 360,
          from: { x: 0.97, y: 0.15 },
          to: { x: 1.16, y: 0.1 },
          arc: 0.03,
          easing: 'linear',
        },
        { kind: 'pause', startMs: 980, durationMs: 460 },
      ],
    },
    {
      id: 't3',
      fromStateId: 's1',
      choiceId: 'c3',
      toStateId: 's4',
      scoreDelta: -2,
      timeline: [
        {
          kind: 'move-ball',
          startMs: 0,
          durationMs: 540,
          from: { x: 0.8, y: 0.84 },
          to: { x: 0.2, y: 0.42 },
          arc: 0.16,
          easing: 'ease-out',
        },
        {
          kind: 'move-player',
          startMs: 80,
          durationMs: 500,
          player: 'a',
          from: { x: 0.8, y: 0.84 },
          to: { x: 0.62, y: 0.82 },
          easing: 'ease-in-out',
        },
        // B não precisa recuperar: já estava centralizado. Só dá um passo para dentro.
        {
          kind: 'move-player',
          startMs: 100,
          durationMs: 480,
          player: 'b',
          from: { x: 0.4, y: 0.2 },
          to: { x: 0.24, y: 0.28 },
          easing: 'ease-out',
        },
        { kind: 'pause', startMs: 580, durationMs: 220 },
        {
          kind: 'highlight-zone',
          startMs: 800,
          durationMs: 900,
          zone: 'own-center-deep',
          tone: 'risk',
        },
        {
          kind: 'move-ball',
          startMs: 860,
          durationMs: 560,
          from: { x: 0.2, y: 0.42 },
          to: { x: 0.78, y: 0.92 },
          arc: 0.18,
          easing: 'ease-out',
        },
        { kind: 'bounce', startMs: 1420, durationMs: 380, at: { x: 0.78, y: 0.92 } },
        {
          kind: 'move-ball',
          startMs: 1440,
          durationMs: 360,
          from: { x: 0.78, y: 0.92 },
          to: { x: 0.9, y: 1.1 },
          arc: 0.03,
          easing: 'linear',
        },
        { kind: 'pause', startMs: 1800, durationMs: 380 },
      ],
    },
  ],

  tacticalPrinciple:
    'Numa bola externa sem vantagem de posição aberta, manter a direção de onde ela ' +
    'veio é a jogada de alta percentagem — mudar de direção exige compensar o ângulo ' +
    'natural de deflexão da bola, e isso só compensa quando há uma vantagem real para ' +
    'explorar.',
  whenToUse:
    'Bola externa, funda, em rally neutro, com o adversário já recuperado e sem ' +
    'posição aberta para atacar.',
  whenNotToUse:
    'Quando o adversário está genuinamente fora de posição (ver Golden Scenario 001) ' +
    '— aí a mudança de direção deixa de ser risco e passa a ser a jogada correta.',

  source: {
    tier: 'C',
    referencia:
      'Wardlaw Directionals — sistema de seleção de golpe de Paul Wardlaw, técnico ' +
      'universitário norte-americano de tênis feminino. Sem publicação científica ' +
      'única; convenção de ensino verificada por convergência de múltiplas fontes ' +
      'secundárias independentes (ver EVIDENCE_SOURCES.md § 00c.2).',
    oQueSustenta:
      'A regra de que, numa bola "externa" (que cruza a frente do corpo do jogador), ' +
      'a jogada de alta percentagem é manter a direção de onde ela veio, e que mudar ' +
      'de direção exige compensar o ângulo natural de deflexão da bola — daí o maior ' +
      'risco de erro. Sustenta a existência e a direção deste cenário, como convenção ' +
      'de ensino (PRODUCT.md § 00.1, tier `geral`/`C`). NÃO sustenta a probabilidade ' +
      'de cada escolha: Wardlaw não publica taxas de acerto.',
    verificadaPor: null,
    verificadaEm: null,
  },
  reviewer: null,
  status: 'publicada',
}
