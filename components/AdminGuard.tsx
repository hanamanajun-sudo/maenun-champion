'use client';

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUserStore } from '@/lib/store';

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const uid = useUserStore((s) => s.uid);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  if (!uid) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#7A8499' }}>로딩 중...</div>;
  }

  if (uid === ADMIN_UID) {
    return <>{children}</>;
  }

  return (
    <div style={{ padding: 32, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8, maxWidth: 480, margin: '0 auto' }}>
      <div style={{ fontSize: 40, marginBottom: 16, textAlign: 'center' }}>🔐</div>
      <p style={{ fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>어드민 로그인이 필요합니다</p>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        style={{
          width: '100%', padding: '14px', borderRadius: 10, border: '1.5px solid #dde3ed',
          background: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          marginBottom: 16, opacity: loading ? 0.6 : 1,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 35.5 26.9 36 24 36c-5.2 0-9.6-2.9-11.3-7l-6.5 5C9.7 39.6 16.3 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.7 5.8l6.2 5.2C40.2 36.2 44 30.6 44 24c0-1.3-.1-2.7-.4-4z"/>
        </svg>
        {loading ? '로그인 중...' : 'Google로 로그인'}
      </button>

      {error && <p style={{ color: '#C8313D', fontSize: 12, marginBottom: 12 }}>{error}</p>}

      <div style={{ background: '#f4f6fa', borderRadius: 8, padding: '10px 12px', fontSize: 11, color: '#7A8499' }}>
        현재 UID: <span style={{ wordBreak: 'break-all' }}>{uid}</span>
      </div>
    </div>
  );
}
