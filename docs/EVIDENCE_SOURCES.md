---
title: "PDA Point — Catálogo de Fontes de Evidência"
status: "Documento vivo — camada pré-código"
language: "pt-BR"
depends_on: "docs/PRODUCT.md § 00.1"
last_research: "2026-08-18"
---

# PDA Point — Catálogo de Fontes de Evidência

Este documento é o inventário operacional das fontes que podem sustentar conteúdo
tático no PDA Point, conforme a hierarquia definida em `PRODUCT.md § 00.1`.

Ele não é uma bibliografia. É uma ferramenta de trabalho: para cada fonte, diz
**o que ela cobre, se dá para acessar, sob qual licença, e se serve para nós**.

> **Regra de leitura deste documento.** Cada fonte carrega um selo de verificação.
> Nada aqui deve ser citado em conteúdo `published` sem que o selo seja
> `✅ VERIFICADO` **ou** sem que o fundador tenha feito a verificação humana
> exigida pela Regra 2 de `PRODUCT.md`.

| Selo | Significado |
|---|---|
| ✅ **VERIFICADO** | Eu baixei/abri a fonte nesta pesquisa e li o conteúdo citado. Descrevo o que vi. |
| ⚠️ **PARCIAL** | Consegui confirmar existência e metadados por índices independentes, mas **não abri o texto completo**. |
| ⛔ **NÃO VERIFICADO** | Só sei que é referenciada por terceiros. **Tratar como inexistente até o fundador conferir.** |

---

## 00 — Nota de método (leia antes de confiar em qualquer coisa aqui)

O ambiente de pesquisa em que este documento foi produzido tinha **egress de rede
restrito**. Isso é decisivo para interpretar os selos acima.

**O que eu consegui acessar de fato:**

- `raw.githubusercontent.com` e `github.com` — acesso pleno. Baixei dados brutos,
  li READMEs, abri a planilha de notação do Match Charting Project e **rodei
  análises próprias sobre os dados primários**.
- Busca na web — funcionou, e me deu títulos, autores, DOIs, periódicos e trechos.

**O que foi bloqueado por política de egress (não é erro meu, é restrição do ambiente):**

`tennisabstract.com` · `itfcoachingreview.com` · `itf-academy.com` · `doaj.org` ·
`pubmed.ncbi.nlm.nih.gov` · `pmc.ncbi.nlm.nih.gov` · `doi.org` · `api.crossref.org` ·
`tandfonline.com` · `journals.plos.org` · `link.springer.com` · `mdpi.com` ·
`arxiv.org` · `scholar.google.com` · `semanticscholar.org` · `miguelcrespo.net`

**Consequência honesta e incômoda:** o **Tier A está verificado no osso** — eu tenho
os dados na mão e reproduzi os números. Os **Tiers B, C e D estão, na melhor das
hipóteses, em `⚠️ PARCIAL`** — eu confirmei que os artigos existem, quem são os
autores, em que periódico e com que DOI, mas **não li os PDFs**. Nenhum número
atribuído a artigo científico neste documento foi lido por mim na fonte primária,
salvo onde explicitamente indicado.

Isso não invalida o catálogo. Mas significa que **a Seção 06 (achados citáveis) está
dividida em duas metades com forças muito diferentes**, e você precisa respeitar essa
divisão.

---

## 01 — Sumário executivo

### O veredito curto

**Existe uma base de evidência boa o suficiente para lançar o produto, e ela é
essencialmente uma só fonte.** O Match Charting Project sustenta sozinho a maior
parte do conteúdo tático que o PDA Point precisa no MVP. Tudo o mais é
complemento, contexto ou convenção.

### Os quatro fatos que mudam decisões de negócio

**1. A fonte que resolve o produto tem licença que proíbe uso comercial.**

O Match Charting Project é `CC BY-NC-SA 4.0`. Literalmente, no README:
*"Attribution is required. Non-commercial use only."* O PDA Point é um produto
comercial. **Isto é um bloqueio jurídico, não um detalhe.** Ver § 02.1 e § 07.1 —
há um caminho concreto de resolução, porque o Sackmann detém a titularidade
integral dos direitos e portanto pode licenciar.

**2. Boa parte da literatura científica não é independente do MCP — ela deriva do MCP.**

Confirmado em pelo menos um caso central: Lisi, Grigoletto & Briglia (2024), o
artigo de referência sobre distribuição de duração de rally, usa dados do Match
Charting Project. Isso significa que citar "o MCP diz X" e "o artigo Y diz X" pode
ser **a mesma evidência contada duas vezes**. Não empilhe Tier A + Tier B como se
fossem confirmações independentes quando não são.

**3. Praticamente não existe evidência para jogador recreativo — que é o nosso usuário.**

Toda a estatística utilizável descreve tênis profissional. Não encontrei nenhum
corpo de dados shot-by-shot de jogadores recreativos/intermediários. Esta é a
maior fragilidade do produto e está detalhada em § 07.3. Tem implicação direta
de copy e de classificação.

**4. Dados oficiais (Hawk-Eye, ATP, Infosys) estão comercialmente fechados.**

Não são uma alternativa ao MCP. Ver § 02.4.

### O que dá para fazer amanhã

Existem **7 achados quantitativos que eu mesmo calculei a partir dos dados
primários**, reproduzíveis, com amostras de centenas de milhares a mais de um
milhão de pontos. Estão na § 06.1. Eles cobrem: duração de rally, eficácia do
saque, serve+1, profundidade de devolução, direção de bola (crosscourt vs
paralela) e jogo de rede. Isso é matéria-prima suficiente para um conjunto
inicial sério de situações táticas.

### O que não dá para fazer

Classificar como `melhor`/`ruim` qualquer decisão que dependa de **contexto de
posição de quadra fina, altura de bola, ou estado de equilíbrio do adversário** —
nada disso existe nos dados. Ver § 07.

---

## 02 — Tier A · Dados quantitativos de partidas reais

### 02.1 — Match Charting Project (MCP) — ✅ VERIFICADO

**O que é.** Projeto colaborativo iniciado por Jeff Sackmann em novembro de 2013.
Voluntários anotam partidas profissionais golpe a golpe a partir de transmissões
de TV, usando uma planilha padronizada. É a única base pública de tênis com
granularidade tática real.

**URL.** `https://github.com/JeffSackmann/tennis_MatchChartingProject`

**Verificação.** Baixei os arquivos do repositório via `raw.githubusercontent.com`,
li o `README.md` na íntegra, abri a planilha `MatchChart 0.3.2.xlsm` e extraí as
abas `Instructions`, `Version info` e `License_Assignment`. Rodei contagens e
agregações próprias sobre os CSVs.

#### Volume real (contado por mim, em 2026-08-18)

| | Partidas | Pontos anotados | Intervalo de datas |
|---|---:|---:|---|
| Masculino | **7.566** | **1.272.329** | 1960-05-29 → 2026-05-21 |
| Feminino | **4.080** | **565.897** | 1979-09-28 → 2026-05-24 |
| **Total** | **11.646** | **~1.838.000** | |

O README ainda diz "over 5,000 matches" — está desatualizado. O número real é
mais que o dobro. A base **continua ativa**, com partidas de maio de 2026.

Distribuição de superfície (masculino): Hard 4.850 · Clay 1.877 · Grass 837.
Há forte viés para quadra rápida — relevante porque `PRODUCT.md § 00.3` decidiu
escrever conteúdo neutro de superfície, o que é **coerente com esse viés**, já que
não temos amostra equilibrada para afirmar diferenças por piso.

#### Granularidade — o que existe de fato

Extraí a legenda de notação da aba `Instructions` da planilha oficial. Isto é a
fonte autoritativa, não uma reconstrução:

| Dimensão | Codificação | Observação |
|---|---|---|
| Direção do saque | `4` = aberto · `5` = no corpo · `6` = no T | Igual nas duas quadras (deuce/ad) |
| Tipo de golpe | 18 códigos: `f` forehand, `b` backhand, `r`/`s` slice FH/BH, `v`/`z` voleio, `o`/`p` smash, `u`/`y` drop shot, `l`/`m` lob, `h`/`i` meia-voleio, `j`/`k` swinging volley, `t` trick, `q` desconhecido | Completo |
| Direção do golpe | `1` = lado forehand do destro · `2` = meio · `3` = lado backhand do destro | Apenas **3 faixas**. O manual estima meio ≈ 40% da quadra, laterais ≈ 30% cada |
| Profundidade | **Só para devoluções de saque.** `7` = dentro dos quadrados de saque · `8` = atrás da linha de saque, mais perto dela que da linha de fundo · `9` = mais perto da linha de fundo | **Não existe profundidade para golpes de rally** |
| Posição de quadra | `+` = shot de aproximação · `-` = golpe na rede · `=` = golpe no fundo · `^` = drop volley | Aproximação e posição são inferidas por tipo de golpe |
| Desfecho | `*` winner · `@` erro não forçado · `#` erro forçado · `n`/`w`/`d`/`x`/`!` tipo de erro | Forçado vs não-forçado é **julgamento subjetivo do anotador** |

