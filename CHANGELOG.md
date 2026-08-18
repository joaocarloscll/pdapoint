# Changelog

Todas as mudanças relevantes deste projeto são registradas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

---

## [0.1.0] — 2026-08-18

### Tactical Engine V1

Primeira versão funcional do núcleo. Um cenário jogável ponta a ponta, sobre um
engine de estados puro que a UI apenas consulta.

#### Adicionado — produto

- **`docs/PRODUCT.md`** — fonte de verdade de produto, com 7 dos 8 estágios
  pré-código fechados: decisões fundamentais, marca, arquitetura de informação,
  core loop, wireframes mobile, sistema de conteúdo e plano de validação.
- **`docs/EVIDENCE_SOURCES.md`** — catálogo de fontes de evidência com status de
  verificação por fonte, e o veredito de licença sobre cada uma.
- **`docs/PATTERN_BACKLOG.md`** — 22 padrões táticos candidatos, todos marcados
  como pendentes de pesquisa.
- **`AGENTS.md`** — regras que agentes de código não podem reverter
  silenciosamente.

#### Adicionado — engine

- Tipos de domínio: estados, escolhas, transições, timeline e desfechos
  terminais, com coordenadas normalizadas `0.0–1.0`.
- Percurso imutável do grafo — cada decisão produz uma nova sessão, o que torna
  replay e retorno ao estado anterior triviais.
- Guardrails anti-loop com hash canônico por zona, e não por coordenada exata,
  de modo que posições quase idênticas colidam e o limite de fato dispare.
- Validador com **13 invariantes**. Os dez primeiros cobrem integridade do
  grafo, limites de coordenada e terminação garantida.
- O engine não importa React, Next nem DOM.

#### Adicionado — governança de evidência executável

Três invariantes transformam o padrão editorial em código que falha no CI:

- **11** — nenhum cenário alcança `publicada` sem que uma pessoa tenha
  verificado a fonte primária; fonte pendente não passa de `rascunho`.
- **12** — a classificação de uma escolha não pode exceder o que o tier da
  fonte sustenta.
- **13** — a citação precisa declarar qual afirmação específica ela sustenta,
  o que impede citação decorativa.

#### Adicionado — interface

- Renderer SVG da quadra, com paleta vinda de tokens de tema — adicionar uma
  superfície é uma entrada de paleta, nunca uma mudança de código.
- Loop jogável seguindo as fases especificadas: a observação precede as opções,
  a confirmação exige dois toques, e a consequência exibe classificação,
  mecanismo e estado da fonte.
- Layout mobile-first em 390×844, com alvos de toque de 48px.

#### Adicionado — infraestrutura

- CI no GitHub Actions: typecheck, testes e build a cada PR.
- 32 testes cobrindo cada invariante, o percurso do grafo e o determinismo do
  replay.

### Estado conhecido

- O cenário canônico (`content/scenarios/golden-001.ts`) é um **rascunho com
  fonte pendente**, e a própria interface informa isso. Ele existe para que
  engine e renderer pudessem ser construídos e testados contra um caso real.
- Autenticação, banco de dados, Biblioteca, Point IQ, Point Builder e Match Plan
  não foram iniciados.

### Bloqueio ativo

O **Golden Scenario 001** precisa de uma fonte tier B aberta e verificada por
uma pessoa antes de poder ser promovido. Roteiro em
`docs/EVIDENCE_SOURCES.md` § 01b.

[0.1.0]: https://github.com/joaocarloscll/pdapoint/releases/tag/v0.1.0
