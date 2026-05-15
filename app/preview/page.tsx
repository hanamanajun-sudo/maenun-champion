import RBtn from '@/components/RBtn';
import Mark from '@/components/Mark';
import VerdictBadge from '@/components/VerdictBadge';
import MiniBar from '@/components/MiniBar';
import VideoEmbed from '@/components/VideoEmbed';
import CommentItem from '@/components/CommentItem';
import ReactionBar from '@/components/ReactionBar';

const sampleComment = {
  id: 'c1',
  nickname: '호기심많은너구리',
  text: '입 모양이 확실히 어색했어요. 발음이 맞지 않더라고요.',
  reaction: 'suspicious' as const,
  likes: 12,
};

const sampleComment2 = {
  id: 'c2',
  nickname: '날카로운독수리',
  text: '저는 진짜인 것 같은데, 배경이 너무 자연스러웠어요.',
  reaction: 'interesting' as const,
  likes: 5,
};

export default function PreviewPage() {
  return (
    <div style={{ maxWidth: 430, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0F1E36' }}>컴포넌트 미리보기</h1>

      {/* RBtn */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#7A8499' }}>RBtn</h2>
        <RBtn variant="navy" size="xl">🏠 네이비 XL</RBtn>
        <RBtn variant="red" size="lg">🤖 레드 LG</RBtn>
        <RBtn variant="green" size="lg">👁 그린 LG</RBtn>
        <RBtn variant="gold" size="md">🔍 골드 MD</RBtn>
        <RBtn variant="ghost" size="md">👻 고스트 MD</RBtn>
      </section>

      {/* Mark */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#7A8499' }}>Mark</h2>
        <p style={{ fontSize: '32px', fontWeight: 900, color: '#0F1E36', lineHeight: 1.2 }}>
          오늘의 <Mark>진짜 vs AI</Mark>
        </p>
        <p style={{ fontSize: '20px', fontWeight: 700, color: '#0F1E36' }}>
          <Mark>함께 가려내봐요</Mark>
        </p>
      </section>

      {/* VerdictBadge */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#7A8499' }}>VerdictBadge</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <VerdictBadge yesCount={5224} noCount={3203} />
          <VerdictBadge yesCount={2352} noCount={6048} />
          <VerdictBadge yesCount={4284} noCount={4116} contested />
        </div>
      </section>

      {/* MiniBar */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#7A8499' }}>MiniBar</h2>
        <MiniBar yesCount={5224} noCount={3203} />
        <MiniBar yesCount={2352} noCount={6048} />
        <MiniBar yesCount={4284} noCount={4116} />
      </section>

      {/* VideoEmbed */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#7A8499' }}>VideoEmbed</h2>
        <VideoEmbed
          embedUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="대통령 충격 발언 영상"
        />
      </section>

      {/* CommentItem */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#7A8499' }}>CommentItem</h2>
        <CommentItem comment={sampleComment} />
        <CommentItem comment={sampleComment2} />
      </section>

      {/* ReactionBar */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#7A8499' }}>ReactionBar</h2>
        <ReactionBar mediaId="m1" uid="test-uid" />
      </section>
    </div>
  );
}
