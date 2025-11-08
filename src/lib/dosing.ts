export type DosingRule = {
  mg_per_kg: number;
  per_dose: boolean;
};

export function computeDose(weightKg: number, rule: DosingRule): number {
  return weightKg * rule.mg_per_kg;
}
