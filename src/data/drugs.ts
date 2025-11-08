// src/data/drugs.ts
import type { DosingRule, WeightOverride } from "@/lib/dosing";

/** =========================
 *  💊 Catalogue médicaments
 *  ========================= */
export type Drug = {
  id: string;
  name: string;
  unit?: string;   // unité principale affichée (mg, µg/kg/min, g…)
  route?: string;  // voie d'administration (IM, IV, IVSE, PO/BU…)
  note?: string;
};

export const DRUGS: Drug[] = [
  // Anaphylaxie / ACR
  { id: "adrenaline-im",       name: "Adrénaline",                         unit: "mg",         route: "IM" },
  { id: "adrenaline-ivse",     name: "Adrénaline",                         unit: "µg/kg/min",  route: "IVSE" },
  { id: "adrenaline-bolus-acr",name: "Adrénaline (bolus ACR)",             unit: "mg",         route: "IV/IO" },
  { id: "amiodarone",          name: "Amiodarone",                         unit: "mg",         route: "IV" },

  // AAG / choc
  { id: "salbutamol-ae",       name: "Salbutamol (nébulisation)",          unit: "mg",         route: "AE" },
  { id: "solumedrol",          name: "Solumédrol (méthylprednisolone)",    unit: "mg",         route: "IV" },
  { id: "mgso4",               name: "Sulfate de magnésium (MgSO₄)",       unit: "mg",         route: "IV" },
  { id: "exacyl",              name: "Exacyl (acide tranexamique)",        unit: "mg",         route: "IV" },

  // EME
  { id: "clonazepam",          name: "Clonazépam (Rivotril®)",             unit: "mg",         route: "IV" },
  { id: "midazolam-buccal",    name: "Midazolam (Buccolam® / PO)",         unit: "mg",         route: "PO/BU" },
  { id: "phenytoin",           name: "Phénytoïne (Dilantin®)",             unit: "mg",         route: "IV" },
  { id: "phenobarbital",       name: "Phénobarbital (Gardénal®)",          unit: "mg",         route: "IV" },
  { id: "levetiracetam",       name: "Lévétiracétam (Keppra®)",            unit: "mg",         route: "IV" },
];

/** =========================
 *  ⚖️ Règles génériques
 *  =========================
 *  Les overrides par poids (cartes 3–50 kg) priment sur ces règles.
 */