**Não existe:** coordenada x/y da bola, velocidade, altura sobre a rede, spin,
posição do jogador no momento do impacto, tempo entre golpes.

#### ⚠️ A limitação metodológica que quase ninguém menciona

A aba `Instructions` diz, textualmente, que **direção de golpe e profundidade de
devolução são campos OPCIONAIS**:

> *"Shot direction is not required, and when you first start charting matches,
> I recommend you stick with the shot-type codes."*

> *"Like shot direction, this is optional, but really, really nice to have!"*

E, sobre posição de quadra: *"Court position is great to have, but it's the lowest
priority of anything discussed up to this point."*

**Consequência séria:** o subconjunto de golpes com direção anotada **não é uma
amostra aleatória**. É enviesado para (a) anotadores mais experientes, (b) partidas
com transmissão de melhor ângulo, e (c) golpes em que o anotador teve confiança.
O manual inclusive orienta a omitir quando em dúvida. Qualquer número de direção
ou profundidade derivado do MCP — inclusive os meus, na § 06.1 — carrega esse viés.

O próprio autor assume incompletude: *"having 95% of the data from a match is
usually sufficient to identify patterns and tendencies, and 95% is way better than
nothing."*

Além disso, encontrei **linhas malformadas** nos CSVs de metadados (ex.: nome de
árbitra no campo `Surface`). São poucas, mas qualquer pipeline nosso precisa
validar em vez de confiar.

#### Cobertura do nosso roster — contagem própria

Todos os 19 jogadores do roster têm cobertura. Contagem exata (partidas em que o
jogador aparece como Player 1 ou Player 2):

| Jogador | Partidas | Distribuição por superfície | Período |
|---|---:|---|---|
| Roger Federer | **723** | Hard 474 · Clay 130 · Grass 119 | 1998–2021 |
| Novak Djokovic | **553** | Hard 366 · Clay 129 · Grass 58 | 2005–2026 |
| Rafael Nadal | **425** | Hard 219 · Clay 166 · Grass 40 | 2003–2024 |
| Jannik Sinner | **298** | Hard 196 · Clay 69 · Grass 33 | 2013–2026 |
| Daniil Medvedev | **286** | Hard 229 · Clay 30 · Grass 27 | 2017–2026 |
| Andy Murray | **257** | Hard 186 · Grass 38 · Clay 33 | 2005–2024 |
| Iga Świątek | **226** | Hard 142 · Clay 59 · Grass 25 | 2018–2026 |
| Carlos Alcaraz | **222** | Hard 128 · Clay 72 · Grass 22 | 2019–2026 |
| Serena Williams | **146** | Hard 94 · Clay 29 · Grass 23 | 1998–2022 |
| Stan Wawrinka | **138** | Hard 90 · Clay 35 · Grass 13 | 2006–2026 |
| Coco Gauff | **109** | Hard 88 · Clay 15 · Grass 6 | 2019–2026 |
| Steffi Graf | **85** | Hard 52 · Clay 22 · Grass 11 | 1985–1999 |
| Naomi Osaka | **67** | Hard 46 · Clay 17 · Grass 4 | 2016–2026 |
| Aryna Sabalenka | **57** | Hard 39 · Clay 14 · Grass 4 | 2016–2026 |
| Gustavo Kuerten | **56** | Clay 28 · Hard 26 · Grass 2 | 1997–2007 |
| João Fonseca | **53** | Hard 27 · Clay 23 · Grass 3 | 2024–2026 |
| Justine Henin | **52** | Hard 33 · Clay 12 · Grass 7 | 1999–2010 |
| Ashleigh Barty | **50** | Hard 38 · Clay 8 · Grass 4 | 2013–2022 |
| Beatriz Haddad Maia | **17** | Hard 13 · Clay 3 · Grass 1 | 2019–2025 |

**Leitura para produto:**

- **Sólido para atribuição de padrão individual** (≥100 partidas): Federer,
  Djokovic, Nadal, Sinner, Medvedev, Murray, Świątek, Alcaraz, Serena, Wawrinka, Gauff.
- **Cauteloso** (50–100): Graf, Osaka, Sabalenka, Kuerten, Fonseca, Henin, Barty.
  Dá para citar padrões amplos, não microtática.
- **⛔ Insuficiente: Beatriz Haddad Maia (17 partidas).** Para o mercado brasileiro
  isso é um problema real. **Não atribua padrão tático individual a ela** com essa
  amostra. Kuerten (56) e Fonseca (53) também são finos — Fonseca porque a carreira
  é recente, e vai melhorar sozinho com o tempo.
- Sabalenka com apenas 57 partidas é surpreendentemente baixo para uma nº 1;
  se isso importar, vale checar variações de grafia do nome antes de concluir.

#### Formato dos dados

CSV puro, UTF-8. Dois níveis:

1. **Bruto** — `charting-{m,w}-points-*.csv`. Uma linha por ponto. A sequência
   golpe a golpe está codificada como string nas colunas `1st` e `2nd`
   (ex.: `5f2f1f1v2n@`). O arquivo masculino dos anos 2020 tem ~57 MB e 547 mil
   linhas. **Exige parser** — escrevi um e ele funciona (§ 06.1, achado 3).
2. **Agregado** — `charting-{m,w}-stats-*.csv`. ~12+ arquivos por gênero, já
   tabulados. Confirmei o schema de: `Overview`, `ShotDirection`, `ShotDirOutcomes`,
   `Rally`, `ServeBasics`, `ServeDirection`, `ReturnDepth`, `ReturnOutcomes`,
   `NetPoints`, `ShotTypes`, `KeyPointsServe`, `SnV`.

**Para o MVP, os arquivos `-stats-` bastam.** Eles já trazem winners / erros
forçados / erros não forçados por direção de golpe, que é exatamente a estrutura
que o nosso modelo de decisão precisa.

#### 🔴 Licença — o ponto crítico do projeto inteiro

Do `README.md`, verbatim:

> *Crowdsourced shot-by-shot professional tennis data by The Tennis Abstract Match
> Charting Project is licensed under a **Creative Commons
> Attribution-NonCommercial-ShareAlike 4.0 International License**.*
>
> *In other words: **Attribution is required. Non-commercial use only.***
>
> *I'm serious about the license, and I'm really disappointed with the handful of
> people who have chosen to violate it. If violations continue, I may stop updating
> the repo entirely.*

Três restrições, todas problemáticas para nós:

| Cláusula | Efeito no PDA Point |
|---|---|
| **NC** (NonCommercial) | Bloqueia uso num produto pago. **Este é o bloqueio duro.** |
| **SA** (ShareAlike) | Obras derivadas teriam que ser publicadas sob a mesma licença |
| **BY** (Attribution) | Exige crédito visível — isso é fácil e desejável |

**A boa notícia, e é concreta.** A aba `License_Assignment` da planilha oficial
contém uma cessão de direitos que os colaboradores aceitam ao contribuir:

> *"By using this template and submitting the contents to Jeff Sackmann/Tennis
> Abstract, you assign and transfer to Jeff Sackmann/Tennis Abstract any rights you
> may have to any of the contents... and all of the related intellectual property
> rights, including any applicable copyrights throughout the world... you retain no
> interest in the contents contained in such files."*

Ou seja: **Jeff Sackmann é o titular único e integral dos direitos.** Não há
centenas de coautores a consultar. Isso significa que **existe uma contraparte
única capaz de conceder uma licença comercial**, e negociar isso é uma ação
executável — não um beco sem saída.

Ver § 08 para o encaminhamento.

**Veredito.** Insubstituível tecnicamente. Bloqueado juridicamente até que haja
licença. **Não publique conteúdo comercial derivado do MCP antes de resolver isso.**

---

### 02.2 — Tennis Abstract — ⛔ NÃO VERIFICADO (bloqueado)

**O que é.** Site do mesmo Jeff Sackmann. Hospeda os relatórios de partida gerados
a partir do MCP, ferramentas de consulta de estatísticas e o blog analítico
*Heavy Topspin*.

**URL.** `http://www.tennisabstract.com` — **domínio bloqueado pela política de
egress do meu ambiente. Não consegui abrir nenhuma página.**

**Relação com o MCP.** Documentada no README do MCP, que eu li: o site é a camada
de apresentação da mesma base. Os relatórios por partida (ex.:
`tennisabstract.com/charting/...html`) exibem em percentual o que os arquivos
`-stats-` trazem em números absolutos. **Não é fonte independente — é a mesma
evidência com outra roupa.** Nunca conte os dois como confirmação dupla.

Os resultados de busca indicam que o blog *Heavy Topspin* tem análises táticas
relevantes (ex.: subida à rede no WTA, glossário de estatísticas de rally), mas
**não abri nenhuma delas**.

**Veredito.** Provavelmente útil como referência de interpretação e como validação
cruzada dos nossos próprios cálculos. Mesma licença e mesmas restrições do MCP.
**O fundador precisa acessar e avaliar pessoalmente.**

