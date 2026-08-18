/**
 * Tipos de domínio do Tactical State Engine.
 *
 * Regra de dependência (docs de arquitetura, seção 5): este módulo e todo o
 * tactical-engine NÃO podem importar React, Next, Tailwind, Supabase ou DOM.
 * O engine é lógica pura, testável isoladamente.
 */

// ---------------------------------------------------------------------------
// Coordenadas
// ---------------------------------------------------------------------------

/**
 * Ponto na quadra em coordenadas normalizadas.
 *
 * Nunca pixels. O renderer converte para a quadra concreta, o que mantém
 * replay consistente entre resoluções, proporções e temas.
 *
 * x: 0.0 (borda esquerda) → 1.0 (borda direita)
 * y: 0.0 (fundo adversário) → 1.0 (nosso fundo)
 */
export type CourtPoint = {
  readonly x: number
  readonly y: number
}

/** Zonas nomeadas, usadas para intenção de alvo e para o hash anti-loop. */
export type CourtZone =
  | 'deuce-deep'
  | 'deuce-short'
  | 'center-deep'
  | 'center-short'
  | 'ad-deep'
  | 'ad-short'
  | 'net-deuce'
  | 'net-center'
  | 'net-ad'

// ---------------------------------------------------------------------------
// Estado
// ---------------------------------------------------------------------------

export type PlayerId = 'a' | 'b'

export type RallyPhase =
  | 'serve'
  | 'return'
  | 'neutral'
  | 'construction'
  | 'attack'
  | 'defense'
  | 'transition'
  | 'net'

export type AdvantageState = 'neutral' | 'a' | 'b'

export type PlayerState = {
  readonly position: CourtPoint
  /** Jogador está em recuperação de posição, não em base. */
  readonly recovering?: boolean
}

/**
 * Desfechos terminais possíveis de um ponto.
 * Lista fechada (docs de arquitetura, seção 18).
 */
export type TerminalOutcome =
  | 'winner_a'
  | 'winner_b'
  | 'forced_error_a'
  | 'forced_error_b'
  | 'unforced_error_a'
  | 'unforced_error_b'
  | 'ace'
  | 'double_fault'
  | 'neutralized_end'

export type TacticalState = {
  readonly id: string
  readonly ball: CourtPoint
  readonly players: {
    readonly a: PlayerState
    readonly b: PlayerState
  }
  readonly phase: RallyPhase
  readonly advantage: AdvantageState
  /** Quem bate a próxima bola a partir deste estado. */
  readonly hitter: PlayerId
  readonly availableChoices: readonly string[]
  /** Presente apenas em estados terminais. */
  readonly terminal?: TerminalOutcome
}

// ---------------------------------------------------------------------------
// Escolhas
// ---------------------------------------------------------------------------

export type ShotIntent =
  | 'attack'
  | 'construct'
  | 'neutralize'
  | 'defend'
  | 'finish'
  | 'reset'
  | 'serve'

/**
 * Classificação de uma escolha.
 *
 * Vocabulário descritivo, não prescritivo (PRODUCT.md § 00.2b): descreve o que
 * o profissional faz, não o que o usuário deve fazer.
 */
export type ChoiceClassification =
  /** Predomina no jogo profissional. */
  | 'padrao'
  /** Também usado; depende do contexto. */
  | 'alternativa'
  /** A evidência não distingue as opções. */
  | 'situacional'
  /** Raro no profissional, ou com resultado documentado pior. */
  | 'incomum'

