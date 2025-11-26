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

export default function ProtocolFlowEpiglottite() {
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

  const ceftriaxoneDay = Math.min(weightKg * 100, 2000);
  const cefotaximeDayLow = weightKg * 150;
  const cefotaximeDayHigh = weightKg * 200;
  const vancomycineDayLow = weightKg * 40;
  const vancomycineDayHigh = weightKg * 60;
  const amikacineDay = weightKg * 15;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-sky-900 to-blue-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Infectieux · ORL</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">Épiglottite aiguë pédiatrique</h1>
        <p className="text-sm text-white/85 mt-1">
          Prévenir l’obstruction aiguë des voies aériennes supérieures et sécuriser l’airway en milieu spécialisé.
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
          Version 2025 (AAP, NICE, SFP, URPA/SFMU) – ne pas coucher l’enfant, sécurisation en bloc ORL/anesthésie.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Signes d’alerte"
            subtitle="NE PAS coucher, NE PAS examiner la gorge"
            gradient="from-rose-500 via-red-500 to-orange-500"
          />
          <FlowBlock
            title="Tableau évocateur"
            items={[
              "Hyperthermie, hypersialorrhée, dysphagie.",
              "Position assise en tripode, voix étouffée « patate chaude », stridor inspiratoire.",
              "Angoisse, absence de toux (différentiel laryngite).",
              "Jamais séparer l’enfant du parent, ne pas utiliser d’abaisse-langue.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situation respiratoire ?"
            subtitle="Orienter le niveau de sécurisation"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Détresse sévère / épuisement"
            items={["Airway immédiat en bloc pédiatrique (ORL + anesthésie + réanimation)."]}
          />
          <FlowBlock
            title="Stridor mais stabilité hémodynamique"
            items={["O₂ humidifié, voie veineuse, ATB débutée, transfert protégé vers bloc ORL/anesthésie."]}
          />
          <FlowBlock
            title="Stabilité relative"
            items={["Transfert médicalisé vers centre avec plateau technique ORL/anesthésie."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates"
            subtitle="Objectif SpO₂ 94–98 %"
            gradient="from-sky-500 via-cyan-500 to-blue-600"
          />
          <FlowBlock
            title="Sécurité"
            items={[
              "Laisser l’enfant assis, parent présent ; éviter tout stress ou pleurs.",
              "Ne jamais forcer un examen ORL.",
            ]}
          />
          <FlowBlock
            title="Oxygénothérapie"
            items={["O₂ humidifié au masque ou en blow-by selon tolérance (5–10 L/min)."]}
          />
          <FlowBlock
            title="Surveillance"
            items={[
              "FC, FR, SpO₂, conscience ; rechercher lutte (battement des ailes du nez, tirage, geignement).",
              "Rechercher épuisement : bradypnée, baisse du stridor, altération conscience.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Ne jamais faire"
            subtitle="Recommandations officielles"
            gradient="from-slate-500 via-slate-600 to-slate-700"
          />
          <FlowBlock
            title="Éviter"
            items={[
              "Pas d’examen pharyngé avec abaisse-langue.",
              "Pas de coucher l’enfant.",
              "Pas de sédation en pré-hospitalier.",
              "Pas de prise orale (risque fausse route).",
              "Pas de corticoïdes systématiques (pas de bénéfice démontré).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Antibiothérapie IV (dès suspicion forte)"
            subtitle="Plafonds et calculs automatiques"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Ceftriaxone"
            items={[
              <>
                100 mg/kg/j en 1 injection (max 2 g/j) → <strong>{formatMg(ceftriaxoneDay)}</strong> / jour.
              </>,
            ]}
          />
          <FlowBlock
            title="Alternative β-lactamines (allergie)"
            items={[
              <>
                Cefotaxime 150–200 mg/kg/j en 3–4 injections →{" "}
                <strong>
                  {formatMg(cefotaximeDayLow)} – {formatMg(cefotaximeDayHigh)}
                </strong>{" "}
                / jour.
              </>,
              <>
                Vancomycine 40–60 mg/kg/j en 3–4 injections →{" "}
                <strong>
                  {formatMg(vancomycineDayLow)} – {formatMg(vancomycineDayHigh)}
                </strong>{" "}
                / jour (cible résiduelle 15–20 mg/L).
              </>,
            ]}
          />
          <FlowBlock
            title="Si choc sévère associé"
            items={[
              <>Ajouter Amikacine 15 mg/kg/j → <strong>{formatMg(amikacineDay)}</strong> / jour.</>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Sécurisation des voies aériennes"
            subtitle="Bloc ORL/anesthésie"
            gradient="from-indigo-500 via-blue-500 to-sky-500"
          />
          <FlowBlock
            title="Indications d’intubation"
            items={[
              "Signes d’épuisement, hypoxémie persistante malgré O₂, baisse du stridor.",
              "Troubles de conscience, arrêt respiratoire imminent, âge < 2 ans avec tableau sévère.",
            ]}
          />
          <FlowBlock
            title="Technique (spécialiste)"
            items={[
              "Prémédication minimaliste, laryngoscopie douce.",
              "Tube orotrachéal : 3,5 mm (1–2 ans), 4,0 mm (2–4 ans), 4,5 mm (4–6 ans).",
              "Ne jamais multiplier les tentatives : envisager masque laryngé ou fibroscopie.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens complémentaires"
            subtitle="Après sécurisation des VAS"
            gradient="from-teal-500 via-emerald-500 to-green-500"
          />
          <FlowBlock
            title="À réaliser"
            items={[
              "Radiographie profil cou non systématique.",
              "Bilan sanguin (NFS, CRP, hémocultures).",
              "Hémoculture avant ATB si possible mais ne retarde pas l’ATB.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter l’anticipation"
            gradient="from-purple-500 via-fuchsia-500 to-rose-500"
          />
          <FlowBlock
            title="Vaccination Hib incomplète"
            items={["Évolution plus rapide, risque de choc septique → ATB IV impérative, surveillance réanimation."]}
          />
          <FlowBlock
            title="Comorbidités ORL / neuromusculaires"
            items={["Anticiper intubation difficile, appel ORL/anesthésiste précoce."]}
          />
          <FlowBlock
            title="Déshydratation ou IV impossible"
            items={["Recours intra-osseux si accès IV difficile."]}
          />
          <FlowBlock
            title="Suspicion choc septique associé"
            items={[
              <>Remplissage NaCl 0,9 % 10 mL/kg (répéter une fois si besoin) → <strong>{formatMl(naClBolus)}</strong>.</>,
              "Oxygène titré, antibiotique large : Cefotaxime + Vancomycine (ajouter Amikacine 15 mg/kg/j si choc sévère).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation et hospitalisation"
            subtitle="Toujours milieu pédiatrique spécialisé"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Hospitalisation (toujours oui)"
            items={[
              "Toute suspicion d’épiglottite, toute oxygénothérapie ou antibiothérapie IV.",
              "Toute instabilité respiratoire/hémodynamique, âge < 5 ans, vaccination Hib incomplète.",
              "Orientation réanimation pédiatrique si détresse respiratoire.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Absence de stridor au repos, déglutition et alimentation reprises, apyrétique.",
              "Relais oral validé, avis ORL confirmant absence de risque résiduel.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Résumé thérapeutique"
            subtitle="Calculs automatiques selon poids"
            gradient="from-slate-900 via-gray-800 to-slate-700"
          />
          <FlowBlock
            title="Oxygène"
            items={["Objectif SpO₂ 94–98 %, débit 5–10 L/min (humidifié, blow-by ou masque doux)."]}
          />
          <FlowBlock
            title="Antibiotiques"
            items={[
              <>Ceftriaxone 100 mg/kg/j (≤ 2 g/j) → <strong>{formatMg(ceftriaxoneDay)}</strong> / jour.</>,
              <>
                Cefotaxime 150–200 mg/kg/j →{" "}
                <strong>
                  {formatMg(cefotaximeDayLow)} – {formatMg(cefotaximeDayHigh)}
                </strong>{" "}
                / jour.
              </>,
              <>
                Vancomycine 40–60 mg/kg/j →{" "}
                <strong>
                  {formatMg(vancomycineDayLow)} – {formatMg(vancomycineDayHigh)}
                </strong>{" "}
                / jour.
              </>,
              <>Amikacine 15 mg/kg/j (si choc) → <strong>{formatMg(amikacineDay)}</strong> / jour.</>,
            ]}
          />
          <FlowBlock
            title="Remplissage"
            items={[<>NaCl 0,9 % 10 mL/kg IV sur 10–20 min → <strong>{formatMl(naClBolus)}</strong>.</>]}
          />
        </div>
      </div>
    </div>
  );
}
