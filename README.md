# PDA Point

> Enxergue o ponto antes de jogá-lo.

Plataforma de inteligência tática no tênis. O usuário vê uma situação de jogo em
quadra 2D, decide, assiste à consequência da própria escolha e entende o
mecanismo por trás dela.

O nome vem do **Parque das Águas**, onde o projeto nasceu.

## O que existe hoje

Este repositório está na fase **Tactical Engine V1** — o núcleo lógico do produto,
com um cenário jogável ponta a ponta.

| Área | Estado |
|---|---|
| Especificação de produto | ✅ 7 de 8 estágios fechados |
| Catálogo de fontes de evidência | ✅ levantado |
| Tactical Engine (domínio, grafo, guardrails) | ✅ implementado |
| Validador — 13 invariantes | ✅ implementado e testado |
| Renderer SVG da quadra | ✅ implementado |
| Loop jogável (observação → decisão → consequência) | ✅ funcionando |
| Cenário canônico | ⚠️ rascunho — fonte não verificada |
| Autenticação, banco, biblioteca, Match Plan | ⬜ não iniciados |

## Começando

```bash
npm install
npm run dev          # http://localhost:3000
```

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest — engine e invariantes |
| `npm run build` | build de produção |

Nenhuma tarefa está concluída se qualquer um destes falhar.

## A ideia central

O núcleo não é uma animação. É um **state engine**: estados, escolhas,
transições, consequências, terminação e replay. A UI apenas pergunta *"qual é o
estado atual e o que devo desenhar?"*.

```text
SITUAÇÃO → OBSERVAÇÃO → DECISÃO → ANIMAÇÃO → CONSEQUÊNCIA
                                                  ↓
      PRÓXIMO ESTADO ← COMPARAÇÃO ← PADRÃO PROFISSIONAL ← POR QUÊ
```

A observação vem antes das opções por desenho: se as opções aparecem junto com a
situação, o usuário lê as opções em vez de ler a quadra — e o produto perde
exatamente a habilidade que promete treinar.

## A regra que governa o projeto

**Todo conteúdo tático precisa de fonte publicada e verificada por um humano.**

A autoridade não é o fundador nem um treinador contratado: é a evidência. E como
toda a evidência disponível descreve tênis profissional enquanto o usuário-alvo é
recreativo, o produto afirma **"isto é o que o profissional faz"** — nunca "isto é
o que você deve fazer".

Essa regra não vive só na documentação. Ela é executável:

```ts
// tactical-engine/validator/invariants.ts — invariante 11
if (isPublic && !isVerified) {
  issues.push(/* published-without-verified-source */)
}
```

Um cenário sem fonte verificada não passa do status `rascunho`. O teste falha no
CI. É por isso que o cenário canônico atual está marcado como rascunho e exibe um
aviso na própria interface — mesmo agora que a fonte existe e foi lida, porque a
assinatura humana ainda não foi dada.

## Estrutura

```text
app/                 rotas Next.js (App Router)
features/            composição de UI por funcionalidade
tactical-engine/     ⚠️ lógica pura — sem React, Next ou DOM
  domain/            tipos
  graph/             percurso e guardrails anti-loop
  validator/         os 13 invariantes
  tests/
tactical-renderer/   SVG da quadra e marcadores
content/scenarios/   cenários táticos
docs/                fonte de verdade
```

A regra de dependência é estrita:

```text
UI → features → tactical-engine → domain types
```

O engine não importa React. Isso permite testar o cérebro da aplicação
isoladamente, e é o que impede que regras táticas vazem para dentro de
componentes visuais.

## Documentação

