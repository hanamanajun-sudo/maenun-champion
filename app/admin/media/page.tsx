'use client';

import { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot, collection } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { MediaDoc } from '@/lib/firestore';

export default function AdminMediaPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [mediaList, setMediaList] = useState<MediaDoc[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        const r = await signInAnonymously(auth!);
        setUid(r.user.uid);
      } else {
        setUid(user.uid);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(collection(db, 'media'), (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as MediaDoc));
      items.sort((a, b) => a.id.localeCompare(b.id));
      setMediaList(items);
    });
    return unsub;
  }, []);

  function startEdit(m: MediaDoc) {
    setEditing(m.id);
    setNewUrl(m.embedUrl);
    setNewTitle(m.title);
  }

  function toEmbedUrl(raw: string): string {
    const trimmed = raw.trim();
    // TikTok
    const tiktokMatch = trimmed.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    if (tiktokMatch) return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
    // YouTube
    const isShorts = trimmed.includes('/shorts/');
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/,
      /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
      /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    ];
    for (const p of patterns) {
      const m = trimmed.match(p);
      if (m) return `https://www.youtube.com/embed/${m[1]}${isShorts ? '?shorts=1' : ''}`;
    }
    return trimmed;
  }

  async function save(id: string) {
    if (!db || !uid) return;
    setSaving(true);
    try {
      const embedUrl = toEmbedUrl(newUrl);
      await updateDoc(doc(db, 'media', id), {
        ...(newTitle.trim() && { title: newTitle.trim() }),
        embedUrl,
      });
      setSavedId(id);
      setTimeout(() => setSavedId(null), 2000);
      setEditing(null);
    } catch (e) {
      alert(`저장 실패: ${e}`);
    }
    setSaving(false);
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: 600, margin: '0 auto', fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4, color: '#0F1E36' }}>🎬 미디어 관리</h1>
      <p style={{ fontSize: 13, color: '#7A8499', marginBottom: 24 }}>
        {uid ? `🟢 ${uid.slice(0, 8)}...` : '⏳ 인증 중...'}
        {' · '}총 {mediaList.length}개
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mediaList.map((m) => (
          <div key={m.id} style={{ background: '#FFFFFF', border: `1.5px solid ${savedId === m.id ? '#137F5E' : '#DDE3ED'}`, borderRadius: 14, padding: '14px 16px', transition: 'border-color 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, background: '#F4F6FA', color: '#7A8499', padding: '2px 6px', borderRadius: 5 }}>{m.id}</span>
                  <span style={{ fontSize: 11, color: '#7A8499' }}>{m.kind === 'video' ? '🎬' : '📷'}</span>
                </div>

                {editing === m.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="제목 (비우면 유지)"
                      style={{ border: '1.5px solid #1B3A6B', borderRadius: 8, padding: '7px 10px', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                    />
                    <input
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="유튜브 URL (watch, shorts, embed 모두 가능)"
                      style={{ border: '1.5px solid #1B3A6B', borderRadius: 8, padding: '7px 10px', fontSize: 12, fontFamily: 'monospace', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => save(m.id)} disabled={saving}
                        style={{ background: '#1B3A6B', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {saving ? '저장 중...' : '저장'}
                      </button>
                      <button onClick={() => setEditing(null)}
                        style={{ background: '#F4F6FA', color: '#7A8499', border: '1px solid #DDE3ED', borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0F1E36', margin: '0 0 4px' }}>{m.title}</p>
                    <p style={{ fontSize: 11, color: '#7A8499', margin: 0, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {m.embedUrl}
                    </p>
                    <p style={{ fontSize: 11, color: '#7A8499', margin: '4px 0 0', fontWeight: 600 }}>
                      👥 {(m.yesCount + m.noCount).toLocaleString()}명 · 가짜 {m.yesCount.toLocaleString()} / 진짜 {m.noCount.toLocaleString()}
                    </p>
                  </>
                )}
              </div>

              {editing !== m.id && (
                <button onClick={() => startEdit(m)}
                  style={{ background: '#F4F6FA', border: '1px solid #DDE3ED', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#3D4A60', fontFamily: 'inherit', flexShrink: 0 }}>
                  수정
                </button>
              )}

              {savedId === m.id && (
                <span style={{ fontSize: 12, color: '#137F5E', fontWeight: 800, flexShrink: 0 }}>✓ 저장됨</span>
              )}
            </div>
          </div>
        ))}

        {mediaList.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#7A8499', fontSize: 14 }}>
            데이터 없음 — /admin/seed 에서 먼저 시딩하세요
          </div>
        )}
      </div>
    </div>
  );
}
