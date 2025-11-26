"use client";

import { useEffect } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 1;
const MAX_W = 6;
const DEFAULT_W = 3;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const formatMl = (value: number) => {
  if (value < 1) return `${Number(value.toFixed(2))} mL`;
  if (value < 10) return `${Number(value.toFixed(1))} mL`;
  return `${Math.round(value)} mL`;
};

const formatMlRange = (low: number, high: number) => `${formatMl(low)} – ${formatMl(high)}`;

export default function ProtocolFlowReanimationNeonatale() {
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

  const adrenalineIvLowMg = weightKg * 0.01;
  const adrenalineIvHighMg = weightKg * 0.03;
  const adrenalineIvLowMl = weightKg * 0.1; // 0,1 mg/mL = 0,1 mL/kg
  const adrenalineIvHighMl = weightKg * 0.3;

  const adrenalineTrachLowMg = weightKg * 0.05;
  const adrenalineTrachHighMg = weightKg * 0.1;
  const adrenalineTrachLowMl = weightKg * 0.5;
  const adrenalineTrachHighMl = weightKg * 1;

  const bolusNaCl = weightKg * 10;
  const glucoseBolus = weightKg * 2; // mL de G10 %

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-emerald-900 to-teal-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Réanimation néonatale</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Réanimation néonatale – Salle de naissance
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Ventilation efficace en priorité, prévention de l’hypothermie et identification rapide des situations à risque.
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
          Conforme recommandations ILCOR/AAP NRP 2020–2023 et ERC 2021.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Arbre décisionnel"
            subtitle="Naissance → séchage → stimulation → position neutre"
            gradient="from-cyan-500 via-teal-500 to-emerald-600"
          />
          <FlowBlock
            title="Séquence rapide"
            items={[
              "Respiration et FC ? Respiration normale + FC ≥ 100 → soins courants.",
              "Respiration absente/gasping OU FC < 100 → VPP immédiate 30 s.",
              "Après 30 s de VPP efficace (MRSOPA/VRP) : réévaluer la FC.",
              "FC ≥ 100 → sevrage VPP / CPAP selon clinique.",
              "FC 60–99 → optimiser la ventilation.",
              "FC < 60 → massage cardiaque + O₂ 100 % ; après 60 s massage + ventilation efficace, si FC < 60 → adrénaline IV/IO et rechercher pneumothorax/hypovolémie.",
            ]}
          />
          <FlowBlock
            title="Réévaluation après VPP"
            items={[
              "FC ≥ 100 : soins courants / CPAP si besoin.",
              "FC 60–99 : optimiser ventilation (MRSOPA/VRP).",
              "FC < 60 : massage + O₂ 100 %, adrénaline IV/IO si persistance.",
            ]}
          />
          <FlowBlock
            title="Définition succincte"
            items={[
              "Absence ou irrégularité respiratoire, absence de cri, tonus faible, FC < 100 bpm.",
              "Nécessité d’une VPP ou de manœuvres avancées.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale (5–10 s)"
            subtitle="Décider réanimation vs soins courants"
            gradient="from-indigo-500 via-blue-500 to-sky-500"
          />
          <FlowBlock
            title="3 questions clés"
            items={[
              "Terme ≥ 37 SA ?",
              "Respire/pleure ?",
              "Tonus satisfaisant ?",
              "Oui aux 3 → soins courants ; non à 1 → début procédure NRP.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates (0–30 s)"
            subtitle="Prévenir hypothermie et assurer VAS"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Prévention hypothermie"
            items={[
              "Température salle 23–26 °C, séchage rapide.",
              "Chapeau + sac polyéthylène si < 32 SA.",
              "Monitorage continu de la température.",
            ]}
          />
          <FlowBlock
            title="Positionnement / VAS"
            items={[
              "Tête en position neutre.",
              "Aspirer uniquement si obstruction visible ou ventilation impossible (pas d’aspiration systématique, même méconium).",
            ]}
          />
          <FlowBlock
            title="Stimulation"
            items={["Friction dos / pieds, éviter les gestes agressifs."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Ventilation initiale"
            subtitle="Si respiration absente, gasping ou FC < 100"
            gradient="from-sky-500 via-cyan-500 to-blue-600"
          />
          <FlowBlock
            title="VPP (ballon masque)"
            items={[
              "Durée initiale : 30 s ; fréquence 40–60/min.",
              "PIP 20–25 cmH₂O (jusqu’à 30 si thorax peu mobile), PEP 5 cmH₂O.",
              "Objectif : thorax qui bouge.",
            ]}
          />
          <FlowBlock
            title="Oxygène"
            items={[
              "Nouveau-né ≥ 32 SA : début à l’air ambiant (FiO₂ 0,21).",
              "< 32 SA : FiO₂ initiale 0,30 à ajuster selon SpO₂.",
            ]}
          />
          <FlowBlock
            title="Cibles SpO₂ pré-ductale"
            items={[
              "1 min : 60–65 % ; 2 min : 65–70 % ; 3 min : 70–75 %.",
              "4 min : 75–80 % ; 5 min : 80–85 % ; 10 min : 85–95 %.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Optimisation ventilation"
            subtitle="MRSOPA / VRP si FC < 100 après 30 s"
            gradient="from-purple-500 via-fuchsia-500 to-rose-500"
          />
          <FlowBlock
            title="Manœuvres"
            items={[
              "M : repositionner la tête.",
              "R : repositionner le masque.",
              "S : aspiration si nécessaire.",
              "O : ouvrir la bouche.",
              "P : augmenter la pression.",
              "A : alternative voie aérienne (canule/oropharynx, intubation).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Intubation ou dispositif avancé"
            subtitle="Si ventilation inefficace ou gestes spécifiques"
            gradient="from-emerald-500 via-teal-500 to-cyan-600"
          />
          <FlowBlock
            title="Indications"
            items={[
              "Ventilation inefficace persistante.",
              "Nécessité d’aspirer un méconium obstructif.",
              "Besoin de massage cardiaque.",
              "Administration d’adrénaline trachéale (moins efficace que IV).",
            ]}
          />
          <FlowBlock
            title="Taille canule orotrachéale"
            items={[
              "< 1 kg : 2,5 (profondeur 6–7 cm).",
              "1–2 kg : 3,0 (profondeur 7–8 cm).",
              "2–3 kg : 3,5 (profondeur 8–9 cm).",
              "> 3 kg : 3,5–4,0 (profondeur 9–10 cm).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Massage cardiaque"
            subtitle="FC < 60 malgré 30 s de VPP efficace"
            gradient="from-rose-500 via-red-500 to-orange-500"
          />
          <FlowBlock
            title="Technique"
            items={[
              "Ratio 3 compressions / 1 ventilation, fréquence totale 120 événements/min.",
              "Deux pouces encerclant le thorax, profondeur 1/3 du thorax.",
              "O₂ 100 % pendant le massage.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Médicaments"
            subtitle="Si non-réponse au massage + ventilation efficace"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Adrénaline (épinéphrine)"
            items={[
              <>
                Voie IV/IO (préférée, cathéter veine ombilical) : 0,01–0,03 mg/kg (1:10 000 = 0,1 mg/mL) →{" "}
                <strong>
                  {formatMg(adrenalineIvLowMg)} – {formatMg(adrenalineIvHighMg)}
                </strong>{" "}
                (~ {formatMlRange(adrenalineIvLowMl, adrenalineIvHighMl)} soit 0,1–0,3 mL/kg). Répéter toutes les 3–5 min si FC{" "}
                {"<"} 60.
              </>,
              <>
                Voie trachéale (moins efficace) : 0,05–0,1 mg/kg →{" "}
                <strong>
                  {formatMg(adrenalineTrachLowMg)} – {formatMg(adrenalineTrachHighMg)}
                </strong>{" "}
                (~ {formatMlRange(adrenalineTrachLowMl, adrenalineTrachHighMl)} soit 0,5–1 mL/kg).
              </>,
            ]}
          />
          <FlowBlock
            title="Remplissage (si hypovolémie suspectée)"
            items={[`NaCl 0,9 % 10 mL/kg en 5–10 min : ${formatMl(bolusNaCl)}.`]}
          />
          <FlowBlock
            title="Glucose"
            items={[
              `Bolus G10 % 2 mL/kg si suspicion hypoglycémie sévère : ${formatMl(glucoseBolus)}.`,
              "Bilan glycémique dès que la situation est stabilisée ; perfusion 6–8 mg/kg/min par pompe.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter FiO₂ et dispositifs"
            gradient="from-sky-500 via-blue-600 to-slate-700"
          />
          <FlowBlock
            title="< 32 SA"
            items={[
              "FiO₂ initiale 0,30, sac polyéthylène systématique.",
              "CPAP si respiration présente mais irrégulière ; surfactant si SDR avéré.",
            ]}
          />
          <FlowBlock
            title="Liquide amniotique méconial"
            items={[
              "Pas d’aspiration systématique.",
              "Intubation uniquement si obstruction évidente empêchant la ventilation.",
            ]}
          />
          <FlowBlock
            title="Voies aériennes difficiles"
            items={[
              "Dispositif supraglottique taille 1 possible.",
              "Appel précoce anesthésiste / réanimateur.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation / fin de réanimation"
            subtitle="Hospitalisation néonatalogie / réanimation"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Hospitalisation systématique si"
            items={[
              "Toute VPP administrée, FC < 100 persistante.",
              "Suspicion infection néonatale, prématurité < 35 SA.",
              "Utilisation de médicaments, hypothermie < 36 °C, détresse respiratoire persistante.",
              "Anomalie du tonus, convulsions, score Apgar ≤ 7 à 5 min.",
            ]}
          />
          <FlowBlock
            title="Fin de réanimation"
            items={[
              "Arrêt possible si absence de FC après au moins 10–20 min de manœuvres complètes et efficaces.",
              "Décision toujours collégiale.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
