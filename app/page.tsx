'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Mark from '@/components/Mark';
import RBtn from '@/components/RBtn';
import VerdictBadge from '@/components/VerdictBadge';
import MiniBar from '@/components/MiniBar';
import { mockMedia } from '@/lib/mockData';

type TrendingTab = 'today' | 'week' | 'contested';

const MENU_ITEMS = [
  { href: '/explore',     emoji: '📋', label: '둘러보기',     desc: '모두가 가려낸 영상' },
  { href: '/report',      emoji: '📢', label: '제보하기',     desc: '의심 영상 올리기' },
  { href: '/my-activity', emoji: '👤', label: '내가 참여한 것', desc: '내 투표 기록' },
  { href: '/profile',     emoji: '🏅', label: '명예의 전당',   desc: '점수·뱃지·랭킹' },
];

function ThumbPlaceholder({ hue, size = 52 }: { hue: number; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        flexShrink: 0,
        background: `linear-gradient(135deg, hsl(${hue},60%,45%), hsl(${hue},40%,30%))`,
      }}
    />
  );
}

function TimerChip() {
  const [time] = useState(15);
  return (
    <span
      style={{
        background: time < 6 ? '#C8313D' : 'rgba(255,255,255,0.15)',
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 800,
        padding: '4px 10px',
        borderRadius: 8,
        letterSpacing: 0.5,
      }}
    >
      ⏱ {time}초
    </span>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [tab, setTab] = useState<TrendingTab>('today');

  useEffect(() => {
    if (!localStorage.getItem('onboarded')) {
      router.replace('/onboarding');
    }
  }, [router]);

  const filteredMedia = mockMedia
    .filter((m) => (tab === 'contested' ? m.contested : m.period === tab))
    .slice(0, 3);

  return (
    <div style={{ paddingBottom: 96, background: 'var(--bg)' }}>

      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 16px 12px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: 17, fontWeight: 900, color: '#1B3A6B', letterSpacing: '-0.5px' }}>
          👁 AI감별사
        </span>
        <Link
          href="/profile"
          style={{ fontSize: 13, fontWeight: 700, color: '#3D4A60', textDecoration: 'none' }}
        >
          호기심많은너구리 <span style={{ color: '#7A8499' }}>›</span>
        </Link>
      </div>

      <div style={{ padding: '16px 16px 0' }}>

        {/* LIVE 인디케이터 */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#FCE8EA',
            borderRadius: 12,
            padding: '5px 12px',
            marginBottom: 16,
          }}
        >
          <span
            className="animate-pulse-dot"
            style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8313D', display: 'inline-block' }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#C8313D' }}>
            지금 12,847명이 함께 보고 있어요
          </span>
        </div>

        {/* 타이틀 */}
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: '#0F1E36',
            letterSpacing: '-1px',
            lineHeight: 1.18,
            margin: '0 0 6px',
          }}
        >
          오늘의<br />
          <Mark>진짜 vs AI</Mark>
        </h1>
        <p style={{ fontSize: 15, fontWeight: 500, color: '#3D4A60', margin: '0 0 20px' }}>
          함께 의심하고, 함께 가려내요
        </p>

        {/* 오늘의 도전 카드 */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1B3A6B, #0F254A)',
            borderRadius: 20,
            padding: '20px 18px 18px',
            marginBottom: 16,
            boxShadow: '0 8px 32px rgba(15,30,54,0.18)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span
              style={{
                background: '#F2C94C',
                color: '#0F254A',
                fontSize: 11,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 8,
                letterSpacing: 0.5,
              }}
            >
              오늘의 도전 · #87
            </span>
            <TimerChip />
          </div>

          {/* 썸네일 */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: 12,
              overflow: 'hidden',
              marginBottom: 14,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, hsl(220,60%,20%), hsl(220,40%,10%))',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  color: '#fff',
                }}
              >
                ▶
              </div>
            </div>
          </div>

          {/* 참여자 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ display: 'flex' }}>
              {['#E57373', '#81C784', '#64B5F6', '#FFB74D'].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: c,
                    border: '2px solid #1B3A6B',
                    marginLeft: i === 0 ? 0 : -8,
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
              지금 8,427명이 함께 보고 있어요
            </span>
          </div>

          <Link href="/vote" style={{ display: 'block' }}>
            <RBtn variant="gold" size="xl">🔍 지금 가려내기</RBtn>
          </Link>
        </div>

        {/* 내 현황 카드 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { emoji: '🏆', label: '총 점수', value: '2,840' },
            { emoji: '🔥', label: '연속 참여', value: '7일' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: '#FFFFFF',
                border: '1px solid #DDE3ED',
                borderRadius: 14,
                padding: '14px 12px',
                textAlign: 'center',
                boxShadow: '0 1px 4px rgba(15,30,54,0.04)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#7A8499', marginBottom: 4 }}>
                {item.emoji} {item.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#0F1E36', letterSpacing: '-0.7px' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* 핵심 메뉴 그리드 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
          {MENU_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #DDE3ED',
                  borderRadius: 16,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  minHeight: 110,
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 36, lineHeight: 1 }}>{item.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#0F1E36', letterSpacing: '-0.3px' }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 12, color: '#7A8499', fontWeight: 500 }}>
                  {item.desc}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* 트렌딩 섹션 */}
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0F1E36', margin: '0 0 12px' }}>
            🔥 지금 가장 의심받는 중
          </h2>

          {/* 탭 */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {([
              { key: 'today' as TrendingTab, label: '오늘' },
              { key: 'week' as TrendingTab, label: '이번 주' },
              { key: 'contested' as TrendingTab, label: '팽팽' },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: tab === t.key ? '#1B3A6B' : '#FFFFFF',
                  color: tab === t.key ? '#FFFFFF' : '#7A8499',
                  boxShadow: tab === t.key
                    ? '0 2px 6px rgba(27,58,107,0.25)'
                    : '0 1px 3px rgba(0,0,0,0.06)',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* 리스트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredMedia.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#7A8499', fontSize: 14, padding: '24px 0' }}>
                해당 항목이 없어요
              </div>
            ) : (
              filteredMedia.map((m) => (
                <Link key={m.id} href={`/explore/${m.id}`} style={{ textDecoration: 'none' }}>
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
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <ThumbPlaceholder hue={m.thumbHue} size={52} />
                      {m.kind === 'video' && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 10,
                            background: 'rgba(0,0,0,0.3)',
                            color: '#fff',
                            fontSize: 14,
                          }}
                        >
                          ▶
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ marginBottom: 4 }}>
                        <VerdictBadge yesCount={m.yesCount} noCount={m.noCount} contested={m.contested} />
                      </div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: '#0F1E36',
                          margin: '0 0 6px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {m.title}
                      </p>
                      <MiniBar yesCount={m.yesCount} noCount={m.noCount} />
                      <span style={{ fontSize: 11, color: '#7A8499', marginTop: 4, display: 'block' }}>
                        {m.totalVotes.toLocaleString()}명 참여 · 💬 코멘트
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
