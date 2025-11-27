"use client";

import { useEffect } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 3;
const MAX_W = 120;
const DEFAULT_W = 20;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const formatMl = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return "-";
  const v = value as number;
  if (v < 1) return `${Number(v.toFixed(2))} mL`;
  if (v < 10) return `${Number(v.toFixed(1))} mL`;
  return `${Math.round(v)} mL`;
};

export default function ProtocolFlowInsuffisanceSurrenalienne() {
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

  const bolus20 = Math.min(weightKg * 20, 1000);
  const bolus10 = Math.min(weightKg * 10, 500);
  const glucose10 = Math.min(weightKg * 2, 100); // mL de G10% (0,2 g/kg)
  const hydrocortisoneBolus = Math.min(weightKg * 2, 100); // mg IV immédiat
  const hydrocortisone6h = Math.min(weightKg * 1, 50); // mg toutes 6h

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-amber-900 via-orange-800 to-rose-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Endocrino · Urgence</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Insuffisance surrénalienne aiguë (crise addisonienne) – enfant
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Choc hypovolémique/hypoglycémique avec hyponatrémie possible. Hydrocortisone IV urgente, remplissage, glucose
          et correction hydro-électrolytique.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
        <p className="mt-3 text-[13px] text-white/80">Sources : SFEDP/SFE, HAS urgences pédiatriques, PALS 2020.</p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Reconnaître la crise"
            subtitle="Antécédents de maladie d’Addison, traitement substitutif, contexte infectieux"
            gradient="from-amber-500 via-orange-500 to-red-500"
          />
          <FlowBlock
            title="Tableau typique"
            items={[
              "Asthénie majeure, vomissements répétés, douleurs abdominales, fièvre possible.",
              "Hypotension, tachycardie, TRC allongé, hypoglycémie, hyponatrémie, hyperkaliémie.",
              "Hyperpigmentation, antécédents surrénaliens (substitution corticoïde).",
            ]}
          />
          <FlowBlock
            title="Red flags"
            items={[
              "Choc ou collapsus, troubles de la conscience, convulsions hypoglycémiques.",
              "Na < 130 mmol/L, K > 6 mmol/L, lactate élevé.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Prise en charge initiale"
            subtitle="ABC + remplissage rapide"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Airway/Breathing"
            items={["O₂ titré, aspiration si vomissements, intubation si Glasgow bas ou choc réfractaire."]}
          />
          <FlowBlock
            title="Circulation"
            items={[
              <>NaCl 0,9 % 20 mL/kg IV en 10-20 min → <strong>{formatMl(bolus20)}</strong>, répéter 1x si besoin.</>,
              <>Puis bolus additionnel 10 mL/kg → <strong>{formatMl(bolus10)}</strong> si persistance hypotension.</>,
              "Surveillance de la diurèse, scope ECG (risque troubles K+).",
            ]}
          />
          <FlowBlock
            title="Biologie urgente"
            items={["Glycémie capillaire, ionogramme, gaz du sang, cortisol/ACTH avant hydrocortisone si possible mais ne pas retarder."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitement spécifique"
            subtitle="Hydrocortisone IV + glucose"
            gradient="from-indigo-500 via-blue-500 to-cyan-500"
          />
          <FlowBlock
            title="Hydrocortisone"
            items={[
              <>Bolus IV immédiat 2 mg/kg (max 100 mg) → <strong>{formatMg(hydrocortisoneBolus)}</strong>.</>,
              <>Puis 1 mg/kg IV toutes 6 h (max 50 mg) → <strong>{formatMg(hydrocortisone6h)}</strong> toutes 6 h.</>,
            ]}
          />
          <FlowBlock
            title="Glycémie"
            items={[
              <>Hypoglycémie (&lt; 0,7 g/L) : G10 % 2 mL/kg → <strong>{formatMl(glucose10)}</strong>, puis G10 % en perfusion continue (5-8 mg/kg/min).</>,
            ]}
          />
          <FlowBlock
            title="Équilibre hydro-électrolytique"
            items={[
              "Perfusion NaCl 0,9 % en entretien (éviter les solutés hypotoniques).",
              "Hyperkaliémie sévère : gluconate/calcium, salbutamol nébulisé/IV, résines si besoin.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Réanimation si choc, troubles ioniques sévères ou besoin de support vasopresseur"
            gradient="from-slate-500 via-slate-600 to-slate-700"
          />
          <FlowBlock
            title="Critères d’admission"
            items={[
              "Choc ou hypotension persistante après 40 mL/kg.",
              "Troubles neurologiques, hyperkaliémie > 6, hyponatrémie profonde.",
              "Enfant substitué (Addison, hyperplasie congénitale) : avis endocrino systématique.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}

