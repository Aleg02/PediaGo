"use client";

import { useEffect } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 5;
const MAX_W = 120;
const DEFAULT_W = 20;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const formatMl = (value: number) => {
  if (value < 1) return `${Number(value.toFixed(2))} mL`;
  if (value < 10) return `${Number(value.toFixed(1))} mL`;
  return `${Math.round(value)} mL`;
};

export default function ProtocolFlowRTAG() {
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

  const adrenalineImMg = weightKg * 0.01;
  const adrenalineImMl = weightKg * 0.01; // 1 mg/mL
  const bolus10 = weightKg * 10;
  const bolus20 = weightKg * 20;
  const furosEmide = weightKg * 1;
  const cefotaximeLow = weightKg * 100;
  const cefotaximeHigh = weightKg * 150;
  const ceftriaxoneLow = weightKg * 80;
  const ceftriaxoneHigh = weightKg * 100;
  const amikacine = weightKg * 15;
  const cetirizine = weightKg * 0.25;
  const methylpredLow = weightKg * 1;
  const methylpredHigh = weightKg * 2;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-red-900 to-amber-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Transfusion · Urgence</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Réaction transfusionnelle aiguë grave (RTAG) - enfant
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Stopper immédiatement, stabiliser ABC, traiter anaphylaxie / hémolyse / TRALI / TACO / sepsis, tracer et déclarer.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
        <p className="mt-3 text-[13px] text-white/80">Version 2025 – HAS, EFS, ANSM, SFP, SRLF, NICE.</p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Conduite immédiate"
            subtitle="Toute réaction est grave jusqu’à preuve du contraire"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Arrêt et sécurité"
            items={[
              "STOP transfusion, conserver VVP et produit + tubulure pour enquête EFS.",
              "Position décubitus (ou demi-assis si détresse), monitorage FC/FR/SpO₂/TA/T°/TRC.",
              "O₂ titré : lunettes 1–4 L/min ; masque 10–15 L/min si détresse.",
              "Perfusion NaCl 0,9 % en slow drip sur la voie conservée.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes de gravité"
            subtitle="Réanimation immédiate si présents"
            gradient="from-red-600 via-rose-600 to-orange-600"
          />
          <FlowBlock
            title="Critères"
            items={[
              "Hypotension/choc, dyspnée sévère, cyanose, tachycardie majeure.",
              "Fièvre brutale > 39 °C, douleurs lombaires/thoraciques, hémoglobinurie, purpura/saignements, troubles de conscience.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Anaphylaxie transfusionnelle"
            subtitle="Traitement"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Prise en charge"
            items={[
              <>
                Adrénaline IM 0,01 mg/kg (1 mg/mL) → <strong>{formatMg(adrenalineImMg)}</strong> mg (~{" "}
                <strong>{formatMl(adrenalineImMl)}</strong> mL), max 0,5 mg. Répéter q5 min si besoin.
              </>,
              "O₂ 10–15 L/min, NaCl 0,9 % 10–20 mL/kg si hypotension.",
              <>Antihistaminique : Cétirizine 0,25 mg/kg → <strong>{formatMg(cetirizine)}</strong>.</>,
              <>
                Corticoïdes : Méthylpred 1–2 mg/kg IV → <strong>{formatMg(methylpredLow)}</strong> – <strong>{formatMg(methylpredHigh)}</strong>.
              </>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Réaction hémolytique aiguë"
            subtitle="Urgence absolue"
            gradient="from-purple-500 via-fuchsia-500 to-rose-500"
          />
          <FlowBlock
            title="Conduite"
            items={[
              "O₂, NaCl 0,9 % 10–20 mL/kg ; maintien diurèse (furosémide 1 mg/kg IV si oligurie).",
              <>Furosémide 1 mg/kg → <strong>{formatMg(furosEmide)}</strong>.</>,
              "Bilan urgent hémolyse (NFS, bilirubine, haptoglobine), CIVD (TP/TCA/fibrino/D-dimères), groupage, Coombs.",
              "Arrêt définitif du produit, enquête EFS.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="TRALI vs TACO"
            subtitle="Différencier"
            gradient="from-sky-500 via-blue-500 to-indigo-600"
          />
          <FlowBlock
            title="TRALI"
            items={["Détresse respiratoire aiguë < 6 h, SpO₂ < 90 %, crépitants bilatéraux, PAS normale.", "O₂ haut débit, VNI si besoin, pas de diurétiques."]}
          />
          <FlowBlock
            title="TACO (surcharge volémique)"
            items={[
              <>Dyspnée + crépitants + HTA/IC : O₂, position assise, furosémide 1 mg/kg → <strong>{formatMg(furosEmide)}</strong>.</>,
              "Ralentir les transfusions ultérieures.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Sepsis transfusionnel"
            subtitle="Produit contaminé"
            gradient="from-amber-600 via-orange-600 to-rose-600"
          />
          <FlowBlock
            title="Prise en charge"
            items={[
              "Fièvre > 39 °C, frissons, choc septique possible.",
              "O₂ + perfusion ; prélever tubulure + hémocultures avant ATB.",
              <>
                ATB IV immédiate : Cefotaxime 100–150 mg/kg/j → <strong>{formatMg(cefotaximeLow)}</strong> – <strong>{formatMg(cefotaximeHigh)}</strong> / j ou Ceftriaxone 80–100 mg/kg/j →{" "}
                <strong>{formatMg(ceftriaxoneLow)}</strong> – <strong>{formatMg(ceftriaxoneHigh)}</strong> / j.
              </>,
              <>Si choc septique : ajouter Amikacine 15 mg/kg/j → <strong>{formatMg(amikacine)}</strong>.</>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens complémentaires"
            subtitle="Selon tableau"
            gradient="from-slate-500 via-slate-600 to-slate-700"
          />
          <FlowBlock
            title="Biologie"
            items={[
              "NFS, CRP, ionogramme/urée/Créat, TP/TCA/fibrinogène, LDH, haptoglobine, groupage, Coombs direct.",
              "Hémocultures si fièvre ; lactate si choc.",
            ]}
          />
          <FlowBlock title="Imagerie" items={["Radio thorax pour TRALI/TACO ; GDS selon détresse respiratoire."]} />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter selon terrain"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock title="Drépanocytose" items={["Risque réaction hémolytique retardée/allo-immunisation ; groupage étendu."]} />
          <FlowBlock title="Prématuré" items={["Risque TACO augmenté : surveiller volumes et débits."]} />
          <FlowBlock title="Polytransfusé" items={["Risque TRALI augmenté (anticorps anti-HLA/HNA)."]} />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation et traçabilité"
            subtitle="Hospitalisation systématique"
            gradient="from-purple-600 via-fuchsia-600 to-rose-600"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Toute RTAG : hospitalisation ; réanimation si choc, détresse respiratoire, TRALI/TACO sévère, RAIH, sepsis transfusionnel.",
            ]}
          />
          <FlowBlock
            title="Traçabilité"
            items={["Déclarer EFS/ANSM (hémovigilance). Conserver produit/tubulure, documenter l’incident."]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Asymptomatique > 24 h, bilans rassurants (pas d’hémolyse ni trouble coag), SpO₂ stable air ambiant, examen normal.",
              "Avis hémobiologiste + pédiatre, plan transfusionnel sécurisé pour l’avenir.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Résumé posologique"
            subtitle="Calculs automatiques selon poids"
            gradient="from-slate-900 via-gray-800 to-slate-700"
          />
          <FlowBlock
            title="Oxygène"
            items={["SpO₂ 94–98 %, lunettes 1–4 L/min, masque 10–15 L/min si détresse."]}
          />
          <FlowBlock
            title="Adrénaline IM"
            items={[<>0,01 mg/kg (1 mg/mL) → <strong>{formatMg(adrenalineImMg)}</strong> mg (~ <strong>{formatMl(adrenalineImMl)}</strong> mL), max 0,5 mg.</>]}
          />
          <FlowBlock
            title="Remplissage"
            items={[<>NaCl 0,9 % 10–20 mL/kg → <strong>{formatMl(bolus10)}</strong> – <strong>{formatMl(bolus20)}</strong>.</>]}
          />
          <FlowBlock title="Diurétique" items={[<>Furosémide 1 mg/kg → <strong>{formatMg(furosEmide)}</strong>.</>]} />
          <FlowBlock
            title="ATB sepsis"
            items={[
              <>
                Cefotaxime 100–150 mg/kg/j → <strong>{formatMg(cefotaximeLow)}</strong> – <strong>{formatMg(cefotaximeHigh)}</strong> / j ou Ceftriaxone 80–100 mg/kg/j →{" "}
                <strong>{formatMg(ceftriaxoneLow)}</strong> – <strong>{formatMg(ceftriaxoneHigh)}</strong> / j.
              </>,
              <>Amikacine 15 mg/kg/j → <strong>{formatMg(amikacine)}</strong>.</>,
            ]}
          />
          <FlowBlock
            title="Antihistaminique / Corticoïdes"
            items={[
              <>Cétirizine 0,25 mg/kg → <strong>{formatMg(cetirizine)}</strong>.</>,
              <>
                Méthylprednisolone 1–2 mg/kg → <strong>{formatMg(methylpredLow)}</strong> – <strong>{formatMg(methylpredHigh)}</strong>.
              </>,
            ]}
          />
        </div>
      </div>
    </div>
  );
}
