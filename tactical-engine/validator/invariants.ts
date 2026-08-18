/**
 * Invariantes obrigatórios de um cenário tático.
 *
 * Os invariantes 1–10 vêm do documento de arquitetura, seção 17.
 * Os invariantes 11–13 materializam o padrão de evidência de PRODUCT.md § 00.1
 * — as regras editoriais viram código que falha no CI, em vez de boa intenção.
 * O invariante 14 faz o mesmo com a regra de fechamento de § 00.4, e os
 * invariantes 15–16 com a governança dos números de § 00.5. O invariante 17
 * fecha o ciclo: um número que se diz medido precisa apontar para a medição.
 */

import type {
  TerminalOutcome,
  ScenarioStatus,
  SourceTier,
  TacticalScenario,
} from '../domain/types'
import { MAX_TRANSITIONS } from '../graph/guardrails'

export type ValidationIssue = {
  readonly invariant: number
  readonly code: string
  readonly message: string
}

export type ValidationResult = {
  readonly valid: boolean
  readonly issues: readonly ValidationIssue[]
}

const issue = (
  invariant: number,
  code: string,
  message: string,
): ValidationIssue => ({ invariant, code, message })

/** Status a partir dos quais o cenário é visível ao usuário final. */
const PUBLIC_STATUSES: readonly ScenarioStatus[] = ['publicada']

/** Tiers que sustentam uma afirmação quantitativa. */
const QUANTITATIVE_TIERS: readonly SourceTier[] = ['B']

/**
 * Desfechos que resolvem o ponto.
 *
 * `neutralized_end` está deliberadamente fora: ele é produzido em tempo de
 * execução pelo guardrail anti-loop do Point Builder, nunca escrito à mão.
 * Um cenário de decisão que termina em "rally neutralizado" não entrega
 * consequência — e consequência é a lição (PRODUCT.md § 00.4).
 */
const DECISIVE_OUTCOMES: readonly TerminalOutcome[] = [
  'winner_a',
  'winner_b',
  'forced_error_a',
  'forced_error_b',
  'unforced_error_a',
  'unforced_error_b',
  'ace',
  'double_fault',
]

const inCourt = (n: number): boolean => n >= 0 && n <= 1

/**
 * Contexto externo ao cenário de que a validação precisa.
 *
 * As âncoras medidas são dado de conteúdo, não do engine (ver
 * `content/evidence/`). O validador recebe os ids conhecidos em vez de
 * importá-los, para não inverter a regra de dependência.
 */
export type ValidationContext = {
  readonly knownAnchorIds?: ReadonlySet<string>
}

