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
01 — Brand System                    ✅ fechado
02 — Information Architecture        🔜 em andamento
03 — Core Experience Specification
04 — Golden Scenario 001
05 — Mobile Wireframes
06 — Tactical Content System
07 — Technical Handoff / Agent Spec
08 — Validation Plan
```

Os documentos técnicos e de visão original que originaram este arquivo continuam
como referência histórica, mas este arquivo é o que deve ser lido primeiro.

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

*(em andamento)*
