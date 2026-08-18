---
title: "PDA Point — Produto"
status: "Documento vivo — camada pré-código"
language: "pt-BR"
---

# PDA Point — Especificação de Produto

Este documento é a fonte de verdade de produto para o PDA Point. Ele existe para que
qualquer pessoa (ou agente de código) que trabalhe no projeto entenda o que estamos
construindo, por quê, e o que **não** estamos construindo, sem precisar reconstruir
esse raciocínio do zero.

Ele é preenchido em estágios, na ordem abaixo. Cada estágio só avança depois que o
anterior está razoavelmente fechado.

```text
00 — Decisões fundamentais          ✅ fechado
01 — Brand System                    ✅ fechado
02 — Information Architecture        ✅ fechado
03 — Core Experience Specification   🔜 próximo
04 — Golden Scenario 001
05 — Mobile Wireframes
06 — Tactical Content System         ◐ fundação decidida (ver 00)
07 — Technical Handoff / Agent Spec
08 — Validation Plan
```

Os documentos técnicos e de visão original que originaram este arquivo continuam
como referência histórica, mas este arquivo é o que deve ser lido primeiro.

---

# 00 — Decisões fundamentais

Duas decisões que precedem todo o resto. Elas condicionam o conteúdo, o engine, a
UI e o discurso comercial. Não devem ser alteradas sem ADR.

## 00.1 — O conteúdo tático é baseado em evidência

A autoridade tática do PDA Point não é o fundador nem um treinador contratado.
É a **evidência publicada**. Toda tática, e todo padrão atribuído a um jogador
profissional, precisa estar ancorado em material verificável.

### Realidade do terreno

A literatura de tática de tênis é **fraca em evidência experimental** e
**forte em evidência estatística**. Praticamente não existe estudo controlado
demonstrando que uma escolha de bola é superior a outra numa situação específica.
O que existe, e é sólido, é análise quantitativa de partidas reais: distribuição
de duração de rally, eficiência de saque+1, padrões de direção, taxa de erro por
zona.

Consequência: nosso embasamento descreve majoritariamente **o que jogadores de
alto nível de fato fazem**, e não *o que foi provado funcionar*. O conteúdo deve
ser escrito com o verbo correspondente a isso.

### Hierarquia de fontes

| Tier | Tipo | Exemplos | Peso |
|---|---|---|---|
| **A** | Dados quantitativos de partidas reais | Match Charting Project / Tennis Abstract (dados shot-by-shot abertos, cobrem o roster de jogadores do documento de visão) | Sustenta uma tática sozinha |
| **B** | Literatura científica de análise notacional / ciência do esporte | ITF Coaching & Sport Science Review; periódicos de performance analysis | Sustenta uma tática sozinha |
| **C** | Manuais de federação e livros de treinadores com trajetória verificável | ITF, USTA, PTR, CBT | Sustenta uma tática sozinha |
| **D** | Análise pública de especialista reconhecido | Craig O'Shannessy / Brain Game Tennis | Apenas complementa — nunca sustenta sozinha |
| **✗** | Não aceito | Fórum, vídeo sem dado, "conhecimento geral do tênis", conteúdo gerado por IA sem verificação da fonte primária | Nunca |

### Regra 1 — A força da fonte limita a força da afirmação

A classificação de cada escolha (`melhor` / `boa` / `situacional` / `ruim`) é
limitada pela qualidade da evidência que a sustenta:

- Evidência Tier A/B → pode classificar como `melhor` ou `ruim`.
- Apenas convenção de manual (Tier C) → a decisão é `situacional` ou `boa`.
- Sem fonte → a tática não é publicada.

A plataforma nunca simula certeza que a evidência não sustenta. Isso é o que
separa o PDA Point de uma prancheta com opinião.

### Regra 2 — Citação fabricada é o maior risco do projeto

Um agente de IA pode produzir uma referência plausível e inexistente, e o
fundador não teria como distinguir. O documento de arquitetura já estabelece que
nunca se deve confiar em JSON gerado por IA; **a mesma regra vale, com mais
rigor, para fontes**.

Nenhuma tática entra em `published` sem que a fonte primária tenha sido
verificada por um humano. Verificar significa: a fonte existe, é acessível, e
diz de fato o que a tática afirma que ela diz.

### Regra 3 — Atribuição a jogadores profissionais

Padrões atribuídos a jogadores reais devem ser formulados de forma factual e
citável:

- ✅ "Padrão observado em X% dos pontos de saque de [jogador] no saibro" (com fonte)
- ✗ "O segredo do [jogador]"

Isso resolve simultaneamente credibilidade e exposição de marca/imagem.

## 00.2 — Nível filtra situações, não altera a resposta

Cada situação tática tem **uma única classificação correta de decisões**. O nível
declarado do jogador determina **quais situações aparecem para ele**, não qual é a
resposta certa dentro de uma situação.

Motivo: preserva a integridade do conteúdo (uma situação = uma verdade
sustentada por evidência), mantém o custo editorial linear em vez de triplicá-lo,
e simplifica o engine — a classificação vive no dado da tática, não numa matriz
nível × situação.

Implicação: se uma situação genuinamente tem respostas diferentes por nível, ela
deve ser modelada como **duas situações distintas**, cada uma com seu contexto
explícito e sua própria fonte.

---

# 01 — Brand System

## Marca

**PDA Point**

## Origem do nome

