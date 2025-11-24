// src/data/drugs.ts
// Catalogue des médicaments + règles de calcul + overrides par poids (3→50 kg)

import type { DosingRule, WeightOverride } from "@/lib/dosing";

/* ============================================================================
   💊 Types & Catalogue
   ============================================================================ */

export type Drug = {
  id: string;
  name: string;
  unit?: string;   // unité principale affichée (mg, µg/kg/min, g, mg/h, µg/h…)
  route?: string;  // voie d’administration (IM, IV, IVSE, AE, PO/BU…)
  note?: string;   // remarque libre
};

export const DRUGS: Drug[] = [
  // ——— Anaphylaxie / ACR / AAG / EME (déjà en place)
  { id: "adrenaline-im", name: "Adrénaline", unit: "mg", route: "IM" },
  { id: "adrenaline-ivse", name: "Adrénaline", unit: "µg/kg/min", route: "IVSE" },
  { id: "adrenaline-bolus-acr", name: "Adrénaline (bolus ACR)", unit: "mg", route: "IV/IO" },
  { id: "amiodarone", name: "Amiodarone", unit: "mg", route: "IV" },
  { id: "salbutamol-ae", name: "Salbutamol (nébulisation)", unit: "mg", route: "AE" },
  { id: "solumedrol", name: "Solumédrol (méthylprednisolone)", unit: "mg", route: "IV" },
  { id: "mgso4", name: "Sulfate de magnésium (MgSO₄)", unit: "mg", route: "IV" },
  { id: "exacyl", name: "Exacyl (acide tranexamique)", unit: "mg", route: "IV" },
  { id: "clonazepam", name: "Clonazépam (Rivotril®)", unit: "mg", route: "IV" },
  { id: "midazolam-buccal", name: "Midazolam (Buccolam® / PO)", unit: "mg", route: "PO/BU" },
  { id: "phenytoin", name: "Phénytoïne (Dilantin®)", unit: "mg", route: "IV" },
  { id: "phenobarbital", name: "Phénobarbital (Gardénal®)", unit: "mg", route: "IV" },
  { id: "levetiracetam", name: "Lévétiracétam (Keppra®)", unit: "mg", route: "IV" },

  // ——— Nouveaux (structure prête ; chiffres exacts injectés via overrides)
  { id: "naloxone", name: "Naloxone", unit: "mg", route: "IV/IM/IN" },
  { id: "flumazenil", name: "Flumazénil", unit: "mg", route: "IV" },
  { id: "morphine", name: "Morphine", unit: "mg", route: "IV" },
  { id: "adenosine", name: "Adénosine", unit: "mg", route: "IV" },
  { id: "ceftriaxone", name: "Céftriaxone", unit: "mg", route: "IV" },
  { id: "ipratropium-ae", name: "Ipratropium (nébulisation)", unit: "mg", route: "AE" },

  // ——— ISR (Séquence rapide)
  { id: "ketamine-isr", name: "Kétamine", unit: "mg", route: "IV" },
  { id: "propofol-isr", name: "Propofol", unit: "mg", route: "IV" },
  { id: "suxamethonium", name: "Suxaméthonium", unit: "mg", route: "IV" },

  // ——— Sédation (IVSE)
  { id: "midazolam-ivse", name: "Midazolam", unit: "mg/h", route: "IVSE" },
  { id: "sufentanil-ivse", name: "Sufentanil", unit: "µg/h", route: "IVSE" },

  // ——— État de choc (amines)
  { id: "noradrenaline", name: "Noradrénaline", unit: "µg/kg/min", route: "IVSE" },
  { id: "adrenaline-ivse-choc", name: "Adrénaline", unit: "µg/kg/min", route: "IVSE" },
  { id: "dobutamine-ivse", name: "Dobutamine", unit: "µg/kg/min", route: "IVSE" },
  { id: "dopamine-ivse", name: "Dopamine", unit: "µg/kg/min", route: "IVSE" },
];

/* ============================================================================
   ⚖️ Règles de calcul (moteur)
   ---------------------------------------------------------------------------
   - Pour les nouveaux items sensibles, on reste en "range" (affichage OK)
     et on injecte les valeurs exactes via WEIGHT_OVERRIDES (cartes 3→50 kg).
   - Rien n’est inventé : si pas d’override, l’UI affiche “voir carte”.
   ============================================================================ */

