type ShareScenario = 'result' | 'app' | 'report' | 'video';

type ShareOptions = {
  scenario: ShareScenario;
  voteText?: string;
  totalVotes?: number;
  title?: string;
  url?: string;
};

export async function shareContent(options: ShareOptions): Promise<void> {
  const { scenario, voteText, totalVotes, title, url: customUrl } = options;
  const pageUrl = customUrl ?? (typeof window !== 'undefined' ? window.location.href : '');

  let shareTitle = '매눈챔피언 - 진짜 혹은 AI?';
  let shareText = '';

  switch (scenario) {
    case 'result':
      shareTitle = '이 영상 가짜일까 진짜일까?';
      shareText = `${totalVotes ? totalVotes.toLocaleString() + '명이 함께 봤어요. ' : ''}나는 ${voteText ?? ''}이라고 했는데... 너는 어때?`;
      break;
    case 'app':
      shareTitle = '매눈챔피언';
      shareText = 'AI 가짜 영상 같이 가려내요! 매눈챔피언';
      break;
    case 'report':
      shareTitle = '의심 영상 제보';
      shareText = '의심스러운 영상을 제보했어요. 같이 가려내봐요!';
      break;
    case 'video':
      shareTitle = title ?? '이 영상, 진짜일까 가짜일까?';
      shareText = `${totalVotes ? totalVotes.toLocaleString() + '명이 함께 봤어요. ' : ''}함께 가려내봐요!`;
      break;
  }

  if (typeof navigator !== 'undefined' && navigator.share) {
    await navigator.share({ title: shareTitle, text: shareText, url: pageUrl });
  } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(pageUrl);
    alert('링크가 복사됐어요!');
  }
}
