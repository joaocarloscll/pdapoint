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
 * As classificações abaixo são PROVISÓRIAS e refletem convenção de treinamento,
 * não evidência verificada. É exatamente por isso que o status é rascunho.
 */

import type { TacticalScenario } from '../../tactical-engine/domain/types'

export const golden001: TacticalScenario = {
  id: 'attack-short-forehand-001',
  version: 1,
  title: 'Atacar bola curta com adversário deslocado',
  context:
    'Você recebe uma bola curta no forehand, dentro da quadra, com o adversário ' +
    'deslocado para o lado do backhand dele.',
  category: 'ataque',
  level: 'intermediaria',
  kind: 'simples',

  initialStateId: 's1',

  states: [
    {
      id: 's1',
      ball: { x: 0.58, y: 0.66 },
      players: {
        a: { position: { x: 0.52, y: 0.8 } },
        b: { position: { x: 0.24, y: 0.17 }, recovering: true },
      },
      phase: 'attack',
      advantage: 'a',
      hitter: 'a',
      availableChoices: ['c1', 'c2', 'c3'],
    },
    {
      // Cruzado curto — devolve ângulo antes de consolidar a vantagem
      id: 's2',
      ball: { x: 0.22, y: 0.34 },
      players: {
        a: { position: { x: 0.46, y: 0.72 } },
        b: { position: { x: 0.26, y: 0.3 } },
      },
      phase: 'neutral',
      advantage: 'neutral',
      hitter: 'b',
      availableChoices: [],
      terminal: 'neutralized_end',
    },
    {
      // Cruzado profundo — mantém B deslocado e sustenta a vantagem
      id: 's3',
      ball: { x: 0.18, y: 0.12 },
      players: {
        a: { position: { x: 0.5, y: 0.62 } },
        b: { position: { x: 0.16, y: 0.1 }, recovering: true },
      },
      phase: 'attack',
      advantage: 'a',
      hitter: 'b',
      availableChoices: [],
      terminal: 'forced_error_b',
    },
    {
      // Paralela — muda a direção com o adversário já deslocado para lá
      id: 's4',
      ball: { x: 0.78, y: 0.2 },
      players: {
        a: { position: { x: 0.6, y: 0.66 } },
        b: { position: { x: 0.7, y: 0.22 } },
      },
      phase: 'neutral',
      advantage: 'neutral',
      hitter: 'b',
      availableChoices: [],
      terminal: 'neutralized_end',
    },
  ],

  choices: [
    {
      id: 'c1',
      stateId: 's1',
      label: 'Cruzado curto',
      shotIntent: 'attack',
      targetZone: 'deuce-short',
      classification: 'incomum',
      explanation:
        'A bola curta cruzada devolve ângulo ao adversário e encurta a distância ' +
        'que ele precisa percorrer para voltar ao ponto neutro.',
    },
    {
      id: 'c2',
      stateId: 's1',
      label: 'Cruzado profundo',
      shotIntent: 'construct',
      targetZone: 'deuce-deep',
      classification: 'padrao',
      explanation:
        'A profundidade mantém o adversário atrás da linha de base e preserva a ' +
        'vantagem de posição antes da finalização.',
    },
    {
      id: 'c3',
      stateId: 's1',
      label: 'Paralela',
      shotIntent: 'finish',
      targetZone: 'ad-short',
      classification: 'situacional',
      explanation:
        'Muda a direção para o lado em que o adversário já se recupera, e exige ' +
        'execução muito precisa por passar sobre a parte alta da rede.',
    },
  ],

  transitions: [
    {
      id: 't1',
      fromStateId: 's1',
      choiceId: 'c1',
      toStateId: 's2',
      scoreDelta: -1,
      timeline: [
        {
          kind: 'move-ball',
          startMs: 0,
          durationMs: 620,
          from: { x: 0.58, y: 0.66 },
          to: { x: 0.22, y: 0.34 },
          arc: 0.3,
          easing: 'ease-out',
        },
        {
          kind: 'move-player',
          startMs: 120,
          durationMs: 640,
          player: 'b',
          from: { x: 0.24, y: 0.17 },
          to: { x: 0.26, y: 0.3 },
          easing: 'ease-in-out',
        },
        {
          kind: 'highlight-zone',
          startMs: 640,
          durationMs: 900,
          zone: 'ad-deep',
          tone: 'risk',
        },
        { kind: 'pause', startMs: 1540, durationMs: 400 },
      ],
    },
    {
      id: 't2',
      fromStateId: 's1',
      choiceId: 'c2',
      toStateId: 's3',
      scoreDelta: 2,
      timeline: [
        {
          kind: 'move-ball',
          startMs: 0,
          durationMs: 700,
          from: { x: 0.58, y: 0.66 },
          to: { x: 0.18, y: 0.12 },
          arc: 0.22,
          easing: 'ease-out',
        },
        {
          kind: 'move-player',
          startMs: 140,
          durationMs: 720,
          player: 'b',
          from: { x: 0.24, y: 0.17 },
          to: { x: 0.16, y: 0.1 },
          easing: 'ease-in-out',
        },
        {
          kind: 'highlight-zone',
          startMs: 720,
          durationMs: 900,
          zone: 'ad-deep',
          tone: 'opportunity',
        },
        { kind: 'pause', startMs: 1620, durationMs: 400 },
      ],
    },
    {
      id: 't3',
      fromStateId: 's1',
      choiceId: 'c3',
      toStateId: 's4',
      scoreDelta: 0,
      timeline: [
        {
          kind: 'move-ball',
          startMs: 0,
          durationMs: 660,
          from: { x: 0.58, y: 0.66 },
          to: { x: 0.78, y: 0.2 },
          arc: 0.26,
          easing: 'ease-out',
        },
        {
          kind: 'move-player',
          startMs: 100,
          durationMs: 700,
          player: 'b',
          from: { x: 0.24, y: 0.17 },
          to: { x: 0.7, y: 0.22 },
          easing: 'ease-in-out',
        },
        { kind: 'pause', startMs: 1360, durationMs: 400 },
      ],
    },
  ],

  tacticalPrinciple:
    'Com o adversário deslocado, consolidar a vantagem costuma valer mais do ' +
    'que tentar encerrar o ponto imediatamente.',
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
