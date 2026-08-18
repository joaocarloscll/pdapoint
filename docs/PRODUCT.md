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
03 — Core Experience Specification   ✅ fechado
04 — Golden Scenario 001             ⛔ bloqueado por EVIDENCE_SOURCES.md
05 — Mobile Wireframes               🔜 próximo
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

A classificação de cada escolha (`padrão` / `alternativa` / `situacional` /
`incomum` — ver 00.2b) é limitada pela qualidade da evidência que a sustenta:

- Evidência Tier B com dado quantitativo → pode classificar como `padrão` ou `incomum`.
- Apenas convenção de manual (Tier C) → a decisão é `situacional` ou `alternativa`.
- Sem fonte → a tática não é publicada.

Nota: Tier A está indisponível por licença (ver 00.2c), o que torna Tier B o teto
prático de evidência quantitativa no momento.

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

## 00.2b — O conteúdo é descritivo, não prescritivo

A pesquisa de fontes (`EVIDENCE_SOURCES.md`) estabeleceu que **toda a evidência
utilizável descreve tênis profissional**, e que não existe base de dados de jogo
recreativo — que é o nosso usuário.

Diante disso, o PDA Point afirma o que a evidência sustenta:

- ✅ **"Isto é o que o profissional faz nesta situação."** — sustentado.
- ✗ "Isto é o que você deve fazer." — não sustentado pela evidência disponível.

Isso não é um recuo. É o posicionamento mais forte disponível: nenhum concorrente
ocupa o espaço de "mostrar o padrão profissional documentado e ensinar a lê-lo", e
a honestidade sobre a origem da evidência é, ela própria, o diferencial.

### Consequência no vocabulário

A classificação das escolhas deixa de ser um juízo e passa a ser uma observação:

| Antes (prescritivo) | Agora (descritivo) |
|---|---|
| `melhor` | `padrão` — o que predomina no profissional |
| `boa` | `alternativa` — também usado, depende do contexto |
| `situacional` | `situacional` — a evidência não distingue |
| `ruim` | `incomum` — raro no profissional, ou com resultado documentado pior |

O botão "Ver melhor decisão" (seção 03, Fase 7) passa a ser **"Ver o padrão
profissional"**. A pedagogia não muda: você escolheu X, o profissional joga Y
aqui, e este é o mecanismo. O que muda é a honestidade da afirmação.

### Consequência na copy

Toda explicação deve declarar a origem da evidência. O usuário sempre sabe que
está vendo padrão profissional, não prescrição personalizada para o nível dele.

## 00.2c — O Match Charting Project está fora da base de fontes

O MCP é `CC BY-NC-SA 4.0` — **uso não-comercial apenas** (verificado no README
oficial; ver `EVIDENCE_SOURCES.md` § 02.1). O PDA Point é um produto comercial.

**Decisão: construir sem depender do MCP.** Caminho juridicamente limpo desde o
início, e que respeita a intenção explícita do mantenedor.

### O que isso implica na prática

| Item | Situação |
|---|---|
| Os 7 achados calculados em `EVIDENCE_SOURCES.md` § 06.1 | **Orientação interna apenas.** Indicam quais perguntas táticas valem conteúdo. Nenhum número derivado vai para o produto. |
| Literatura que deriva do MCP (ex.: Lisi et al. 2024) | Não utilizável como base independente |
| Literatura de Hawk-Eye (Mecheri 2016; Fitzpatrick et al. 2024) | **Prioridade de aquisição.** Independente do MCP, sobre jogo profissional, sustenta o posicionamento de 00.2b. É paga. |
| Manuais de federação (ITF, USTA, PTR, CBT) | Sustentam mecanismo e convenção — não sustentam afirmação de frequência no profissional |

### Pendência aberta — padrões por jogador

O documento de visão prevê 30+ jogadores × 10 padrões. Recorte tático por jogador
era exatamente o que o MCP fornecia; literatura publicada quase nunca traz esse
nível de individualização.

**Sem uma fonte própria, este pilar não tem base.** A alternativa credível é
**coleta própria**: análise notacional de partidas transmitidas publicamente,
gerando dados proprietários sem restrição de licença — que é como o próprio MCP
nasceu. Trabalhoso, mas vira ativo do negócio em vez de fonte emprestada.

Decisão pendente. Não bloqueia o MVP (que não depende de padrões por jogador),
mas bloqueia a Biblioteca de profissionais.

