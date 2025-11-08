export type DosingRule = {
  basis: "mg_per_kg" | "fixed" | "range";
  mg_per_kg?: number;
  per_dose: boolean;
  min_dose_mg?: number;
  max_dose_mg?: number;
  max_daily_mg_per_kg?: number;
  rounding_step_mg?: number;
  frequency_text?: string;
  route?: string;
  notes?: string;
};

export type WeightOverride = {
  min_kg: number;
  max_kg: number;
  dose_mg: number;
  note?: string;
};

export function roundToStep(value: number, step = 0) {
  if (!step || step <= 0) return value;
  return Math.round(value / step) * step;
}

export function computeDose(
  weightKg: number,
  rule: DosingRule,
  overrides: WeightOverride[] = []
) {
  // 1) override prioritaire
  const ov = overrides.find(o => weightKg >= o.min_kg && weightKg <= o.max_kg);
  if (ov) {
    return {
      doseMg: ov.dose_mg,
      source: "override" as const,
      note: ov.note ?? rule.notes,
      route: rule.route,
      frequency: rule.frequency_text,
    };
  }

  // 2) règle générique
  let raw = 0;

  if (rule.basis === "mg_per_kg" && rule.mg_per_kg) {
    raw = weightKg * rule.mg_per_kg;
  } else if (rule.basis === "fixed" && rule.min_dose_mg) {
    raw = rule.min_dose_mg;
  } else if (rule.basis === "range") {
    // Affichage informatif si range (ex: salbutamol AE par âge)
    return {
      doseMg: NaN,
      source: "rule" as const,
      note: rule.notes ?? "Voir protocole pour l'intervalle",
      route: rule.route,
      frequency: rule.frequency_text,
    };
  } else {
    return {
      doseMg: NaN,
      source: "rule" as const,
      note: rule.notes ?? "Règle non définie",
      route: rule.route,
      frequency: rule.frequency_text,
    };
  }

  if (rule.min_dose_mg) raw = Math.max(raw, rule.min_dose_mg);
  if (rule.max_dose_mg) raw = Math.min(raw, rule.max_dose_mg);

  const doseMg = roundToStep(raw, rule.rounding_step_mg ?? 0);
  const maxDailyMg = rule.max_daily_mg_per_kg ? rule.max_daily_mg_per_kg * weightKg : undefined;

  return {
    doseMg,
    source: "rule" as const,
    maxDailyMg,
    route: rule.route,
    frequency: rule.frequency_text,
    note: rule.notes,
  };
}
