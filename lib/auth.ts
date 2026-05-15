'use client';

import { signInAnonymously, linkWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { getOrCreateUser } from './firestore';

const ADJECTIVES = [
  '호기심많은', '날카로운', '신중한', '용감한', '재빠른',
  '꼼꼼한', '의심많은', '현명한', '열정적인', '차분한',
];
const NOUNS = [
  '너구리', '독수리', '고양이', '여우', '부엉이',
  '두더지', '까치', '수달', '족제비', '담비',
];

function generateNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}${noun}`;
}

export async function signInAnon(): Promise<void> {
  if (!auth) return; // Firebase 미설정 시 스킵
  try {
    const result = await signInAnonymously(auth);
    const user = result.user;
    await getOrCreateUser(user.uid, generateNickname());
  } catch (error) {
    console.error('익명 로그인 실패:', error);
    throw error;
  }
}

export async function linkWithGoogle(): Promise<void> {
  if (!auth) return;
  const user = auth.currentUser;
  if (!user) throw new Error('로그인된 사용자가 없습니다.');
  const provider = new GoogleAuthProvider();
  try {
    await linkWithPopup(user, provider);
  } catch (error) {
    console.error('구글 연동 실패:', error);
    throw error;
  }
}

export { onAuthStateChanged };
