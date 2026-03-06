// app/not-found.tsx
import Link from 'next/link';

// ❌ PAS DE METADATA ICI
// ❌ PAS DE VIEWPORT ICI

export default function NotFound() {
  return (
    <html lang="fr">
      <body style={{
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white',
          padding: '20px'
        }}>
          <h1 style={{ 
            fontSize: '72px', 
            marginBottom: '20px',
            background: 'linear-gradient(to right, #06b6d4, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            404
          </h1>
          
          <p style={{ 
            fontSize: '24px', 
            color: '#94a3b8', 
            marginBottom: '30px' 
          }}>
            Cette page n'existe pas
          </p>
          
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#06b6d4',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </body>
    </html>
  );
}
