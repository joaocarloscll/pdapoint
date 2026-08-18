# AGENTS.md

Leia este arquivo antes de editar qualquer coisa neste repositório.

## O produto

PDA Point — plataforma de inteligência tática no tênis. O usuário vê uma
situação de jogo em quadra 2D, decide, assiste à consequência da própria escolha
e entende o mecanismo por trás dela.

A fonte de verdade de produto é **`docs/PRODUCT.md`**. Leia antes de propor
qualquer mudança de comportamento.

## As regras que não se quebram

### 1. O conteúdo é descritivo, não prescritivo

O produto afirma **"isto é o que o profissional faz"**, nunca "isto é o que você
deve fazer". Toda a evidência disponível descreve tênis profissional, e o usuário
é recreativo (`PRODUCT.md` § 00.2b). Copy que prescreve é bug.

Vocabulário de classificação: `padrao` · `alternativa` · `situacional` ·
`incomum`. Não reintroduza `melhor`/`ruim`.

### 2. Nenhuma tática publica sem fonte verificada por humano

`PRODUCT.md` § 00.1, Regra 2. Está implementado como invariante 11 no validador
(`tactical-engine/validator/invariants.ts`) e coberto por teste. Se um teste de
evidência falhar, o problema é o conteúdo — não o teste.

Nunca preencha `source.verificadaPor` sem que uma pessoa tenha de fato aberto a
fonte primária. Citação fabricada é o maior risco do projeto.

### 3. O Match Charting Project está fora

Licença `CC BY-NC-SA 4.0`, uso não-comercial apenas (`PRODUCT.md` § 00.2c).
Não introduza dados nem números derivados dele.

### 4. O engine não conhece a UI

`tactical-engine/` não pode importar React, Next, Tailwind, Supabase ou DOM.
É lógica pura, testável isoladamente. Regra do documento de arquitetura, seção 5.

```text
UI  →  features  →  tactical-engine  →  domain types
```

### 5. Coordenadas são normalizadas

Sempre `0.0–1.0`. Nunca pixels. O renderer converte. É o que mantém replay e
temas consistentes entre resoluções.

### 6. Superfície é tema visual

Trocar de tema muda a paleta e nada mais. Superfície nunca altera a
classificação de uma decisão (`PRODUCT.md` § 00.3).

## Comandos

```bash
npm run dev         # servidor de desenvolvimento
npm run typecheck   # tsc --noEmit
npm test            # Vitest: engine + invariantes
npm run build       # build de produção
```

Nenhuma tarefa está concluída se qualquer um destes falhar.

## Estrutura

```text
app/                 rotas Next.js (App Router)
features/            composição de UI por funcionalidade
tactical-engine/     ⚠️ lógica pura — sem React/DOM
  domain/            tipos
  graph/             percurso e guardrails anti-loop
  validator/         os 13 invariantes
  tests/
tactical-renderer/   SVG da quadra e marcadores
content/scenarios/   cenários táticos
docs/                fonte de verdade de produto e evidência
```

## Antes de codificar

1. descreva a solução;
2. liste os arquivos que pretende alterar;
3. liste os riscos;
4. indique os testes.

## Depois de implementar

Rode typecheck, testes e build. Não considere a tarefa concluída se qualquer
etapa falhar.

## O que exige justificativa explícita

- alterar a arquitetura de pastas;
- adicionar dependência;
- mudar as regras de evidência ou o vocabulário de classificação;
- alterar os guardrails anti-loop;
- migrar TypeScript para 7.x (decisão documentada: só com CI verde).

Agente não reverte decisão documentada silenciosamente.
