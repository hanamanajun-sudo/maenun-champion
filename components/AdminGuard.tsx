'use client';

import { useUserStore } from '@/lib/store';

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const uid = useUserStore((s) => s.uid);

  if (!uid) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#7A8499' }}>
        로딩 중...
      </div>
    );
  }

  if (!ADMIN_UID) {
    return (
      <div style={{ padding: 32, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8 }}>
        <p>⚠️ NEXT_PUBLIC_ADMIN_UID 환경변수가 설정되지 않았습니다.</p>
        <p>현재 UID:</p>
        <code style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: 4, display: 'block', wordBreak: 'break-all' }}>
          {uid}
        </code>
        <p style={{ marginTop: 16 }}>.env.local에 추가 후 재시작:</p>
        <code style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: 4, display: 'block' }}>
          NEXT_PUBLIC_ADMIN_UID={uid}
        </code>
      </div>
    );
  }

  if (uid !== ADMIN_UID) {
    return (
      <div style={{ padding: 32, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8 }}>
        <div style={{ fontSize: 40, marginBottom: 12, textAlign: 'center' }}>🚫</div>
        <p style={{ fontWeight: 700, color: '#C8313D', marginBottom: 12 }}>접근 권한이 없습니다.</p>
        <p>현재 UID:</p>
        <code style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: 4, display: 'block', wordBreak: 'break-all', marginBottom: 12 }}>
          {uid}
        </code>
        <p>어드민 UID:</p>
        <code style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: 4, display: 'block', wordBreak: 'break-all' }}>
          {ADMIN_UID}
        </code>
      </div>
    );
  }

  return <>{children}</>;
}
