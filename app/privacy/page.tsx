'use client';

export const runtime = 'edge';

import Link from 'next/link';

const SECTIONS = [
  {
    title: '1. 수집하는 정보',
    content: `AI감별사은 최소한의 정보만 수집합니다.

• 별명(닉네임): 사용자가 직접 입력하거나 자동 생성된 익명 별명
• 투표 기록: 어떤 영상에 어떻게 투표했는지 (개인 식별 불가 형태)
• 제보 내용: 사용자가 직접 제출한 의심 영상·사진 URL 및 설명
• 기기 식별자: Firebase 익명 인증 UID (이메일·전화번호와 무관)

수집하지 않는 정보: 이름, 이메일, 전화번호, 주민등록번호, 위치정보`,
  },
  {
    title: '2. 정보 이용 목적',
    content: `수집된 정보는 다음 목적으로만 사용됩니다.

• 투표 결과 집계 및 통계 제공
• 점수·뱃지·랭킹 등 게임화 기능 운영
• 제보된 영상의 커뮤니티 검증 처리
• 서비스 품질 개선 및 악용 방지`,
  },
  {
    title: '3. 정보 보관 및 파기',
    content: `• 회원 탈퇴 시 모든 개인 데이터를 즉시 삭제합니다.
• 익명 계정(Firebase Anonymous Auth) 데이터는 90일 미접속 시 자동 삭제됩니다.
• 제보 영상 URL은 검증 완료 후 6개월 보관 후 삭제됩니다.`,
  },
  {
    title: '4. 제3자 제공',
    content: `사용자의 개인정보를 외부에 판매하거나 제공하지 않습니다.

단, 아래의 경우는 예외입니다.
• 법령에 의한 수사기관의 요청
• 서비스 운영을 위한 Firebase(Google) 인프라 이용 (데이터 처리 위탁)

Firebase의 개인정보 처리방침: https://firebase.google.com/support/privacy`,
  },
  {
    title: '5. 쿠키 및 유사 기술',
    content: `• localStorage를 사용해 온보딩 완료 여부를 기기에 저장합니다.
• 광고 추적 쿠키를 사용하지 않습니다.
• 소셜 로그인(구글 등) 연동 시 해당 서비스의 쿠키 정책이 적용됩니다.`,
  },
  {
    title: '6. 사용자 권리',
    content: `사용자는 언제든지 다음 권리를 행사할 수 있습니다.

• 내 데이터 조회: 앱 내 '내 활동' 화면에서 확인
• 데이터 삭제: 앱 설정 > 계정 삭제 또는 아래 이메일로 요청
• 별명 변경: 프로필 화면에서 직접 변경 가능

요청 이메일: hanamanajun@gmail.com`,
  },
  {
    title: '7. 아동 개인정보',
    content: `AI감별사은 만 14세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다. 만 14세 미만은 보호자의 동의 하에 서비스를 이용해야 합니다.`,
  },
  {
    title: '8. 개인정보 처리방침 변경',
    content: `본 방침이 변경될 경우 앱 내 공지 또는 이메일을 통해 7일 전에 사전 안내합니다.

최초 시행일: 2026년 5월 16일
최근 업데이트: 2026년 5월 16일`,
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 80 }}>
      {/* 헤더 */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <Link href="/profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--surface)', textDecoration: 'none', fontSize: 18 }}>
          ←
        </Link>
        <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--ink)' }}>개인정보처리방침</span>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 20px' }}>
        {/* 인트로 */}
        <div style={{ background: 'var(--navy)', borderRadius: 16, padding: '20px', marginBottom: 24, color: 'white' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#C6953E', letterSpacing: 1, marginBottom: 8 }}>AI감별사</div>
          <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 10, lineHeight: 1.3 }}>개인정보를 소중히 다룹니다</h1>
          <p style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.6 }}>
            AI감별사은 이메일, 전화번호, 이름을 수집하지 않습니다. 별명 하나만으로 모든 서비스를 이용할 수 있습니다.
          </p>
        </div>

        {/* 섹션들 */}
        {SECTIONS.map(s => (
          <div key={s.title} style={{ background: 'var(--surface)', borderRadius: 14, padding: '20px', marginBottom: 12, boxShadow: '0 1px 3px rgba(15,30,54,0.06)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)', marginBottom: 12 }}>{s.title}</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{s.content}</p>
          </div>
        ))}

        {/* 문의 */}
        <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 13, color: 'var(--ink-mute)' }}>
          문의: hanamanajun@gmail.com
        </div>
      </div>
    </div>
  );
}
