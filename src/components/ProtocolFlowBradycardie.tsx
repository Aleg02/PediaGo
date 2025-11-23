"use client";

import { useEffect } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 2;
const MAX_W = 80;
const DEFAULT_W = 10;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const formatMl = (value: number, digits = 1) => `${value.toFixed(digits)} mL`;

export default function ProtocolFlowBradycardie() {
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

  const adrenalineMg = weightKg * 0.01;
  const adrenalineMl = weightKg * 0.1; // 0,1 mg/mL
  const atropineCalc = weightKg * 0.02;
  const atropineDose = Math.max(0.1, Math.min(atropineCalc, 0.5));
  const bolus10 = weightKg * 10;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-800 to-emerald-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Rythme lent</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Bradycardie extrême avec signes de choc
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Ventiler/oxygéner d’abord, RCP + adrénaline si FC &lt; 60/min et perfusion altérée, atropine ciblée et pacing si réfractaire.
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
            subtitle="Bradycardie + perfusion altérée = risque arrêt"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={["Libérer VAS, canule si besoin, sécurité de scène + appel aide (réa/SAMU)."]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "O₂ haut débit (MHC/BAVU) pour SpO₂ 94–98 %. Ventilation assistée si insuffisance respiratoire.",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={[
                "Monitorage ECG, SpO₂, TA. Pouls central ≤ 10 s. Hypotension, marbrures, TRC > 3 s, extrémités froides, altération conscience = choc.",
              ]}
            />
            <FlowBlock
              title="D - Disability"
              items={["AVPU/GCS, convulsions, glycémie capillaire."]}
            />
            <FlowBlock
              title="E - Exposition"
              items={[
                "Température (hypothermie), bilan biologique urgent (iono, gaz, lactate, fonction rénale), ECG 12 dérivations.",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes de gravité"
            subtitle="FC &lt; 60/min (ou &lt; 5e centile) + choc malgré O₂/ventilation"
            gradient="from-indigo-500 via-blue-500 to-cyan-500"
          />
          <FlowBlock
            title="Critères"
            items={[
              "FC très basse persistante après ventilation optimale.",
              "Hypotension (TA &lt; 5e centile), altération conscience/convulsions.",
              "TRC prolongé, marbrures, extrémités froides, oligurie.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates"
            subtitle="Ventilation, causes réversibles, préparation RCP"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Ventilation / O₂"
            items={[
              "O₂ haut débit, ventilation assistée si besoin ; corriger hypoxie, hypothermie, hypovolémie, acidose, troubles ioniques (4 H / 4 T).",
            ]}
          />
          <FlowBlock
            title="Accès / monitorage"
            items={[
              "IV/IO, monitor ECG, sat, TA, bilan biologique urgent.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitement actif si FC persistante &lt; 60/min + choc"
            subtitle="RCP + adrénaline, puis atropine/pacing si réfractaire"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="RCP"
            items={[
              "Si FC &lt; 60/min + signes de choc malgré ventilation → débuter compressions thoraciques + ventilation.",
            ]}
          />
          <FlowBlock
            title="Adrénaline"
            items={[
              <>
                0,01 mg/kg IV/IO (0,1 mL/kg de sol. 0,1 mg/mL) → <strong>{formatMg(adrenalineMg)}</strong> (~{" "}
                <strong>{formatMl(adrenalineMl)}</strong>).
              </>,
              "Répéter toutes les 3–5 min tant que bradycardie choquante.",
            ]}
          />
          <FlowBlock
            title="Atropine (indications ciblées)"
            items={[
              "Bradycardie vagale, bloc AV haut grade, intoxication cholinergique.",
              <>
                0,02 mg/kg IV/IO (min 0,1 mg, max 0,5 mg par bolus) → calcul :{" "}
                <strong>{formatMg(atropineDose)}</strong>.
              </>,
              "Peut répéter une fois si nécessaire.",
            ]}
          />
          <FlowBlock
            title="Pacing"
            items={[
              "Pacing externe/transveineux à envisager rapidement si réfractaire (avis cardio).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Bradycardie avec pouls + choc modéré"
            subtitle="Stabilisation sans arrêt"
            gradient="from-sky-500 via-blue-600 to-slate-700"
          />
          <FlowBlock
            title="Conduite"
            items={[
              "O₂, ventilation si besoin, IV/IO, monitorage, ECG, correction rapide des causes (hypoxie, hypo/ hyperkaliémie, hypovolémie, hypothermie).",
              "Atropine si cause vagale/bloc AV, préparer pacing en cas de détérioration.",
              "Avis cardiologie et transfert en unité spécialisée.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="À éviter"
            subtitle="Retards ou traitements non ciblés"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <FlowBlock
            title="Ne pas faire"
            items={[
              "Retarder compressions/adrénaline si FC &lt; 60/min + perfusion altérée.",
              "Atropine systématique sans corriger causes réversibles.",
              "Attendre trop longtemps avant d’envisager un pacing en cas de réfractarité.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Nouveau-né, cardiopathies, intoxications"
            gradient="from-indigo-500 via-purple-500 to-fuchsia-500"
          />
          <FlowBlock
            title="Nouveau-né/prématuré"
            items={[
              "Appliquer les recommandations de réanimation néonatale (NLS) ; seuils de FC plus élevés, environnement néonatal spécialisé.",
            ]}
          />
          <FlowBlock
            title="Cardiopathie / trouble conduction"
            items={[
              "Bradycardie parfois primaire (pacemaker défaillant, bloc AV) → avis cardio, pacing précoce possible.",
            ]}
          />
          <FlowBlock
            title="Intoxication / métabolique"
            items={[
              "β-bloquants, antiarythmiques, digitales, hypothermie sévère, hyperkaliémie : prise en charge toxicologique/spécialisée en parallèle.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Toujours soins intensifs / réanimation"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "USC/réanimation pédiatrique obligatoire après bradycardie avec choc.",
              "Monitorage continu, bilan étiologique (ECG, écho, iono, bilan métabolique), avis cardio.",
              "Transfert si besoin de pacing ou instabilité persistante.",
            ]}
          />
          <FlowBlock
            title="Critères de stabilisation (fin de phase aiguë)"
            items={[
              "FC adaptée à l’âge sans signes de choc, pas de bradycardie récidivante.",
              "Causes réversibles corrigées ou planifiées (ex : pacemaker, intoxication traitée).",
              "Plan de suivi cardiologique pédiatrique en place.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
