'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RBtn from '@/components/RBtn';
import ReactionBar from '@/components/ReactionBar';
import CommentItem from '@/components/CommentItem';
import { submitVote, getComments, addComment, type MediaDoc, type CommentDoc } from '@/lib/firestore';
import { mockMedia } from '@/lib/mockData';
import { shareContent } from '@/lib/share';
import { useUserStore } from '@/lib/store';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function DonutChart({ yesPct, noPct, total }: { yesPct: number; noPct: number; total: number }) {
  const [animated, setAnimated] = useState(false);
  const R = 60;
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * R;
  const yesDash = animated ? (yesPct / 100) * circumference : 0;
  const noDash = animated ? (noPct / 100) * circumference : 0;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative', width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#DDE3ED" strokeWidth={20} />
          <circle
            cx={cx} cy={cy} r={R} fill="none" stroke="#137F5E" strokeWidth={20}
            strokeDasharray={`${noDash} ${circumference}`}
            strokeDashoffset={-yesDash}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
          <circle
            cx={cx} cy={cy} r={R} fill="none" stroke="#C8313D" strokeWidth={20}
            strokeDasharray={`${yesDash} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#0F1E36' }}>{total.toLocaleString()}명</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#7A8499' }}>참여</span>
        </div>
      </div>
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
  const mediaId = searchParams.get('mediaId') ?? 'm1';

  const { uid, user, updateScore } = useUserStore();
  const [media, setMedia] = useState<MediaDoc | null>(null);
  const [scoreDelta, setScoreDelta] = useState(5);
  const [agreedWithMajority, setAgreedWithMajority] = useState(false);
  const [comments, setComments] = useState<CommentDoc[]>([]);
  const [commentText, setCommentText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const voteSubmitted = useRef(false);

  useEffect(() => {
    async function load() {
      // 미디어 로드
      let mediaData: MediaDoc | null = null;
      if (db) {
        try {
          const snap = await getDoc(doc(db, 'media', mediaId));
          if (snap.exists()) mediaData = { id: snap.id, ...snap.data() } as MediaDoc;
        } catch { /* fallback */ }
      }
      if (!mediaData) {
        const fallback = mockMedia.find((m) => m.id === mediaId) ?? mockMedia[0];
        mediaData = { ...fallback, publishedAt: null as never, isActive: true };
      }
      setMedia(mediaData);

      // 투표 저장 (한 번만)
      if (uid && vote && !voteSubmitted.current) {
        voteSubmitted.current = true;
        try {
          const result = await submitVote(uid, mediaId, vote);
          setScoreDelta(result.scoreDelta);
          setAgreedWithMajority(result.agreedWithMajority);
          updateScore(result.scoreDelta);
          // 투표 후 최신 카운트 다시 로드
          if (db) {
            const snap = await getDoc(doc(db, 'media', mediaId));
            if (snap.exists()) setMedia({ id: snap.id, ...snap.data() } as MediaDoc);
          }
        } catch { /* 중복 투표 등 무시 */ }
      } else if (vote) {
        // uid 없을 때 로컬 계산
        const total = mediaData.yesCount + mediaData.noCount;
        const yesPct = total > 0 ? (mediaData.yesCount / total) * 100 : 50;
        if (yesPct >= 60 && vote === 'yes') { setScoreDelta(20); setAgreedWithMajority(true); }
        else if (yesPct <= 40 && vote === 'no') { setScoreDelta(20); setAgreedWithMajority(true); }
        else if (yesPct > 40 && yesPct < 60) { setScoreDelta(10); }
      }

      // 코멘트 로드
      try {
        const c = await getComments(mediaId);
        setComments(c);
      } catch { /* 무시 */ }

      setLoading(false);
    }
    load();
  }, [uid, vote, mediaId, updateScore]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || submitted) return;
    if (uid && user) {
      try {
        await addComment(mediaId, uid, user.nickname, commentText, 'suspicious');
        setSubmitted(true);
      } catch { setSubmitted(true); }
    } else {
      setSubmitted(true);
    }
  };

  if (loading || !media) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ fontSize: 14, color: '#7A8499' }}>결과 집계 중...</div>
      </div>
    );
  }

  const total = media.yesCount + media.noCount;
  const yesPct = total > 0 ? Math.round((media.yesCount / total) * 100) : 50;
  const noPct = 100 - yesPct;
  const totalScore = (user?.score ?? 2840);

  const handleShare = () => {
    const voteText = vote === 'yes' ? '가짜' : '진짜';
    shareContent({ scenario: 'result', voteText, totalVotes: total });
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
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
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

        {/* 점수 카드 */}
        <div style={{ background: '#FFFFFF', border: '1px solid #DDE3ED', borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(15,30,54,0.06)' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#7A8499', marginBottom: 4 }}>획득 점수</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#0F1E36', letterSpacing: '-0.7px' }}>+{scoreDelta}점</div>
            <div style={{ fontSize: 12, color: '#7A8499', marginTop: 2 }}>
              {agreedWithMajority && scoreDelta === 20 && '👥 다수와 함께했어요'}
              {!agreedWithMajority && scoreDelta === 10 && '🦁 팽팽한 의견이에요'}
              {scoreDelta === 5 && '참여해줘서 고마워요'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#7A8499', marginBottom: 2 }}>총 점수</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#1B3A6B', letterSpacing: '-0.5px' }}>
              {totalScore.toLocaleString()}점
            </div>
          </div>
        </div>

        {/* 도넛 차트 */}
        <div style={{ background: '#FFFFFF', border: '1px solid #DDE3ED', borderRadius: 16, padding: '20px 16px', boxShadow: '0 2px 8px rgba(15,30,54,0.06)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F1E36', margin: '0 0 16px', textAlign: 'center' }}>
            현재 광장의 의견
          </h2>
          <DonutChart yesPct={yesPct} noPct={noPct} total={total} />
        </div>

        {/* 힌트 카드 */}
        <div style={{ background: '#FCF3E0', border: '1.5px solid #F2C94C', borderRadius: 16, padding: '16px 18px' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#C6953E', marginBottom: 8, letterSpacing: 0.5 }}>
            💡 많은 분들이 이걸 발견했어요
          </div>
          <p style={{ fontSize: 14, color: '#3D4A60', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            {media.hint}
          </p>
        </div>

        {/* 코멘트 섹션 */}
        <div style={{ background: '#FFFFFF', border: '1px solid #DDE3ED', borderRadius: 16, padding: '16px 16px', boxShadow: '0 2px 8px rgba(15,30,54,0.06)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0F1E36', margin: '0 0 12px' }}>
            왜 그렇게 생각했어요?
          </h2>

          <ReactionBar mediaId={mediaId} uid={uid ?? 'guest'} />

          <div style={{ marginTop: 12 }}>
            <textarea
              value={commentText}
              onChange={(e) => { if (e.target.value.length <= 140) setCommentText(e.target.value); }}
              placeholder="선택사항 · 140자 이내"
              rows={3}
              style={{
                width: '100%', boxSizing: 'border-box',
                border: '1.5px solid #DDE3ED', borderRadius: 12,
                padding: '10px 12px', fontSize: 14,
                fontFamily: 'inherit', color: '#0F1E36',
                resize: 'none', outline: 'none',
                background: '#F4F6FA', lineHeight: 1.5,
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 12, color: '#7A8499' }}>{commentText.length}/140</span>
            <button
              onClick={handleCommentSubmit}
              disabled={submitted}
              style={{
                background: submitted ? '#DDE3ED' : '#1B3A6B',
                color: submitted ? '#7A8499' : '#FFFFFF',
                border: 'none', borderRadius: 10,
                padding: '8px 18px', fontSize: 13, fontWeight: 700,
                cursor: submitted ? 'default' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: submitted ? 'none' : '0 3px 0 #0F254A',
              }}
            >
              {submitted ? '✓ 등록됨' : '등록'}
            </button>
          </div>

          {/* 코멘트 목록 */}
          {comments.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#7A8499', marginBottom: 4 }}>최신 코멘트</div>
              {comments.slice(0, 3).map((c, i) => (
                <CommentItem key={c.id ?? i} comment={c} />
              ))}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/vote" style={{ display: 'block' }}>
            <RBtn variant="navy" size="xl">다음 가려내기 →</RBtn>
          </Link>
          <button
            onClick={handleShare}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: '#FFFFFF', border: '1.5px solid #DDE3ED',
              borderRadius: 16, padding: '14px',
              fontSize: 15, fontWeight: 700, color: '#1B3A6B',
              cursor: 'pointer', fontFamily: 'inherit',
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