export const DOSING_RULES: Record<string, DosingRule> = {
  /** Adrénaline IM — 0,01 mg/kg, max 0,5 mg (anaphylaxie) */
  "adrenaline-im": {
    basis: "mg_per_kg",
    mg_per_kg: 0.01,
    per_dose: true,
    max_dose_mg: 0.5,
    rounding_step_mg: 0.01,
    frequency_text: "IM, à répéter selon protocole clinique",
    route: "IM",
  },

  /** Adrénaline IVSE — titration (texte informatif) */
  "adrenaline-ivse": {
    basis: "fixed",
    per_dose: false,
    route: "IVSE",
    notes: "Débit titré à l'effet, monitoré. Voir protocole pour la préparation.",
  },

  /** Adrénaline bolus (ACR) — 10 µg/kg (= 0,01 mg/kg) toutes les 4 minutes. */
  "adrenaline-bolus-acr": {
    basis: "mg_per_kg",
    mg_per_kg: 0.01,          // 10 µg/kg
    per_dose: true,
    rounding_step_mg: 0.01,   // arrondi 0,01 mg (10 µg)
    route: "IV/IO",
    frequency_text: "Bolus toutes les 4 min (voir dilution protocolaire).",
    notes: "Préparation diluée indiquée sur la carte (ex. 0,09 mg/mL), administrer 1 mL = 10 µg/kg à 9 kg.",
  },

  /** Amiodarone — 5 mg/kg IV si rythme choquable (ACR). */
  "amiodarone": {
    basis: "mg_per_kg",
    mg_per_kg: 5,
    per_dose: true,
    rounding_step_mg: 5,
    route: "IV",
    notes: "ACR rythme choquable : 5 mg/kg en bolus lent, voir protocole pour suites.",
  },

  /** Solumédrol — 2 mg/kg IV (AAG/anaphylaxie). */
  "solumedrol": {
    basis: "mg_per_kg",
    mg_per_kg: 2,
    per_dose: true,
    rounding_step_mg: 10,
    route: "IV",
    notes: "2 mg/kg IV, dose unique à réévaluer selon évolution.",
  },

  /** Salbutamol AE — tranches d'âge (texte) */
  "salbutamol-ae": {
    basis: "range",
    per_dose: true,
    route: "AE",
    notes: "Nébulisation : 2,5 mg ≤6 ans ; 5 mg >6 ans. Répéter selon protocole AAG.",
  },

  /** MgSO4 — 50 mg/kg (max 2 g) sur 30' (bolus) ± IVSE 10 mg/kg/h (AAG sévère). */
  "mgso4": {
    basis: "mg_per_kg",
    mg_per_kg: 50,
    per_dose: true,
    max_dose_mg: 2000,
    rounding_step_mg: 50,
    route: "IV",
    notes: "Bolus 50 mg/kg (max 2 g) sur 30 min. Selon sévérité, IVSE 10 mg/kg/h (voir préparation).",
  },

  /** Exacyl — 15 mg/kg (max 1 g) sur 10' (choc hémorragique). */
  "exacyl": {
    basis: "mg_per_kg",
    mg_per_kg: 15,
    per_dose: true,
    max_dose_mg: 1000,
    rounding_step_mg: 50,
    route: "IV",
    notes: "15 mg/kg IV sur 10 min, à débuter <3h après le traumatisme.",
  },

  /** Clonazépam — 0,015 mg/kg IV (EME, 1ère ligne) */
  "clonazepam": {
    basis: "mg_per_kg",
    mg_per_kg: 0.015,
    per_dose: true,
    rounding_step_mg: 0.005,
    route: "IV",
    notes: "Dilution selon carte (ex. 0,5 mg/mL), administrer la dose lente IV. EME 1ère ligne.",
  },

  /** Midazolam buccal/PO — 0,3 mg/kg (EME) */
  "midazolam-buccal": {
    basis: "mg_per_kg",
    mg_per_kg: 0.3,
    per_dose: true,
    rounding_step_mg: 0.5,
    route: "PO/BU",
    notes: "Buccolam®/PO 0,3 mg/kg. Alternative si IV non disponible en 1ère intention.",
  },

  /** Phénytoïne — 20 mg/kg sur 30' (EME 2e ligne) */
  "phenytoin": {
    basis: "mg_per_kg",
    mg_per_kg: 20,
    per_dose: true,
    rounding_step_mg: 25,
    route: "IV",
    notes: "Charge 20 mg/kg IV sur 30 min (surveillance ECG/TA).",
  },

  /** Phénobarbital — 15 mg/kg sur 10' (EME 2e/3e ligne) */
  "phenobarbital": {
    basis: "mg_per_kg",
    mg_per_kg: 15,
    per_dose: true,
    rounding_step_mg: 25,
    route: "IV",
    notes: "Charge 15 mg/kg IV sur 10 min.",
  },

  /** Lévétiracétam — 40 mg/kg sur 10' (EME 2e ligne) */
  "levetiracetam": {
    basis: "mg_per_kg",
    mg_per_kg: 40,
    per_dose: true,
    rounding_step_mg: 50,
    route: "IV",
    notes: "Charge 40 mg/kg IV sur 10 min.",
  },
};

/** =========================
 *  📊 Overrides (cartes)
 *  =========================
 *  Adrénaline IM 3→50 kg = 0,01 mg/kg (valeurs des cartes validées).
 */
const adrenalineIM_3_50: WeightOverride[] = Array.from({ length: 48 }, (_, i) => {
  const kg = i + 3; // 3 → 50
  return {
    min_kg: kg,
    max_kg: kg,
    dose_mg: Number((kg * 0.01).toFixed(2)),
    note: `Carte ${kg} kg`,
  };
});

export const WEIGHT_OVERRIDES: Record<string, WeightOverride[]> = {
  "adrenaline-im": adrenalineIM_3_50,

  // Les molécules ci-dessous restent sur la règle générique tant qu'aucune carte n'impose d'override chiffré par kg.
  "adrenaline-ivse": [],
  "adrenaline-bolus-acr": [],
  "amiodarone": [],
  "salbutamol-ae": [],
  "solumedrol": [],
  "mgso4": [],
  "exacyl": [],
  "clonazepam": [],
  "midazolam-buccal": [],
  "phenytoin": [],
  "phenobarbital": [],
  "levetiracetam": [],
};

/** =========================
 *  🩺 Médicaments par protocole
 *  ========================= */
export const PROTOCOL_DRUGS: Record<string, string[]> = {
  // cf. src/data/protocols.ts pour les slugs
  "anaphylaxie":      ["adrenaline-im", "adrenaline-ivse", "solumedrol"],
  "aag":              ["salbutamol-ae", "solumedrol", "mgso4"],
  "choc-hemorragique":["exacyl", "adrenaline-im"],
  "acr-enfant":       ["adrenaline-bolus-acr", "amiodarone"],
  "eme":              ["clonazepam", "midazolam-buccal", "phenytoin", "phenobarbital", "levetiracetam"],
};
