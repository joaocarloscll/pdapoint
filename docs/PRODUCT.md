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
04 — Golden Scenario 001             ✅ publicado
05 — Mobile Wireframes               ✅ fechado
06 — Tactical Content System         ✅ fechado
07 — Technical Handoff / Agent Spec  ⏳ próximo
08 — Validation Plan                 ✅ fechado
```

**Sem bloqueio ativo.** O estágio 04 tem fonte — Prieto-Lage et al. (2023), PLOS
ONE, `CC BY`, lida integralmente (`EVIDENCE_SOURCES.md` § 00b.1) — e não precisa
mais de mais nada para publicar: a decisão revisada de 2026-08-18 (§ 00.1) tirou a
exigência de um humano abrir a fonte e assinar antes de qualquer conteúdo sair de
rascunho. `source.verificadaPor` continua `null`, e está tudo bem: o campo agora
registra uma checagem extra opcional, não um requisito de publicação.

Os documentos técnicos e de visão original que originaram este arquivo continuam
como referência histórica, mas este arquivo é o que deve ser lido primeiro.

---

# 00 — Decisões fundamentais

As decisões que precedem todo o resto. Elas condicionam o conteúdo, o engine, a
UI e o discurso comercial. Não devem ser alteradas sem ADR.

## 00.1 — O conteúdo tático é fundamentado, não necessariamente publicado

> **Decisão revisada — 2026-08-18.** Até aqui esta seção descrevia uma barra de
> publicação científica: toda tática precisava de fonte tier B/C **e** de um
> humano abrindo-a e assinando antes de qualquer coisa sair de rascunho. O
> fundador decidiu que não é isso que quer construir agora — quer uma
> ferramenta **útil**, com fatos que fazem sentido, não um repositório
> auditado. A mudança concreta: **conhecimento geral do ensino de tênis passa
> a ser aceito como base sozinho** (tier `geral`, abaixo), e **publicar deixa
> de exigir assinatura humana**. O que **não** mudou, porque é outra coisa —
> honestidade, não rigor: uma fonte citada continua tendo que ser real. Um
> agente de IA inventar uma referência plausível e inexistente continua sendo
> o pior erro possível aqui, exatamente como antes.

A autoridade tática do PDA Point não é o fundador nem um treinador contratado.
É a **evidência e a convenção estabelecida do ensino de tênis**. Toda tática, e
todo padrão atribuído a um jogador profissional, precisa declarar o que a
sustenta — e essa declaração precisa ser verdadeira.

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
| **geral** | Convenção amplamente aceita do ensino de tênis, sem estudo específico | "Devolver profundo ao meio reduz o ângulo do adversário" | Sustenta uma tática sozinha, desde que rotulada como tal |
| **✗** | Ainda não aceito | Fonte inventada; algo apresentado como Tier B/C que não existe ou não diz o que se afirma | Nunca — isto é fraude, não falta de rigor |

### Regra 1 — A força da fonte limita a força da afirmação

A classificação de cada escolha (`padrão` / `alternativa` / `situacional` /
`incomum` — ver 00.2b) é limitada pela qualidade da evidência que a sustenta:

- Evidência Tier B com dado quantitativo → pode classificar como `padrão` ou `incomum`.
- Apenas convenção de manual (Tier C) → a decisão é `situacional` ou `alternativa`.
- Apenas convenção geral do ensino (tier `geral`) → a decisão nunca é `padrão`: é
  `alternativa` ou `situacional`, e a copy diz "é comum ensinar que...", nunca
  "o profissional faz X em Y%".
- Sem base nenhuma declarada (`PENDENTE`) → a tática não é publicada.

Nota: Tier A está indisponível por licença (ver 00.2c), o que torna Tier B o teto
prático de evidência quantitativa no momento. O projeto tem quatro artigos Tier B
`CC BY` abertos e lidos, com uso comercial permitido (`EVIDENCE_SOURCES.md` § 00b).

A plataforma nunca simula certeza que a evidência não sustenta — mesmo sob a barra
mais baixa, uma convenção geral continua rotulada como convenção geral, não como
dado. Isso é o que separa o PDA Point de uma prancheta com opinião disfarçada de
estatística.

### Regra 2 — Citação fabricada continua sendo o maior risco do projeto

A barra de quanto rigor uma tática precisa caiu. A honestidade sobre o que a
sustenta não caiu — são coisas diferentes.

Um agente de IA pode produzir uma referência plausível e inexistente, e o
fundador não teria como distinguir sem abrir cada uma. O documento de arquitetura
já estabelece que nunca se deve confiar em JSON gerado por IA; **a mesma regra
vale, com o mesmo rigor, para fontes**: se `source.referencia` aponta para um
artigo, autor ou manual específico, esse material precisa existir de verdade e
dizer o que a tática afirma que ele diz. Se não há um material específico por
trás, o campo `tier` diz `geral` e ponto — isso é aceitável, inventar não é.

Deixou de ser exigido que um humano abra a fonte e assine antes de publicar. Isso
não é o mesmo que dispensar a verificação de que a fonte é real: continua sendo
trabalho de quem escreve a tática (hoje, um agente de código) garantir isso antes
de escrever `referencia`.

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

## 00.4 — Todo caminho resolve o ponto

Cada escolha termina em ponto ganho ou perdido. Quando a decisão abre espaço
para isso, **o adversário responde e pontua** — a consequência é animada, não
anunciada.

Motivo duplo. O primeiro é de experiência: decidir e ver o rally "neutralizado"
não fecha nada, e o usuário sai sem sensação de desfecho. O segundo é
pedagógico e mais importante: a consequência **é** a lição (§ 03). Um veredito
textual informa que a escolha foi ruim; ver o adversário entrar na quadra e
passar faz o custo ser sentido.

Por isso cada transição anima dois golpes — o seu e a resposta dele.

### Consequência na curadoria de conteúdo

Uma situação só vira conteúdo quando a evidência sustenta um padrão dominante.
Situações em que a evidência não distingue as opções simplesmente **não entram
na biblioteca**.

Isto é curadoria, não invenção. A regra de § 00.1 continua intacta: nunca se
afirma mais do que a fonte sustenta. O que muda é o critério de seleção — em
vez de publicar uma situação ambígua e classificá-la como `situacional`, ela
fica de fora até que haja evidência que a resolva.

A classificação `situacional` permanece no modelo e no validador, como guarda:
um cenário cujas opções sejam todas situacionais é sinal de que ele ainda não
deveria existir.

### Consequência no engine

O invariante 14 rejeita cenário de decisão que termine em `neutralized_end`.
Esse desfecho fica reservado ao guardrail anti-loop do Point Builder, que o
produz em tempo de execução — nunca é escrito à mão.

---

## 00.5 — Toda escolha tem uma probabilidade, e todo número tem procedência

O modelo de avaliação segue o espírito da análise de lances do xadrez: cada
escolha carrega uma **chance de vencer o ponto**, e a qualidade da decisão
deriva da distância até a melhor opção disponível.

Não existe ambiguidade real entre duas jogadas. Existe diferença que ainda não
foi medida. Tratar opções como "equivalentes" é descrever a nossa ignorância,
não o jogo.

### A qualidade é derivada, nunca escrita

| Perda em relação à melhor | Qualidade |
|---|---|
| 0 | Melhor escolha |
| até 3 pp | Excelente |
| até 8 pp | Boa |
| até 15 pp | Imprecisão |
| até 25 pp | Erro |
| acima de 25 pp | Erro grave |

Faixas calibradas para o tênis, não copiadas do xadrez: um ponto de tênis é
muito mais volátil que uma posição de xadrez, então perdas pequenas pesam
menos.

Derivar em vez de escrever garante que o rótulo nunca contradiga o número, e
que corrigir um número reclassifique a escolha sozinho.

### A diferença em relação ao xadrez, que é onde mora o risco

No xadrez o motor é verdade de campo: o Stockfish avalia a posição e o número
é auditável por qualquer um. **No tênis não existe equivalente.**

Um número aparenta precisão. Publicar `76%` quando o número é palpite editorial
é pior do que publicar um rótulo vago, porque o usuário não tem como
distinguir os dois — e a credibilidade é o ativo do produto.

Por isso toda probabilidade declara sua procedência:

| Procedência | O que é | Publicável |
|---|---|---|
| `measured` | Medido em partidas reais e publicado | ✅ — e precisa citar a âncora (§ 00.6) |
| `derived` | Calculado a partir de dado publicado, com o cálculo declarado | ✅ — e precisa citar a âncora (§ 00.6) |
| `estimated` | Estimativa editorial | ✅ desde a decisão revisada de 2026-08-18 |

E todo número declara, no campo `note`, exatamente o que o sustenta — ou, sendo
estimativa, **qual dado o substituiria** (quando existir algum próximo).

> **Decisão revisada — 2026-08-18.** Até aqui, `estimated` não podia sair de
> rascunho, e publicar qualquer probabilidade exigia fonte tier B. As duas
> travas caíram junto com a de § 00.1: a barra deixou de ser "toda tática
> rastreável a um artigo", passou a ser "todo número honesto sobre a própria
> origem". `basis: 'estimated'` permanece um rótulo público — o usuário
> continua vendo, quando existir, que aquele número é palpite calibrado, não
> medição. O que mudou é que isso deixou de impedir a publicação.

### Consequência no engine

- **Invariante 15** — probabilidade fora de 0–1, ou sem `note`, é rejeitada.
- **Invariante 17** — probabilidade `measured` ou `derived` precisa apontar
  para uma âncora real (§ 00.6); `estimated` não precisa, mas pode citar uma
  para efeito de calibração.

### Precisão da sessão

Cada decisão vale o quanto reteve da melhor opção: escolher 60% quando a melhor
era 80% retém 75%. A precisão da sessão é a média — é o mesmo conceito da
precisão de partida do xadrez, e é o que alimentará o score do Point IQ.

A precisão avalia **a decisão, não o desfecho**. No tênis a escolha certa perde
o ponto com frequência; pontuar pelo resultado ensinaria o jogador a perseguir
sorte.

---

## 00.6 — Âncora medida: o que um número publicado precisa apontar

§ 00.5 diz que toda probabilidade declara procedência. Faltava a parte que torna a
declaração auditável: **para onde `measured` e `derived` apontam.** Sem isso,
`basis: 'measured'` é só uma string mais confiante que `estimated`, e o campo criado
para dar procedência passa a esconder a falta dela.

Uma **âncora** é um número efetivamente medido e publicado, guardado em
`content/evidence/` com o valor, a população em que foi medido, a superfície, o `n`
quando reportado, o lugar exato do artigo onde aparece, e a referência completa.

- **Invariante 17** — probabilidade `measured` ou `derived` sem `anchorId`, ou com
  `anchorId` que não existe no registro, é rejeitada.
- Uma `estimated` **pode** citar âncora. Significa outra coisa: a faixa medida mais
  próxima, declarada para que se veja de quanto a estimativa se afasta do que alguém
  de fato mediu. Continua sem poder ser publicada.

### A armadilha que o modelo existe para evitar

Prieto-Lage et al. medem que o sacador vence **81%** dos pontos que terminaram em
rally curto após primeiro saque, em quadra rápida. É tentador escrever isso como
"encurtar o ponto dá 81% de chance".

Seria errado. A duração do rally é **resultado** do ponto, não uma decisão tomada
antes dele — a população de "pontos que acabaram curtos" já inclui os aces e as
devoluções não devolvidas, ou seja, já está selecionada pelo desfecho. Trocar
condicionamento por causa é o modo mais fácil de fabricar um número com aparência de
rigor. O próprio artigo se declara descritivo.

Consequência prática: **as âncoras calibram, não decidem.** Elas dizem em que faixa
vive a vantagem real em cada contexto, e portanto quando um número escrito à mão
está fora do que alguém já mediu. O que ninguém mediu — "cruzado curto versus
profundo na quadra aberta a partir de uma bola curta" — continua `estimated`, e
continua sem poder ser publicado.

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

⛔ **Bloqueado.** Depende de fonte verificada. Ver `EVIDENCE_SOURCES.md` § 01b
para o roteiro de verificação, e `PATTERN_BACKLOG.md` para os três candidatos
priorizados a ocupar esta posição.

Escrever o cenário canônico com fonte placeholder violaria a Regra 2 de 00.1 —
que é justamente a regra que sustenta a credibilidade do produto inteiro.

---

# 05 — Wireframes mobile (390 × 844)

Hierarquia e interação. **Não** são cores, tipografia ou tratamento visual final.

Convenções: `▓` área da quadra · `[ ]` controle tocável · `···` conteúdo
truncado/rolável.

## Tela 1 — Entrada no Point IQ

Primeiro contato. Sem conta, sem fricção.

```text
┌─────────────────────────────┐
│                             │
│         PDA POINT           │
│                             │
│   Enxergue o ponto antes    │
│      de jogá-lo.            │
│                             │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ▓                       ▓  │
│  ▓   quadra em loop      ▓  │
│  ▓   silencioso —        ▓  │
│  ▓   uma jogada curta    ▓  │
│  ▓                       ▓  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│                             │
│   10 situações. 3 minutos.  │
│   Sem cadastro.             │
│                             │
│   [   Descobrir meu IQ   ]  │
│                             │
│   [ Ver como funciona ]     │
│                             │
└─────────────────────────────┘
```

A animação em loop **é** o argumento de venda. Ela mostra o produto antes de
qualquer texto explicativo.

## Tela 2 — Situação tática

O coração do produto. Duas fases na mesma tela.

**2a — Observação** (opções ainda ocultas)

```text
┌─────────────────────────────┐
│  ←            2/10          │
├─────────────────────────────┤
│                             │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ▓         ●B            ▓  │
│  ▓                       ▓  │
│  ▓ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ▓  │
│  ▓              ○        ▓  │
│  ▓          ●A           ▓  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│                             │
│         [ ↻ rever ]         │
│                             │
│  ─────────────────────────  │
│                             │
│   [  O que você faria?  ]   │
│                             │
└─────────────────────────────┘
```

**2b — Decisão** (após o toque)

```text
┌─────────────────────────────┐
│  ←            2/10          │
├─────────────────────────────┤
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ▓         ●B            ▓  │
│  ▓ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ▓  │
│  ▓              ○        ▓  │
│  ▓          ●A           ▓  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│         [ ↻ rever ]         │
│  ─────────────────────────  │
│  ┌───────────────────────┐  │
│  │ A  Cruzado curto      │  │
│  ├───────────────────────┤  │
│  │ B  Cruzado profundo   │ ◄│ selecionado
│  ├───────────────────────┤  │
│  │ C  Paralela           │  │
│  └───────────────────────┘  │
│                             │
│   [      Confirmar      ]   │
└─────────────────────────────┘
```

A quadra **nunca sai da tela**. As opções ocupam o terço inferior — zona do
polegar. Alvo mínimo de 44px por opção.

## Tela 3 — Consequência

```text
┌─────────────────────────────┐
│               2/10          │
├─────────────────────────────┤
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ▓                       ▓  │
│  ▓      ●B ←── trajetória▓  │
│  ▓ ─ ─ ─┼─ ─ ─ ─ ─ ─ ─ ─ ▓  │
│  ▓      ▒▒▒ espaço       ▓  │
│  ▓      ▒▒▒ concedido    ▓  │
│  ▓            ●A         ▓  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ─────────────────────────  │
│                             │
│  ○ alternativa              │
│                             │
│  Devolveu ângulo ao         │
│  adversário antes de        │
│  consolidar a vantagem.     │
│                             │
│  [ ⓘ fonte ]                │
│                             │
│  [  Ver o padrão profissional ]│
└─────────────────────────────┘
```

A classificação (`○ alternativa`) aparece **junto** com o veredito, nunca antes da
animação. O acesso à fonte é discreto mas presente — exigência de 00.1.

## Tela 4 — Resultado do Point IQ

```text
┌─────────────────────────────┐
│                             │
│      Seu score tático       │
│                             │
│           632               │
│                             │
│  ─────────────────────────  │
│  Construção      ███████ 74 │
│  Saque +1        ████████ 81│
│  Devolução       ██████ 63  │
│  Ataque          ███████ 68 │
│  Defesa          ████ 41 ◄  │
│  Posicionamento  ███████ 71 │
│  ─────────────────────────  │
│                             │
│  Seu maior vazamento hoje   │
│  foi defesa sob pressão.    │
│                             │
│  38% das decisões erradas   │
│  vieram dessa família.      │
│                             │
│  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  │
│  ▒ outros padrões ocultos ▒ │
│  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  │
│                             │
│  [ Descobrir os outros    ] │
│  [ padrões                ] │
└─────────────────────────────┘
```

Um insight revelado, o resto parcialmente oculto. A barra da dimensão mais fraca
recebe marcação — é a âncora narrativa do resultado.

## Tela 5 — Início autenticado

```text
┌─────────────────────────────┐
│  PDA Point            ⚙     │
├─────────────────────────────┤
│  Continue de onde parou     │
│  ┌───────────────────────┐  │
│  │ ▓ Construção de ponto │  │
│  │   7/12 situações      │  │
│  └───────────────────────┘  │
│                             │
│  Desafio de hoje            │
│  ┌───────────────────────┐  │
│  │ ▓ uma situação        │  │
│  └───────────────────────┘  │
│                             │
│  Score tático     632  ▲ 8  │
│                             │
│  Detectamos                 │
│  ┌───────────────────────┐  │
│  │ Defesa sob pressão    │  │
│  │ → ver na Biblioteca   │  │
│  └───────────────────────┘  │
│                             │
├─────────────────────────────┤
│ Início Biblio (JOGAR) Plano Perfil│
└─────────────────────────────┘
```

Cinco blocos, teto rígido. "Detectamos" **sempre** linka para a Biblioteca — regra
de conexão da seção 02.

## Tela 6 — Biblioteca

```text
┌─────────────────────────────┐
│  Biblioteca           🔍    │
├─────────────────────────────┤
│  [Momento][Objetivo][Nível] │ ← filtros roláveis
├─────────────────────────────┤
│  ┌───────────────────────┐  │
│  │ ▓▓▓▓  Ataque à bola   │  │
│  │ ▓▓▓▓  curta           │  │
│  │       Ataque · Interm.│  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ ▓▓▓▓  Saque aberto →  │  │
│  │ ▓▓▓▓  forehand        │  │
│  │       Saque · Interm. │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ ▓▓▓▓  Neutralizar     │  │
│  │ ▓▓▓▓  deslocado       │  │
│  │       Defesa · Fund.  │  │
│  └───────────────────────┘  │
│           ···               │
├─────────────────────────────┤
│ Início Biblio (JOGAR) Plano Perfil│
└─────────────────────────────┘
```

Cada card mostra a quadra em miniatura — o usuário reconhece a situação
visualmente antes de ler o título.

## Tela 7 — Point Builder

```text
┌─────────────────────────────┐
│  ←     0–0 · você saca      │
├─────────────────────────────┤
│                             │
│  golpe 3 de até 14          │
│  ● ● ○ ○ ○ ○ ○ ○            │
│                             │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ▓        ●B             ▓  │
│  ▓ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ▓  │
│  ▓      ○                ▓  │
│  ▓          ●A           ▓  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ─────────────────────────  │
│  ┌───────────────────────┐  │
│  │ Abrir a quadra        │  │
│  ├───────────────────────┤  │
│  │ Manter profundidade   │  │
│  ├───────────────────────┤  │
│  │ Mudar de direção      │  │
│  └───────────────────────┘  │
│   [      Confirmar      ]   │
└─────────────────────────────┘
```

O contador de golpes é visível — comunica que **o ponto é finito** e torna o
guardrail anti-loop parte da experiência em vez de um limite escondido.

## O que estes wireframes fixam

1. A quadra é sempre o maior elemento da tela.
2. Decisão sempre no terço inferior, zona do polegar.
3. Opções nunca aparecem junto com a situação (Fase 2 da seção 03).
4. Confirmação em dois toques em toda decisão.
5. Fonte acessível em toda explicação.
6. Navegação inferior nunca aparece durante uma situação — ela distrai da jogada.

## Telas fora deste lote

Depois de validado o core loop: página da tática, perfil, criação de Match Plan,
resultado do Match Plan, área do Coach.

---

# 06 — Sistema de Conteúdo Tático

A Biblioteca precisa nascer como **dataset estruturado**, não como um conjunto de
textos. Sem template obrigatório, 300 táticas viram 300 formatos diferentes e o
engine não consegue tratá-las de forma uniforme.

## Template obrigatório

Toda tática, sem exceção, preenche esta estrutura:

```yaml
# Identificação
id:                 # slug estável, nunca reutilizado
nome:               # título curto, orientado à situação
versao:             # inteiro; publicação nova nunca sobrescreve
categoria:          # saque | devolução | rally | ataque | defesa | transição | rede | duplas
nivel:              # fundamental | intermediária | avançada
tipo:               # simples | duplas

