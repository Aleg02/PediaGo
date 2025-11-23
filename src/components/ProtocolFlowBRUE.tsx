"use client";

import { useEffect, useState } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 2;
const MAX_W = 20;
const DEFAULT_W = 5;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

export default function ProtocolFlowBRUE() {
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

  const [risk, setRisk] = useState<"faible" | "haut">("faible");

  const g10Bolus = weightKg * 2; // mL
  const paracetamol = weightKg * 15;
  const midazolamLow = weightKg * 0.1;
  const midazolamHigh = weightKg * 0.2;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-indigo-900 via-sky-800 to-emerald-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Nourrisson &lt; 1 an</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Malaise grave / BRUE (ALTE)
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Identifier un BRUE faible risque vs ALTE haut risque, sécuriser ABCDE, éliminer diagnostics graves et décider hospitalisation.
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
            subtitle="Évènement résolu ? Sinon = urgence vitale"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={[
                "VAS libres ? tirage/stridor/encombrement, suspicion inhalation CE.",
              ]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "FR et régularité, apnées ? O₂ titré SpO₂ 94–98 %.",
                "Ventilation assistée si bradypnée/apnée prolongée.",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={[
                "FC (tachycardie réactionnelle fréquente), recoloration, TA si possible.",
                "Déshydratation (vomissements/alimentation difficile).",
              ]}
            />
            <FlowBlock
              title="D - Disability"
              items={[
                "GCS pédiatrique, hypotonie persistante = critère ALTE grave.",
                <>
                  Glycémie immédiate ; si &lt; 3 mmol/L → G10 % 2 mL/kg → <strong>{g10Bolus.toFixed(1)} mL</strong>.
                </>,
              ]}
            />
            <FlowBlock
              title="E - Exposure"
              items={[
                "Peau : pétéchies (infection), ecchymoses (maltraitance), T°, signes traumatiques.",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Stratifier le risque"
            subtitle="BRUE faible vs ALTE haut risque"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <div className="rounded-3xl border border-black/10 bg-white/90 p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "faible", label: "BRUE faible risque (AAP 2016)" },
                { key: "haut", label: "ALTE / haut risque" },
              ].map((opt) => {
                const active = risk === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setRisk(opt.key as "faible" | "haut")}
                    className={`flex-1 min-w-[140px] rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white shadow"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
              {risk === "faible" ? (
                <>
                  <li>Évènement résolu unique, aucun critère haut risque.</li>
                  <li>Observation 1–2 h, monitorage SpO₂/FR, pas d’examens systématiques.</li>
                  <li>Pas d’imagerie ni prescriptions ; sortie avec éducation parentale si asymptomatique.</li>
                </>
              ) : (
                <>
                  <li>Un seul critère haut risque (âge &lt; 60 j, prématurité &lt; 32 SA ou AC &lt; 45 SA, durée &gt; 1 min, récidive, ventilation nécessaire, hypotonie persistante, suspicion maltraitance, signes vitaux anormaux, fièvre/vomissements bilieux, terrain à risque) = hospitalisation.</li>
                  <li>Monitorage cardiorespiratoire, bilans ciblés, avis spécialisé (neuro, infectieux, social).</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Conduite selon contexte"
            subtitle="Évènement résolu vs détresse vitale"
            gradient="from-indigo-500 via-blue-500 to-cyan-500"
          />
          <FlowBlock
            title="Détresse vitale (épisode non résolu)"
            items={[
              "O₂ titré 94–98 %, ventilation BAVU si apnée/bradypnée ; intubation si épisodes répétés ou instabilité.",
              <>
                Hypoglycémie : G10 % 2 mL/kg → <strong>{g10Bolus.toFixed(1)} mL</strong>.
              </>,
              "Accès IV/IO, NaCl 0,9 % 10 mL/kg si besoin ; ECG si brady/troubles rythme.",
            ]}
          />
          <FlowBlock
            title="BRUE faible risque"
            items={[
              "Observation 1–2 h, monitorage SpO₂/FR.",
              "Pas d’examens systématiques ni imagerie ; pas de traitements respiratoires (pas de β2, cortico).",
              "Sortie avec consignes écrites et éducation si tout reste normal.",
            ]}
          />
          <FlowBlock
            title="ALTE / haut risque"
            items={[
              "Hospitalisation systématique.",
              "Bilans selon clinique : glycémie, iono, gaz si malaise important, ECG 12 dérivations, monitorage 24 h.",
              "Infectieux selon contexte : NFS/CRP/PCT, ECBU, PCR virales (VRS, coqueluche PCR si toux/cyanose), Rx thorax si signes respi.",
              "Avis neuro si récidive/hypotonie persistante, avis social si maltraitance suspectée.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Diagnostics différentiels"
            subtitle="Toujours éliminer"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Causes graves"
            items={[
              "Infection sévère : sepsis, méningite, coqueluche.",
              "Traumatismes / maltraitance.",
              "Apnée obstructive, inhalation de corps étranger.",
              "Troubles du rythme (QT long), crise épileptique.",
              "Métaboliques : hypoglycémie, hypocalcémie ; intoxication (opiacés via lait maternel...).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitements"
            subtitle="Ciblés selon besoin"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Oxygène"
            items={["SpO₂ cible 94–98 %."]}
          />
          <FlowBlock
            title="Glucose IV"
            items={[
              <>
                Si &lt; 3 mmol/L : G10 % 2 mL/kg → <strong>{g10Bolus.toFixed(1)} mL</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Convulsions"
            items={[
              <>
                Midazolam 0,1–0,2 mg/kg IV/IN → <strong>{formatMg(midazolamLow)}</strong> - <strong>{formatMg(midazolamHigh)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Fièvre / douleur"
            items={[
              <>
                Paracétamol 15 mg/kg → <strong>{formatMg(paracetamol)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Vomissements"
            items={[
              "Aucun antiémétique systématique < 6 mois (ondansétron non recommandé).",
            ]}
          />
          <FlowBlock
            title="Apnées fréquentes / bradycardies"
            items={[
              "Hospitalisation, monitorage ; caféine seulement en service spécialisé (prématurés).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Prématurés, maltraitance, coqueluche"
            gradient="from-sky-500 via-blue-600 to-slate-700"
          />
          <FlowBlock
            title="Prématurés (&lt; 32 SA ou AC &lt; 45 SA)"
            items={[
              "Risque majeur d’apnées : hospitalisation systématique, surveillance cardiorespiratoire prolongée.",
            ]}
          />
          <FlowBlock
            title="Maltraitance suspectée"
            items={[
              "Ecchymoses, récit incohérent, signes traumatiques → avis social/médico-judiciaire, hospitalisation.",
            ]}
          />
          <FlowBlock
            title="Coqueluche"
            items={[
              "Toux quintes, vomissements post-tussifs, apnées ; PCR coqueluche + hospitalisation.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation vs sortie"
            gradient="from-slate-700 via-slate-800 to-black"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Un seul critère haut risque, anomalies cliniques, comorbidités, âge &lt; 60 j, hypotonie persistante, suspicion coqueluche/intoxication, épisode réanimé ou violent, contexte social douteux.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie (BRUE faible risque)"
            items={[
              "Évènement unique, aucun critère haut risque, asymptomatique ≥ 1–2 h, examen normal.",
              "Pas d’examens complémentaires nécessaires, parents rassurés et formés, accès aux urgences facile.",
              "Document explicatif + signes d’alerte : cyanose, apnées, vomissements bilieux, somnolence anormale, retour immédiat si survenue.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
