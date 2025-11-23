"use client";

import { useEffect } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { useAppStore } from "@/store/useAppStore";
import { formatMg } from "@/lib/units";

const MIN_W = 3;
const MAX_W = 80;
const DEFAULT_W = 15;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const formatMl = (value: number, digits = 1) => `${value.toFixed(digits)} mL`;

export default function ProtocolFlowKawasakiChoc() {
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
  const ivigDose = weightKg * 2; // g
  const aasHighLow = weightKg * 30;
  const aasHighHigh = weightKg * 50;
  const aasLowLow = weightKg * 3;
  const aasLowHigh = weightKg * 5;
  const methylpred = weightKg * 2;
  const methylpredPulse = weightKg * 30;
  const norepiLow = weightKg * 0.05;
  const norepiHigh = weightKg * 0.5;
  const epiLow = weightKg * 0.05;
  const epiHigh = weightKg * 0.3;
  const dobutamineLow = weightKg * 5;
  const dobutamineHigh = weightKg * 10;
  const milrinoneLow = weightKg * 0.25;
  const milrinoneHigh = weightKg * 0.75;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-rose-700 via-amber-600 to-amber-500 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Vascularite fébrile</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Kawasaki aigu &amp; choc associé (KDSS)
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Détecter KDSS, lancer IVIG + AAS, gérer le choc inflammatoire (remplissage modéré + catécholamines), prévenir coronarites/myocardite.
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
            subtitle="Fièvre > 5 j + critères SK ; rechercher choc"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={["VAS libres, anticiper intubation si GCS bas."]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "O₂ titré 94–98 %, VNI/ventilation si détresse respi ou myocardite sévère.",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={[
                "TA, FC, TRC, extrémités, ECG/monitorage. Accès IV/IO ×2.",
                "Prélèvements : NFS, CRP/VS, fibrino, iono, lactates, BNP/NT-proBNP, troponines, hémocs, bilan immuno.",
              ]}
            />
            <FlowBlock
              title="D - Disability"
              items={["AVPU/GCS, convulsions, lactates."]}
            />
            <FlowBlock
              title="E - Exposure"
              items={[
                "Critères SK : conjonctivite bilatérale, éruption, langue framboisée, adénopathie cervicale, érythème/œdème extrémités.",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes de choc KDSS"
            subtitle="Hypotension, perfusion altérée, lactates > 2"
            gradient="from-indigo-500 via-blue-500 to-cyan-500"
          />
          <FlowBlock
            title="Critères"
            items={[
              "TRC > 3 s, marbrures, extrémités froides, tachycardie, pouls filants.",
              "Hypotension (selon âge), altération conscience, oligurie, lactates > 2.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates KDSS"
            subtitle="O₂, remplissage modéré, échographie cardiaque urgente"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Remplissage prudent"
            items={[
              <>
                NaCl 0,9 % 10 mL/kg sur 10–20 min → <strong>{formatMl(bolus10)}</strong>; répéter 1 fois si hypovolémie évidente.
              </>,
              "Surveiller œdème pulmonaire / FEVG à l'écho (myocardite fréquente).",
            ]}
          />
          <FlowBlock
            title="Vasoactifs (profil)"
            items={[
              <>
                Vasoplégie : Noradrénaline 0,05–0,5 µg/kg/min → <strong>{formatMg(norepiLow)}</strong> -{" "}
                <strong>{formatMg(norepiHigh)}</strong> µg/min.
              </>,
              <>
                Cardiogénique/myocardite : Dobutamine 5–10 µg/kg/min → <strong>{formatMg(dobutamineLow)}</strong> -{" "}
                <strong>{formatMg(dobutamineHigh)}</strong> µg/min ou Epinéphrine 0,05–0,3 µg/kg/min →{" "}
                <strong>{formatMg(epiLow)}</strong> - <strong>{formatMg(epiHigh)}</strong> µg/min.
              </>,
              <>
                Milrinone 0,25–0,75 µg/kg/min (si PAS OK) → <strong>{formatMg(milrinoneLow)}</strong> -{" "}
                <strong>{formatMg(milrinoneHigh)}</strong> µg/min.
              </>,
            ]}
          />
          <FlowBlock
            title="Échographie cardiaque"
            items={[
              "Urgente chez tout KDSS ; rechercher FEVG basse, coronaires, épanchement.",
              "Répéter J1–2, J7, J14, J30 selon cardio.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitement étiologique"
            subtitle="IVIG + AAS"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="IVIG"
            items={[
              <>
                Dose unique 2 g/kg sur 10–12 h → <strong>{formatMg(ivigDose)}</strong> g.
              </>,
            ]}
          />
          <FlowBlock
            title="Aspirine (AAS)"
            items={[
              <>
                Phase aiguë : 30–50 mg/kg/j en 4–6 prises → <strong>{formatMg(aasHighLow)}</strong> -{" "}
                <strong>{formatMg(aasHighHigh)}</strong> par jour.
              </>,
              <>
                Après apyrexie 48–72 h → dose anti-agrégante 3–5 mg/kg/j →{" "}
                <strong>{formatMg(aasLowLow)}</strong> - <strong>{formatMg(aasLowHigh)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Corticothérapie (formes sévères / choc)"
            items={[
              <>
                Méthylpred 2 mg/kg/j IV → <strong>{formatMg(methylpred)}</strong>.
              </>,
              <>
                Pulses possibles 30 mg/kg/j × 1–3 j → <strong>{formatMg(methylpredPulse)}</strong> (avis sénior).
              </>,
            ]}
          />
          <FlowBlock
            title="Anticoagulation"
            items={[
              "Si coronaires Z-score ≥ 10 : héparine/HBPM selon cardio pédiatrique.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitements non recommandés"
            subtitle="Points de vigilance"
            gradient="from-slate-700 via-slate-800 to-black"
          />
          <FlowBlock
            title="À éviter"
            items={[
              "Corticoïdes seuls sans IVIG.",
              "Sur-remplissage (risque œdème pulmonaire si myocardite).",
              "AAS anti-agrégant seul en phase aiguë (inefficace sur inflammation).",
              "Absence d’écho cardiaque précoce.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Nourrisson, myocardite, COVID/PIMS"
            gradient="from-sky-500 via-blue-600 to-slate-700"
          />
          <FlowBlock
            title="Nourrisson &lt; 1 an"
            items={[
              "Risque coronarites ++ ; IVIG précoce même formes incomplètes ; doses en g/kg inchangées.",
            ]}
          />
          <FlowBlock
            title="Myocardite sévère"
            items={[
              "Pas de remplissage agressif ; catécholamines cardiosélectives (épinéphrine/dobutamine).",
              "Milrinone contre-indiquée si PAS basse.",
            ]}
          />
          <FlowBlock
            title="Formes COVID / PIMS"
            items={[
              "Immunomodulation renforcée (cortico systématique, 2ᵉ IVIG possible), anticoagulation fréquente.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation systématique"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Tous SK ; réanimation si choc, myocardite, besoin vasoactifs.",
              "Indications : hypotension/choc, troubles conscience, FEVG basse, besoin O₂/ventilation, coronaires dilatées, CRP > 100, lactates > 2.",
            ]}
          />
          <FlowBlock
            title="Critères de transfert hors réa"
            items={[
              "Stabilité hémodynamique sans vasopresseurs, perfusion correcte, diurèse normale, inflammation en décroissance, apyrexie > 48 h.",
              "AAS anti-agrégante relayée, écho rassurante/stable, suivi cardio programmé (J7, J14, J30, 6 mois).",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
