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

const formatMl = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return "-";
  const v = value as number;
  if (v < 1) return `${Number(v.toFixed(2))} mL`;
  if (v < 10) return `${Number(v.toFixed(1))} mL`;
  return `${Math.round(v)} mL`;
};

export default function ProtocolFlowTamponnadePericardique() {
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
  const adrenalineLow = Math.min(weightKg * 0.03, 10); // mL/h si seringue 0,1 mg/mL pour 0,05 µg/kg/min
  const adrenalineHigh = Math.min(weightKg * 0.06, 12); // mL/h pour 0,1 µg/kg/min
  const ketamine = Math.min(weightKg * 1, 50);
  const atropine = Math.min(weightKg * 0.02, 0.6);

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-cyan-900 to-blue-900 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Cardiologie · Urgence</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Tamponnade péricardique aiguë – enfant
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Reconnaître le choc obstructif, stabiliser avec remplissage/amine, préparer la péricardiocentèse urgente et
          sécuriser le transfert.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
        <p className="mt-3 text-[13px] text-white/80">Sources : PALS/ADA 2020, ERC 2021, SRLF/SFMU choc obstructif.</p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Reconnaissance clinique"
            subtitle="Choc obstructif = urgence absolue"
            gradient="from-cyan-500 via-sky-500 to-blue-500"
          />
          <FlowBlock
            title="Signes évocateurs"
            items={[
              "Hypotension, tachycardie, marbrures, TRC > 3 s, oligurie.",
              "Pouls paradoxal, jugulaires turgescentes, bruits du cœur assourdis (triade de Beck).",
              "ECG : microvoltage, alternance électrique. Écho : épanchement compressif, collapsus VD/OD.",
            ]}
          />
          <FlowBlock
            title="Red flags"
            items={[
              "Choc réfractaire, PEA imminente, polypnée/SpO₂ < 94 % malgré O₂.",
              "Incapacité à ventiler (masque/IPP) : risque arrêt circulatoire par perte du retour veineux.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Stabilisation immédiate"
            subtitle="Avant ponction péricardique"
            gradient="from-amber-500 via-orange-500 to-red-500"
          />
          <FlowBlock
            title="Airway / Breathing"
            items={[
              "O₂ haut débit (masque 10-15 L/min). Éviter PEEP/ventilation invasive si possible.",
              "Si intubation indispensable : séquence rapide par opérateur expert, volumes courants bas, PEEP minimale.",
            ]}
          />
          <FlowBlock
            title="Circulation"
            items={[
              <>Remplissage prudent : NaCl 0,9 % 10 mL/kg à 20 mL/kg  → <strong>{formatMl(bolus10)}</strong> à{" "} <strong>{formatMl(bolus20)}</strong>, réevaluation.</>,
              <>Adrénaline seringue 0,1 mg/mL : 0,05–0,1 µg/kg/min → <strong>{formatMl(adrenalineLow)}</strong> à{" "} <strong>{formatMl(adrenalineHigh)}</strong> mL/h.</>,
              "Si arrêt/PEA : RCP + adrénaline IV 10 µg/kg toutes 3-5 min, préparer ponction.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Péricardiocentèse urgente"
            subtitle="Voie sous-xiphoïdienne ou parasternal gauche (échoguidé si possible)"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Préparation"
            items={[
              <>Monitoring complet, voie veineuse + matériel d'intubation prêt. Atropine 0,02 mg/kg (max 0,6 mg) → <strong>{formatMg(atropine)}</strong>.</>,
              <>Antalgie/sédation courte si enfant stable : Kétamine 1 mg/kg IV (max 50 mg) → <strong>{formatMg(ketamine)}</strong>.</>,
              "Guidage écho si disponible ; aspiration douce en seringue 10-20 mL, analyse du liquide.",
            ]}
          />
          <FlowBlock
            title="Après évacuation"
            items={[
              "Amélioration hémodynamique immédiate attendue ; surveiller récidive.",
              "Drainage chirurgical si suspicion plaie/étiologie traumatique ou purulente.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Bloc / rythmologie / réanimation pédiatrique"
            gradient="from-slate-500 via-slate-600 to-slate-700"
          />
          <FlowBlock
            title="Critères"
            items={[
              "Toute tamponnade confirmée → réanimation immédiate, transfert médicalisé.",
              "Traumatique ou récidivante → chirurgie cardiaque.",
              "Surveillance continue ECG/PA, contrôles échographiques répétés.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}

