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

const formatMlPerHour = (value: number | null) => {
  if (!Number.isFinite(value ?? NaN)) return "-";
  return `${formatMl(value as number)}/h`;
};

const formatG = (value: number) => `${Number(value.toFixed(value >= 10 ? 0 : 1))} g`;

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

export default function ProtocolFlowComa() {
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
  const glucoseBolus = weightKg * 2; // mL of G10%

  const midazolamIv = weightKg * 0.1;
  const midazolamInBuccal = weightKg * 0.2;
  const levetiracetamLow = weightKg * 20;
  const levetiracetamHigh = weightKg * 40;
  const phenytoin = weightKg * 20;
  const naloxone = weightKg * 0.01;

  const nacl3Low = weightKg * 3;
  const nacl3High = weightKg * 5;
  const mannitolLowG = weightKg * 0.5;
  const mannitolHighG = weightKg * 1;

  const maintenance = calcMaintenance(weightKg);

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-900 to-purple-800 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Neurologie · Urgence</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">Coma p�diatrique non traumatique</h1>
        <p className="text-sm text-white/85 mt-1">
          Stabiliser ABCDE, traiter les causes r�versibles (hypoglyc�mie, convulsions, sepsis, intoxication), prot�ger l'enc�phale et organiser la r�animation.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>
        <p className="mt-3 text-[13px] text-white/80">Version 2025 � HAS, SFP, SRLF, ESPNIC, AAP, NICE.</p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="�valuation initiale (ABCDE)"
            subtitle="GCS, glyc�mie imm�diate"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <FlowBlock
            title="A / B"
            items={[
              "VAS libre, position neutre, aspiration douce si vomissements.",
              "Intubation si GCS = 8 ou d�tresse respiratoire (ISR conforme SRLF).",
              "O� SpO� 94�98 % : lunettes 1�4 L/min, masque 10�15 L/min si d�tresse ; FR, tirage, capno si ventil�.",
            ]}
          />
          <FlowBlock
            title="C"
            items={[
              "FC, PA, TRC, T� ; VVP imm�diate.",
              <>Si choc : NaCl 0,9 % 10�20 mL/kg en 10�20 min → <strong>{formatMl(bolus10)}</strong> � <strong>{formatMl(bolus20)}</strong>, r��valuation.</>,
            ]}
          />
          <FlowBlock
            title="D"
            items={[
              "GCS p�diatrique, pupilles, tonus, convulsions.",
              <>Glyc�mie capillaire : hypoglyc�mie &lt; 0,7 g/L → G10 % 2 mL/kg → <strong>{formatMl(glucoseBolus)}</strong>, puis perfusion glucose 5�8 mg/kg/min.</>,
            ]}
          />
          <FlowBlock
            title="E"
            items={["Recherche purpura, intoxication, morsure, temp�rature, glyc�mie r�p�t�e."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Signes de gravit�"
            subtitle="Indication r�animation imm�diate"
            gradient="from-red-600 via-rose-600 to-orange-600"
          />
          <FlowBlock
            title="Crit�res"
            items={[
              "GCS = 8, convulsions persistantes, choc/sepsis, bradypn�e ou pauses, hypotension, hypothermie &lt; 35 �C ou hyperthermie > 40 �C.",
              "Pupilles asym�triques/non r�actives, vomissements en jet, raideur m�ning�e s�v�re, suspicion m�ningite/purpura, troubles du rythme graves.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitements initiaux cibl�s"
            subtitle="Causes r�versibles"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Hypoglyc�mie"
            items={[<>G10 % 2 mL/kg IV → <strong>{formatMl(glucoseBolus)}</strong>, puis perfusion glucose 5�8 mg/kg/min.</>]}
          />
          <FlowBlock
            title="Convulsions"
            items={[
              <>Midazolam IV 0,1 mg/kg → <strong>{formatMg(midazolamIv)}</strong> (renouvelable 1 fois) ; buccal/IN 0,2 mg/kg → <strong>{formatMg(midazolamInBuccal)}</strong>.</>,
              <>
                Si persistance : L�v�tirac�tam 20�40 mg/kg IV → <strong>{formatMg(levetiracetamLow)}</strong> � <strong>{formatMg(levetiracetamHigh)}</strong> (10�20 min).
              </>,
              <>3e ligne : Ph�nyto�ne 20 mg/kg IV lent → <strong>{formatMg(phenytoin)}</strong>.</>,
            ]}
          />
          <FlowBlock
            title="Infection s�v�re / m�ningite"
            items={[
              "Cefotaxime 200 mg/kg/j IV (ou Ceftriaxone 80�100 mg/kg/j) � ajouter Amikacine 15 mg/kg/j si choc septique ; Vancomycine 40�60 mg/kg/j si m�ningite possible.",
            ]}
          />
          <FlowBlock
            title="HTIC suspect�e"
            items={[
              <>NaCl 3 % 3�5 mL/kg → <strong>{formatMl(nacl3Low)}</strong> � <strong>{formatMl(nacl3High)}</strong> en 10�20 min.</>,
              <>Ou Mannitol 20 % 0,5�1 g/kg → <strong>{formatG(mannitolLowG)}</strong> � <strong>{formatG(mannitolHighG)}</strong> en 20 min.</>,
              "T�te sur�lev�e 30�, PaCO� 35�45 mmHg, normothermie ; pas d'hyperventilation prolong�e.",
            ]}
          />
          <FlowBlock
            title="Intoxication suspect�e"
            items={[
              <>Opiac�s : Naloxone 0,01 mg/kg IV → <strong>{formatMg(naloxone)}</strong> (r�p�ter si besoin).</>,
              "Parac�tamil : N-ac�tylcyst�ine selon protocole local.",
              "BZD : Flumaz�nil non recommand� en routine (risque convulsions).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Examens compl�mentaires"
            subtitle="Apr�s stabilisation"
            gradient="from-slate-500 via-slate-600 to-slate-700"
          />
          <FlowBlock
            title="Biologie urgente"
            items={["NFS, CRP, ionogramme, calc�mie, beta-HCG, h�mocultures si infection, GDS, ECG, toxiques sang/urines si suspicion."]}
          />
          <FlowBlock
            title="Imagerie"
            items={[
              "Scanner c�r�bral si signes focaux, HTIC, coma inexpliqu�, crise prolong�e, pupilles anormales.",
              "IRM en diff�r� pour �tiologie (enc�phalite, AVC, ADEM, etc.).",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particuli�res"
            subtitle="Adapter la prise en charge"
            gradient="from-indigo-500 via-blue-500 to-sky-500"
          />
          <FlowBlock title="Nourrisson < 2 mois" items={["Suspicion m�ningite/infection s�v�re � ATB syst�matiques."]} />
          <FlowBlock
            title="Status epilepticus"
            items={["S�quence AAP : Midazolam → L�v�tirac�tam → Ph�nyto�ne → anesth�sie (k�tamine selon protocole)."]}
          />
          <FlowBlock
            title="Trouble m�tabolique"
            items={["Ammoni�mie, lactates, correction m�tabolique sp�cialis�e."]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation r�animation"
            gradient="from-amber-600 via-orange-600 to-rose-600"
          />
          <FlowBlock
            title="Hospitalisation"
            items={[
              "Toute alt�ration de conscience � hospitalisation. R�animation p�diatrique si GCS = 12, infection grave, HTIC, convulsions persistantes, d�faillance respi/h�mo, hyperthermie majeure, intoxication s�v�re.",
            ]}
          />
          <FlowBlock
            title="Crit�res de sortie"
            items={[
              "Cause identifi�e et r�solue, examen neuro normal, pas de convulsion > 24 h, glyc�mie stable, parents fiables, avis p�diatrique, bilan/imagerie rassurants, suivi programm�.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="R�sum� posologique"
            subtitle="Calculs automatiques selon poids"
            gradient="from-slate-900 via-gray-800 to-slate-700"
          />
          <FlowBlock
            title="Oxyg�ne"
            items={["SpO� 94�98 %, 1�4 L/min lunettes ou 10�15 L/min masque selon gravit�."]}
          />
          <FlowBlock
            title="Remplissage"
            items={[<>NaCl 0,9 % 10�20 mL/kg → <strong>{formatMl(bolus10)}</strong> � <strong>{formatMl(bolus20)}</strong>.</>]}
          />
          <FlowBlock
            title="Glucose"
            items={[<>G10 % 2 mL/kg → <strong>{formatMl(glucoseBolus)}</strong> ; perfusion 5�8 mg/kg/min ensuite.</>]}
          />
          <FlowBlock
            title="Convulsions"
            items={[
              <>Midazolam IV 0,1 mg/kg → <strong>{formatMg(midazolamIv)}</strong> (IN/BU 0,2 mg/kg → <strong>{formatMg(midazolamInBuccal)}</strong>).</>,
              <>
                L�v�tirac�tam 20�40 mg/kg → <strong>{formatMg(levetiracetamLow)}</strong> � <strong>{formatMg(levetiracetamHigh)}</strong>.
              </>,
              <>Ph�nyto�ne 20 mg/kg → <strong>{formatMg(phenytoin)}</strong>.</>,
            ]}
          />
          <FlowBlock
            title="Antidotes / HTIC"
            items={[
              <>Naloxone 0,01 mg/kg → <strong>{formatMg(naloxone)}</strong>.</>,
              <>NaCl 3 % 3�5 mL/kg → <strong>{formatMl(nacl3Low)}</strong> � <strong>{formatMl(nacl3High)}</strong>.</>,
              <>
                Mannitol 0,5�1 g/kg → <strong>{formatG(mannitolLowG)}</strong> � <strong>{formatG(mannitolHighG)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Entretien"
            items={[`Perfusion 4-2-1 ≈ ${formatMlPerHour(maintenance)} (ajuster selon besoin et risque d'oed�me c�r�bral).`]}
          />
        </div>
      </div>
    </div>
  );
}
