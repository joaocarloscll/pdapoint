# Política de Segurança

## Reportar uma vulnerabilidade

**Não abra uma issue pública para relatar vulnerabilidades.**

Use o canal privado do GitHub: aba **Security** → **Report a vulnerability**
(GitHub Private Vulnerability Reporting). O relato fica visível apenas para os
mantenedores até que haja correção.

Ao relatar, inclua:

- o que é possível fazer com a falha;
- passos para reproduzir;
- versão ou commit afetado;
- impacto estimado.

Resposta esperada em até 5 dias úteis.

Pedimos que a divulgação pública aguarde a correção, ou 90 dias, o que ocorrer
primeiro.

## Escopo

Este repositório contém uma aplicação web estática, sem backend, sem
autenticação e sem banco de dados. A superfície de ataque atual é pequena por
construção.

**Dentro do escopo:** execução de código no cliente (XSS), comprometimento da
cadeia de dependências, vazamento de segredos no repositório ou no histórico,
falhas de configuração do pipeline de publicação.

**Fora do escopo:** relatos gerados apenas por scanner automatizado sem impacto
demonstrável; ausência de cabeçalhos em domínios de terceiros que não
controlamos; engenharia social.

## Postura atual da aplicação

| Item | Estado |
|---|---|
| Coleta de dados pessoais | **Nenhuma** |
| Autenticação | Não existe |
| Banco de dados | Não existe |
| Cookies | Nenhum |
| Analytics / rastreamento | Nenhum |
| Requisições a terceiros em runtime | Nenhuma |
| Segredos no repositório | Nenhum (histórico auditado) |

A aplicação é servida como HTML estático e não processa entrada do usuário
além de cliques em opções pré-definidas.

## Antes de introduzir coleta de dados

O documento de produto prevê contas, histórico e analytics em fases futuras.
Nenhuma dessas funcionalidades pode entrar sem, antes:

1. base legal definida por finalidade (LGPD, Lei 13.709/2018);
2. política de privacidade publicada e aceita antes da coleta;
3. minimização — coletar apenas o necessário para a finalidade declarada;
4. Row Level Security habilitada em todas as tabelas com dado pessoal;
5. chave de serviço nunca exposta ao cliente;
6. fluxo de exclusão de conta e de exportação de dados do titular;
7. registro de operações de tratamento;
8. prazo de retenção definido por tipo de dado.

Ver `docs/DATA_PROTECTION.md`.

## Dependências

Atualizações de segurança são acompanhadas por Dependabot. O CI roda
typecheck, testes e build em todo pull request, e a análise estática de
segurança (CodeQL) roda em push e semanalmente.