export type TacticalChoice = {
  readonly id: string
  readonly stateId: string
  /** Texto curto de intenção, exibido ao usuário. */
  readonly label: string
  readonly shotIntent: ShotIntent
  readonly targetZone?: CourtZone
  readonly classification: ChoiceClassification
  /** O mecanismo, 1–2 frases. Mostrado na Fase 6 do loop. */
  readonly explanation: string
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

export type Easing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'

type TimelineEventBase = {
  /** Milissegundos desde o início da transição. */
  readonly startMs: number
  readonly durationMs: number
}

export type MoveBallEvent = TimelineEventBase & {
  readonly kind: 'move-ball'
  readonly from: CourtPoint
  readonly to: CourtPoint
  /** Altura do arco, 0 = rasteiro. Usado pelo renderer para curvar a trajetória. */
  readonly arc: number
  readonly easing: Easing
}

export type MovePlayerEvent = TimelineEventBase & {
  readonly kind: 'move-player'
  readonly player: PlayerId
  readonly from: CourtPoint
  readonly to: CourtPoint
  readonly easing: Easing
}

export type HighlightZoneEvent = TimelineEventBase & {
  readonly kind: 'highlight-zone'
  readonly zone: CourtZone
  readonly tone: 'opportunity' | 'risk'
}

export type ShowArrowEvent = TimelineEventBase & {
  readonly kind: 'show-arrow'
  readonly from: CourtPoint
  readonly to: CourtPoint
}

export type PauseEvent = TimelineEventBase & {
  readonly kind: 'pause'
}

export type AnnotationEvent = TimelineEventBase & {
  readonly kind: 'annotation'
  readonly text: string
  readonly at: CourtPoint
}

export type TimelineEvent =
  | MoveBallEvent
  | MovePlayerEvent
  | HighlightZoneEvent
  | ShowArrowEvent
  | PauseEvent
  | AnnotationEvent

// ---------------------------------------------------------------------------
// Transições
// ---------------------------------------------------------------------------

export type TacticalTransition = {
  readonly id: string
  readonly fromStateId: string
  readonly choiceId: string
  readonly toStateId: string
  readonly timeline: readonly TimelineEvent[]
  readonly scoreDelta: number
}

// ---------------------------------------------------------------------------
// Governança de fonte
// ---------------------------------------------------------------------------

/**
 * Tier da fonte que sustenta a tática.
 *
 * Tier A está indisponível por licença (PRODUCT.md § 00.2c), portanto B é o
 * teto prático de evidência quantitativa. `PENDENTE` só é aceitável em
 * cenários com status `rascunho`.
 */
export type SourceTier = 'B' | 'C' | 'PENDENTE'

export type SourceRef = {
  readonly tier: SourceTier
  /** Autores, ano, periódico, DOI. */
  readonly referencia: string
  /**
   * Exatamente qual afirmação vem desta fonte.
   * Existe para impedir citação decorativa (PRODUCT.md § 06).
   */
  readonly oQueSustenta: string
  /** Nome de quem abriu a fonte primária. `null` enquanto não verificada. */
  readonly verificadaPor: string | null
  /** Data ISO da verificação. `null` enquanto não verificada. */
  readonly verificadaEm: string | null
}

export type ScenarioStatus =
  | 'rascunho'
  | 'revisada'
  | 'aprovada'
  | 'publicada'
  | 'descontinuada'

// ---------------------------------------------------------------------------
// Cenário
// ---------------------------------------------------------------------------

export type ScenarioCategory =
  | 'saque'
  | 'devolucao'
  | 'rally'
  | 'ataque'
  | 'defesa'
  | 'transicao'
  | 'rede'
  | 'duplas'

export type ScenarioLevel = 'fundamental' | 'intermediaria' | 'avancada'

export type TacticalScenario = {
  readonly id: string
  readonly version: number
  readonly title: string
  readonly context: string
  readonly category: ScenarioCategory
  readonly level: ScenarioLevel
  readonly kind: 'simples' | 'duplas'

  readonly initialStateId: string
  readonly states: readonly TacticalState[]
  readonly choices: readonly TacticalChoice[]
  readonly transitions: readonly TacticalTransition[]

  /** A lição transferível. */
  readonly tacticalPrinciple: string
  readonly whenToUse: string
  readonly whenNotToUse: string

  readonly source: SourceRef
  readonly reviewer: string | null
  readonly status: ScenarioStatus
}
