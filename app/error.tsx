'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("EDGE CRASH CAUGHT:", error);
  }, [error]);

  return (
    <div style={{ padding: '40px', backgroundColor: '#ffebee', color: '#b71c1c', fontFamily: 'monospace', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid #b71c1c', paddingBottom: '10px' }}>
        🚨 Edge Runtime Crash Detected
      </h1>
      <div style={{ marginTop: '20px' }}>
        <p><strong>Error Message:</strong> {error.message}</p>
        {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
      </div>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '5px', overflowX: 'auto' }}>
        <strong>Stack Trace:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>{error.stack}</pre>
      </div>
      <button
        onClick={() => reset()}
        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#b71c1c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Try Again
      </button>
    </div>
  );
}
