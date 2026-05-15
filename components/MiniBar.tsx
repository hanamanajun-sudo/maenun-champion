type MiniBarProps = {
  yesCount: number;
  noCount: number;
};

export default function MiniBar({ yesCount, noCount }: MiniBarProps) {
  const total = yesCount + noCount;
  const yesPct = total > 0 ? Math.round((yesCount / total) * 100) : 50;
  const noPct = 100 - yesPct;

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          borderRadius: '4px',
          overflow: 'hidden',
          height: '6px',
          background: '#DDE3ED',
        }}
      >
        <div
          style={{
            width: `${yesPct}%`,
            background: '#C8313D',
            transition: 'width 0.6s ease',
          }}
        />
        <div
          style={{
            width: `${noPct}%`,
            background: '#137F5E',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '4px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#7A8499',
        }}
      >
        <span style={{ color: '#C8313D' }}>🤖 가짜 {yesPct}%</span>
        <span style={{ color: '#137F5E' }}>👁 진짜 {noPct}%</span>
      </div>
    </div>
  );
}
