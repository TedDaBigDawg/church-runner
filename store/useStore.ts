import { generateUniqueName } from "@/lib/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  image: string;
}

export interface Wish extends User {
  message: string;
  createdAt: string;
}

interface Store {
  user: User | null;
  wishes: Wish[];
  setUser: (user: User) => void;
  updateUserName: (name: string) => void;
  setWishes: (wishes: Wish[]) => void;
  addWish: (wish: Wish) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      wishes: [],
      setUser: (user) => set({ user }),
      updateUserName: (name) =>
        set((state) => ({ user: state.user ? { ...state.user, name } : null })),
      setWishes: (wishes) => set({ wishes }),
      addWish: (wish) => set((state) => ({ wishes: [wish, ...state.wishes] })),
    }),
    {
      name: "celebration-store",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Initialize user if not already set
if (typeof window !== "undefined" && !useStore.getState().user) {
  useStore.getState().setUser({
    id: Math.random().toString(36).substr(2, 9),
    name: generateUniqueName(),
    image: `https://api.dicebear.com/6.x/avataaars/svg?seed=${Math.random()}`,
  });
}
