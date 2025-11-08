// Convertit "10 mois", "6 ans", "3 ans 6 mois" → âge en mois
export function ageLabelToMonths(label: string | null): number | null {
  if (!label) return null;
  const lower = label.trim().toLowerCase();

  // "10 mois"
  const m = lower.match(/(\d+)\s*mois?/);
  // "6 ans" ou "3 ans 6 mois"
  const y = lower.match(/(\d+)\s*ans?/);
  const months = (y ? parseInt(y[1], 10) * 12 : 0) + (m ? parseInt(m[1], 10) : 0);
  return isNaN(months) ? null : months;
}
