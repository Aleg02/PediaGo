"use client";

import { useEffect, useState } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 2;
const MAX_W = 80;
const DEFAULT_W = 12;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const formatMl = (value: number, digits = 1) => `${value.toFixed(digits)} mL`;

export default function ProtocolFlowHyponatremie() {
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

  const [bolusCount, setBolusCount] = useState(1);

  const bolusVolume = Math.min(weightKg * 2, 100);
  const sodiumGiven = 0.513 * bolusVolume; // mmol apporté
  const expectedIncrease = 2 + (weightKg > 10 ? 1 : 0); // estimation simple +2-3

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-blue-700 to-cyan-600 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Trouble hydro-électrolytique</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Hyponatrémie aiguë sévère – enfant
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Urgence neurologique : NaCl 3 % 2 mL/kg sur 10 min si Na⁺ &lt; 125 ou symptômes sévères, répéter si besoin, puis correction lente.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale ABCDE"
            subtitle="Confirmer vraie hyponatrémie, rechercher signes neuro"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={[
                "Perméabilité VAS, préparation intubation si encéphalopathie sévère.",
              ]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "O₂ pour SpO₂ 94–98 %, ventilation assistée si hypoventilation ou convulsions.",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={[
                "Monitorage cardiaque, TA, accès IV/IO ; prélèvements : gaz, ionogramme complet, glycémie, osm plasmatique/urinaire, natriurèse.",
              ]}
            />
            <FlowBlock
              title="D - Disability"
              items={[
                "GCS/AVPU, signes d’HTIC (bradycardie, anisocorie, HTA, vomissements), convulsions.",
              ]}
            />
            <FlowBlock
              title="E - Exposure"
              items={[
                "Température, statut hydrique, œdèmes, recherche cause (SIADH, pertes digestives/rénales, intoxication…). Vérifier absence d’erreur pré-analytique.",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes de gravité"
            subtitle="Na⁺ &lt; 125 mmol/L ou symptômes neuro sévères"
            gradient="from-indigo-500 via-blue-500 to-cyan-500"
          />
          <FlowBlock
            title="Critères"
            items={[
              "Convulsions, troubles conscience, agitation/délire, signes d’HTIC, arrêt respiratoire imminent.",
              "Na⁺ &lt; 125 mmol/L ou toute hyponatrémie aiguë (&lt; 48 h) avec symptômes neurologiques.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitement d’attaque (urgence vitale)"
            subtitle="Objectif +4 à +6 mmol/L rapide"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="NaCl hypertonique 3 % IV"
            items={[
              <>
                Bolus 2 mL/kg sur 10 min (max 100 mL) → <strong>{formatMl(bolusVolume)}</strong>.
              </>,
              <>
                Apport Na⁺ ≈ 0,513 × volume : ~ <strong>{sodiumGiven.toFixed(1)} mmol</strong> ; correction attendue ~ +{" "}
                <strong>{expectedIncrease}</strong> mmol/L.
              </>,
              <>
                Doses restantes :{" "}
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
                  onClick={() => setBolusCount((c) => Math.min(c + 1, 3))}
                >
                  Ajouter 1 bolus
                </button>{" "}
                <span className="text-xs text-slate-700">(max 3 au total)</span>
              </>,
              <span className="text-sm text-slate-700">
                Bolus prévus : <strong>{bolusCount}</strong> / 3
              </span>,
            ]}
          />
          <FlowBlock
            title="Après chaque bolus"
            items={[
              "Contrôler Na⁺ 15–30 min après, réévaluer clinique.",
              "Si pas d’amélioration : répéter bolus (jusqu’à 3) et appeler réanimation.",
            ]}
          />
          <FlowBlock
            title="Anti-convulsivants"
            items={[
              "Selon protocole convulsion (ex : midazolam) si convulsions persistantes.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Correction lente contrôlée"
            subtitle="Max +8–10 mmol/L/24 h"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Principes"
            items={[
              "Cible +6 à +8 mmol/L sur 24 h (jamais > 10 mmol/L/24 h).",
              "Adapter selon cause : restriction hydrique SIADH, NaCl 0,9 % si pertes digestives/rénales/déshydratation, avis néphro/cardio pour IC/IR.",
              "Na⁺ toutes les 2 h initialement, surveillance neuro toutes les 30 min puis espacer.",
            ]}
          />
          <FlowBlock
            title="Situations particulières"
            items={[
              "Nourrisson/nouveau-né : risque œdème cérébral rapide, bolus strict 2 mL/kg.",
              "SIADH post-méningite/TC : restriction hydrique stricte, NaCl 3 % si symptômes, correction lente.",
              "Intoxications (thiazidiques, DIU, psychotropes) : arrêt immédiat, prise en charge spécialisée.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="À éviter"
            subtitle="Surcorrection et perfusions hypotoniques"
            gradient="from-slate-700 via-slate-800 to-black"
          />
          <FlowBlock
            title="Ne pas faire"
            items={[
              "Corriger trop vite (> 10 mmol/L/24 h).",
              "Perfusions hypotoniques (aggravent hyponatrémie).",
              "Diurétiques sans indication étiologique.",
              "Antagonistes vasopressine (vaptans) en urgence pédiatrique.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation systématique"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Toute hyponatrémie sévère (&lt; 125 mmol/L) ou symptomatique, toute hyponatrémie aiguë (&lt; 48 h), besoin NaCl 3 %. USC/réanimation selon gravité.",
            ]}
          />
          <FlowBlock
            title="Critères de stabilisation (phase aiguë)"
            items={[
              "Na⁺ &gt; 125–130 mmol/L, correction ≤ 8 mmol/L/24 h, symptômes neuro résolus.",
              "Cause identifiée et prise en charge initiée, plan de surveillance établi.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