export const DOSING_RULES: Record<string, DosingRule> = {
  // ——— existants
  "adrenaline-im": { basis: "mg_per_kg", mg_per_kg: 0.01, per_dose: true, max_dose_mg: 0.5, rounding_step_mg: 0.01, frequency_text: "IM, à répéter selon protocole clinique", route: "IM" },
  "adrenaline-ivse": { basis: "fixed", per_dose: false, route: "IVSE", notes: "Débit titré à l'effet, monitoré. Voir protocole." },
  "adrenaline-bolus-acr": { basis: "mg_per_kg", mg_per_kg: 0.01, per_dose: true, rounding_step_mg: 0.01, route: "IV/IO", frequency_text: "Bolus toutes les 4 min", notes: "Dilution protocolaire." },
  "amiodarone": { basis: "mg_per_kg", mg_per_kg: 5, per_dose: true, rounding_step_mg: 5, route: "IV", notes: "ACR rythme choquable : 5 mg/kg en bolus lent." },
  "solumedrol": { basis: "mg_per_kg", mg_per_kg: 2, per_dose: true, rounding_step_mg: 10, route: "IV", notes: "2 mg/kg IV (AAG/anaphylaxie)." },
  "salbutamol-ae": { basis: "range", per_dose: true, route: "AE", notes: "2,5 mg ≤6 ans ; 5 mg >6 ans (lié à l’âge dans l’UI)." },
  "mgso4": { basis: "mg_per_kg", mg_per_kg: 50, per_dose: true, max_dose_mg: 2000, rounding_step_mg: 50, route: "IV", notes: "50 mg/kg (max 2 g) sur 30 min." },
  "exacyl": { basis: "mg_per_kg", mg_per_kg: 15, per_dose: true, max_dose_mg: 1000, rounding_step_mg: 50, route: "IV", notes: "15 mg/kg (max 1 g) sur 10 min, débuter < 3 h." },
  "clonazepam": { basis: "mg_per_kg", mg_per_kg: 0.015, per_dose: true, rounding_step_mg: 0.005, route: "IV", notes: "EME 1ère ligne." },
  "midazolam-buccal": { basis: "mg_per_kg", mg_per_kg: 0.3, per_dose: true, rounding_step_mg: 0.5, route: "PO/BU", notes: "Alternative si IV non dispo (EME)." },
  "phenytoin": { basis: "mg_per_kg", mg_per_kg: 20, per_dose: true, rounding_step_mg: 25, route: "IV", notes: "Charge sur 30 min (EME)." },
  "phenobarbital": { basis: "mg_per_kg", mg_per_kg: 15, per_dose: true, rounding_step_mg: 25, route: "IV", notes: "Charge sur 10 min (EME)." },
  "levetiracetam": { basis: "mg_per_kg", mg_per_kg: 40, per_dose: true, rounding_step_mg: 50, route: "IV", notes: "Charge sur 10 min (EME)." },

  // ——— nouveaux (placeholder → seront alimentés par overrides 3→50 kg)
  "naloxone": { basis: "range", per_dose: true, route: "IV/IM/IN", notes: "Overdose opioïdes : voir carte (dose exacte par poids)." },
  "flumazenil": { basis: "range", per_dose: true, route: "IV", notes: "Antagoniste BZD (⚠️ sevrage/convulsions) — voir carte." },
  "morphine": { basis: "range", per_dose: true, route: "IV", notes: "Antalgie : bolus/IVSE — voir carte." },
  "adenosine": { basis: "range", per_dose: true, route: "IV", notes: "TSV : bolus rapide + rinçage — voir carte." },
  "ceftriaxone": { basis: "range", per_dose: true, route: "IV", notes: "Sepsis/Méningite — voir carte." },
  "ipratropium-ae": { basis: "range", per_dose: true, route: "AE", notes: "0,25 mg ≤6 ans ; 0,5 mg >6 ans (1/8 h)." },

  // ——— ISR / Sédation / Choc (alimentés par overrides)
  "ketamine-isr": { basis: "range", per_dose: true, route: "IV", notes: "Kétamine ISR — dose exacte carte poids." },
  "propofol-isr": { basis: "range", per_dose: true, route: "IV", notes: "Propofol ISR — dose exacte carte poids." },
  "suxamethonium": { basis: "range", per_dose: true, route: "IV", notes: "Suxaméthonium ISR — dose exacte carte poids." },

  "midazolam-ivse": { basis: "range", per_dose: false, route: "IVSE", notes: "Midazolam IVSE — débit exact carte poids (mg/h)." },
  "sufentanil-ivse": { basis: "range", per_dose: false, route: "IVSE", notes: "Sufentanil IVSE — débit exact carte poids (µg/h)." },

  "noradrenaline": { basis: "range", per_dose: false, route: "IVSE", notes: "Noradrénaline — µg/kg/min selon carte." },
  "adrenaline-ivse-choc": { basis: "range", per_dose: false, route: "IVSE", notes: "Adrénaline (choc) — µg/kg/min selon carte." },
  "dobutamine-ivse": { basis: "range", per_dose: false, route: "IVSE", notes: "Dobutamine — µg/kg/min selon carte." },
  "dopamine-ivse": { basis: "range", per_dose: false, route: "IVSE", notes: "Dopamine — µg/kg/min selon carte." },
};

/* ============================================================================
   📊 Overrides (cartes 3→50 kg)
   ---------------------------------------------------------------------------
   - On peut coder en dur, ou importer des JSON (voir bas de fichier).
   - Exemple sûr fourni : Adrénaline IM = 0,01 mg/kg pour 3→50 kg.
   ============================================================================ */

const adrenalineIM_3_50: WeightOverride[] = Array.from({ length: 48 }, (_, idx) => {
  const kg = idx + 3;                 // 3 … 50
  return {
    min_kg: kg,
    max_kg: kg,
    dose_mg: Number((kg * 0.01).toFixed(2)),
    note: `Carte ${kg} kg`,
  };
});

