"use client";

import { useEffect } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 2;
const MAX_W = 120;
const DEFAULT_W = 20;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const formatMl = (value: number, digits = 1) => `${value.toFixed(digits)} mL`;
const formatMmol = (value: number, digits = 1) => `${value.toFixed(digits)} mEq`;
const formatUnits = (value: number, digits = 2) => `${value.toFixed(digits)} U`;

export default function ProtocolFlowHyperkaliemie() {
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

  const calciumVolume = Math.min(Math.max(weightKg * 0.2, 1), 10); // gluconate 10 % volume, min 1 mL, cap 10 mL
  const insulinDose = weightKg * 0.1; // U
  const dextrose50Ml = weightKg * 2; // mL of D50% = 0.5 g/kg
  const bicarbLow = weightKg * 1;
  const bicarbHigh = weightKg * 2;
  const salbutamolNeb = Math.min(Math.max(weightKg * 0.15, 2.5), 10); // mg

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-amber-800 to-rose-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Trouble ionique majeur</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Hyperkaliémie sévère – enfant
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Protéger le cœur, faire baisser le K⁺ rapidement (insuline/glucose, β2, bicarbonate si acidose), préparer épuration si nécessaire.
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
            title="Évaluation initiale"
            subtitle="Vérifier la vraie hyperkaliémie, rechercher signes ECG"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <div className="space-y-3">
            <FlowBlock
              title="ABCDE + bilans"
              items={[
                "Vérifier prélèvement (hémolyse, garrot serré) pour exclure pseudohyperkaliémie.",
                "O₂ (SpO₂ 94–98 %), monitorage ECG continu, TA, accès IV/IO.",
                "Bilan urgent : ionogramme (K, Na, Ca, Mg), gaz du sang, créat/urée, natriurèse, CK, bilan hépatique, recherche acidose.",
              ]}
            />
            <FlowBlock
              title="Signes de gravité"
              items={[
                "K⁺ ≥ ~6–6,5 mmol/L ou plus bas si signes ECG/cliniques.",
                "ECG : ondes T pointues, QRS élargi, absence P, rythme sinusoïdal.",
                "Clinique : faiblesse, arythmies, bradycardie, hypotension, arrêt imminent.",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates"
            subtitle="ECG continu, O₂, accès IV/IO"
            gradient="from-indigo-500 via-blue-500 to-cyan-500"
          />
          <FlowBlock
            title="Stabiliser"
            items={[
              "O₂ haut débit, monitorage continu, TA invasive si possible.",
              "Corriger causes : hypoxie, hypovolémie, acidose, rhabdomyolyse, arrêter médicaments hyperkaliémiants (RAAS, diurétiques K+, AINS).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Protection cardiaque"
            subtitle="Si signes ECG/arythmie"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <FlowBlock
            title="Calcium IV"
            items={[
              "Gluconate de calcium 10 % : 0,2 mL/kg sur 2–5 min (≈ 0,1 mmol/kg), min 1 mL, cap ~10 mL selon protocole local.",
              <>
                Volume calculé : <strong>{formatMl(calciumVolume)}</strong>.
              </>,
              "Surveiller ECG, répéter selon avis spécialisé.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Translocation rapide du K⁺"
            subtitle="Insuline/glucose ± bicarbonate ± β2"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Insuline + glucose"
            items={[
              <>
                Insuline régulière 0,1 U/kg IV bolus → <strong>{formatUnits(insulinDose, 2)}</strong>.
              </>,
              <>
                Glucose 50 % 2 mL/kg (0,5 g/kg) sur 20–30 min → <strong>{formatMl(dextrose50Ml)}</strong>.
              </>,
              "Surveiller glycémie toutes les 30 min pendant 2 h.",
            ]}
          />
          <FlowBlock
            title="Bicarbonate (si acidose)"
            items={[
              <>
                1–2 mEq/kg IV sur 5–10 min → <strong>{formatMmol(bicarbLow)}</strong> - <strong>{formatMmol(bicarbHigh)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Salbutamol nébulisé (adjuvant)"
            items={[
              <>
                0,15 mg/kg (2,5–5 mg usuel, max 10 mg) → <strong>{formatMg(salbutamolNeb)}</strong>.
              </>,
              "Surveillance cardiaque, non utilisable seul.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Élimination du potassium"
            subtitle="Après phase aiguë"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Mesures"
            items={[
              "Arrêter apports potassiques/médicaments hyperkaliémiants.",
              "Diurétiques si fonction rénale et volémie le permettent.",
              "Résines échangeuses rarement en urgence pédiatrique (voir néphro).",
              "Dialyse/épuration extrarénale si anurie/IRA, K⁺ > 7 ou persistance malgré traitements.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Nouveau-né, IR, rhabdomyolyse"
            gradient="from-sky-500 via-blue-600 to-slate-700"
          />
          <FlowBlock
            title="Nouveau-né/prématuré"
            items={[
              "Plages normales plus hautes (≤ 6 mmol/L) ; adapter volumes, avis néonat/néphro.",
            ]}
          />
          <FlowBlock
            title="IRA / dialyse"
            items={[
              "Prise en charge agressive, dialyse rapide si anurie ou hyperK persistant.",
            ]}
          />
          <FlowBlock
            title="Rhabdomyolyse / lyse / intox"
            items={[
              "Apport endogène massif → surveiller K⁺ toutes les 15–30 min initialement, bilan spécifique (CK, myoglobine).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation systématique"
            gradient="from-slate-700 via-slate-800 to-black"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Hyperkaliémie sévère ou symptômes/ECG : soins intensifs/réanimation pédiatrique.",
              "Monitorage continu, bilans répétés, préparation épuration.",
            ]}
          />
          <FlowBlock
            title="Critères de stabilisation (phase aiguë)"
            items={[
              "K⁺ < 5,5–6,0 mmol/L, ECG/clinique normalisés, pas de récidive 12–24 h.",
              "Causes corrigées ou planifiées, suivi néphro-cardio en place.",
            ]}
          />
          <FlowBlock
            title="À éviter"
            items={[
              "Reporter le calcium en présence de signes ECG.",
              "Utiliser résines seules dans les formes graves.",
              "Négliger l’accès IV/monitorage avant traitements.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
