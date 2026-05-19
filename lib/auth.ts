'use client';

import {
  signInAnonymously,
  linkWithPopup,
  signInWithPopup,
  signInWithCredential,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  type Auth,
  type AuthError,
} from 'firebase/auth';
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

export function generateNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}${noun}`;
}

export async function signInAnon(): Promise<void> {
  if (!auth) return;
  try {
    const result = await signInAnonymously(auth);
    await getOrCreateUser(result.user.uid, generateNickname());
  } catch (error) {
    console.error('익명 로그인 실패:', error);
    throw error;
  }
}

export function googleAuthPopup(
  onSuccess: () => void,
  onError: (code: string) => void
): void {
  if (!auth) { onError('no-auth'); return; }

  const provider = new GoogleAuthProvider();
  const user = auth.currentUser;
  const authRef = auth as Auth;

  const promise = user?.isAnonymous
    ? linkWithPopup(user, provider)
    : signInWithPopup(authRef, provider);

  promise
    .then(() => onSuccess())
    .catch(async (err: AuthError) => {
      if (err.code === 'auth/credential-already-in-use') {
        const credential = GoogleAuthProvider.credentialFromError(err);
        if (credential && auth) {
          try {
            await signInWithCredential(authRef, credential);
            onSuccess();
            return;
          } catch {
            // fallback도 실패한 경우만 에러 처리
          }
        }
      } else {
        console.error('Google auth error:', err.code, err.message);
      }
      onError(err.code ?? 'unknown');
    });
}

export async function signOutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export { onAuthStateChanged };
