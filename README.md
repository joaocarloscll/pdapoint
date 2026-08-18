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
aviso na própria interface.

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

## Próximo passo

O estágio bloqueado é o **Golden Scenario 001**: ele precisa de uma fonte tier B
aberta e verificada por uma pessoa. Duas revistas gratuitas cobrem o escopo —
IJRSS (`CC BY 4.0`, permite uso comercial) e ITF Coaching & Sport Science Review.

O roteiro está em `docs/EVIDENCE_SOURCES.md` § 01b.

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
