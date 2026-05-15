'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/',            icon: '🏠', label: '홈' },
  { href: '/explore',     icon: '📋', label: '광장' },
  { href: '/report',      icon: '📢', label: '제보' },
  { href: '/my-activity', icon: '👤', label: '내 활동' },
  { href: '/profile',     icon: '🏅', label: '명예의전당' },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        height: 64,
        background: '#FFFFFF',
        borderTop: '1px solid #DDE3ED',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 100,
        boxShadow: '0 -2px 12px rgba(15,30,54,0.06)',
      }}
    >
      {TABS.map((tab) => {
        const active = isActive(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              textDecoration: 'none',
              color: active ? '#1B3A6B' : '#7A8499',
              transition: 'color 0.15s',
              minWidth: 0,
              padding: '6px 2px',
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>{tab.icon}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 800 : 600,
                lineHeight: 1,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}
            >
              {tab.label}
            </span>
            {active && (
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: 24,
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  background: '#1B3A6B',
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
