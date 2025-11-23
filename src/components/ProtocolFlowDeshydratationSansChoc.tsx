"use client";

import { useEffect, useMemo, useState } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 3;
const MAX_W = 80;
const DEFAULT_W = 12;
const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const clampPercent = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return 8;
  return Math.min(Math.max(value as number, 5), 10);
};

const formatMl = (value: number, digits = 2) => `${value.toFixed(digits)} mL`;
const formatMlPerHour = (value: number, digits = 2) => `${value.toFixed(digits)} mL/h`;
const formatMmolPerDay = (value: number, digits = 2) => `${value.toFixed(digits)} mEq/j`;

export default function ProtocolFlowDeshydratationSansChoc() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);

  const weightKg = clampWeight(weightFromStore);

  useEffect(() => {
    if (!ageLabel) {
      const estimated = estimateAgeFromWeight(weightKg);
      if (estimated) setAgeLabel(estimated);
    }
  }, [ageLabel, setAgeLabel, weightKg]);

  const [dehydPercent, setDehydPercent] = useState<number>(8);
  const percent = clampPercent(dehydPercent);

  const sro50 = weightKg * 50;
  const sro100 = weightKg * 100;

  const deficitTotal = weightKg * percent * 10; // mL
  const deficitFirstHalf = deficitTotal / 2;
  const deficitRateFirst4h = deficitFirstHalf / 4;

  const maintenanceRate = useMemo(() => {
    if (weightKg <= 10) return weightKg * 4;
    if (weightKg <= 20) return 40 + (weightKg - 10) * 2;
    return 60 + (weightKg - 20) * 1;
  }, [weightKg]);

  const totalRateExample = deficitRateFirst4h + maintenanceRate;

  const ondansetronDose = Math.min(weightKg * 0.15, 8);
  const g10Bolus = weightKg * 2; // mL
  const kclLow = weightKg * 0.5;
  const kclHigh = weightKg * 1;
  const paracetamolDose = weightKg * 15;

  const isUnder6Months = useMemo(() => {
    const label = typeof ageLabel === "string" ? ageLabel.toLowerCase() : "";
    return label.includes("mois") && /(^[1-5]\s*mois)|(<\s*6\s*mois)/.test(label);
  }, [ageLabel]);

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-sky-600 via-cyan-600 to-emerald-500 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Déshydratation modérée</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Aiguë sans choc franc (vomissements/diarrhées)
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Hypovolémie non compliquée : prévenir le choc, privilégier la réhydratation orale, basculer en IV si incapacité à boire.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>

        <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                % déshydratation estimée (modérée 5–8 %)
              </p>
              <p className="text-xl font-semibold">{percent.toFixed(1)} %</p>
              <p className="text-xs text-white/80">
                Pas de signe de choc (TA normale, TRC &lt; 3 s, conscience préservée).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                min={5}
                max={10}
                step="0.5"
                value={percent}
                onChange={(e) => setDehydPercent(Number(e.target.value))}
                className="h-11 w-24 rounded-xl border border-white/40 bg-white/90 px-3 text-right text-lg font-semibold text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              <span className="text-sm text-white/80">%</span>
            </div>
          </div>
          <div className="mt-3">
            <input
              type="range"
              min={5}
              max={10}
              step="0.5"
              value={percent}
              onChange={(e) => setDehydPercent(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale ABCDE"
            subtitle="Confirmer l'absence de choc, rechercher les pertes et la tolérance orale"
            gradient="from-sky-500 via-cyan-500 to-emerald-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={["RAS sauf vomissements persistants (risque inhalation)."]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "FR parfois légèrement augmentée si acidose.",
                "O₂ uniquement si SpO₂ < 94 % → O₂ titré pour SpO₂ 94–98 %. ",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={[
                "Hypovolémie non sévère : TRC < 3 s, TA normale, tachycardie modérée, pouls périphériques présents.",
                "Pas de signes de choc franc : sinon protocole « Hypovolémie sévère / choc ». ",
              ]}
            />
            <FlowBlock
              title="D - Disability"
              items={["Fatigue/irritabilité, conscience préservée (pas d’altération majeure)."]}
            />
            <FlowBlock
              title="E - Exposition"
              items={[
                "Muqueuses sèches, pli cutané lent, yeux cernés, oligurie.",
                "Rechercher pertes (vomissements/diarrhées), fièvre, apport réduit.",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Classification déshydratation"
            subtitle="Basée HAS + ESPGHAN"
            gradient="from-emerald-500 via-lime-500 to-teal-500"
          />
          <FlowBlock
            title="Modérée (≈ 5–8 %)"
            items={[
              "Soif intense, muqueuses sèches, diurèse diminuée.",
              "Tachycardie, TRC normal ou très légèrement augmenté, pli cutané modérément lent, état général conservé.",
            ]}
          />
          <FlowBlock
            title="Sévère (> 10 %)"
            items={[
              "Orientation vers protocole « Déshydratation aiguë sévère » / choc.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Réhydratation orale (si l'enfant peut boire)"
            subtitle="Recommandée en 1ère intention (HAS, ESPGHAN, AAP)"
            gradient="from-cyan-500 via-blue-500 to-indigo-500"
          />
          <FlowBlock
            title="Solutions de réhydratation orale (SRO)"
            items={[
              "Utiliser SRO standards OMS/ESPGHAN.",
              <>
                Posologie : 50–100 mL/kg sur 4 h → <strong>{formatMl(sro50)}</strong> à{" "}
                <strong>{formatMl(sro100)}</strong> sur 4 h ({formatMlPerHour(sro50 / 4)} à{" "}
                {formatMlPerHour(sro100 / 4)}).
              </>,
              "Administrer en petites quantités (5–10 mL toutes les 1–2 min).",
            ]}
          />
          <FlowBlock
            title="Vomissements ?"
            items={[
              <>
                Ondansétron si ≥ 2 ans : 0,15 mg/kg IV ou PO (max 8 mg) →{" "}
                <strong>{formatMg(ondansetronDose)}</strong>.
              </>,
              "Ne pas utiliser métoclopramide (risque extra-pyramidal), AINS, lopéramide (CI enfants).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Réhydratation IV (si incapacité à boire)"
            subtitle="Déficit modéré + entretien 4-2-1"
            gradient="from-amber-400 via-orange-500 to-red-500"
          />
          <FlowBlock
            title="Soluté"
            items={["NaCl 0,9 % ou Ringer Lactate."]}
          />
          <FlowBlock
            title="Correction du déficit (modéré)"
            items={[
              <>
                Déficit (mL) = poids × % déshydratation × 10 → <strong>{formatMl(deficitTotal)}</strong>.
              </>,
              <>
                Correction initiale : 50 % sur 4 h → <strong>{formatMl(deficitFirstHalf)}</strong> (soit{" "}
                <strong>{formatMlPerHour(deficitRateFirst4h)}</strong>).
              </>,
            ]}
          />
          <FlowBlock
            title="Entretien (4-2-1)"
            items={[
              "4 mL/kg/h pour les 10 premiers kg ; 2 mL/kg/h pour les 10 suivants ; 1 mL/kg/h au-delà.",
              <>
                Débit entretien = <strong>{formatMlPerHour(maintenanceRate, 2)}</strong>.
              </>,
              <>
                Exemple total pendant les 4 premières heures : réhydratation{" "}
                <strong>{formatMlPerHour(deficitRateFirst4h)}</strong> + entretien{" "}
                <strong>{formatMlPerHour(maintenanceRate)}</strong> ≈{" "}
                <strong>{formatMlPerHour(totalRateExample)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Électrolytes"
            items={[
              "Ajouter KCl uniquement après reprise de diurèse.",
              <>
                Dose : 0,5–1 mEq/kg/j → <strong>{formatMmolPerDay(kclLow)}</strong> à{" "}
                <strong>{formatMmolPerDay(kclHigh)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Hypoglycémie (< 3 mmol/L)"
            items={[
              <>
                G10 % bolus : 2 mL/kg → <strong>{formatMl(g10Bolus)}</strong>, puis perfusion G10 % selon besoins.
              </>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures complémentaires"
            subtitle="Symptômes associés"
            gradient="from-purple-500 via-fuchsia-500 to-rose-400"
          />
          <FlowBlock
            title="Antalgie / fièvre"
            items={[
              <>
                Paracétamol 15 mg/kg/6 h → <strong>{formatMg(paracetamolDose)}</strong> par prise (AINS déconseillés).
              </>,
            ]}
          />
          <FlowBlock
            title="Zinc (OMS, &lt; 5 ans)"
            items={[
              isUnder6Months
                ? "10 mg/j si < 6 mois (10–14 jours)."
                : "10 mg/j (< 6 mois) ou 20 mg/j (> 6 mois) pendant 10–14 jours.",
            ]}
          />
          <FlowBlock
            title="Probiotiques (ESPGHAN)"
            items={["Lactobacillus GG ou Saccharomyces boulardii selon protocole local."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Surveillance, hospitalisation ou sortie"
            gradient="from-slate-700 via-slate-800 to-slate-900"
          />
          <FlowBlock
            title="Hospitalisation si"
            items={[
              "Incapacité à boire / vomissements incoercibles.",
              "Déshydratation modérée avec altération de l'état général, ionogramme perturbé.",
              "Pathologie sous-jacente sévère, âge < 3 mois, échec réhydratation orale, environnement familial incertain.",
              "Déshydratation sévère → protocole dédié.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Hydratation clinique normale, diurèse reprise.",
              "Tolérance orale bonne, pas de vomissements persistants, ionogramme normal.",
              "Famille fiable, contrôle programmé &lt; 24–48 h.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Médicaments à éviter"
            subtitle="Respect des recommandations HAS / ESPGHAN"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <FlowBlock
            title="Ne pas utiliser"
            items={[
              "Métoclopramide (risque extra-pyramidal).",
              "AINS (déconseillés dans ce contexte).",
              "Lopéramide (contre-indiqué chez l'enfant).",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
