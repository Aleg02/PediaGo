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

const formatMl = (value: number, digits = 1) => `${value.toFixed(digits)} mL`;

export default function ProtocolFlowIntoxBZD() {
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

  const [flumazEligible, setFlumazEligible] = useState<"oui" | "non" | "doute">("doute");

  const bolus10 = weightKg * 10;
  const flumazTest = Math.min(weightKg * 0.01, 0.2);
  const flumazTestMl = Math.min(weightKg * 0.01 * 1, 0.2); // solution 0,1 mg/mL → 0,01 mg/kg = 0,1 mL/kg
  const flumazMax = Math.min(weightKg * 0.05, 1);
  const glucoseBolus = weightKg * 2; // mL of G10%

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-800 to-blue-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Toxicologie</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Intoxication aux benzodiazépines – enfant
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Identifier les signes de gravité, traiter symptomatiquement, décider du flumazénil (indications strictes) et orienter.
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
            subtitle="Surveiller dépression respiratoire et conscience"
            gradient="from-blue-500 via-indigo-500 to-slate-700"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={[
                "Vérifier GCS, risque d'obstruction si coma.",
                "GCS ≤ 8 : intubation trachéale.",
              ]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "FR, tirage, hypoventilation ; SpO₂ 94–98 % sous O₂ titré.",
                "Ventilation assistée si FR très basse, SpO₂ < 94 % malgré O₂, signe d'épuisement ou acidose respiratoire.",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={["TA, FC : hypotension rare, souvent liée à co-ingestion."]}
            />
            <FlowBlock
              title="D - Disability"
              items={["Somnolence, hypotonie, coma possible ; mydriase ou pupilles normales."]}
            />
            <FlowBlock
              title="E - Exposition"
              items={[
                "Rechercher flacons/comprimés, signes de chute/trauma secondaires.",
                "Glycémie capillaire systématique (différentiel coma).",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes de gravité"
            subtitle="Indiquent hospitalisation/réanimation"
            gradient="from-rose-500 via-red-500 to-orange-500"
          />
          <FlowBlock
            title="Critères"
            items={[
              "Dépression respiratoire : FR < 10/min, SpO₂ < 92 % malgré O₂.",
              "GCS < 12, hypotension persistante.",
              "Suspicion co-ingestion dangereuse (tricycliques, opioïdes, alcool, anticonvulsivants).",
              "Convulsions, âge < 2 ans symptomatique, BZD LP, tentative de suicide.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens complémentaires (si non trivial)"
            subtitle="Adapter selon co-ingestions"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Bilans"
            items={[
              "Glycémie capillaire, GDS, ionogramme.",
              "ECG si co-ingestion tricycliques (QRS élargi), prélèvements toxico si besoin médico-légal.",
              "Non indispensable si intoxication mineure isolée.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitement symptomatique"
            subtitle="Base de la prise en charge"
            gradient="from-indigo-500 via-blue-500 to-cyan-400"
          />
          <FlowBlock
            title="Oxygénothérapie / ventilation"
            items={[
              "SpO₂ cible 94–98 % (lunettes 1–4 L/min ou masque).",
              "Ventilation assistée si SpO₂ < 90 %, FR très basse, épuisement ou acidose.",
            ]}
          />
          <FlowBlock
            title="Voie veineuse / perfusion"
            items={[
              "VVP/IO si conscience altérée ou co-ingestion.",
              <>
                NaCl 0,9 % 10 mL/kg si hypotension (rare) → <strong>{formatMl(bolus10)}</strong>.
              </>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Flumazénil"
            subtitle="Indications strictes et contre-indications"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">Éligibilité</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { key: "oui", label: "Indiqué (ingestion isolée accidentelle, pas d'épilepsie/co-ingestion)" },
                { key: "doute", label: "Doute (co-ingestion ? LP ?)" },
                { key: "non", label: "Contre-indiqué (épilepsie, TCA, sevrage BZD, suicide)" },
              ].map((opt) => {
                const active = flumazEligible === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFlumazEligible(opt.key as "oui" | "non" | "doute")}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-amber-700 bg-amber-800 text-white shadow"
                        : "border-amber-200 bg-white text-amber-800 hover:border-amber-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs">
              {flumazEligible === "oui"
                ? "Indication retenue : ingestion accidentelle isolée sans facteur pro-convulsivant."
                : flumazEligible === "non"
                ? "Contre-indiqué : risque convulsions (épilepsie, tricycliques, sevrage) ou geste suicidaire."
                : "Doute : avis CAPTV/TOXBASE recommandé, privilégier surveillance et support ventilatoire."}
            </p>
          </div>
          <FlowBlock
            title="Posologie flumazénil (IV)"
            items={[
              <>
                Enfant &lt; 5 ans : 0,01 mg/kg (max 0,2 mg) en 15–30 s → <strong>{formatMg(flumazTest)}</strong> (≈{" "}
                <strong>{formatMl(flumazTestMl)}</strong> si ampoule 0,1 mg/mL).
              </>,
              "Si réponse insuffisante : 0,01 mg/kg toutes les 1 min ; dose max 0,05 mg/kg ou 1 mg total.",
              "Enfant ≥ 5 ans : 0,1 mg IV, répéter 0,1 mg/min jusqu'à réveil, max 1 mg.",
              "Durée d’action courte : risque re-sédation → surveillance ≥ 2 h après réveil.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitements non recommandés"
            subtitle="Éviter les gestes inutiles"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <FlowBlock
            title="À ne pas faire"
            items={[
              "Pas de charbon activé en routine (sauf < 1 h ingestion massive).",
              "Pas de lavage gastrique (risque inhalation).",
              "Pas de sirop d’ipéca.",
              "Pas de flumazénil si co-ingestion douteuse ou risque convulsif.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Surveillance"
            subtitle="Risque de récidive si BZD LP ou flumazénil"
            gradient="from-indigo-500 via-purple-500 to-fuchsia-500"
          />
          <FlowBlock
            title="Paramètres"
            items={[
              "Durée 6–12 h (≥ 12 h si BZD LP ou flumazénil).",
              "FR, SpO₂, FC, TA, état neuro ; ECG si co-ingestion.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter la surveillance"
            gradient="from-sky-500 via-blue-600 to-slate-700"
          />
          <FlowBlock
            title="Nourrisson < 2 ans"
            items={[
              "Surveillance prolongée (risque apnées).",
              "Flumazénil possible si ingestion isolée accidentelle (sans co-ingestion).",
            ]}
          />
          <FlowBlock
            title="Adolescent (geste suicidaire)"
            items={[
              "Évaluation psychiatrique obligatoire, bilan toxico élargi.",
            ]}
          />
          <FlowBlock
            title="BZD LP"
            items={[
              "Surveillance prolongée ≥ 12 h (risque re-sédation).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation ou réanimation selon gravité"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Hospitalisation systématique si"
            items={[
              "Dépression respiratoire, âge < 2 ans symptomatique, co-ingestion suspectée.",
              "BZD LP, flumazénil administré, coma, tentative de suicide, surveillance familiale incertaine.",
            ]}
          />
          <FlowBlock
            title="Réanimation si"
            items={[
              "Intubation/ventilation, hypoventilation sévère, acidose respiratoire, instabilité hémodynamique.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Enfant réveillé, FR/FC/SpO₂ normales, tolérance alimentaire.",
              "Pas de BZD LP, flumazénil non utilisé ou surveillance 2–3 h post-éveil.",
              "Famille fiable, prévention des accidents, consultation pédiatrique/psy programmée si besoin.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