## 00.3 — Superfície é tema visual, não variável tática

Os temas de quadra (`classic`, `paris-clay`, `melbourne-hard`, `new-york-hard`,
`london-grass`) são **puramente estéticos**. A superfície não altera a
classificação das decisões de uma tática.

Motivo: manter uma única verdade por situação (coerente com 00.2), evitar
multiplicar o custo editorial por número de superfícies, e manter o engine livre
de uma matriz superfície × situação.

Implicação: o conteúdo tático deve ser escrito de forma **neutra de superfície**.
Se um padrão só se sustenta em uma superfície específica, isso pertence ao
contexto explícito da tática (e, se necessário, ela vira uma situação distinta —
mesma regra de 00.2), nunca a uma troca de tema pelo usuário.

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

Este é o DNA pedagógico da plataforma. Toda experiência jogável do PDA Point —
Point IQ, desafio, tática da Biblioteca, Point Builder — é uma repetição deste
loop. Se algo aqui mudar, muda o produto inteiro.

```text
SITUAÇÃO
   ↓
OBSERVAÇÃO
   ↓
DECISÃO
   ↓
ANIMAÇÃO DA SUA ESCOLHA
   ↓
CONSEQUÊNCIA
   ↓
POR QUÊ
   ↓
VER MELHOR DECISÃO
   ↓
COMPARAÇÃO VISUAL
   ↓
PRÓXIMO ESTADO
```

## Princípio que rege o loop inteiro

O usuário aprende **vendo a consequência**, não lendo um veredito. A animação não
é enfeite: é o argumento. Texto entra só depois que a imagem já explicou.

Corolário: nunca revelar a classificação de uma escolha antes de animar sua
consequência.

## Fase 1 — Situação

Estabelece o problema.

| | |
|---|---|
| **Mostra** | Quadra, posição de A e B, bola chegando. Curta animação de estabelecimento (a bola entra em quadra e para no ponto de decisão). |
| **Usuário pode** | Assistir. Nada mais. |
| **Não mostra** | Opções de decisão. Ainda não. |
| **Termina quando** | A animação de estabelecimento conclui. |

A animação de entrada existe para o usuário entender **de onde a bola veio** —
sem isso, a situação é ambígua e a decisão vira chute.

## Fase 2 — Observação

O beat que ensina a ler antes de decidir. É o que separa o PDA Point de um quiz.

| | |
|---|---|
| **Mostra** | Quadra estática no estado de decisão. Opcionalmente, um destaque discreto do sinal relevante (espaço aberto, adversário deslocado). |
| **Usuário pode** | Rever a situação (controle sempre disponível). |
| **Termina quando** | O usuário toca em "O que você faria?" — ou automaticamente após um intervalo curto. |

Decisão de produto: **as opções aparecem depois da observação, nunca junto com a
situação.** Se aparecerem juntas, o usuário lê as opções em vez de ler a quadra —
e o produto perde exatamente a habilidade que se propõe a treinar.

## Fase 3 — Decisão

| | |
|---|---|
| **Mostra** | 2 a 4 opções (tipicamente 3), como texto curto de intenção. Quadra permanece visível e protagonista. |
| **Usuário pode** | Selecionar uma opção · trocar a seleção · rever a situação · confirmar. |
| **Interação** | Dois toques: tocar seleciona (estado visual), "Confirmar" commita. |
| **Não pode** | Ver a classificação de qualquer opção antes de confirmar. |
| **Termina quando** | Usuário confirma. |

Dois toques em vez de um: evita toque acidental em tela pequena e cria um momento
de compromisso — o usuário assume a decisão antes de ver o resultado, que é o que
torna o aprendizado real.

**Sem cronômetro.** O tempo até a decisão é **medido** (dado útil para o Point IQ),
mas nunca imposto. Pressão de relógio prejudica aprendizado e não é o que estamos
treinando neste estágio do produto.

## Fase 4 — Animação da sua escolha

| | |
|---|---|
| **Mostra** | A trajetória da bola escolhida, o deslocamento do adversário, a nova configuração da quadra. |
| **Usuário pode** | Nada. Inputs bloqueados. |
| **Não pode** | Pular. Trocar a escolha. Ver o veredito antes do fim. |
| **Termina quando** | A transição conclui. |

A primeira reprodução é obrigatória e integral. Repetições posteriores podem ser
puladas ou aceleradas — mas a primeira é a aula.

