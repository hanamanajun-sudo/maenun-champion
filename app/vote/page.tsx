'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bot, Eye, Timer, Lightbulb } from 'lucide-react';
import Mark from '@/components/Mark';
import VideoEmbed from '@/components/VideoEmbed';
import { getTodayQuiz, type MediaDoc } from '@/lib/firestore';
import { mockMedia } from '@/lib/mockData';

function toMediaDoc(m: typeof mockMedia[0]): MediaDoc {
  return { ...m, publishedAt: null as never, isActive: true };
}

export default function VotePage() {
  const router = useRouter();
  const [timer, setTimer] = useState(15);
  const [showHint, setShowHint] = useState(false);
  const [media, setMedia] = useState<MediaDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTodayQuiz()
      .then((m) => setMedia(m ?? toMediaDoc(mockMedia[0])))
      .catch(() => setMedia(toMediaDoc(mockMedia[0])))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleVote = (vote: 'yes' | 'no') => {
    if (!media) return;
    router.push(`/result?vote=${vote}&mediaId=${media.id}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ fontSize: 14, color: '#7A8499' }}>불러오는 중...</div>
      </div>
    );
  }

  if (!media) return null;

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
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 10,
            background: '#F4F6FA',
            border: '1px solid #DDE3ED',
            textDecoration: 'none',
            fontSize: 18, color: '#0F1E36',
          }}
        >
          ←
        </Link>

        <span style={{ background: '#FCF3E0', color: '#C6953E', fontSize: 12, fontWeight: 800, padding: '5px 12px', borderRadius: 10, letterSpacing: 0.3 }}>
          함께 가려내기
        </span>

        <span
          style={{
            background: timer < 6 ? '#C8313D' : 'var(--teal)',
            color: '#FFFFFF',
            fontSize: 13, fontWeight: 800,
            padding: '5px 12px', borderRadius: 10,
            minWidth: 56, textAlign: 'center',
            transition: 'background 0.3s',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <Timer size={13} /> {timer}초
        </span>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* 질문 */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: '#7A8499', marginBottom: 8, textTransform: 'uppercase' }}>
            QUESTION
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0F1E36', lineHeight: 1.4, letterSpacing: '-0.4px', margin: 0 }}>
            이 {media.kind === 'video' ? '영상' : '사진'}, 혹시{' '}
            <Mark>AI가 만든 가짜</Mark>일까요?
          </h1>
          <p style={{ fontSize: 14, color: '#3D4A60', marginTop: 6, marginBottom: 0, fontWeight: 500 }}>
            지금 여러분의 눈을 믿어주세요.
          </p>
        </div>

        {/* 제목 */}
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0F1E36', letterSpacing: '-0.3px' }}>
          {media.title}
        </div>

        {/* 비디오 */}
        <VideoEmbed embedUrl={media.embedUrl} title={media.title} />

        {/* LIVE 카운터 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FCE8EA', borderRadius: 12, padding: '8px 14px' }}>
          <span className="animate-pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8313D', display: 'inline-block' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#C8313D' }}>
            🔴 {media.totalVotes.toLocaleString()}명이 함께 답했어요
          </span>
        </div>

        {/* 힌트 버튼 */}
        <div>
          <button
            onClick={() => setShowHint((v) => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: showHint ? 'var(--yellow-soft)' : '#FFFFFF',
              border: `1.5px solid ${showHint ? 'var(--yellow)' : '#DDE3ED'}`,
              borderRadius: 12, padding: '10px 16px',
              fontSize: 14, fontWeight: 700,
              color: showHint ? 'var(--yellow-deep)' : '#3D4A60',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.2s', width: '100%',
            }}
          >
            <Lightbulb size={16} />
            단서 보기
            <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.7 }}>{showHint ? '▲' : '▼'}</span>
          </button>

          {showHint && (
            <div style={{
              marginTop: 8, background: 'var(--yellow-soft)',
              border: '1.5px solid var(--yellow)', borderRadius: 12,
              padding: '12px 16px', fontSize: 14, color: '#3D4A60',
              lineHeight: 1.6, animation: 'fadeUp 0.2s ease-out both',
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <Lightbulb size={16} color="var(--yellow-deep)" style={{ flexShrink: 0, marginTop: 2 }} />
              {media.hint}
            </div>
          )}
        </div>

        {/* 답변 버튼 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => handleVote('yes')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              minHeight: 88, background: 'var(--teal)', border: 'none', borderRadius: 16,
              cursor: 'pointer', boxShadow: '0 4px 0 var(--teal-deep)',
              transition: 'all 0.1s', fontFamily: 'inherit', padding: '16px 24px',
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(3px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 0 var(--teal-deep)';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = '';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 0 var(--teal-deep)';
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={28} color="#FFFFFF" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.3px' }}>AI일 것 같아요</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>AI가 만든 가짜 같습니다</div>
            </div>
          </button>

          <button
            onClick={() => handleVote('no')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              minHeight: 88, background: 'var(--yellow)', border: 'none', borderRadius: 16,
              cursor: 'pointer', boxShadow: '0 4px 0 var(--yellow-deep)',
              transition: 'all 0.1s', fontFamily: 'inherit', padding: '16px 24px',
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(3px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 0 var(--yellow-deep)';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = '';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 0 var(--yellow-deep)';
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Eye size={28} color="#0F1E36" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0F1E36', letterSpacing: '-0.3px' }}>진짜일 것 같아요</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.55)' }}>실제로 찍은 것 같습니다</div>
            </div>
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#7A8499', lineHeight: 1.5, margin: 0 }}>
          틀려도 괜찮아요. 함께 의심하는 게 중요해요 😊
        </p>
      </div>
    </div>
  );
}