---

### 02.3 — Repositórios `tennis_atp` / `tennis_wta` — 🔴 APARENTEMENTE INDISPONÍVEIS

Historicamente Sackmann mantinha repositórios separados com resultados de
partidas, rankings e arquivos de jogadores (`tennis_atp`, `tennis_wta`), e um de
ponto a ponto de Grand Slams (`tennis_slam_pointbypoint`).

**O que eu observei (2026-08-18):**

- `raw.githubusercontent.com/JeffSackmann/tennis_atp/master/README.md` → **404**
- `.../tennis_wta/master/README.md` → **404**
- `.../tennis_slam_pointbypoint/master/README.md` → **404**
- Controle na mesma requisição: `.../tennis_MatchChartingProject/master/README.md` → **200**

Testei nos branches `master` e `main`. Além disso, ao buscar o perfil
`github.com/jeffsackmann`, o retorno indicou **"Repositories 1"**, com o Match
Charting Project como único repositório público listado.

**Interpretação.** A evidência aponta para remoção ou fechamento desses
repositórios. **Mas eu não consegui uma confirmação direta** (a API do GitHub não
estava habilitada para esta sessão, e páginas HTML do github.com retornaram 403
via curl). Marcado como observação forte, não como fato estabelecido.

**Impacto para nós: baixo.** Esses repositórios continham resultados de
partida/set/game e rankings — **sem granularidade tática**. Seriam úteis para
metadados de jogador, não para conteúdo tático. A perda relevante seria
`tennis_slam_pointbypoint`.

**Ação:** § 08, item 2.

---

### 02.4 — Dados oficiais: ATP / Hawk-Eye / Infosys / TDI — ⚠️ PARCIAL

**Situação.** *Tennis Data Innovations* (TDI) é uma joint venture entre ATP Tour e
ATP Media, criada em 2020, responsável por coletar e **comercializar** dados de
todos os eventos ATP, incluindo dados de árbitro de cadeira e rastreamento óptico
Hawk-Eye. A ATP tem acordo de direitos de dados com a Sportradar. A Infosys é
parceira de inovação digital da ATP, com contrato estendido até 2028.

**Verificação.** Não abri nenhum documento contratual nem portal de desenvolvedor.
Isto vem de resultados de busca (ATP Tour, Sportcal, DLA Piper, UBITENNIS).

**Veredito para o PDA Point:** ⛔ **Inviável.** É o dado tecnicamente melhor que
existe — coordenadas reais de bola, velocidade, posição de jogador — e está
integralmente fechado atrás de licenciamento comercial B2B, orientado a apostas e
broadcast. Não há API pública. Preço fora de escala para um produto em pré-MVP.
**Não conte com isto no roadmap.** Registre como fonte inatingível e siga.

---

### 02.5 — Tennis-Data.co.uk — ⚠️ PARCIAL

**O que é.** Portal britânico com resultados ATP/WTA e odds de apostas em CSV/Excel,
atualizado semanalmente.

**URL.** `http://www.tennis-data.co.uk/`

**Conteúdo.** Tipo de quadra, superfície, rodada, vencedor/perdedor, rankings e
pontos no início do torneio, placar game a game, e odds de várias casas.

**Verificação.** Não abri o site. Descrição a partir de resultados de busca.

**Veredito.** ⛔ **Inútil para nós.** Contém resultado, não decisão. Zero
granularidade tática. Listado apenas para você não perder tempo investigando
depois. Serviria só a modelagem preditiva de resultado — que `PRODUCT.md` já
declarou explicitamente como promessa que **não** fazemos.

---

### 02.6 — Espelhos no Kaggle — ⚠️ PARCIAL / ⚠️ ARMADILHA

Existe pelo menos um espelho do MCP no Kaggle
(`kaggle.com/datasets/ryanthomasallen/tennis-match-charting-project`) e espelhos de
dados ATP/WTA.

**Aviso jurídico.** Um espelho **não lava a licença**. O dado continua sendo
`CC BY-NC-SA 4.0` do MCP, independentemente de onde você baixe. Se o espelho
declarar licença mais permissiva, o espelho está errado, não o original.
**Não use um espelho do Kaggle como justificativa para uso comercial.**

---

## 03 — Tier B · Literatura científica

> **Aviso que vale para toda esta seção.** Nenhum PDF foi aberto por mim — todos os
> repositórios acadêmicos estavam bloqueados. Autores, títulos, periódicos, volumes,
> páginas e DOIs foram confirmados por **múltiplos índices independentes**
> (SagePub/IOS Press, RePEc/IDEAS, repositórios institucionais, Mendeley). Os
> **números e achados** vêm de resumos e trechos indexados. Selo máximo aqui:
> `⚠️ PARCIAL`.

### 03.1 — ITF Coaching & Sport Science Review (CSSR) — ⚠️ PARCIAL

**O que é.** Publicação oficial de treinamento e ciência do esporte da
International Tennis Federation. Periódico revisado por pares, publicado desde
1992. É a fonte Tier B mais alinhada ao nosso escopo, porque publica análise
tática aplicada e não só fisiologia.

**URLs.**
- Portal do periódico: `https://itfcoachingreview.com/` — 🔴 **bloqueado no meu ambiente**
- Arquivo: `https://itfcoachingreview.com/index.php/journal/issue/archive`
- Também distribuído via ITF Academy: `https://www.itf-academy.com/` — 🔴 **bloqueado**

**Acesso e licença (⚠️ não confirmado por mim na fonte):**

- Open Access, **sem taxa para leitor e sem APC para autor**
- Publicação em open access desde 2009; licença indicada como **CC BY**
- ISSN impresso **2225-4757**; online EN **1812-2302**, ES **1812-2329**, FR **1812-2310**
- Indexado no DOAJ (`doaj.org/toc/2225-4757`) e no Latindex (ficha 4319)
- Trilíngue: inglês, espanhol, francês
- Números recentes localizados em busca: **Issue 95** e **Issue 96**

**Se a licença CC BY se confirmar, isto é excelente para nós** — CC BY permite uso
comercial com atribuição, ao contrário do CC BY-NC-SA do MCP. Seria a única fonte
de peso do catálogo **sem restrição comercial**.

**Veredito.** Alta prioridade de verificação humana. Potencialmente a espinha
dorsal do Tier B *e* uma saída parcial para o problema de licença. Ver § 08, item 3.

---

### 03.2 — International Journal of Racket Sports Science (IJRSS) — ⚠️ PARCIAL

**O que é.** Periódico open access da Universidade de Granada dedicado a esportes
de raquete (tênis, badminton, squash, padel).

**URLs.** `https://journal.racketsportscience.org/` e
`https://revistaseug.ugr.es/index.php/IJRSS/`

**Acesso.** Modelo **diamond open access** — sem custo para leitor **nem** para
autor. ISSN **2695-4508**. Publicado pela Editorial Universidad de Granada.

**Verificação.** Metadados por busca (portal ISSN, páginas do periódico). Não abri
artigos.

**Veredito.** Muito promissora. Escopo exatamente sobreposto ao nosso, acesso
irrestrito. Artigo relevante já identificado em § 03.5.

---

### 03.3 — Demais periódicos que publicam análise tática de tênis — ⚠️ PARCIAL

Identificados como veículos recorrentes desta literatura:

| Periódico | Editora | Acesso | Nota |
|---|---|---|---|
| International Journal of Performance Analysis in Sport (IJPAS) | Taylor & Francis | Pago | **O mais central para análise notacional.** Artigos individuais caros |
| Journal of Sports Analytics | IOS Press / SAGE | Misto | Publicou o artigo de referência sobre rally (§ 03.4) |
| PLOS ONE | PLOS | **Open access** | Publicou artigo tático relevante (§ 03.6) |
| Journal of Sports Sciences | Taylor & Francis | Pago | Análise de performance |
| Journal of Human Kinetics | Sciendo | Open access | Análise de partida |
| Statistical Analysis and Data Mining (ASA) | Wiley | Pago | Estudo seminal de Hawk-Eye (§ 03.7) |
| J. Royal Statistical Society Series A | Oxford | Misto | Rally length e características de jogador |
| Frontiers in Sports and Active Living | Frontiers | Open access | Revisões sistemáticas |
| International Journal of Sports Science & Coaching | SAGE | Pago | Método PWOL de Fitzpatrick |

**Estratégia prática recomendada:** priorizar **PLOS ONE, IJRSS, ITF CSSR,
Frontiers e Journal of Human Kinetics**, que são open access. Os artigos pagos
(IJPAS, Wiley) devem ser tratados como referência de contexto — comprar acesso
avulso só quando um achado específico for virar conteúdo `published`.

---

### 03.4 — Lisi, Grigoletto & Briglia (2024) — distribuição de duração de rally — ⚠️ PARCIAL

**Citação.** Lisi, F., Grigoletto, M., & Briglia, M. G. (2024). *On the distribution
of rally length in professional tennis matches.* **Journal of Sports Analytics**,
10(1), 105–121. DOI: `10.3233/JSA-240728`

