---
title: "PDA Point — Proteção de Dados"
status: "Postura atual e requisitos para as fases futuras"
language: "pt-BR"
---

# Proteção de Dados

Documento de referência para LGPD (Lei 13.709/2018) e, quando o produto atender
usuários fora do Brasil, GDPR.

## 1. Situação atual — nenhum dado pessoal é tratado

A aplicação publicada hoje é HTML estático. Ela **não coleta, não armazena e não
transmite nenhum dado pessoal**.

| Vetor | Estado |
|---|---|
| Formulários | Não existem |
| Contas / login | Não existe |
| Cookies | Nenhum |
| `localStorage` / `sessionStorage` | Não utilizado |
| Analytics / pixels | Nenhum |
| Fontes ou scripts de terceiros | Nenhum — tudo é servido do próprio domínio |
| Requisições de rede em runtime | Nenhuma |
| Logs de servidor | Apenas os do provedor de hospedagem, fora do nosso controle |

Consequência: no estado atual não há tratamento de dados pessoais, portanto não
há necessidade de base legal, de política de privacidade ou de encarregado.

**Isto deixa de ser verdade no momento em que qualquer item da seção 3 entrar.**

## 2. Dados de terceiros no repositório

O repositório é público. Aplicam-se duas regras:

1. **Não republicar dado pessoal de terceiros.** Endereços de e-mail, telefones
   ou qualquer identificador de pessoas físicas não vão para os documentos,
   mesmo quando estejam publicamente disponíveis na origem. Referencie a fonte,
   não o dado.

2. **Nomes de atletas** são citados de forma descritiva e factual, sempre
   ancorados em evidência publicada (`PRODUCT.md` § 00.1, Regra 3). Não há
   afiliação nem endosso, e não se usa imagem, logo ou marca de atletas,
   torneios ou federações.

## 3. Requisitos antes de coletar qualquer dado

O documento de produto prevê contas, perfil de jogador, histórico de tentativas,
score e analytics. Nada disso pode ser implementado sem que os itens abaixo
estejam prontos **antes** da primeira coleta.

### 3.1 Base legal por finalidade

Cada finalidade precisa da sua base legal declarada. Não existe "base legal do
produto" — existe base legal por finalidade.

| Finalidade | Base legal provável | Observação |
|---|---|---|
| Criar e manter conta | Execução de contrato (art. 7º, V) | |
| Salvar histórico e score | Execução de contrato | Essencial ao serviço contratado |
| Enviar comunicação de marketing | **Consentimento** (art. 7º, I) | Opt-in separado, revogável |
| Analytics de produto | Legítimo interesse (art. 7º, IX) | Exige avaliação de impacto e opt-out |
| Vínculo professor–aluno | Consentimento do titular | O aluno precisa consentir com o acesso do professor |

### 3.2 Minimização

Coletar apenas o necessário para a finalidade declarada. Especificamente:

- não coletar data de nascimento se a faixa etária basta;
- não coletar localização;
- não coletar CPF — não há finalidade que o justifique no produto atual;
- perfil tenístico é dado de preferência, não dado sensível, mas ainda assim é
  dado pessoal quando vinculado a uma conta.

### 3.3 Menores de idade

O público de tênis inclui menores. Dado de criança e adolescente tem regime
próprio (art. 14 da LGPD): tratamento no melhor interesse, e para crianças
(até 12 anos) com **consentimento específico de pelo menos um dos pais ou
responsável legal**.

Se o produto aceitar menores, isso precisa de fluxo próprio — não é um detalhe
de cadastro.

### 3.4 Segurança técnica obrigatória

- Row Level Security habilitada em **toda** tabela com dado pessoal;
- chave de serviço (`service_role`) nunca no cliente, nunca no bundle, nunca em
  variável de ambiente exposta;
- usuário acessa exclusivamente os próprios dados;
- professor acessa exclusivamente alunos vinculados e que consentiram;
- transporte sempre em TLS;
- senhas nunca armazenadas pela aplicação (autenticação via magic link ou
  provedor de identidade).

### 3.5 Direitos do titular

Precisa existir fluxo funcional, não apenas texto na política, para:

- confirmação de tratamento e acesso aos dados;
- correção;
- **eliminação** (exclusão de conta com apagamento efetivo);
- portabilidade (exportação em formato legível por máquina);
- revogação de consentimento;
- informação sobre compartilhamento com terceiros.

### 3.6 Retenção

Definir prazo por tipo de dado antes de coletar. Dado sem prazo definido é dado
que fica para sempre — o que é, em si, uma não conformidade.

### 3.7 Operadores e transferência internacional

Provedores de hospedagem, banco de dados e pagamento são operadores. Exigem
contrato de tratamento. Se houver armazenamento fora do Brasil, a transferência
internacional precisa de salvaguarda adequada (art. 33).

## 4. Analytics — regra específica

O documento de arquitetura lista eventos de produto. A regra é:

> Registrar o **evento**, não a **pessoa**, sempre que a finalidade permitir.

Saber que "38% das decisões erradas vieram de defesa sob pressão" não exige
identificar quem errou. Métrica agregada e anônima não é dado pessoal e não
carrega obrigação de LGPD — e atende à maior parte das perguntas de produto.

Só vincule evento a usuário quando a funcionalidade depender disso (histórico
pessoal, progresso, recomendação personalizada).

## 5. Revisão

Este documento precisa ser revisado antes de cada uma destas mudanças:

- introdução de autenticação;
- introdução de banco de dados;
- introdução de analytics;
- introdução de pagamentos;
- abertura do produto a menores de idade;
- atendimento a usuários fora do Brasil.
