import type { Metadata, Viewport } from 'next'

import './globals.css'

/**
 * Content Security Policy.
 *
 * O site é servido como HTML estático, e hospedagem estática não permite
 * definir cabeçalhos HTTP — então a política vai por `meta http-equiv`, que
 * cobre tudo exceto `frame-ancestors` (ignorado em meta por especificação).
 *
 * A aplicação não faz nenhuma requisição de rede em runtime e não carrega
 * nada de terceiros, então tudo é restrito à própria origem. `unsafe-inline`
 * é necessário para o bootstrap de hidratação do Next e para os estilos
 * inline dos componentes.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  // Nenhuma chamada a terceiros: bloqueia exfiltração por fetch/XHR/WebSocket.
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

export const metadata: Metadata = {
  title: 'PDA Point — Enxergue o ponto antes de jogá-lo',
  description:
    'Treine sua tomada de decisão no tênis. Veja a situação, escolha, assista ao que acontece.',
  referrer: 'strict-origin-when-cross-origin',
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0b1120',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
        {/* Impede que o navegador adivinhe o tipo de um recurso servido. */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      </head>
      <body>{children}</body>
    </html>
  )
}
