"use client";

import { useEffect } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 5;
const MAX_W = 120;
const DEFAULT_W = 25;

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

export default function ProtocolFlowSyndromeDeLoge() {
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

  const paracetamolDose = weightKg * 15;
  const ibuprofenDose = weightKg * 10;
  const morphineInitLow = weightKg * 0.05;
  const morphineInitHigh = weightKg * 0.1;
  const morphineBolusLow = weightKg * 0.025;
  const morphineBolusHigh = weightKg * 0.05;

  const maintenance = calcMaintenance(weightKg);
  const hydra125 = maintenance ? maintenance * 1.25 : null;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-purple-900 to-rose-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Traumatologie · Urgence</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">Syndrome de loge du membre - enfant</h1>
        <p className="text-sm text-white/85 mt-1">
          Identifier tôt, lever les compressions, analgésie rapide, préparer fasciotomie urgente (lésions irréversibles après ~6 h).
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
        <p className="mt-3 text-[13px] text-white/80">Version 2025 – SOFOP, SOFCOT, NICE NG38, POSNA.</p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale"
            subtitle="Rechercher activement les signes de loge"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Contexte typique"
            items={[
              "Fractures tibia/avant-bras, plâtre trop serré, écrasement, post-chir ortho, brûlures circonférentielles.",
            ]}
          />
          <FlowBlock
            title="Signes cardinaux (5P adaptés pédiatrie)"
            items={[
              "Douleur disproportionnée et douleur à l’étirement passif.",
              "Pâleur distale, parésie/faiblesse, paresthésies (tardif).",
              "Tension locale « bois dur », agitation, pouls diminué (tardif). Absence de pouls = ischémie tardive urgente.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates"
            subtitle="Ventiler, soulager, lever les compressions"
            gradient="from-sky-500 via-cyan-500 to-blue-600"
          />
          <FlowBlock
            title="Oxygène"
            items={["SpO₂ cible 94–98 % : lunettes 1–2 L/min ; masque 10–15 L/min si trauma associé ou anémie aiguë."]}
          />
          <FlowBlock
            title="Analgésie"
            items={[
              <>Paracétamol 15 mg/kg/prise → <strong>{formatMg(paracetamolDose)}</strong> (max 60 mg/kg/j).</>,
              <>+ Ibuprofène 10 mg/kg/prise → <strong>{formatMg(ibuprofenDose)}</strong> si > 3 mois et pas de choc/IRA (max 30 mg/kg/j).</>,
              <>
                Morphine IV 0,05–0,1 mg/kg → <strong>{formatMg(morphineInitLow)}</strong> à <strong>{formatMg(morphineInitHigh)}</strong> ; bolus 0,025–0,05 mg/kg q10 min →{" "}
                <strong>{formatMg(morphineBolusLow)}</strong> à <strong>{formatMg(morphineBolusHigh)}</strong>.
              </>,
              "Non recommandé : codéine, tramadol ; éviter AINS si hypovolémie ou chirurgie imminente.",
            ]}
          />
          <FlowBlock
            title="Recommandations vitales"
            items={[
              "Ne pas surélever le membre (le laisser à hauteur du cœur).",
              "Fendre/bivalver plâtres, retirer bandages serrés ou attelles compressives.",
              `Perfusion IV : entretien 4-2-1 = ${formatMlPerHour(maintenance)} ; si rhabdomyolyse suspectée, viser ~1,25× entretien ≈ ${formatMlPerHour(hydra125)}.`,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Confirmation / décision"
            subtitle="Clinique avant tout"
            gradient="from-emerald-500 via-teal-600 to-cyan-700"
          />
          <FlowBlock
            title="Mesure de pression"
            items={[
              "Réservée aux situations douteuses ou enfant non communicant/polytraumatisé.",
              "Seuil critique : PIC ≥ 30 mmHg ou ΔP (PAD - PIC) < 30 mmHg.",
            ]}
          />
          <FlowBlock
            title="Suspicion faible"
            items={[
              "Surveillance clinique toutes les 30 min (douleur, sensibilité, motricité, couleur, chaleur).",
              "Antalgie, retrait compressions locales, éviter AINS si chirurgie probable.",
            ]}
          />
          <FlowBlock
            title="Suspicion forte"
            items={[
              "Urgence chirurgicale : O₂, décompression plâtre/bandage, perfusion, antalgie.",
              "Appel orthopédiste pédiatrique + préparation bloc (anesthésie pédiatrique).",
            ]}
          />
          <FlowBlock
            title="Signes de gravité"
            items={["Ischémie, déficit moteur, anesthésie, pouls faible → fasciotomie immédiate (idéal < 6 h)."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens complémentaires"
            subtitle="Uniquement si utile"
            gradient="from-slate-500 via-slate-600 to-slate-700"
          />
          <FlowBlock
            title="Biologie"
            items={["CPK (rhabdomyolyse), ionogramme/fonction rénale (risque hyperK), lactates, Hb si saignement."]}
          />
          <FlowBlock
            title="Imagerie"
            items={[
              "Pas nécessaire au diagnostic de loge.",
              "Radiographie si suspicion fracture associée ; évaluation brûlures pour tissus mous.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter la surveillance"
            gradient="from-purple-500 via-fuchsia-500 to-rose-500"
          />
          <FlowBlock title="Polytraumatisme" items={["ATLS pédiatrique complet, monitoring continu, priorité ventilation/hémodynamique."]} />
          <FlowBlock title="Post-opératoire" items={["Surveillance renforcée 24 h ; évaluation toutes les 30 min si douleur inexpliquée."]} />
          <FlowBlock title="Brûlures circonférentielles" items={["Risque loge par œdème ; escarrotomie si signes neurovasculaires."]} />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation obligatoire si suspicion forte"
            gradient="from-amber-600 via-orange-600 to-rose-600"
          />
          <FlowBlock
            title="Hospitaliser si"
            items={[
              "Toute suspicion forte de loge, douleur incoercible, post-fasciotomie, polytraumatisme.",
              "Enfant < 3 ans, contexte chirurgical complexe, rhabdomyolyse/IRA suspectée.",
            ]}
          />
          <FlowBlock
            title="Sortie possible uniquement si"
            items={[
              "Aucune suspicion après plusieurs heures de surveillance, douleur contrôlée per os, examen vasculo-neuro normal.",
              "Parents fiables avec consignes d’alerte et suivi programmé. Après fasciotomie : pas de sortie précoce.",
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
            items={["SpO₂ 94–98 %, lunettes 1–2 L/min, masque 10–15 L/min si détresse."]}
          />
          <FlowBlock
            title="Antalgiques"
            items={[
              <>Paracétamol 15 mg/kg/prise → <strong>{formatMg(paracetamolDose)}</strong>.</>,
              <>Ibuprofène 10 mg/kg/prise → <strong>{formatMg(ibuprofenDose)}</strong> (max 30 mg/kg/j, éviter hypovolémie/chirurgie urgente).</>,
              <>
                Morphine IV 0,05–0,1 mg/kg → <strong>{formatMg(morphineInitLow)}</strong> à <strong>{formatMg(morphineInitHigh)}</strong>; bolus 0,025–0,05 mg/kg →{" "}
                <strong>{formatMg(morphineBolusLow)}</strong> à <strong>{formatMg(morphineBolusHigh)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Hydratation"
            items={[
              `Entretien 4-2-1 : ${formatMlPerHour(maintenance)} ; si rhabdomyolyse suspectée : ~1,25× → ${formatMlPerHour(hydra125)}.`,
            ]}
          />
        </div>
      </div>
    </div>
  );
}
