'use client';

import { useState } from 'react';
import Link from 'next/link';
import RBtn from '@/components/RBtn';
import MiniBar from '@/components/MiniBar';
import { mockMedia } from '@/lib/mockData';

type Tab = 'votes' | 'reports';

const MOCK_VOTES = [
  { mediaId: 'm1', vote: 'yes', daysAgo: 0, agreedWithMajority: true },
  { mediaId: 'm2', vote: 'yes', daysAgo: 1, agreedWithMajority: true },
  { mediaId: 'm3', vote: 'no', daysAgo: 2, agreedWithMajority: true },
  { mediaId: 'm5', vote: 'yes', daysAgo: 4, agreedWithMajority: false },
  { mediaId: 'm6', vote: 'yes', daysAgo: 5, agreedWithMajority: true },
];

const MOCK_REPORTS = [
  { id: 'r1', caseNumber: 'REP-2026-0423', url: 'https://youtube.com/watch?v=...', status: 'done', daysAgo: 3 },
  { id: 'r2', caseNumber: 'REP-2026-0587', url: 'https://t.me/message/12345', status: 'reviewing', daysAgo: 1 },
  { id: 'r3', caseNumber: 'REP-2026-0612', url: 'https://www.instagram.com/p/...', status: 'pending', daysAgo: 0 },
];

const STATUS_LABEL: Record<string, { label: string; bg: string; color: string }> = {
  pending:   { label: '접수됨',       bg: '#FCF3E0', color: '#C6953E' },
  reviewing: { label: '광장 검토 중', bg: '#EEF2FA', color: '#1B3A6B' },
  done:      { label: '완료',         bg: '#E0F2EA', color: '#137F5E' },
};

function daysAgoText(n: number) {
  if (n === 0) return '오늘';
  if (n === 1) return '어제';
  return `${n}일 전`;
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

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 96 }}>
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          background: '#FFFFFF',
          borderBottom: '1px solid #DDE3ED',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Link
          href="/"
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: '#F4F6FA', border: '1px solid #DDE3ED',
            textDecoration: 'none', fontSize: 18, color: '#0F1E36',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >←</Link>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#0F1E36' }}>내 활동</span>
        <div style={{ width: 36 }} />
      </div>

      {/* 탭 */}
      <div
        style={{
          display: 'flex',
          background: '#FFFFFF',
          borderBottom: '1px solid #DDE3ED',
        }}
      >
        {([
          { key: 'votes' as Tab, label: '내가 투표한' },
          { key: 'reports' as Tab, label: '내가 제보한' },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              padding: '13px 0',
              border: 'none',
              background: 'none',
              fontSize: 14,
              fontWeight: 800,
              color: tab === t.key ? '#1B3A6B' : '#7A8499',
              cursor: 'pointer',
              fontFamily: 'inherit',
              borderBottom: tab === t.key ? '2.5px solid #1B3A6B' : '2.5px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* ─── 투표한 탭 ─── */}
        {tab === 'votes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#3D4A60', margin: '0 0 14px' }}>
              지금까지 <strong style={{ color: '#1B3A6B' }}>{MOCK_VOTES.length}번</strong> 가려냈어요 🎉
            </p>

            {MOCK_VOTES.length === 0 ? (
              <EmptyVotes />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MOCK_VOTES.map((v) => {
                  const media = mockMedia.find((m) => m.id === v.mediaId);
                  if (!media) return null;
                  return (
                    <Link key={v.mediaId} href={`/explore/${media.id}`} style={{ textDecoration: 'none' }}>
                      <div
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #DDE3ED',
                          borderRadius: 14,
                          padding: '12px 14px',
                          display: 'flex',
                          gap: 12,
                          alignItems: 'flex-start',
                          boxShadow: '0 1px 4px rgba(15,30,54,0.04)',
                        }}
                      >
                        {/* 썸네일 */}
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 10,
                            flexShrink: 0,
                            background: `linear-gradient(135deg, hsl(${media.thumbHue},55%,40%), hsl(${media.thumbHue},40%,25%))`,
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* 내 의견 배지 */}
                          <span
                            style={{
                              display: 'inline-block',
                              background: v.vote === 'yes' ? '#FCE8EA' : '#E0F2EA',
                              color: v.vote === 'yes' ? '#C8313D' : '#137F5E',
                              fontSize: 11,
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: 6,
                              marginBottom: 5,
                            }}
                          >
                            {v.vote === 'yes' ? '🤖 가짜 같아요' : '👁 진짜 같아요'}
                          </span>
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: '#0F1E36',
                              margin: '0 0 6px',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {media.title}
                          </p>
                          <MiniBar yesCount={media.yesCount} noCount={media.noCount} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: v.agreedWithMajority ? '#137F5E' : '#C6953E' }}>
                              {v.agreedWithMajority ? '✓ 다수와 함께' : '🦁 용감한 소수'}
                            </span>
                            <span style={{ fontSize: 11, color: '#7A8499' }}>
                              {daysAgoText(v.daysAgo)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── 제보한 탭 ─── */}
        {tab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#3D4A60', margin: '0 0 14px' }}>
              <strong style={{ color: '#1B3A6B' }}>{MOCK_REPORTS.length}개</strong>의 제보가 접수됐어요
            </p>

            {MOCK_REPORTS.length === 0 ? (
              <EmptyReports />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MOCK_REPORTS.map((r) => {
                  const s = STATUS_LABEL[r.status];
                  return (
                    <div
                      key={r.id}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #DDE3ED',
                        borderRadius: 14,
                        padding: '14px 16px',
                        boxShadow: '0 1px 4px rgba(15,30,54,0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 900, color: '#0F1E36', letterSpacing: 0.3 }}>
                          {r.caseNumber}
                        </span>
                        <span
                          style={{
                            background: s.bg,
                            color: s.color,
                            fontSize: 11,
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: 6,
                          }}
                        >
                          {s.label}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          color: '#7A8499',
                          margin: '0 0 4px',
                          fontFamily: 'monospace',
                          wordBreak: 'break-all',
                        }}
                      >
                        {truncateUrl(r.url)}
                      </p>
                      <span style={{ fontSize: 11, color: '#7A8499', fontWeight: 600 }}>
                        {daysAgoText(r.daysAgo)}
                      </span>
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
      <p style={{ fontSize: 15, fontWeight: 700, color: '#0F1E36', margin: 0 }}>
        아직 참여한 영상이 없어요
      </p>
      <p style={{ fontSize: 13, color: '#7A8499', margin: '0 0 16px' }}>
        지금 오늘의 도전을 풀어보세요!
      </p>
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
      <p style={{ fontSize: 15, fontWeight: 700, color: '#0F1E36', margin: 0 }}>
        아직 제보한 내용이 없어요
      </p>
      <p style={{ fontSize: 13, color: '#7A8499', margin: '0 0 16px' }}>
        의심되는 영상이 있으신가요?
      </p>
      <Link href="/report" style={{ display: 'block', width: '100%', maxWidth: 240 }}>
        <RBtn variant="navy" size="md">제보하기</RBtn>
      </Link>
    </div>
  );
}