export const WEIGHT_OVERRIDES: Record<string, WeightOverride[]> = {
  // ——— Overrides existants
  "adrenaline-im": adrenalineIM_3_50,

  // ——— Par défaut vides (remplis ensuite via JSON 3→50 kg)
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

  // ——— Nouveaux
  "naloxone": [],
  "flumazenil": [],
  "morphine": [],
  "adenosine": [],
  "ceftriaxone": [],
  "ipratropium-ae": [],

  // ——— ISR / Sédation / Choc
  "ketamine-isr": [],
  "propofol-isr": [],
  "suxamethonium": [],
  "midazolam-ivse": [],
  "sufentanil-ivse": [],
  "noradrenaline": [],
  "adrenaline-ivse-choc": [],
  "dobutamine-ivse": [],
  "dopamine-ivse": [],
};

/* ============================================================================
   🩺 Médicaments par protocole (affichage “cartes médicament”)
   ---------------------------------------------------------------------------
   - Les sections colorées (PosologySections) complètent l’onglet Posologie.
   ============================================================================ */

export const PROTOCOL_DRUGS: Record<string, string[]> = {
  "anaphylaxie": ["adrenaline-im", "adrenaline-ivse", "solumedrol"],
  "aag": ["salbutamol-ae", "solumedrol", "mgso4"],  // ipratropium affiché via section
  "choc-hemorragique": ["exacyl", "adrenaline-im"],
  "acr-enfant": ["adrenaline-bolus-acr", "amiodarone"],
  "eme": ["clonazepam", "midazolam-buccal", "phenytoin", "phenobarbital", "levetiracetam"],
  "antalgiques": ["morphine", "naloxone", "flumazenil"],

  // À activer quand les workflows correspondants sont prêts :
  // "intoxication-opioides": ["naloxone"],
  // "intoxication-bzd":      ["flumazenil"],
  // "douleur-aigue":         ["morphine"],
  // "tsv":                   ["adenosine"],
  // "sepsis-meningite":      ["ceftriaxone"],
};

/* ============================================================================
   (Optionnel) Imports JSON pour overrides 3→50 kg
   ---------------------------------------------------------------------------
   1) Place tes fichiers dans: src/data/overrides/*.json
   2) Décommente ces imports + le bloc d’injection ci-dessous.
   ============================================================================ */

// ---------- Générateurs d'overrides (3→50 kg) ----------

function generateOverride(
  dosePerKg: number,
  unit: "mg" | "µg",
  decimals = 2
): WeightOverride[] {
  return Array.from({ length: 48 }, (_, idx) => {
    const kg = idx + 3;
    const raw = kg * dosePerKg;
    return {
      min_kg: kg,
      max_kg: kg,
      dose_mg: Number(raw.toFixed(decimals)), // Note: dose_mg stocke la valeur numérique, même si c'est des µg/h
      note: `Calculé sur ${dosePerKg} ${unit}/kg`,
    };
  });
}

// ISR
WEIGHT_OVERRIDES["ketamine-isr"] = generateOverride(2, "mg");      // 2 mg/kg
WEIGHT_OVERRIDES["propofol-isr"] = generateOverride(3, "mg");      // 3 mg/kg
WEIGHT_OVERRIDES["suxamethonium"] = generateOverride(1, "mg");      // 1 mg/kg

// Sédation IVSE (dose_mg stocke le débit en mg/h ou µg/h selon l'unité du médicament)
WEIGHT_OVERRIDES["midazolam-ivse"] = generateOverride(0.1, "mg");    // 0.1 mg/kg/h
WEIGHT_OVERRIDES["sufentanil-ivse"] = generateOverride(0.3, "µg");    // 0.3 µg/kg/h

// Choc (IVSE)
WEIGHT_OVERRIDES["noradrenaline"] = generateOverride(0.1, "µg"); // 0.1 µg/kg/min
WEIGHT_OVERRIDES["adrenaline-ivse-choc"] = generateOverride(0.1, "µg"); // 0.1 µg/kg/min
WEIGHT_OVERRIDES["dobutamine-ivse"] = generateOverride(5, "µg");   // 5 µg/kg/min
WEIGHT_OVERRIDES["dopamine-ivse"] = generateOverride(10, "µg");  // 10 µg/kg/min

// Antidotes / Antalgiques
WEIGHT_OVERRIDES["naloxone"] = generateOverride(0.01, "mg", 3); // 10 µg/kg
WEIGHT_OVERRIDES["flumazenil"] = generateOverride(0.01, "mg", 3); // 10 µg/kg
WEIGHT_OVERRIDES["morphine"] = generateOverride(0.1, "mg");     // 0.1 mg/kg
WEIGHT_OVERRIDES["adenosine"] = generateOverride(0.1, "mg");     // 0.1 mg/kg
WEIGHT_OVERRIDES["ceftriaxone"] = generateOverride(50, "mg");      // 50 mg/kg
