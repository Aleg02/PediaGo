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

export default function ProtocolFlowCorpsEtrangerInhale() {
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
  const dexamethasoneLow = weightKg * 0.15;
  const dexamethasoneHigh = weightKg * 0.6;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-blue-800 to-emerald-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Voies aériennes</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Corps étranger inhalé
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Reconnaître obstruction partielle ou totale, appliquer les manœuvres adaptées à l’âge, puis organiser l’endoscopie et la surveillance.
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
            subtitle="Obstruction totale = urgence vitale"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={[
                "Obstruction totale : incapacité de parler/pleurer, silence respiratoire, cyanose, tirage extrême, perte de conscience rapide.",
                "Obstruction partielle : toux présente, stridor, entrée d’air conservée.",
              ]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "SpO₂ après extraction : O₂ titré 94–98 %.",
                "Pendant obstruction totale : priorité manœuvres, pas d’O₂ prioritaire.",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={["FC, TA ; instabilité possible si obstruction prolongée."]}
            />
            <FlowBlock
              title="D - Disability"
              items={["Altération conscience = urgence RCP."]}
            />
            <FlowBlock
              title="E - Exposure"
              items={["PLS si inconscience avec respiration conservée."]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Conduite selon gravité"
            subtitle="ERC / AAP / NICE"
            gradient="from-indigo-500 via-blue-500 to-cyan-500"
          />
          <FlowBlock
            title="Obstruction partielle (toux efficace)"
            items={[
              "Encourager la toux, ne pas faire Heimlich ni claques.",
              "Surveillance constante, transfert médicalisé, préparer intubation si aggravation.",
            ]}
          />
          <FlowBlock
            title="Obstruction totale (toux inefficace)"
            items={[
              "Enfant &lt; 1 an : 5 claques dans le dos + 5 compressions thoraciques (2 doigts), alterner 5/5.",
              "Enfant ≥ 1 an : 5 claques dorsales + 5 compressions abdominales (Heimlich), alterner 5/5.",
            ]}
          />
          <FlowBlock
            title="Enfant inconscient"
            items={[
              "Appeler secours, débuter RCP : 30 compressions, visualiser le CE si visible (pas de balayage à l’aveugle), 2 insufflations, poursuivre jusqu’aux secours.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Après extraction"
            subtitle="Stabiliser et rechercher complications"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Soins immédiats"
            items={[
              "O₂ titré SpO₂ 94–98 %, bilan clinique (stridor, dyspnée).",
              "Hémoptysie → suspecter lésion trachéale ; pneumothorax possible si manœuvres intenses.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens complémentaires"
            subtitle="Systématique après suspicion"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Imagerie"
            items={[
              "Radiographie thorax (PA + profil) systématique, même asymptomatique : emphysème localisé, atélectasie, médiastin, CE radio-opaque.",
            ]}
          />
          <FlowBlock
            title="Endoscopie rigide"
            items={[
              "Référence : indicée si épisode évocateur même radios normales, suspicion persistante (râles/wheezing unilatéral), CE végétal (arachide), symptômes persistants après extraction.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitements"
            subtitle="Limiter les médicaments"
            gradient="from-slate-700 via-slate-800 to-black"
          />
          <FlowBlock
            title="Bronchodilatateurs"
            items={["Non recommandés (obstruction mécanique)."]}
          />
          <FlowBlock
            title="Corticothérapie"
            items={[
              "Non systématique ; utile si œdème laryngé post-manœuvres : dexaméthasone 0,15–0,6 mg/kg.",
              <>
                Dose calculée : <strong>{formatMg(dexamethasoneLow)}</strong> - <strong>{formatMg(dexamethasoneHigh)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Antibiotiques"
            items={["Seulement si pneumopathie secondaire."]}
          />
          <FlowBlock
            title="Analgésie"
            items={[
              <>
                Paracétamol 15 mg/kg → <strong>{formatMg(paracetamol)}</strong>.
              </>,
              "Éviter morphiniques en cas d’altération respiratoire.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter les manœuvres"
            gradient="from-sky-500 via-blue-600 to-slate-700"
          />
          <FlowBlock
            title="Nourrisson &lt; 1 an"
            items={[
              "Claques + compressions thoraciques (pas de Heimlich), hypoxie rapide, risque bradycardie réflexe.",
            ]}
          />
          <FlowBlock
            title="Handicap / hypotonie"
            items={[
              "Obstruction plus rapide, manœuvres parfois moins efficaces, surveiller de près.",
            ]}
          />
          <FlowBlock
            title="Objets particuliers"
            items={[
              "CE végétal (arachide) → endoscopie quasi systématique ; objets pointus, piles bouton, aimants → urgence endoscopique même asymptomatique.",
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
            title="Hospitalisation"
            items={[
              "Extraction endoscopique, symptômes persistants (stridor/wheezing/toux), radiographie anormale, suspicion persistante malgré imagerie.",
              "CE végétal, post-manœuvres traumatiques, comorbidité respiratoire (asthme, dysplasie BPD).",
            ]}
          />
          <FlowBlock
            title="Réanimation"
            items={[
              "Intubation/ventilation, hypoxie persistante, ACR initial, œdème laryngé sévère, pneumothorax sous tension.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Examen et radiographie thoracique normaux, pas de symptômes retardés (toux/wheezing), asymptomatique ≥ 4 h.",
              "Famille fiable, accès aux soins si aggravation, prévention (éducation CE).",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
