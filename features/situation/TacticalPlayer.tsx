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
  ChoiceClassification,
  TacticalChoice,
  TacticalScenario,
  TacticalState,
  TacticalTransition,
} from '../../tactical-engine/domain/types'
import {
  availableChoices,
  choose,
  currentState,
  startSession,
  type PlaySession,
} from '../../tactical-engine/graph/traverse'
import { CourtSvg } from '../../tactical-renderer/CourtSvg'
import { zoneCenter } from '../../tactical-renderer/geometry'
import {
  Ball,
  PlayerMarker,
  Trajectory,
  ZoneHighlight,
} from '../../tactical-renderer/marks'
import { defaultTheme, themes } from '../../tactical-renderer/theme'
import { useTimelinePlayback } from '../../tactical-renderer/useTimelinePlayback'

/**
 * Fases visíveis do loop.
 *
 * `playing` existe separada de `consequence` porque a animação precisa
 * terminar antes de qualquer texto aparecer: a imagem é o argumento, o texto
 * só confirma.
 */
type Phase = 'observation' | 'decision' | 'playing' | 'consequence' | 'comparing'

const CLASSIFICATION_LABEL: Record<ChoiceClassification, string> = {
  padrao: 'padrão profissional',
  alternativa: 'alternativa',
  situacional: 'situacional',
  incomum: 'incomum no profissional',
}

const CLASSIFICATION_COLOR: Record<ChoiceClassification, string> = {
  padrao: 'var(--success)',
  alternativa: 'var(--text-secondary)',
  situacional: 'var(--text-secondary)',
  incomum: 'var(--danger)',
}

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
  const pattern = useMemo(() => {
    if (played === null) return null
    return (
      golden001.choices.find(
        (c) =>
          c.stateId === played.fromState.id && c.classification === 'padrao',
      ) ?? null
    )
  }, [played])

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
  const activeMove = active ? ballMoveOf(active) : undefined

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
        : 'Ver o padrão profissional'

  return (
    <main style={styles.shell}>
      <header style={styles.header}>
        <span style={styles.counter}>
          {phase === 'observation' || phase === 'decision' ? '1/1' : 'resultado'}
        </span>
        <span style={styles.draftBadge} title="Fonte ainda não verificada">
          rascunho
        </span>
      </header>

      <section style={styles.courtWrap}>
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

          {animating && activeMove !== undefined && (
            <Trajectory
              from={activeMove.from}
              to={activeMove.to}
              arc={activeMove.arc}
              color={theme.trajectory}
              progress={playback.frame.ballProgress}
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
        <section style={styles.panel}>
          <p style={styles.context}>{golden001.context}</p>
          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => setPhase('decision')}
          >
            O que você faria?
          </button>
        </section>
      )}

      {phase === 'decision' && (
        <section style={styles.panel}>
          <ul style={styles.choiceList}>
            {choices.map((choice) => {
              const isSelected = selected === choice.id
              return (
                <li key={choice.id}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelected(choice.id)}
                    style={{
                      ...styles.choiceButton,
                      borderColor: isSelected
                        ? 'var(--accent)'
                        : 'rgba(148,163,184,0.25)',
                      background: isSelected
                        ? 'var(--surface-elevated)'
                        : 'var(--surface)',
                    }}
                  >
                    {choice.label}
                  </button>
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            style={{
              ...styles.primaryButton,
              opacity: selected === null ? 0.4 : 1,
            }}
            disabled={selected === null}
            onClick={confirm}
          >
            Confirmar
          </button>
        </section>
      )}

      {phase === 'playing' && played !== null && (
        <section style={styles.panel}>
          <p style={styles.playingNote}>{played.choice.label}</p>
          <button
            type="button"
            style={{ ...styles.primaryButton, opacity: canAdvance ? 1 : 0.4 }}
            disabled={!canAdvance}
            onClick={() => setPhase('consequence')}
          >
            {canAdvance ? 'O que aconteceu' : 'reproduzindo…'}
          </button>
        </section>
      )}

      {phase === 'consequence' && played !== null && (
        <section style={styles.panel}>
          <span
            style={{
              ...styles.classification,
              color: CLASSIFICATION_COLOR[played.choice.classification],
            }}
          >
            {CLASSIFICATION_LABEL[played.choice.classification]}
          </span>
          <p style={styles.explanation}>{played.choice.explanation}</p>

          <p style={styles.sourceNote}>
            ⓘ Fonte pendente de verificação — este cenário é um rascunho e não
            está publicado.
          </p>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => setPhase('comparing')}
          >
            {patternLabel}
          </button>
          <button type="button" style={styles.ghostButton} onClick={reset}>
            Jogar novamente
          </button>
        </section>
      )}

      {phase === 'comparing' && played !== null && (
        <section style={styles.panel}>
          <div style={styles.legend}>
            <span style={styles.legendItem}>
              <span
                style={{
                  ...styles.legendSwatch,
                  background: theme.ghostTrajectory,
                }}
              />
              sua escolha
            </span>
            <span style={styles.legendItem}>
              <span
                style={{ ...styles.legendSwatch, background: theme.trajectory }}
              />
              {pattern?.label ?? 'alternativa'}
            </span>
          </div>

          <p style={styles.explanation}>
            {pattern?.explanation ??
              'A evidência não distingue as opções nesta situação.'}
          </p>

          <button
            type="button"
            style={{ ...styles.primaryButton, opacity: canAdvance ? 1 : 0.4 }}
            disabled={!canAdvance}
            onClick={playback.restart}
          >
            {canAdvance ? 'Rever a comparação' : 'reproduzindo…'}
          </button>
          <button type="button" style={styles.ghostButton} onClick={reset}>
            Jogar novamente
          </button>
        </section>
      )}
    </main>
  )
}

