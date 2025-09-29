"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const DAILY_HEALTH_DECREASE = 10;
const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

interface GameState {
  points: number;
  health: number;
  inventory: string[];
  lastPlayed: number | null;
  addPoints: (amount: number) => void;
  spendPoints: (amount: number) => void;
  buyItem: (itemId: string) => void;
  updateHealth: (amount: number) => void;
  checkDailyStatus: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      points: 0,
      health: 100,
      inventory: [],
      lastPlayed: null,
      addPoints: (amount) => set((state) => ({ points: state.points + amount })),
      spendPoints: (amount) => set((state) => ({ points: Math.max(0, state.points - amount) })),
      buyItem: (itemId) => {
        if (!get().inventory.includes(itemId)) {
          set((state) => ({ inventory: [...state.inventory, itemId] }));
        }
      },
      updateHealth: (amount) => set({ health: Math.min(100, Math.max(0, amount)), lastPlayed: Date.now() }),
      checkDailyStatus: () => {
        const { lastPlayed, health } = get();
        if (lastPlayed === null) {
          // First time playing
          set({ lastPlayed: Date.now() });
          return;
        }

        const timeSinceLastPlayed = Date.now() - lastPlayed;
        if (timeSinceLastPlayed > TWENTY_FOUR_HOURS_IN_MS) {
          const daysMissed = Math.floor(timeSinceLastPlayed / TWENTY_FOUR_HOURS_IN_MS);
          const healthToDecrease = daysMissed * DAILY_HEALTH_DECREASE;
          set({ health: Math.max(0, health - healthToDecrease) });
        }
      }
    }),
    {
      name: "quiz-pet-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
