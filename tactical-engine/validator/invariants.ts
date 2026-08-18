/**
 * Invariantes obrigatórios de um cenário tático.
 *
 * Os invariantes 1–10 vêm do documento de arquitetura, seção 17. Os
 * invariantes 11 e 13 materializam o padrão de evidência de PRODUCT.md § 00.1
 * — as regras editoriais viram código que falha no CI, em vez de boa intenção.
 * O invariante 14 faz o mesmo com a regra de fechamento de § 00.4, o
 * invariante 15 com a governança básica dos números de § 00.5, e o invariante
 * 17 fecha o ciclo: um número que se diz medido precisa apontar para a
 * medição.
 *
 * Os invariantes 12 e 16 existiram e foram retirados em 2026-08-18 (PRODUCT.md
 * § 00.1, decisão revisada). Exigiam, respectivamente, fonte tier B para
 * publicar qualquer probabilidade, e proibiam publicar probabilidade
 * `estimated`. O fundador decidiu que a barra do projeto não é "nível de
 * confiabilidade de publicação científica", é "faz sentido e é honesto sobre
 * o que sustenta". Os números continuam obrigatoriamente honestos sobre a
 * própria procedência (15) e uma medição continua tendo que apontar para a
 * medição real (17) — o que caiu foi o bloqueio de publicação em cima disso.
 * Os números ficam retirados, e não reaproveitados, para que quem procurar
 * "invariante 12" ou "16" em código ou histórico antigo encontre esta nota em
 * vez de silêncio.
 */

import type {
  TerminalOutcome,
  ScenarioStatus,
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

  // 15 e 17 — governança dos números
  issues.push(...checkProbabilities(scenario, context))

  // 11 e 13 — governança de evidência
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
 * Invariantes 11 e 13 — o padrão de evidência de PRODUCT.md § 00.1 como código.
 *
 * É deliberado que estas regras sejam executáveis: a credibilidade do produto
 * depende delas, e uma regra que vive só na documentação é uma regra que será
 * esquecida quando houver pressa. O que essas regras protegem, desde a decisão
 * revisada de 2026-08-18, é mais estreito: não que toda tática tenha um artigo
 * por trás, mas que nenhuma tática minta sobre o que tem por trás.
 */

/**
 * Invariantes 15 e 17 — governança dos números.
 *
 * Toda probabilidade continua obrigada a declarar sua procedência (15) e, se
 * essa procedência é uma medição, a apontar para ela de verdade (17). O que
 * caiu foi o bloqueio de publicar uma estimativa — ver a nota no topo do
 * arquivo sobre os invariantes 12 e 16 retirados.
 */
function checkProbabilities(
  scenario: TacticalScenario,
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

  // 11 — fonte PENDENTE só é aceitável em rascunho.
  //
  // É o único piso que resta: pode não ter artigo por trás (tier `geral` é
  // aceito, ver domain/types.ts), mas não pode não ter base nenhuma. Um
  // cenário publicado sem sequer um "por que isso faz sentido" declarado é
  // conteúdo vazio, e isso continua barrado independente do nível de rigor.
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
