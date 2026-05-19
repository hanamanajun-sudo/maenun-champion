'use client';

import { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminGuard from '@/components/AdminGuard';

const FIXES = [
  {
    id: 'm4',
    title: '부산 지하철 사슴 난동',
    embedUrl: 'https://www.youtube.com/embed/7zhp1njxjxk?shorts=1',
  },
  {
    id: 'm1',
    title: '"Okay, you can go now"',
    embedUrl: 'https://www.youtube.com/embed/t85BopxzXBI?shorts=1',
  },
  {
    id: 'm2',
    title: '시골의 저녁',
    embedUrl: 'https://www.tiktok.com/embed/v2/7579538023147179271',
  },
];

function FixRunner() {
  const [log, setLog] = useState<{ id: string; msg: string; ok: boolean }[]>([]);
  const [done, setDone] = useState(false);

  const addLog = (id: string, msg: string, ok: boolean) =>
    setLog((prev) => [...prev, { id, msg, ok }]);

  useEffect(() => {
    if (!db) { addLog('system', 'Firebase 미설정', false); return; }

    async function run() {
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

    run();
  }, []);

  return (
    <div style={{ background: '#f4f6fa', border: '1px solid #dde3ed', borderRadius: 10, padding: '14px 16px', fontSize: 13, lineHeight: 2 }}>
      {log.length === 0 && <div>⏳ 실행 중...</div>}
      {log.map((l, i) => <div key={i} style={{ color: l.ok ? '#137F5E' : '#C8313D' }}>{l.msg}</div>)}
      {done && (
        <div style={{ marginTop: 12, fontWeight: 800, color: '#1B3A6B' }}>
          🎉 완료! <a href="/explore/m4" style={{ color: '#1B3A6B' }}>/explore/m4 에서 확인 →</a>
        </div>
      )}
    </div>
  );
}

export default function FixPage() {
  return (
    <AdminGuard>
      <div style={{ padding: 32, maxWidth: 500, margin: '0 auto', fontFamily: 'monospace' }}>
        <h1 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>🔧 미디어 자동 수정</h1>
        <FixRunner />
      </div>
    </AdminGuard>
  );
}
