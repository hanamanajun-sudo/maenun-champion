'use client';

import { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';

const FIXES = [
  {
    id: 'm4',
    title: '부산 지하철 사슴 난동',
    embedUrl: 'https://www.youtube.com/embed/7zhp1njxjxk?shorts=1',
  },
];

export default function FixPage() {
  const [log, setLog] = useState<{ id: string; msg: string; ok: boolean }[]>([]);
  const [done, setDone] = useState(false);

  const addLog = (id: string, msg: string, ok: boolean) =>
    setLog((prev) => [...prev, { id, msg, ok }]);

  useEffect(() => {
    if (!auth || !db) {
      addLog('system', 'Firebase 미설정', false);
      return;
    }

    async function run() {
      let user = auth!.currentUser;
      if (!user) {
        const r = await signInAnonymously(auth!);
        user = r.user;
      }
      addLog('system', `🔐 로그인: ${user.uid.slice(0, 10)}...`, true);

      for (const fix of FIXES) {
        try {
          await updateDoc(doc(db!, 'media', fix.id), {
            title: fix.title,
            embedUrl: fix.embedUrl,
          });
          addLog(fix.id, `✅ ${fix.id} → "${fix.title}"`, true);
        } catch (e) {
          addLog(fix.id, `❌ ${fix.id} 실패: ${e}`, false);
        }
      }
      setDone(true);
    }

    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      run();
    });
  }, []);

  return (
    <div style={{ padding: 32, maxWidth: 500, margin: '0 auto', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>🔧 미디어 자동 수정</h1>

      <div style={{ background: '#f4f6fa', border: '1px solid #dde3ed', borderRadius: 10, padding: '14px 16px', fontSize: 13, lineHeight: 2 }}>
        {log.length === 0 && <div>⏳ 실행 중...</div>}
        {log.map((l, i) => <div key={i} style={{ color: l.ok ? '#137F5E' : '#C8313D' }}>{l.msg}</div>)}
        {done && (
          <div style={{ marginTop: 12, fontWeight: 800, color: '#1B3A6B' }}>
            🎉 완료! <a href="/explore/m4" style={{ color: '#1B3A6B' }}>/explore/m4 에서 확인 →</a>
          </div>
        )}
      </div>
    </div>
  );
}