## Fase 5 — Consequência

O momento em que a imagem já explicou, antes de qualquer texto.

| | |
|---|---|
| **Mostra** | Estado resultante, com o efeito da decisão evidenciado visualmente: espaço concedido ou criado, vantagem ganha ou perdida, posição de recuperação. |
| **Usuário pode** | Rever. |
| **Termina quando** | Usuário avança — ou automaticamente após uma pausa curta. |

## Fase 6 — Por quê

Só agora entra texto, e pouco.

| | |
|---|---|
| **Mostra** | Veredito em uma frase · classificação (`padrão` / `alternativa` / `situacional` / `incomum`, ver 00.2b) · mecanismo em 1–2 frases · acesso à fonte. |
| **Usuário pode** | Expandir a fonte · avançar. |

**A fonte é parte da UI, não um rodapé jurídico.** Decorre de 00.1: se o conteúdo
é baseado em evidência, o usuário precisa poder ver em que. Tratamento discreto
(afordância que expande), nunca escondido.

Formato do veredito — descreve o mecanismo, não julga o usuário, e declara a
origem da evidência (00.2b):

> ✅ "Essa decisão devolveu ângulo ao adversário antes de você consolidar a vantagem."
> ✗ "Errado! A opção correta era a B."

## Fase 7 — Ver o padrão profissional

Fase **condicional**. O que aparece depende da classificação da escolha do usuário
e da natureza da situação:

| Escolha do usuário | Ação oferecida |
|---|---|
| `incomum` ou `alternativa`, e existe um `padrão` documentado | **Ver o padrão profissional** |
| `padrão` | **Ver as outras opções** (opcional, não obrigatório) |
| Situação sem padrão dominante (todas `situacional`) | **Comparar alternativas** |

O terceiro caso decorre diretamente de 00.1: quando a evidência não distingue as
opções, a plataforma **não inventa um padrão**. Ela mostra os trade-offs. Isso não
é uma limitação a esconder — é a diferença entre ensinar tênis e aplicar um
gabarito.

## Fase 8 — Comparação visual

O pico pedagógico do loop.

| | |
|---|---|
| **Mostra** | Na mesma quadra: a trajetória do usuário em tom apagado (fantasma) e a alternativa em destaque, animadas em sequência — primeiro a sua, depois a recomendada. |
| **Evidencia** | A diferença de espaço, ângulo ou posição resultante entre as duas. |
| **Usuário pode** | Repetir a comparação · avançar. |

Sobreposição na mesma quadra, e não lado a lado: em 390px de largura, duas quadras
ficam pequenas demais para comunicar qualquer coisa. A sobreposição também é mais
honesta com o que queremos mostrar — **a diferença**, não duas cenas isoladas.

## Fase 9 — Próximo estado

| Situação | Comportamento |
|---|---|
| O grafo continua | Volta à Fase 1 no novo estado. O loop reinicia. |
| Estado terminal | Tela de encerramento com as três saídas obrigatórias da IA (seção 02): *próxima situação relacionada* · *ver na Biblioteca* · *voltar*. |

## Acessibilidade — `prefers-reduced-motion`

A animação é o argumento pedagógico; não pode simplesmente ser removida.

Com movimento reduzido: manter a sequência e as mudanças de posição, comprimir
durações e substituir o movimento contínuo por posições-chave discretas. O usuário
continua vendo *o que aconteceu*, sem o deslocamento contínuo na tela.

## Instrumentação

| Fase | Evento |
|---|---|
| 3 | `decision_presented` |
| 3 | `decision_selected` (com tempo até decisão) |
| 6 | `decision_correct` / `decision_wrong` |
| 7 | `better_option_viewed` |

## Proibido em qualquer implementação deste loop

- Mostrar a classificação de uma opção antes de animar sua consequência.
- Pular a animação na primeira reprodução.
- Permitir troca de escolha após confirmar.
- Reduzir o feedback a "certo / errado".
- Publicar uma situação cuja explicação não tenha fonte (ver 00.1).
- Forçar um `padrão` quando a evidência sustenta apenas `situacional`.
- Apresentar padrão profissional como prescrição para o nível do usuário (00.2b).

---

# 04 — Golden Scenario 001

*(bloqueado até a base de fontes estar levantada — ver `EVIDENCE_SOURCES.md`)*
