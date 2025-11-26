"use client";

import { useEffect } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 5;
const MAX_W = 120;
const DEFAULT_W = 30;

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

export default function ProtocolFlowAppendicite() {
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

  const maintenance = calcMaintenance(weightKg);
  const hydration1x = maintenance;
  const hydrationExample = weightKg ? (weightKg >= 30 ? 80 : maintenance) : maintenance; // 30 kg example = 80 mL/h

  const cefazoline = Math.min(weightKg * 30, 2000);
  const metronidazoleProphy = weightKg * 15;

  const cefotaximeDay = weightKg * 150;
  const metronidazoleLow = weightKg * 20;
  const metronidazoleHigh = weightKg * 30;
  const amoxclavLow = weightKg * 80;
  const amoxclavHigh = weightKg * 100;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-orange-900 to-amber-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Abdominal · Chirurgie</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">Appendicite aiguë – enfant</h1>
        <p className="text-sm text-white/85 mt-1">
          Identifier simple vs compliquée, antalgie et hydratation sécurisées, imagerie adaptée, antibiothérapie selon statut, parcours chirurgical.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
        <p className="mt-3 text-[13px] text-white/80">Version 2025 – HAS, SFP, SFCP, NICE NG157, AAP.</p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale"
            subtitle="Score clinique + gravité"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Signes cliniques"
            items={["Douleur FID (migration péri-ombilicale → FID), inappétence, fièvre, vomissements tardifs, défense locale, marche antalgique."]}
          />
          <FlowBlock title="Scores" items={["PAS / Alvarado / AIR : outils d’aide, non diagnostiques."]} />
          <FlowBlock
            title="Signes de gravité (appendicite compliquée probable)"
            items={[
              "Fièvre > 38,5 °C persistante, défense généralisée/contracture.",
              "Masse douloureuse FID, tachycardie/sepsis, déshydratation sévère.",
              "Douleur abdominale + diarrhée → penser perforation.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates"
            subtitle="Stabiliser et soulager"
            gradient="from-sky-500 via-cyan-500 to-blue-600"
          />
          <FlowBlock
            title="Oxygène"
            items={["Objectif SpO₂ 94–98 % ; masque 5–10 L/min si sepsis/détresse."]}
          />
          <FlowBlock title="Voie veineuse" items={["VVP pour bilan, hydratation, antibiothérapie si besoin."]} />
          <FlowBlock
            title="Antalgie"
            items={[
              <>Paracétamol 15 mg/kg → <strong>{formatMg(paracetamol)}</strong> (max 60 mg/kg/j).</>,
              <>Ibuprofène 10 mg/kg → <strong>{formatMg(ibuprofen)}</strong> (max 30 mg/kg/j) si hydratation correcte, pas d’IRA.</>,
              <>
                Morphine IV 0,05–0,1 mg/kg → <strong>{formatMg(morphineInitLow)}</strong> à <strong>{formatMg(morphineInitHigh)}</strong>; bolus 0,025–0,05 mg/kg q10 min →{" "}
                <strong>{formatMg(morphineBolusLow)}</strong> à <strong>{formatMg(morphineBolusHigh)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Hydratation"
            items={[
              `Entretien 4-2-1 : ${formatMlPerHour(hydration1x)} (ex 30 kg ≈ ${formatMlPerHour(hydrationExample)}).`,
              "Ne pas surhydrater si péritonite : viser 1× entretien.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon title="Examens" subtitle="Biologie + imagerie" gradient="from-emerald-500 via-teal-500 to-cyan-500" />
          <FlowBlock
            title="Biologie"
            items={["NFS, CRP, ionogramme, β-hCG si adolescente, hémocultures si sepsis."]}
          />
          <FlowBlock
            title="Imagerie"
            items={[
              "Échographie abdominale en 1ère intention (appendice > 6 mm, stercolithe, infiltrat graisseux, abcès).",
              "Scanner basse dose seulement si écho non concluante et tableau atypique.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Classification et conduite"
            subtitle="Simple vs compliquée"
            gradient="from-purple-500 via-fuchsia-500 to-rose-500"
          />
          <FlowBlock
            title="Appendicite simple"
            items={[
              "Non perforée, sans abcès/péritonite.",
              "Appendicectomie programmée < 24 h.",
              "Antibioprophylaxie IV mono-dose au bloc.",
            ]}
          />
          <FlowBlock
            title="Appendicite compliquée"
            items={[
              "Perforée, abcès/plastron, péritonite.",
              "ATB IV immédiate, chirurgie urgente (ou drainage + chirurgie différée si plastron/abcès).",
              "Réanimation si sepsis.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Antibiothérapie"
            subtitle="Selon statut"
            gradient="from-sky-500 via-indigo-500 to-blue-700"
          />
          <FlowBlock
            title="Prophylaxie (appendicite simple)"
            items={[
              <>
                Cefazoline 30 mg/kg IV (max 2 g) → <strong>{formatMg(cefazoline)}</strong> + Métronidazole 15 mg/kg IV → <strong>{formatMg(metronidazoleProphy)}</strong> en mono-dose.
              </>,
              "Pas d’ATB postopératoire si simple confirmée.",
            ]}
          />
          <FlowBlock
            title="Appendicite compliquée"
            items={[
              <>
                Cefotaxime 150 mg/kg/j (3–4 doses) → <strong>{formatMg(cefotaximeDay)}</strong> / jour.
              </>,
              <>
                Métronidazole 20–30 mg/kg/j (2–3 doses) → <strong>{formatMg(metronidazoleLow)}</strong> – <strong>{formatMg(metronidazoleHigh)}</strong> / jour.
              </>,
              <>
                Alternative : Amox-Clav 80–100 mg/kg/j (3–4 doses) → <strong>{formatMg(amoxclavLow)}</strong> – <strong>{formatMg(amoxclavHigh)}</strong> / jour.
              </>,
              "Allergie β-lactamines : Ciprofloxacine 20–30 mg/kg/j + Métronidazole 20–30 mg/kg/j (non calculé automatiquement).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Post-opératoire"
            subtitle="Surveillance et durées"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Simple"
            items={["Douleur contrôlée, apyrexie, tolérance orale, déambulation, pas d’ATB postopératoire."]}
          />
          <FlowBlock
            title="Compliquée"
            items={[
              "ATB IV 3–5 j puis relais PO selon évolution ; durée totale 5–7 j (SFCP).",
              "Surveiller douleur, transit, fièvre, CRP ; rechercher collection résiduelle.",
              "Relais PO possible à 48–72 h si apyrexie + alimentation reprise.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter la prise en charge"
            gradient="from-slate-500 via-slate-600 to-slate-700"
          />
          <FlowBlock
            title="Nourrisson < 3 ans"
            items={["Formes souvent compliquées, imagerie rapide, hospitalisation systématique."]}
          />
          <FlowBlock title="Adolescente" items={["β-hCG systématique."]} />
          <FlowBlock title="Immunodéprimé" items={["Risque complication +++, scanner précoce, ATB élargies."]} />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation obligatoire"
            gradient="from-amber-600 via-orange-600 to-rose-600"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Toute appendicite suspectée nécessitant imagerie, appendicite confirmée (simple ou compliquée).",
              "Douleur fébrile FID non expliquée, douleur sévère/vomissements incoercibles, déshydratation, appendicite compliquée.",
              "Contexte social défavorable.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Appendicite simple : apyrexie, alimentation reprise, douleur contrôlée par paracétamol ± ibuprofène, transit OK, parents fiables, RDV chirurgie J7–10.",
              "Appendicite compliquée : stabilisation clinique, CRP en baisse, tolérance orale + ATB PO si relais, pas de signe infectieux persistant.",
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
            items={["SpO₂ 94–98 %, masque 5–10 L/min si sepsis."]}
          />
          <FlowBlock
            title="Antalgiques"
            items={[
              <>Paracétamol 15 mg/kg → <strong>{formatMg(paracetamol)}</strong>.</>,
              <>Ibuprofène 10 mg/kg → <strong>{formatMg(ibuprofen)}</strong> (max 30 mg/kg/j).</>,
              <>
                Morphine IV 0,05–0,1 mg/kg → <strong>{formatMg(morphineInitLow)}</strong> à <strong>{formatMg(morphineInitHigh)}</strong>; bolus 0,025–0,05 mg/kg →{" "}
                <strong>{formatMg(morphineBolusLow)}</strong> à <strong>{formatMg(morphineBolusHigh)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Hydratation"
            items={[`Entretien 4-2-1 ≈ ${formatMlPerHour(hydration1x)} (ex 30 kg ≈ ${formatMlPerHour(hydrationExample)}), éviter surhydratation en péritonite.`]}
          />
          <FlowBlock
            title="ATB simple (prophylaxie)"
            items={[
              <>Cefazoline 30 mg/kg (≤ 2 g) → <strong>{formatMg(cefazoline)}</strong> + Métronidazole 15 mg/kg → <strong>{formatMg(metronidazoleProphy)}</strong> (mono-dose).</>,
            ]}
          />
          <FlowBlock
            title="ATB compliquée"
            items={[
              <>Cefotaxime 150 mg/kg/j → <strong>{formatMg(cefotaximeDay)}</strong> / j.</>,
              <>
                Métronidazole 20–30 mg/kg/j → <strong>{formatMg(metronidazoleLow)}</strong> – <strong>{formatMg(metronidazoleHigh)}</strong> / j.
              </>,
              <>Amox-Clav 80–100 mg/kg/j → <strong>{formatMg(amoxclavLow)}</strong> – <strong>{formatMg(amoxclavHigh)}</strong> / j (alternative).</>,
            ]}
          />
        </div>
      </div>
    </div>
  );
}
