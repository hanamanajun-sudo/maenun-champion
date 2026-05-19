'use client';

import { useState, useEffect } from 'react';
import { doc, updateDoc, setDoc, onSnapshot, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MediaDoc } from '@/lib/firestore';
import { useUserStore } from '@/lib/store';
import AdminGuard from '@/components/AdminGuard';

function toEmbedUrl(raw: string): string {
  const trimmed = raw.trim();
  const tiktokMatch = trimmed.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (tiktokMatch) return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
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

type NewForm = {
  id: string;
  title: string;
  url: string;
  kind: 'video' | 'photo';
  period: 'today' | 'week' | 'month';
  thumbHue: number;
  hint: string;
};

const EMPTY: NewForm = { id: '', title: '', url: '', kind: 'video', period: 'today', thumbHue: 200, hint: '' };

const inp: React.CSSProperties = {
  border: '1.5px solid #DDE3ED', borderRadius: 8, padding: '8px 10px',
  fontSize: 13, fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box', background: '#fff',
};
const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 800, color: '#7A8499', marginBottom: 4, display: 'block', letterSpacing: 0.3 };
const row: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 };

export default function AdminMediaPage() {
  const uid = useUserStore((s) => s.uid);
  const [mediaList, setMediaList] = useState<MediaDoc[]>([]);

  const [editing, setEditing] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editHint, setEditHint] = useState('');
  const [editPeriod, setEditPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<NewForm>(EMPTY);
  const [adding, setAdding] = useState(false);
  const [addMsg, setAddMsg] = useState('');

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
    setEditUrl(m.embedUrl);
    setEditTitle(m.title);
    setEditHint(m.hint ?? '');
    setEditPeriod(m.period);
  }

  async function save(id: string) {
    if (!db || !uid) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'media', id), {
        ...(editTitle.trim() && { title: editTitle.trim() }),
        embedUrl: toEmbedUrl(editUrl),
        ...(editHint.trim() && { hint: editHint.trim() }),
        period: editPeriod,
      });
      setSavedId(id);
      setTimeout(() => setSavedId(null), 2000);
      setEditing(null);
    } catch (e) { alert(`저장 실패: ${e}`); }
    setSaving(false);
  }

  async function addMedia() {
    if (!db || !uid) return;
    setAddMsg('');
    if (!form.id.trim()) { setAddMsg('ID를 입력해주세요 (예: m11)'); return; }
    if (!form.title.trim()) { setAddMsg('제목을 입력해주세요'); return; }
    if (!form.url.trim()) { setAddMsg('URL을 입력해주세요'); return; }
    setAdding(true);
    try {
      const embedUrl = toEmbedUrl(form.url);
      await setDoc(doc(db, 'media', form.id.trim()), {
        kind: form.kind,
        title: form.title.trim(),
        embedUrl,
        period: form.period,
        thumbHue: form.thumbHue,
        hint: form.hint.trim(),
        yesCount: 0,
        noCount: 0,
        totalVotes: 0,
        contested: false,
        isActive: true,
        publishedAt: serverTimestamp(),
      });
      setAddMsg(`✅ ${form.id} 추가됨!`);
      setForm(EMPTY);
    } catch (e) { setAddMsg(`❌ 실패: ${e}`); }
    setAdding(false);
  }

  const f = (key: keyof NewForm, val: string | number) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <AdminGuard>
    <div style={{ padding: '24px 16px', maxWidth: 600, margin: '0 auto', fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4, color: '#0F1E36' }}>🎬 미디어 관리</h1>
      <p style={{ fontSize: 13, color: '#7A8499', marginBottom: 20 }}>
        🟢 {uid?.slice(0, 8)}...{' · '}총 {mediaList.length}개
      </p>

      {/* ── 새 미디어 추가 ── */}
      <button
        onClick={() => { setShowAdd(!showAdd); setAddMsg(''); }}
        style={{ width: '100%', background: showAdd ? '#F4F6FA' : '#1B3A6B', color: showAdd ? '#7A8499' : '#fff', border: showAdd ? '1.5px solid #DDE3ED' : 'none', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12 }}
      >
        {showAdd ? '✕ 닫기' : '＋ 새 미디어 추가'}
      </button>

      {showAdd && (
        <div style={{ background: '#F4F6FA', border: '1.5px solid #1B3A6B', borderRadius: 14, padding: 16, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={row}>
              <label style={lbl}>ID (예: m11)</label>
              <input value={form.id} onChange={(e) => f('id', e.target.value)} placeholder="m11" style={inp} />
            </div>
            <div style={row}>
              <label style={lbl}>종류</label>
              <select value={form.kind} onChange={(e) => f('kind', e.target.value)} style={inp}>
                <option value="video">🎬 영상</option>
                <option value="photo">📷 사진</option>
              </select>
            </div>
          </div>

          <div style={row}>
            <label style={lbl}>제목</label>
            <input value={form.title} onChange={(e) => f('title', e.target.value)} placeholder="제목 입력" style={inp} />
          </div>

          <div style={row}>
            <label style={lbl}>URL (YouTube / TikTok / 직접 embed URL)</label>
            <input value={form.url} onChange={(e) => f('url', e.target.value)} placeholder="https://youtube.com/shorts/... 또는 https://tiktok.com/@.../video/..." style={{ ...inp, fontFamily: 'monospace', fontSize: 12 }} />
            {form.url.trim() && (
              <span style={{ fontSize: 11, color: '#7A8499', marginTop: 2 }}>→ {toEmbedUrl(form.url)}</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={row}>
              <label style={lbl}>기간</label>
              <select value={form.period} onChange={(e) => f('period', e.target.value)} style={inp}>
                <option value="today">오늘</option>
                <option value="week">이번 주</option>
                <option value="month">이번 달</option>
              </select>
            </div>
            <div style={row}>
              <label style={lbl}>썸네일 색조 (0–360)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="range" min={0} max={360} value={form.thumbHue} onChange={(e) => f('thumbHue', Number(e.target.value))} style={{ flex: 1 }} />
                <span style={{ width: 28, height: 28, borderRadius: 6, background: `hsl(${form.thumbHue},55%,40%)`, flexShrink: 0, display: 'inline-block' }} />
              </div>
            </div>
          </div>

          <div style={row}>
            <label style={lbl}>힌트 (투표 후 공개)</label>
            <input value={form.hint} onChange={(e) => f('hint', e.target.value)} placeholder="어떤 점에서 가짜/진짜인지 간단히..." style={inp} />
          </div>

          {addMsg && <div style={{ fontSize: 13, fontWeight: 700, color: addMsg.startsWith('✅') ? '#137F5E' : '#C8313D' }}>{addMsg}</div>}

          <button
            onClick={addMedia}
            disabled={adding}
            style={{ background: adding ? '#DDE3ED' : '#137F5E', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontSize: 14, fontWeight: 800, cursor: adding ? 'default' : 'pointer', fontFamily: 'inherit' }}
          >
            {adding ? '추가 중...' : '✅ 추가하기'}
          </button>
        </div>
      )}

      {/* ── 기존 목록 ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mediaList.map((m) => (
          <div key={m.id} style={{ background: '#FFFFFF', border: `1.5px solid ${savedId === m.id ? '#137F5E' : '#DDE3ED'}`, borderRadius: 14, padding: '14px 16px', transition: 'border-color 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, background: '#F4F6FA', color: '#7A8499', padding: '2px 6px', borderRadius: 5 }}>{m.id}</span>
                  <span style={{ fontSize: 11, color: '#7A8499' }}>{m.kind === 'video' ? '🎬' : '📷'}</span>
                  <span style={{ fontSize: 11, color: '#7A8499' }}>{m.period}</span>
                </div>

                {editing === m.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="제목" style={inp} />
                    <input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="URL (YouTube / TikTok / embed)" style={{ ...inp, fontFamily: 'monospace', fontSize: 12 }} />
                    {editUrl.trim() && <span style={{ fontSize: 11, color: '#7A8499' }}>→ {toEmbedUrl(editUrl)}</span>}
                    <input value={editHint} onChange={(e) => setEditHint(e.target.value)} placeholder="힌트" style={inp} />
                    <div style={row}>
                      <label style={lbl}>기간</label>
                      <select value={editPeriod} onChange={(e) => setEditPeriod(e.target.value as 'today' | 'week' | 'month')} style={inp}>
                        <option value="today">오늘</option>
                        <option value="week">이번 주</option>
                        <option value="month">이번 달</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => save(m.id)} disabled={saving} style={{ background: '#1B3A6B', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {saving ? '저장 중...' : '저장'}
                      </button>
                      <button onClick={() => setEditing(null)} style={{ background: '#F4F6FA', color: '#7A8499', border: '1px solid #DDE3ED', borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0F1E36', margin: '0 0 4px' }}>{m.title}</p>
                    <p style={{ fontSize: 11, color: '#7A8499', margin: 0, fontFamily: 'monospace', wordBreak: 'break-all' }}>{m.embedUrl}</p>
                    {m.hint && <p style={{ fontSize: 11, color: '#7A8499', margin: '4px 0 0', fontStyle: 'italic' }}>힌트: {m.hint}</p>}
                    <p style={{ fontSize: 11, color: '#7A8499', margin: '4px 0 0', fontWeight: 600 }}>
                      👥 {(m.yesCount + m.noCount).toLocaleString()}명 · 가짜 {m.yesCount} / 진짜 {m.noCount}
                    </p>
                  </>
                )}
              </div>

              {editing !== m.id && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => startEdit(m)} style={{ background: '#F4F6FA', border: '1px solid #DDE3ED', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#3D4A60', fontFamily: 'inherit' }}>
                    수정
                  </button>
                  <a href={`/explore/${m.id}`} target="_blank" rel="noreferrer" style={{ background: '#F4F6FA', border: '1px solid #DDE3ED', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: '#3D4A60', textDecoration: 'none', textAlign: 'center' }}>
                    보기
                  </a>
                </div>
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
    </AdminGuard>
  );
}
