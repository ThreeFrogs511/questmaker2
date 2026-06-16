import { create } from "zustand";
import { User } from "@/types/types";

interface UserStore {
  currentUser: User;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (b: boolean) => void;
  signUpError: string;
  setSignUpError: (s: string) => void;
  loginError: string;
  setLoginError: (s: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: {
    user_id: null,
    email: null,
    last_chapter_done: null,
    tutorial_completed: false,
    profile_completed: false,
  },

  login: (user) => set({ currentUser: user }),

  logout: () =>
    set({
      currentUser: {
        user_id: null,
        email: null,
        last_chapter_done: null,
        tutorial_completed: false,
        profile_completed: false,
      },
    }),

  updateProfile: (patch) =>
    set((state) => {
      if (!state.currentUser) return state;
      return {
        currentUser: {
          ...state.currentUser,
          ...patch,
        },
      };
    }),

  isMenuOpen: false,
  setIsMenuOpen: (b) => set({ isMenuOpen: b }),
  signUpError: "",
  loginError: "",
  setLoginError: (s) => set({ loginError: s }),
  setSignUpError: (s) => set({ loginError: s }),
}));