export function validateScenario(
  scenario: TacticalScenario,
  context: ValidationContext = {},
): ValidationResult {
  const issues: ValidationIssue[] = []

  const stateIds = new Set(scenario.states.map((s) => s.id))
  const choiceIds = new Set(scenario.choices.map((c) => c.id))

  // 1 — initialStateId existe
  if (!stateIds.has(scenario.initialStateId)) {
    issues.push(
      issue(
        1,
        'missing-initial-state',
        `initialStateId "${scenario.initialStateId}" não existe entre os estados`,
      ),
    )
  }

  // 6 — não existem IDs duplicados
  if (stateIds.size !== scenario.states.length) {
    issues.push(issue(6, 'duplicate-state-id', 'Há IDs de estado duplicados'))
  }
  if (choiceIds.size !== scenario.choices.length) {
    issues.push(issue(6, 'duplicate-choice-id', 'Há IDs de escolha duplicados'))
  }
  const transitionIds = new Set(scenario.transitions.map((t) => t.id))
  if (transitionIds.size !== scenario.transitions.length) {
    issues.push(
      issue(6, 'duplicate-transition-id', 'Há IDs de transição duplicados'),
    )
  }

  for (const state of scenario.states) {
    // 2 — todo choiceId referenciado existe
    for (const cid of state.availableChoices) {
      if (!choiceIds.has(cid)) {
        issues.push(
          issue(
            2,
            'dangling-choice',
            `Estado "${state.id}" referencia escolha inexistente "${cid}"`,
          ),
        )
      }
    }

    // 4 — estados não terminais possuem saída
    if (state.terminal === undefined && state.availableChoices.length === 0) {
      issues.push(
        issue(
          4,
          'dead-end-state',
          `Estado não terminal "${state.id}" não oferece nenhuma escolha`,
        ),
      )
    }

    // 5 — estados terminais não exigem nova decisão
    if (state.terminal !== undefined && state.availableChoices.length > 0) {
      issues.push(
        issue(
          5,
          'terminal-with-choices',
          `Estado terminal "${state.id}" não pode oferecer escolhas`,
        ),
      )
    }

    // 7 — coordenadas dentro da quadra
    const points: ReadonlyArray<readonly [string, { x: number; y: number }]> = [
      ['bola', state.ball],
      ['jogador a', state.players.a.position],
      ['jogador b', state.players.b.position],
    ]
    for (const [label, p] of points) {
      if (!inCourt(p.x) || !inCourt(p.y)) {
        issues.push(
          issue(
            7,
            'coordinate-out-of-court',
            `Estado "${state.id}": ${label} fora da quadra (${p.x}, ${p.y})`,
          ),
        )
      }
    }
  }

  // 2 — toda escolha aponta para um estado existente
  for (const choice of scenario.choices) {
    if (!stateIds.has(choice.stateId)) {
      issues.push(
        issue(
          2,
          'choice-orphan-state',
          `Escolha "${choice.id}" referencia estado inexistente "${choice.stateId}"`,
        ),
      )
    }
  }

  for (const transition of scenario.transitions) {
    // 3 — toda transição aponta para estados existentes
    if (!stateIds.has(transition.fromStateId)) {
      issues.push(
        issue(
          3,
          'transition-bad-origin',
          `Transição "${transition.id}" parte de estado inexistente "${transition.fromStateId}"`,
        ),
      )
    }
    if (!stateIds.has(transition.toStateId)) {
      issues.push(
        issue(
          3,
          'transition-bad-target',
          `Transição "${transition.id}" aponta para estado inexistente "${transition.toStateId}"`,
        ),
      )
    }
    if (!choiceIds.has(transition.choiceId)) {
      issues.push(
        issue(
          3,
          'transition-bad-choice',
          `Transição "${transition.id}" referencia escolha inexistente "${transition.choiceId}"`,
        ),
      )
    }

    // 8 — não existe duração negativa
    for (const event of transition.timeline) {
      if (event.durationMs < 0 || event.startMs < 0) {
        issues.push(
          issue(
            8,
            'negative-duration',
            `Transição "${transition.id}" tem evento com tempo negativo`,
          ),
        )
      }
    }
  }

  // 2 — toda escolha disponível precisa ter transição correspondente
  for (const state of scenario.states) {
    for (const cid of state.availableChoices) {
      const hasTransition = scenario.transitions.some(
        (t) => t.fromStateId === state.id && t.choiceId === cid,
      )
      if (!hasTransition) {
        issues.push(
          issue(
            2,
            'choice-without-transition',
            `Escolha "${cid}" do estado "${state.id}" não tem transição definida`,
          ),
        )
      }
    }
  }

  // 9 e 10 — todo caminho termina dentro do limite
  issues.push(...checkTermination(scenario))

  // 14 — todo caminho resolve o ponto
  for (const state of scenario.states) {
    if (
      state.terminal !== undefined &&
      !DECISIVE_OUTCOMES.includes(state.terminal)
    ) {
      issues.push(
        issue(
          14,
          'terminal-does-not-resolve-point',
          `Estado terminal "${state.id}" termina em "${state.terminal}", que não ` +
            'resolve o ponto; cenário de decisão precisa de desfecho decisivo',
        ),
      )
    }
  }

  // 15–16 — governança dos números
  issues.push(
    ...checkProbabilities(scenario, isPublicScenario(scenario), context),
  )

  // 11–13 — governança de evidência
  issues.push(...checkEvidence(scenario))

  return { valid: issues.length === 0, issues }
}

/**
 * Invariantes 9 e 10 — percorre o grafo a partir do estado inicial e verifica
 * que todo caminho alcança um terminal dentro de MAX_TRANSITIONS.
 *
 * Busca em profundidade com detecção de ciclo por caminho.
 */
function checkTermination(scenario: TacticalScenario): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const stateById = new Map(scenario.states.map((s) => [s.id, s]))

  const walk = (
    stateId: string,
    path: readonly string[],
  ): void => {
    if (path.length > MAX_TRANSITIONS) {
      issues.push(
        issue(
          10,
          'path-exceeds-limit',
          `Caminho excede ${MAX_TRANSITIONS} transições: ${path.join(' → ')}`,
        ),
      )
      return
    }

    if (path.includes(stateId)) {
      issues.push(
        issue(
          9,
          'unguarded-cycle',
          `Ciclo detectado sem guardrail: ${[...path, stateId].join(' → ')}`,
        ),
      )
      return
    }

    const state = stateById.get(stateId)
    if (state === undefined) return // já reportado pelos invariantes 1/3
    if (state.terminal !== undefined) return // caminho terminou

    const nextPath = [...path, stateId]
    for (const cid of state.availableChoices) {
      const transition = scenario.transitions.find(
        (t) => t.fromStateId === stateId && t.choiceId === cid,
      )
      if (transition !== undefined) walk(transition.toStateId, nextPath)
    }
  }

  walk(scenario.initialStateId, [])
  return issues
}

