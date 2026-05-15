import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db as _db } from './firebase';

function getDb() {
  if (!_db) throw new Error('Firebase가 설정되지 않았습니다.');
  return _db;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type UserDoc = {
  uid: string;
  nickname: string;
  score: number;
  streak: number;
  level: number;
  badges: string[];
  lastVotedAt: Timestamp | null;
  lastVotedDate: string | null;
  totalVotes: number;
  correctVotes: number;
  reportCount: number;
  email?: string;
  createdAt: Timestamp;
  isAnonymous: boolean;
};

export type MediaDoc = {
  id: string;
  kind: 'video' | 'photo';
  title: string;
  embedUrl: string;
  period: 'today' | 'week' | 'month';
  thumbHue: number;
  hint: string;
  yesCount: number;
  noCount: number;
  totalVotes: number;
  contested: boolean;
  publishedAt: Timestamp;
  isActive: boolean;
};

export type VoteDoc = {
  uid: string;
  mediaId: string;
  vote: 'yes' | 'no';
  agreedWithMajority: boolean;
  scoreDelta: number;
  createdAt: Timestamp;
};

export type CommentDoc = {
  id?: string;
  uid: string;
  nickname: string;
  text: string;
  reaction: 'suspicious' | 'interesting';
  likes: number;
  reported: boolean;
  hidden: boolean;
  createdAt: Timestamp;
};

export type ReactionDoc = {
  uid: string;
  mediaId: string;
  type: 'suspicious' | 'interesting';
  createdAt: Timestamp;
};

export type ReportSubmissionDoc = {
  id?: string;
  uid: string;
  nickname: string;
  embedUrl: string;
  source: string;
  reason: string;
  status: 'pending' | 'reviewing' | 'done';
  caseNumber: string;
  createdAt: Timestamp;
  email?: string;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function getOrCreateUser(uid: string, defaultNickname: string): Promise<UserDoc> {
  const ref = doc(getDb(), 'users', uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data() as UserDoc;
  }

  const newUser: UserDoc = {
    uid,
    nickname: defaultNickname,
    score: 0,
    streak: 0,
    level: 1,
    badges: [],
    lastVotedAt: null,
    lastVotedDate: null,
    totalVotes: 0,
    correctVotes: 0,
    reportCount: 0,
    createdAt: serverTimestamp() as Timestamp,
    isAnonymous: true,
  };

  await setDoc(ref, newUser);
  return newUser;
}

// ─── Media ────────────────────────────────────────────────────────────────────

export async function getMediaList(
  period: 'today' | 'week' | 'month',
  kind?: 'video' | 'photo'
): Promise<MediaDoc[]> {
  const constraints = [
    where('period', '==', period),
    where('isActive', '==', true),
    orderBy('publishedAt', 'desc'),
    ...(kind ? [where('kind', '==', kind)] : []),
  ];

  const q = query(collection(getDb(), 'media'), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MediaDoc));
}

export async function getTodayQuiz(): Promise<MediaDoc | null> {
  const q = query(
    collection(getDb(), 'media'),
    where('period', '==', 'today'),
    where('isActive', '==', true),
    orderBy('publishedAt', 'desc'),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as MediaDoc;
}

// ─── Votes ────────────────────────────────────────────────────────────────────

export async function submitVote(
  uid: string,
  mediaId: string,
  vote: 'yes' | 'no'
): Promise<{ scoreDelta: number; agreedWithMajority: boolean }> {
  const mediaRef = doc(getDb(), 'media', mediaId);
  const mediaSnap = await getDoc(mediaRef);

  if (!mediaSnap.exists()) throw new Error('미디어를 찾을 수 없습니다.');
  const media = mediaSnap.data() as MediaDoc;

  const total = media.totalVotes + 1;
  const newYes = vote === 'yes' ? media.yesCount + 1 : media.yesCount;
  const newNo = vote === 'no' ? media.noCount + 1 : media.noCount;
  const yesPct = (newYes / total) * 100;

  let scoreDelta = 5;
  let agreedWithMajority = false;

  if (yesPct >= 60 && vote === 'yes') {
    scoreDelta = 20;
    agreedWithMajority = true;
  } else if (yesPct <= 40 && vote === 'no') {
    scoreDelta = 20;
    agreedWithMajority = true;
  } else if (yesPct > 40 && yesPct < 60) {
    scoreDelta = 10;
  }

  await updateDoc(mediaRef, {
    yesCount: newYes,
    noCount: newNo,
    totalVotes: increment(1),
  });

  const voteRef = doc(getDb(), 'votes', `${uid}_${mediaId}`);
  await setDoc(voteRef, {
    uid,
    mediaId,
    vote,
    agreedWithMajority,
    scoreDelta,
    createdAt: serverTimestamp(),
  });

  const today = new Date().toISOString().slice(0, 10);
  const userRef = doc(getDb(), 'users', uid);
  await updateDoc(userRef, {
    score: increment(scoreDelta),
    totalVotes: increment(1),
    lastVotedAt: serverTimestamp(),
    lastVotedDate: today,
  });

  return { scoreDelta, agreedWithMajority };
}

export async function getMyVotes(uid: string): Promise<VoteDoc[]> {
  const q = query(
    collection(getDb(), 'votes'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as VoteDoc);
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function getMyReports(uid: string): Promise<ReportSubmissionDoc[]> {
  const q = query(
    collection(getDb(), 'report_submissions'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ReportSubmissionDoc));
}

export async function submitReport(
  uid: string,
  data: Omit<ReportSubmissionDoc, 'uid' | 'createdAt' | 'status' | 'caseNumber'>
): Promise<string> {
  const caseNumber = `REP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  await addDoc(collection(getDb(), 'report_submissions'), {
    uid,
    ...data,
    status: 'pending',
    caseNumber,
    createdAt: serverTimestamp(),
  });
  return caseNumber;
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export async function addComment(
  mediaId: string,
  uid: string,
  nickname: string,
  text: string,
  reaction: 'suspicious' | 'interesting'
): Promise<void> {
  if (text.length > 140) throw new Error('코멘트는 140자 이내여야 합니다.');

  await addDoc(collection(getDb(), 'comments', mediaId, 'list'), {
    uid,
    nickname,
    text,
    reaction,
    likes: 0,
    reported: false,
    hidden: false,
    createdAt: serverTimestamp(),
  });
}

export async function getComments(mediaId: string): Promise<CommentDoc[]> {
  const q = query(
    collection(getDb(), 'comments', mediaId, 'list'),
    where('hidden', '==', false),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CommentDoc));
}

export async function reportComment(commentId: string, mediaId: string, uid: string): Promise<void> {
  await addDoc(collection(getDb(), 'reports'), {
    commentId,
    reporterUid: uid,
    createdAt: serverTimestamp(),
  });

  const reportQuery = query(
    collection(getDb(), 'reports'),
    where('commentId', '==', commentId)
  );
  const snap = await getDocs(reportQuery);

  if (snap.size >= 3) {
    const commentRef = doc(getDb(), 'comments', mediaId, 'list', commentId);
    await updateDoc(commentRef, { hidden: true });
  }
}
