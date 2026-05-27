'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ padding: '40px', backgroundColor: '#311b92', color: '#fff', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '24px', borderBottom: '2px solid #fff', paddingBottom: '10px' }}>
            🚨 GLOBAL LAYOUT CRASH (Edge Runtime)
          </h1>
          <div style={{ marginTop: '20px' }}>
            <p><strong>Message:</strong> {error.message}</p>
            {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
          </div>
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.3)', overflowX: 'auto' }}>
            <strong>Stack Trace:</strong>
            <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>{error.stack}</pre>
          </div>
          <button onClick={() => reset()} style={{ marginTop: '20px', padding: '10px', color: '#000' }}>Retry</button>
        </div>
      </body>
    </html>
  );
}
