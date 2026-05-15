export type Media = {
  id: string;
  kind: 'video' | 'photo';
  title: string;
  embedUrl: string;
  yesCount: number;
  noCount: number;
  totalVotes: number;
  period: 'today' | 'week' | 'month';
  contested: boolean;
  thumbHue: number;
  hint: string;
};

function isContested(yesCount: number, noCount: number): boolean {
  const total = yesCount + noCount;
  if (total === 0) return false;
  return Math.abs(yesCount - noCount) / total <= 0.12;
}

const EMBED = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

export const mockMedia: Media[] = [
  {
    id: 'm1',
    kind: 'video',
    title: '대통령 충격 발언 영상',
    embedUrl: EMBED,
    yesCount: 5224,
    noCount: 3203,
    totalVotes: 8427,
    period: 'today',
    contested: isContested(5224, 3203),
    thumbHue: 220,
    hint: '입 모양과 음성이 미세하게 어긋나고, 눈 깜빡임이 자연스럽지 않아요.',
  },
  {
    id: 'm2',
    kind: 'video',
    title: '"손주가 사고났어요" 음성',
    embedUrl: EMBED,
    yesCount: 6567,
    noCount: 1860,
    totalVotes: 8427,
    period: 'today',
    contested: isContested(6567, 1860),
    thumbHue: 0,
    hint: '목소리 톤이 일정하게 유지되고, 감정 변화가 너무 갑작스러워요.',
  },
  {
    id: 'm3',
    kind: 'photo',
    title: '80세 할머니 마라톤 우승 사진',
    embedUrl: EMBED,
    yesCount: 2352,
    noCount: 6048,
    totalVotes: 8400,
    period: 'today',
    contested: isContested(2352, 6048),
    thumbHue: 120,
    hint: '배경의 관중과 피사체의 빛 방향이 다르고, 그림자가 어색해요.',
  },
  {
    id: 'm4',
    kind: 'video',
    title: '강아지 피아노 영상',
    embedUrl: EMBED,
    yesCount: 2407,
    noCount: 5993,
    totalVotes: 8400,
    period: 'week',
    contested: isContested(2407, 5993),
    thumbHue: 45,
    hint: '발 움직임과 건반 소리가 정확히 일치하는 건 실제로 어렵지 않아요.',
  },
  {
    id: 'm5',
    kind: 'photo',
    title: '교황 한복 사진',
    embedUrl: EMBED,
    yesCount: 4284,
    noCount: 4116,
    totalVotes: 8400,
    period: 'week',
    contested: isContested(4284, 4116),
    thumbHue: 280,
    hint: '옷 주름과 손 모양이 부자연스럽고, 배경 건물 원근감이 어색해요.',
  },
  {
    id: 'm6',
    kind: 'video',
    title: '외국 가수 한국말 인터뷰',
    embedUrl: EMBED,
    yesCount: 5893,
    noCount: 2407,
    totalVotes: 8300,
    period: 'week',
    contested: isContested(5893, 2407),
    thumbHue: 200,
    hint: '발음이 지나치게 정확하고, 입 모양이 한국어 발음 패턴과 맞지 않아요.',
  },
  {
    id: 'm7',
    kind: 'photo',
    title: '조선시대 컬러 인물 사진',
    embedUrl: EMBED,
    yesCount: 4454,
    noCount: 3796,
    totalVotes: 8250,
    period: 'week',
    contested: isContested(4454, 3796),
    thumbHue: 30,
    hint: '색감이 현대 필름 특성과 비슷하고, 피부 표현이 너무 매끄러워요.',
  },
  {
    id: 'm8',
    kind: 'video',
    title: '동물 보호소 미담 영상',
    embedUrl: EMBED,
    yesCount: 3124,
    noCount: 5076,
    totalVotes: 8200,
    period: 'month',
    contested: isContested(3124, 5076),
    thumbHue: 160,
    hint: '카메라 구도와 편집이 전문적이어서 일반 제보 영상치고는 품질이 높아요.',
  },
  {
    id: 'm9',
    kind: 'photo',
    title: '달 표면 태극기 사진',
    embedUrl: EMBED,
    yesCount: 4823,
    noCount: 3377,
    totalVotes: 8200,
    period: 'month',
    contested: isContested(4823, 3377),
    thumbHue: 240,
    hint: '달 표면의 질감과 태극기의 해상도가 서로 다른 수준이에요.',
  },
  {
    id: 'm10',
    kind: 'video',
    title: '의약품 무료 나눔 공익광고',
    embedUrl: EMBED,
    yesCount: 6888,
    noCount: 1512,
    totalVotes: 8400,
    period: 'month',
    contested: isContested(6888, 1512),
    thumbHue: 340,
    hint: '목소리와 얼굴 움직임이 어긋나고, 조명이 장면마다 갑자기 바뀌어요.',
  },
];
