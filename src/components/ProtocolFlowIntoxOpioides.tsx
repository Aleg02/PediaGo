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

export default function ProtocolFlowIntoxOpioides() {
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

  const [effectiveNaloxone, setEffectiveNaloxone] = useState<number>(Math.min(weightKg * 0.02, 0.4));

  const naloxone01 = weightKg * 0.01;
  const naloxone02 = weightKg * 0.02;
  const naloxone1 = weightKg * 0.1;
  const naloxoneMax = 2;
  const infusionRate = Number(((effectiveNaloxone * 2) / 3).toFixed(2));
  const bolus10 = weightKg * 10;
  const midazolamLow = weightKg * 0.1;
  const midazolamHigh = weightKg * 0.2;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-rose-800 to-amber-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Toxicologie</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Intoxication aux opioïdes – enfant
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Identifier la dépression respiratoire, titrer la naloxone, surveiller les formes LP/tramadol et prévenir la re-sédation.
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
            subtitle="Triade opioïde : myosis serré + dépression respi + coma"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={["Vérifier perméabilité, risque inhalation (vomissements). GCS ≤ 8 → intubation."]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "FR selon âge (FR < 12/min = alerte), hypopnée/apnée, tirage.",
                "O₂ titré SpO₂ 94–98 % ; ventilation assistée si SpO₂ < 92 %, FR très basse ou apnées répétées.",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={["Bradycardie, hypotension possible dans les cas sévères. ECG si tramadol (QT long)."]}
            />
            <FlowBlock
              title="D - Disability"
              items={["Somnolence/coma, myosis typique ; convulsions possibles avec tramadol."]}
            />
            <FlowBlock
              title="E - Exposition"
              items={["Rechercher flacons, formes LP, timbres transdermiques ; signes de traumatisme secondaire."]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens complémentaires"
            subtitle="À réaliser si forme modérée/sévère"
            gradient="from-indigo-500 via-blue-500 to-cyan-500"
          />
          <FlowBlock
            title="Bilans"
            items={[
              "Glycémie, GDS (acidose d'hypoventilation), ionogramme, NFS, fonction rénale.",
              "ECG si tramadol/méthadone/co-ingestion.",
              "Non indispensables si intoxication mineure et enfant bien éveillé.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates"
            subtitle="Ventilation d'abord, naloxone ensuite"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Ventilation / O₂"
            items={[
              "O₂ titré 94–98 % ; ventilation BAVU si FR basse/hypoventilation/apnée.",
              "Préparer une intubation si GCS bas ou apnées répétées.",
            ]}
          />
          <FlowBlock
            title="Voie veineuse / perfusion"
            items={[
              "VVP/IO si dépression de conscience ou co-ingestion.",
              <>
                Hypotension (rare) : NaCl 0,9 % 10 mL/kg → <strong>{formatMl(bolus10)}</strong>.
              </>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Naloxone"
            subtitle="Antidote spécifique, titration prudente"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Indications"
            items={[
              "Dépression respiratoire, SpO₂ < 94 % malgré O₂, hypoventilation/apnée, coma opioïde suspecté.",
              "Intoxication accidentelle du jeune enfant.",
            ]}
          />
          <FlowBlock
            title="Titration IV"
            items={[
              <>
                Dose initiale : <strong>{formatMg(naloxone01)}</strong> (0,01 mg/kg).
              </>,
              <>
                Si réponse insuffisante après 2–3 min : <strong>{formatMg(naloxone02)}</strong> (0,02 mg/kg), puis{" "}
                <strong>{formatMg(naloxone1)}</strong> (0,1 mg/kg) si nécessaire.
              </>,
              <>Dose maximale cumulée : <strong>{formatMg(naloxoneMax)}</strong>.</>,
            ]}
          />
          <FlowBlock
            title="Perfusion continue (re-sédation)"
            items={[
              "Si re-piquage : perfusion = 2/3 de la dose efficace cumulée par heure.",
              <>
                Dose efficace utilisée :{" "}
                <input
                  type="number"
                  min={0}
                  max={2}
                  step="0.05"
                  value={effectiveNaloxone}
                  onChange={(e) => setEffectiveNaloxone(Math.min(Math.max(Number(e.target.value) || 0, 0), 2))}
                  className="ml-1 inline-block h-9 w-24 rounded-lg border border-amber-200 bg-amber-50 px-2 text-right text-sm font-semibold text-amber-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />{" "}
                mg → perfusion = <strong>{infusionRate} mg/h</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Voies IM / IN"
            items={[
              "0,1 mg/kg IM ou IN si IV impossible (surveillance longue : pic tardif, re-sédation).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Cas particuliers : tramadol"
            subtitle="Risque convulsif + QT long"
            gradient="from-purple-500 via-fuchsia-500 to-rose-400"
          />
          <FlowBlock
            title="Conduite"
            items={[
              "Naloxone si dépression respiratoire sévère.",
              <>
                Convulsions : midazolam 0,1–0,2 mg/kg → <strong>{formatMg(midazolamLow)}</strong> -{" "}
                <strong>{formatMg(midazolamHigh)}</strong>.
              </>,
              "ECG systématique (risque QT long).",
              "Surveillance prolongée (formes LP).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitements non indiqués"
            subtitle="Éviter les gestes inutiles"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <FlowBlock
            title="À ne pas faire"
            items={[
              "Pas de charbon activé sauf ingestion massive < 1 h.",
              "Pas de lavage gastrique, pas de sirop d'ipéca.",
              "Pas de β2-mimétique, pas d’AINS.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Surveillance"
            subtitle="Durée > durée d’action naloxone"
            gradient="from-indigo-500 via-purple-500 to-fuchsia-500"
          />
          <FlowBlock
            title="Paramètres"
            items={[
              "Surveillance minimale 6 h après la dernière dose de naloxone (≥ 12 h si formes LP).",
              "FR, SpO₂, effort ventilatoire, FC, TA, GCS, pupilles.",
              "ECG si tramadol/méthadone.",
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
            title="Nourrisson"
            items={[
              "Risque d’apnées ++, naloxone efficace mais re-sédation possible : surveillance prolongée.",
            ]}
          />
          <FlowBlock
            title="Timbres transdermiques"
            items={[
              "Enlever immédiatement (fentanyl, buprénorphine), nettoyer la peau, surveiller étroitement.",
            ]}
          />
          <FlowBlock
            title="Adolescent (geste suicidaire)"
            items={[
              "Évaluation psychiatrique systématique, bilan toxico élargi.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation ou réanimation"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Hospitalisation systématique si"
            items={[
              "Naloxone administrée, dépression respiratoire initiale, tramadol/méthadone/oxycodone ou opioïde LP.",
              "Coma, co-ingestion (BZD, ADT, alcool), environnement familial douteux, intoxication volontaire.",
            ]}
          />
          <FlowBlock
            title="Réanimation si"
            items={[
              "Intubation/ventilation, naloxone en perfusion continue, hypotension persistante, convulsions récurrentes.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Enfant réveillé, FR/SpO₂ normales sans O₂, pas de naloxone depuis ≥ 6 h, pas de re-sédation.",
              "Pas d’opioïde LP, famille fiable, prévention des accidents, suivi 24–48 h si besoin.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
