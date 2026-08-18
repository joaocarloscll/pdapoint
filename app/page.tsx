import Link from 'next/link'

export default function Home() {
  return (
    <main style={{
      maxWidth: 430,
      margin: '0 auto',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 20,
      padding: 24,
    }}>
      <h1 style={{ fontSize: 34, margin: 0, letterSpacing: '-0.02em' }}>
        PDA Point
      </h1>
      <p style={{ fontSize: 19, margin: 0, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        Enxergue o ponto antes de jogá-lo.
      </p>
      <Link
        href="/situacao"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 48,
          borderRadius: 10,
          background: 'var(--accent)',
          color: '#0b1120',
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        Jogar a situação
      </Link>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
        Protótipo do Tactical Engine V1. O cenário disponível é um rascunho:
        sua fonte ainda não foi verificada, portanto ele não está publicado.
      </p>
    </main>
  )
}
