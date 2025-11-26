"use client";

import { useEffect } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 5;
const MAX_W = 25;
const DEFAULT_W = 10;

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

export default function ProtocolFlowInvagination() {
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
  const morphineInitLow = weightKg * 0.05;
  const morphineInitHigh = weightKg * 0.1;
  const morphineBolusLow = weightKg * 0.025;
  const morphineBolusHigh = weightKg * 0.05;

  const cefotaximeLow = weightKg * 100;
  const cefotaximeHigh = weightKg * 150;
  const metronidazoleLow = weightKg * 20;
  const metronidazoleHigh = weightKg * 30;

  const bolus10 = weightKg * 10;
  const bolus20 = weightKg * 20;

  const maintenance = calcMaintenance(weightKg);
  const exampleMaint = maintenance; // example already from weight

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-emerald-900 to-teal-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Digestif · Urgence</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">Invagination intestinale aiguë (IIA)</h1>
        <p className="text-sm text-white/85 mt-1">
          Diagnostiquer tôt, évaluer la gravité, choisir lavement thérapeutique ou chirurgie, réanimer et surveiller sans délai.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
        <p className="mt-3 text-[13px] text-white/80">Version 2025 – HAS, SFP, SFCP, SFR, NICE, AAP.</p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale"
            subtitle="Signes typiques et gravité"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="Signes typiques"
            items={[
              "Accès paroxystiques de pleurs avec jambes fléchies, vomissements (bilieux si grave).",
              "Pâleur/léthargie, rectorragies « gelée de groseille » (tardif), masse abdominale FID/hypochondre droit.",
              "Douleur intermittente puis continue.",
            ]}
          />
          <FlowBlock
            title="Signes de gravité (chirurgie immédiate)"
            items={[
              "Choc (TRC > 3 s, marbrures, tachycardie), vomissements bilieux.",
              "Défense/douleur continue, rectorragies profuses.",
              "Suspicion perforation : fièvre, péritonisme ; trouble conscience, sepsis.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates"
            subtitle="Oxygène, VVP, antalgie"
            gradient="from-sky-500 via-cyan-500 to-blue-600"
          />
          <FlowBlock
            title="Oxygène"
            items={["SpO₂ 94–98 % ; lunettes 1–2 L/min ou masque 5–10 L/min si instabilité."]}
          />
          <FlowBlock
            title="VVP / perfusion"
            items={[
              `Entretien 4-2-1 : ~${formatMlPerHour(exampleMaint)}.`,
              <>
                Si choc : NaCl 0,9 % 10–20 mL/kg en 10–20 min → <strong>{formatMl(bolus10)}</strong> à <strong>{formatMl(bolus20)}</strong>, réévaluer.
              </>,
            ]}
          />
          <FlowBlock
            title="Antalgie"
            items={[
              <>Paracétamol 15 mg/kg/prise → <strong>{formatMg(paracetamol)}</strong> (max 60 mg/kg/j).</>,
              <>
                Morphine IV 0,05–0,1 mg/kg → <strong>{formatMg(morphineInitLow)}</strong> à <strong>{formatMg(morphineInitHigh)}</strong>; bolus 0,025–0,05 mg/kg q10 min →{" "}
                <strong>{formatMg(morphineBolusLow)}</strong> à <strong>{formatMg(morphineBolusHigh)}</strong>.
              </>,
              "AINS non recommandés (ischémie + chirurgie possible).",
            ]}
          />
          <FlowBlock title="Aspiration gastrique" items={["Sonde si vomissements répétés."]} />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens"
            subtitle="Imagerie et biologie"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Échographie (référence)"
            items={["Aspect en cocarde/pseudorein, longueur du boudin, Doppler (souffrance), épanchement."]}
          />
          <FlowBlock
            title="Radiographie"
            items={["Indications : pneumopéritoine suspect, occlusion sévère."]}
          />
          <FlowBlock title="Biologie" items={["NFS, CRP, ionogramme, groupe + RAI, lactate si choc."]} />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Conduite thérapeutique"
            subtitle="Selon gravité"
            gradient="from-purple-500 via-fuchsia-500 to-rose-500"
          />
          <FlowBlock
            title="IIA non compliquée"
            items={[
              "Lavement thérapeutique radioguidé (air/CO₂) en 1er choix ; surveillance cardio-respiratoire.",
              "Contre-indications : signes de gravité, perforation, choc non stabilisé → chirurgie.",
            ]}
          />
          <FlowBlock
            title="IIA compliquée"
            items={[
              "Perforation, choc, péritonite, occlusion complète, échec lavement, récidive immédiate → chirurgie urgente (réduction manuelle, résection segment nécrosé, traiter cause).",
            ]}
          />
          <FlowBlock
            title="Antibiothérapie"
            items={[
              "Non systématique si IIA simple.",
              <>
                Formes compliquées : Cefotaxime 100–150 mg/kg/j → <strong>{formatMg(cefotaximeLow)}</strong> – <strong>{formatMg(cefotaximeHigh)}</strong> / jour en 3–4 doses + Métronidazole 20–30 mg/kg/j →{" "}
                <strong>{formatMg(metronidazoleLow)}</strong> – <strong>{formatMg(metronidazoleHigh)}</strong> / jour.
              </>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter la stratégie"
            gradient="from-slate-500 via-slate-600 to-slate-700"
          />
          <FlowBlock
            title="< 3 mois"
            items={["Formes souvent sévères : lavement possible mais chirurgie fréquente."]}
          />
          <FlowBlock
            title="Pathologie sous-jacente"
            items={["Diverticule de Meckel, polype, invagination secondaire → chirurgie plus fréquente."]}
          />
          <FlowBlock
            title="Récidive"
            items={["Précoce (< 48 h) : lavement possible ; tardive : imagerie + discussion chirurgie."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation systématique"
            gradient="from-amber-600 via-orange-600 to-rose-600"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Toute IIA (simple ou compliquée) : surveillance 12–24 h post-lavement minimum.",
              "Réanimation/soins intensifs si choc, déshydratation sévère, comorbidités, IIA compliquée ou échec lavement.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Réduction confirmée, pas de douleur, transit repris, alimentation tolérée, absence vomissements.",
              "Surveillance 12–24 h post-lavement, examen normal, absence récidive.",
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
            items={["SpO₂ 94–98 %, lunettes 1–2 L/min, masque 5–10 L/min."]}
          />
          <FlowBlock
            title="Antalgiques"
            items={[
              <>Paracétamol 15 mg/kg → <strong>{formatMg(paracetamol)}</strong>.</>,
              <>
                Morphine IV 0,05–0,1 mg/kg → <strong>{formatMg(morphineInitLow)}</strong> à <strong>{formatMg(morphineInitHigh)}</strong>; bolus 0,025–0,05 mg/kg →{" "}
                <strong>{formatMg(morphineBolusLow)}</strong> à <strong>{formatMg(morphineBolusHigh)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Perfusion / remplissage"
            items={[
              `Entretien 4-2-1 ≈ ${formatMlPerHour(exampleMaint)}.`,
              <>Remplissage NaCl 0,9 % 10–20 mL/kg → <strong>{formatMl(bolus10)}</strong> à <strong>{formatMl(bolus20)}</strong>.</>,
            ]}
          />
          <FlowBlock
            title="ATB (formes compliquées)"
            items={[
              <>
                Cefotaxime 100–150 mg/kg/j → <strong>{formatMg(cefotaximeLow)}</strong> – <strong>{formatMg(cefotaximeHigh)}</strong> / j.
              </>,
              <>
                Métronidazole 20–30 mg/kg/j → <strong>{formatMg(metronidazoleLow)}</strong> – <strong>{formatMg(metronidazoleHigh)}</strong> / j.
              </>,
            ]}
          />
        </div>
      </div>
    </div>
  );
}
