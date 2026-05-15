'use client';

import { useEffect, useState } from 'react';
import { signInAnon, onAuthStateChanged } from '@/lib/auth';
import { auth } from '@/lib/firebase';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Firebase 미설정 시(auth=null) 스피너 없이 바로 렌더
    if (!auth) {
      setReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          await signInAnon();
        } catch {
          // Firebase 미설정 시 무시
        }
      }
      setReady(true);
    });
    return () => unsubscribe();
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid #DDE3ED',
              borderTopColor: '#1B3A6B',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span style={{ fontSize: '14px', color: '#7A8499', fontWeight: 600 }}>잠깐만요...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
