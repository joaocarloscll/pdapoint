'use client'

/**
 * Tactical Player — o loop da seção 03 de PRODUCT.md, implementado.
 *
 * Fases: situação → observação → decisão → animação → consequência → por quê.
 *
 * Toda a lógica de domínio vem do engine. Este componente decide apenas o que
 * desenhar e quando — nenhuma regra tática vive aqui.
 */

import { useCallback, useMemo, useState } from 'react'

import { golden001 } from '../../content/scenarios/golden-001'
import type {
  ChoiceClassification,
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
import { Ball, PlayerMarker, Trajectory } from '../../tactical-renderer/marks'
import { defaultTheme, themes } from '../../tactical-renderer/theme'

/** Fases visíveis do loop. A observação precede as opções, por desenho. */
type Phase = 'observation' | 'decision' | 'consequence'

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
  const [played, setPlayed] = useState<{
    choiceId: string
    transition: TacticalTransition
  } | null>(null)

  const state = currentState(session)
  const choices = availableChoices(session)

  const confirm = useCallback(() => {
    if (selected === null) return
    const result = choose(session, selected)
    if (!result.ok) return
    setPlayed({ choiceId: selected, transition: result.value.transition })
    setSession(result.value.session)
    setPhase('consequence')
  }, [selected, session])

  const reset = useCallback(() => {
    setSession(initial)
    setPhase('observation')
    setSelected(null)
    setPlayed(null)
  }, [initial])

  if (state === undefined) return null

  const playedChoice =
    played === null
      ? null
      : (golden001.choices.find((c) => c.id === played.choiceId) ?? null)

  // Na consequência, mostramos o estado resultante; antes, o estado corrente.
  const ballMove = played?.transition.timeline.find(
    (e): e is Extract<typeof e, { kind: 'move-ball' }> => e.kind === 'move-ball',
  )

  return (
    <main style={styles.shell}>
      <header style={styles.header}>
        <span style={styles.counter}>
          {phase === 'consequence' ? 'resultado' : '1/1'}
        </span>
        <span style={styles.draftBadge} title="Fonte ainda não verificada">
          rascunho
        </span>
      </header>

      <section style={styles.courtWrap}>
        <CourtSvg theme={theme} title={golden001.title}>
          {ballMove !== undefined && (
            <Trajectory
              from={ballMove.from}
              to={ballMove.to}
              arc={ballMove.arc}
              color={theme.trajectory}
            />
          )}
          <PlayerMarker
            at={state.players.b.position}
            color={theme.playerB}
            label="B"
            recovering={state.players.b.recovering ?? false}
          />
          <PlayerMarker
            at={state.players.a.position}
            color={theme.playerA}
            label="A"
          />
          <Ball at={state.ball} color={theme.ball} />
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

      {phase === 'consequence' && playedChoice !== null && (
        <section style={styles.panel}>
          <span
            style={{
              ...styles.classification,
              color: CLASSIFICATION_COLOR[playedChoice.classification],
            }}
          >
            {CLASSIFICATION_LABEL[playedChoice.classification]}
          </span>
          <p style={styles.explanation}>{playedChoice.explanation}</p>

          <p style={styles.sourceNote}>
            ⓘ Fonte pendente de verificação — este cenário é um rascunho e não
            está publicado.
          </p>

          <button type="button" style={styles.primaryButton} onClick={reset}>
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
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 16px calc(16px + env(safe-area-inset-bottom))',
    gap: 12,
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
  courtWrap: { borderRadius: 12, overflow: 'hidden' },
  panel: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto' },
  context: { margin: 0, fontSize: 15, lineHeight: 1.5 },
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
} as const satisfies Record<string, React.CSSProperties>
