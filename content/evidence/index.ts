/**
 * Registro de âncoras medidas.
 *
 * Vive em `content/` e não no engine porque é dado, não lógica: o engine
 * valida que uma âncora citada existe, mas não sabe quais existem. Assim
 * acrescentar um estudo não mexe no engine, e a regra de dependência
 * (UI → features → tactical-engine → tipos) continua de pé.
 */

import type { ProbabilityAnchor } from '../../tactical-engine/domain/types'
import { SERVER_WIN_ANCHORS } from './prieto-lage-2023'

export const ALL_ANCHORS: readonly ProbabilityAnchor[] = [...SERVER_WIN_ANCHORS]

export const ANCHOR_IDS: ReadonlySet<string> = new Set(
  ALL_ANCHORS.map((a) => a.id),
)

export function findAnchor(id: string): ProbabilityAnchor | undefined {
  return ALL_ANCHORS.find((a) => a.id === id)
}

export { SERVER_WIN_ANCHORS, RALLY_LENGTH_SHARE, SHORT_BALL_FINISH_NOTE } from './prieto-lage-2023'
export type { RallyLengthShare } from './prieto-lage-2023'
