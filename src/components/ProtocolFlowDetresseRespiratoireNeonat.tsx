"use client";

import { useEffect } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 1;
const MAX_W = 6;
const DEFAULT_W = 3;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const formatMl = (value: number) => {
  if (value < 1) return `${Number(value.toFixed(2))} mL`;
  if (value < 10) return `${Number(value.toFixed(1))} mL`;
  return `${Math.round(value)} mL`;
};

export default function ProtocolFlowDetresseRespiratoireNeonat() {
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

  const glucoseBolus = weightKg * 2; // mL G10%
  const ampiDose = weightKg * 50;
  const gentaLow = weightKg * 4;
  const gentaHigh = weightKg * 5;
  const surfactantInit = weightKg * 200;
  const surfactantSecond = weightKg * 100;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-sky-900 to-cyan-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Néonatologie · Respiration</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">Détresse respiratoire du nouveau-né (DRNN)</h1>
        <p className="text-sm text-white/85 mt-1">
          Reconnaître, stabiliser rapidement (O₂ titré, CPAP, ventilation), différencier les causes et organiser l’admission spécialisée.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
        <p className="mt-3 text-[13px] text-white/80">Version 2025 – HAS, SFN, ILCOR, ERC, AAP, NICE, SPLF.</p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale"
            subtitle="Signes et gravité"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Signes cliniques"
            items={[
              "FR > 60/min, tirage (sus-sternal/sous-costal/intercostal), geignement, battement des ailes du nez.",
              "Cyanose/désaturation, discordance thoraco-abdominale.",
            ]}
          />
          <FlowBlock
            title="Signes de gravité"
            items={[
              "Apnées répétées, SpO₂ < 90 % malgré O₂, FC < 100/min.",
              "Hypotonie, troubles de conscience, suspicion pneumothorax, SDR sévère du prématuré.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates"
            subtitle="Stabilisation respiratoire"
            gradient="from-sky-500 via-cyan-500 to-blue-600"
          />
          <FlowBlock
            title="Oxygène titré"
            items={[
              "Objectif SpO₂ : < 10 min suivre courbes ILCOR ; ensuite 94–98 %.",
              "Lunettes 1–2 L/min, masque 5–10 L/min ; éviter hyperoxie (BPD/ROPI).",
            ]}
          />
          <FlowBlock
            title="Position et thermorégulation"
            items={["Position neutre de la tête, incubateur thermique si prématuré, limiter manipulations, T° 36,5–37,5 °C."]}
          />
          <FlowBlock
            title="VVP / glycémie"
            items={[
              "VVP si détresse modérée/sévère ; glycémie capillaire.",
              <>Hypoglycémie < 0,45 g/L : G10 % 2 mL/kg → <strong>{formatMl(glucoseBolus)}</strong>.</>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Ventilation non invasive (CPAP)"
            subtitle="Indications SFN / ERC"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Quand"
            items={[
              "SpO₂ non contrôlée malgré O₂, tirage modéré/sévère.",
              "SDR du prématuré, TTN modéré/sévère, nouveau-né stable hémodynamiquement.",
            ]}
          />
          <FlowBlock
            title="Paramètres"
            items={["CPAP initiale 5–6 cmH₂O, FiO₂ ajustée ; +1 cmH₂O si lutte persistante (max ~8)."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Ventilation invasive"
            subtitle="Critères NRP / ILCOR / ERC"
            gradient="from-purple-500 via-fuchsia-500 to-rose-500"
          />
          <FlowBlock
            title="Indications"
            items={[
              "Apnées persistantes, échec CPAP, FR < 30/min avec lutte.",
              "pH < 7,20 ou pCO₂ > 65 mmHg.",
              "Suspicion pneumothorax avec instabilité, score Silverman > 6.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Surfactant (SDR prématuré)"
            subtitle="SFN / ERC 2021"
            gradient="from-indigo-500 via-blue-500 to-sky-500"
          />
          <FlowBlock
            title="Indications"
            items={[
              "Prématuré < 32 SA avec SDR, FiO₂ > 0,30 sous CPAP pour maintenir SpO₂ cible.",
              "Radio thorax typique (verre dépoli).",
            ]}
          />
          <FlowBlock
            title="Posologie (Curosurf)"
            items={[
              <>
                Dose initiale 200 mg/kg → <strong>{formatMg(surfactantInit)}</strong>.
              </>,
              <>
                Seconde dose si besoin : 100 mg/kg → <strong>{formatMg(surfactantSecond)}</strong> à ~12 h.
              </>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Antibiothérapie"
            subtitle="Infection néonatale précoce suspectée"
            gradient="from-amber-600 via-orange-600 to-rose-600"
          />
          <FlowBlock
            title="Indications"
            items={[
              "Fièvre maternelle, RPM > 18 h, mauvaise coloration, SDR sévère, irritabilité.",
            ]}
          />
          <FlowBlock
            title="Schéma"
            items={[
              <>
                Ampicilline (ou amoxicilline) 50 mg/kg IV q12h → <strong>{formatMg(ampiDose)}</strong> / dose.
              </>,
              <>
                Gentamicine 4–5 mg/kg IV q24–36h → <strong>{formatMg(gentaLow)}</strong> – <strong>{formatMg(gentaHigh)}</strong> / dose.
              </>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter la prise en charge"
            gradient="from-slate-500 via-slate-600 to-slate-700"
          />
          <FlowBlock
            title="Prématuré < 32 SA"
            items={["CPAP précoce, surfactant si FiO₂ > 30 %, surveillance hypothermie, éviter ventilation invasive prolongée."]}
          />
          <FlowBlock
            title="Inhalation méconiale"
            items={["Pas d’aspiration systématique ; VPP si besoin ; intubation seulement si obstruction méconiale évidente."]}
          />
          <FlowBlock
            title="Hernie diaphragmatique congénitale"
            items={["Ne pas ventiler au masque ; intubation immédiate ; sonde gastrique à l’aspiration."]}
          />
          <FlowBlock
            title="Pneumothorax néonatal"
            items={[
              "Signes : asymétrie, hypotension, cyanose, déviation médiastinale ; transillumination utile.",
              "Ponction évacuatrice 18–22 G si grave, drain si récidive ou massif.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation nécessaire"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Toute DRNN modérée à sévère : CPAP ou FiO₂ > 0,30, infection suspectée, pneumothorax, SDR prématuré, inhalation méconiale, hypotonie/apnée, suspicion cardiopathie.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "SpO₂ stable en air ambiant > 94 %, FR < 60/min sans tirage.",
              "Thermostabilité, alimentation correcte, examen rassurant, étiologie bénigne résolue (TTN).",
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
            items={["Lunettes 1–2 L/min, masque 5–10 L/min, objectif SpO₂ 94–98 % (adapter aux courbes < 10 min)."]}
          />
          <FlowBlock
            title="Glucose"
            items={[<>G10 % 2 mL/kg → <strong>{formatMl(glucoseBolus)}</strong> si hypoglycémie.</>]}
          />
          <FlowBlock
            title="Antibiotiques"
            items={[
              <>Ampicilline 50 mg/kg/dose → <strong>{formatMg(ampiDose)}</strong> q12h.</>,
              <>Gentamicine 4–5 mg/kg/dose → <strong>{formatMg(gentaLow)}</strong> – <strong>{formatMg(gentaHigh)}</strong> (selon âge gestationnel).</>,
            ]}
          />
          <FlowBlock
            title="Surfactant"
            items={[
              <>200 mg/kg → <strong>{formatMg(surfactantInit)}</strong> (dose initiale).</>,
              <>100 mg/kg → <strong>{formatMg(surfactantSecond)}</strong> (2e dose si besoin).</>,
            ]}
          />
          <FlowBlock
            title="Ventilation"
            items={["CPAP 5–6 cmH₂O (jusqu’à 8 si besoin), FiO₂ titrée ; critères d’intubation si échec/instabilité."]}
          />
        </div>
      </div>
    </div>
  );
}
