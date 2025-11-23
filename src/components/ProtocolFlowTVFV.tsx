"use client";

import { useEffect, useMemo, useState } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 3;
const MAX_W = 80;
const DEFAULT_W = 20;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const formatJ = (value: number) => `${value.toFixed(1)} J`;
const formatMl = (value: number, digits = 1) => `${value.toFixed(digits)} mL`;

export default function ProtocolFlowTVFV() {
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

  const [scenario, setScenario] = useState<"arret" | "tv_pouls" | "torsades">("arret");

  const shock4J = weightKg * 4;
  const shock1J = weightKg * 1;
  const shock2J = weightKg * 2;
  const shockMax = weightKg * 10;

  const adrenalineMg = weightKg * 0.01;
  const adrenalineMl = weightKg * 0.1; // 0,1 mg/mL
  const amiodaroneMg = weightKg * 5;
  const lidocaineMg = weightKg * 1;
  const lidocaineRepeatLow = weightKg * 0.5;
  const lidocaineRepeatHigh = weightKg * 1;
  const magnesiumLow = weightKg * 25;
  const magnesiumHigh = weightKg * 50;
  const magnesiumLowCapped = Math.min(magnesiumLow, 2000);
  const magnesiumHighCapped = Math.min(magnesiumHigh, 2000);

  const scenarioLabel = useMemo(
    () =>
      ({
        arret: "Arrêt pVT / FV (rythme choquable)",
        tv_pouls: "TV avec pouls",
        torsades: "Torsades de pointes (QT long)",
      }[scenario]),
    [scenario]
  );

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-rose-800 to-amber-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Rythmes ventriculaires graves</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          TV / FV / torsades – enfant
        </h1>
        <p className="text-sm text-white/85 mt-1">
          RCP + défibrillation 4 J/kg pour pVT/FV, cardioversion si TV instable avec pouls, MgSO4 pour torsades et correction ionique.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(["arret", "tv_pouls", "torsades"] as const).map((key) => {
            const active = scenario === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setScenario(key)}
                className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-white bg-white text-slate-900 shadow"
                    : "border-white/50 bg-white/10 text-white hover:border-white/80"
                }`}
              >
                {({
                  arret: "pVT / FV (arrêt)",
                  tv_pouls: "TV avec pouls",
                  torsades: "Torsades de pointes",
                }[key])}
              </button>
            );
          })}
        </div>
        <p className="mt-1 text-xs text-white/80">Scénario : {scenarioLabel}</p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale ABCDE"
            subtitle="Recherche de pouls central ≤ 10 s, monitor/DAE"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={["Sécurité, appel aide/réa, liberté VAS, canule si besoin."]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "O₂ haut débit (FiO₂ proche 1,0) pour SpO₂ 94–98 %.",
                "Ventilation BAVU si apnée/bradypnée ; intubation si arrêt prolongé ou instabilité.",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={[
                "Pouls central carotide/fémoral ≤ 10 s ; signes de choc (TRC > 3 s, marbrures, hypotension, altération conscience).",
              ]}
            />
            <FlowBlock
              title="D - Disability"
              items={["Score AVPU/GCS, convulsions, glycémie capillaire."]}
            />
            <FlowBlock
              title="E - Exposition"
              items={["ECG, rechercher causes (trauma, intoxication, fièvre, ioniques, hypoxie...)."]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Arrêt pVT / FV (rythme choquable)"
            subtitle="RCP de haute qualité + défibrillation"
            gradient="from-indigo-500 via-blue-500 to-cyan-500"
          />
          <FlowBlock
            title="Défibrillation biphasique"
            items={[
              <>
                Dose recommandée : <strong>{formatJ(shock4J)}</strong> (4 J/kg, intervalle autorisé 2–4 J/kg).
              </>,
              <>
                Séquence : choc 4 J/kg → RCP 2 min → analyse. Choc 2 à 4 J/kg → RCP 2 min. Après 3ᵉ choc persistant : adrénaline + amiodarone.
              </>,
              <>
                Chocs ultérieurs = 4 J/kg ou plus jusqu'à ~ <strong>{formatJ(shockMax)}</strong> (8–10 J/kg max selon appareil).
              </>,
            ]}
          />
          <FlowBlock
            title="Médicaments (après 3ᵉ choc)"
            items={[
              <>
                Adrénaline 0,01 mg/kg IV/IO = <strong>{formatMg(adrenalineMg)}</strong> (~{" "}
                <strong>{formatMl(adrenalineMl)}</strong> à 0,1 mg/mL) toutes les 3–5 min (max 1 mg/bolus).
              </>,
              <>
                Amiodarone 5 mg/kg IV/IO → <strong>{formatMg(amiodaroneMg)}</strong> (répéter jusqu'à 3 doses, total 15 mg/kg) ou lidocaïne 1 mg/kg si amiodarone indisponible.
              </>,
              <>
                Lidocaïne supplémentaire : <strong>{formatMg(lidocaineRepeatLow)}</strong> -{" "}
                <strong>{formatMg(lidocaineRepeatHigh)}</strong> (dose cumulée max ~3 mg/kg).
              </>,
              "Magnésium pour torsades (voir plus bas).",
            ]}
          />
          <FlowBlock
            title="RCP et causes réversibles"
            items={[
              "RCP 100–120/min, profondeur ~1/3 AP, ratio 15:2 (sans abord) puis compressions continues + 10–12 V/min si intubé.",
              "Traiter les 4 H / 4 T : hypoxie, hypovolémie, hypo/hyperkaliémie, hypothermie ; tamponnade, pneumothorax sous tension, thrombose, toxiques.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="TV avec pouls"
            subtitle="Cardioversion si instabilité"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Instable"
            items={[
              "O₂, monitorage, IV/IO, préparation intubation si besoin.",
              <>
                Cardioversion synchronisée : 1 J/kg → <strong>{formatJ(shock1J)}</strong>, puis 2 J/kg →{" "}
                <strong>{formatJ(shock2J)}</strong>; possible d'augmenter jusqu'à 4 J/kg selon réponse.
              </>,
              <>
                Si TV persiste : répéter cardioversion + amiodarone 5 mg/kg en 20–60 min → <strong>{formatMg(amiodaroneMg)}</strong> (hors arrêt).
              </>,
              "Avis cardiologie/rythmologie pédiatrique urgent, corriger causes (hypoxie, hypovolémie, électrolytes, toxiques).",
            ]}
          />
          <FlowBlock
            title="Stable"
            items={[
              "O₂, monitorage, IV, ECG 12 dérivations, bilan ionique (K/Mg), fonction rénale.",
              <>
                Amiodarone IV 5 mg/kg sur 20–60 min → <strong>{formatMg(amiodaroneMg)}</strong> (répéter jusqu'à 15 mg/kg/j selon avis spécialisé). Alternatives selon cardio (procainamide, β-bloquants...).",
              </>,
              "Surveillance continue, TA invasive si possible, bilan étiologique complet.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Torsades de pointes (QT long)"
            subtitle="Magnésium + correction ionique"
            gradient="from-purple-500 via-fuchsia-500 to-rose-400"
          />
          <FlowBlock
            title="Magnésium"
            items={[
              <>
                Sulfate de Mg 25–50 mg/kg IV (max 2 g) → <strong>{formatMg(magnesiumLowCapped)}</strong> -{" "}
                <strong>{formatMg(magnesiumHighCapped)}</strong> (cap 2000 mg).
              </>,
              "Avec pouls : perf 15–20 min ; sans pouls : bolus IV/IO sur quelques minutes pendant la RCP.",
            ]}
          />
          <FlowBlock
            title="Corrections"
            items={[
              "Corriger K+ vers la normale (ex. cible 4–4,5 mmol/L selon protocole), Ca2+ si hypoCa.",
              "Arrêter médicaments allongeant le QT ; si récidive : pacing ou isoprénaline sous surveillance spécialisée.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Nouveau-né/prématuré, cardiopathies, intoxications"
            gradient="from-sky-500 via-blue-600 to-slate-700"
          />
          <FlowBlock
            title="Nouveau-né/prématuré"
            items={[
              "Environnement néonatal spécialisé (NLS) ; doses mg/kg similaires mais équipe réa néonatale requise.",
            ]}
          />
          <FlowBlock
            title="Canalopathies/cardiopathies"
            items={[
              "Avis cardio pédiatrique/rythmo, dépistage familial (mort subite du sujet jeune), bilan complet (ECG répétés, écho, génétique).",
            ]}
          />
          <FlowBlock
            title="Intoxications"
            items={[
              "Suspicions de toxiques (antiarythmiques, antidépresseurs, antihistaminiques...) → centre antipoison, antidotes spécifiques éventuels.",
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
            title="Hospitalisation spécialisée"
            items={[
              "Toute FV, TV sans pouls, TV soutenue, torsades : réanimation/USC/cardiologie pédiatrique.",
              "Monitorage continu (scope, ETCO₂ si intubé, TA invasive si possible), bilan étiologique complet.",
              "Plan secondaire : β-bloquants, DAI, imagerie, stratégie HAS mort subite sujet jeune.",
            ]}
          />
          <FlowBlock
            title="Traitements à éviter"
            items={[
              "Vasopressine en bolus routinier en arrêt pédiatrique.",
              "Défibrillation > 10 J/kg sauf protocole expert, antiarythmiques non validés sans avis spécialisé.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
