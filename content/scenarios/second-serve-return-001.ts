/**
 * GOLDEN SCENARIO 003 — Devolução de segundo saque
 *
 * STATUS: PUBLICADA.
 *
 * Fonte tier C: USTA, "Tennis strategy: Returning first and second serves"
 * (página oficial de instrução). Ver EVIDENCE_SOURCES.md § 00e. A
 * recomendação: quando o segundo saque chega com mais tempo e menos ritmo, a
 * jogada de alta percentagem é avançar dentro da linha de fundo e devolver
 * com profundidade e efeito — não bloquear passivamente, e não forçar um
 * winner direto tão cedo no ponto.
 *
 * Primeiro cenário do projeto na fase de **devolução** (R-02 do
 * PATTERN_BACKLOG.md, terceiro candidato priorizado). Diferente dos dois
 * primeiros: aqui a vantagem inicial não é posicional (adversário fora de
 * lugar, como no 001) nem geométrica (bola externa, como no 002) — é
 * **estatística e embutida na própria situação**. O segundo saque já é, em
 * média, pior para quem saca: as âncoras de Prieto-Lage et al. (2023) medem o
 * sacador vencendo bem menos pontos de segundo saque do que de primeiro
 * (`content/evidence/prieto-lage-2023.ts`). As três probabilidades abaixo
 * usam essa âncora como calibração — não como medição direta da escolha, que
 * ninguém fez — mostrando que a passividade devolve exatamente a vantagem que
 * a estatística diz que o devolvedor já tem.
 *
 * Geometria: A devolve (y alto), B sacou e recupera (y baixo). Não há
 * deslocamento algum de B no estado inicial — o segundo saque não desloca
 * fisicamente o sacador, a vantagem do devolvedor vem do tempo extra da bola,
 * não da posição do adversário.
 */

import type { TacticalScenario } from '../../tactical-engine/domain/types'

