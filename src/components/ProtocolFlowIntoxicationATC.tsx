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

const formatG = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return "-";
  const v = value as number;
  return `${Number(v.toFixed(v >= 10 ? 0 : 1))} g`;
};

export default function ProtocolFlowIntoxicationATC() {
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

  const charcoal = Math.min(weightKg * 1, 50); // g de charbon si voie sécurisée
  const bicarLow = Math.min(weightKg * 1, 100); // mL de NaHCO3 8,4 % (1 mEq/mL)
  const bicarHigh = Math.min(weightKg * 2, 150);
  const diazepam = Math.min(weightKg * 0.2, 10);
  const lipidBolus = Math.min(weightKg * 1.5, 100); // Intralipid 20 %
  const noradLow = Math.min(weightKg * 0.03, 10); // mL/h pour 0,05 µg/kg/min (seringue 0,1 mg/mL)
  const noradHigh = Math.min(weightKg * 0.12, 18); // mL/h pour 0,2 µg/kg/min

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-rose-900 to-red-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Toxicologie · Urgence</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Intoxication aux antidépresseurs tricycliques (ATC) – enfant
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Risque de QRS large, tachyarythmies et convulsions. Bicarbonate IV précoce, benzodiazépines et support
          hémodynamique.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
        <p className="mt-3 text-[13px] text-white/80">Sources : PALS/ERTox, CAPTV, SRLF/SFMU toxicologie.</p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Reconnaissance"
            subtitle="Surdosage ATC (amitriptyline, clomipramine...)"
            gradient="from-rose-500 via-red-500 to-orange-500"
          />
          <FlowBlock
            title="Signes"
            items={[
              "Somnolence → coma, convulsions.",
              "Tachycardie, hypotension, QRS élargi (> 100 ms), QT long, arythmies ventriculaires.",
              "Anticholinergique : mydriase, rétention, hyperthermie.",
            ]}
          />
          <FlowBlock
            title="Red flags"
            items={[
              "QRS > 100 ms, QTc > 460 ms.",
              "Hypotension persistante, troubles du rythme, convulsions répétées.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates"
            subtitle="ABCDE + prévention inhalation"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Airway/Breathing"
            items={[
              "Position latérale, O₂ titré, aspiration. Intubation si coma convulsif ou choc.",
              "Ventilation sans hyperventilation excessive (PaCO₂ 35-40).",
            ]}
          />
          <FlowBlock
            title="Circulation"
            items={[
              "Monitoring ECG continu, VVP x2, PA invasive si choc.",
              "Glycémie capillaire, ionogramme, GDS, lactate.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitement spécifique"
            subtitle="Bicarbonate IV si QRS élargi ou hypotension"
            gradient="from-indigo-500 via-blue-500 to-cyan-500"
          />
          <FlowBlock
            title="Décontamination"
            items={[
              <>Charbon activé 1 g/kg (max 50 g) si conscience intacte/airway sécurisé → <strong>{formatG(charcoal)}</strong>.</>,
              "Pas de lavage gastrique sauf ingestion massive très récente et en milieu spécialisé.",
            ]}
          />
          <FlowBlock
            title="Bicarbonate 8,4 % (1 mEq/mL)"
            items={[
              <>Bolus 1 mL/kg (max 100 mL) → <strong>{formatMl(bicarLow)}</strong>; répéter jusqu'à QRS &lt; 100 ms.</>,
              <>Si inefficace : bolus 2 mL/kg (max 150 mL) → <strong>{formatMl(bicarHigh)}</strong> puis perfusion (150 mEq dans 1 L D5% à 2-3 mL/kg/h).</>,
            ]}
          />
          <FlowBlock
            title="Convulsions"
            items={[
              <>Diazépam 0,2 mg/kg IV (max 10 mg) → <strong>{formatMg(diazepam)}</strong>. Alternatives : clonazépam 0,05 mg/kg.</>,
              "Éviter flumazénil (risque convulsions).",
            ]}
          />
          <FlowBlock
            title="Choc/arythmie"
            items={[
              <>Noradrénaline seringue 0,1 mg/mL : 0,05–0,2 µg/kg/min → <strong>{formatMl(noradLow)}</strong> à <strong>{formatMl(noradHigh)}</strong> mL/h.</>,
              "Amiodarone et antiarythmiques Ia/Ic à éviter. Lidocaïne possible si TV réfractaire après bicarbonate.",
              <>Intralipid 20 % (toxicité réfractaire) : bolus 1,5 mL/kg → <strong>{formatMl(lipidBolus)}</strong>, puis 0,25 mL/kg/min 30 min.</>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Surveillance / Orientation"
            subtitle="Unité de soins continus ou réanimation"
            gradient="from-slate-500 via-slate-600 to-slate-700"
          />
          <FlowBlock
            title="Critères"
            items={[
              "ECG répétés toutes 30 min jusqu'à QRS normal et stabilité ≥ 12 h.",
              "Choc, convulsions, dose > 5 mg/kg ou ingestion massive → réanimation.",
              "Prévenir CAPTV, toxicologue référent.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}

