// src/components/ProtocolFlowAAG.tsx
import { useMemo, useState } from "react";
import { FlowBlock, FlowRibbon, FlowChevron } from "./flow/FlowParts";

/**
 * Constantes modifiables (si votre protocole local diffère)
 */
const AAG_CONSTANTS = {
  o2FlowLMin: "6–8", // L/min
  targetSat: "94–98%",
  solumedrolMgPerKg: 2,
  solumedrolMaxMg: 40, // mettez undefined si pas de plafond
  mgso4BolusMgPerKg: 20, // sur 30 min
  mgso4PerfMgPerKgPerH: 10,
};

function formatNumber(n: number, digits = 0) {
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export default function ProtocolFlowAAG() {
  // UI d’exemple pour coller au mockup (âge/poids en haut)
  const [ageMonths, setAgeMonths] = useState<number>(10); // "10 mois" dans le mockup
  const [weightKg, setWeightKg] = useState<number>(10); // "10,0 kg" dans le mockup

  const ageYears = useMemo(() => ageMonths / 12, [ageMonths]);
  const isSixOrLess = useMemo(() => ageYears <= 6, [ageYears]);

  // Posologies dépendantes de l’âge (fiche papier)
  const salbutamolMg = isSixOrLess ? 2.5 : 5;
  const ipratropiumMg = isSixOrLess ? 0.25 : 0.5;

  const inhaledDoseLines = useMemo(
    () => [
      `SALBUTAMOL : ${formatNumber(salbutamolMg, salbutamolMg < 5 ? 1 : 0)} mg (selon âge)`,
      `IPRATROPIUM : ${formatNumber(ipratropiumMg, ipratropiumMg < 1 ? 2 : 1)} mg (selon âge)`,
    ],
    [salbutamolMg, ipratropiumMg]
  );

  // Solumédrol calculé
  const s = AAG_CONSTANTS.solumedrolMgPerKg * weightKg;
  const solumedrolDoseMg =
    AAG_CONSTANTS.solumedrolMaxMg !== undefined
      ? Math.min(s, AAG_CONSTANTS.solumedrolMaxMg)
      : s;

  // Hydratation : on conserve la mention protocolaire
  const hydrationLabel = "Dextrion G5% — 421 + 1/3 (calculée)";

  // Aide contextuelle pour l’AE
  const smallDoseBox = [
    "SALBUTAMOL :",
    `• ${formatNumber(2.5, 1)} mg si ≤ 6 A`,
    `• ${formatNumber(5, 0)} mg si > 6 A`,
    "",
    "IPRATROPIUM :",
    `• ${formatNumber(0.25, 2)} mg si ≤ 6 A`,
    `• ${formatNumber(0.5, 1)} mg si > 6 A`,
  ];

  return (
    <div className="w-full space-y-3">
      {/* Bandeau titre type “mockup” */}
      <div className="rounded-2xl p-4 text-white bg-gradient-to-b from-[#ff7f66] via-[#ff7f66] to-[#ff9b7e] shadow">
        <div className="text-sm opacity-90">PediaGo</div>
        <div className="text-2xl font-bold tracking-wide">ASTHME SÉVÈRE 🌬️</div>
        <div className="text-xs opacity-90">
          Calculateur dynamique de prise en charge
        </div>

        {/* Cartouche âge/poids */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/95 p-3 text-gray-900 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Âge</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-20 rounded-lg border px-2 py-1 text-sm"
                min={0}
                value={ageMonths}
                onChange={(e) => setAgeMonths(Number(e.target.value || 0))}
              />
              <span className="text-sm">mois</span>
            </div>
          </div>
          <div className="rounded-xl bg-white/95 p-3 text-gray-900 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Poids</div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-24 rounded-lg border px-2 py-1 text-sm"
                min={0}
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value || 0))}
              />
              <span className="text-sm">kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critère d’entrée */}
      <FlowBlock
        title="≥ 3ᵉ épisode de dyspnée sifflante chez NRS"
        bg="bg-yellow-100"
      />
      <FlowChevron />

      {/* Mesures initiales */}
      <FlowBlock
        title="½ assis, scope, O₂ titrée"
        subtitle={`Objectif SpO₂ ${AAG_CONSTANTS.targetSat}`}
        items={[]}
        bg="bg-gray-100"
      />
      <FlowChevron />

      {/* 1ère ligne */}
      <FlowRibbon
        title="AE SALBUTAMOL en continu sur 1 h  +  1 AE IPRATROPIUM / 8 h"
        subtitle={`Sous ${AAG_CONSTANTS.o2FlowLMin} L/min O₂`}
        gradient="from-indigo-400 via-sky-400 to-cyan-400"
        rightBadge="1ʳᵉ ligne thérapeutique"
        leftAsideTitle="Posologies (référence fiche)"
        leftAsideItems={smallDoseBox}
        items={inhaledDoseLines}
      />
      <FlowChevron />

      {/* Solumédrol */}
      <FlowBlock
        title="SOLUMÉDROL IV"
        subtitle={`${AAG_CONSTANTS.solumedrolMgPerKg} mg/kg  ${
          AAG_CONSTANTS.solumedrolMaxMg
            ? `(max ${AAG_CONSTANTS.solumedrolMaxMg} mg)`
            : ""
        }`}
        items={[`Dose calculée : ${formatNumber(solumedrolDoseMg)} mg`]}
        bg="bg-emerald-100"
      />
      <FlowChevron />

      {/* Hydratation */}
      <FlowBlock title="HYDRATATION" subtitle={hydrationLabel} bg="bg-blue-50" />
      <FlowChevron />

      {/* RP ?  (case repérable sur la fiche) */}
      <FlowBlock title="RP ?" bg="bg-white" />
      <FlowChevron />

      {/* 2e ligne si échec */}
      <FlowRibbon
        title="MgSO₄ IV"
        subtitle={`≥ ${AAG_CONSTANTS.mgso4BolusMgPerKg} mg/kg en 30 min  puis  ${AAG_CONSTANTS.mgso4PerfMgPerKgPerH} mg/kg/h en IVSE`}
        gradient="from-orange-400 to-amber-500"
        rightBadge="2ᵉ ligne (si échec)"
      />
      <FlowChevron />

      {/* VNI ? */}
      <FlowBlock title="VNI ?" bg="bg-white" />
      <FlowChevron />

      {/* IOT / réglages protecteurs */}
      <FlowBlock
        title="IOT (si nécessaire) — réglages protecteurs"
        items={[
          "ISR : kétamine + célocurine si pas de CI (SIT à ballonnet)",
          "Sédation profonde ± curarisation",
        ]}
        bg="bg-teal-100"
      />
      <FlowChevron />

      {/* ECMO */}
      <FlowBlock
        title="ECMO ?"
        subtitle="Hypoxémie majeure réfractaire / acidose"
        bg="bg-red-50"
      />
    </div>
  );
}
