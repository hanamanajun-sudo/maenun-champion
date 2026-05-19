'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { submitReport } from '@/lib/firestore';
import { useUserStore } from '@/lib/store';

const DAILY_LIMIT = 5;
const STORAGE_KEY = 'reportCount';

function getCountToday(): number {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return d.date === new Date().toDateString() ? (d.count ?? 0) : 0;
  } catch { return 0; }
}

function incrementCount(): void {
  try {
    const today = new Date().toDateString();
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    const count = (d.date === today ? (d.count ?? 0) : 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count }));
  } catch {}
}

export default function ReportPage() {
  const router = useRouter();
  const { uid, user } = useUserStore();
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'limit'>('idle');
  const [caseNumber, setCaseNumber] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    if (getCountToday() >= DAILY_LIMIT) {
      setStatus('limit');
      return;
    }

    setStatus('loading');
    try {
      const cn = await submitReport(uid ?? 'anon', {
        nickname: user?.nickname ?? '익명',
        embedUrl: url.trim(),
        source: '',
        reason: '',
      });
      incrementCount();
      setCaseNumber(cn);
      setStatus('done');
    } catch (err) {
      console.error('제보 실패:', err);
      setStatus('idle');
    }
  }

  if (status === 'done') {
    return (
      <div
        style={{
          minHeight: '100dvh',
          background: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0F1E36', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
          제보가 접수됐어요
        </h2>
        <p style={{ fontSize: 14, color: '#7A8499', margin: '0 0 24px', lineHeight: 1.6 }}>
          검토 후 콘텐츠로 등록되면<br />광장에서 함께 가려낼게요.
        </p>
        <div
          style={{
            background: '#F4F6FA',
            border: '1px solid #DDE3ED',
            borderRadius: 12,
            padding: '12px 20px',
            fontSize: 13,
            color: '#3D4A60',
            fontWeight: 700,
            marginBottom: 32,
            letterSpacing: 0.5,
          }}
        >
          접수번호: {caseNumber}
        </div>
        <Link
          href="/"
          style={{
            background: '#1B3A6B',
            color: '#fff',
            borderRadius: 14,
            padding: '14px 32px',
            fontSize: 15,
            fontWeight: 800,
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 96 }}>
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            background: '#F4F6FA',
            border: '1px solid #DDE3ED',
            fontSize: 18,
            color: '#0F1E36',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          ←
        </button>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#0F1E36' }}>의심 콘텐츠 제보</span>
      </div>

      <div style={{ padding: '28px 20px' }}>
        <p style={{ fontSize: 14, color: '#7A8499', margin: '0 0 24px', lineHeight: 1.6 }}>
          AI가 만든 것 같은 영상이나 사진의 링크를 알려주세요.<br />
          검토 후 광장에 올려 함께 가려낼게요.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="YouTube, Instagram, 뉴스 링크 등"
            required
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 15,
              border: '1.5px solid #DDE3ED',
              borderRadius: 14,
              background: '#FFFFFF',
              color: '#0F1E36',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          {status === 'limit' && (
            <p style={{ fontSize: 13, color: '#C8313D', fontWeight: 600, margin: 0 }}>
              오늘은 최대 {DAILY_LIMIT}건까지 제보할 수 있어요.
            </p>
          )}

          <button
            type="submit"
            disabled={!url.trim() || status === 'loading'}
            style={{
              background: !url.trim() || status === 'loading' ? '#DDE3ED' : '#1B3A6B',
              color: !url.trim() || status === 'loading' ? '#7A8499' : '#FFFFFF',
              border: 'none',
              borderRadius: 14,
              padding: '15px',
              fontSize: 16,
              fontWeight: 800,
              cursor: !url.trim() || status === 'loading' ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {status === 'loading' ? '제출 중...' : '제보하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
