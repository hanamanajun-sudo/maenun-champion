'use client';

import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { mockMedia } from '@/lib/mockData';

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

  async function seed() {
    if (!db) { setStatus('error'); addLog('Firebase 초기화 안 됨'); return; }
    setStatus('loading');
    setLog([]);

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
      <p style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>
        mockData 10개를 Firestore media 컬렉션에 업로드합니다.<br />
        이미 있으면 덮어씁니다.
      </p>

      <button
        onClick={seed}
        disabled={status === 'loading'}
        style={{
          background: status === 'loading' ? '#ccc' : '#1B3A6B',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          padding: '12px 28px',
          fontSize: 15,
          fontWeight: 800,
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          marginBottom: 20,
        }}
      >
        {status === 'loading' ? '업로드 중...' : '시딩 시작'}
      </button>

      {log.length > 0 && (
        <div
          style={{
            background: '#f4f6fa',
            border: '1px solid #dde3ed',
            borderRadius: 10,
            padding: '14px 16px',
            fontSize: 13,
            lineHeight: 1.8,
          }}
        >
          {log.map((l, i) => <div key={i}>{l}</div>)}
          {status === 'done' && (
            <div style={{ marginTop: 12, fontWeight: 800, color: '#137F5E' }}>
              🎉 시딩 완료! /explore 에서 확인하세요.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
