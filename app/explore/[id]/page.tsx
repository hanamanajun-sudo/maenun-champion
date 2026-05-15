'use client';

import { use } from 'react';
import Link from 'next/link';
import VideoEmbed from '@/components/VideoEmbed';
import VerdictBadge from '@/components/VerdictBadge';
import MiniBar from '@/components/MiniBar';
import ReactionBar from '@/components/ReactionBar';
import CommentItem from '@/components/CommentItem';
import RBtn from '@/components/RBtn';
import { mockMedia } from '@/lib/mockData';
import { shareContent } from '@/lib/share';
import { useState, useEffect } from 'react';

const MOCK_COMMENTS = [
  { id: 'c1', nickname: '날카로운독수리', text: '입 모양이 확실히 어색했어요. 말이 끝날 때 입이 늦게 닫혀요.', reaction: 'suspicious' as const, likes: 47 },
  { id: 'c2', nickname: '신중한여우', text: '배경 화면이 흔들리는 것 같았는데 사람은 너무 선명해요.', reaction: 'suspicious' as const, likes: 31 },
  { id: 'c3', nickname: '차분한부엉이', text: '저는 진짜인 것 같았는데 생각보다 많은 분들이 가짜라고 하시네요.', reaction: 'interesting' as const, likes: 14 },
];

function DonutSmall({ yesPct, noPct }: { yesPct: number; noPct: number }) {
  const [animated, setAnimated] = useState(false);
  const R = 50;
  const cx = 64;
  const cy = 64;
  const circumference = 2 * Math.PI * R;
  const yesDash = animated ? (yesPct / 100) * circumference : 0;
  const noDash = animated ? (noPct / 100) * circumference : 0;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ position: 'relative', width: 128, height: 128, flexShrink: 0 }}>
        <svg width="128" height="128" viewBox="0 0 128 128">
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#DDE3ED" strokeWidth={18} />
          <circle
            cx={cx} cy={cy} r={R}
            fill="none" stroke="#137F5E" strokeWidth={18}
            strokeDasharray={`${noDash} ${circumference}`}
            strokeDashoffset={0}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
          <circle
            cx={cx} cy={cy} r={R}
            fill="none" stroke="#C8313D" strokeWidth={18}
            strokeDasharray={`${yesDash} ${circumference}`}
            strokeDashoffset={-noDash}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 900, color: '#C8313D' }}>{yesPct}%</span>
          <span style={{ fontSize: 9, color: '#7A8499', fontWeight: 600 }}>가짜</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: '#C8313D', display: 'inline-block', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#C8313D' }}>🤖 가짜 같아요</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0F1E36' }}>{yesPct}%</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: '#137F5E', display: 'inline-block', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#137F5E' }}>👁 진짜 같아요</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0F1E36' }}>{noPct}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExploreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const media = mockMedia.find((m) => m.id === id) ?? mockMedia[0];
  const [commentText, setCommentText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hasVoted] = useState(false);

  const yesPct = Math.round((media.yesCount / media.totalVotes) * 100);
  const noPct = 100 - yesPct;

  const handleShare = () => {
    shareContent({ scenario: 'video', title: media.title, totalVotes: media.totalVotes });
  };

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
          href="/explore"
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            background: '#F4F6FA',
            border: '1px solid #DDE3ED',
            textDecoration: 'none',
            fontSize: 18,
            color: '#0F1E36',
          }}
        >
          ←
        </Link>
        <span style={{ fontSize: 15, fontWeight: 800, color: '#0F1E36' }}>상세 보기</span>
        <button
          onClick={handleShare}
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            background: '#F4F6FA',
            border: '1px solid #DDE3ED',
            fontSize: 16,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          📤
        </button>
      </div>

      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 비디오 */}
        <VideoEmbed embedUrl={media.embedUrl} title={media.title} />

        {/* 제목 + 배지 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <VerdictBadge yesCount={media.yesCount} noCount={media.noCount} contested={media.contested} />
            <span
              style={{
                background: '#F4F6FA',
                color: '#7A8499',
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 6,
              }}
            >
              {media.kind === 'video' ? '🎬 영상' : '📷 사진'}
            </span>
          </div>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#0F1E36',
              margin: '0 0 6px',
              letterSpacing: '-0.3px',
              lineHeight: 1.4,
            }}
          >
            {media.title}
          </h1>
          <p style={{ fontSize: 13, color: '#7A8499', margin: 0, fontWeight: 600 }}>
            {media.totalVotes.toLocaleString()}명 참여
          </p>
        </div>

        {/* MiniBar 크게 */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDE3ED',
            borderRadius: 14,
            padding: '14px 16px',
          }}
        >
          <MiniBar yesCount={media.yesCount} noCount={media.noCount} />
        </div>

        {/* 광장의 의견 도넛 차트 */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDE3ED',
            borderRadius: 16,
            padding: '16px',
            boxShadow: '0 2px 8px rgba(15,30,54,0.05)',
          }}
        >
          <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0F1E36', margin: '0 0 14px' }}>
            광장의 의견
          </h2>
          <DonutSmall yesPct={yesPct} noPct={noPct} />
        </div>

        {/* 투표 버튼 또는 참여 완료 */}
        {!hasVoted ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/result?vote=yes" style={{ flex: 1, display: 'block' }}>
              <RBtn variant="red" size="lg">🤖 가짜 같아요</RBtn>
            </Link>
            <Link href="/result?vote=no" style={{ flex: 1, display: 'block' }}>
              <RBtn variant="green" size="lg">👁 진짜 같아요</RBtn>
            </Link>
          </div>
        ) : (
          <div
            style={{
              background: '#F4F6FA',
              border: '1px solid #DDE3ED',
              borderRadius: 12,
              padding: '12px 16px',
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#7A8499',
            }}
          >
            3일 전에 참여했어요 ✓
          </div>
        )}

        {/* ReactionBar */}
        <ReactionBar mediaId={media.id} uid="demo-uid" />

        {/* 코멘트 전체 목록 */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #DDE3ED',
            borderRadius: 16,
            padding: '16px',
            boxShadow: '0 2px 8px rgba(15,30,54,0.05)',
          }}
        >
          <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0F1E36', margin: '0 0 12px' }}>
            코멘트 {MOCK_COMMENTS.length}개
          </h2>

          {/* 코멘트 입력창 */}
          <div style={{ marginBottom: 16 }}>
            <textarea
              value={commentText}
              onChange={(e) => {
                if (e.target.value.length <= 140) setCommentText(e.target.value);
              }}
              placeholder="이 영상에 대해 어떻게 생각하세요? (140자)"
              rows={3}
              style={{
                width: '100%',
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
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              <span style={{ fontSize: 12, color: '#7A8499' }}>{commentText.length}/140</span>
              <button
                onClick={() => { if (commentText.trim()) setSubmitted(true); }}
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
          </div>

          {/* 코멘트 리스트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MOCK_COMMENTS.map((c) => (
              <CommentItem key={c.id} comment={c} />
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
            marginBottom: 8,
          }}
        >
          📤 이 영상 공유하기
        </button>
      </div>
    </div>
  );
}
