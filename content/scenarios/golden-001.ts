/**
 * GOLDEN SCENARIO 001 — Atacar bola curta com adversário deslocado
 *
 * ⚠️ STATUS: RASCUNHO. FONTE PENDENTE.
 *
 * Este cenário existe para que o engine e o renderer possam ser construídos e
 * testados contra um caso real. Ele NÃO pode ser publicado: o validador
 * (invariante 11) rejeita qualquer cenário com fonte pendente cujo status
 * ultrapasse `rascunho`.
 *
 * Para promover a `revisada` e depois `publicada`:
 *   1. abrir uma fonte tier B/C em IJRSS ou ITF CSSR (ver EVIDENCE_SOURCES.md § 01b);
 *   2. confirmar que ela sustenta a afirmação sobre ataque à bola curta;
 *   3. preencher source.referencia, oQueSustenta, verificadaPor, verificadaEm;
 *   4. revisar as classificações à luz do que a fonte de fato sustenta.
 *
 * As probabilidades abaixo são todas `estimated` — estimativa editorial, não
 * medição. O validador (invariante 15) impede que um cenário com qualquer
 * número estimado seja publicado. Elas existem para que a mecânica de
 * avaliação possa ser construída e testada; cada uma declara, no campo
 * `note`, exatamente qual dado a substituiria.
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
      targetZone: 'deuce-short',
      winProbability: {
        value: 0.44,
        basis: 'estimated',
        note:
          'ESTIMATIVA. Premissa: devolver ângulo e bola curta com o adversário ' +
          'em recuperação inverte a iniciativa. Precisa de dado de taxa de ' +
          'ponto ganho após bola curta cruzada em situação de ataque.',
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
      targetZone: 'ad-deep',
      winProbability: {
        value: 0.76,
        basis: 'estimated',
        note:
          'ESTIMATIVA. Premissa: atacar o espaço aberto com profundidade contra ' +
          'adversário deslocado é o padrão dominante. Precisa de dado de taxa ' +
          'de ponto ganho ao atacar quadra aberta.',
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
      targetZone: 'center-short',
      winProbability: {
        value: 0.58,
        basis: 'estimated',
        note:
          'ESTIMATIVA. Premissa: bola central sem profundidade devolve a ' +
          'iniciativa sem conceder ângulo — pior que atacar, melhor que abrir ' +
          'a quadra para ele. Precisa de dado de profundidade × ponto ganho.',
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
          zone: 'ad-deep',
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
        { kind: 'pause', startMs: 1560, durationMs: 420 },
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
          zone: 'ad-deep',
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
        { kind: 'pause', startMs: 900, durationMs: 460 },
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
          zone: 'deuce-deep',
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
        { kind: 'pause', startMs: 1560, durationMs: 420 },
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
    tier: 'PENDENTE',
    referencia: '',
    oQueSustenta: '',
    verificadaPor: null,
    verificadaEm: null,
  },
  reviewer: null,
  status: 'rascunho',
}
