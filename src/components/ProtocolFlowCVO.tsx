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

export default function ProtocolFlowCVO() {
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

  const naClBolus = weightKg * 10; // mL

  const paracetamolDose = weightKg * 15;
  const ibuprofenDose = weightKg * 10;

  const morphineInitLow = weightKg * 0.05;
  const morphineInitHigh = weightKg * 0.1;
  const morphineBolusLow = weightKg * 0.025;
  const morphineBolusHigh = weightKg * 0.05;

  const ceftriaxoneLow = weightKg * 50;
  const ceftriaxoneHigh = Math.min(weightKg * 75, 2000);
  const cefotaximeLow = weightKg * 150;
  const cefotaximeHigh = weightKg * 200;
  const vancomycineLow = weightKg * 40;
  const vancomycineHigh = weightKg * 60;
  const amikacine = weightKg * 15;

  const maintenance = calcMaintenance(weightKg);
  const hydraLow = maintenance ? maintenance * 1 : null;
  const hydraMid = maintenance ? maintenance * 1.25 : null;
  const hydraHigh = maintenance ? maintenance * 1.5 : null;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-rose-900 to-red-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Hématologie · Urgence</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Crise vaso-occlusive drépanocytaire – enfant
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Contrôler rapidement la douleur, prévenir le syndrome thoracique aigu et l’infection, sécuriser l’hydratation.
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
          Version 2025 – conforme SFP, CNRD, HAS, NICE.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale"
            subtitle="Douleur, constantes, signes de gravité"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Paramètres vitaux"
            items={[
              "SpO₂, FC, FR, PA, T°, état général ; douleur EVA/EVENDOL/ECPA.",
              "Rechercher signes respiratoires (polypnée, douleur thoracique, toux).",
            ]}
          />
          <FlowBlock
            title="Signes de gravité (appel pédiatre/réa)"
            items={[
              "Fièvre ≥ 38,5 °C ; SpO₂ < 94 % ; douleur thoracique/toux → suspicion STA.",
              "Déficit neurologique (AVC), abdomen aigu, priapisme prolongé.",
              "Anémie aiguë symptomatique, signes de choc (TRC > 3 s, marbrures, tachycardie).",
              "Douleur non contrôlée dans les 2 h.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates"
            subtitle="O₂, VVP, hydratation prudente"
            gradient="from-sky-500 via-cyan-500 to-blue-600"
          />
          <FlowBlock
            title="Oxygénothérapie"
            items={[
              "Objectif SpO₂ 94–98 % ; si SpO₂ < 94 % : lunettes 1–2 L/min ou masque 5–10 L/min selon besoin.",
              "Pas d’oxygène systématique si saturation normale (NICE).",
            ]}
          />
          <FlowBlock title="Voie veineuse" items={["VVP si douleur modérée/sévère ou tout signe de gravité."]} />
          <FlowBlock
            title="Hydratation (1–1,5 × entretien)"
            items={[
              `Entretien 4-2-1 : ${formatMlPerHour(maintenance)}.`,
              `CVO : 1–1,5 × → ${formatMlPerHour(hydraLow)} à ${formatMlPerHour(hydraHigh)} (référence 1,25 × ≈ ${formatMlPerHour(
                hydraMid,
              )}).`,
              "Ne pas dépasser 1,5 × (risque œdème pulmonaire / STA). Voie orale si forme légère.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Antalgie (SFP / CNRD / NICE)"
            subtitle="Progression par paliers"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Douleur légère (EVA < 4)"
            items={[<>Paracétamol 15 mg/kg → <strong>{formatMg(paracetamolDose)}</strong> par prise (max 60 mg/kg/j).</>]}
          />
          <FlowBlock
            title="Douleur modérée (EVA 4–6)"
            items={[
              <>Paracétamol 15 mg/kg.</>,
              <>+ Ibuprofène 10 mg/kg → <strong>{formatMg(ibuprofenDose)}</strong> par prise (max 30 mg/kg/j, CI si déshydratation/infection sévère).</>,
            ]}
          />
          <FlowBlock
            title="Douleur sévère (EVA ≥ 7) : morphine IV"
            items={[
              <>
                Dose initiale 0,05–0,1 mg/kg → <strong>{formatMg(morphineInitLow)}</strong> à <strong>{formatMg(morphineInitHigh)}</strong>.
              </>,
              <>
                Bolus 0,025–0,05 mg/kg q10 min → <strong>{formatMg(morphineBolusLow)}</strong> à <strong>{formatMg(morphineBolusHigh)}</strong>.
              </>,
              "Perfusion possible si besoin (prescription spécialisée).",
              "Alternatives : morphine SC 0,1–0,2 mg/kg ou kétamine IV 0,1–0,3 mg/kg (spécialiste).",
              "Non recommandé : codéine, tramadol ; AINS si déshydratation/IRA ; pas de corticoïdes (risque rebond).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Complications à rechercher"
            subtitle="STA, infection, anémie aiguë, AVC"
            gradient="from-purple-500 via-fuchsia-500 to-rose-500"
          />
          <FlowBlock
            title="Syndrome thoracique aigu (STA)"
            items={[
              "Douleur thoracique, toux, fièvre, désaturation.",
              "Rx thorax, GDS si détresse ; O₂ si SpO₂ < 94 % ; kiné respi ; ATB immédiate ; transfusion simple si anémie, échange si forme sévère.",
            ]}
          />
          <FlowBlock
            title="Infection bactérienne"
            items={[
              "Asplénie fonctionnelle → ATB IV immédiate si fièvre ≥ 38,5 °C, altération, suspicion STA, hyperleucocytose, signes méningés.",
            ]}
          />
          <FlowBlock
            title="Anémie aiguë / séquestration splénique"
            items={["Pâleur, tachycardie, splénomégalie douloureuse, chute Hb > 2 g/dL → avis hémato, transfusion simple si symptomatique."]}
          />
          <FlowBlock
            title="AVC / AIT"
            items={["Déficit focal, céphalées sévères → imagerie urgente ; échange transfusionnel si confirmé (CNRD)."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Antibiothérapie IV"
            subtitle="Si fièvre / suspicion infection ou STA"
            gradient="from-indigo-500 via-blue-500 to-sky-500"
          />
          <FlowBlock
            title="Ceftriaxone"
            items={[
              <>
                50–75 mg/kg/j en une prise (max 2 g/j) →{" "}
                <strong>
                  {formatMg(ceftriaxoneLow)} – {formatMg(ceftriaxoneHigh)}
                </strong>{" "}
                / jour.
              </>,
            ]}
          />
          <FlowBlock
            title="Si méningite suspectée"
            items={[
              <>
                Cefotaxime 150–200 mg/kg/j en 3–4 injections →{" "}
                <strong>
                  {formatMg(cefotaximeLow)} – {formatMg(cefotaximeHigh)}
                </strong>{" "}
                / jour.
              </>,
              <>
                Vancomycine 40–60 mg/kg/j en 3–4 injections →{" "}
                <strong>
                  {formatMg(vancomycineLow)} – {formatMg(vancomycineHigh)}
                </strong>{" "}
                / jour.
              </>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Transfusion"
            subtitle="Selon CNRD"
            gradient="from-amber-600 via-orange-600 to-rose-600"
          />
          <FlowBlock
            title="Indications"
            items={[
              "Syndrome thoracique aigu modéré à sévère.",
              "Anémie aiguë sévère (Hb < 7 g/dL symptomatique).",
              "AVC/AIT suspecté.",
              "Priapisme prolongé non résolutif.",
              "Préparation anesthésique urgente.",
            ]}
          />
          <FlowBlock
            title="Types"
            items={["Transfusion simple si Hb < 7 g/dL ou symptomes ; exsanguino-transfusion si STA sévère ou AVC."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter hydratation et traitements"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Déshydratation"
            items={["Ne pas dépasser 1,5 × entretien, privilégier NaCl 0,9 % ; surveiller surcharge pulmonaire."]}
          />
          <FlowBlock
            title="Insuffisance rénale"
            items={["Éviter AINS ; ajuster certains ATB selon clairance."]}
          />
          <FlowBlock
            title="Enfant très jeune (< 3 ans)"
            items={["Risque infectieux majeur : hospitalisation quasi systématique."]}
          />
          <FlowBlock
            title="Traitement de fond (hydroxyurée)"
            items={["Vérifier l’observance, contrôler NFS (risque neutropénie)."]}
          />
          <FlowBlock
            title="Suspicion choc"
            items={[
              <>Remplissage NaCl 0,9 % 10 mL/kg en 10–20 min → <strong>{formatMl(naClBolus)}</strong>. Répéter une fois si besoin.</>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation fréquente"
            gradient="from-slate-500 via-slate-600 to-slate-700"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Douleur sévère nécessitant opioïdes IV ou non contrôlée à 2–3 h.",
              "Fièvre ≥ 38,5 °C, suspicion STA ou infection, SpO₂ < 94 %, anémie aiguë, déshydratation.",
              "Comorbidités, ATCD de CVO sévères, enfant < 3 ans, terrain social fragile.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Douleur contrôlée avec antalgiques per os, hydratation correcte, apyrétique, sans signe respiratoire.",
              "Famille fiable, consignes écrites, RDV de contrôle à J2–J3.",
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
            items={["Objectif 94–98 %, 1–10 L/min selon besoin ; uniquement si SpO₂ < 94 %."]}
          />
          <FlowBlock
            title="Antalgiques"
            items={[
              <>Paracétamol 15 mg/kg/prise → <strong>{formatMg(paracetamolDose)}</strong> (max 60 mg/kg/j).</>,
              <>Ibuprofène 10 mg/kg/prise → <strong>{formatMg(ibuprofenDose)}</strong> (max 30 mg/kg/j, CI déshydratation/infection sévère).</>,
              <>
                Morphine IV : 0,05–0,1 mg/kg initial → <strong>{formatMg(morphineInitLow)}</strong> à{" "}
                <strong>{formatMg(morphineInitHigh)}</strong> ; bolus 0,025–0,05 mg/kg → <strong>{formatMg(morphineBolusLow)}</strong> à{" "}
                <strong>{formatMg(morphineBolusHigh)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Hydratation"
            items={[`Entretien ${formatMlPerHour(maintenance)} ; cible 1–1,5 × : ${formatMlPerHour(hydraLow)} à ${formatMlPerHour(hydraHigh)}.`]}
          />
          <FlowBlock
            title="ATB si fièvre"
            items={[
              <>
                Ceftriaxone 50–75 mg/kg/j (≤ 2 g/j) → <strong>{formatMg(ceftriaxoneLow)}</strong> – <strong>{formatMg(ceftriaxoneHigh)}</strong> / jour.
              </>,
              <>
                Si méningite : Cefotaxime 150–200 mg/kg/j → <strong>{formatMg(cefotaximeLow)}</strong> –{" "}
                <strong>{formatMg(cefotaximeHigh)}</strong> / jour + Vancomycine 40–60 mg/kg/j → <strong>{formatMg(vancomycineLow)}</strong> –{" "}
                <strong>{formatMg(vancomycineHigh)}</strong> / jour.
              </>,
            ]}
          />
          <FlowBlock title="Remplissage si choc" items={[<>NaCl 0,9 % 10 mL/kg → <strong>{formatMl(naClBolus)}</strong>.</>]} />
        </div>
      </div>
    </div>
  );
}