**Verificação.** Autores, periódico, volume, páginas e DOI confirmados de forma
consistente em IOS Press, SAGE, RePEc e no repositório institucional da
Universidade de Pádua. **PDF não aberto.**

**Amostra e método (por resumo/trechos).** Usa dados do **Match Charting Project**.
Duração de rally não está disponível diretamente e foi extrapolada por código R
próprio dos autores. Reportado o uso de **5.751 partidas masculinas**, além de
partidas femininas.

**Achado.** A melhor distribuição para duração de rally é uma **Geométrica
modificada em zero e um** (*zero-one-modified Geometric*), com parâmetros que são
função da probabilidade de ganhar ponto no saque e da altura dos jogadores.
Distribuições distintas para homens e mulheres e por superfície.

**🔴 Alerta de independência.** **Este artigo usa a mesma base que o nosso Tier A.**
Ele fornece *modelagem* e *revisão por pares* sobre o dado, não uma confirmação
independente do dado. Citar Lisi et al. junto com o MCP para o mesmo número não
soma força de evidência — é a mesma medida.

---

### 03.5 — Takahashi, Okamura & Murakami — revisão sistemática — ⚠️ PARCIAL

**Citação.** Takahashi, H., Okamura, R., & Murakami, S. *Performance analysis in
tennis since 2000: A systematic review focused on the methods of data collection.*
**International Journal of Racket Sports Science**.

**URLs.** `https://journal.racketsportscience.org/index.php/ijrss/article/view/76` ·
`https://digibug.ugr.es/handle/10481/80900`

**Conteúdo (por resumo).** Recuperou **90 artigos** de análise de performance em
tênis publicados após 2000, buscando em PubMed, Web of Science e SPORTDiscus.
Classifica métodos de coleta em ativos e passivos, subdivididos em tracking,
gravação de vídeo, data mining, observação de treinadores, websites e transmissão.

**Por que importa para nós.** É **o mapa do território**. Se você for fazer uma
única leitura séria de Tier B antes de escrever conteúdo, comece por esta — ela diz
quais perguntas já foram estudadas, com que método, e onde estão os buracos.
Open access.

---

### 03.6 — Prieto-Lage et al. (2023) — probabilidade de ganhar o ponto — ⚠️ PARCIAL

**Citação.** Prieto-Lage, I., Paramés-González, A., Torres-Santos, D.,
Argibay-González, J. C., Reguera-López-de-la-Osa, X., & Gutiérrez-Santiago, A.
(2023). *Match analysis and probability of winning a point in elite men's singles
tennis.* **PLOS ONE**, 18(9), e0286076. DOI: `10.1371/journal.pone.0286076`

**Verificação.** Autores, periódico, volume, número de artigo e DOI confirmados via
PLOS, PubMed (PMID 37768928), PMC (PMC10538650) e RePEc. **PDF não aberto.**
**Open access** — o fundador consegue abrir sem pagar.

**Achados reportados (por resumo/trechos):**

- Entre **65% e 77%** dos pontos, conforme a superfície, terminam em rally curto
  (**1 a 4 golpes**).
- Com **primeiro saque + rally curto**, o sacador vence **≈80%** dos pontos.
- Com **primeiro saque + rally médio**, a probabilidade fica **equilibrada**:
  sacador entre **49% e 55%**, independentemente da superfície.

**Por que importa.** O terceiro achado é taticamente mais interessante que os dois
primeiros, e é do tipo que sustenta uma situação de produto: *a vantagem do saque
evapora quando o ponto passa da fase curta.* Isso dá base para uma situação inteira
sobre o que o devolvedor deve buscar.

**Prioridade máxima de leitura** — é open access e diretamente aplicável.

---

### 03.7 — Mecheri et al. (2016) — Hawk-Eye e impacto do saque — ⚠️ PARCIAL

**Citação.** Mecheri, S., Rioult, F., Mantel, B., Kauffmann, F., & Benguigui, N.
(2016). *The serve impact in tennis: First large-scale study of big Hawk-Eye data.*
**Statistical Analysis and Data Mining: The ASA Data Science Journal**, 9(5),
310–325. DOI: `10.1002/sam.11316`

**Verificação.** Metadados confirmados via Wiley Online Library e Semantic Scholar.
**Pago (Wiley). Não aberto.**

**Achado reportado.** As **zonas A e D** (laterais dos quadrados de saque —
aberto e no T) foram as estratégias de saque mais eficazes, com as maiores taxas
de vitória.

**Valor.** É o estudo seminal com dados de rastreamento **reais** (Hawk-Eye), não
anotação humana — portanto **genuinamente independente do MCP**. Isso o torna
valioso justamente como confirmação cruzada.

---

### 03.8 — Fitzpatrick, Stone, Choppin & Kelley (2024) — saque e devolução em Wimbledon — ⚠️ PARCIAL

**Citação.** Fitzpatrick, A., Stone, J. A., Choppin, S., & Kelley, J. (2024).
*Analysing Hawk-Eye ball-tracking data to explore successful serving and returning
strategies at Wimbledon.* **International Journal of Performance Analysis in Sport**,
24(3), 251–268. DOI: `10.1080/24748668.2023.2291238`

**Verificação.** Autores, periódico, volume, páginas e DOI confirmados via Taylor &
Francis, RePEc/IDEAS, Mendeley e o repositório institucional da Sheffield Hallam
University (`shura.shu.ac.uk/32831/`). **PDF não aberto.**
⚠️ Existe **versão de registro depositada no repositório institucional**, o que
sugere que o fundador consegue ler gratuitamente por lá — verificar.

**Amostra.** Dados Hawk-Eye de **302 partidas masculinas** e **139 femininas** de
simples, disputadas entre **2016 e 2018**. Métodos: intervalos de confiança,
qui-quadrado e partições de qui-quadrado.

**Achados reportados:**

- Para **ambos os sexos**, primeiros saques nas **áreas laterais** dos quadrados
  (Zonas A e D) foram **mais frequentes e mais eficazes** que os centrais (B e C).
- Segundos saques nas laterais **também tendem a ser mais eficazes** que os centrais —
  **mas os jogadores priorizam segurança**, tipicamente executando o segundo saque
  na **Zona C** (central, em direção ao backhand do destro).

**Por que este é um dos melhores achados do catálogo.** Ele descreve uma **lacuna
entre o que é eficaz e o que os jogadores de fato fazem**. Isso é exatamente o
formato de uma situação tática de produto: existe uma decisão dominante e uma
convenção conservadora que a contraria. Dados de rastreamento reais, revisado por
pares, **independente do MCP**, e ainda por cima converge com Mecheri et al. (2016).

---

## 04 — Tier C · Manuais de federação e livros

> Nenhum item desta seção foi aberto por mim. Todos os portais de federação
> relevantes estavam bloqueados. Selo desta seção inteira: `⚠️ PARCIAL` ou `⛔`.

### 04.1 — ITF Academy — ⚠️ PARCIAL

**URL.** `https://www.itf-academy.com/` — 🔴 **bloqueado no meu ambiente**

**Situação reportada.** A ITF liberou o acervo educacional da ITF Academy
**gratuitamente**, exigindo apenas **registro gratuito**. Reportados **mais de 340
conteúdos teóricos** (vídeos, artigos, artigos científicos), além de cursos
interativos — entre eles um chamado **"Introduction to Strategy & Tactics"**. O
e-book *Advanced Coaches Manual*, publicado em 13 idiomas, também teria sido
liberado gratuitamente.

**Veredito.** **Provavelmente a fonte Tier C de melhor custo-benefício do catálogo**
— autoridade institucional máxima, gratuita, e com material explicitamente tático.
Precisa de registro e avaliação humana. Ver § 08, item 4.

### 04.2 — Manuais ITF (Crespo, Reid et al.) — ⚠️ PARCIAL

Publicações da ITF Development Department, com autoria recorrente de **Miguel
Crespo** (research officer da ITF) e **Machar Reid**:

- *ITF Coaching Beginner and Intermediate Tennis Players* — Crespo, M. & Reid, M.
  ITF. ISBN `9781903013366`
- *ITF Advanced Coaches Manual* — ITF
- *ITF Tennis Psychology* — Crespo & Reid. ISBN `9781903013281`
- *ITF Strength and Conditioning for Tennis* — Crespo, Quinn & Reid. ISBN `9781908799227`
- Crespo, M. (1999). *The tactical approach to coaching tennis.* **ITF CSSR**, nº 19.
  (PDF localizado em `miguelcrespo.net` — 🔴 domínio bloqueado, não aberto)

**Natureza do conteúdo.** ⚠️ **Convenção pedagógica sistematizada, não evidência
quantitativa.** São manuais de formação de treinador. Muito bons no que se propõem —
vocabulário, progressão didática, taxonomia de situações — mas as afirmações
táticas geralmente **não vêm com dado, amostra ou teste**.

