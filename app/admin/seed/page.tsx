'use client';

import { useState, useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { mockMedia } from '@/lib/mockData';

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

  useEffect(() => {
    if (!auth) { setAuthReady(true); return; }
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  async function ensureAuth(): Promise<boolean> {
    if (!auth) { addLog('❌ Firebase auth 미설정'); return false; }
    if (auth.currentUser) { addLog(`✅ 로그인 확인: ${auth.currentUser.uid}`); return true; }
    try {
      addLog('🔐 익명 로그인 시도...');
      const result = await signInAnonymously(auth);
      setUid(result.user.uid);
      addLog(`✅ 로그인 완료: ${result.user.uid}`);
      return true;
    } catch (e) {
      addLog(`❌ 로그인 실패: ${e}`);
      return false;
    }
  }

  async function seed() {
    if (!db) { setStatus('error'); addLog('❌ Firestore db 미설정 — 환경변수 확인'); return; }
    setStatus('loading');
    setLog([]);

    const ok = await ensureAuth();
    if (!ok) { setStatus('error'); return; }

    try {
      for (const m of mockMedia) {
        await setDoc(doc(db, 'media', m.id), {
          kind: m.kind,
          title: m.title,
          embedUrl: m.embedUrl,
          period: m.period,
          thumbHue: m.thumbHue,
          hint: m.hint,
          yesCount: m.yesCount,
          noCount: m.noCount,
          totalVotes: m.totalVotes,
          contested: m.contested,
          isActive: true,
          publishedAt: serverTimestamp(),
        });
        addLog(`✅ ${m.id}: ${m.title}`);
      }
      setStatus('done');
    } catch (e) {
      addLog(`❌ 오류: ${e}`);
      setStatus('error');
    }
  }

  return (
    <div style={{ padding: 32, maxWidth: 540, margin: '0 auto', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>🌱 Firestore 시딩</h1>
      <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>
        mockData 10개를 Firestore media 컬렉션에 업로드합니다.<br />
        이미 있으면 덮어씁니다.
      </p>

      {/* 연결 정보 표시 */}
      <div style={{ background: '#f4f6fa', border: '1px solid #dde3ed', borderRadius: 8, padding: '10px 12px', marginBottom: 20, fontSize: 12, lineHeight: 2 }}>
        <div>🔥 프로젝트 ID: <strong>{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '❌ 미설정'}</strong></div>
        <div>
          {!authReady
            ? '⏳ 인증 확인 중...'
            : uid
            ? `🟢 로그인됨: ${uid}`
            : '🔴 비로그인 (시딩 시 자동 로그인)'}
        </div>
      </div>

      <button
        onClick={seed}
        disabled={status === 'loading' || !authReady}
        style={{
          background: (status === 'loading' || !authReady) ? '#ccc' : '#1B3A6B',
          color: '#fff', border: 'none', borderRadius: 10,
          padding: '12px 28px', fontSize: 15, fontWeight: 800,
          cursor: (status === 'loading' || !authReady) ? 'not-allowed' : 'pointer',
          marginBottom: 20,
        }}
      >
        {status === 'loading' ? '업로드 중...' : '시딩 시작'}
      </button>

      {log.length > 0 && (
        <div style={{ background: '#f4f6fa', border: '1px solid #dde3ed', borderRadius: 10, padding: '14px 16px', fontSize: 13, lineHeight: 1.8 }}>
          {log.map((l, i) => <div key={i}>{l}</div>)}
          {status === 'done' && (
            <div style={{ marginTop: 12, fontWeight: 800, color: '#137F5E' }}>
              🎉 시딩 완료! /explore 에서 확인하세요.
            </div>
          )}
          {status === 'error' && (
            <div style={{ marginTop: 12, fontWeight: 800, color: '#C8313D' }}>
              Firebase Console → Firestore → 규칙에서 인증된 사용자 쓰기를 허용했는지 확인하세요.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
