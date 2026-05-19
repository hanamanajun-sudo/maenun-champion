'use client';

import { useEffect, useState } from 'react';
import { signInAnon, onAuthStateChanged, generateNickname } from '@/lib/auth';
import { auth } from '@/lib/firebase';
import { getOrCreateUser, updateUserAuthInfo } from '@/lib/firestore';
import { useUserStore } from '@/lib/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    if (!auth) {
      setReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        try {
          await signInAnon();
        } catch {
          // Firebase 미설정 시 무시
        }
      } else {
        try {
          const userDoc = await getOrCreateUser(firebaseUser.uid, generateNickname());
          if (!firebaseUser.isAnonymous && userDoc.isAnonymous) {
            await updateUserAuthInfo(firebaseUser.uid, {
              isAnonymous: false,
              email: firebaseUser.email || undefined,
            });
            userDoc.isAnonymous = false;
            if (firebaseUser.email) userDoc.email = firebaseUser.email;
          }
          setUser(firebaseUser.uid, userDoc);
        } catch {
          // 유저 로드 실패 시 무시
        }
      }
      setReady(true);
    });
    return () => unsubscribe();
  }, [setUser]);

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