# Situação
contexto:           # 1 frase: o que está acontecendo
estado_inicial:
  bola:    { x: , y: }        # coordenadas normalizadas 0.0–1.0
  jogador_a: { x: , y: }
  jogador_b: { x: , y: }
  quem_bate:                  # a | b
  vantagem:                   # neutra | a | b

# Decisões
escolhas:
  - id:
    rotulo:                   # texto curto de intenção
    intencao:                 # o que o jogador tenta conseguir
    trajetoria:               # descrição do caminho da bola
    resposta_adversario:      # como B reage
    consequencia:             # estado resultante em 1 frase
    classificacao:            # padrão | alternativa | situacional | incomum
    proximo_estado:           # id do estado seguinte, ou terminal
    explicacao:               # o mecanismo, 1–2 frases

# Princípio
principio_tatico:   # a lição transferível
quando_usar:
quando_nao_usar:

# Governança — obrigatório para publicar
fonte:
  tier:             # B | C  (A indisponível — ver 00.2c)
  referencia:       # autores, ano, periódico, DOI
  o_que_sustenta:   # exatamente qual afirmação vem desta fonte
  verificada_por:   # nome de quem abriu a fonte
  verificada_em:    # data
revisor:
status:             # rascunho | revisada | aprovada | publicada | descontinuada
```

## Regras de integridade

1. **Sem `fonte.verificada_por` preenchido, o status não pode passar de `revisada`.**
   Esta é a materialização da Regra 2 de 00.1.
2. `classificacao` é limitada pelo `tier` da fonte (Regra 1 de 00.1).
3. Toda `escolha` aponta para um `proximo_estado` existente ou para um terminal.
4. Coordenadas sempre normalizadas — nunca pixels (ver documento de arquitetura).
5. Publicação nova cria versão; nunca edita destrutivamente uma publicada.
6. `o_que_sustenta` existe para impedir citação decorativa: a fonte precisa
   sustentar uma afirmação **específica**, não a tática "em geral".

## Fluxo de produção

```text
backlog (PATTERN_BACKLOG.md)
   ↓