export const secondServeReturn001: TacticalScenario = {
  id: 'second-serve-return-001',
  version: 1,
  title: 'Devolução de segundo saque',
  context:
    'O segundo saque do adversário chega curto e com pouco ritmo — mais tempo do ' +
    'que o primeiro saque costuma dar. O adversário já recuperou para o centro, ' +
    'sem posição para explorar: a vantagem aqui é do tempo que a bola te dá, não ' +
    'de um erro de posicionamento dele.',
  category: 'devolucao',
  level: 'intermediaria',
  kind: 'simples',

  initialStateId: 's1',

  states: [
    {
      id: 's1',
      ball: { x: 0.52, y: 0.62 },
      players: {
        a: { position: { x: 0.5, y: 0.92 } },
        b: { position: { x: 0.5, y: 0.15 } },
      },
      phase: 'return',
      advantage: 'neutral',
      hitter: 'a',
      availableChoices: ['c1', 'c2', 'c3'],
    },
    {
      // Avançar e devolver com profundidade e efeito → B, empurrado, erra.
      id: 's2',
      ball: { x: 0.53, y: 0.49 },
      players: {
        a: { position: { x: 0.5, y: 0.72 } },
        b: { position: { x: 0.14, y: 0.13 } },
      },
      phase: 'defense',
      advantage: 'a',
      hitter: 'b',
      availableChoices: [],
      terminal: 'unforced_error_b',
    },
    {
      // Buscar o winner cedo demais → sai fora.
      id: 's3',
      ball: { x: 0.96, y: 0.16 },
      players: {
        a: { position: { x: 0.62, y: 0.86 } },
        b: { position: { x: 0.54, y: 0.22 } },
      },
      phase: 'attack',
      advantage: 'b',
      hitter: 'a',
      availableChoices: [],
      terminal: 'unforced_error_a',
    },
    {
      // Bloquear sem risco → devolve a vantagem embutida do segundo saque.
      id: 's4',
      ball: { x: 0.8, y: 0.9 },
      players: {
        a: { position: { x: 0.55, y: 0.84 } },
        b: { position: { x: 0.5, y: 0.32 } },
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
      label: 'Avançar e devolver com profundidade e efeito',
      shotIntent: 'attack',
      targetZone: 'opp-left-deep',
      winProbability: {
        value: 0.62,
        basis: 'estimated',
        anchorId: 'pl2023-ss-rapida',
        note:
          'ESTIMATIVA. Premissa: avançar dentro da linha e devolver fundo com ' +
          'efeito aproveita o tempo extra do segundo saque para assumir a ' +
          'iniciativa. A âncora citada (sacador vence 57% dos pontos de segundo ' +
          'saque em quadra rápida — ou seja, o devolvedor já parte de ~43% de ' +
          'base) mostra que existe vantagem real embutida na situação; esta ' +
          'escolha deveria ficar acima dessa base, não é medição da escolha em ' +
          'si. Precisa de dado de taxa de ponto ganho por devolução agressiva de ' +
          'segundo saque especificamente.',
      },
      explanation:
        'O segundo saque tira o efeito surpresa do sacador. Avançar e devolver ' +
        'fundo com efeito aproveita esse tempo extra para empurrar o sacador para ' +
        'trás antes que ele se recomponha — a iniciativa muda de mão.',
    },
    {
      id: 'c2',
      stateId: 's1',
      label: 'Buscar o winner direto na linha',
      shotIntent: 'finish',
      targetZone: 'opp-right-deep',
      winProbability: {
        value: 0.25,
        basis: 'estimated',
        anchorId: 'pl2023-ss-rapida',
        note:
          'ESTIMATIVA. Premissa: tentar encerrar o ponto tão cedo, contra uma ' +
          'bola que ainda quica de forma um pouco imprevisível, tem margem baixa ' +
          'para erro. Fica abaixo da base de ~43% da âncora porque o risco supera ' +
          'a vantagem que o segundo saque já entregou de graça. Precisa de dado ' +
          'de taxa de erro não forçado em tentativa de winner de devolução.',
      },
      explanation:
        'A bola do segundo saque ainda pode quicar de forma pouco previsível, e o ' +
        'ponto mal começou. Arriscar o winner aqui joga fora, sem necessidade, a ' +
        'vantagem que o tempo extra já garantia.',
    },
    {
      id: 'c3',
      stateId: 's1',
      label: 'Bloquear no meio, sem risco',
      shotIntent: 'neutralize',
      targetZone: 'opp-center-short',
      winProbability: {
        value: 0.3,
        basis: 'estimated',
        anchorId: 'pl2023-ss-rapida',
        note:
          'ESTIMATIVA. Premissa: devolver sem profundidade nem efeito é seguro em ' +
          'termos de erro próprio, mas devolve ao sacador uma bola confortável no ' +
          'meio — exatamente a vantagem de tempo que o segundo saque lhe deu de ' +
          'volta. Abaixo da base da âncora porque joga fora um tempo extra que a ' +
          'estatística mostra que existe. Precisa de dado de taxa de ponto ganho ' +
          'por profundidade de devolução em segundo saque.',
      },
      explanation:
        'Bloquear sem profundidade evita o erro na hora, mas devolve ao sacador ' +
        'uma bola central e confortável — ele recompõe o ponto como se a ' +
        'vantagem do segundo saque nunca tivesse existido.',
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
        {
          kind: 'highlight-zone',
          startMs: 0,
          durationMs: 640,
          zone: 'opp-left-deep',
          tone: 'opportunity',
        },
        {
          kind: 'move-ball',
          startMs: 0,
          durationMs: 600,
          from: { x: 0.52, y: 0.62 },
          to: { x: 0.14, y: 0.12 },
          arc: 0.24,
          easing: 'ease-out',
        },
        {
          kind: 'move-player',
          startMs: 80,
          durationMs: 540,
          player: 'a',
          from: { x: 0.5, y: 0.92 },
          to: { x: 0.5, y: 0.72 },
          easing: 'ease-in-out',
        },
        {
          kind: 'move-player',
          startMs: 100,
          durationMs: 560,
          player: 'b',
          from: { x: 0.5, y: 0.15 },
          to: { x: 0.14, y: 0.13 },
          easing: 'ease-in-out',
        },
        { kind: 'pause', startMs: 680, durationMs: 220 },
        // Empurrado para o canto, a resposta nem sai da rede.
        {
          kind: 'move-ball',
          startMs: 900,
          durationMs: 360,
          from: { x: 0.14, y: 0.12 },
          to: { x: 0.53, y: 0.49 },
          arc: 0.05,
          easing: 'ease-out',
        },
        { kind: 'pause', startMs: 1260, durationMs: 420 },
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
          durationMs: 600,
          zone: 'opp-right-deep',
          tone: 'risk',
        },
        {
          kind: 'move-ball',
          startMs: 0,
          durationMs: 580,
          from: { x: 0.52, y: 0.62 },
          to: { x: 0.96, y: 0.16 },
          arc: 0.16,
          easing: 'ease-out',
        },
        {
          kind: 'move-player',
          startMs: 100,
          durationMs: 540,
          player: 'a',
          from: { x: 0.5, y: 0.92 },
          to: { x: 0.62, y: 0.86 },
          easing: 'ease-in-out',
        },
        {
          kind: 'move-player',
          startMs: 140,
          durationMs: 500,
          player: 'b',
          from: { x: 0.5, y: 0.15 },
          to: { x: 0.54, y: 0.22 },
          easing: 'ease-out',
        },
        { kind: 'bounce', startMs: 580, durationMs: 380, at: { x: 1.05, y: 0.14 } },
        {
          kind: 'move-ball',
          startMs: 600,
          durationMs: 340,
          from: { x: 0.96, y: 0.16 },
          to: { x: 1.14, y: 0.11 },
          arc: 0.03,
          easing: 'linear',
        },
        { kind: 'pause', startMs: 940, durationMs: 460 },
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
          durationMs: 520,
          from: { x: 0.52, y: 0.62 },
          to: { x: 0.5, y: 0.42 },
          arc: 0.12,
          easing: 'ease-out',
        },
        {
          kind: 'move-player',
          startMs: 80,
          durationMs: 480,
          player: 'a',
          from: { x: 0.5, y: 0.92 },
          to: { x: 0.55, y: 0.84 },
          easing: 'ease-in-out',
        },
        // B recompõe o ponto como se a vantagem do segundo saque nunca tivesse existido.
        {
          kind: 'move-player',
          startMs: 100,
          durationMs: 460,
          player: 'b',
          from: { x: 0.5, y: 0.15 },
          to: { x: 0.5, y: 0.32 },
          easing: 'ease-out',
        },
        { kind: 'pause', startMs: 560, durationMs: 220 },
        {
          kind: 'highlight-zone',
          startMs: 780,
          durationMs: 900,
          zone: 'own-center-deep',
          tone: 'risk',
        },
        {
          kind: 'move-ball',
          startMs: 840,
          durationMs: 540,
          from: { x: 0.5, y: 0.42 },
          to: { x: 0.8, y: 0.9 },
          arc: 0.17,
          easing: 'ease-out',
        },
        { kind: 'bounce', startMs: 1380, durationMs: 380, at: { x: 0.8, y: 0.9 } },
        {
          kind: 'move-ball',
          startMs: 1400,
          durationMs: 340,
          from: { x: 0.8, y: 0.9 },
          to: { x: 0.92, y: 1.08 },
          arc: 0.03,
          easing: 'linear',
        },
        { kind: 'pause', startMs: 1740, durationMs: 380 },
      ],
    },
  ],

  tacticalPrinciple:
    'O segundo saque entrega tempo extra ao devolvedor. Avançar e devolver com ' +
    'profundidade e efeito aproveita esse tempo para assumir a iniciativa; ' +
    'bloquear sem profundidade devolve de graça a vantagem que a estatística diz ' +
    'que o devolvedor já tinha, e forçar um winner cedo demais joga a mesma ' +
    'vantagem fora pelo lado do risco.',
  whenToUse:
    'Segundo saque do adversário, com tempo e altura de bola suficientes para ' +
    'avançar dentro da linha de fundo.',
  whenNotToUse:
    'Segundo saque com efeito ou velocidade incomuns que não deem tempo real de ' +
    'avançar — aí a prioridade volta a ser controle antes de ataque.',

  source: {
    tier: 'C',
    referencia:
      'USTA. "Tennis strategy: Returning first and second serves." Página oficial ' +
      'de instrução. Ver EVIDENCE_SOURCES.md § 00e.',
    oQueSustenta:
      'Que a jogada de alta percentagem contra um segundo saque com tempo e ritmo ' +
      'reduzidos é avançar dentro da linha de fundo e devolver com profundidade e ' +
      'efeito, em vez de bloquear passivamente. Sustenta a existência e a direção ' +
      'deste cenário, como convenção oficial de ensino (PRODUCT.md § 00.1, tier C). ' +
      'NÃO sustenta a probabilidade de cada escolha: a USTA não publica taxa de ' +
      'acerto por tática de devolução.',
    verificadaPor: null,
    verificadaEm: null,
  },
  reviewer: null,
  status: 'publicada',
}
