import type { NextConfig } from 'next'

/**
 * Publicação estática.
 *
 * Todas as rotas já são pré-renderizadas — não há API routes nem dados de
 * servidor — então o app exporta como HTML estático sem perder nada.
 *
 * A exportação é condicional para que `npm run dev` e `npm start` continuem
 * funcionando normalmente: só o build de publicação define estas variáveis.
 *
 * PAGES_EXPORT=1        liga o export estático
 * PAGES_BASE_PATH=/x    prefixo quando o site não é servido na raiz do domínio
 *                       (GitHub Pages de projeto serve em /<repo>/)
 */
const isExport = process.env.PAGES_EXPORT === '1'
const basePath = process.env.PAGES_BASE_PATH ?? ''

const nextConfig: NextConfig = {
  reactStrictMode: true,

  ...(isExport
    ? {
        output: 'export' as const,
        // Cada rota vira um diretório com index.html, que é o que servidores
        // estáticos resolvem sem configuração extra.
        trailingSlash: true,
        basePath,
        // A chave é omitida quando não há prefixo: com
        // exactOptionalPropertyTypes, `undefined` explícito não é aceito.
        ...(basePath === '' ? {} : { assetPrefix: basePath }),
        // Não há servidor para otimizar imagens sob demanda.
        images: { unoptimized: true },
      }
    : {}),
}

export default nextConfig
