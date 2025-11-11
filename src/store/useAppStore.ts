import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AppState = {
  ageLabel: string | null;
  weightKg: number | null;
  setAgeLabel: (age: string | null) => void;
  setWeightKg: (w: number | null) => void;
  reset: () => void;
};

const DEFAULT_AGE_LABEL = "Naissance";
const DEFAULT_WEIGHT_KG = 3;

// On persiste pour que le poids reste si on rafraîchit la page.
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ageLabel: DEFAULT_AGE_LABEL,
      weightKg: DEFAULT_WEIGHT_KG,
      setAgeLabel: (age) => set({ ageLabel: age }),
      setWeightKg: (w) => set({ weightKg: w }),
      reset: () => set({ ageLabel: DEFAULT_AGE_LABEL, weightKg: DEFAULT_WEIGHT_KG }),
    }),
    {
      name: "pediago-app-store",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState, version) => {
        if (version < 2) {
          return {
            ...persistedState,
            ageLabel: DEFAULT_AGE_LABEL,
            weightKg: DEFAULT_WEIGHT_KG,
          } as AppState;
        }
        return persistedState as AppState;
      },
    }
  )
);