**Consequência direta, pela Regra 1 de `PRODUCT.md`:** conteúdo ancorado **apenas**
nestes manuais só pode ser classificado como **`situacional`** ou **`boa`**.
**Nunca `melhor` ou `ruim`.** Isso não é pedantismo — é exatamente o mecanismo que
protege a credibilidade do produto.

**Alto valor para outra coisa, porém:** estes manuais são a melhor fonte para
**estruturar a taxonomia de situações táticas** da Biblioteca. Use-os para decidir
*quais situações existem*; use o Tier A para decidir *qual decisão é melhor dentro
de cada uma*.

### 04.3 — USTA — ⚠️ PARCIAL

**URLs.** `https://www.ustacoaching.com/` · `https://www.playerdevelopment.usta.com/`

**Situação reportada.** A USTA reformulou a estrutura de educação de treinadores
("Learning Pathway", com Badges e Certifications). Há um pacote gratuito
("Baseline") e pacotes pagos a partir de **US$ 49/ano**. Parte do material exige
conclusão do programa **Safe Play** para acesso. Boa parte do acervo público é
**técnico** (ex.: documento "Grip, Preparation and Swing Path") — **fora do nosso
escopo**, que é decisão tática, não técnica de golpe.

**Veredito.** Prioridade média. Barreira de acesso real (registro + possível
pagamento) e foco técnico predominante.

### 04.4 — USTA, *Tennis Tactics: Winning Patterns of Play* — ⚠️ PARCIAL

**Citação.** United States Tennis Association (1996). *Tennis Tactics: Winning
Patterns of Play.* Human Kinetics. ISBN `9780880114998`. Prefácio de Jim Courier.

**Conteúdo reportado.** **58 padrões** — sequências repetidas de golpes — e **63
exercícios** para treiná-los. Descrito como **baseado num estudo extenso da USTA
sobre jogo de torneio real dos melhores atletas**.

**Por que merece atenção especial.** É **o item Tier C que mais se aproxima de
Tier B**, porque alega base empírica própria. E a estrutura — "padrões" como
unidade de conteúdo — é **quase isomórfica ao modelo de situação do PDA Point**.

**⚠️ Ressalvas sérias.** (a) É de **1996** — o tênis mudou materialmente desde
então (raquetes, cordas, físico, velocidade de quadra). (b) A alegação de "estudo
extenso da USTA" precisa ser conferida **dentro do livro**: existe metodologia
descrita? amostra? ou é só uma frase de contracapa? **Isso decide se o livro é
Tier C ou se pode subir para Tier B.**

Ver § 08, item 5.

### 04.5 — Antoun, *Women's Tennis Tactics* — ⚠️ PARCIAL

**Citação.** Antoun, R. (2007). *Women's Tennis Tactics.* Human Kinetics.
ISBN `9780736065726` (reedições `9781450403535`, `9781492574644`).

**Credenciais do autor (reportadas).** Treinador de tênis feminino de elite,
tutor de formação de treinadores credenciado pela LTA.

**Conteúdo.** Táticas para jogadoras, com **68 exercícios**. Disponível também em
empréstimo digital no Internet Archive (`archive.org/details/womenstennistact0000anto`).

**Veredito.** Tier C legítimo. Credencial verificável, editora séria (Human
Kinetics). Útil se e quando houver trilha feminina específica. Sem indicação de
base quantitativa própria.

### 04.6 — Gilbert & Jamison, *Winning Ugly* — ⚠️ PARCIAL

**Citação.** Gilbert, B. & Jamison, S. (1993/1994). *Winning Ugly: Mental Warfare
in Tennis — Lessons from a Master.* Simon & Schuster / Fireside.
ISBN `9780671884000`.

**Credenciais.** Brad Gilbert: ex-top 5 do ATP, treinador de Agassi, Roddick e
Murray. Trajetória inquestionável.

**Natureza do conteúdo.** ⛔ **Experiência pessoal e tática mental — não evidência.**
Livro excelente, e endereçado justamente ao jogador recreativo (nosso público), mas
**sem qualquer base quantitativa**.

**Veredito.** **Não usar como fonte de classificação de decisão.** Pode inspirar
*quais situações* modelar e *como falar* com o usuário — o tom de "treinador
experiente" de `PRODUCT.md § 01` é muito próximo do dele. Mas nenhuma tática entra
em `published` citando *Winning Ugly*.

### 04.7 — PTR e RSPA (ex-USPTA) — ⚠️ PARCIAL

**Correção importante de nomenclatura.** A tarefa mencionava "PTA". As duas
entidades certificadoras relevantes nos EUA são:

- **PTR** — Professional Tennis Registry
- **RSPA** — Racquet Sports Professionals Association. **A USPTA (United States
  Professional Tennis Association) foi rebatizada como RSPA em 16–17 de setembro de
  2024**, ampliando o escopo para pickleball, padel, squash e platform tennis.
  URL: `https://rspa.net/`

**Veredito.** Baixa prioridade. Material majoritariamente restrito a membros
pagantes e voltado a **certificação e negócio de ensino**, não a evidência tática
publicada. Não investir tempo aqui antes de esgotar ITF e USTA.

### 04.8 — CBT (Confederação Brasileira de Tênis) — ⛔ NÃO VERIFICADO

**URLs candidatas.** `https://www.cbtenis.com.br/coachtraining/home` ·
`https://cbt-tenis.com.br/`

**O que encontrei.** Quase nada de útil. A busca é fortemente poluída pela
**CBTM (Confederação Brasileira de Tênis de Mesa)**, que tem presença digital muito
mais organizada. Há indicação de que a CBT oferece cursos de formação de
treinadores, mas **não localizei nenhuma publicação técnica ou tática pública**.

**Veredito.** ⛔ **Não conte com a CBT como fonte de evidência.** Pode ter valor
institucional para o mercado brasileiro (parceria, chancela, distribuição), o que é
uma conversa de negócio — **não de conteúdo**. Se houver material tático publicado,
ele não está indexado de forma acessível.

---

## 05 — Tier D · Análise pública de especialista

### 05.1 — Craig O'Shannessy / Brain Game Tennis — ⚠️ PARCIAL

**URL.** `https://braingametennis.com/`

#### Credenciais — o que consegui apurar

| Alegação | Status |
|---|---|
| Integrou a equipe de Novak Djokovic, **2017–2019**, como analista de estratégia | ⚠️ **Consistente em múltiplas fontes independentes** — página do próprio Brain Game Tennis ("Team Djokovic 2017-2019"), Tennis.com, Tennis World USA (noticiando a separação ao fim de 2019), imprensa australiana (dez/2017). **Não confirmei em fonte primária** (ex.: comunicado oficial de Djokovic ou da ATP) |
| Analista oficial de torneio para **Wimbledon** e **Australian Open** | ⚠️ Reportado. Não confirmado em fonte primária |
| Analista de estratégia do **ATP Tour** | ⚠️ Reportado. Não confirmado em fonte primária |
| Palestrante da **MIT Sloan Sports Analytics Conference** | ⚠️ Existe página dele no site da conferência (`sloansportsconference.com/people/craig-oshannessy`). Não abri |
| Publicou no **The New York Times** | ⚠️ Reportado. Não verificado |

**Nota de honestidade.** O papel exato — "analista de estratégia" versus
"treinador" — importa para como você o descreve publicamente. As fontes que
encontrei usam consistentemente **strategy analyst / strategy coach**, não head
coach. **Descreva-o assim.**

#### A questão que realmente importa: ele divulga os dados?

**Achado central:** ⚠️ **Não de forma auditável.** As análises do Brain Game Tennis
são publicadas com **números**, mas tipicamente **sem amostra declarada, sem
metodologia e sem dado bruto disponível**. Não encontrei nenhuma publicação em que
ele libere o dataset ou descreva o procedimento de forma replicável.

Um exemplo bem documentado do problema: a afirmação mais famosa dele — **"70% dos
pontos terminam em até 4 golpes"** — origina-se de análise de 2015 (US Open 2015:
71% masculino, 66% feminino). E há registro, atribuído a ele mesmo, de que a
segmentação de rally usada pelos torneios (0–4 / 5–8 / 9+) era **enganosa**, porque
media a duração do rally pela bola quicando na quadra e não pela bola tocando as
cordas.

Ou seja: **a métrica mais citada do tênis tático carrega uma ambiguidade de
definição admitida na origem.** Isso é exatamente o tipo de coisa que o PDA Point
existe para não repetir.

#### Veredito

Consistente com `PRODUCT.md § 00.1`: **Tier D — apenas complementa, nunca sustenta
sozinha.** E aqui a regra tem uma aplicação prática valiosa: quase todas as
afirmações dele são **verificáveis contra o MCP**, que é público. Fizemos isso
nesta pesquisa — ver § 06.1, achados 5 e 6, onde os meus cálculos independentes
convergem fortemente com números atribuídos a ele.

**Padrão de uso recomendado:** use O'Shannessy para **descobrir hipóteses**;
verifique cada uma contra o MCP; **cite o MCP**, não ele. Se um número dele não
reproduzir no MCP, descarte.

### 05.2 — Outros nomes desta categoria

