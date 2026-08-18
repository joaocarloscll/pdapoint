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

/**
 * Zonas nomeadas, usadas para intenção de alvo e para o hash anti-loop.
 *
 * O prefixo diz **de que lado da rede**: `opp` é a metade do adversário
 * (y < 0.5), `own` é a nossa (y > 0.5). Sem isso, um alvo no fundo do
 * adversário e um no nosso caem na mesma zona — o destaque visual aparece do
 * lado errado, e o hash anti-loop confunde estados opostos.
 *
 * Lateral é da perspectiva de quem olha o desenho (esquerda/centro/direita),
 * não `deuce`/`ad`: esses invertem conforme o lado da quadra e conforme a
 * mão do jogador, e a ambiguidade já custou um bug.
 */
export type CourtZone =
  // Metade do adversário
  | 'opp-left-deep'
  | 'opp-center-deep'
  | 'opp-right-deep'
  | 'opp-left-short'
  | 'opp-center-short'
  | 'opp-right-short'
  // Nossa metade
  | 'own-left-short'
  | 'own-center-short'
  | 'own-right-short'
  | 'own-left-deep'
  | 'own-center-deep'
  | 'own-right-deep'

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
 * De onde vem um número de probabilidade.
 *
 * No xadrez o motor é verdade de campo; no tênis não existe equivalente. Um
 * número sem procedência declarada é pior que um rótulo vago, porque aparenta
 * uma precisão que não tem. Por isso a procedência é parte do dado, e o
 * validador recusa publicar estimativa (PRODUCT.md § 00.5).
 */
export type ProbabilityBasis =
  /** Medido em partidas reais e publicado. */
  | 'measured'
  /** Calculado a partir de dado publicado, com o cálculo declarado. */
  | 'derived'
  /** Estimativa editorial. Aceitável em rascunho, nunca em conteúdo publicado. */
  | 'estimated'

export type WinProbability = {
  /** Probabilidade de vencer o ponto após esta escolha, de 0 a 1. */
  readonly value: number
  readonly basis: ProbabilityBasis
  /** O que sustenta o número — a fonte, o cálculo, ou a premissa. */
  readonly note: string
}

/**
 * Qualidade de uma escolha, no espírito da avaliação de lances do xadrez.
 *
 * NÃO é escrita à mão: deriva da distância entre a probabilidade da escolha e
 * a da melhor opção disponível. Assim o rótulo nunca contradiz o número, e
 * corrigir um número reclassifica a escolha sozinho.
 */
export type ChoiceQuality =
  | 'melhor'
  | 'excelente'
  | 'boa'
  | 'imprecisao'
  | 'erro'
  | 'erro-grave'

export type TacticalChoice = {
  readonly id: string
  readonly stateId: string
  /** Texto curto de intenção, exibido ao usuário. */
  readonly label: string
  readonly shotIntent: ShotIntent
  readonly targetZone?: CourtZone
  /**
   * Chance de vencer o ponto ao escolher esta opção.
   *
   * Toda escolha tem uma: não existe empate real entre duas opções, existe
   * diferença que ainda não foi medida (PRODUCT.md § 00.5).
   */
  readonly winProbability: WinProbability
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

/**
 * Quique da bola no ponto em que ela cai.
 *
 * Marca visualmente onde a bola tocou a quadra. Sem o quique, a bola apenas
 * para no alvo e o ponto não se lê como encerrado.
 */
export type BounceEvent = TimelineEventBase & {
  readonly kind: 'bounce'
  readonly at: CourtPoint
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
  | BounceEvent
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
