'use client'

/**
 * Tactical Player — o loop da seção 03 de PRODUCT.md, implementado.
 *
 * situação → observação → decisão → animação → consequência → por quê
 *   → ver o padrão profissional → comparação visual
 *
 * Toda a lógica de domínio vem do engine. Este componente decide apenas o que
 * desenhar e quando — nenhuma regra tática vive aqui.
 */

import { useCallback, useMemo, useState } from 'react'

import { golden001 } from '../../content/scenarios/golden-001'
import type {
  ChoiceQuality,
  TacticalChoice,
  TacticalScenario,
  TacticalState,
  TacticalTransition,
  TerminalOutcome,
} from '../../tactical-engine/domain/types'
import {
  availableChoices,
  choose,
  currentState,
  startSession,
  type PlaySession,
} from '../../tactical-engine/graph/traverse'
import {
  accuracyOf,
  rankChoices,
  type ChoiceEvaluation,
} from '../../tactical-engine/scoring/evaluate'
import { CourtSvg } from '../../tactical-renderer/CourtSvg'
import { zoneCenter } from '../../tactical-renderer/geometry'
import {
  Ball,
  BounceMark,
  PlayerMarker,
  Trajectory,
  ZoneHighlight,
} from '../../tactical-renderer/marks'
import { defaultTheme, themes } from '../../tactical-renderer/theme'
import { useTimelinePlayback } from '../../tactical-renderer/useTimelinePlayback'
import css from './TacticalPlayer.module.css'

/**
 * Fases visíveis do loop.
 *
 * `playing` existe separada de `consequence` porque a animação precisa
 * terminar antes de qualquer texto aparecer: a imagem é o argumento, o texto
 * só confirma.
 */
type Phase = 'observation' | 'decision' | 'playing' | 'consequence' | 'comparing'

const QUALITY_LABEL: Record<ChoiceQuality, string> = {
  melhor: 'Melhor escolha',
  excelente: 'Excelente',
  boa: 'Boa',
  imprecisao: 'Imprecisão',
  erro: 'Erro',
  'erro-grave': 'Erro grave',
}

const QUALITY_COLOR: Record<ChoiceQuality, string> = {
  melhor: 'var(--success)',
  excelente: 'var(--success)',
  boa: 'var(--text-primary)',
  imprecisao: 'var(--accent)',
  erro: 'var(--danger)',
  'erro-grave': 'var(--danger)',
}

const pct = (v: number): string => `${Math.round(v * 100)}%`

/**
 * Como o desfecho é anunciado ao usuário.
 *
 * O usuário é o jogador A. O ponto precisa ser declarado: sentir a
 * consequência é metade, saber que o ponto acabou é a outra (PRODUCT.md § 00.4).
 */
const OUTCOME_LABEL: Record<TerminalOutcome, string> = {
  winner_a: 'Ponto seu',
  forced_error_b: 'Ponto seu',
  unforced_error_b: 'Ponto seu',
  ace: 'Ponto seu — ace',
  winner_b: 'Ponto do adversário',
  forced_error_a: 'Ponto do adversário',
  unforced_error_a: 'Ponto do adversário',
  double_fault: 'Ponto do adversário — dupla falta',
  neutralized_end: 'Rally neutralizado',
}

const wonByPlayer = (outcome: TerminalOutcome): boolean =>
  outcome === 'winner_a' ||
  outcome === 'forced_error_b' ||
  outcome === 'unforced_error_b' ||
  outcome === 'ace'

/** Primeiro evento de bola de uma transição — define a trajetória do golpe. */
const ballMoveOf = (transition: TacticalTransition) =>
  transition.timeline.find(
    (e): e is Extract<typeof e, { kind: 'move-ball' }> => e.kind === 'move-ball',
  )

const transitionFor = (
  scenario: TacticalScenario,
  stateId: string,
  choiceId: string,
) =>
  scenario.transitions.find(
    (t) => t.fromStateId === stateId && t.choiceId === choiceId,
  )

type Played = {
  readonly choice: TacticalChoice
  readonly transition: TacticalTransition
  readonly fromState: TacticalState
  readonly evaluation: ChoiceEvaluation
}