PDA vem de **Parque das Águas**, o clube onde o fundador jogou tênis — hoje conhecido
como PDA Tennis. Não é uma sigla de marketing; é uma referência real e pessoal, o que
dá ao nome uma autenticidade que a maioria dos produtos do nicho (nomes genéricos tipo
"CourtVision", "TennisIQ" etc.) não tem.

## Tagline principal

> **PDA Point — Enxergue o ponto antes de jogá-lo.**

Justificativa: liga diretamente ao mecanismo central do produto — o usuário vê a
situação, entende as opções, e só depois decide. Não é uma tagline genérica de
"app de tênis"; ela descreve o loop do produto.

## Taglines / microcopy secundários (contextuais, não a headline)

- "Veja o jogo. Entenda o ponto." — para contextos de UI, não para branding externo.
- "A tática do seu próximo ponto, antes de bater na bola." — para copy mais longa
  (ex: meta description, texto de onboarding).

## Proposta de valor (uma frase)

> PDA Point ensina você a enxergar, decidir e construir o ponto — não só bater na bola.

## Promessas que podemos fazer

- Ensinar leitura tática de situações de jogo.
- Mostrar a consequência visual de cada decisão.
- Identificar padrões de erro e oportunidade do jogador.
- Gerar um plano tático aplicável contra um adversário específico.

## Promessas que NÃO podemos fazer (hoje)

- Melhorar tecnicamente o golpe do jogador.
- Substituir um treinador presencial.
- Prever o resultado real de uma partida.
- Analisar vídeo real do jogo do usuário.
- Garantir ganho de ranking/rating.

## Tom de voz

- Direto — tom de treinador experiente, não de curso online.
- Confiante sem ser arrogante; a quadra fala mais que o texto.
- Trata o usuário como alguém que já joga, não como iniciante absoluto.
- Frases curtas. Nunca "parabéns por completar sua jornada de aprendizado".

## Vocabulário fixo (não trocar por sinônimo em nenhuma tela)

| Usar | Não usar |
|---|---|
| situação | exercício |
| decisão | resposta / pergunta |
| ponto | rally |
| score tático | pontuação, nota |

## Nomenclatura de features

| Nome interno (docs técnicos) | Nome no produto |
|---|---|
| Tennis IQ (nome provisório antigo) | **Point IQ** |
| Point Builder / Xadrez do Tênis | Point Builder |
| Match Plan | Match Plan |
| Golden Scenario | (termo interno, não aparece na UI) |

`Point IQ` foi escolhido por manter toda a terminologia de score/dimensões já
especificada no documento de visão original (só troca "Tennis" por "Point") e por
criar simetria direta com o nome da marca — PDA **Point** → **Point** IQ.

## Posicionamento — o que PDA Point não é / é

**Não é:**
- curso online
- app de aula
- biblioteca de vídeos
- prancheta de treinador digitalizada
- dashboard de estatísticas
- game infantil
- "IA que joga tênis por você"

**É:**
> Uma plataforma para aprender a enxergar, decidir e construir o ponto.

## Preparo internacional

Foco inicial: Brasil, PT-BR. Arquitetura de conteúdo pronta para EN/ES depois
(ver doc de arquitetura técnica, seção de i18n).

Os termos de sistema (`Point Builder`, `Match Plan`, `Point IQ`) já são
híbridos PT/EN — isso reduz o retrabalho de identidade quando o produto for
traduzido; a tradução afeta o conteúdo tático, não os nomes de feature.

---

# 02 — Information Architecture

Cinco áreas. `Jogar` é o centro e recebe destaque na navegação inferior.

```text
[ Início ]  [ Biblioteca ]  [ JOGAR ]  [ Plano ]  [ Perfil ]
```

## Início

Não é dashboard. Cinco blocos, no máximo:

- continuar de onde parou;
- desafio de hoje;
- score tático (resumo, não painel);
- uma oportunidade detectada;
- um único CTA de próximo passo.

## Jogar

Centro da experiência.

- Point IQ (avaliação gratuita);
- desafio rápido;
- Point Builder;
- sessões personalizadas *(pós-MVP)*.

## Biblioteca

Exploração estruturada, com filtros por:

- momento do ponto;
- objetivo;
- situação;
- dificuldade;
- simples / duplas;
- jogadores profissionais;
- salvos.

## Plano

Aplicação a uma partida concreta:

- meu perfil;
- adversário;
- Match Plan atual;
- planos anteriores.

## Perfil

Identidade tenística do usuário:

- características;
- pontos fortes e fracos;
- score e evolução;
- histórico;
- preferências (tema de quadra).

## Regra de conexão — sem becos sem saída

Duas regras transformam as cinco áreas em rede, em vez de cinco árvores isoladas:

1. **Toda tela que encerra uma situação** — no desafio, no Point Builder, ou ao
   jogar uma tática vinda da Biblioteca — oferece sempre as mesmas três saídas:
   *próxima situação relacionada* · *ver na Biblioteca* · *voltar*.

2. **Todo diagnóstico vira link.** Qualquer gargalo ou oportunidade detectado
   (resultado do Point IQ, Perfil, Match Plan) aponta diretamente para a categoria
   correspondente na Biblioteca. Nunca fica apenas como texto.

O usuário nunca "termina" e trava: sempre existe um próximo passo óbvio.

---

# 03 — Core Experience Specification

*(próximo)*
