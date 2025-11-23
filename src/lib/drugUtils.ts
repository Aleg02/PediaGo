/**
 * Utilitaires partagés pour le calcul de doses et de posologies.
 * Ce fichier regroupe la logique métier spécifique à certains médicaments
 * qui ne rentre pas dans le moteur générique `dosing.ts`.
 */

/**
 * Plafond de ceftriaxone en fonction de l’âge sélectionné.
 * Règle : Naissance → 11 ans = 1 g max ; 12 → 15 ans = 2 g max.
 */
export function getCeftriaxoneMaxMg(ageLabel: string | null | undefined): number {
  const label = (ageLabel ?? "").trim();

  if (!label) {
    // Par défaut, on reste prudent : 1 g max
    return 1000;
  }

  const teenLabels = new Set([
    "12 ans",
    "13 ans",
    "14 ans",
    "15 ans",
  ]);

  if (teenLabels.has(label)) {
    return 2000; // 2 g max pour l’adolescent
  }

  return 1000; // 1 g max pour tous les autres (nourrisson + enfant)
}