pesquisa em fonte gratuita (IJRSS / ITF CSSR)
   ↓
fonte encontrada e aberta por um humano
   ↓
preenchimento do template
   ↓
modelagem do grafo de estados
   ↓
validação automática (invariantes do engine)
   ↓
preview em viewport de iPhone
   ↓
publicação versionada
```

## Por que isto vem antes das 300 táticas

Se o template só for definido depois de 30 táticas escritas, todas as 30 precisam
ser refeitas. O custo de estabelecer a estrutura agora é de horas; o de corrigir
depois é de semanas.

---

# 07 — Technical Handoff / Agent Specification

*(a escrever — depende de 04 e 06 estarem preenchidos com um caso real)*

Este documento ficará entre produto e código, e dirá ao agente *"construa
exatamente isto"*. Para cada tela/feature: objetivo, entrada, saída, componentes,
estados, interações, regras, comportamento mobile, loading/erro/vazio, analytics,
critérios de aceite e testes obrigatórios.

Alimentará `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/TACTICAL_ENGINE.md` e
`docs/DESIGN_SYSTEM.md`, conforme previsto no documento de arquitetura técnica.

---

# 08 — Plano de Validação

Existe para impedir que "ficou legal" seja confundido com "há negócio".

## V1 — Compreensão (5 pessoas)

**Pergunta:** entenderam sem explicação?

Método: entregar o telefone com a Tela 1 aberta, sem instrução alguma, e observar
em silêncio.

| Sinal de sucesso | Sinal de fracasso |
|---|---|
| Toca em "Descobrir meu IQ" sem perguntar nada | Pergunta "o que eu faço aqui?" |
| Observa a quadra antes de tocar nas opções | Toca em uma opção sem olhar a quadra |
| Consegue explicar por que a decisão foi ruim | Só entende que "errou" |

**Critério de avanço:** 4 de 5 entendem o loop sem ajuda.

## V2 — Valor (20 tenistas)

**Pergunta:** volta sozinho?

| Métrica | Alvo mínimo |
|---|---|
| Completou as 10 situações | 70% |
| Pediu "Ver o padrão profissional" ao menos uma vez | 50% |
| Quis jogar outra sessão na hora | 40% |
| Voltou em até 7 dias, sem lembrete | 25% |

**Critério de avanço:** retorno em 7 dias ≥ 25%. Abaixo disso, o problema é a
experiência — não adianta ampliar a biblioteca.

## V3 — Coach (5 professores)

**Pergunta:** usariam para explicar uma situação a um aluno?

Sinal forte: o professor pede para **enviar** uma situação a um aluno sem que
tenhamos sugerido. Isso indica o canal `coach → aluno → usuário` do documento de
visão.

**Contexto disponível:** o PDA Tennis é o ambiente natural para esta rodada.

## V4 — Disposição a pagar

**Pergunta:** alguém paga?

Não perguntar "você pagaria?" — a resposta é sempre sim e não vale nada. Colocar
um checkout real e medir conversão. Mesmo com 10 pessoas, o sinal é honesto.

## Regra que governa o plano

Nenhuma fase avança com a anterior reprovada. Se V1 falhar, o problema é
compreensão — e escalar conteúdo só multiplica um mal-entendido.
