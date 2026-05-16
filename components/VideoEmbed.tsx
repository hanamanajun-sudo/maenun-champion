'use client';

import { useState } from 'react';

type VideoEmbedProps = {
  embedUrl: string;
  title: string;
};

function isShorts(url: string) {
  // Shorts는 원래 URL에 /shorts/ 가 있거나, embed ID를 추적해서 판단 어려움
  // 대신 세로 비율로 통일하면 둘 다 잘 보임
  // 명시적으로 shorts 여부를 저장하지 않으므로 16:9 기본 유지하되
  // ?shorts=1 파라미터가 있으면 세로로 표시
  return url.includes('shorts') || url.includes('?shorts');
}

export default function VideoEmbed({ embedUrl, title }: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const vertical = isShorts(embedUrl);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: vertical ? '9/16' : '16/9',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#0F1E36',
        maxHeight: vertical ? '70vh' : undefined,
      }}
    >
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#0F1E36',
            color: '#7A8499',
            fontSize: '13px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            ▶
          </div>
          <span>영상 로딩 중...</span>
        </div>
      )}
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      />
    </div>
  );
}