- **Jeff Sackmann** (blog *Heavy Topspin*, em tennisabstract.com) — 🔴 bloqueado.
  Diferente de O'Shannessy num ponto decisivo: **ele publica o dado que usa.**
  É simultaneamente Tier A (dado) e Tier D (interpretação). Quando ele interpreta,
  é Tier D; mas a interpretação é auditável, o que é raro.
- **Tennis Analytics** (`tennisanalytics.net`) — reportada parceria com Brain Game
  Tennis. Serviço comercial de análise de vídeo. ⛔ Não verificado.
- **Matt's Point** (`mattspoint.com`) — apareceu em busca com análise crítica sobre
  duração de rally, aparentemente contrapondo a narrativa dominante. ⛔ Não
  verificado, mas **potencialmente interessante justamente por ser contraditório**.

---

## 06 — Achados citáveis

Esta seção está deliberadamente dividida. **A metade 06.1 é forte. A metade 06.2 é
frágil.** Não misture.

### 06.1 — Achados que EU calculei a partir dos dados primários — ✅ VERIFICADO

Os sete achados abaixo foram computados por mim, em 2026-08-18, diretamente sobre
os arquivos do Match Charting Project baixados de `raw.githubusercontent.com`.
São **reproduzíveis**: qualquer pessoa com os mesmos CSVs chega aos mesmos números.

**Citação-base para todos:** Sackmann, J. *The Match Charting Project.*
`https://github.com/JeffSackmann/tennis_MatchChartingProject`.
Licença CC BY-NC-SA 4.0. Dados acessados em 2026-08-18.
**Cálculo próprio do PDA Point.**

> 🔴 **Lembrete de licença.** Publicar estes números num produto comercial exige
> resolver § 02.1 primeiro.

---

#### Achado 1 — A maioria esmagadora dos pontos termina cedo

Arquivo: `charting-{m,w}-stats-Rally.csv`

| Duração do rally | Masculino | Feminino |
|---|---:|---:|
| **1–3 golpes** | **59,4%** | **55,5%** |
| 4–6 golpes | 22,0% | 24,7% |
| 7–9 golpes | 9,8% | 11,4% |
| 10+ golpes | 8,8% | 8,5% |
| **Amostra (pontos)** | **1.272.329** | **565.897** |

**Definição — leia com atenção.** No MCP, **o saque conta como golpe 1**. Portanto
"1–3 golpes" = ponto decidido no saque, na devolução, ou no golpe seguinte ao saque
(serve+1). **Isto não é a mesma métrica que o "0–4 shots" popularizado por
O'Shannessy**, que usa outra convenção de contagem. Some 1–3 e 4–6 e você tem
81,4% (masc.) / 80,2% (fem.) em até 6 golpes.

**Uso no produto.** Sustenta a priorização de conteúdo: situações de início de
ponto (saque, devolução, serve+1) merecem a maior fatia da Biblioteca. Força
suficiente para classificação `melhor`/`ruim`.

---

#### Achado 2 — O saque decide, mas menos do que parece

Arquivo: `charting-{m,w}-stats-ServeBasics.csv`

| | Masculino | Feminino |
|---|---:|---:|
| Pontos de saque vencidos (total) | **64,1%** | **56,9%** |
| — no 1º saque | **72,0%** | **63,8%** |
| — no 2º saque | **51,0%** | **45,4%** |
| Aces (sobre 1º saque) | 12,8% | 6,3% |
| Pontos de saque vencidos em ≤3 golpes | 35,6% | 28,1% |
| Amostra (pontos de saque) | 1.272.186 | 566.097 |

**A leitura tática interessante:** no 2º saque, o sacador masculino vence 51,0% —
praticamente uma moeda. No feminino, **45,4%: o devolvedor é favorito.** Isso
inverte a intuição comum de que "quem saca manda". Excelente base para uma situação
de produto sobre agressividade na devolução do 2º saque.

---

#### Achado 3 — Serve+1: o forehand vale ~6 pontos percentuais

Cálculo próprio a partir do arquivo bruto `charting-m-points-2020s.csv`
(547.478 pontos, masculino, década de 2020). Escrevi um parser da notação MCP
para extrair o **terceiro golpe do ponto** (saque → devolução → serve+1).

| Serve+1 | Amostra | Sacador vence |
|---|---:|---:|
| **Forehand** | 212.071 | **55,7%** |
| **Backhand** | 105.615 | **49,2%** |
| | | **Δ = 6,5 p.p.** |

Fração de serve+1 jogados de forehand: **66,8%**.

**Validação cruzada.** Um número amplamente citado na literatura popular é
"57,5% forehand vs 50,9% backhand" (Δ = 6,6 p.p.). Meu cálculo, sobre um recorte
diferente (só masculino, só anos 2020), reproduz **a mesma diferença** (6,5 p.p.)
com níveis absolutos ligeiramente menores. **Convergência forte.**

**🔴 Confundidor que você precisa declarar.** Isto **não** prova que "escolher
forehand é melhor". O sacador joga de backhand principalmente **quando a devolução
o obrigou a isso**. A variável escondida é a qualidade da devolução. O achado
correto é descritivo: *pontos em que o sacador consegue jogar o serve+1 de forehand
são vencidos com mais frequência* — o que sustenta a tática de **posicionar-se e
sacar para criar o forehand**, não de "preferir forehand" com a bola já vindo.

---

#### Achado 4 — Profundidade da devolução tem efeito grande e monotônico

Arquivo: `charting-{m,w}-stats-ReturnOutcomes.csv`.
Códigos de profundidade validados por mim contra `ReturnDepth.csv` e contra a aba
`Instructions` da planilha oficial.

**Taxa de vitória do DEVOLVEDOR, considerando devoluções colocadas em jogo:**

| Profundidade da devolução | Masculino | Feminino |
|---|---:|---:|
| **Curta** (dentro dos quadrados de saque) | **42,8%** | **47,3%** |
| **Profunda** (atrás da linha de saque) | **50,4%** | **54,0%** |
| **Muito profunda** (perto da linha de fundo) | **54,6%** | **57,6%** |
| | Δ = **+11,8 p.p.** | Δ = **+10,3 p.p.** |

Amostras (masc.): 199.752 curtas · 562.668 profundas · 197.715 muito profundas.

Referência: vs 1º saque o devolvedor vence 44,3% (masc.); vs 2º saque, 53,1%.

**Este é provavelmente o melhor achado do catálogo para o nosso produto.**
Gradiente limpo, monotônico, amostra enorme, efeito grande (>10 p.p.), e **é uma
decisão que o jogador recreativo controla diretamente**. Sustenta com folga uma
classificação `melhor`/`ruim`.

**Ressalva.** Devolução profunda também é consequência de saque mais fraco.
Parte do efeito é reverso. Mas a magnitude e a monotonia tornam implausível que
seja *só* isso.

---

#### Achado 5 — Rede: ~67% de aproveitamento

Arquivo: `charting-{m,w}-stats-NetPoints.csv`

| | Masculino | Feminino |
|---|---:|---:|
| Pontos ganhos na rede | **67,2%** | **67,0%** |
| — winner na rede | 32,3% | 43,4% |
| — erro não forçado na rede | 10,3% | 11,9% |
| — passado (passing winner do adversário) | 12,1% | 13,0% |
| Após shot de aproximação | 67,0% | 64,6% |
| Amostra (pontos na rede) | 387.137 | 104.841 |

**Validação cruzada dupla.** (a) O número mais citado do Brain Game Tennis é
**66% na rede** — meu cálculo dá 67,2%. (b) Uma análise de WTA em circulação
reporta *12% passing winner, 5% forced error induzido, 12% erro não forçado na
rede* — meus números femininos: **13,0% passado, 11,9% erro não forçado**.
Praticamente idênticos, o que indica que aquela análise usa o mesmo MCP.

**🔴 Viés de seleção grave, obrigatório declarar.** Jogadores sobem à rede
**quando já estão em vantagem** (bola curta, adversário deslocado). Os 67% medem
*o desfecho de situações favoráveis que terminaram na rede*, **não** o efeito
causal de subir. Comparar "67% na rede" com "~50% no fundo" e concluir "suba mais"
é **falacioso**. O conteúdo precisa enquadrar isto como: *quando a situação
autoriza a aproximação, finalizá-la na rede converte bem.*

Lembre também que a marcação de aproximação (`+`) é opcional e "lowest priority" no
manual — **os totais de aproximação provavelmente subestimam a realidade**.

---

#### Achado 6 — Direção da bola: paralela produz mais winners E mais erros

Arquivo: `charting-{m,w}-stats-ShotDirOutcomes.csv`.
Rótulos derivados pelo próprio Sackmann: XC = crosscourt, DTL = down the line,
DTM = down the middle, IO = inside-out, II = inside-in.

**Masculino:**