/**
 * Invariantes 11–13 — o padrão de evidência de PRODUCT.md § 00.1 como código.
 *
 * É deliberado que estas regras sejam executáveis: a credibilidade do produto
 * depende delas, e uma regra que vive só na documentação é uma regra que será
 * esquecida quando houver pressa.
 */
const isPublicScenario = (s: TacticalScenario): boolean =>
  PUBLIC_STATUSES.includes(s.status)

/**
 * Invariantes 15, 16 e 17 — governança dos números.
 *
 * Uma probabilidade aparenta precisão. Publicar uma estimativa editorial como
 * se fosse medição é pior que publicar um rótulo vago, porque o usuário não
 * tem como distinguir. Ver PRODUCT.md § 00.5.
 */
function checkProbabilities(
  scenario: TacticalScenario,
  isPublic: boolean,
  context: ValidationContext,
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  for (const choice of scenario.choices) {
    const p = choice.winProbability

    // 15 — o número precisa ser uma probabilidade
    if (!(p.value >= 0 && p.value <= 1)) {
      issues.push(
        issue(
          15,
          'probability-out-of-range',
          `Escolha "${choice.id}" tem probabilidade ${p.value}, fora de 0–1`,
        ),
      )
    }

    // 15 — todo número declara o que o sustenta
    if (p.note.trim() === '') {
      issues.push(
        issue(
          15,
          'probability-without-note',
          `Escolha "${choice.id}" não declara o que sustenta a probabilidade`,
        ),
      )
    }

    // 16 — estimativa não é publicável
    if (isPublic && p.basis === 'estimated') {
      issues.push(
        issue(
          16,
          'estimated-probability-published',
          `Escolha "${choice.id}" publica uma probabilidade estimada; ` +
            'estimativa editorial só é aceitável em rascunho',
        ),
      )
    }

    // 17 — dizer-se medido obriga a apontar para a medição.
    //
    // Sem isto, `basis: 'measured'` é apenas uma string mais confiante que
    // `estimated`, e o campo que existe para dar procedência passa a esconder
    // a falta dela. A âncora precisa existir de fato no registro de evidência.
    const needsAnchor = p.basis === 'measured' || p.basis === 'derived'
    if (needsAnchor && p.anchorId === undefined) {
      issues.push(
        issue(
          17,
          'unanchored-probability',
          `Escolha "${choice.id}" declara base "${p.basis}" sem citar âncora ` +
            'medida (winProbability.anchorId)',
        ),
      )
    }
    if (p.anchorId !== undefined && context.knownAnchorIds !== undefined) {
      if (!context.knownAnchorIds.has(p.anchorId)) {
        issues.push(
          issue(
            17,
            'unknown-anchor',
            `Escolha "${choice.id}" cita a âncora "${p.anchorId}", que não ` +
              'existe no registro de evidência',
          ),
        )
      }
    }
  }

  return issues
}

function checkEvidence(scenario: TacticalScenario): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const isPublic = PUBLIC_STATUSES.includes(scenario.status)
  const isVerified =
    scenario.source.verificadaPor !== null &&
    scenario.source.verificadaEm !== null

  // 11 — Regra 2 de § 00.1: não publica sem fonte verificada por um humano
  if (isPublic && !isVerified) {
    issues.push(
      issue(
        11,
        'published-without-verified-source',
        `Cenário "${scenario.id}" está "${scenario.status}" mas a fonte não foi ` +
          'verificada por um humano (source.verificadaPor / verificadaEm)',
      ),
    )
  }

  // 11 — fonte PENDENTE só é aceitável em rascunho
  if (scenario.source.tier === 'PENDENTE' && scenario.status !== 'rascunho') {
    issues.push(
      issue(
        11,
        'pending-source-beyond-draft',
        `Cenário "${scenario.id}" tem fonte PENDENTE mas status "${scenario.status}"; ` +
          'fonte pendente só é aceitável em rascunho',
      ),
    )
  }

  // 12 — Regra 1 de § 00.1: a força da fonte limita a força da afirmação.
  // Publicar probabilidade é afirmação quantitativa e exige fonte tier B.
  if (isPublic && !QUANTITATIVE_TIERS.includes(scenario.source.tier)) {
    issues.push(
      issue(
        12,
        'probability-exceeds-source',
        `Cenário "${scenario.id}" publica probabilidades, o que é afirmação ` +
          `quantitativa e exige fonte tier B; a fonte é tier "${scenario.source.tier}"`,
      ),
    )
  }

  // 13 — a fonte precisa declarar o que sustenta (impede citação decorativa)
  if (isPublic && scenario.source.oQueSustenta.trim() === '') {
    issues.push(
      issue(
        13,
        'decorative-citation',
        `Cenário "${scenario.id}": source.oQueSustenta está vazio; a fonte precisa ` +
          'sustentar uma afirmação específica',
      ),
    )
  }

  return issues
}
