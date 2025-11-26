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

export default function ProtocolFlowFractureOuverte() {
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
  const ibuprofen = weightKg * 10;

  const morphineInitLow = weightKg * 0.05;
  const morphineInitHigh = weightKg * 0.1;
  const morphineBolusLow = weightKg * 0.025;
  const morphineBolusHigh = weightKg * 0.05;

  const cefazolineDose = Math.min(weightKg * 30, 2000);
  const amikacineDose = weightKg * 15;
  const clindaDose = weightKg * 10;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-red-900 to-orange-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Traumatologie · Urgence</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">Fracture ouverte du membre - enfant</h1>
        <p className="text-sm text-white/85 mt-1">
          Stabiliser, prévenir infection et choc, antalgie efficace, transfert rapide en chirurgie orthopédique.
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
          Version 2025 – HAS, SOFOP, SFP, SOFCOT, NICE NG38.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale ABCDE"
            subtitle="Ne pas retarder l'antibiothérapie"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Points clés"
            items={[
              "A: VAS, risque inhalation sang/trauma facial ; O₂ titré SpO₂ 94–98 % (lunettes 1–4 L/min, masque 10–15 L/min si besoin).",
              "B: FR, tirage, auscultation ; rechercher trauma thoracique.",
              "C: Hémorragie active ? TRC, FC, PA ; VVP.",
              "D: GCS pédiatrique, pupilles.",
              "E: Retirer vêtements, rechercher lésions multiples, prévenir hypothermie.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes de gravité immédiate"
            subtitle="Appel chir ortho + anesth + réa pédiatrique"
            gradient="from-red-600 via-rose-600 to-orange-600"
          />
          <FlowBlock
            title="Critères"
            items={[
              "Hémorragie incontrôlable, ischémie distale (pouls absent, main/pied froid).",
              "Fracture ouverte Gustilo III ou polytraumatisme.",
              "Douleur incontrôlée, choc (TRC > 3 s, tachycardie, pâleur, marbrures).",
              "Suspicion syndrome de loges.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Antalgie (HAS douleur enfant)"
            subtitle="Progression par paliers"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Niveau 1"
            items={[<>Paracétamol 15 mg/kg/prise (max 60 mg/kg/j) → <strong>{formatMg(paracetamol)}</strong>.</>]}
          />
          <FlowBlock
            title="Niveau 2"
            items={[
              "Paracétamol +",
              <>Ibuprofène 10 mg/kg/prise (max 30 mg/kg/j) → <strong>{formatMg(ibuprofen)}</strong> si ≥ 3 mois et pas d’IRA/choc.</>,
            ]}
          />
          <FlowBlock
            title="Niveau 3 : douleur sévère"
            items={[
              <>
                Morphine IV 0,05–0,1 mg/kg → <strong>{formatMg(morphineInitLow)}</strong> à <strong>{formatMg(morphineInitHigh)}</strong>.
              </>,
              <>
                Bolus 0,025–0,05 mg/kg q10 min → <strong>{formatMg(morphineBolusLow)}</strong> à <strong>{formatMg(morphineBolusHigh)}</strong>.
              </>,
              "Non recommandé : codéine interdite, tramadol déconseillé, AINS si déshydratation/choc/geste chir prévu, pas de corticoïdes.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Antibiothérapie IV précoce"
            subtitle="Débuter < 1 h, ne pas retarder un transfert"
            gradient="from-sky-500 via-blue-500 to-indigo-600"
          />
          <FlowBlock
            title="Gustilo I–II"
            items={[
              <>
                Cefazoline 30 mg/kg IV q8h (max 2 g/dose) → <strong>{formatMg(cefazolineDose)}</strong> par dose.
              </>,
            ]}
          />
          <FlowBlock
            title="Gustilo III"
            items={[
              <>
                Cefazoline 30 mg/kg IV q8h + Amikacine 15 mg/kg/j → <strong>{formatMg(cefazolineDose)}</strong> et{" "}
                <strong>{formatMg(amikacineDose)}</strong>/j.
              </>,
            ]}
          />
          <FlowBlock
            title="Allergie β-lactamines"
            items={[
              <>
                Clindamycine 10 mg/kg IV q8h + Amikacine 15 mg/kg/j → <strong>{formatMg(clindaDose)}</strong> par dose et{" "}
                <strong>{formatMg(amikacineDose)}</strong>/j.
              </>,
            ]}
          />
          <FlowBlock title="Prévention tétanos" items={["Vérifier vaccination ; si doute : vaccin + immunoglobulines si plaie très contaminée."]} />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Gestion locale de la plaie"
            subtitle="Protection des tissus mous"
            gradient="from-amber-600 via-orange-600 to-yellow-500"
          />
          <FlowBlock
            title="À éviter"
            items={["Ne pas sonder la plaie, ne pas retirer corps étrangers profonds, ne pas explorer en préhospitalier."]}
          />
          <FlowBlock
            title="À faire"
            items={[
              "Irrigation abondante au NaCl 0,9 % ; retirer débris superficiels.",
              "Pansement stérile humide.",
              "Immobilisation avant mobilisation/transport.",
              "Alignement doux si déformation majeure.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Immobilisation"
            subtitle="Stabiliser en attendant le bloc"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Attelles"
            items={[
              "Adapter membre sup/inf ; immobiliser articulations au-dessus et en dessous.",
              "Tibia/péroné : attelle cruro-pédieuse ; avant-bras : attelle brachio-antébrachio-palmaire.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens"
            subtitle="Selon gravité et préparation au bloc"
            gradient="from-slate-500 via-slate-600 to-slate-700"
          />
          <FlowBlock
            title="Imagerie"
            items={["Radiographies standard 2 incidences, inclure articulation sus et sous-jacente."]}
          />
          <FlowBlock
            title="Biologie"
            items={["NFS, CRP, groupe + RAI, ionogramme/urée/Cr ; hémocultures si fièvre."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Conduite selon Gustilo"
            subtitle="Hospitalisation systématique"
            gradient="from-purple-500 via-fuchsia-500 to-rose-500"
          />
          <FlowBlock
            title="Gustilo I–II"
            items={[
              "ATB IV 24–48 h, lavage au bloc urgent (< 6 h idéal), débridement limité.",
              "Fixation interne/immobilisation selon fracture.",
            ]}
          />
          <FlowBlock
            title="Gustilo III"
            items={[
              "ATB large (cefazoline + amikacine), chirurgie urgente, débridement large.",
              "Surveillance syndrome de loges, hospitalisation en orthopédie pédiatrique / réanimation selon état.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter la prise en charge"
            gradient="from-indigo-500 via-blue-600 to-sky-600"
          />
          <FlowBlock
            title="Polytraumatisme"
            items={["Prise en charge ATLS pédiatrique complète ; priorité hémodynamique/ventilation."]}
          />
          <FlowBlock
            title="Nourrisson/prématuré"
            items={["Risque infectieux élevé : ATB systématique, admission pédiatrie/réanimation."]}
          />
          <FlowBlock
            title="Immunodéprimé"
            items={["Élargir spectre ATB (avis infectiologue)."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation obligatoire sauf exception"
            gradient="from-emerald-500 via-teal-600 to-cyan-700"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Toute fracture ouverte (même Gustilo I), besoin ATB IV/chirurgie, déformation majeure.",
              "Ischémie, déficit neuro, polytraumatisme, enfant < 3 ans, environnement social limité.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie (après chirurgie, 24–48 h)"
            items={[
              "Plaie propre/pansement adapté, apyrétique, antalgie orale suffisante.",
              "Pas de déficit neurovasculaire, radios de contrôle OK, RDV ortho + kiné, éducation parents signes infectieux.",
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
            items={["SpO₂ 94–98 %, 1–4 L/min lunettes ; 10–15 L/min masque si besoin."]}
          />
          <FlowBlock
            title="Antalgiques"
            items={[
              <>Paracétamol 15 mg/kg/prise → <strong>{formatMg(paracetamol)}</strong>.</>,
              <>Ibuprofène 10 mg/kg/prise → <strong>{formatMg(ibuprofen)}</strong> (max 30 mg/kg/j, CI déshydratation/choc/chir majeure imminente).</>,
              <>
                Morphine IV 0,05–0,1 mg/kg → <strong>{formatMg(morphineInitLow)}</strong> à <strong>{formatMg(morphineInitHigh)}</strong>; bolus 0,025–0,05 mg/kg →{" "}
                <strong>{formatMg(morphineBolusLow)}</strong> à <strong>{formatMg(morphineBolusHigh)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Antibiotiques"
            items={[
              <>
                Cefazoline 30 mg/kg/dose (max 2 g) → <strong>{formatMg(cefazolineDose)}</strong> q8h.
              </>,
              <>
                Amikacine 15 mg/kg/j → <strong>{formatMg(amikacineDose)}</strong> / jour.
              </>,
              <>
                Clindamycine 10 mg/kg q8h → <strong>{formatMg(clindaDose)}</strong> / dose.
              </>,
            ]}
          />
        </div>
      </div>
    </div>
  );
}
