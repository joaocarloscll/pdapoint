/**
 * Temas de quadra.
 *
 * Superfície é tema puramente visual e nunca altera a classificação de uma
 * decisão (PRODUCT.md § 00.3). Trocar de tema muda apenas a paleta.
 *
 * Cores centralizadas aqui, nunca espalhadas pelos componentes — é o que
 * permite adicionar um tema sem tocar no renderer.
 */

export type CourtTheme = {
  readonly id: string
  readonly label: string
  readonly courtOuter: string
  readonly courtInner: string
  readonly lines: string
  readonly net: string
  readonly ball: string
  readonly playerA: string
  readonly playerB: string
  readonly trajectory: string
  readonly ghostTrajectory: string
  readonly opportunityZone: string
  readonly riskZone: string
}

export const themes = {
  classic: {
    id: 'classic',
    label: 'Classic',
    courtOuter: '#14532d',
    courtInner: '#166534',
    lines: '#f8fafc',
    net: '#e2e8f0',
    ball: '#eab308',
    playerA: '#38bdf8',
    playerB: '#f472b6',
    trajectory: '#fef08a',
    ghostTrajectory: '#64748b',
    opportunityZone: '#4ade80',
    riskZone: '#fb7185',
  },
  'paris-clay': {
    id: 'paris-clay',
    label: 'Paris Clay',
    courtOuter: '#7c2d12',
    courtInner: '#9a3412',
    lines: '#fef2f2',
    net: '#fed7aa',
    ball: '#facc15',
    playerA: '#38bdf8',
    playerB: '#818cf8',
    trajectory: '#fef9c3',
    ghostTrajectory: '#78716c',
    opportunityZone: '#4ade80',
    riskZone: '#fb7185',
  },
  'melbourne-hard': {
    id: 'melbourne-hard',
    label: 'Melbourne Hard',
    courtOuter: '#1e3a8a',
    courtInner: '#1d4ed8',
    lines: '#f8fafc',
    net: '#dbeafe',
    ball: '#facc15',
    playerA: '#4ade80',
    playerB: '#fb7185',
    trajectory: '#ffffff',
    ghostTrajectory: '#64748b',
    opportunityZone: '#86efac',
    riskZone: '#fda4af',
  },
} as const satisfies Record<string, CourtTheme>

export type ThemeId = keyof typeof themes

export const defaultTheme: ThemeId = 'classic'