| Direção | Golpes | Winner % | Erro n/forçado % | Erro forçado induzido % | Pontos ganhos % |
|---|---:|---:|---:|---:|---:|
| Forehand crosscourt | 607.519 | 7,52 | 10,02 | 6,80 | **54,3** |
| Forehand paralela | 185.261 | **12,02** | **14,55** | 7,57 | 53,3 |
| Forehand inside-out | 372.698 | 10,06 | 11,69 | 7,66 | **56,9** |
| Forehand pelo meio | 315.707 | 0,69 | 7,26 | 1,34 | **45,8** |
| Backhand crosscourt | 568.987 | 3,33 | 8,86 | 3,76 | 50,6 |
| Backhand paralela | 160.153 | **13,82** | **18,98** | 8,36 | 51,5 |
| Backhand inside-out | 58.293 | 9,88 | 16,63 | 7,02 | 52,3 |
| Backhand pelo meio | 336.391 | 0,34 | 7,30 | 1,20 | **45,4** |

**Feminino** (mesma estrutura, valores próximos): FH XC 53,3% · FH DTL 53,3% ·
FH IO 56,5% · FH meio 45,6% · BH XC 51,5% · BH DTL 53,5% · BH meio 45,6%.

**Três leituras taticamente valiosas:**

1. **A paralela é uma troca, não uma melhoria.** Backhand paralela: winner 13,82%
   (4× o crosscourt) **mas** erro não forçado 18,98% (mais que o dobro). Resultado
   líquido em pontos ganhos: 51,5% vs 50,6%. **Quase empate.** Isto desmonta tanto
   o "nunca jogue paralela" quanto o "ataque na paralela" — a resposta honesta é
   `situacional`, e agora com número.
2. **Jogar pelo meio é claramente pior.** ~45,5% de pontos ganhos em ambos os
   gêneros, com winner rate praticamente nulo. Consistente, grande amostra,
   diferença de ~9 p.p. **Este sustenta `ruim`.**
3. **Inside-out forehand é a melhor direção medida** (56,9% masc., 56,5% fem.) —
   mas é a direção mais seletiva de todas (só se joga quando dá para contornar).

**🔴 Ressalva estrutural.** Estes são desfechos **por golpe**, não experimentos.
Jogadores escolhem a paralela quando já estão em posição de atacar. Some isto ao
viés de campo opcional descrito em § 02.1 e o resultado é: **use estes números para
sustentar `situacional`/`boa`, e reserve `melhor`/`ruim` para o caso 2 (pelo meio),
que é o único com margem grande e consistente.**

---

#### Achado 7 — Cobertura por jogador para atribuição individual

Ver a tabela completa em § 02.1. Sustenta diretamente a Regra 3 de `PRODUCT.md`
(atribuição factual a profissionais), **com o limite explícito de que Bia Haddad
Maia (17 partidas) não tem amostra para atribuição individual.**

---

### 06.2 — Achados da literatura — ⚠️ PARCIAL (não li os PDFs)

Reproduzidos aqui **apenas como pistas de investigação**, não como material
publicável. Cada um exige que o fundador abra a fonte antes de virar conteúdo.

| Achado | Fonte | Status |
|---|---|---|
| 65–77% dos pontos terminam em 1–4 golpes (varia por superfície) | Prieto-Lage et al. (2023), PLOS ONE 18(9):e0286076 | ⚠️ Open access — **leia primeiro** |
| 1º saque + rally curto → sacador vence ≈80% | idem | ⚠️ |
| 1º saque + rally médio → equilíbrio (sacador 49–55%) | idem | ⚠️ **O achado mais interessante do lote** |
| Saques nas zonas laterais (A e D) são mais eficazes que centrais, em ambos os sexos | Fitzpatrick et al. (2024), IJPAS 24(3):251–268 | ⚠️ Pago; versão no repositório da Sheffield Hallam |
| Jogadores priorizam segurança no 2º saque (Zona C), contrariando a eficácia | idem | ⚠️ **Formato perfeito de situação tática** |
| Zonas A e D com maiores taxas de vitória (Hawk-Eye, larga escala) | Mecheri et al. (2016), SADM 9(5):310–325 | ⚠️ Pago (Wiley). Independente do MCP |
| Duração de rally segue Geométrica modificada em zero-e-um | Lisi et al. (2024), JSA 10(1):105–121 | ⚠️ **Deriva do MCP — não é confirmação independente** |
| 90 artigos de análise de performance em tênis desde 2000 | Takahashi et al., IJRSS | ⚠️ Open access — **mapa do território** |

---

## 07 — Lacunas e limites da evidência

Esta seção é a mais importante do documento. Ela define o teto de honestidade do
produto.

### 07.1 — A lacuna jurídica

A melhor fonte que temos **proíbe uso comercial**. Enquanto isso não for resolvido,
o PDA Point tem uma escolha entre três caminhos, e nenhum é indolor:

1. **Negociar licença comercial com Jeff Sackmann.** Viável — ele é titular único
   dos direitos (§ 02.1). É o caminho correto. Também é o único que preserva o
   discurso de integridade da marca.
2. **Construir base própria de anotação.** A notação MCP é pública e documentada
   (eu extraí a legenda inteira). Nada impede o PDA Point de anotar suas próprias
   partidas. Custo: milhares de horas-pessoa. Vantagem: **ativo proprietário, e
   possibilidade de anotar tênis recreativo** — o que resolveria simultaneamente a
   lacuna 07.3, que é a mais grave.
3. **Restringir-se a Tier B/C com licença permissiva.** ITF CSSR (se CC BY se
   confirmar) e IJRSS (diamond OA) permitiriam uso comercial. Mas a densidade de
   achados táticos utilizáveis cai drasticamente — perde-se todo o § 06.1.

### 07.2 — A lacuna de causalidade

**Nenhuma fonte deste catálogo é experimental.** Não existe estudo em que jogadores
tenham sido aleatoriamente designados a jogar crosscourt ou paralela na mesma
situação. Tudo é observacional.

