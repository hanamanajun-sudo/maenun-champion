type VerdictBadgeProps = {
  yesCount: number;
  noCount: number;
  contested?: boolean;
};

export default function VerdictBadge({ yesCount, noCount, contested }: VerdictBadgeProps) {
  const total = yesCount + noCount;
  const yesPct = total > 0 ? (yesCount / total) * 100 : 50;

  if (contested || (yesPct >= 40 && yesPct <= 60)) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px',
          background: '#FCF3E0',
          color: '#C6953E',
          fontSize: '11px',
          fontWeight: 800,
          padding: '3px 8px',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
        }}
      >
        ⚖️ 팽팽
      </span>
    );
  }

  if (yesPct > 60) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px',
          background: '#FCE8EA',
          color: '#C8313D',
          fontSize: '11px',
          fontWeight: 800,
          padding: '3px 8px',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
        }}
      >
        🤖 가짜 의심
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        background: '#E0F2EA',
        color: '#137F5E',
        fontSize: '11px',
        fontWeight: 800,
        padding: '3px 8px',
        borderRadius: '6px',
        whiteSpace: 'nowrap',
      }}
    >
      👁 진짜 의견
    </span>
  );
}
