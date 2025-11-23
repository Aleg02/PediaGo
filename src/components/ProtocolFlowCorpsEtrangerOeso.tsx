"use client";

import { useEffect } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 3;
const MAX_W = 120;
const DEFAULT_W = 15;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

export default function ProtocolFlowCorpsEtrangerOeso() {
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

  const paracetamol = weightKg * 15;
  const morphineLow = weightKg * 0.05;
  const morphineHigh = weightKg * 0.1;
  const dexamethasoneLow = weightKg * 0.15;
  const dexamethasoneHigh = weightKg * 0.6;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-800 to-sky-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Voies digestives hautes</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Corps étranger œsophagien (hors piles)
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Identifier les signes de gravité, radiographier, prioriser l’endoscopie selon type (pointu/aimants/aliments/objets arrondis) et sécuriser la surveillance.
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
            subtitle="Hypersialorrhée, dysphagie, douleur = alerte"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={[
                "Hypersialorrhée, dysphagie/odynophagie sévère, toux/stridor si CE refoulé vers larynx.",
                "Risque détresse respiratoire : prévenir anesthésiste, intubation si nécessaire.",
              ]}
            />
            <FlowBlock
              title="B - Breathing"
              items={["SpO₂, dyspnée/toux réflexe ; O₂ titré 94–98 % après stabilisation."]}
            />
            <FlowBlock
              title="C - Circulation"
              items={["FC/TA généralement stables (surveillance si douleur/stress)."]}
            />
            <FlowBlock
              title="D - Disability"
              items={["Agitation, douleur thoracique = risque perforation."]}
            />
            <FlowBlock
              title="E - Exposure"
              items={["Type/heure du CE, quantité, brûlures buccales rares (hors caustique/pile)."]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes de gravité = endoscopie urgente (&lt; 2 h)"
            subtitle="ESPGHAN/ESGE 2017, NASPGHAN, AAP"
            gradient="from-indigo-500 via-blue-500 to-cyan-500"
          />
          <FlowBlock
            title="Critères"
            items={[
              "Hypersialorrhée, incapacité à avaler sa salive.",
              "Douleur thoracique, vomissements incoercibles.",
              "Dyspnée/toux, fièvre ou suspicion perforation.",
              "CE pointu/tranchant, aimants multiples, enfant instable.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens"
            subtitle="Radiographie systématique"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Radiographies"
            items={[
              "Face + profil cou-thorax-abdomen pour tout CE ingéré.",
              "Rechercher localisation, forme, CE radio-opaque, pneumomédiastin ou niveaux hydro-aériques.",
              "CE non radio-opaque (plastique/bois/nourriture) : endoscopie si symptômes persistants.",
            ]}
          />
          <FlowBlock
            title="TDM"
            items={[
              "Si suspicion perforation : emphysème médiastinal, douleur thoracique sévère, fièvre, dyspnée, CRP élevée.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Conduite selon le type de CE"
            subtitle="Délai d’endoscopie"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Pointu / tranchant"
            items={[
              "Aiguilles, os de poisson, verre : extraction endoscopique en urgence &lt; 2 h (risque perforation/mediastinite).",
              "Ne pas faire avaler pain/eau.",
            ]}
          />
          <FlowBlock
            title="Aimants"
            items={[
              "Un aimant : extraction sous 12–24 h.",
              "Aimants multiples ou aimant + métal : urgence &lt; 2 h (risque perforations multiples/fistules).",
            ]}
          />
          <FlowBlock
            title="Aliments bloqués"
            items={[
              "Morceau de viande/pomme/cacahuète : extraction semi-urgente &lt; 12 h.",
              "O₂, antalgie ; ne pas induire vomissements ni boissons.",
            ]}
          />
          <FlowBlock
            title="Objet arrondi / long"
            items={[
              "Jeton/bille : extraction &lt; 24 h si œsophage.",
              "Objet long (&gt; 5–6 cm) : extraction endoscopique (risque non passage pylore).",
              "Si objet passé dans l’estomac : surveillance + contrôle.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitements"
            subtitle="Support, analgésie, éviter manœuvres"
            gradient="from-slate-700 via-slate-800 to-black"
          />
          <FlowBlock
            title="Oxygène"
            items={["O₂ titré pour SpO₂ 94–98 %."]}
          />
          <FlowBlock
            title="Antalgiques"
            items={[
              <>
                Paracétamol 15 mg/kg → <strong>{formatMg(paracetamol)}</strong>.
              </>,
              <>
                Morphine IV 0,05–0,1 mg/kg titrée → <strong>{formatMg(morphineLow)}</strong> -{" "}
                <strong>{formatMg(morphineHigh)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Corticoïdes"
            items={[
              "Non systématiques ; si œdème laryngé/difficulté respiratoire : dexaméthasone 0,15–0,6 mg/kg.",
              <>
                Dose calculée : <strong>{formatMg(dexamethasoneLow)}</strong> - <strong>{formatMg(dexamethasoneHigh)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Antibiotiques / boissons"
            items={[
              "ATB uniquement si perforation/fièvre/mediastinite/pneumopathie d’inhalation.",
              "Interdits : faire boire (eau/pain), induire vomissements, gestes externes.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Endoscopie"
            subtitle="Rigide (ORL) ou souple (gastro) selon équipes"
            gradient="from-indigo-500 via-purple-500 to-fuchsia-500"
          />
          <FlowBlock
            title="Urgent"
            items={[
              "CE pointu, aimants multiples, aliment bloqué non dégluti, symptômes sévères (douleur thoracique, hypersialorrhée).",
            ]}
          />
          <FlowBlock
            title="Non urgent"
            items={[
              "Objet arrondi non dangereux chez asymptomatique : extraction &lt; 24 h.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Nourrisson, handicap, ado volontaire"
            gradient="from-sky-500 via-blue-600 to-slate-700"
          />
          <FlowBlock
            title="Nourrisson"
            items={[
              "Symptômes souvent frustres, lumière étroite → extraction urgente, risque apnée.",
            ]}
          />
          <FlowBlock
            title="Handicap / troubles de déglutition"
            items={[
              "Haut risque récidive, surveillance rapprochée.",
            ]}
          />
          <FlowBlock
            title="Ingestion volontaire (adolescent)"
            items={[
              "Hospitalisation + évaluation psychiatrique.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation / réanimation / sortie"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "CE pointu/aimants, symptômes persistants, extraction endoscopique, comorbidité respi, suspicion perforation, douleur/fièvre, enfant &lt; 3 ans, problème social.",
            ]}
          />
          <FlowBlock
            title="Réanimation"
            items={[
              "Instabilité hémodynamique, détresse respiratoire, perforation/mediastinite, post-anesthésie complexe.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Examen clinique et radiographie normaux ou CE évacué, asymptomatique ≥ 4–6 h.",
              "Parents fiables, consignes écrites : retour si fièvre, douleur thoracique, hypersialorrhée, refus alimentation.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
