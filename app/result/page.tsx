'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RBtn from '@/components/RBtn';
import ReactionBar from '@/components/ReactionBar';
import CommentItem from '@/components/CommentItem';
import { mockMedia } from '@/lib/mockData';
import { shareContent } from '@/lib/share';

const media = mockMedia[0];
const YES_COUNT = 5224;
const NO_COUNT = 3203;
const TOTAL = YES_COUNT + NO_COUNT;
const YES_PCT = Math.round((YES_COUNT / TOTAL) * 100);
const NO_PCT = 100 - YES_PCT;

const MOCK_COMMENTS = [
  { id: 'c1', nickname: '날카로운독수리', text: '입 모양이 확실히 어색했어요. 말이 끝날 때 입이 늦게 닫혀요.', reaction: 'suspicious' as const, likes: 47 },
  { id: 'c2', nickname: '신중한여우', text: '배경 화면이 흔들리는 것 같았는데 사람은 너무 선명해요.', reaction: 'suspicious' as const, likes: 31 },
  { id: 'c3', nickname: '차분한부엉이', text: '저는 진짜인 것 같았는데 생각보다 많은 분들이 가짜라고 하시네요.', reaction: 'interesting' as const, likes: 14 },
];

function DonutChart({ yesPct, noPct, total }: { yesPct: number; noPct: number; total: number }) {
  const [animated, setAnimated] = useState(false);
  const R = 60;
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * R;
  const yesDash = animated ? (yesPct / 100) * circumference : 0;
  const noDash = animated ? (noPct / 100) * circumference : 0;
  const yesOffset = 0;
  const noOffset = -(yesDash);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative', width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* 배경 트랙 */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#DDE3ED" strokeWidth={20} />
          {/* 진짜(녹색) */}
          <circle
            cx={cx} cy={cy} r={R}
            fill="none"
            stroke="#137F5E"
            strokeWidth={20}
            strokeDasharray={`${noDash} ${circumference}`}
            strokeDashoffset={noOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
          {/* 가짜(빨강) */}
          <circle
            cx={cx} cy={cy} r={R}
            fill="none"
            stroke="#C8313D"
            strokeWidth={20}
            strokeDasharray={`${yesDash} ${circumference}`}
            strokeDashoffset={yesOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        {/* 중앙 텍스트 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 800, color: '#0F1E36' }}>
            {total.toLocaleString()}명
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#7A8499' }}>참여</span>
        </div>
      </div>

      {/* 범례 */}
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: '#C8313D', display: 'inline-block' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#C8313D' }}>🤖 가짜 {yesPct}%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: '#137F5E', display: 'inline-block' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#137F5E' }}>👁 진짜 {noPct}%</span>
        </div>
      </div>
    </div>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const vote = searchParams.get('vote') as 'yes' | 'no' | null;
  const [commentText, setCommentText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const agreedWithMajority = vote === 'yes'; // yes(가짜)가 62%로 다수
  const scoreDelta = YES_PCT >= 60 && vote === 'yes' ? 20 : YES_PCT < 40 && vote === 'no' ? 20 : YES_PCT >= 40 && YES_PCT <= 60 ? 10 : 5;

  const handleShare = () => {
    const voteText = vote === 'yes' ? '가짜' : '진짜';
    shareContent({ scenario: 'result', voteText, totalVotes: TOTAL });
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 40 }}>

      {/* 참여 완료 배너 */}
      <div
        className="animate-scale-in"
        style={{
          background: agreedWithMajority ? '#1B3A6B' : '#C6953E',
          padding: '28px 16px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ fontSize: 40 }}>{agreedWithMajority ? '👥' : '🦁'}</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.5px' }}>
          {agreedWithMajority ? '다수와 같은 눈!' : '용감한 소수 의견!'}
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: 0, fontWeight: 500 }}>
          {vote === 'yes' ? '가짜 같다고 하셨어요' : '진짜 같다고 하셨어요'}
        </p>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* 점수 획득 카드 */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDE3ED',
            borderRadius: 16,
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(15,30,54,0.06)',
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#7A8499', marginBottom: 4 }}>
              획득 점수
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#0F1E36', letterSpacing: '-0.7px' }}>
              +{scoreDelta}점
            </div>
            <div style={{ fontSize: 12, color: '#7A8499', marginTop: 2 }}>
              {agreedWithMajority && scoreDelta === 20 && '👥 다수와 함께했어요'}
              {!agreedWithMajority && scoreDelta === 10 && '🦁 팽팽한 의견이에요'}
              {scoreDelta === 5 && '참여해줘서 고마워요'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#7A8499', marginBottom: 2 }}>총 점수</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#1B3A6B', letterSpacing: '-0.5px' }}>
              {(2840 + scoreDelta).toLocaleString()}점
            </div>
          </div>
        </div>

        {/* 도넛 차트 */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDE3ED',
            borderRadius: 16,
            padding: '20px 16px',
            boxShadow: '0 2px 8px rgba(15,30,54,0.06)',
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F1E36', margin: '0 0 16px', textAlign: 'center' }}>
            현재 광장의 의견
          </h2>
          <DonutChart yesPct={YES_PCT} noPct={NO_PCT} total={TOTAL} />
        </div>

        {/* 힌트 카드 */}
        <div
          style={{
            background: '#FCF3E0',
            border: '1.5px solid #F2C94C',
            borderRadius: 16,
            padding: '16px 18px',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: '#C6953E', marginBottom: 8, letterSpacing: 0.5 }}>
            💡 많은 분들이 이걸 발견했어요
          </div>
          <p style={{ fontSize: 14, color: '#3D4A60', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            {media.hint}
          </p>
        </div>

        {/* 코멘트 섹션 */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDE3ED',
            borderRadius: 16,
            padding: '16px 16px',
            boxShadow: '0 2px 8px rgba(15,30,54,0.06)',
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F1E36', margin: '0 0 12px' }}>
            왜 그렇게 생각했어요?
          </h2>

          <ReactionBar mediaId={media.id} uid="demo-uid" />

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <textarea
              value={commentText}
              onChange={(e) => {
                if (e.target.value.length <= 140) setCommentText(e.target.value);
              }}
              placeholder="선택사항 · 140자 이내"
              rows={3}
              style={{
                flex: 1,
                border: '1.5px solid #DDE3ED',
                borderRadius: 12,
                padding: '10px 12px',
                fontSize: 14,
                fontFamily: 'inherit',
                color: '#0F1E36',
                resize: 'none',
                outline: 'none',
                background: '#F4F6FA',
                lineHeight: 1.5,
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 12, color: '#7A8499' }}>{commentText.length}/140</span>
            <button
              onClick={() => {
                if (commentText.trim()) setSubmitted(true);
              }}
              style={{
                background: '#1B3A6B',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 10,
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 3px 0 #0F254A',
              }}
            >
              {submitted ? '✓ 등록됨' : '등록'}
            </button>
          </div>

          {/* 코멘트 목록 */}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#7A8499', marginBottom: 4 }}>
              최신 코멘트
            </div>
            {MOCK_COMMENTS.slice(0, 3).map((c) => (
              <CommentItem key={c.id} comment={c} />
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/vote" style={{ display: 'block' }}>
            <RBtn variant="navy" size="xl">다음 가려내기 →</RBtn>
          </Link>
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
            }}
          >
            📤 친구에게 물어보기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ fontSize: 14, color: '#7A8499' }}>로딩 중...</div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
