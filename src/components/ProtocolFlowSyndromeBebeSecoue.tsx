"use client";

import { useEffect } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 2;
const MAX_W = 30;
const DEFAULT_W = 8;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const formatMl = (value: number) => {
  if (value < 1) return `${Number(value.toFixed(2))} mL`;
  if (value < 10) return `${Number(value.toFixed(1))} mL`;
  return `${Math.round(value)} mL`;
};

const formatMlPerHour = (value: number | null) => {
  if (!Number.isFinite(value ?? NaN)) return "-";
  return `${formatMl(value as number)}/h`;
};

const formatG = (value: number) => `${Number(value.toFixed(value >= 10 ? 0 : 1))} g`;

const calcMaintenance = (kg: number | null) => {
  if (!Number.isFinite(kg ?? NaN)) return null;
  const w = kg as number;
  if (w <= 0) return null;
  let rate = 0;
  if (w > 20) rate += (w - 20) * 1;
  if (w > 10) rate += (Math.min(w, 20) - 10) * 2;
  rate += Math.min(w, 10) * 4;
  return rate;
};

export default function ProtocolFlowSyndromeBebeSecoue() {
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

  const naClBolus = weightKg * 10; // mL/kg
  const glucoseBolus = weightKg * 2; // mL G10%

  const paracetamol = weightKg * 15;
  const midazolam = weightKg * 0.1;
  const levetiracetamLow = weightKg * 20;
  const levetiracetamHigh = weightKg * 40;

  const mannitolLowG = weightKg * 0.5;
  const mannitolHighG = weightKg * 1;
  const nacl3Low = weightKg * 2; // mL
  const nacl3High = weightKg * 5; // mL

  const maintenance = calcMaintenance(weightKg);
  const maintenance125 = maintenance ? maintenance * 1.25 : null;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-purple-900 to-rose-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Neuro · Maltraitance</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">Syndrome du bébé secoué (AHT/TCNA)</h1>
        <p className="text-sm text-white/85 mt-1">
          Urgence vitale et médico-légale : stabiliser, imagerie immédiate, protéger l’enfant, activer neurochirurgie/réanimation.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
        <p className="mt-3 text-[13px] text-white/80">Version 2025 – HAS, SFP, SFNR, AAP, NICE.</p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale (ABCDE)"
            subtitle="Priorité : survie neurologique"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="A / B"
            items={[
              "VAS libres ? aspiration douce si vomissements ; préparer intubation si GCS < 9, détresse, convulsions.",
              "O₂ SpO₂ 94–98 % : lunettes 1–2 L/min ; masque 10–15 L/min si détresse.",
            ]}
          />
          <FlowBlock
            title="C"
            items={[
              "FC, TRC, PA ; VVP adaptée.",
              <>Choc : NaCl 0,9 % 10 mL/kg en 10–20 min → <strong>{formatMl(naClBolus)}</strong>, répéter 1 fois si besoin.</>,
            ]}
          />
          <FlowBlock
            title="D"
            items={[
              "GCS nourrisson, pupilles, convulsions, glycémie capillaire (objectif 0,7–1,4 g/L).",
              <>Hypoglycémie : bolus G10 % 2 mL/kg → <strong>{formatMl(glucoseBolus)}</strong>.</>,
            ]}
          />
          <FlowBlock title="E" items={["Rechercher lésions cutanées suspectes, prévenir hypothermie (salle > 23 °C, couverture)."]} />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes de gravité immédiate"
            subtitle="Urgence vitale"
            gradient="from-red-600 via-rose-600 to-orange-600"
          />
          <FlowBlock
            title="Critères"
            items={[
              "Coma/GCS < 9, convulsions, anomalies pupillaires, irritabilité majeure/léthargie, bradycardie/apnées, fontanelle bombée, hypotension.",
              "Ecchymoses multiples, fractures suspectes.",
              "→ Appel immédiat neurochirurgie + réanimation pédiatrique.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Imagerie"
            subtitle="Indispensable et urgente"
            gradient="from-sky-500 via-cyan-500 to-blue-600"
          />
          <FlowBlock
            title="Scanner cérébral sans injection"
            items={[
              "À réaliser sans délai pour toute suspicion AHT.",
              "Recherche hémorragies sous-durales, œdème, lésions axonales, fractures crâniennes.",
            ]}
          />
          <FlowBlock
            title="IRM cérébrale"
            items={["Sous 24–72 h pour préciser lésions axonales, hémorragies corticales/subaiguës, pronostic."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitements médicaux"
            subtitle="Convulsions, HTIC, hémodynamique"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Convulsions"
            items={[
              <>Midazolam IV 0,1 mg/kg → <strong>{formatMg(midazolam)}</strong> (renouvelable 1 fois).</>,
              <>
                Si persistance : Lévétiracétam 20–40 mg/kg IV → <strong>{formatMg(levetiracetamLow)}</strong> – <strong>{formatMg(levetiracetamHigh)}</strong> (10–20 min)
              </>,
              "Ou Phénytoïne 20 mg/kg IV selon protocole local.",
            ]}
          />
          <FlowBlock
            title="Œdème cérébral / HTIC"
            items={[
              <>
                Mannitol 20 % : 0,5–1 g/kg IV sur 20 min → <strong>{formatG(mannitolLowG)}</strong> – <strong>{formatG(mannitolHighG)}</strong>.
              </>,
              <>
                NaCl hypertonique 3 % : 2–5 mL/kg IV en 10–20 min → <strong>{formatMl(nacl3Low)}</strong> – <strong>{formatMl(nacl3High)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Maintien hémodynamique"
            items={[`Perfusion entretien (4-2-1) ≈ ${formatMlPerHour(maintenance)} (viser ~1,25× si rhabdomyolyse).`]}
          />
          <FlowBlock title="Fièvre" items={[<>Paracétamol 15 mg/kg/prise → <strong>{formatMg(paracetamol)}</strong> (max 60 mg/kg/j). Ibuprofène non recommandé en TC.</>]} />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Bilan lésionnel extra-cérébral"
            subtitle="Obligatoire"
            gradient="from-purple-500 via-fuchsia-500 to-rose-500"
          />
          <FlowBlock title="Fond d’œil (24–48 h)" items={["Recherche hémorragies rétiniennes (très évocatrices AHT)."]} />
          <FlowBlock
            title="Skeletal survey"
            items={["Radiographies squelette entier < 48 h : côtes postérieures, métaphyses, fractures anciennes/actives."]}
          />
          <FlowBlock
            title="Biologie"
            items={["NFS, coagulation, ionogramme ; rechercher troubles de coagulation pour diagnostics différentiels."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter seuils et imagerie"
            gradient="from-slate-500 via-slate-600 to-slate-700"
          />
          <FlowBlock title="Prématuré / < 3 mois" items={["Seuil diagnostic bas, imagerie systématique."]} />
          <FlowBlock title="Polytrauma" items={["ATLS pédiatrique, imagerie multimodale selon lésions associées."]} />
          <FlowBlock
            title="Suspicion infection associée"
            items={["Hémocultures ; PL uniquement après scanner normal et si pas de signe d’HTIC."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Hospitalisation"
            subtitle="Toujours obligatoire"
            gradient="from-amber-600 via-orange-600 to-rose-600"
          />
          <FlowBlock
            title="Motifs"
            items={[
              "Toute suspicion AHT = hospitalisation systématique (risque vital, surveillance neuro continue, médico-légal).",
              "Prise en charge pluridisciplinaire (réa, neurochirurgie, pédiatrie).",
            ]}
          />
          <FlowBlock
            title="Critères de sortie (très stricts)"
            items={[
              "AHT formellement exclu, examen neuro stable, imagerie normale, équipe pédiatrique/neuro/protection ok.",
              "Sécurité du domicile garantie. Si AHT confirmé : jamais retour domicile dangereux.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Obligations médico-légales"
            subtitle="Signalement immédiat"
            gradient="from-slate-900 via-gray-800 to-slate-700"
          />
          <FlowBlock
            title="Signalement"
            items={[
              "Procureur (art. 226-14 CP) + IP à la CRIP.",
              "Documenter par écrit (croquis, photos si autorisé).",
              "Ne jamais confronter les parents.",
            ]}
          />
          <FlowBlock
            title="Résumé posologique"
            items={[
              "O₂ SpO₂ 94–98 % (1–2 L/min lunettes, 10–15 L/min masque).",
              <>Paracétamol 15 mg/kg → <strong>{formatMg(paracetamol)}</strong>.</>,
              <>Midazolam IV 0,1 mg/kg → <strong>{formatMg(midazolam)}</strong>.</>,
              <>Lévétiracétam 20–40 mg/kg → <strong>{formatMg(levetiracetamLow)}</strong> – <strong>{formatMg(levetiracetamHigh)}</strong>.</>,
              <>
                Mannitol 0,5–1 g/kg → <strong>{formatG(mannitolLowG)}</strong> – <strong>{formatG(mannitolHighG)}</strong>; NaCl 3 % 2–5 mL/kg →{" "}
                <strong>{formatMl(nacl3Low)}</strong> – <strong>{formatMl(nacl3High)}</strong>.
              </>,
              `Perfusion entretien 4-2-1 : ${formatMlPerHour(maintenance)} (viser ~1,25× si rhabdomyolyse : ${formatMlPerHour(maintenance125)}).`,
            ]}
          />
        </div>
      </div>
    </div>
  );
}
