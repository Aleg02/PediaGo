"use client";

import AgeWeightPicker from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 1.5;
const MAX_W = 8;
const DEFAULT_W = 4;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const formatMl = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return "—";
  const v = value as number;
  if (v >= 1000) return `${Number((v / 1000).toFixed(v >= 10000 ? 0 : 1))} L`;
  if (v >= 100) return `${Math.round(v)} mL`;
  return `${Number(v.toFixed(v >= 10 ? 1 : 2))} mL`;
};

const formatMcg = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return "—";
  const v = value as number;
  if (v < 1) return `${Number(v.toFixed(2))} µg`;
  if (v < 10) return `${Number(v.toFixed(1))} µg`;
  return `${Math.round(v)} µg`;
};

export default function ProtocolFlowFievreNourrisson() {
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  const weightKg = clampWeight(weightFromStore);

  const bolus10 = weightKg * 10;
  const dextrose = weightKg * 2;

  const ampiDose = weightKg * 100;
  const ampiDay = weightKg * 300;
  const cefotaximeDose = weightKg * 50;
  const cefotaximeDay = weightKg * 150;
  const ceftriaxoneDose = Math.min(weightKg * 50, 2000);
  const acyclovirDose = weightKg * 20;
  const paracetamolDose = weightKg * 15;
  const adrenalineLow = weightKg * 0.05;
  const adrenalineHigh = weightKg * 0.3;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Infectieux · Nourrisson</p>
        <h1 className="text-2xl font-extrabold tracking-wide leading-tight">Fièvre du nourrisson &lt; 3 mois</h1>
        <p className="text-sm text-white/85 mt-1">
          Standardiser l'évaluation et la prise en charge d'un nourrisson fébrile &lt; 90 jours, repérer le risque d'infection bactérienne sévère.
        </p>
        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
        <p className="mt-3 text-[13px] text-white/80">
          Fièvre ≥ 38 °C rectale chez un nourrisson &lt; 90 jours = haut risque d'IBS : évaluation rapide, calculs automatiques.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale ABCDE"
            subtitle="Stabiliser avant prélèvements"
            gradient="from-indigo-500 via-purple-500 to-fuchsia-500"
          />
          <FlowBlock
            title="A – Airway"
            items={[
              "VAS libres, succion présente, état neuro.",
              "IOT si altération majeure (exceptionnel mais possible en sepsis).",
            ]}
          />
          <FlowBlock
            title="B – Breathing"
            items={[
              "FR élevée, tirage, geignement, apnées.",
              "O₂ titré pour SpO₂ 94–98 %, ne pas laisser un nourrisson hypoxémique.",
            ]}
          />
          <FlowBlock
            title="C – Circulation"
            items={[
              "TRC > 3 s, perfusion périphérique mauvaise, FC très élevée/basse.",
              <span key="bolus">
                Remplissage NaCl 0,9 % : <strong>{formatMl(bolus10)}</strong> (10 mL/kg), réévaluer et répéter 1 fois si besoin.
              </span>,
            ]}
          />
          <FlowBlock
            title="D – Disability"
            items={["Irritabilité, léthargie, gémissements continus, convulsions (penser méningite)."]}
          />
          <FlowBlock
            title="E – Exposition"
            items={["T° rectale, recherche purpura, marbrures, signes digestifs."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes de gravité = ATB + hospitalisation immédiate"
            subtitle="HAS + AAP + NICE"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <FlowBlock
            title="Critères"
            items={[
              "Altération de conscience ou hypotonie marquée.",
              "Gémissements persistants, refus alimentaire total, vomissements bilieux/sanglants.",
              "Marbrures, TRC > 3 s, respiration laborieuse.",
              "Convulsions.",
              "< 28 jours avec fièvre = haut risque automatique.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Conduite selon l'âge"
            subtitle="3 classes obligatoires"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="< 21 jours"
            items={[
              "Haut risque d'emblée.",
              "Bilan complet : hémoculture, BU + ECBU (KT sus-pubien), CRP/PCT, ionogramme, GDS veineux, LCR obligatoire sauf CI, Rx thorax si signes respi.",
              "ATB systématiques et hospitalisation (jamais de sortie).",
            ]}
          />
          <FlowBlock
            title="22–28 jours"
            items={[
              "Risque encore élevé : bilan complet incluant LCR.",
              "ATB si CRP/PCT élevées, anomalies EFRI/FNS ou clinique douteuse.",
              "Hospitalisation quasi systématique.",
            ]}
          />
          <FlowBlock
            title="29–60 jours"
            items={[
              "Scores bas risque AAP 2021.",
              "Bilan : hémoculture, ECBU systématique, CRP ± PCT, FNS, ± LCR si CRP/PCT élevées ou suspicion clinique.",
              "ATB si haut risque ; surveillance possible si bas risque.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens clés"
            subtitle="Identifier IBS"
            gradient="from-amber-500 via-orange-400 to-yellow-300"
          />
          <FlowBlock
            title="ECBU (obligatoire)"
            items={["Prélèvement par KT sus-pubien ou cathétérisme stérile ; IU = cause la plus fréquente d'IBS."]}
          />
          <FlowBlock
            title="CRP / PCT"
            items={["CRP > 20–30 mg/L = risque modéré/élevé ; PCT > 0,5 ng/mL = fort risque d'IBS."]}
          />
          <FlowBlock
            title="LCR"
            items={["Indiqué < 28 j, suspicion méningite, CRP/PCT élevées, troubles neuro."]}
          />
          <FlowBlock
            title="Rx thorax"
            items={["Si signes respiratoires ; fièvre isolée + BU normale = rarement indiquée."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Antibiothérapie empirique"
            subtitle="Calcul auto des doses"
            gradient="from-blue-500 via-sky-500 to-cyan-500"
          />
          <FlowBlock
            title="< 28 j ou sepsis sévère tout âge"
            items={[
              <span key="ampi">
                Ampicilline IV <strong>{formatMg(ampiDose)}</strong> toutes les 8 h (100 mg/kg/dose, {formatMg(ampiDay)}\/j).
              </span>,
              <span key="cefotaxime">
                Cefotaxime IV <strong>{formatMg(cefotaximeDose)}</strong> toutes les 8 h (50 mg/kg/dose, {formatMg(cefotaximeDay)}\/j).
              </span>,
            ]}
          />
          <FlowBlock
            title="29–60 jours (risque intermédiaire/élevé)"
            items={[
              <span key="ceftriaxone">
                Ceftriaxone IV <strong>{formatMg(ceftriaxoneDose)}</strong> par jour (50 mg/kg/j, max 2 g).
              </span>,
              "Éviter chez nouveau-né ictérique < 1 mois → préférer Céfotaxime.",
            ]}
          />
          <FlowBlock
            title="Suspicion méningite"
            items={[
              "Ampicilline + Cefotaxime (doses ci-dessus).",
              <span key="acyclovir">
                Acyclovir IV <strong>{formatMg(acyclovirDose)}</strong> toutes les 8 h (20 mg/kg).
              </span>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitements de support"
            subtitle="À associer selon besoin"
            gradient="from-slate-500 via-gray-600 to-stone-600"
          />
          <FlowBlock
            title="Oxygène"
            items={["Titré pour SpO₂ 94–98 % (masque/lunettes 1–4 L/min selon besoin)."]}
          />
          <FlowBlock
            title="Remplissage"
            items={[
              <span key="bolus2">
                NaCl 0,9 % <strong>{formatMl(bolus10)}</strong> (10 mL/kg), répéter 1 fois si besoin.
              </span>,
              <span key="adrenaline">
                Si choc persistant → adrénaline 0,05–0,3 µg/kg/min soit <strong>{formatMcg(adrenalineLow)}</strong> à <strong>{formatMcg(adrenalineHigh)}</strong> µg/min.
              </span>,
            ]}
          />
          <FlowBlock
            title="Glucose"
            items={[
              <span key="g10">
                Hypoglycémie &lt; 2,5 mmol/L : G10 % <strong>{formatMl(dextrose)}</strong> en bolus (2 mL/kg).
              </span>,
            ]}
          />
          <FlowBlock
            title="Antipyrétiques"
            items={[
              <span key="para">
                Paracétamol <strong>{formatMg(paracetamolDose)}</strong> toutes les 6 h (15 mg/kg) PO ou IV.
              </span>,
              "Pas d'ibuprofène < 3 mois ; éviter AINS.",
            ]}
          />
          <FlowBlock
            title="Non recommandés"
            items={["Pas d'antibiotiques si faible risque, pas d'imagerie systématique."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Stratification du risque (AAP 2021)"
            subtitle="Orienter ATB et hospitalisation"
            gradient="from-cyan-500 via-sky-500 to-blue-500"
          />
          <FlowBlock
            title="Haut risque"
            items={[
              "< 21 j ou < 28 j symptomatique.",
              "CRP/PCT élevées, FNS anormale, LCR anormal ou signes de gravité.",
              "→ ATB + hospitalisation obligatoire.",
            ]}
          />
          <FlowBlock
            title="Risque intermédiaire"
            items={[
              "22–60 j, examen rassurant mais CRP modérée ou BU anormale stable.",
              "→ imagerie/ATB selon bilan.",
            ]}
          />
          <FlowBlock
            title="Bas risque (tous critères)"
            items={[
              "Âge ≥ 29 j, examen normal, pas de toxicité.",
              "CRP < 20 mg/L, PCT < 0,5 ng/mL, leucocytes 5–15 G/L, BU normale.",
              "Famille fiable, reconsultation &lt; 12 h → surveillance 48 h sans ATB.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Hospitalisation ou sortie"
            subtitle="Sécuriser l'orientation"
            gradient="from-red-500 via-rose-500 to-orange-400"
          />
          <FlowBlock
            title="Hospitaliser"
            items={[
              "< 28 j systématique, sepsis probable/confirmé ou symptômes même discrets.",
              "Bilan anormal, famille incertaine/difficulté de suivi, suspicion méningite.",
              "Réanimation si détresse respi, choc septique, convulsions, acidose sévère.",
            ]}
          />
          <FlowBlock
            title="Sortie possible"
            items={[
              "Uniquement si âge ≥ 29 j, examen strictement normal et groupe bas risque.",
              "CRP/PCT/FNS/BU normaux, famille fiable, surveillance médicale < 12 h, consignes claires.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Prématurés, vaccination, maltraitance"
            gradient="from-slate-600 via-slate-500 to-gray-500"
          />
          <FlowBlock
            title="Points d'attention"
            items={[
              "Prématuré corrigé < 3 mois = haut risque : bilan complet + hospitalisation + ATB.",
              "Nourrisson non vacciné (naissance récente) : risque sepsis sévère accru.",
              "Toujours rechercher suspicion de maltraitance (trauma associé, signes cutanés).",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
