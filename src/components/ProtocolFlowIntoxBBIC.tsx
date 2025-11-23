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

const formatMl = (value: number, digits = 2) => `${value.toFixed(digits)} mL`;
const formatUnits = (value: number, digits = 2) => `${value.toFixed(digits)} U`;
const formatUnitsPerHour = (value: number, digits = 2) => `${value.toFixed(digits)} U/h`;

export default function ProtocolFlowIntoxBBIC() {
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

  // Calculs pondérés
  const glucagonBolusMg = Math.min(weightKg * 0.05, 5); // 50 µg/kg -> 0.05 mg/kg, max 5 mg
  const glucagonInfusionMgH = Math.min(weightKg * 0.05, 5); // 50 µg/kg/h ou 1-5 mg/h
  const bolus10 = weightKg * 10;
  const bolus20 = weightKg * 20;

  const insulinBolusU = weightKg * 1; // 1 U/kg
  const insulinPerfLow = weightKg * 0.5;
  const insulinPerfHigh = weightKg * 1;
  const insulinPerfMax = weightKg * 10; // max 10 U/kg/h

  const caClMg = weightKg * 20;
  const caClMl = weightKg * 0.2; // 0.2 mL/kg (10 % = 100 mg/mL)
  const caGluconateMg = weightKg * 50;
  const caGluconateMl = weightKg * 0.5; // 0.5 mL/kg (10 % = 100 mg/mL eq)

  const lipidBolus = weightKg * 1.5;
  const lipidInfusionPerMin = weightKg * 0.25;
  const lipidMax = weightKg * 10;

  const noradrenalineLow = weightKg * 0.05;
  const noradrenalineHigh = weightKg * 1;
  const adrenalineLow = weightKg * 0.05;
  const adrenalineHigh = weightKg * 1;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-800 to-rose-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Toxicologie cardio</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Intoxication bêtabloquants / inhibiteurs calciques
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Dépister bradycardie/hypotension, corriger glycémie, titrer glucagon/calcium, lancer insuline haute dose et vasopresseurs si besoin.
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
            subtitle="Bradycardie, hypotension, troubles conductifs, hypo/hyperglycémie"
            gradient="from-indigo-500 via-blue-500 to-cyan-500"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={[
                "Vérifier conscience ; intubation si GCS ≤ 8 ou choc profond.",
              ]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "SpO₂, FR ; O₂ titré 94–98 %.",
                "Ventilation assistée si FR basse, troubles de conscience ou acidose métabolique.",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={[
                "Bradycardie extrême, PA basse ; ECG : BB = brady sinus, IC = BAV/blocs/QRS élargi/QT long.",
                "HypoCa fréquente pour IC.",
              ]}
            />
            <FlowBlock
              title="D - Disability"
              items={[
                "Convulsions possibles (propranolol) → midazolam 0,1–0,2 mg/kg.",
              ]}
            />
            <FlowBlock
              title="E - Exposure"
              items={[
                "Formes LP = gravité ; quantité, co-ingestion, geste volontaire (ado).",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens urgents"
            subtitle="Glycémie, ECG, iono, lactate"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Biologie"
            items={[
              "Glycémie : BB → hypo ; IC → hyper (signe de gravité).",
              "Ionogramme, Ca/Mg, gaz du sang (acidose), lactate, fonction rénale.",
            ]}
          />
          <FlowBlock
            title="ECG"
            items={[
              "BAV/blocs, QRS/QT, bradycardie.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures générales"
            subtitle="O₂, accès IV, remplissage prudent"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Voies veineuses / remplissage"
            items={[
              "2 VVP ou IO ; glycémie immédiate.",
              <>
                Remplissage : 10 mL/kg NaCl 0,9 % → <strong>{formatMl(bolus10)}</strong> en 10–15 min puis réévaluer.
              </>,
              <>
                Si choc : 20 mL/kg (prudence IC vasoplégie) → <strong>{formatMl(bolus20)}</strong>.
              </>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitement spécifique BB"
            subtitle="Glucagon ± insuline haute dose"
            gradient="from-purple-500 via-fuchsia-500 to-rose-400"
          />
          <FlowBlock
            title="Glucagon IV"
            items={[
              <>
                Bolus 50 µg/kg (max 5 mg) → <strong>{formatMg(glucagonBolusMg)}</strong>.
              </>,
              "Si inefficace : répéter une fois puis perfusion 50 µg/kg/h (1–5 mg/h).",
              <>
                Perfusion estimée : <strong>{formatMg(glucagonInfusionMgH)}</strong>/h (ajuster 1–5 mg/h).
              </>,
              "Effets : vomissements (prévoir ondansétron ≥ 2 ans 0,15 mg/kg), hyperglycémie.",
            ]}
          />
          <FlowBlock
            title="Insuline haute dose (HIET)"
            items={[
              "Indiquée si choc/bradycardie sévère (BB grave).",
              <>
                Bolus 1 U/kg si glycémie &gt; 6 mmol/L → <strong>{formatUnits(insulinBolusU)}</strong>.
              </>,
              <>
                Perfusion : 0,5–1 U/kg/h → <strong>{formatUnitsPerHour(insulinPerfLow)}</strong> -{" "}
                <strong>{formatUnitsPerHour(insulinPerfHigh)}</strong> (max ≈{" "}
                <strong>{formatUnitsPerHour(insulinPerfMax)}</strong>).
              </>,
              "Augmenter par paliers de 0,5 U/kg/h toutes 30 min selon réponse. Associé à glucose (G30 %) pour cible glycémie 6–10 mmol/L et K+ 3,5–4,5.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitement spécifique IC"
            subtitle="Calcium + insuline haute dose"
            gradient="from-indigo-500 via-blue-500 to-cyan-500"
          />
          <FlowBlock
            title="Calcium IV"
            items={[
              "Chlorure de calcium 10 % (centrale) : 20 mg/kg (0,2 mL/kg) en 10 min, à répéter 3 fois max.",
              <>
                Soit ~ <strong>{formatMg(caClMg)}</strong> mg = <strong>{formatMl(caClMl)}</strong>.
              </>,
              "Gluconate 10 % (périphérique) : 50 mg/kg (0,5 mL/kg) en 10 min, répéter 2–3 fois puis perfusion 50 mg/kg/h.",
              <>
                Soit ~ <strong>{formatMg(caGluconateMg)}</strong> mg = <strong>{formatMl(caGluconateMl)}</strong>; perf ~{" "}
                <strong>{formatMg(caGluconateMg)}</strong>/h.
              </>,
            ]}
          />
          <FlowBlock
            title="Insuline haute dose"
            items={[
              "Première ligne IC sévère : mêmes doses que BB.",
            ]}
          />
          <FlowBlock
            title="Vasopresseurs"
            items={[
              <>
                Adrénaline : 0,05–1 µg/kg/min → <strong>{formatMg(adrenalineLow)}</strong> -{" "}
                <strong>{formatMg(adrenalineHigh)}</strong> µg/min pour {formatMl(1)}? (adapter en µg/min selon pompe).
              </>,
              <>
                Noradrénaline : 0,05–1 µg/kg/min → <strong>{formatMg(noradrenalineLow)}</strong> -{" "}
                <strong>{formatMg(noradrenalineHigh)}</strong> µg/min (adapter à la pompe).
              </>,
            ]}
          />
          <FlowBlock
            title="Intralipides"
            items={[
              <>
                Bolus 20 % : 1,5 mL/kg → <strong>{formatMl(lipidBolus)}</strong>.
              </>,
              <>
                Perfusion 0,25 mL/kg/min pendant 30–60 min → <strong>{formatMl(lipidInfusionPerMin)}</strong>/min.
              </>,
              <>
                Dose max : <strong>{formatMl(lipidMax)}</strong>.
              </>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Autres traitements"
            subtitle="Selon réponse"
            gradient="from-slate-700 via-slate-800 to-black"
          />
          <FlowBlock
            title="Atropine"
            items={["0,02 mg/kg IV (efficacité limitée en bradycardie BB/IC)."]}
          />
          <FlowBlock
            title="Charbon"
            items={[
              "Uniquement si ingestion < 1 h et enfant conscient : 1 g/kg. Pas de lavage gastrique.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="LP, nourrisson, ado"
            gradient="from-sky-500 via-blue-600 to-slate-700"
          />
          <FlowBlock
            title="Formes LP"
            items={[
              "Risque de choc tardif ; surveillance ≥ 24–36 h ; HIET souvent nécessaire.",
            ]}
          />
          <FlowBlock
            title="Nourrisson &lt; 2 ans"
            items={[
              "Risque hypoglycémie majeur : surveillance glycémie rapprochée, doses prudentes.",
            ]}
          />
          <FlowBlock
            title="Adolescent (geste suicidaire)"
            items={[
              "Évaluation psychiatrique obligatoire.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation / réanimation"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Bradycardie/hypotension, ECG anormal, forme LP, besoin de calcium/glucagon/insuline IV, ingestion volontaire, co-intoxication, âge < 3 ans.",
            ]}
          />
          <FlowBlock
            title="Réanimation"
            items={[
              "HIET nécessaire, choc, vasopresseurs, ventilation assistée, BAV haut degré, défaillances d'organe.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "FC et PA normales sans vasopresseur, ECG normal, glycémie stable sans perfusion.",
              "Asymptomatique ≥ 12 h (≥ 24 h si LP), suivi psy si ingestion volontaire, parents fiables.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
