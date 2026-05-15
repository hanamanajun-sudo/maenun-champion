'use client';

import { useState } from 'react';
import { shareContent } from '@/lib/share';

type RankTab = 'national' | 'local';

const BADGES = [
  { id: 'sprout',  emoji: '🌱', label: '새싹',   desc: '첫 참여',     unlocked: true },
  { id: 'archer',  emoji: '🎯', label: '명사수',  desc: '10번 참여',   unlocked: true },
  { id: 'eye',     emoji: '👁', label: '매눈',   desc: '다수합류 20번', unlocked: true },
  { id: 'shield',  emoji: '🛡', label: '수호자',  desc: '제보 5번',    unlocked: true },
  { id: 'bolt',    emoji: '⚡', label: '번개',   desc: '연속 7일',    unlocked: true },
  { id: 'flame',   emoji: '🔥', label: '불꽃',   desc: '연속 30일',   unlocked: false },
  { id: 'crown',   emoji: '👑', label: '왕관',   desc: '잠금',        unlocked: false },
  { id: 'star',    emoji: '⭐', label: '별',     desc: '잠금',        unlocked: false },
];

const NATIONAL_RANK = [
  { rank: 1, nickname: '날카로운독수리', score: 4820, delta: 2 },
  { rank: 2, nickname: '현명한수달',     score: 4210, delta: -1 },
  { rank: 3, nickname: '꼼꼼한담비',     score: 3980, delta: 0 },
  { rank: 4, nickname: '호기심많은너구리', score: 2840, delta: 1, isMe: true },
  { rank: 5, nickname: '재빠른까치',     score: 2610, delta: -2 },
];

const LOCAL_RANK = [
  { rank: 1, nickname: '신중한여우',      score: 3120, delta: 0 },
  { rank: 2, nickname: '호기심많은너구리', score: 2840, delta: 1, isMe: true },
  { rank: 3, nickname: '열정적인부엉이',   score: 2590, delta: -1 },
  { rank: 4, nickname: '용감한고양이',     score: 2100, delta: 2 },
  { rank: 5, nickname: '차분한두더지',     score: 1870, delta: 0 },
];

const MEDAL = ['🥇', '🥈', '🥉'];

function DeltaBadge({ delta }: { delta: number }) {
  if (delta === 0) return <span style={{ fontSize: 11, color: '#7A8499' }}>─</span>;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: delta > 0 ? '#137F5E' : '#C8313D' }}>
      {delta > 0 ? `▲${delta}` : `▼${Math.abs(delta)}`}
    </span>
  );
}

