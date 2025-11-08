import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AppState = {
  ageLabel: string | null;
  weightKg: number | null;
  setAgeLabel: (age: string | null) => void;
  setWeightKg: (w: number | null) => void;
  reset: () => void;
};

// Par défaut, on part sur le mockup: "10 mois" / 10 kg.
// On persiste pour que le poids reste si on rafraîchit la page.
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ageLabel: "10 mois",
      weightKg: 10,
      setAgeLabel: (age) => set({ ageLabel: age }),
      setWeightKg: (w) => set({ weightKg: w }),
      reset: () => set({ ageLabel: "10 mois", weightKg: 10 }),
    }),
    {
      name: "pediago-app-store",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
