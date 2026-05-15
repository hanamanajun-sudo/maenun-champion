'use client';

import { useState } from 'react';
import Link from 'next/link';
import RBtn from '@/components/RBtn';

type Source =
  | '카카오톡'
  | '문자·전화'
  | '유튜브'
  | 'SNS'
  | '웹사이트'
  | '기타';

const SOURCES: Source[] = ['카카오톡', '문자·전화', '유튜브', 'SNS', '웹사이트', '기타'];

function ProgressBar({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 4,
            background: s <= step ? '#1B3A6B' : '#DDE3ED',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  );
}

export default function ReportPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [url, setUrl] = useState('');
  const [source, setSource] = useState<Source | null>(null);
  const [reason, setReason] = useState('');
  const [email, setEmail] = useState('');
  const [caseNumber] = useState(`REP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(caseNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 40 }}>
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
        {step > 1 && step < 3 ? (
          <button
            onClick={() => setStep((s) => (s - 1) as 1 | 2)}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#F4F6FA', border: '1px solid #DDE3ED',
              fontSize: 18, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >←</button>
        ) : (
          <Link
            href="/"
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#F4F6FA', border: '1px solid #DDE3ED',
              fontSize: 18, textDecoration: 'none', color: '#0F1E36',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >←</Link>
        )}
        <span style={{ fontSize: 16, fontWeight: 800, color: '#0F1E36' }}>제보하기</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#7A8499' }}>{step}/3</span>
      </div>

      <div style={{ padding: '20px 16px' }}>
        <ProgressBar step={step} />

        {/* ─── STEP 1 ─── */}
        {step === 1 && (
          <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F1E36', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                의심되는 자료를<br />알려주세요
              </h1>
              <p style={{ fontSize: 14, color: '#7A8499', margin: 0, fontWeight: 500 }}>
                카카오톡, 문자, 유튜브 등에서 받으셨나요?
              </p>
            </div>

            {/* URL 입력 */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#3D4A60', display: 'block', marginBottom: 6 }}>
                링크 입력
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="유튜브, 인스타, 뉴스 링크를 넣어주세요"
                style={{
                  width: '100%',
                  border: '1.5px solid #DDE3ED',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  color: '#0F1E36',
                  outline: 'none',
                  background: '#FFFFFF',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1B3A6B')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#DDE3ED')}
              />
            </div>

            {/* 구분선 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: '#DDE3ED' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#7A8499' }}>또는</span>
              <div style={{ flex: 1, height: 1, background: '#DDE3ED' }} />
            </div>

            {/* 파일 업로드 */}
            <div
              style={{
                border: '2px dashed #DDE3ED',
                borderRadius: 14,
                padding: '24px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 28 }}>📁</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#3D4A60' }}>파일 업로드</span>
              <span style={{ fontSize: 12, color: '#7A8499', fontWeight: 500 }}>
                파일 업로드는 준비 중이에요
              </span>
            </div>

            <RBtn
              variant="navy"
              size="lg"
              onClick={() => setStep(2)}
              disabled={!url.trim()}
            >
              다음 →
            </RBtn>
          </div>
        )}

        {/* ─── STEP 2 ─── */}
        {step === 2 && (
          <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F1E36', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                어디서 받으셨나요?
              </h1>
            </div>

            {/* 출처 버튼 2열 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {SOURCES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSource(s)}
                  style={{
                    padding: '12px 10px',
                    borderRadius: 12,
                    border: source === s ? '2px solid #1B3A6B' : '1.5px solid #DDE3ED',
                    background: source === s ? '#EEF2FA' : '#FFFFFF',
                    color: source === s ? '#1B3A6B' : '#3D4A60',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* 수상한 이유 */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#3D4A60', display: 'block', marginBottom: 6 }}>
                수상한 이유 <span style={{ color: '#7A8499', fontWeight: 500 }}>선택 · 200자</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => { if (e.target.value.length <= 200) setReason(e.target.value); }}
                placeholder="왜 이 자료가 의심스러운지 알려주세요"
                rows={4}
                style={{
                  width: '100%',
                  border: '1.5px solid #DDE3ED',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  color: '#0F1E36',
                  resize: 'none',
                  outline: 'none',
                  background: '#FFFFFF',
                  lineHeight: 1.5,
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1B3A6B')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#DDE3ED')}
              />
              <div style={{ textAlign: 'right', fontSize: 11, color: '#7A8499', marginTop: 4 }}>
                {reason.length}/200
              </div>
            </div>

            {/* 이메일 */}
            <div
              style={{
                borderTop: '1px solid #DDE3ED',
                paddingTop: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <label style={{ fontSize: 13, fontWeight: 700, color: '#3D4A60' }}>
                결과를 이메일로 받으시겠어요?{' '}
                <span style={{ color: '#7A8499', fontWeight: 500 }}>선택</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소를 남겨주시면 결과를 알려드려요"
                style={{
                  width: '100%',
                  border: '1.5px solid #DDE3ED',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  color: '#0F1E36',
                  outline: 'none',
                  background: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1B3A6B')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#DDE3ED')}
              />
            </div>

            <RBtn
              variant="navy"
              size="lg"
              onClick={() => setStep(3)}
            >
              제보 완료
            </RBtn>
          </div>
        )}

        {/* ─── STEP 3 ─── */}
        {step === 3 && (
          <div
            className="animate-scale-in"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}
          >
            {/* 완료 아이콘 */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: '#E0F2EA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                marginTop: 12,
              }}
            >
              ✅
            </div>

            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0F1E36', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
                제보가 접수됐어요!
              </h1>
              <p style={{ fontSize: 14, color: '#7A8499', margin: 0, lineHeight: 1.6 }}>
                {email ? '이메일을 남기셨다면 결과가 나오면 알려드릴게요' : '결과가 나오면 앱에서 알려드릴게요'}
              </p>
            </div>

            {/* 사건번호 */}
            <div
              style={{
                background: '#F4F6FA',
                border: '1px solid #DDE3ED',
                borderRadius: 14,
                padding: '14px 20px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#7A8499', marginBottom: 3 }}>사건번호</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#0F1E36', letterSpacing: 0.5 }}>
                  {caseNumber}
                </div>
              </div>
              <button
                onClick={handleCopy}
                style={{
                  background: copied ? '#E0F2EA' : '#FFFFFF',
                  border: `1.5px solid ${copied ? '#137F5E' : '#DDE3ED'}`,
                  borderRadius: 10,
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: copied ? '#137F5E' : '#3D4A60',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {copied ? '✓ 복사됨' : '복사'}
              </button>
            </div>

            {/* 검증 안내 */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #DDE3ED',
                borderRadius: 14,
                padding: '16px',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F1E36', marginBottom: 12 }}>
                이제 어떻게 되나요?
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: '👥', text: '광장에 올라가면 함께 가려낼 예정이에요' },
                  { icon: '💬', text: '커뮤니티 의견으로 진위 여부를 확인해요' },
                  { icon: '🔔', text: '결과가 나오면 알림으로 알려드려요' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: '#3D4A60', fontWeight: 500, lineHeight: 1.5 }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ width: '100%' }}>
              <Link href="/" style={{ display: 'block' }}>
                <RBtn variant="navy" size="lg">홈으로 →</RBtn>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
