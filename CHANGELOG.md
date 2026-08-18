# Changelog

Todas as mudanças relevantes deste projeto são registradas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

---

## [Não lançado]

### Evidência — o projeto sai do zero de fontes verificadas

Até aqui nenhum artigo científico tinha sido lido na fonte primária: o ambiente de
pesquisa tinha egress bloqueado para todos os grandes editores. O fundador entregou
um pacote com os PDFs, e quatro artigos `CC BY` foram abertos, lidos e conferidos
contra o manifesto SHA-256.

#### Adicionado

- **`content/evidence/prieto-lage-2023.ts`** — 27 âncoras medidas de Prieto-Lage
  et al. (2023), PLOS ONE, `CC BY`: probabilidade de o sacador vencer o ponto por
  tipo de saque × duração de rally × superfície, sobre 4.669 pontos de Grand Slam,
  mais a distribuição de duração de rally. Primeiros números `measured` do projeto.
- **`content/evidence/index.ts`** — registro de âncoras e busca por id.
- **`ProbabilityAnchor`** e o campo `WinProbability.anchorId` nos tipos de domínio.
- **Invariante 17** — probabilidade `measured` ou `derived` sem âncora, ou com
  âncora inexistente no registro, é rejeitada. `validateScenario` passa a aceitar um
  contexto opcional com os ids conhecidos, para não inverter a regra de dependência.
- **`PRODUCT.md` § 00.6** — o que uma âncora é, e a armadilha de ler frequência
  condicional como probabilidade de escolha.
- **`EVIDENCE_SOURCES.md` § 00b** — fichas dos quatro artigos, com licença, amostra,
  matriz de probabilidades e as ressalvas de leitura.
- 14 testes de evidência, incluindo a relação primeiro saque > segundo saque em toda
  superfície como guarda contra erro de digitação na tabela.

#### Alterado

- **Golden Scenario 001** passa de fonte `PENDENTE` para tier B com referência,
  DOI e a afirmação exata que a fonte sustenta. As três probabilidades **continuam
  `estimated`**, e isso é deliberado: o artigo mede duração de rally e tipo de
  saque, não comparação de alvo a partir de uma bola curta. Cada estimativa passa a
  citar a âncora medida mais próxima, para que se veja de quanto ela se afasta.
- **`EVIDENCE_SOURCES.md` § 03.6** passa de `⚠️ PARCIAL` para `✅ VERIFICADO`.
- **`PATTERN_BACKLOG.md`** reconciliado com as 35 sementes do pacote de pesquisa:
  o que foi absorvido, o que era novo (duplas, planos contra perfis) e o que foi
  rejeitado — o vocabulário de decisão do pacote conflita com § 00.2b e § 00.5.
- **Teste do invariante 11** deixou de depender do estado do fixture: montava a
  fonte pendente a partir de golden-001, e quando o cenário ganhou fonte real o
  teste passou a não testar nada, silenciosamente.

#### Anotado

- Divergência aritmética na Tabela 2 do artigo do PLOS: na linha da grama os
  contadores de saque somam 1.569 em vez dos 1.623 pontos do torneio. Saibro e
  quadra rápida fecham. Reproduzimos o publicado e registramos, em vez de corrigir.

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
