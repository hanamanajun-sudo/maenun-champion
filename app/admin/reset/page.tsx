'use client';

import { useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminGuard from '@/components/AdminGuard';

async function deleteCollection(name: string): Promise<number> {
  if (!db) throw new Error('Firestore 미설정');
  const snap = await getDocs(collection(db, name));
  await Promise.all(snap.docs.map((d) => deleteDoc(doc(db!, name, d.id))));
  return snap.size;
}

function ResetRunner() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

  async function reset() {
    if (!db) { setStatus('error'); addLog('❌ Firestore db 미설정'); return; }
    setStatus('loading');
    setLog([]);

    try {
      const mediaCount = await deleteCollection('media');
      addLog(`🗑️ media: ${mediaCount}개 삭제`);

      const votesCount = await deleteCollection('votes');
      addLog(`🗑️ votes: ${votesCount}개 삭제`);

      const reportsCount = await deleteCollection('report_submissions');
      addLog(`🗑️ report_submissions: ${reportsCount}개 삭제`);

      setStatus('done');
    } catch (e) {
      addLog(`❌ 오류: ${e}`);
      setStatus('error');
    }
  }

  return (
    <>
      <div style={{
        background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8,
        padding: '12px 16px', marginBottom: 20, fontSize: 13, lineHeight: 1.7,
      }}>
        ⚠️ <strong>주의</strong>: media, votes, report_submissions 컬렉션 전체가 삭제됩니다.<br />
        users 컬렉션은 유지됩니다. 삭제 후 복구 불가능합니다.
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 20, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />
        확인했습니다. 전체 데이터를 삭제합니다.
      </label>

      <button
        onClick={reset}
        disabled={!confirmed || status === 'loading'}
        style={{
          background: confirmed && status !== 'loading' ? '#C8313D' : '#ccc',
          color: '#fff', border: 'none', borderRadius: 10,
          padding: '12px 28px', fontSize: 15, fontWeight: 800,
          cursor: confirmed && status !== 'loading' ? 'pointer' : 'not-allowed',
          marginBottom: 20,
        }}
      >
        {status === 'loading' ? '삭제 중...' : '전체 초기화'}
      </button>

      {log.length > 0 && (
        <div style={{
          background: '#f4f6fa', border: '1px solid #dde3ed',
          borderRadius: 10, padding: '14px 16px', fontSize: 13, lineHeight: 1.8,
        }}>
          {log.map((l, i) => <div key={i}>{l}</div>)}
          {status === 'done' && (
            <div style={{ marginTop: 12, fontWeight: 800, color: '#137F5E' }}>
              ✅ 초기화 완료! /admin/media 에서 새 콘텐츠를 등록하세요.
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function ResetPage() {
  return (
    <AdminGuard>
      <div style={{ padding: 32, maxWidth: 540, margin: '0 auto', fontFamily: 'monospace' }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>🗑️ 데이터 초기화</h1>
        <ResetRunner />
      </div>
    </AdminGuard>
  );
}
