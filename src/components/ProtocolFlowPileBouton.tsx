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

const formatMl = (value: number, digits = 1) => `${value.toFixed(digits)} mL`;

export default function ProtocolFlowPileBouton() {
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

  const bolus20 = weightKg * 20;
  const paracetamol = weightKg * 15;
  const morphineLow = weightKg * 0.05;
  const morphineHigh = weightKg * 0.1;
  const omeprazole = weightKg * 1;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-amber-700 to-orange-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Corps étranger critique</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Ingestion de pile bouton – enfant
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Urgence vitale : neutraliser le pH (miel/sucralfate), radiographier immédiatement, endoscopie &lt; 2 h si œsophage,
          surveiller les formes gastriques selon taille/âge.
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
            subtitle="Signes d'urgence : hypersialorrhée, dysphagie, vomissements, détresse respi"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={[
                "Hypersialorrhée, dysphagie, stridor/dyspnée : obstruction imminente.",
                "Préparation intubation si détresse respiratoire ; laryngoscopie douce.",
              ]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "FR, SpO₂ ; O₂ titré pour 94–98 %. Toux/hémoptysie = gravité.",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={[
                "Tachycardie possible, hémorragie digestive rare (fistule aorto-œsophagienne).",
              ]}
            />
            <FlowBlock
              title="D - Disability"
              items={["Douleur thoracique/abdominale, agitation, pâleur."]}
            />
            <FlowBlock
              title="E - Exposition"
              items={["Brûlures buccales visibles = gravité. Identifier type/taille/heure d'ingestion."]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates (sans attendre imagerie)"
            subtitle="NASPGHAN 2021 / Button Battery Task Force"
            gradient="from-amber-500 via-orange-500 to-yellow-500"
          />
          <FlowBlock
            title="Gestes à éviter"
            items={[
              "Ne pas faire vomir, ne pas donner à boire avant neutralisation.",
              "Pas de charbon activé, pas de sondage, ne pas attendre la « progression ».",
            ]}
          />
          <FlowBlock
            title="Neutralisation pH"
            items={[
              "Miel (> 12 mois) : 10 mL PO toutes les 10 min, jusqu’à 6 doses, avant endoscopie si pas de vomissements/détresse.",
              "Sucralfate (tous âges) : 10 mL PO dose unique si disponible (ou 1 g pâte).",
            ]}
          />
          <FlowBlock
            title="Radiographies immédiates"
            items={[
              "Face + profil cou, thorax, abdomen avant même l'examen complet.",
              "Vérifier double contour (pile), localisation et orientation (pôle négatif « + » = côté brûlure).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Conduite selon localisation"
            subtitle="Endoscopie si œsophage, conduite graduée si gastrique"
            gradient="from-cyan-500 via-blue-500 to-indigo-500"
          />
          <FlowBlock
            title="Pile œsophagienne = URGENCE ABSOLUE"
            items={[
              "Endoscopie < 2 heures (risque perforation/fistule aorto-œsophagienne).",
              "En attendant : miel/sucralfate si non fait, O₂ titré, VVP, monitorage.",
              <>
                Après extraction : IPP (oméprazole IV 1 mg/kg/j → <strong>{formatMg(omeprazole)}</strong>), NPO, hospitalisation.
              </>,
            ]}
          />
          <FlowBlock
            title="Pile gastrique"
            items={[
              "Âge < 6 ans et pile ≥ 20 mm : endoscopie 24–48 h.",
              "Âge < 6 ans, pile 15–19 mm : discuter endoscopie selon symptômes.",
              "Symptômes (douleur, vomissements, hématémèse) : endoscopie rapide.",
              "Asymptomatique : contrôle radiographique 48 h ; si non évacuée → endoscopie.",
            ]}
          />
          <FlowBlock
            title="Pile post-pylorique"
            items={[
              "Surveillance clinique, radio 48–72 h.",
              "Si douleur/vomissements : endoscopie/TDM.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitements complémentaires"
            subtitle="Antalgiques, IPP, antibiotiques ciblés"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Antalgiques"
            items={[
              <>
                Paracétamol IV 15 mg/kg → <strong>{formatMg(paracetamol)}</strong>.
              </>,
              <>
                Morphine 0,05–0,1 mg/kg IV titrée → <strong>{formatMg(morphineLow)}</strong> -{" "}
                <strong>{formatMg(morphineHigh)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="IPP"
            items={[
              <>
                Oméprazole IV 1 mg/kg/j → <strong>{formatMg(omeprazole)}</strong> si lésions œsophagiennes.
              </>,
            ]}
          />
          <FlowBlock
            title="Antibiotiques"
            items={[
              "Seulement si fièvre, perforation, pneumopathie d'inhalation ou médiastinite.",
            ]}
          />
          <FlowBlock
            title="Hydratation / choc"
            items={[
              <>
                Si besoin : NaCl 0,9 % 20 mL/kg → <strong>{formatMl(bolus20)}</strong> (réévaluer).
              </>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter selon âge et contexte"
            gradient="from-sky-500 via-blue-600 to-slate-700"
          />
          <FlowBlock
            title="Nourrisson < 1 an"
            items={[
              "Miel contre-indiqué ; œdème laryngé fréquent, risque inhalation → surveillance continue.",
            ]}
          />
          <FlowBlock
            title="Ingestion multiple ou type incertain"
            items={[
              "Endoscopie si incertitude ; toujours avis CAPTV.",
            ]}
          />
          <FlowBlock
            title="Ingestion volontaire adolescent"
            items={[
              "Hospitalisation et évaluation psychiatrique systématique.",
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
              "Pile œsophagienne, symptômes (douleur, dysphagie, hypersialorrhée), ingestion ≥ 20 mm, tout enfant < 6 ans avec pile gastrique.",
              "Co-ingestion suspectée, famille peu fiable, brûlure buccale, ingestion volontaire.",
            ]}
          />
          <FlowBlock
            title="Réanimation si"
            items={[
              "Détresse respiratoire, suspicion perforation, hématémèse, instabilité hémodynamique.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Pile gastrique < 15 mm chez un enfant > 6 ans, asymptomatique, radio de contrôle satisfaisante.",
              "Parents fiables, consignes retour immédiat si fièvre, vomissements, douleur thoracique, hématémèse, hypersialorrhée.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
