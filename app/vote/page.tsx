'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Mark from '@/components/Mark';
import RBtn from '@/components/RBtn';
import VideoEmbed from '@/components/VideoEmbed';
import { mockMedia } from '@/lib/mockData';

const media = mockMedia[0]; // m1: 대통령 충격 발언 영상

export default function VotePage() {
  const router = useRouter();
  const [timer, setTimer] = useState(15);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleVote = (vote: 'yes' | 'no') => {
    router.push(`/result?vote=${vote}`);
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 32 }}>
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Link
          href="/"
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

        <span
          style={{
            background: '#FCF3E0',
            color: '#C6953E',
            fontSize: 12,
            fontWeight: 800,
            padding: '5px 12px',
            borderRadius: 10,
            letterSpacing: 0.3,
          }}
        >
          함께 가려내기 #87
        </span>

        {/* 타이머 칩 */}
        <span
          style={{
            background: timer < 6 ? '#C8313D' : '#1B3A6B',
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 800,
            padding: '5px 12px',
            borderRadius: 10,
            minWidth: 56,
            textAlign: 'center',
            transition: 'background 0.3s',
          }}
        >
          ⏱ {timer}초
        </span>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* 질문 */}
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1.5,
              color: '#7A8499',
              marginBottom: 8,
              textTransform: 'uppercase',
            }}
          >
            QUESTION
          </div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: '#0F1E36',
              lineHeight: 1.4,
              letterSpacing: '-0.4px',
              margin: 0,
            }}
          >
            이 영상, 혹시{' '}
            <Mark>AI가 만든 가짜</Mark>
            일까요?
          </h1>
          <p style={{ fontSize: 14, color: '#3D4A60', marginTop: 6, marginBottom: 0, fontWeight: 500 }}>
            지금 여러분의 눈을 믿어주세요.
          </p>
        </div>

        {/* 비디오 */}
        <VideoEmbed embedUrl={media.embedUrl} title={media.title} />

        {/* LIVE 카운터 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#FCE8EA',
            borderRadius: 12,
            padding: '8px 14px',
          }}
        >
          <span
            className="animate-pulse-dot"
            style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8313D', display: 'inline-block' }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#C8313D' }}>
            🔴 지금 8,427명이 함께 답하고 있어요
          </span>
        </div>

        {/* 힌트 버튼 */}
        <div>
          <button
            onClick={() => setShowHint((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: showHint ? '#FCF3E0' : '#FFFFFF',
              border: `1.5px solid ${showHint ? '#C6953E' : '#DDE3ED'}`,
              borderRadius: 12,
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: 700,
              color: showHint ? '#C6953E' : '#3D4A60',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
              width: '100%',
            }}
          >
            💡 단서 보기
            <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.7 }}>
              {showHint ? '▲' : '▼'}
            </span>
          </button>

          {showHint && (
            <div
              style={{
                marginTop: 8,
                background: '#FCF3E0',
                border: '1.5px solid #F2C94C',
                borderRadius: 12,
                padding: '12px 16px',
                fontSize: 14,
                color: '#3D4A60',
                lineHeight: 1.6,
                animation: 'fadeUp 0.2s ease-out both',
              }}
            >
              💡 {media.hint}
            </div>
          )}
        </div>

        {/* 답변 버튼 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => handleVote('yes')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              minHeight: 88,
              background: '#C8313D',
              border: 'none',
              borderRadius: 16,
              cursor: 'pointer',
              boxShadow: '0 4px 0 #9F2530',
              transition: 'all 0.1s',
              fontFamily: 'inherit',
              padding: '16px',
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(3px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 0 #9F2530';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = '';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 0 #9F2530';
            }}
          >
            <span style={{ fontSize: 22 }}>🤖</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
              가짜 같아요!
            </span>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>
              AI가 만든 것 같습니다
            </span>
          </button>

          <button
            onClick={() => handleVote('no')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              minHeight: 88,
              background: '#137F5E',
              border: 'none',
              borderRadius: 16,
              cursor: 'pointer',
              boxShadow: '0 4px 0 #0F6549',
              transition: 'all 0.1s',
              fontFamily: 'inherit',
              padding: '16px',
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(3px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 0 #0F6549';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = '';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 0 #0F6549';
            }}
          >
            <span style={{ fontSize: 22 }}>👁</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
              진짜 같아요!
            </span>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>
              실제인 것 같습니다
            </span>
          </button>
        </div>

        {/* 하단 안내 */}
        <p
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: '#7A8499',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          틀려도 괜찮아요. 함께 의심하는 게 중요해요 😊
        </p>
      </div>
    </div>
  );
}
