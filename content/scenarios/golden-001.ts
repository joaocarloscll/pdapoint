/**
 * GOLDEN SCENARIO 001 — Atacar bola curta com adversário deslocado
 *
 * ⚠️ STATUS: RASCUNHO. FONTE ENCONTRADA, ASSINATURA HUMANA PENDENTE.
 *
 * A fonte tier B existe e foi lida: Prieto-Lage et al. (2023), PLOS ONE,
 * CC BY — ver `content/evidence/prieto-lage-2023.ts` e EVIDENCE_SOURCES.md
 * § 00. Ela sustenta a existência e a direção deste cenário de forma
 * descritiva. O que ainda falta para promover a `revisada` é apenas o passo
 * que só um humano pode dar (§ 00.1, Regra 2):
 *
 *   1. o fundador abre o artigo pelo DOI e confere os trechos citados;
 *   2. preenche source.verificadaPor e source.verificadaEm;
 *   3. revisa a redação à luz do que a fonte de fato sustenta.
 *
 * As probabilidades abaixo continuam todas `estimated`, e isso é deliberado.
 * O artigo mede frequência de ponto ganho por tipo de saque e duração de
 * rally; ninguém mediu "cruzado curto versus profundo na quadra aberta a
 * partir de bola curta". Rotular estes números como `derived` porque agora
 * existe um artigo por perto seria exatamente a fraude que o modelo de
 * procedência existe para impedir.
 *
 * O que mudou: cada estimativa agora cita, em `anchorId`, a âncora medida mais
 * próxima. Assim dá para ver de quanto ela se afasta do que alguém de fato
 * mediu — e o validador (invariante 16) continua impedindo que qualquer uma
 * delas seja publicada.
 *
 * ---
 *
 * Todo caminho resolve o ponto (PRODUCT.md § 00.4). O adversário responde e
 * pontua quando a escolha abre espaço para isso — a consequência precisa ser
 * sentida, não anunciada. Por isso cada transição anima dois golpes: o seu e a
 * resposta dele.
 *
 * Geometria: A está perto (y alto), B longe (y baixo). B está deslocado para a
 * esquerda e em recuperação, portanto a quadra aberta é a direita.
 */

import type { TacticalScenario } from '../../tactical-engine/domain/types'

