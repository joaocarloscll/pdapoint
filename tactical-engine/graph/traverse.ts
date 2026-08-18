/**
 * Percurso do grafo de estados.
 *
 * A UI pergunta ao engine "qual é o estado atual e o que devo desenhar?".
 * Este módulo responde a isso, e nada mais — não conhece React nem DOM.
 */

import type {
  TacticalChoice,
  TacticalScenario,
  TacticalState,
  TacticalTransition,
} from '../domain/types'
import { canonicalHash, guardrailBreach } from './guardrails'

export type EngineError =
  | { kind: 'unknown-state'; stateId: string }
  | { kind: 'unknown-choice'; choiceId: string }
  | { kind: 'choice-not-available'; choiceId: string; stateId: string }
  | { kind: 'state-is-terminal'; stateId: string }
  | { kind: 'missing-transition'; stateId: string; choiceId: string }
  | { kind: 'guardrail'; reason: 'max-strokes' | 'state-repeat' }

export type Result<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: EngineError }

/**
 * Uma sessão de reprodução de um cenário.
 *
 * Imutável: cada decisão produz uma nova sessão. Isso torna replay,
 * comparação e "voltar ao estado anterior" triviais, e elimina uma classe
 * inteira de bugs de estado compartilhado.
 */
export type PlaySession = {
  readonly scenario: TacticalScenario
  readonly currentStateId: string
  /** Escolhas feitas, em ordem. Base do replay. */
  readonly choiceSequence: readonly string[]
  /** Transições percorridas, em ordem. */
  readonly transitionSequence: readonly string[]
  readonly visitedHashes: readonly string[]
  readonly score: number
}

export function startSession(scenario: TacticalScenario): Result<PlaySession> {
  const initial = findState(scenario, scenario.initialStateId)
  if (initial === undefined) {
    return {
      ok: false,
      error: { kind: 'unknown-state', stateId: scenario.initialStateId },
    }
  }

  return {
    ok: true,
    value: {
      scenario,
      currentStateId: initial.id,
      choiceSequence: [],
      transitionSequence: [],
      visitedHashes: [canonicalHash(initial)],
      score: 0,
    },
  }
}

export function currentState(session: PlaySession): TacticalState | undefined {
  return findState(session.scenario, session.currentStateId)
}

export function availableChoices(
  session: PlaySession,
): readonly TacticalChoice[] {
  const state = currentState(session)
  if (state === undefined) return []
  return state.availableChoices
    .map((id) => findChoice(session.scenario, id))
    .filter((c): c is TacticalChoice => c !== undefined)
}

export function isTerminal(session: PlaySession): boolean {
  return currentState(session)?.terminal !== undefined
}

/**
 * Aplica uma decisão e avança para o próximo estado.
 *
 * Retorna a nova sessão e a transição a ser animada. A UI reproduz a timeline
 * da transição antes de renderizar o novo estado — é o que sustenta a Fase 4
 * do loop (a animação é o argumento, não enfeite).
 */
export function choose(
  session: PlaySession,
  choiceId: string,
): Result<{ session: PlaySession; transition: TacticalTransition }> {
  const state = currentState(session)
  if (state === undefined) {
    return {
      ok: false,
      error: { kind: 'unknown-state', stateId: session.currentStateId },
    }
  }

  if (state.terminal !== undefined) {
    return { ok: false, error: { kind: 'state-is-terminal', stateId: state.id } }
  }

  if (findChoice(session.scenario, choiceId) === undefined) {
    return { ok: false, error: { kind: 'unknown-choice', choiceId } }
  }

  if (!state.availableChoices.includes(choiceId)) {
    return {
      ok: false,
      error: { kind: 'choice-not-available', choiceId, stateId: state.id },
    }
  }

  const transition = session.scenario.transitions.find(
    (t) => t.fromStateId === state.id && t.choiceId === choiceId,
  )
  if (transition === undefined) {
    return {
      ok: false,
      error: { kind: 'missing-transition', stateId: state.id, choiceId },
    }
  }

  const nextState = findState(session.scenario, transition.toStateId)
  if (nextState === undefined) {
    return {
      ok: false,
      error: { kind: 'unknown-state', stateId: transition.toStateId },
    }
  }

  const visitedHashes = [...session.visitedHashes, canonicalHash(nextState)]
  const breach = guardrailBreach(visitedHashes, session.choiceSequence.length + 1)
  if (breach !== null && nextState.terminal === undefined) {
    return { ok: false, error: { kind: 'guardrail', reason: breach } }
  }

  return {
    ok: true,
    value: {
      session: {
        ...session,
        currentStateId: nextState.id,
        choiceSequence: [...session.choiceSequence, choiceId],
        transitionSequence: [...session.transitionSequence, transition.id],
        visitedHashes,
        score: session.score + transition.scoreDelta,
      },
      transition,
    },
  }
}

/**
 * Reproduz uma sequência de escolhas do início.
 *
 * Mesma sequência produz sempre o mesmo resultado — é o que torna o replay
 * exato e permite reproduzir um bug a partir de `scenario + choiceSequence`.
 */
export function replay(
  scenario: TacticalScenario,
  choiceSequence: readonly string[],
): Result<PlaySession> {
  const start = startSession(scenario)
  if (!start.ok) return start

  let session = start.value
  for (const choiceId of choiceSequence) {
    const step = choose(session, choiceId)
    if (!step.ok) return step
    session = step.value.session
  }
  return { ok: true, value: session }
}

function findState(
  scenario: TacticalScenario,
  id: string,
): TacticalState | undefined {
  return scenario.states.find((s) => s.id === id)
}

function findChoice(
  scenario: TacticalScenario,
  id: string,
): TacticalChoice | undefined {
  return scenario.choices.find((c) => c.id === id)
}
