'use client';

export const runtime = 'edge';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, Target, WarningOctagon, Trophy,
  Sun, CheckCircle, UsersThree, Bell,
  Lock, Sparkle,
} from '@phosphor-icons/react';
import { auth } from '@/lib/firebase';
import { updateNickname } from '@/lib/firestore';

const ADJECTIVES = ['호기심많은', '날카로운', '신중한', '용감한', '꼼꼼한', '재빠른', '현명한'];
const NOUNS = ['너구리', '독수리', '고양이', '여우', '부엉이', '두더지', '수달'];

function genNickname() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}${noun}`;
}

const FEATURES = [
  { Icon: Target,         color: '#1B3A6B', bg: '#EEF2F8', title: '오늘의 영상',    desc: '매일 새로운 AI 의심 영상이 올라와요. 진짜인지 가짜인지 투표해보세요.' },
  { Icon: WarningOctagon, color: '#C8313D', bg: '#FCE8EA', title: '의심 영상 제보', desc: '내가 받은 수상한 영상·사진을 올리면 1,000명 패널이 함께 검증해요.' },
  { Icon: Trophy,         color: '#C6953E', bg: '#FCF3E0', title: '점수·뱃지',      desc: '맞출수록 점수가 쌓이고, 명예 뱃지를 수집할 수 있어요.' },
];

const NOTIF_ITEMS = [
  { key: 'morning', Icon: Sun,           color: '#C6953E', title: '아침 도전 알림',    desc: '매일 오전 7시, 오늘의 영상 도착' },
  { key: 'result',  Icon: CheckCircle,   color: '#137F5E', title: '검증 결과 알림',    desc: '내가 제보한 영상의 판정이 나오면 알림' },
  { key: 'friend',  Icon: UsersThree,    color: '#1B3A6B', title: '친구 활동 알림',    desc: '내가 공유한 문제를 친구가 풀었을 때' },
  { key: 'urgent',  Icon: Bell,          color: '#C8313D', title: '긴급 가짜 영상 경보', desc: '바이럴 중인 위험 딥페이크 속보' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState(genNickname);
  const [suggestions] = useState(() => Array.from({ length: 4 }, genNickname));
  const [notifs, setNotifs] = useState({ morning: true, result: true, friend: false, urgent: true });
  const [saving, setSaving] = useState(false);

  const ctaLabels = ['시작하기', '다음으로', `${nickname}으로 시작하기`, '지금 시작!'];

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setSaving(true);
      try {
        const user = auth?.currentUser;
        if (user) await updateNickname(user.uid, nickname);
      } catch {}
      localStorage.setItem('onboarded', '1');
      router.push('/');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarded', '1');
    router.push('/');
  };

  return (
    <div style={{
      height: '100dvh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      maxWidth: 480, margin: '0 auto',
    }}>
      {/* 진행 막대 */}
      <div style={{ padding: '16px 20px 0', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, display: 'flex', gap: 4 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 4,
              background: i <= step ? 'var(--navy)' : 'var(--border)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
        {step < 3 && (
          <button onClick={handleSkip} style={{ background: 'none', border: 'none', fontSize: 14, color: 'var(--ink-mute)', cursor: 'pointer', padding: '4px 0', fontFamily: 'inherit' }}>
            건너뛰기
          </button>
        )}
      </div>

      {/* 스크롤 가능한 콘텐츠 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px 8px' }}>

        {/* Step 0: 환영 */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animation: 'fadeUp 0.3s ease-out both' }}>
            <div style={{
              width: 100, height: 100, borderRadius: 28,
              background: 'linear-gradient(135deg, #1B3A6B, #0F254A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 24, boxShadow: '0 8px 24px rgba(27,58,107,0.3)',
            }}>
              <ShieldCheck size={56} color="#C6953E" weight="fill" />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
              AI감별사
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--ink)', letterSpacing: -0.8, lineHeight: 1.25, marginBottom: 16 }}>
              진짜인지 가짜인지<br />
              <span style={{ background: 'linear-gradient(180deg, transparent 58%, #F2C94C 58%, #F2C94C 90%, transparent 90%)', padding: '0 4px' }}>
                함께 가려내요
              </span>
            </h1>
            <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 28 }}>
              AI가 만든 가짜 영상·사진이 넘쳐나는 세상,<br />보는 눈을 함께 키워요.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--red-soft)', borderRadius: 12, padding: '10px 16px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', animation: 'pulse-dot 1.5s infinite', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--red)' }}>지금 12,847명이 함께하고 있어요</span>
            </div>
          </div>
        )}

        {/* Step 1: 기능 소개 */}
        {step === 1 && (
          <div style={{ animation: 'fadeUp 0.3s ease-out both' }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', letterSpacing: -0.6, marginBottom: 6 }}>이렇게 가려내요</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-mute)', marginBottom: 24 }}>세 가지로 보는 눈을 키워요</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FEATURES.map(f => (
                <div key={f.title} style={{ background: 'var(--surface)', borderRadius: 16, padding: '16px 18px', display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 1px 3px rgba(15,30,54,0.06)' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <f.Icon size={28} color={f.color} weight="fill" />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 3 }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: 별명 */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeUp 0.3s ease-out both' }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', letterSpacing: -0.6, marginBottom: 6 }}>별명을 정해요</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-mute)', marginBottom: 24 }}>이름 대신 별명으로 활동해요</p>
            <input
              value={nickname}
              onChange={e => setNickname(e.target.value.slice(0, 12))}
              placeholder="별명 입력"
              style={{
                width: '100%', padding: '16px', fontSize: 22, fontWeight: 800,
                textAlign: 'center', border: '2px solid var(--navy)', borderRadius: 14,
                background: 'var(--surface)', color: 'var(--ink)', outline: 'none',
                marginBottom: 16, boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />
            <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--ink-mute)', fontWeight: 600 }}>추천 별명</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => setNickname(s)} style={{
                  padding: '8px 14px', borderRadius: 20, border: '1.5px solid var(--border)',
                  background: nickname === s ? 'var(--navy)' : 'var(--surface)',
                  color: nickname === s ? 'white' : 'var(--ink-soft)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {s}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--green-soft)', borderRadius: 12 }}>
              <Lock size={18} color="var(--green)" weight="fill" />
              <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>로그인 없이 바로 시작해요. 이메일·전화번호 불필요.</span>
            </div>
          </div>
        )}

        {/* Step 3: 알림 */}
        {step === 3 && (
          <div style={{ animation: 'fadeUp 0.3s ease-out both' }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', letterSpacing: -0.6, marginBottom: 6 }}>알림 설정</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-mute)', marginBottom: 20 }}>나중에 언제든 바꿀 수 있어요</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {NOTIF_ITEMS.map(item => (
                <div key={item.key} style={{ background: 'var(--surface)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 3px rgba(15,30,54,0.06)' }}>
                  <item.Icon size={26} color={item.color} weight="fill" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{item.desc}</div>
                  </div>
                  <button
                    onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                    style={{
                      width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
                      background: notifs[item.key as keyof typeof notifs] ? 'var(--navy)' : 'var(--border)',
                      position: 'relative', flexShrink: 0, transition: 'background 0.2s',
                    }}
                  >
                    <span style={{
                      position: 'absolute', top: 4,
                      left: notifs[item.key as keyof typeof notifs] ? 24 : 4,
                      width: 20, height: 20, borderRadius: '50%', background: 'white',
                      transition: 'left 0.2s',
                    }} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--gold-soft)', borderRadius: 12 }}>
              <Sparkle size={18} color="var(--gold)" weight="fill" />
              <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>개인정보를 받지 않아요. 별명만으로 모든 활동 가능.</span>
            </div>
          </div>
        )}
      </div>

      {/* 하단 CTA — 항상 화면 바닥에 고정 */}
      <div style={{ padding: '12px 24px 32px', flexShrink: 0, background: 'var(--bg)' }}>
        <button
          onClick={handleNext}
          disabled={saving || (step === 2 && !nickname.trim())}
          style={{
            width: '100%', padding: '18px', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: 'var(--navy)', color: 'white', fontSize: 17, fontWeight: 800,
            boxShadow: '0 4px 0 #0F254A', transition: 'all 0.1s', fontFamily: 'inherit',
            opacity: (step === 2 && !nickname.trim()) ? 0.5 : 1,
          }}
        >
          {saving ? '저장 중...' : ctaLabels[step]}
        </button>
      </div>
    </div>
  );
}
