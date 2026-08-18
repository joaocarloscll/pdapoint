'use client'

/**
 * Relógio da animação.
 *
 * Dirige `sampleTimeline` por requestAnimationFrame. Toda a interpolação vive
 * na função pura; aqui só existe o tempo.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

import type { TimelineEvent } from '../tactical-engine/domain/types'
import {
  quantizeForReducedMotion,
  sampleTimeline,
  timelineDuration,
  type FrameBase,
  type TimelineFrame,
} from './timeline'

/** Compressão de duração quando o usuário pede movimento reduzido. */
const REDUCED_MOTION_SCALE = 0.45

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export type Playback = {
  readonly frame: TimelineFrame
  readonly isPlaying: boolean
  readonly isComplete: boolean
  readonly restart: () => void
}

export function useTimelinePlayback(
  timeline: readonly TimelineEvent[],
  base: FrameBase,
  active: boolean,
): Playback {
  const [elapsed, setElapsed] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [runId, setRunId] = useState(0)

  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  const total = timelineDuration(timeline)

  useEffect(() => {
    if (!active || total === 0) {
      setElapsed(total)
      setIsPlaying(false)
      return
    }

    const reduced = prefersReducedMotion()
    const duration = reduced ? total * REDUCED_MOTION_SCALE : total

    setElapsed(0)
    setIsPlaying(true)
    startRef.current = null

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const raw = Math.min(duration, now - startRef.current)

      // Reescala para o tempo nominal da timeline antes de amostrar, para que
      // os eventos continuem alinhados quando a duração foi comprimida.
      const nominal = duration === 0 ? total : (raw / duration) * total

      setElapsed(
        reduced ? quantizeForReducedMotion(nominal, total) : nominal,
      )

      if (raw < duration) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setIsPlaying(false)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [active, total, runId])

  const restart = useCallback(() => setRunId((n) => n + 1), [])

  return {
    frame: sampleTimeline(timeline, base, elapsed),
    isPlaying,
    isComplete: !isPlaying && elapsed >= total,
    restart,
  }
}