Isto já estava previsto em `PRODUCT.md § 00.1` ("a literatura é fraca em evidência
experimental e forte em evidência estatística"), e a pesquisa **confirma
integralmente** esse diagnóstico. Reforço o que decorre disso:

- Todo número deste catálogo mede **desfecho condicionado à escolha do jogador**,
  não **efeito da escolha**.
- Toda escolha é confundida por **por que o jogador a fez** — geralmente porque a
  bola anterior permitia.
- Os verbos do conteúdo devem refletir isso: *"jogadores de alto nível vencem X%
  dos pontos quando..."* e **nunca** *"jogar X faz você vencer mais"*.

### 07.3 — 🔴 A lacuna do usuário recreativo — a mais grave do produto

**Busquei especificamente e não encontrei nenhuma base de dados shot-by-shot de
jogadores recreativos ou intermediários.** Também não encontrei estudos de análise
notacional com essa população. A revisão sistemática de Takahashi et al. (90
artigos desde 2000) aparentemente não sinaliza esse corpo de literatura.

**Absolutamente tudo em § 06.1 vem de tênis profissional.** O nosso usuário-alvo,
segundo `PRODUCT.md`, é recreativo/intermediário.

**Por que isso não é um detalhe.** Há razões concretas para suspeitar que padrões
profissionais não transferem:

- **A distribuição de duração de rally quase certamente é outra.** No profissional,
  o rally curto é dominado por saque potente e devolução agressiva. No recreativo,
  o saque é muito mais fraco — o que empurra os pontos para rallies mais longos,
  invertendo a premissa do Achado 1.
- **A taxa de erro não forçado é muito maior no recreativo.** Isso muda o cálculo
  de risco de toda decisão agressiva. A paralela (Achado 6), que no profissional é
  quase empate, pode ser claramente ruim no recreativo — ou o contrário, se o
  adversário não tiver cobertura de quadra.
- **O jogo de rede (Achado 5) é o caso mais perigoso.** No recreativo, tanto a
  qualidade do voleio quanto a do passing shot são muito menores. Os 67% podem
  ser maiores (adversário não passa) ou muito menores (voleio falha). **Não temos
  como saber.**
- **A vantagem do saque (Achado 2) quase certamente é menor**, o que muda a
  assimetria saque/devolução que estrutura boa parte do conteúdo.

**Recomendação dura.** Considere que a validade externa dos achados profissionais
para o público recreativo é **desconhecida, não presumida**. Concretamente:

- Nenhuma tática deveria ser classificada `melhor`/`ruim` **apenas** por evidência
  profissional, **quando houver razão específica para suspeitar de não-transferência**
  (jogo de rede é o caso mais claro).
- O produto deve declarar a origem da evidência ao usuário. Isso é honestidade
  **e** diferencial: "isto é o que o profissional faz" é uma proposta legítima e
  interessante; "isto é o que você deve fazer" é uma promessa que a evidência não
  cobre.
- A `Regra 1` de `PRODUCT.md` precisa de um **eixo adicional**: além de *força da
  fonte*, considerar *distância entre a população da fonte e o usuário*. Sugestão de
  ADR em § 08, item 7.

### 07.4 — A lacuna de independência entre tiers

Confirmado: **Lisi et al. (2024), publicado em periódico revisado por pares, usa
dados do MCP.** Tennis Abstract é o mesmo autor e a mesma base. As análises do
Brain Game Tennis reproduzem números que batem quase exatamente com os meus
cálculos sobre o MCP (§ 06.1, achados 5 e 6) — indicando origem comum.

**Ou seja: Tier A, boa parte do Tier B, e boa parte do Tier D podem ser a mesma
evidência.**

**Implicação para o modelo de tiers de `PRODUCT.md`:** empilhar fontes de tiers
diferentes **não aumenta a força** se elas compartilharem a base. O sistema de
conteúdo deveria registrar, por tática, **a base de dados subjacente**, não só o
tier da citação.

As exceções genuinamente independentes que identifiquei são as baseadas em
**Hawk-Eye**: Mecheri et al. (2016) e Fitzpatrick et al. (2024). Por isso elas valem
desproporcionalmente mais do que sugere seu tier — **é onde vale gastar dinheiro de
acesso pago.**

### 07.5 — Perguntas táticas SEM respaldo quantitativo

Estas são perguntas que uma plataforma de decisão tática naturalmente quer
responder, e para as quais **este catálogo não oferece base**. Listadas para que
não sejam prometidas:

- **Altura e margem sobre a rede.** Não existe nos dados. Toda orientação sobre
  "jogar com margem" é convenção Tier C.
- **Efeito/spin.** O MCP distingue apenas groundstroke vs slice. Nada de topspin,
  rotação, kick.
- **Posição do jogador no impacto.** Só a distinção binária fundo/rede.
- **Velocidade da bola.** Ausente.
- **Estado de equilíbrio/deslocamento do adversário.** Ausente. **Este é o mais
  doloroso**, porque é a variável central de quase toda decisão tática real —
  "o adversário está aberto?" — e não existe nenhuma codificação dela.
- **Tempo de recuperação entre golpes.** Ausente.
- **Padrões de duplas.** O MCP é essencialmente simples. `PRODUCT.md § 02` prevê
  filtro simples/duplas na Biblioteca — **o conteúdo de duplas não tem base Tier A.**
  Terá que ser Tier C, e portanto limitado a `situacional`/`boa`.
- **Tática por nível de jogador.** Ver § 07.3.
- **Efeito de superfície.** Tecnicamente presente no MCP, mas com amostra
  desbalanceada (Hard 4.850 vs Grass 837 no masculino). `PRODUCT.md § 00.3` já
  decidiu tratar superfície como tema visual — **a pesquisa apoia essa decisão**,
  agora por motivo de evidência e não só de custo editorial.

### 07.6 — Limites de qualidade do próprio dado

- **Anotação humana a partir de TV**, não instrumentação. Sujeita a erro,
  ângulo de câmera, cortes de transmissão.
- **Forçado vs não-forçado é julgamento subjetivo**, e o manual admite que é
  *"always a prickly subject"*.
- **Direção, profundidade e posição são campos opcionais** → subconjuntos
  enviesados (§ 02.1).
- **Incompletude assumida** pelo autor (*"95% is way better than nothing"*).
- **Sem controle inter-anotador publicado** que eu tenha localizado.
- **Registros malformados** existem nos CSVs.
- **Viés de seleção de partidas:** voluntários anotam o que gostam de assistir →
  superrepresentação de estrelas, Grand Slams e quadra rápida. Federer tem 723
  partidas e Haddad Maia tem 17 — isso não reflete importância, reflete quem os
  voluntários assistem.

---

## 08 — ⛔ Pendências que o fundador precisa verificar pessoalmente

Ordenado por impacto. Itens 1–3 são bloqueadores.

**1. 🔴 BLOQUEADOR — Licença comercial do Match Charting Project.**
Contatar Jeff Sackmann (`jeffsackmann@gmail.com`, e-mail que consta na aba
`Instructions` da planilha oficial) e negociar licença comercial explícita.
Argumentos a favor: existe titular único (§ 02.1), o uso é educacional, e a
atribuição visível é do interesse dele. **Nada de § 06.1 pode ir para produção
antes disso.** Se a resposta for não, os caminhos 2 e 3 de § 07.1 passam a ser as
únicas opções e isso muda o plano de produto.

**2. Status dos repositórios `tennis_atp` / `tennis_wta` / `tennis_slam_pointbypoint`.**
Abrir `github.com/JeffSackmann?tab=repositories` num navegador comum e confirmar
o que existe. Meu ambiente retornou 404 nos raw e "Repositories 1" no perfil (§ 02.3),
mas não obtive confirmação direta. Impacto baixo para tática, relevante para
metadados.

**3. ITF Coaching & Sport Science Review — confirmar a licença.**
Abrir `https://itfcoachingreview.com/index.php/journal/about` e verificar **se a
licença é mesmo CC BY**. Se for, esta é a única fonte de peso do catálogo com uso
comercial permitido, e sobe imediatamente na prioridade editorial. Conferir também
o arquivo (`/issue/archive`) e mapear quais números trazem análise tática. Meu
ambiente bloqueou o domínio inteiro.

**4. ITF Academy — registrar e inventariar.**
`https://www.itf-academy.com/`. Registro gratuito. Avaliar especificamente o curso
*"Introduction to Strategy & Tactics"* e o *Advanced Coaches Manual*, e verificar
os termos de uso do material (gratuito para ler ≠ licenciado para reutilizar em
produto comercial — **cheque isso explicitamente**).

**5. USTA *Tennis Tactics* (1996) — auditar a alegação de base empírica.**
Conseguir o livro e verificar **dentro dele**: o "estudo extenso da USTA" tem
metodologia descrita, amostra, período? Se sim, **o livro pode subir para Tier B** e
seus 58 padrões viram matéria-prima direta de situações. Se for só marketing de
contracapa, permanece Tier C e portanto teto `situacional`/`boa`.

**6. Credenciais de Craig O'Shannessy — fonte primária.**
Encontrar confirmação primária do vínculo com Djokovic 2017–2019 (comunicado
oficial, entrevista do próprio Djokovic, ou perfil oficial ATP/Wimbledon). Múltiplas
fontes secundárias concordam, mas `PRODUCT.md § 00.1` exige fonte primária.
**Descrevê-lo como "analista de estratégia", não "treinador".**

**7. ADR necessária — validade externa da evidência profissional.**
`PRODUCT.md § 00.1 Regra 1` limita a classificação pela **força da fonte**. A
pesquisa mostra que falta um segundo eixo: a **distância entre a população da fonte
e o usuário** (§ 07.3). Proposta: nenhuma tática atinge `melhor`/`ruim` quando (a) a
evidência é exclusivamente profissional **e** (b) há razão específica para suspeitar
de não-transferência para o nível recreativo. Isto merece ADR própria porque
altera a regra de classificação.

**8. Ler, na ordem, os três artigos open access:**
Takahashi et al. (IJRSS, mapa do território) → Prieto-Lage et al. (PLOS ONE,
achados diretamente aplicáveis) → Fitzpatrick et al. (versão do repositório da
Sheffield Hallam, `shura.shu.ac.uk/32831/`). Confirmar se os números de § 06.2
realmente constam nos textos.

**9. Verificar as fontes bloqueadas no meu ambiente.**
`tennisabstract.com` (blog *Heavy Topspin* e relatórios de partida) e
`mattspoint.com` (análise aparentemente crítica sobre duração de rally — vale
justamente por divergir).

**10. Decidir sobre base própria de anotação.**
A notação MCP é pública e está integralmente documentada (extraí a legenda completa —
§ 02.1). Anotar partidas **recreativas** com essa notação resolveria a lacuna mais
grave do produto (§ 07.3) e criaria ativo proprietário sem problema de licença.
Custo alto, valor estratégico alto. Decisão de negócio, não de conteúdo.

---

## 09 — Recomendação operacional final

**O que dá para publicar assim que a licença for resolvida:**
os Achados 1, 2 e 4 de § 06.1 (duração de rally, economia do saque, profundidade de
devolução). São grandes, limpos, com amostras enormes, e o Achado 4 tem a virtude
rara de ser **uma decisão que o jogador recreativo controla**.

**O que publicar com enquadramento cuidadoso:**
Achados 3, 5 e 6 (serve+1, rede, direção). Taticamente ricos, mas todos carregam
viés de seleção que precisa ser declarado no texto. Dentro deles, apenas
"jogar pelo meio é pior" (Achado 6, leitura 2) tem margem para `ruim`.

**O que não publicar ainda:**
qualquer coisa de § 06.2 antes de abrir o PDF. Qualquer coisa de duplas. Qualquer
coisa dependente de posição de quadra, spin, altura, ou estado do adversário.

**A frase que resume a pesquisa:**
o PDA Point pode ser construído sobre evidência real — mas ela é **uma base só**,
**licenciada contra uso comercial**, **observacional e não causal**, e **derivada
de jogadores que não são os nossos usuários**. Cada uma dessas quatro coisas tem
encaminhamento possível, e todas as quatro precisam de decisão explícita antes de
o conteúdo escalar.
