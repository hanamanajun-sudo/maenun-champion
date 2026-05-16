'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import RBtn from '@/components/RBtn';
import MiniBar from '@/components/MiniBar';
import { getMyVotes, getMyReports, type VoteDoc, type ReportSubmissionDoc } from '@/lib/firestore';
import { useUserStore } from '@/lib/store';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MediaDoc } from '@/lib/firestore';

type Tab = 'votes' | 'reports';

const STATUS_LABEL: Record<string, { label: string; bg: string; color: string }> = {
  pending:   { label: '접수됨',       bg: '#FCF3E0', color: '#C6953E' },
  reviewing: { label: '광장 검토 중', bg: '#EEF2FA', color: '#1B3A6B' },
  done:      { label: '완료',         bg: '#E0F2EA', color: '#137F5E' },
};

function timeAgo(ts: { seconds: number } | null | undefined): string {
  if (!ts) return '방금';
  const diff = Math.floor((Date.now() / 1000 - ts.seconds) / 86400);
  if (diff === 0) return '오늘';
  if (diff === 1) return '어제';
  return `${diff}일 전`;
}

function truncateUrl(url: string, max = 36) {
  try {
    const u = new URL(url);
    const short = u.hostname + u.pathname;
    return short.length > max ? short.slice(0, max) + '…' : short;
  } catch {
    return url.length > max ? url.slice(0, max) + '…' : url;
  }
}