const styles = {
  shell: {
    maxWidth: 430,
    margin: '0 auto',
    // Altura fixa, não mínima: o conteúdo se ajusta à tela em vez de
    // empurrar os controles para fora dela. `dvh` acompanha as barras do
    // navegador móvel, que aparecem e somem durante a rolagem.
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 16px calc(12px + env(safe-area-inset-bottom))',
    gap: 10,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
    color: 'var(--text-secondary)',
  },
  counter: { letterSpacing: '0.04em' },
  draftBadge: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--accent)',
    border: '1px solid rgba(234,179,8,0.4)',
    borderRadius: 4,
    padding: '2px 6px',
  },
  // A quadra absorve o espaço que sobra. `minHeight: 0` é o que permite a
  // um filho de flex encolher abaixo do próprio conteúdo.
  courtWrap: { flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' },
  // O painel nunca encolhe: é onde ficam as decisões.
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flexShrink: 0,
  },
  context: { margin: 0, fontSize: 15, lineHeight: 1.5 },
  playingNote: {
    margin: 0,
    fontSize: 15,
    color: 'var(--text-secondary)',
  },
  choiceList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  choiceButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    color: 'var(--text-primary)',
    fontSize: 15,
    textAlign: 'left',
    padding: '0 14px',
    cursor: 'pointer',
  },
  primaryButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: 10,
    border: 'none',
    background: 'var(--accent)',
    color: '#0b1120',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  },
  ghostButton: {
    width: '100%',
    minHeight: 44,
    borderRadius: 10,
    border: '1px solid rgba(148,163,184,0.25)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: 14,
    cursor: 'pointer',
  },
  classification: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 700,
  },
  explanation: { margin: 0, fontSize: 15, lineHeight: 1.5 },
  sourceNote: {
    margin: 0,
    fontSize: 12,
    color: 'var(--text-secondary)',
    lineHeight: 1.45,
  },
  legend: { display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-secondary)' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6 },
  legendSwatch: {
    width: 14,
    height: 3,
    borderRadius: 2,
    display: 'inline-block',
  },
} as const satisfies Record<string, React.CSSProperties>
