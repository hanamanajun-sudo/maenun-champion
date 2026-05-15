'use client';

import React from 'react';

type Variant = 'navy' | 'red' | 'green' | 'gold' | 'ghost';
type Size = 'md' | 'lg' | 'xl';

type RBtnProps = {
  variant?: Variant;
  size?: Size;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

const variantStyles: Record<Variant, { bg: string; shadow: string; text: string; border?: string }> = {
  navy: {
    bg: '#1B3A6B',
    shadow: '#0F254A',
    text: '#FFFFFF',
  },
  red: {
    bg: '#C8313D',
    shadow: '#9F2530',
    text: '#FFFFFF',
  },
  green: {
    bg: '#137F5E',
    shadow: '#0F6549',
    text: '#FFFFFF',
  },
  gold: {
    bg: '#C6953E',
    shadow: '#A57A2A',
    text: '#FFFFFF',
  },
  ghost: {
    bg: '#FFFFFF',
    shadow: '#DDE3ED',
    text: '#1B3A6B',
    border: '1.5px solid #DDE3ED',
  },
};

const sizeStyles: Record<Size, { padding: string; fontSize: string; minHeight: string; borderRadius: string }> = {
  md: { padding: '10px 18px', fontSize: '14px', minHeight: '44px', borderRadius: '12px' },
  lg: { padding: '13px 22px', fontSize: '15px', minHeight: '50px', borderRadius: '14px' },
  xl: { padding: '16px 24px', fontSize: '16px', minHeight: '56px', borderRadius: '16px' },
};

export default function RBtn({
  variant = 'navy',
  size = 'md',
  onClick,
  disabled = false,
  children,
  className = '',
  type = 'button',
}: RBtnProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  const [pressed, setPressed] = React.useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        width: '100%',
        background: v.bg,
        color: v.text,
        border: v.border ?? 'none',
        borderRadius: s.borderRadius,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 700,
        minHeight: s.minHeight,
        boxShadow: pressed ? `0 1px 0 ${v.shadow}` : `0 4px 0 ${v.shadow}`,
        transform: pressed ? 'translateY(3px)' : 'translateY(0)',
        transition: 'box-shadow 0.1s, transform 0.1s',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'inherit',
        letterSpacing: '-0.2px',
      }}
    >
      {children}
    </button>
  );
}
