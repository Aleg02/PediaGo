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

export default function ProtocolFlowCoupDeChaleur() {
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

  const [hypovolemia, setHypovolemia] = useState<"moderee" | "severe">("moderee");

  const bolus10 = weightKg * 10;
  const bolus20 = weightKg * 20;
  const midazolamLow = weightKg * 0.1;
  const midazolamHigh = weightKg * 0.2;
  const clonazepam = weightKg * 0.05;
  const glucoseBolus = weightKg * 2; // mL of G10%
  const selectedBolus = hypovolemia === "severe" ? bolus20 : bolus10;
  const selectedLabel = hypovolemia === "severe" ? "Hypovolémie sévère" : "Hypovolémie modérée";

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-orange-600 via-red-600 to-amber-600 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Hyperthermie majeure</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Coup de chaleur – enfant
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Identifier rapidement l'hyperthermie ≥ 40 °C avec atteinte neurologique, déclencher un refroidissement
          immédiat et prévenir les défaillances multiviscérales.
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
            subtitle="Confirmer hyperthermie ≥ 40 °C et rechercher signes neurologiques"
            gradient="from-orange-500 via-red-500 to-amber-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={[
                "Vérifier la perméabilité ; intubation si GCS ≤ 8 ou convulsions réfractaires.",
              ]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "SpO₂, polypnée possible (acidose).",
                "O₂ titré pour SpO₂ 94–98 %. ",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={[
                "Tachycardie fréquente ; TRC > 3 s = gravité ; déshydratation fréquente.",
                "Prendre TA régulièrement, rechercher marbrures/hypotension.",
              ]}
            />
            <FlowBlock
              title="D - Disability"
              items={[
                "Confusion, irritabilité, convulsions ; coma = signe majeur de coup de chaleur.",
              ]}
            />
            <FlowBlock
              title="E - Exposition"
              items={[
                "Température centrale rectale (pas tympanique).",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes de gravité"
            subtitle="Nécessitent refroidissement immédiat (< 30 min)"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <FlowBlock
            title="Critères"
            items={[
              "Température centrale ≥ 40 °C.",
              "Atteinte neurologique : convulsions, confusion, coma.",
              "TRC > 3 s / marbrures, polypnée ou détresse respiratoire.",
              "Vomissements répétés, rhabdomyolyse (douleurs, CPK ↑), oligurie/anurie, hypotension/collapsus.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Refroidissement immédiat"
            subtitle="Objectif < 39 °C en < 30 minutes"
            gradient="from-cyan-500 via-blue-500 to-indigo-500"
          />
          <FlowBlock
            title="Méthode 1 (référence CDC/AAP/SFMT) : immersion eau froide"
            items={[
              "Immersion eau glacée 1–15 °C pendant 10–20 min sous surveillance.",
              "Arrêter à 39 °C.",
            ]}
          />
          <FlowBlock
            title="Méthode 2 : évaporative + ventilation"
            items={[
              "Vaporiser eau tiède/fraîche + ventilation forcée.",
              "Retirer vêtements, placer en environnement frais.",
            ]}
          />
          <FlowBlock
            title="Méthode 3 : poches de glace"
            items={[
              "Aisselles, aine, cou, flancs.",
            ]}
          />
          <FlowBlock
            title="Méthode 4 : linges humides froids"
            items={[
              "Possible si les autres méthodes indisponibles.",
            ]}
          />
          <FlowBlock
            title="Méthodes non recommandées"
            items={[
              "Pas d’alcool sur la peau (toxique).",
              "Pas d’immersion trop froide chez le nourrisson < 1 an sans surveillance de réanimation.",
              "Pas d’antipyrétiques (inefficaces), pas d’AINS, pas de dantrolène hors hyperthermie maligne anesthésique.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitements associés"
            subtitle="Hydratation, convulsions, glycémie, électrolytes"
            gradient="from-emerald-500 via-teal-500 to-cyan-400"
          />
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-3 py-3 text-sm text-emerald-900">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Hypovolémie estimée</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { key: "moderee", label: "Modérée (10 mL/kg)", value: "moderee" },
                { key: "severe", label: "Sévère (20 mL/kg)", value: "severe" },
              ].map((opt) => {
                const active = hypovolemia === opt.value;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setHypovolemia(opt.value as "moderee" | "severe")}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-emerald-700 bg-emerald-800 text-white shadow"
                        : "border-emerald-200 bg-white text-emerald-800 hover:border-emerald-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-emerald-800">
              Bolus recommandé ({selectedLabel}) : <strong>{formatMl(selectedBolus)}</strong>
            </p>
          </div>
          <FlowBlock
            title="Hydratation si hypovolémie"
            items={[
              <>
                Bolus NaCl 0,9 % 10 mL/kg en 10–15 min → <strong>{formatMl(bolus10)}</strong>, réévaluer.
              </>,
              <>
                Si hypovolémie sévère : 20 mL/kg → <strong>{formatMl(bolus20)}</strong> (répéter selon réponse).
              </>,
              "Solutés : Ringer Lactate ou NaCl 0,9 % ; éviter G5 % en première intention.",
            ]}
          />
          <FlowBlock
            title="Convulsions"
            items={[
              <>
                Midazolam IV/IN 0,1–0,2 mg/kg → <strong>{formatMg(midazolamLow)}</strong> -{" "}
                <strong>{formatMg(midazolamHigh)}</strong>.
              </>,
              <>
                Ou clonazépam IV 0,05 mg/kg → <strong>{formatMg(clonazepam)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Hypoglycémie"
            items={[
              <>
                Glycémie &lt; 3 mmol/L : G10 % bolus 2 mL/kg → <strong>{formatMl(glucoseBolus)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Électrolytes / rhabdomyolyse"
            items={[
              "Surveiller Na+, K+, Cl−, fonction rénale/hépatique, CPK, lactates.",
              "Risque d’hyperkaliémie en cas de rhabdomyolyse.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens complémentaires"
            subtitle="À réaliser en parallèle du refroidissement"
            gradient="from-indigo-500 via-purple-500 to-fuchsia-500"
          />
          <FlowBlock
            title="Biologie / imagerie"
            items={[
              "NFS, CRP, ionogrammes sanguins, fonction rénale (urée, créatinine), bilan hépatique.",
              "CPK (rhabdomyolyse), gaz du sang + lactates, ECG, BU (myoglobinurie).",
              "Coma persistant : scanner cérébral + EEG.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter le refroidissement"
            gradient="from-sky-500 via-blue-600 to-slate-700"
          />
          <FlowBlock
            title="Nourrisson < 1 an"
            items={[
              "Refroidissement progressif (ventilation + brumisation), immersion froide à adapter sous surveillance de réanimation.",
              "Risque convulsif accru.",
            ]}
          />
          <FlowBlock
            title="Enfant sportif (coup de chaleur d’effort)"
            items={[
              "Rhabdomyolyse plus fréquente → CPK obligatoires, surveillance cardiaque accrue.",
            ]}
          />
          <FlowBlock
            title="Comorbidités"
            items={[
              "Drépanocytose, obésité, traitements anticholinergiques : risque aggravé, refroidissement et monitorage renforcés.",
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
            title="Hospitalisation systématique si"
            items={[
              "Température centrale ≥ 40 °C, trouble neurologique, déshydratation sévère, troubles ioniques.",
              "Rhabdomyolyse (CPK > 1000), hypotension/perfusion altérée, nourrisson < 1 an, suspicion coup de chaleur d’effort.",
            ]}
          />
          <FlowBlock
            title="Réanimation si"
            items={[
              "Coma/convulsions, échec du refroidissement, acidose sévère, insuffisance rénale aiguë, instabilité hémodynamique.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie (rare, forme mineure)"
            items={[
              "Température < 38 °C stabilisée depuis 6–8 h, état neurologique strictement normal.",
              "Hydratation correcte, ionogramme normal, CPK < 500, aucune défaillance d’organe.",
              "Environnement familial fiable, consignes écrites + surveillance à 24 h.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
