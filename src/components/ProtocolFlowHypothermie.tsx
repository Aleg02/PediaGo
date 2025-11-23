"use client";

import { useEffect, useState } from "react";

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
const formatTemp = (value: number) => `${value.toFixed(1)} °C`;

export default function ProtocolFlowHypothermie() {
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

  const [classif, setClassif] = useState<"legere" | "moderee" | "severe">("legere");

  const bolus10 = weightKg * 10;
  const bolus20 = weightKg * 20;
  const midazolamLow = weightKg * 0.1;
  const midazolamHigh = weightKg * 0.2;
  const clonazepam = weightKg * 0.05;
  const glucoseBolus = weightKg * 2; // mL of G10%

  const classifMeta: Record<
    typeof classif,
    { label: string; range: string; actions: string[]; gradient: string }
  > = {
    legere: {
      label: "Hypothermie légère",
      range: "32–35 °C",
      actions: [
        "Réchauffement externe passif + actif léger.",
        "Retirer vêtements mouillés, couvertures chaudes, air chaud pulsé.",
        "Alimentation chaude si conscient. Pas d’IV systématique.",
        "Objectif : +0,5 °C / heure.",
      ],
      gradient: "from-sky-500 via-cyan-500 to-emerald-400",
    },
    moderee: {
      label: "Hypothermie modérée",
      range: "28–32 °C",
      actions: [
        "Réchauffement externe actif + interne léger.",
        "Poches chauffantes thorax/aine/aisselles, air chaud pulsé.",
        "Perfusions chauffées 38–42 °C (NaCl 0,9 % ou RL).",
        `Bolus 10 mL/kg si hypovolémie modérée → ${formatMl(bolus10)} ; 20 mL/kg si hypoperfusion → ${formatMl(
          bolus20
        )} (réévaluer).`,
        "Oxygène chauffé/humidifié, monitorage continu (éviter massage vigoureux).",
      ],
      gradient: "from-amber-500 via-orange-500 to-rose-500",
    },
    severe: {
      label: "Hypothermie sévère",
      range: "< 28 °C",
      actions: [
        "Réchauffement interne actif (structure avancée).",
        "Méthodes : lavages chauds gastrique / intraveineux / thoracique, lavage vésical, air chaud humidifié.",
        "ECMO / CEC si arrêt cardiaque ou instabilité.",
        "Manipulation minimale (risque FV), monitorage continu.",
      ],
      gradient: "from-indigo-600 via-slate-700 to-slate-900",
    },
  };

  const currentClassif = classifMeta[classif];

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-800 via-sky-800 to-cyan-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Hypothermie accidentelle</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          T° centrale &lt; 35 °C – enfant
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Classer (légère/modérée/sévère), réchauffer sans traumatisme, corriger hypoglycémie et décider réanimation/hospitalisation.
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
            subtitle="Mesurer T° centrale, manipuler délicatement (risque FV)"
            gradient="from-slate-700 via-sky-700 to-cyan-600"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={["Voies aériennes libres ; réflexes diminués en hypothermie (attention aspiration/intubation)."]}
            />
            <FlowBlock
              title="B - Breathing"
              items={["Bradypnée fréquente.", "O₂ titré SpO₂ 94–98 % ; ventilation assistée si FR très basse."]}
            />
            <FlowBlock
              title="C - Circulation"
              items={[
                "Bradycardie physiologique, TRC prolongé, hypotension tardive.",
                "Manipuler l’enfant très doucement (risque FV). Prendre TA répétée.",
              ]}
            />
            <FlowBlock
              title="D - Disability"
              items={["Léthargie, confusion, coma possibles. Crises convulsives rares mais possibles."]}
            />
            <FlowBlock
              title="E - Exposition"
              items={[
                "Mesure T° centrale : rectale / sonde / œsophagienne (pas tympanique).",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Classification ERC"
            subtitle="Sélectionner la sévérité pour adapter le réchauffement"
            gradient="from-emerald-500 via-teal-500 to-sky-500"
          />
          <div className="rounded-3xl border border-black/10 bg-white/90 p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {(["legere", "moderee", "severe"] as const).map((key) => {
                const meta = classifMeta[key];
                const active = classif === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setClassif(key)}
                    className={`flex flex-col rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white shadow"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    <span>{meta.label}</span>
                    <span className={active ? "text-white/80 text-xs" : "text-slate-500 text-xs"}>
                      {meta.range}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
              <p className="text-sm font-semibold text-slate-900">{currentClassif.label}</p>
              <ul className="mt-2 list-disc pl-4 space-y-1">
                {currentClassif.actions.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates (toutes sévérités)"
            subtitle="Stabiliser, prévenir perte thermique et hypoglycémie"
            gradient="from-cyan-500 via-blue-500 to-indigo-500"
          />
          <FlowBlock
            title="Gestes essentiels"
            items={[
              "Manipulation minimale pour éviter FV.",
              "Retirer vêtements mouillés, sécher, couvrir (couverture isotherme).",
              "O₂ titré 94–98 %. SpO₂, ECG (QT long fréquent), TA (invasive si possible), T° centrale continue.",
              <>
                Hypoglycémie fréquente : G10 % bolus 2 mL/kg → <strong>{formatMl(glucoseBolus)}</strong>.
              </>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Réchauffement spécifique"
            subtitle="Adapter aux degrés de gravité"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Hypothermie légère (32–35 °C)"
            items={[
              "Réchauffement externe passif/actif léger : couvertures chaudes, air chaud pulsé, boissons chaudes si conscience OK.",
              "Pas d’IV systématique ; objectif +0,5 °C/h.",
            ]}
          />
          <FlowBlock
            title="Hypothermie modérée (28–32 °C)"
            items={[
              "Réchauffement externe actif + interne léger.",
              "Perfusions chauffées 38–42 °C (NaCl 0,9 % ou RL).",
              <>
                Hypovolémie modérée : bolus 10 mL/kg → <strong>{formatMl(bolus10)}</strong>.
              </>,
              <>
                Hypoperfusion : bolus 20 mL/kg → <strong>{formatMl(bolus20)}</strong> (réévaluer avant redonner).
              </>,
              "Oxygène chauffé/humidifié, monitorage continu.",
            ]}
          />
          <FlowBlock
            title="Hypothermie sévère (< 28 °C)"
            items={[
              "Réchauffement interne actif (structure équipée) : lavages gastrique/IV/thoracique chauds, lavage vésical.",
              "Air chaud humidifié, ECMO/CEC si arrêt cardiaque ou instabilité.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Arrêt cardiaque induit par le froid"
            subtitle="« Nul n’est mort avant d’être chaud et mort »"
            gradient="from-rose-600 via-red-600 to-orange-500"
          />
          <FlowBlock
            title="Conduite"
            items={[
              "RCP pédiatrique, défibrillation possible mais peu efficace < 30 °C.",
              "Médicaments (adrénaline) possibles mais efficacité diminuée.",
              "Priorité : réchauffement interne actif + ECMO si disponible.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitements complémentaires"
            subtitle="Convulsions, acidose, troubles ioniques"
            gradient="from-purple-500 via-fuchsia-500 to-rose-400"
          />
          <FlowBlock
            title="Convulsions"
            items={[
              <>
                Midazolam 0,1–0,2 mg/kg IV/IN → <strong>{formatMg(midazolamLow)}</strong> -{" "}
                <strong>{formatMg(midazolamHigh)}</strong>.
              </>,
              <>
                Ou clonazépam IV 0,05 mg/kg → <strong>{formatMg(clonazepam)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Acidose / troubles ioniques"
            items={[
              "Acidose se corrige avec réchauffement ; bicarbonate réservé aux pH < 7,0.",
              "Hyperkaliémie fréquente en hypothermie sévère : corriger après réchauffement sauf menace vitale.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter vitesse de réchauffement"
            gradient="from-sky-500 via-blue-600 to-slate-700"
          />
          <FlowBlock
            title="Nourrisson < 1 an"
            items={[
              "Risque majeur d’hypoglycémie, perte thermique rapide.",
              "Préférer réchauffement externe actif, lavages internes avec prudence.",
            ]}
          />
          <FlowBlock
            title="Submersion / immersion"
            items={[
              "Hypoxie dominante : intubation précoce si trouble conscience.",
              "Traiter l’hypoxie + hypothermie conjointement.",
            ]}
          />
          <FlowBlock
            title="Malnutrition / handicap / maladie chronique"
            items={[
              "Réchauffement lent impératif, éviter grandes variations thermiques.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation ou réanimation selon gravité"
            gradient="from-slate-800 via-slate-900 to-black"
          />
          <FlowBlock
            title="Hospitalisation si"
            items={[
              "T° < 32 °C, troubles neurologiques, troubles cardiaques (bradycardie sévère, arythmies).",
              "Hypothermie modérée ne se corrigeant pas, hypoglycémie persistante, vulnérabilité (maltraitance, submersion).",
            ]}
          />
          <FlowBlock
            title="Réanimation si"
            items={[
              "Hypothermie < 28 °C, coma, arythmies sévères, instabilité hémodynamique, besoin de réchauffement interne actif.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "T° ≥ 36 °C stabilisée 2–3 h, examen neuro normal.",
              "Ionogramme/glycémie normaux, pas d’arythmie.",
              "Cause identifiée et corrigée, environnement fiable, reconsultation < 24–48 h.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