| Documento | Conteúdo |
|---|---|
| [`docs/PRODUCT.md`](docs/PRODUCT.md) | Fonte de verdade de produto: decisões fundamentais, marca, arquitetura de informação, core loop, wireframes, sistema de conteúdo, plano de validação |
| [`docs/EVIDENCE_SOURCES.md`](docs/EVIDENCE_SOURCES.md) | Catálogo de fontes, com status de verificação por fonte |
| [`docs/PATTERN_BACKLOG.md`](docs/PATTERN_BACKLOG.md) | Padrões táticos candidatos a virar conteúdo |
| [`docs/DATA_PROTECTION.md`](docs/DATA_PROTECTION.md) | Postura de proteção de dados (LGPD) e requisitos antes de coletar qualquer dado |
| [`SECURITY.md`](SECURITY.md) | Política de segurança e como reportar vulnerabilidades |
| [`AGENTS.md`](AGENTS.md) | Regras para agentes de código. Leia antes de editar |

## Stack

Next.js 16 · React 19 · TypeScript 7 (strict) · Tailwind 4 · SVG + Web Animations
· Vitest · GitHub Actions

O TypeScript 7 — o compilador nativo — entrou depois de passar pelo portão que
a arquitetura definia: typecheck, testes, build padrão e build de export todos
verdes, e cada flag estrita verificada individualmente. O typecheck ficou cerca
de 3× mais rápido.

## Evidência

O projeto deixou de ser "sem fonte". Quatro artigos revisados por pares, todos
`CC BY` (uso comercial permitido com atribuição), foram abertos e lidos —
fichas completas em [`docs/EVIDENCE_SOURCES.md`](docs/EVIDENCE_SOURCES.md) § 00b:

- **Prieto-Lage et al. (2023)**, *Match analysis and probability of winning a point
  in elite men's singles tennis*, PLOS ONE 18(9): e0286076 —
  DOI [`10.1371/journal.pone.0286076`](https://doi.org/10.1371/journal.pone.0286076)
- **Crespo, Martínez-Gallego & Filipcic (2024)**, Frontiers in Sports and Active
  Living 6:1406846 — DOI `10.3389/fspor.2024.1406846`
- **Zhao, Cui, Gómez, Zong & Qi (2025)**, Frontiers in Sports and Active Living
  7:1634573 — DOI `10.3389/fspor.2025.1634573`
- **Cheng & Wang (2026)**, Frontiers in Psychology — DOI `10.3389/fpsyg.2026.1562462`

O primeiro deles dá ao projeto seus primeiros números **medidos**, guardados em
`content/evidence/` como âncoras: probabilidade de o sacador vencer o ponto por
tipo de saque, duração de rally e superfície, em 4.669 pontos de Grand Slam.

Âncora não é resposta. São frequências condicionais — "entre os pontos que
terminaram curtos, o sacador venceu 81%" — e ler isso como "encurte o ponto e você
ganha 81%" troca condicionamento por causa. Elas calibram os números do produto e
mostram quando um palpite está fora do que alguém já mediu; o que ninguém mediu
continua marcado como estimativa e continua sem poder ser publicado
(`docs/PRODUCT.md` § 00.6, invariante 17).

## Próximo passo

O **Golden Scenario 001** já tem fonte, lida e citada. Falta o passo que nenhum
agente pode dar por você: abrir o DOI, conferir os trechos citados e preencher
`source.verificadaPor` / `verificadaEm`. Até lá o invariante 11 mantém o cenário em
rascunho.

O roteiro está em `docs/EVIDENCE_SOURCES.md` § 00b.

## Privacidade

A aplicação publicada **não coleta nenhum dado pessoal**: não há contas,
cookies, `localStorage`, analytics ou requisições a terceiros. Detalhes e os
requisitos para as fases futuras em
[`docs/DATA_PROTECTION.md`](docs/DATA_PROTECTION.md).

## Licença

Copyright © 2026 João Carlos. Todos os direitos reservados.

Este repositório é público para transparência e avaliação — **público não
significa livre**. Uso comercial, redistribuição e obras derivadas exigem
autorização prévia por escrito. Ver [`LICENSE`](LICENSE).

As fontes citadas permanecem sob a licença de seus respectivos autores. O
projeto não incorpora dados do Match Charting Project, que proíbe uso
comercial.