export default function ProfilePage() {
  const [rankTab, setRankTab] = useState<RankTab>('national');
  const [showEditNickname, setShowEditNickname] = useState(false);
  const [nickname, setNickname] = useState('호기심많은너구리');
  const [nicknameInput, setNicknameInput] = useState('');

  const rankList = rankTab === 'national' ? NATIONAL_RANK : LOCAL_RANK;
  const unlockedCount = BADGES.filter((b) => b.unlocked).length;
  const levelPct = 84;

  const handleShare = () => {
    shareContent({ scenario: 'app' });
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 96 }}>
      {/* 별명 수정 팝업 */}
      {showEditNickname && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '0 24px',
          }}
          onClick={() => setShowEditNickname(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '24px',
              width: '100%',
              maxWidth: 360,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F1E36', margin: 0 }}>별명 바꾸기</h2>
            <input
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              placeholder={nickname}
              style={{
                border: '1.5px solid #DDE3ED',
                borderRadius: 12,
                padding: '12px 14px',
                fontSize: 15,
                fontFamily: 'inherit',
                outline: 'none',
                color: '#0F1E36',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#1B3A6B')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#DDE3ED')}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowEditNickname(false)}
                style={{
                  flex: 1, padding: '12px', border: '1.5px solid #DDE3ED',
                  borderRadius: 12, background: '#FFFFFF', fontSize: 14,
                  fontWeight: 700, color: '#7A8499', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >취소</button>
              <button
                onClick={() => {
                  if (nicknameInput.trim()) setNickname(nicknameInput.trim());
                  setShowEditNickname(false);
                }}
                style={{
                  flex: 1, padding: '12px', border: 'none',
                  borderRadius: 12, background: '#1B3A6B', fontSize: 14,
                  fontWeight: 700, color: '#FFFFFF', cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 3px 0 #0F254A',
                }}
              >저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 헤더 히어로 카드 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1B3A6B, #0F254A)',
          padding: '24px 20px 28px',
        }}
      >
        {/* 아바타 + 이름 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #C6953E, #A57A2A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 900,
              color: '#FFFFFF',
              flexShrink: 0,
              border: '3px solid rgba(255,255,255,0.2)',
            }}
          >
            {nickname.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.4px' }}>
                {nickname}
              </span>
              <button
                onClick={() => setShowEditNickname(true)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '4px 8px',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >✏️ 수정</button>
            </div>
            <span
              style={{
                display: 'inline-block',
                background: '#C6953E',
                color: '#FFFFFF',
                fontSize: 11,
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 8,
                marginTop: 5,
                letterSpacing: 0.3,
                boxShadow: '0 2px 0 #A57A2A',
              }}
            >
              Lv.12 매눈고수
            </span>
          </div>
        </div>

        {/* 3분할 통계 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 1,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 14,
            overflow: 'hidden',
            marginBottom: 16,
          }}
        >
          {[
            { label: '총 점수', value: '2,840' },
            { label: '연속 참여', value: '7일' },
            { label: '다수 합류율', value: '78%' },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                padding: '12px 8px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.07)',
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600, marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* 레벨 진행바 */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
              Lv.12 → Lv.13
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#F2C94C' }}>
              {levelPct}%
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 8, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${levelPct}%`,
                borderRadius: 8,
                background: 'linear-gradient(90deg, #C6953E, #F2C94C)',
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>

        {/* 구글 연동 안내 */}
        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              fontSize: 12,
              color: 'rgba(255,255,255,0.55)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textDecoration: 'underline',
            }}
          >
            다른 기기에서도 이어하려면? → 구글로 연결하기
          </button>
        </div>
      </div>

      <div style={{ padding: '20px 16px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* 뱃지 섹션 */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDE3ED',
            borderRadius: 16,
            padding: '16px',
            boxShadow: '0 2px 8px rgba(15,30,54,0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F1E36', margin: 0 }}>내 뱃지</h2>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#7A8499' }}>
              30개 중 {unlockedCount}개 수집
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {BADGES.map((b) => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: '10px 4px',
                  borderRadius: 12,
                  background: b.unlocked ? '#F4F6FA' : '#F4F6FA',
                  border: b.unlocked ? '1.5px solid #DDE3ED' : '1.5px solid #EEF0F4',
                  opacity: b.unlocked ? 1 : 0.45,
                }}
              >
                <span style={{ fontSize: 24, lineHeight: 1 }}>
                  {b.unlocked ? b.emoji : '🔒'}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#3D4A60', textAlign: 'center', lineHeight: 1.2 }}>
                  {b.label}
                </span>
                <span style={{ fontSize: 9, color: '#7A8499', textAlign: 'center', lineHeight: 1.2 }}>
                  {b.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 랭킹 */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDE3ED',
            borderRadius: 16,
            padding: '16px',
            boxShadow: '0 2px 8px rgba(15,30,54,0.05)',
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F1E36', margin: '0 0 12px' }}>랭킹</h2>

          {/* 랭킹 탭 */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {([
              { key: 'national' as RankTab, label: '전국' },
              { key: 'local' as RankTab, label: '동네' },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setRankTab(t.key)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 20,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: rankTab === t.key ? '#1B3A6B' : '#F4F6FA',
                  color: rankTab === t.key ? '#FFFFFF' : '#7A8499',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* 랭킹 리스트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {rankList.map((r) => (
              <div
                key={r.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: r.isMe ? '#EEF2FA' : '#F4F6FA',
                  border: r.isMe ? '1.5px solid #1B3A6B' : '1px solid transparent',
                }}
              >
                <span style={{ fontSize: r.rank <= 3 ? 20 : 14, fontWeight: 900, minWidth: 24, textAlign: 'center' }}>
                  {r.rank <= 3 ? MEDAL[r.rank - 1] : r.rank}
                </span>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: r.isMe
                      ? 'linear-gradient(135deg, #C6953E, #A57A2A)'
                      : 'linear-gradient(135deg, #7A8499, #3D4A60)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 900,
                    color: '#FFFFFF',
                    flexShrink: 0,
                  }}
                >
                  {r.nickname.charAt(0)}
                </div>
                <span style={{ flex: 1, fontSize: 13, fontWeight: r.isMe ? 800 : 600, color: '#0F1E36', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.nickname}
                  {r.isMe && <span style={{ fontSize: 11, color: '#1B3A6B', marginLeft: 6 }}>나</span>}
                </span>
                <DeltaBadge delta={r.delta} />
                <span style={{ fontSize: 14, fontWeight: 900, color: '#0F1E36', letterSpacing: '-0.3px', flexShrink: 0 }}>
                  {r.score.toLocaleString()}점
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 공유 버튼 */}
        <button
          onClick={handleShare}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: '#FFFFFF',
            border: '1.5px solid #DDE3ED',
            borderRadius: 16,
            padding: '14px',
            fontSize: 15,
            fontWeight: 700,
            color: '#1B3A6B',
            cursor: 'pointer',
            fontFamily: 'inherit',
            width: '100%',
          }}
        >
          📤 앱 친구에게 알리기
        </button>
      </div>
    </div>
  );
}
