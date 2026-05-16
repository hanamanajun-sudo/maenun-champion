'use client';

import { create } from 'zustand';
import type { UserDoc } from './firestore';

type UserStore = {
  uid: string | null;
  user: UserDoc | null;
  setUser: (uid: string, user: UserDoc) => void;
  updateScore: (delta: number) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  uid: null,
  user: null,
  setUser: (uid, user) => set({ uid, user }),
  updateScore: (delta) =>
    set((state) =>
      state.user ? { user: { ...state.user, score: state.user.score + delta } } : {}
    ),
}));
