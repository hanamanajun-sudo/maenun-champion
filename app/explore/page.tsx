'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Mark from '@/components/Mark';
import VerdictBadge from '@/components/VerdictBadge';
import MiniBar from '@/components/MiniBar';
import RBtn from '@/components/RBtn';
import { getMediaList, type MediaDoc } from '@/lib/firestore';
import { mockMedia } from '@/lib/mockData';

type Period = 'today' | 'week' | 'month' | 'contested';
type Kind = 'all' | 'video' | 'photo';

function toMediaDocs(mocks: typeof mockMedia): MediaDoc[] {
  return mocks.map((m) => ({ ...m, publishedAt: null as never, isActive: true }));
}

function ThumbCard({ media }: { media: MediaDoc }) {
  const total = media.yesCount + media.noCount;
  const yesPct = total > 0 ? Math.round((media.yesCount / total) * 100) : 50;
  const isContested = media.contested || Math.abs(yesPct - 50) <= 10;

  return (
    <Link href={`/explore/${media.id}`} style={{ textDecoration: 'none' }}>
      <div style={{ background: '#FFFFFF', borderRadius: 14, overflow: 'hidden', border: '1px solid #DDE3ED', boxShadow: '0 1px 4px rgba(15,30,54,0.05)', cursor: 'pointer' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3' }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, hsl(${media.thumbHue},55%,40%), hsl(${media.thumbHue},40%,25%))` }} />
          <span style={{ position: 'absolute', top: 7, left: 7, background: 'rgba(0,0,0,0.55)', color: '#FFFFFF', fontSize: 10, fontWeight: 800, padding: '3px 7px', borderRadius: 6, letterSpacing: 0.5 }}>
            {media.kind === 'video' ? '🎬 영상' : '📷 사진'}
          </span>
          <span style={{ position: 'absolute', top: 7, right: 7 }}>
            <VerdictBadge yesCount={media.yesCount} noCount={media.noCount} contested={isContested} />
          </span>
          {media.kind === 'video' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>▶</div>
            </div>
          )}
        </div>
        <div style={{ padding: '10px 10px 12px' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0F1E36', margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
            {media.title}
          </p>
          <MiniBar yesCount={media.yesCount} noCount={media.noCount} />
          <div style={{ fontSize: 11, color: '#7A8499', marginTop: 5, fontWeight: 500 }}>
            {(media.yesCount + media.noCount).toLocaleString()}명 · 💬 코멘트
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ExplorePage() {
  const [period, setPeriod] = useState<Period>('today');
  const [kind, setKind] = useState<Kind>('all');
  const [allMedia, setAllMedia] = useState<MediaDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [today, week, month] = await Promise.all([
          getMediaList('today'),
          getMediaList('week'),
          getMediaList('month'),
        ]);
        const combined = [...today, ...week, ...month];
        setAllMedia(combined.length > 0 ? combined : toMediaDocs(mockMedia));
      } catch {
        setAllMedia(toMediaDocs(mockMedia));
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = allMedia.filter((m) => {
    const total = m.yesCount + m.noCount;
    const yesPct = total > 0 ? Math.round((m.yesCount / total) * 100) : 50;
    const periodMatch =
      period === 'contested'
        ? m.contested || Math.abs(yesPct - 50) <= 10
        : m.period === period;
    const kindMatch = kind === 'all' || m.kind === kind;
    return periodMatch && kindMatch;
  });

  const totalVotes = allMedia.reduce((a, m) => a + m.yesCount + m.noCount, 0);

  const PERIOD_TABS: { key: Period; label: string }[] = [
    { key: 'today', label: '오늘' },
    { key: 'week', label: '이번 주' },
    { key: 'month', label: '이번 달' },
    { key: 'contested', label: '팽팽' },
  ];

  const KIND_FILTERS: { key: Kind; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'video', label: '영상' },
    { key: 'photo', label: '사진' },
  ];

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 96 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#FFFFFF', borderBottom: '1px solid #DDE3ED', position: 'sticky', top: 0, zIndex: 10 }}>
        <Link href="/" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, background: '#F4F6FA', border: '1px solid #DDE3ED', textDecoration: 'none', fontSize: 18, color: '#0F1E36' }}>←</Link>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#0F1E36' }}>광장</span>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0F1E36', letterSpacing: '-0.6px', lineHeight: 1.25, margin: '0 0 6px' }}>
          <Mark>사람들이</Mark> 함께<br />가려낸 영상·사진
        </h1>
        <p style={{ fontSize: 13, color: '#7A8499', fontWeight: 600, margin: '0 0 16px' }}>
          총 {allMedia.length}건 · {totalVotes.toLocaleString()}명 참여
        </p>

        <div style={{ display: 'flex', gap: 6, marginBottom: 10, overflowX: 'auto', paddingBottom: 2 }}>
          {PERIOD_TABS.map((t) => (
            <button key={t.key} onClick={() => setPeriod(t.key)}
              style={{ padding: '7px 16px', borderRadius: 20, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', background: period === t.key ? '#1B3A6B' : '#FFFFFF', color: period === t.key ? '#FFFFFF' : '#7A8499', boxShadow: period === t.key ? '0 2px 6px rgba(27,58,107,0.25)' : '0 1px 3px rgba(0,0,0,0.06)', fontFamily: 'inherit', transition: 'all 0.15s', flexShrink: 0 }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {KIND_FILTERS.map((f) => (
            <button key={f.key} onClick={() => setKind(f.key)}
              style={{ padding: '5px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: kind === f.key ? '2px solid #C6953E' : '1.5px solid #DDE3ED', background: kind === f.key ? '#FCF3E0' : '#FFFFFF', color: kind === f.key ? '#C6953E' : '#7A8499', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#7A8499', fontSize: 14 }}>불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: '#7A8499', fontSize: 14, fontWeight: 600 }}>해당하는 항목이 없어요</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {filtered.map((m) => <ThumbCard key={m.id} media={m} />)}
          </div>
        )}

        <div style={{ background: 'linear-gradient(135deg, #1B3A6B, #0F254A)', borderRadius: 18, padding: '20px 18px', marginBottom: 16 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', margin: '0 0 12px', lineHeight: 1.4 }}>의심되는 영상이 있으신가요?</p>
          <Link href="/report" style={{ display: 'block' }}>
            <RBtn variant="gold" size="lg">📢 제보하러 가기</RBtn>
          </Link>
        </div>
      </div>
    </div>
  );
}
