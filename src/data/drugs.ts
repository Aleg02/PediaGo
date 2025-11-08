import type { DosingRule, WeightOverride } from "@/lib/dosing";

// --- Médicaments disponibles (id lisible = slug) ---
export type Drug = { id: string; name: string; unit?: string; route?: string; note?: string };

export const DRUGS: Drug[] = [
  { id: "adrenaline-im", name: "Adrénaline IM", unit: "mg", route: "IM" },
  { id: "adrenaline-ivse", name: "Adrénaline IVSE", unit: "µg/kg/min", route: "IVSE" },
  { id: "solumedrol", name: "Solumédrol", unit: "mg", route: "IV" },
  { id: "salbutamol-ae", name: "Salbutamol (AE)", unit: "mg", route: "AE" },
];

// --- Règles de dose génériques par médicament ---
export const DOSING_RULES: Record<string, DosingRule> = {
  // règle par prise 0,01 mg/kg (max 0,5 mg), arrondi 0.05 mg par ex.
  "adrenaline-im": {
    basis: "mg_per_kg",
    mg_per_kg: 0.01,
    per_dose: true,
    max_dose_mg: 0.5,
    rounding_step_mg: 0.05,
    frequency_text: "IM, répéter si besoin selon protocole",
    route: "IM",
  },
  "adrenaline-ivse": {
    basis: "fixed",
    per_dose: false,
    notes: "Débit titré à l'effet, monitoré",
  },
  "solumedrol": {
    basis: "mg_per_kg",
    mg_per_kg: 2,
    per_dose: true,
    rounding_step_mg: 10,
    route: "IV",
  },
  "salbutamol-ae": {
    basis: "range",
    per_dose: true,
    notes: "2,5 mg ≤6A ; 5 mg >6A (AE)",
  },
};

// --- Overrides par poids (exemples 3–10 kg ; tu étendras jusqu’à 50 kg) ---
export const WEIGHT_OVERRIDES: Record<string, WeightOverride[]> = {
  "adrenaline-im": [
    { min_kg: 3, max_kg: 3, dose_mg: 0.03, note: "Carte 3 kg" },
    { min_kg: 4, max_kg: 4, dose_mg: 0.04, note: "Carte 4 kg" },
    { min_kg: 5, max_kg: 5, dose_mg: 0.05, note: "Carte 5 kg" },
    { min_kg: 6, max_kg: 6, dose_mg: 0.06, note: "Carte 6 kg" },
    { min_kg: 7.5, max_kg: 7.5, dose_mg: 0.08, note: "Carte 7,5 kg" },
    { min_kg: 9, max_kg: 9, dose_mg: 0.09, note: "Carte 9 kg" },
    { min_kg: 10, max_kg: 10, dose_mg: 0.10, note: "Carte 10 kg" },
  ],
  // autres médicaments: vide pour l’instant
};

// --- Quels médicaments pour quel protocole ? ---
export const PROTOCOL_DRUGS: Record<string, string[]> = {
  "anaphylaxie": ["adrenaline-im", "adrenaline-ivse"],
  "aag": ["salbutamol-ae", "solumedrol"],
  "choc-hemorragique": [],
  "acr-enfant": ["adrenaline-im"],
  "eme": [],
};
