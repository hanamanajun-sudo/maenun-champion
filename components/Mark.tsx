import React from 'react';

type MarkProps = {
  children: React.ReactNode;
};

export default function Mark({ children }: MarkProps) {
  return (
    <span
      style={{
        background:
          'linear-gradient(180deg, transparent 58%, #F2C94C 58%, #F2C94C 90%, transparent 90%)',
        padding: '0 4px',
      }}
    >
      {children}
    </span>
  );
}
