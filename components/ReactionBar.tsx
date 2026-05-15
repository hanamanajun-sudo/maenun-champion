'use client';

import { useState } from 'react';

type ReactionType = 'suspicious' | 'interesting' | null;

type ReactionBarProps = {
  mediaId: string;
  uid?: string;
};

export default function ReactionBar({ mediaId, uid }: ReactionBarProps) {
  const [selected, setSelected] = useState<ReactionType>(null);

  const handleReaction = async (type: 'suspicious' | 'interesting') => {
    if (!uid) return;
    if (selected === type) {
      setSelected(null);
    } else {
      setSelected(type);
    }
  };

  const btnStyle = (type: 'suspicious' | 'interesting') => {
    const active = selected === type;
    const isSus = type === 'suspicious';
    return {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      padding: '12px',
      borderRadius: '12px',
      border: active
        ? `2px solid ${isSus ? '#C8313D' : '#C6953E'}`
        : '2px solid #DDE3ED',
      background: active
        ? isSus ? '#FCE8EA' : '#FCF3E0'
        : '#FFFFFF',
      color: active
        ? isSus ? '#C8313D' : '#C6953E'
        : '#7A8499',
      fontSize: '14px',
      fontWeight: 700,
      cursor: uid ? 'pointer' : 'not-allowed',
      transition: 'all 0.15s',
      fontFamily: 'inherit',
    } as React.CSSProperties;
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button style={btnStyle('suspicious')} onClick={() => handleReaction('suspicious')}>
        🤔 의심돼요
      </button>
      <button style={btnStyle('interesting')} onClick={() => handleReaction('interesting')}>
        👀 흥미롭네요
      </button>
    </div>
  );
}
