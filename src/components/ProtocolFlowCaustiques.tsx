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

export default function ProtocolFlowCaustiques() {
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
  const paracetamol = weightKg * 15;
  const morphineLow = weightKg * 0.05;
  const morphineHigh = weightKg * 0.1;
  const methylpredLow = weightKg * 1;
  const methylpredHigh = weightKg * 2;
  const omeprazole = weightKg * 1;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-amber-700 via-orange-700 to-rose-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Toxicologie corrosifs</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Ingestion de caustiques – enfant
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Protéger les voies aériennes, interdire tout geste aggravant, appeler le CAPTV, décider endoscopie 12–24 h et surveiller.
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
            subtitle="Rechercher détresse respi, choc, inconscience"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={[
                "Œdème laryngé, stridor, dysphonie, hypersialorrhée.",
                "Risque d'obstruction : intubation précoce par opérateur entraîné (laryngoscopie douce).",
              ]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "FR, SpO₂, O₂ titré 94–98 %.",
                "Risque inhalation secondaire ou perforation trachéale (rare).",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={[
                "TA, FC ; signes de choc → NaCl 0,9 % 20 mL/kg si besoin.",
              ]}
            />
            <FlowBlock
              title="D - Disability"
              items={["Douleur intense, agitation."]}
            />
            <FlowBlock
              title="E - Exposition"
              items={[
                "Brûlures buccales (ulcérations, œdème, nécrose), mais l'absence de signes buccaux n'exclut pas des lésions profondes.",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates"
            subtitle="Appel CAPTV obligatoire, aucun geste aggravant"
            gradient="from-cyan-500 via-sky-500 to-indigo-500"
          />
          <FlowBlock
            title="À faire d'emblée"
            items={[
              "Appeler immédiatement le CAPTV (0 825 812 822).",
              "Retirer vêtements souillés, laver peau/yeux 15–20 min si projection.",
              "Repos strict, rien par la bouche.",
              "O₂ titré 94–98 %, VVP si besoin, hydratation prudente.",
            ]}
          />
          <FlowBlock
            title="Antalgiques"
            items={[
              <>
                Paracétamol IV 15 mg/kg → <strong>{formatMg(paracetamol)}</strong>.
              </>,
              <>
                Morphine IV titration 0,05–0,1 mg/kg → <strong>{formatMg(morphineLow)}</strong> -{" "}
                <strong>{formatMg(morphineHigh)}</strong> toutes 5–10 min si douleur.
              </>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Gestes formellement interdits"
            subtitle="Recommandations HAS / CAPTV / ESGE-ESPGHAN"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <FlowBlock
            title="Ne pas faire"
            items={[
              "Pas de vomissement provoqué.",
              "Pas de boisson ni neutralisation (lait, eau, citron, vinaigre).",
              "Pas de charbon activé.",
              "Pas de sondage naso-gastrique préhospitalier.",
              "Pas de lavage gastrique, pas de sirop d’ipéca.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens / imagerie"
            subtitle="Selon symptômes et suspicion perforation"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Biologie"
            items={[
              "NFS, CRP, ionogramme, fonction rénale, bilan hépatique.",
              "Gaz sanguin (acidose = gravité).",
            ]}
          />
          <FlowBlock
            title="Imagerie"
            items={[
              "TDM thoraco-abdominal si suspicion de perforation (douleur thoracique intense, emphysème médiastinal, tachycardie, détresse respi).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Endoscopie haute (OGD)"
            subtitle="Idéalement 12–24 h"
            gradient="from-indigo-500 via-purple-500 to-fuchsia-500"
          />
          <FlowBlock
            title="Indications"
            items={[
              "Tout symptôme (douleur, hypersialorrhée, dysphagie/odynophagie, vomissements).",
              "Ingestion base > 5 % ou acide concentré, ingestion intentionnelle.",
            ]}
          />
          <FlowBlock
            title="Délai"
            items={[
              "Réaliser dans les 12–24 h.",
              "Non recommandée après 48 h (risque perforation).",
              "Contre-indication relative si suspicion perforation → TDM avant.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitement médical"
            subtitle="IPP, hydratation, corticoïdes ciblés"
            gradient="from-slate-700 via-slate-800 to-black"
          />
          <FlowBlock
            title="IPP"
            items={[
              <>
                Oméprazole IV 1 mg/kg/j → <strong>{formatMg(omeprazole)}</strong> par jour chez les symptomatiques.
              </>,
            ]}
          />
          <FlowBlock
            title="Hydratation"
            items={[
              <>
                NaCl 0,9 % 10–20 mL/kg si déshydratation → <strong>{formatMl(bolus10)}</strong> -{" "}
                <strong>{formatMl(bolus20)}</strong>.
              </>,
              "Surveillance glycémie surtout chez les plus petits.",
            ]}
          />
          <FlowBlock
            title="Corticoïdes"
            items={[
              "Non recommandés en systématique (pas de preuve prévention sténose).",
              <>
                Si œdème laryngé menaçant : Méthylpred 1–2 mg/kg IV → <strong>{formatMg(methylpredLow)}</strong> -{" "}
                <strong>{formatMg(methylpredHigh)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Antibiotiques"
            items={[
              "Pas systématiques ; seulement si perforation, fièvre persistante, inhalation ou médiastinite.",
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
            title="Nourrisson"
            items={[
              "Risque majeur d’œdème laryngé : surveillance respi rapprochée, intubation précoce si doute.",
            ]}
          />
          <FlowBlock
            title="Ingestion volontaire adolescent"
            items={[
              "Hospitalisation et évaluation psychiatrique obligatoire.",
            ]}
          />
          <FlowBlock
            title="Ingestion massive / inconnue"
            items={[
              "Endoscopie systématique, appel CAPTV.",
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
              "Symptômes même mineurs, ingestion caustique forte, douleur thoracique/abdominale, vomissements, hypersialorrhée, lésions buccales.",
              "Anomalies radiologiques, ingestion volontaire, enfant < 3 ans.",
            ]}
          />
          <FlowBlock
            title="Réanimation"
            items={[
              "Détresse respi, suspicion perforation, acidose métabolique, instabilité hémodynamique, stades 2b–3 endoscopie.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Asymptomatique > 6 h, ingestion mineure < 5 %, pas de signes ORL/vomissements, pas de lésions buccales, pas d'indication endoscopie.",
              "Famille fiable, prévention accidents domestiques.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