export default function MyActivityPage() {
  const [tab, setTab] = useState<Tab>('votes');
  const { uid, user } = useUserStore();
  const [votes, setVotes] = useState<VoteDoc[]>([]);
  const [reports, setReports] = useState<ReportSubmissionDoc[]>([]);
  const [mediaCache, setMediaCache] = useState<Record<string, MediaDoc>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    async function load() {
      setLoading(true);
      try {
        const [v, r] = await Promise.all([getMyVotes(uid!), getMyReports(uid!)]);
        setVotes(v);
        setReports(r);
        // 미디어 정보 캐시 로드
        if (db && v.length > 0) {
          const ids = [...new Set(v.map((x) => x.mediaId))];
          const entries = await Promise.all(
            ids.map(async (id) => {
              const snap = await getDoc(doc(db!, 'media', id));
              return snap.exists() ? [id, { id: snap.id, ...snap.data() } as MediaDoc] as const : null;
            })
          );
          setMediaCache(Object.fromEntries(entries.filter(Boolean) as [string, MediaDoc][]));
        }
      } catch { /* 무시 */ }
      setLoading(false);
    }
    load();
  }, [uid]);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 96 }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#FFFFFF', borderBottom: '1px solid #DDE3ED', position: 'sticky', top: 0, zIndex: 10 }}>
        <Link href="/" style={{ width: 36, height: 36, borderRadius: 10, background: '#F4F6FA', border: '1px solid #DDE3ED', textDecoration: 'none', fontSize: 18, color: '#0F1E36', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</Link>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#0F1E36' }}>내 활동</span>
        <div style={{ width: 36 }} />
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', background: '#FFFFFF', borderBottom: '1px solid #DDE3ED' }}>
        {([
          { key: 'votes' as Tab, label: '내가 투표한' },
          { key: 'reports' as Tab, label: '내가 제보한' },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: '13px 0', border: 'none', background: 'none',
              fontSize: 14, fontWeight: 800,
              color: tab === t.key ? '#1B3A6B' : '#7A8499',
              cursor: 'pointer', fontFamily: 'inherit',
              borderBottom: tab === t.key ? '2.5px solid #1B3A6B' : '2.5px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', fontSize: 14, color: '#7A8499' }}>불러오는 중...</div>
        ) : tab === 'votes' ? (
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#3D4A60', margin: '0 0 14px' }}>
              지금까지 <strong style={{ color: '#1B3A6B' }}>{user?.totalVotes ?? votes.length}번</strong> 가려냈어요 🎉
            </p>
            {votes.length === 0 ? <EmptyVotes /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {votes.map((v) => {
                  const media = mediaCache[v.mediaId];
                  return (
                    <Link key={`${v.uid}_${v.mediaId}`} href={`/explore/${v.mediaId}`} style={{ textDecoration: 'none' }}>
                      <div style={{ background: '#FFFFFF', border: '1px solid #DDE3ED', borderRadius: 14, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start', boxShadow: '0 1px 4px rgba(15,30,54,0.04)' }}>
                        <div style={{ width: 52, height: 52, borderRadius: 10, flexShrink: 0, background: media ? `linear-gradient(135deg, hsl(${media.thumbHue},55%,40%), hsl(${media.thumbHue},40%,25%))` : '#DDE3ED' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: 'inline-block', background: v.vote === 'yes' ? '#FCE8EA' : '#E0F2EA', color: v.vote === 'yes' ? '#C8313D' : '#137F5E', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6, marginBottom: 5 }}>
                            {v.vote === 'yes' ? '🤖 가짜 같아요' : '👁 진짜 같아요'}
                          </span>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#0F1E36', margin: '0 0 6px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {media?.title ?? v.mediaId}
                          </p>
                          {media && <MiniBar yesCount={media.yesCount} noCount={media.noCount} />}
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: v.agreedWithMajority ? '#137F5E' : '#C6953E' }}>
                              {v.agreedWithMajority ? '✓ 다수와 함께' : '🦁 용감한 소수'}
                            </span>
                            <span style={{ fontSize: 11, color: '#7A8499' }}>{timeAgo(v.createdAt as never)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#3D4A60', margin: '0 0 14px' }}>
              <strong style={{ color: '#1B3A6B' }}>{reports.length}개</strong>의 제보가 접수됐어요
            </p>
            {reports.length === 0 ? <EmptyReports /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {reports.map((r, i) => {
                  const s = STATUS_LABEL[r.status] ?? STATUS_LABEL.pending;
                  return (
                    <div key={r.id ?? i} style={{ background: '#FFFFFF', border: '1px solid #DDE3ED', borderRadius: 14, padding: '14px 16px', boxShadow: '0 1px 4px rgba(15,30,54,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 900, color: '#0F1E36', letterSpacing: 0.3 }}>{r.caseNumber}</span>
                        <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>{s.label}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#7A8499', margin: '0 0 4px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {truncateUrl(r.embedUrl)}
                      </p>
                      <span style={{ fontSize: 11, color: '#7A8499', fontWeight: 600 }}>{timeAgo(r.createdAt as never)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyVotes() {
  return (
    <div style={{ textAlign: 'center', padding: '48px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 40 }}>🔍</span>
      <p style={{ fontSize: 15, fontWeight: 700, color: '#0F1E36', margin: 0 }}>아직 참여한 영상이 없어요</p>
      <p style={{ fontSize: 13, color: '#7A8499', margin: '0 0 16px' }}>지금 오늘의 도전을 풀어보세요!</p>
      <Link href="/vote" style={{ display: 'block', width: '100%', maxWidth: 240 }}>
        <RBtn variant="navy" size="md">오늘 도전하기</RBtn>
      </Link>
    </div>
  );
}

function EmptyReports() {
  return (
    <div style={{ textAlign: 'center', padding: '48px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 40 }}>📢</span>
      <p style={{ fontSize: 15, fontWeight: 700, color: '#0F1E36', margin: 0 }}>아직 제보한 내용이 없어요</p>
      <p style={{ fontSize: 13, color: '#7A8499', margin: '0 0 16px' }}>의심되는 영상이 있으신가요?</p>
      <Link href="/report" style={{ display: 'block', width: '100%', maxWidth: 240 }}>
        <RBtn variant="navy" size="md">제보하기</RBtn>
      </Link>
    </div>
  );
}
