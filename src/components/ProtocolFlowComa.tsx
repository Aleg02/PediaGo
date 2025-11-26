"use client";

import { useEffect } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 5;
const MAX_W = 120;
const DEFAULT_W = 20;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const formatMl = (value: number) => {
  if (value < 1) return `${Number(value.toFixed(2))} mL`;
  if (value < 10) return `${Number(value.toFixed(1))} mL`;
  return `${Math.round(value)} mL`;
};

const formatMlPerHour = (value: number | null) => {
  if (!Number.isFinite(value ?? NaN)) return "-";
  return `${formatMl(value as number)}/h`;
};

const formatG = (value: number) => `${Number(value.toFixed(value >= 10 ? 0 : 1))} g`;

const calcMaintenance = (kg: number | null) => {
  if (!Number.isFinite(kg ?? NaN)) return null;
  const w = kg as number;
  if (w <= 0) return null;
  let rate = 0;
  if (w > 20) rate += (w - 20) * 1;
  if (w > 10) rate += (Math.min(w, 20) - 10) * 2;
  rate += Math.min(w, 10) * 4;
  return rate;
};

export default function ProtocolFlowComa() {
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

  const bolus10 = weightKg * 10;
  const bolus20 = weightKg * 20;
  const glucoseBolus = weightKg * 2; // mL of G10%

  const midazolamIv = weightKg * 0.1;
  const midazolamInBuccal = weightKg * 0.2;
  const levetiracetamLow = weightKg * 20;
  const levetiracetamHigh = weightKg * 40;
  const phenytoin = weightKg * 20;
  const naloxone = weightKg * 0.01;

  const nacl3Low = weightKg * 3;
  const nacl3High = weightKg * 5;
  const mannitolLowG = weightKg * 0.5;
  const mannitolHighG = weightKg * 1;

  const maintenance = calcMaintenance(weightKg);

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-900 to-purple-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Neurologie · Urgence</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">Coma pédiatrique non traumatique</h1>
        <p className="text-sm text-white/85 mt-1">
          Stabiliser ABCDE, traiter les causes réversibles (hypoglycémie, convulsions, sepsis, intoxication), protéger l'encéphale et organiser la réanimation.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
        <p className="mt-3 text-[13px] text-white/80">Version 2025 – HAS, SFP, SRLF, ESPNIC, AAP, NICE.</p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale (ABCDE)"
            subtitle="GCS, glycémie immédiate"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="A / B"
            items={[
              "VAS libre, position neutre, aspiration douce si vomissements.",
              "Intubation si GCS = 8 ou détresse respiratoire (ISR conforme SRLF).",
              "O₂ SpO₂ 94–98 % : lunettes 1–4 L/min, masque 10–15 L/min si détresse ; FR, tirage, capno si ventilé.",
            ]}
          />
          <FlowBlock
            title="C"
            items={[
              "FC, PA, TRC, T° ; VVP immédiate.",
              <>Si choc : NaCl 0,9 % 10–20 mL/kg en 10–20 min → <strong>{formatMl(bolus10)}</strong> à <strong>{formatMl(bolus20)}</strong>, réévaluation.</>,
            ]}
          />
          <FlowBlock
            title="D"
            items={[
              "GCS pédiatrique, pupilles, tonus, convulsions.",
              <>Glycémie capillaire : hypoglycémie &lt; 0,7 g/L → G10 % 2 mL/kg → <strong>{formatMl(glucoseBolus)}</strong>, puis perfusion glucose 5–8 mg/kg/min.</>,
            ]}
          />
          <FlowBlock
            title="E"
            items={["Recherche purpura, intoxication, morsure, température, glycémie répétée."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes de gravité"
            subtitle="Indication réanimation immédiate"
            gradient="from-red-600 via-rose-600 to-orange-600"
          />
          <FlowBlock
            title="Critères"
            items={[
              "GCS = 8, convulsions persistantes, choc/sepsis, bradypnée ou pauses, hypotension, hypothermie &lt; 35 °C ou hyperthermie > 40 °C.",
              "Pupilles asymétriques/non réactives, vomissements en jet, raideur méningée sévère, suspicion méningite/purpura, troubles du rythme graves.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitements initiaux ciblés"
            subtitle="Causes réversibles"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Hypoglycémie"
            items={[<>G10 % 2 mL/kg IV → <strong>{formatMl(glucoseBolus)}</strong>, puis perfusion glucose 5–8 mg/kg/min.</>]}
          />
          <FlowBlock
            title="Convulsions"
            items={[
              <>Midazolam IV 0,1 mg/kg → <strong>{formatMg(midazolamIv)}</strong> (renouvelable 1 fois) ; buccal/IN 0,2 mg/kg → <strong>{formatMg(midazolamInBuccal)}</strong>.</>,
              <>
                Si persistance : Lévétiracétam 20–40 mg/kg IV → <strong>{formatMg(levetiracetamLow)}</strong> à <strong>{formatMg(levetiracetamHigh)}</strong> (10–20 min).
              </>,
              <>3e ligne : Phénytoïne 20 mg/kg IV lent → <strong>{formatMg(phenytoin)}</strong>.</>,
            ]}
          />
          <FlowBlock
            title="Infection sévère / méningite"
            items={[
              "Cefotaxime 200 mg/kg/j IV (ou Ceftriaxone 80–100 mg/kg/j) à ajouter Amikacine 15 mg/kg/j si choc septique ; Vancomycine 40–60 mg/kg/j si méningite possible.",
            ]}
          />
          <FlowBlock
            title="HTIC suspectée"
            items={[
              <>NaCl 3 % 3–5 mL/kg → <strong>{formatMl(nacl3Low)}</strong> à <strong>{formatMl(nacl3High)}</strong> en 10–20 min.</>,
              <>Ou Mannitol 20 % 0,5–1 g/kg → <strong>{formatG(mannitolLowG)}</strong> à <strong>{formatG(mannitolHighG)}</strong> en 20 min.</>,
              "Tête surélevée 30°, PaCO₂ 35–45 mmHg, normothermie ; pas d'hyperventilation prolongée.",
            ]}
          />
          <FlowBlock
            title="Intoxication suspectée"
            items={[
              <>Opiacés : Naloxone 0,01 mg/kg IV → <strong>{formatMg(naloxone)}</strong> (répéter si besoin).</>,
              "Paracétamol : N-acétylcystéine selon protocole local.",
              "BZD : Flumazénil non recommandé en routine (risque convulsions).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens complémentaires"
            subtitle="Après stabilisation"
            gradient="from-slate-500 via-slate-600 to-slate-700"
          />
          <FlowBlock
            title="Biologie urgente"
            items={["NFS, CRP, ionogramme, calcémie, beta-HCG, hémocultures si infection, GDS, ECG, toxiques sang/urines si suspicion."]}
          />
          <FlowBlock
            title="Imagerie"
            items={[
              "Scanner cérébral si signes focaux, HTIC, coma inexpliqué, crise prolongée, pupilles anormales.",
              "IRM en différé pour étiologie (encéphalite, AVC, ADEM, etc.).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter la prise en charge"
            gradient="from-indigo-500 via-blue-500 to-sky-500"
          />
          <FlowBlock title="Nourrisson < 2 mois" items={["Suspicion méningite/infection sévère → ATB systématiques."]} />
          <FlowBlock
            title="Status epilepticus"
            items={["Séquence AAP : Midazolam → Lévétiracétam → Phénytoïne → anesthésie (kétamine selon protocole)."]}
          />
          <FlowBlock
            title="Trouble métabolique"
            items={["Ammoniémie, lactates, correction métabolique spécialisée."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation réanimation"
            gradient="from-amber-600 via-orange-600 to-rose-600"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Toute altération de conscience → hospitalisation. Réanimation pédiatrique si GCS = 12, infection grave, HTIC, convulsions persistantes, défaillance respi/hémo, hyperthermie majeure, intoxication sévère.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Cause identifiée et résolue, examen neuro normal, pas de convulsion > 24 h, glycémie stable, parents fiables, avis pédiatrique, bilan/imagerie rassurants, suivi programmé.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Résumé posologique"
            subtitle="Calculs automatiques selon poids"
            gradient="from-slate-900 via-gray-800 to-slate-700"
          />
          <FlowBlock
            title="Oxygène"
            items={["SpO₂ 94–98 %, 1–4 L/min lunettes ou 10–15 L/min masque selon gravité."]}
          />
          <FlowBlock
            title="Remplissage"
            items={[<>NaCl 0,9 % 10–20 mL/kg → <strong>{formatMl(bolus10)}</strong> à <strong>{formatMl(bolus20)}</strong>.</>]}
          />
          <FlowBlock
            title="Glucose"
            items={[<>G10 % 2 mL/kg → <strong>{formatMl(glucoseBolus)}</strong> ; perfusion 5–8 mg/kg/min ensuite.</>]}
          />
          <FlowBlock
            title="Convulsions"
            items={[
              <>Midazolam IV 0,1 mg/kg → <strong>{formatMg(midazolamIv)}</strong> (IN/BU 0,2 mg/kg → <strong>{formatMg(midazolamInBuccal)}</strong>).</>,
              <>
                Lévétiracétam 20–40 mg/kg → <strong>{formatMg(levetiracetamLow)}</strong> à <strong>{formatMg(levetiracetamHigh)}</strong>.
              </>,
              <>Phénytoïne 20 mg/kg → <strong>{formatMg(phenytoin)}</strong>.</>,
            ]}
          />
          <FlowBlock
            title="Antidotes / HTIC"
            items={[
              <>Naloxone 0,01 mg/kg → <strong>{formatMg(naloxone)}</strong>.</>,
              <>NaCl 3 % 3–5 mL/kg → <strong>{formatMl(nacl3Low)}</strong> à <strong>{formatMl(nacl3High)}</strong>.</>,
              <>
                Mannitol 0,5–1 g/kg → <strong>{formatG(mannitolLowG)}</strong> à <strong>{formatG(mannitolHighG)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Entretien"
            items={[`Perfusion 4-2-1 ≈ ${formatMlPerHour(maintenance)} (ajuster selon besoin et risque d'œdème cérébral).`]}
          />
        </div>
      </div>
    </div>
  );
}