export function TacticalPlayer() {
  const theme = themes[defaultTheme]

  const initial = useMemo(() => {
    const result = startSession(golden001)
    if (!result.ok) throw new Error('Cenário inicial inválido')
    return result.value
  }, [])

  const [session, setSession] = useState<PlaySession>(initial)
  const [phase, setPhase] = useState<Phase>('observation')
  const [selected, setSelected] = useState<string | null>(null)
  const [played, setPlayed] = useState<Played | null>(null)

  const state = currentState(session)
  const choices = availableChoices(session)

  /**
   * O padrão profissional desta decisão, se a evidência sustentar um.
   * Quando não há (todas situacionais), a plataforma não inventa um —
   * PRODUCT.md § 00.1.
   */
  /** A opção de maior probabilidade no estado em que a decisão foi tomada. */
  const pattern = useMemo(() => {
    if (played === null) return null
    const disponiveis = golden001.choices.filter((c) =>
      played.fromState.availableChoices.includes(c.id),
    )
    return (
      disponiveis.reduce<TacticalChoice | null>(
        (melhor, c) =>
          melhor === null || c.winProbability.value > melhor.winProbability.value
            ? c
            : melhor,
        null,
      ) ?? null
    )
  }, [played])

  /** Ranking completo das opções, para a comparação. */
  const ranking = useMemo(
    () =>
      played === null
        ? []
        : rankChoices(
            golden001.choices.filter((c) =>
              played.fromState.availableChoices.includes(c.id),
            ),
          ),
    [played],
  )

  const patternTransition = useMemo(() => {
    if (played === null || pattern === null) return null
    return transitionFor(golden001, played.fromState.id, pattern.id) ?? null
  }, [played, pattern])

  // A animação em curso: a escolha do usuário, ou o padrão na comparação.
  const active =
    phase === 'comparing' && patternTransition !== null
      ? patternTransition
      : (played?.transition ?? null)

  const base = useMemo(() => {
    const from = played?.fromState ?? state
    if (from === undefined) {
      return { ball: { x: 0.5, y: 0.5 }, playerA: { x: 0.5, y: 0.8 }, playerB: { x: 0.5, y: 0.2 } }
    }
    return {
      ball: from.ball,
      playerA: from.players.a.position,
      playerB: from.players.b.position,
    }
  }, [played, state])

  const playback = useTimelinePlayback(
    active?.timeline ?? [],
    base,
    phase === 'playing' || phase === 'comparing',
  )

  const confirm = useCallback(() => {
    if (selected === null || state === undefined) return

    const choice = choices.find((c) => c.id === selected)
    const result = choose(session, selected)
    if (!result.ok || choice === undefined) return

    setPlayed({
      choice,
      transition: result.value.transition,
      fromState: state,
      evaluation: result.value.evaluation,
    })
    setSession(result.value.session)
    setPhase('playing')
  }, [selected, session, state, choices])

  const reset = useCallback(() => {
    setSession(initial)
    setPhase('observation')
    setSelected(null)
    setPlayed(null)
  }, [initial])

  if (state === undefined) return null

  const animating = phase === 'playing' || phase === 'comparing'
  const showGhost = phase === 'comparing'
  const ghostMove = showGhost && played ? ballMoveOf(played.transition) : undefined

  // Fora da animação, a quadra mostra o estado corrente do engine.
  const ball = animating ? playback.frame.ball : state.ball
  const posA = animating ? playback.frame.playerA : state.players.a.position
  const posB = animating ? playback.frame.playerB : state.players.b.position
  const zone = animating ? playback.frame.activeZone : null

  // A primeira reprodução é obrigatória e integral: só depois dela o texto
  // aparece e o replay fica disponível (PRODUCT.md § 03, Fase 4).
  const canAdvance = playback.isComplete

  const patternLabel =
    pattern === null
      ? 'Comparar alternativas'
      : played?.choice.id === pattern.id
        ? 'Ver as outras opções'
        : 'Ver a melhor escolha'

  return (
    <main className={css.shell}>
      <header className={css.header}>
        <span className={css.counter}>
          {phase === 'observation' || phase === 'decision' ? '1/1' : 'resultado'}
        </span>
        <span className={css.draftBadge} title="Fonte ainda não verificada">
          rascunho
        </span>
      </header>

      <section className={css.court}>
        <CourtSvg theme={theme} title={golden001.title}>
          {zone !== null && (
            <ZoneHighlight
              at={zoneCenter(zone.zone)}
              color={
                zone.tone === 'opportunity'
                  ? theme.opportunityZone
                  : theme.riskZone
              }
              opacity={zone.opacity}
            />
          )}

          {ghostMove !== undefined && (
            <Trajectory
              from={ghostMove.from}
              to={ghostMove.to}
              arc={ghostMove.arc}
              color={theme.ghostTrajectory}
              ghost
            />
          )}

          {/*
            Cada golpe da transição com o próprio progresso: o seu golpe fica
            desenhado enquanto a resposta do adversário ainda está no ar.
          */}
          {animating &&
            playback.frame.shots.map((shot, i) =>
              shot.progress > 0 ? (
                <Trajectory
                  key={i}
                  from={shot.from}
                  to={shot.to}
                  arc={shot.arc}
                  color={theme.trajectory}
                  progress={shot.progress}
                />
              ) : null,
            )}

          {animating && playback.frame.bounce !== null && (
            <BounceMark
              at={playback.frame.bounce.at}
              color={theme.ball}
              progress={playback.frame.bounce.progress}
            />
          )}

          <PlayerMarker
            at={posB}
            color={theme.playerB}
            label="B"
            recovering={state.players.b.recovering ?? false}
          />
          <PlayerMarker at={posA} color={theme.playerA} label="A" />
          <Ball at={ball} color={theme.ball} />
        </CourtSvg>
      </section>

      {phase === 'observation' && (
        <section className={css.panel}>
          <p className={css.context}>{golden001.context}</p>
          <button
            type="button"
            className={css.primaryButton}
            onClick={() => setPhase('decision')}
          >
            O que você faria?
          </button>
        </section>
      )}

      {phase === 'decision' && (
        <section className={css.panel}>
          <ul className={css.choiceList}>
            {choices.map((choice) => {
              const isSelected = selected === choice.id
              return (
                <li key={choice.id}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelected(choice.id)}
                    className={css.choiceButton}
                    data-selected={isSelected}
                  >
                    {choice.label}
                  </button>
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            className={css.primaryButton}
            disabled={selected === null}
            onClick={confirm}
          >
            Confirmar
          </button>
        </section>
      )}

      {phase === 'playing' && played !== null && (
        <section className={css.panel}>
          <p className={css.playingNote}>{played.choice.label}</p>
          <button
            type="button"
            className={css.primaryButton}
            disabled={!canAdvance}
            onClick={() => setPhase('consequence')}
          >
            {canAdvance ? 'O que aconteceu' : 'reproduzindo…'}
          </button>
        </section>
      )}

      {phase === 'consequence' && played !== null && (
        <section className={css.panel}>
          {state.terminal !== undefined && (
            <p
              className={css.outcome}
              style={
                {
                  '--tone': wonByPlayer(state.terminal)
                    ? 'var(--success)'
                    : 'var(--danger)',
                } as React.CSSProperties
              }
            >
              {OUTCOME_LABEL[state.terminal]}
            </p>
          )}
          {/* Avaliação da decisão, no estilo da análise de lances do xadrez. */}
          <div className={css.evalRow}>
            <span
              className={css.quality}
              style={
                {
                  '--tone': QUALITY_COLOR[played.evaluation.quality],
                } as React.CSSProperties
              }
            >
              {QUALITY_LABEL[played.evaluation.quality]}
            </span>
            <span className={css.evalNumbers}>
              {pct(played.evaluation.probability)}
              {played.evaluation.loss > 0 && (
                <>
                  {' · melhor '}
                  {pct(played.evaluation.bestProbability)}
                  <span className={css.evalLoss}>
                    {` −${Math.round(played.evaluation.loss * 100)}`}
                  </span>
                </>
              )}
            </span>
          </div>

          {/* Barra de probabilidade: a sua contra a melhor disponível. */}
          <div
            className={css.probBar}
            role="img"
            aria-label={`Sua escolha vence ${pct(played.evaluation.probability)} das vezes; a melhor opção, ${pct(played.evaluation.bestProbability)}`}
          >
            <span
              className={css.probBest}
              style={{ width: pct(played.evaluation.bestProbability) }}
            />
            <span
              className={css.probMine}
              style={{
                width: pct(played.evaluation.probability),
                background: QUALITY_COLOR[played.evaluation.quality],
              }}
            />
          </div>
          <p className={css.explanation}>{played.choice.explanation}</p>

          <p className={css.sourceNote}>
            ⓘ Fonte pendente de verificação — este cenário é um rascunho e não
            está publicado.
          </p>

          <button
            type="button"
            className={css.primaryButton}
            onClick={() => setPhase('comparing')}
          >
            {patternLabel}
          </button>
          <button type="button" className={css.ghostButton} onClick={reset}>
            Jogar novamente
          </button>
        </section>
      )}

      {phase === 'comparing' && played !== null && (
        <section className={css.panel}>
          <div className={css.legend}>
            <span className={css.legendItem}>
              <span
                className={css.legendSwatch}
                style={{ background: theme.ghostTrajectory }}
              />
              sua escolha
            </span>
            <span className={css.legendItem}>
              <span
                className={css.legendSwatch}
                style={{ background: theme.trajectory }}
              />
              {pattern?.label ?? 'melhor opção'}
            </span>
          </div>

          {/* Todas as opções ranqueadas pela chance de vencer o ponto. */}
          <ol className={css.ranking}>
            {ranking.map((ev) => {
              const opcao = golden001.choices.find((c) => c.id === ev.choiceId)
              if (opcao === undefined) return null
              return (
                <li
                  key={ev.choiceId}
                  className={css.rankingItem}
                  data-mine={ev.choiceId === played.choice.id}
                >
                  <span className={css.rankingLabel}>{opcao.label}</span>
                  <span
                    className={css.rankingPct}
                    style={
                      { '--tone': QUALITY_COLOR[ev.quality] } as React.CSSProperties
                    }
                  >
                    {pct(ev.probability)}
                  </span>
                </li>
              )
            })}
          </ol>

          <p className={css.explanation}>
            {pattern?.explanation ?? ''}
          </p>

          <p className={css.sourceNote}>
            ⓘ Precisão desta decisão:{' '}
            {Math.round(accuracyOf([played.evaluation]))}%. As probabilidades são
            estimativas editoriais — este cenário é um rascunho e não está
            publicado.
          </p>

          <button
            type="button"
            className={css.primaryButton}
            disabled={!canAdvance}
            onClick={playback.restart}
          >
            {canAdvance ? 'Rever a comparação' : 'reproduzindo…'}
          </button>
          <button type="button" className={css.ghostButton} onClick={reset}>
            Jogar novamente
          </button>
        </section>
      )}
    </main>
  )
}
