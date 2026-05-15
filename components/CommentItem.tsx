'use client';

import { useState } from 'react';

type Comment = {
  id?: string;
  nickname: string;
  text: string;
  reaction: 'suspicious' | 'interesting';
  likes: number;
  reported?: boolean;
};

type CommentItemProps = {
  comment: Comment;
  onReport?: (id: string) => void;
};

export default function CommentItem({ comment, onReport }: CommentItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const reactionLabel =
    comment.reaction === 'suspicious' ? '🤔 의심돼요' : '👀 흥미롭네요';
  const reactionBg =
    comment.reaction === 'suspicious' ? '#FCE8EA' : '#FCF3E0';
  const reactionColor =
    comment.reaction === 'suspicious' ? '#C8313D' : '#C6953E';

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #DDE3ED',
        borderRadius: '12px',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#1B3A6B',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {comment.nickname.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F1E36' }}>
            {comment.nickname}
          </div>
        </div>
        <span
          style={{
            background: reactionBg,
            color: reactionColor,
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          {reactionLabel}
        </span>
      </div>

      <p style={{ fontSize: '14px', color: '#3D4A60', lineHeight: 1.5, margin: 0 }}>
        {comment.text}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', color: '#7A8499' }}>
          👍 {comment.likes}
        </span>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '12px',
              color: '#7A8499',
              cursor: 'pointer',
              padding: '2px 6px',
            }}
          >
            신고
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => {
                if (onReport && comment.id) onReport(comment.id);
                setShowConfirm(false);
              }}
              style={{
                background: '#FCE8EA',
                border: 'none',
                color: '#C8313D',
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              신고하기
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                background: '#F4F6FA',
                border: 'none',
                color: '#7A8499',
                fontSize: '12px',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              취소
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