export const golden001: TacticalScenario = {
  id: 'attack-short-forehand-001',
  version: 2,
  title: 'Atacar bola curta com adversário deslocado',
  context:
    'Você recebe uma bola curta no forehand, dentro da quadra, com o adversário ' +
    'deslocado para a esquerda e ainda em recuperação. A quadra aberta é a direita.',
  category: 'ataque',
  level: 'intermediaria',
  kind: 'simples',

  initialStateId: 's1',

  states: [
    {
      id: 's1',
      ball: { x: 0.58, y: 0.62 },
      players: {
        a: { position: { x: 0.52, y: 0.78 } },
        b: { position: { x: 0.22, y: 0.1 }, recovering: true },
      },
      phase: 'attack',
      advantage: 'a',
      hitter: 'a',
      availableChoices: ['c1', 'c2', 'c3'],
    },
    {
      // Cruzado curto → devolve ângulo e bola curta; B entra e passa.
      id: 's2',
      ball: { x: 0.9, y: 0.74 },
      players: {
        a: { position: { x: 0.68, y: 0.76 } },
        b: { position: { x: 0.2, y: 0.34 } },
      },
      phase: 'defense',
      advantage: 'b',
      hitter: 'a',
      availableChoices: [],
      terminal: 'winner_b',
    },
    {
      // Ataque profundo na quadra aberta → B não cobre a distância.
      id: 's3',
      ball: { x: 0.82, y: 0.08 },
      players: {
        a: { position: { x: 0.55, y: 0.7 } },
        b: { position: { x: 0.56, y: 0.13 } },
      },
      phase: 'attack',
      advantage: 'a',
      hitter: 'b',
      availableChoices: [],
      terminal: 'winner_a',
    },
    {
      // Bola ao meio sem profundidade → B recupera, entra e ataca.
      id: 's4',
      ball: { x: 0.12, y: 0.78 },
      players: {
        a: { position: { x: 0.36, y: 0.8 } },
        b: { position: { x: 0.48, y: 0.3 } },
      },
      phase: 'defense',
      advantage: 'b',
      hitter: 'a',
      availableChoices: [],
      terminal: 'winner_b',
    },
  ],

  choices: [
    {
      id: 'c1',
      stateId: 's1',
      label: 'Cruzado curto',
      shotIntent: 'attack',
      targetZone: 'opp-left-short',
      winProbability: {
        value: 0.44,
        basis: 'estimated',
        anchorId: 'pl2023-fs-curto-rapida',
        note:
          'ESTIMATIVA. Premissa: devolver ângulo e bola curta com o adversário ' +
          'em recuperação inverte a iniciativa. A âncora citada (0,81 — sacador ' +
          'em rally curto após primeiro saque, quadra rápida) é a faixa medida ' +
          'de quem domina esse tipo de ponto; este número fica muito abaixo dela ' +
          'porque a premissa é justamente perder o domínio. Substituível por ' +
          'taxa de ponto ganho após bola curta cruzada em situação de ataque — ' +
          'que ninguém publicou.',
      },
      explanation:
        'A bola curta cruzada encurta a distância que o adversário precisa ' +
        'percorrer e ainda lhe entrega ângulo: ele entra na quadra e passa para ' +
        'o lado que você abriu ao se deslocar.',
    },
    {
      id: 'c2',
      stateId: 's1',
      label: 'Ataque profundo na quadra aberta',
      shotIntent: 'finish',
      targetZone: 'opp-right-deep',
      winProbability: {
        value: 0.76,
        basis: 'estimated',
        anchorId: 'pl2023-fs-curto-rapida',
        note:
          'ESTIMATIVA. Premissa: atacar o espaço aberto com profundidade contra ' +
          'adversário deslocado é o padrão dominante. Prieto-Lage et al. (2023) ' +
          'medem 0,77–0,81 para o sacador em rally curto — a faixa em que vive ' +
          'quem domina um ponto curto — e descrevem quique curto seguido de ' +
          'golpe agressivo como a combinação de finalização mais frequente. ' +
          'Isso sustenta o cenário, não este número: ficamos abaixo da âncora ' +
          'porque ela inclui aces e devoluções não devolvidas, que aqui não ' +
          'existem. Substituível por taxa de ponto ganho ao atacar quadra ' +
          'aberta a partir de bola curta.',
      },
      explanation:
        'Profundidade no espaço que o adversário deixou: ele já está em ' +
        'recuperação para o lado oposto e não cobre a distância a tempo.',
    },
    {
      id: 'c3',
      stateId: 's1',
      label: 'Bola ao meio, sem profundidade',
      shotIntent: 'neutralize',
      targetZone: 'opp-center-short',
      winProbability: {
        value: 0.58,
        basis: 'estimated',
        anchorId: 'pl2023-fs-medio-rapida',
        note:
          'ESTIMATIVA. Premissa: bola central sem profundidade devolve a ' +
          'iniciativa sem conceder ângulo — pior que atacar, melhor que abrir ' +
          'a quadra para ele. A âncora é o rally médio (0,52), onde a vantagem ' +
          'de quem começou mandando já evaporou: é exatamente o que esta ' +
          'escolha provoca. Substituível por dado de profundidade × ponto ganho.',
      },
      explanation:
        'Devolver ao meio sem profundidade entrega a iniciativa: o adversário ' +
        'recupera a posição, entra na quadra e ataca o lado que ficou aberto.',
    },
  ],

  transitions: [
    {
      id: 't1',
      fromStateId: 's1',
      choiceId: 'c1',
      toStateId: 's2',
      scoreDelta: -2,
      timeline: [
        // Seu golpe.
        {
          kind: 'move-ball',
          startMs: 0,
          durationMs: 560,
          from: { x: 0.58, y: 0.62 },
          to: { x: 0.2, y: 0.38 },
          arc: 0.26,
          easing: 'ease-out',
        },
        {
          kind: 'move-player',
          startMs: 80,
          durationMs: 560,
          player: 'b',
          from: { x: 0.22, y: 0.1 },
          to: { x: 0.2, y: 0.34 },
          easing: 'ease-in-out',
        },
        { kind: 'pause', startMs: 640, durationMs: 240 },
        // A resposta que pune: passa para a quadra que você abriu.
        {
          kind: 'highlight-zone',
          startMs: 820,
          durationMs: 1000,
          // O espaço aberto na NOSSA metade, para onde ele passa.
          zone: 'own-right-deep',
          tone: 'risk',
        },
        {
          kind: 'move-ball',
          startMs: 880,
          durationMs: 640,
          from: { x: 0.2, y: 0.38 },
          to: { x: 0.9, y: 0.74 },
          arc: 0.2,
          easing: 'ease-out',
        },
        {
          kind: 'move-player',
          startMs: 940,
          durationMs: 620,
          player: 'a',
          from: { x: 0.52, y: 0.78 },
          to: { x: 0.68, y: 0.76 },
          easing: 'ease-out',
        },
        // A bola quica dentro e sai: é o quique que fecha o ponto.
        { kind: 'bounce', startMs: 1520, durationMs: 420, at: { x: 0.9, y: 0.74 } },
        {
          kind: 'move-ball',
          startMs: 1540,
          durationMs: 420,
          from: { x: 0.9, y: 0.74 },
          to: { x: 1.04, y: 0.96 },
          arc: 0.04,
          easing: 'linear',
        },
        { kind: 'pause', startMs: 1960, durationMs: 380 },
      ],
    },
    {
      id: 't2',
      fromStateId: 's1',
      choiceId: 'c2',
      toStateId: 's3',
      scoreDelta: 3,
      timeline: [
        {
          kind: 'highlight-zone',
          startMs: 0,
          durationMs: 900,
          // O espaço aberto na metade DELE, que é o alvo do ataque.
          zone: 'opp-right-deep',
          tone: 'opportunity',
        },
        {
          kind: 'move-ball',
          startMs: 0,
          durationMs: 680,
          from: { x: 0.58, y: 0.62 },
          to: { x: 0.82, y: 0.08 },
          arc: 0.18,
          easing: 'ease-out',
        },
        // B corre e não alcança.
        {
          kind: 'move-player',
          startMs: 120,
          durationMs: 780,
          player: 'b',
          from: { x: 0.22, y: 0.1 },
          to: { x: 0.56, y: 0.13 },
          easing: 'ease-out',
        },
        {
          kind: 'move-player',
          startMs: 160,
          durationMs: 620,
          player: 'a',
          from: { x: 0.52, y: 0.78 },
          to: { x: 0.55, y: 0.7 },
          easing: 'ease-in-out',
        },
        { kind: 'bounce', startMs: 640, durationMs: 420, at: { x: 0.82, y: 0.08 } },
        {
          kind: 'move-ball',
          startMs: 660,
          durationMs: 400,
          from: { x: 0.82, y: 0.08 },
          to: { x: 0.94, y: -0.06 },
          arc: 0.04,
          easing: 'linear',
        },
        { kind: 'pause', startMs: 1060, durationMs: 460 },
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
          from: { x: 0.58, y: 0.62 },
          to: { x: 0.5, y: 0.4 },
          arc: 0.22,
          easing: 'ease-out',
        },
        // B recupera a posição e entra na quadra.
        {
          kind: 'move-player',
          startMs: 60,
          durationMs: 620,
          player: 'b',
          from: { x: 0.22, y: 0.1 },
          to: { x: 0.48, y: 0.3 },
          easing: 'ease-in-out',
        },
        { kind: 'pause', startMs: 680, durationMs: 220 },
        {
          kind: 'highlight-zone',
          startMs: 840,
          durationMs: 1000,
          // O espaço aberto na nossa metade, do lado esquerdo.
          zone: 'own-left-deep',
          tone: 'risk',
        },
        {
          kind: 'move-ball',
          startMs: 900,
          durationMs: 620,
          from: { x: 0.5, y: 0.4 },
          to: { x: 0.12, y: 0.78 },
          arc: 0.22,
          easing: 'ease-out',
        },
        {
          kind: 'move-player',
          startMs: 960,
          durationMs: 600,
          player: 'a',
          from: { x: 0.52, y: 0.78 },
          to: { x: 0.36, y: 0.8 },
          easing: 'ease-out',
        },
        { kind: 'bounce', startMs: 1500, durationMs: 420, at: { x: 0.12, y: 0.78 } },
        {
          kind: 'move-ball',
          startMs: 1520,
          durationMs: 420,
          from: { x: 0.12, y: 0.78 },
          to: { x: -0.04, y: 0.98 },
          arc: 0.04,
          easing: 'linear',
        },
        { kind: 'pause', startMs: 1940, durationMs: 380 },
      ],
    },
  ],

  tacticalPrinciple:
    'Com o adversário deslocado e em recuperação, atacar o espaço aberto com ' +
    'profundidade encerra o ponto; devolver ângulo ou entregar a iniciativa o ' +
    'traz de volta ao jogo.',
  whenToUse:
    'Bola atacável dentro da quadra, com o adversário fora de posição e em ' +
    'recuperação.',
  whenNotToUse:
    'Quando o adversário já recuperou a posição central, ou quando a bola não ' +
    'permite deslocamento para o golpe dominante.',

  source: {
    tier: 'B',
    referencia:
      'Prieto-Lage I, Paramés-González A, Torres-Santos D, Argibay-González JC, ' +
      'Reguera-López-de-la-Osa X, Gutiérrez-Santiago A (2023). Match analysis and ' +
      'probability of winning a point in elite men’s singles tennis. ' +
      'PLOS ONE 18(9): e0286076. DOI 10.1371/journal.pone.0286076. CC BY 4.0.',
    oQueSustenta:
      'Que a combinação de ponto ganho mais frequente no profissional masculino ' +
      'é rally curto finalizado após um quique na zona de saque seguido de golpe ' +
      'agressivo (Conclusions, p. 13), e que os pontos ganhos com winner ou erro ' +
      'forçado são dirigidos majoritariamente à zona 1 e às zonas laterais ' +
      'profundas (p. 11). Sustenta a existência e a direção do cenário, de forma ' +
      'descritiva (PRODUCT.md § 00.2b). NÃO sustenta a probabilidade de cada ' +
      'escolha: essa comparação não foi medida por ninguém.',
    verificadaPor: null,
    verificadaEm: null,
  },
  reviewer: null,
  status: 'rascunho',
}
