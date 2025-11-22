"use client";

import { useEffect, useMemo, useState } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 3;
const MAX_W = 80;
const clampW = (value: number) => Math.min(Math.max(value, MIN_W), MAX_W);

function formatMl(value: number) {
  return `${Number(value.toFixed(value >= 10 ? 0 : 1))} mL`;
}

function formatMlPerHour(value: number) {
  return `${Number(value.toFixed(value >= 100 ? 0 : 1))} mL/h`;
}

function formatPercent(value: number) {
  return `${Number(value.toFixed(1))} %`;
}

function maintenanceRate(weight: number) {
  if (weight <= 10) return weight * 4;
  if (weight <= 20) return 40 + (weight - 10) * 2;
  return 60 + (weight - 20) * 1;
}

export default function ProtocolFlowDeshydratation() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);

  const weightKg = clampW(
    typeof weightFromStore === "number" && !Number.isNaN(weightFromStore) ? weightFromStore : 10
  );

  useEffect(() => {
    if (!ageLabel) {
      const estimated = estimateAgeFromWeight(weightKg);
      if (estimated) setAgeLabel(estimated);
    }
  }, [ageLabel, setAgeLabel, weightKg]);

  const [percent, setPercent] = useState(10);

  const bolusVolume = weightKg * 20;
  const glucoseBolus = weightKg * 2;

  const deficitMl = useMemo(() => weightKg * percent * 10, [weightKg, percent]);
  const initialCorrection = deficitMl * 0.5;
  const rate4h = initialCorrection / 4;
  const remainingDeficit = Math.max(deficitMl - initialCorrection, 0);

  const maintRate = maintenanceRate(weightKg);
  const hourlyAfter4h = maintRate + remainingDeficit / 24;

  const ondansetronDose = Math.min(weightKg * 0.15, 8);

  return (
    <div className="w-full pb-6">
      <div className="rounded-3xl bg-gradient-to-b from-emerald-500 to-emerald-700 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Urgence hydro-électrolytique</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide">DÉSHYDRATATION AIGUË SÉVÈRE</h1>
        <p className="text-sm text-white/85">Nourrisson & enfant — gastro-entérite</p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampW(v ?? weightKg))}
          />
        </div>

        <p className="mt-3 text-sm text-white/85">
          Déshydratation menaçant le pronostic vital : prise en charge standardisée, calculs adaptés au
          poids de l&rsquo;enfant.
        </p>
      </div>

      <div className="mt-4 space-y-4">
        <FlowRibbon
          title="Évaluation initiale ABCDE"
          subtitle="TRC > 3 s, tachycardie, marbrures, altération conscience"
          gradient="from-emerald-400 via-teal-400 to-cyan-400"
        />
        <FlowBlock
          title="Signes de déshydratation sévère"
          subtitle="HAS + ESPGHAN"
          items={[
            "Léthargie/coma, refus ou incapacité à boire",
            "Marbrures, extrémités froides, TRC > 3 s",
            "Tachycardie sévère, hypotension (tardive)",
            "Pli cutané très lent, yeux très cernés",
            "Oligurie/anurie, perte pondérale > 10 %",
          ]}
        />

        <FlowChevron />

        <FlowRibbon
          title="Mesures immédiates"
          subtitle="O₂, VVP/IO, glycémie systématique"
          gradient="from-emerald-400 via-amber-400 to-orange-400"
        />
        <FlowBlock
          title="Stabilisation vitale"
          items={[
            "O₂ titré si SpO₂ < 94 % (10–15 L/min MHC si état de choc)",
            "Voie veineuse périphérique, intra-osseuse si échec",
            <span key="glycemie">
              Hypoglycémie &lt; 3 mmol/L → Glucose 10 % <strong>2 mL/kg</strong> :
              <strong> {formatMl(glucoseBolus)}</strong>
            </span>,
          ]}
        />

        <FlowChevron />

        <FlowRibbon
          title="Remplissage (choc/hypoperfusion)"
          subtitle="15–30 min"
          gradient="from-amber-400 via-orange-400 to-rose-400"
        />
        <FlowBlock
          title="Bolus initial"
          items={[
            <span key="bolus">
              NaCl 0,9 % ou Ringer Lactate <strong>20 mL/kg</strong> : <strong>{formatMl(bolusVolume)}</strong>
            </span>,
            "Répéter 1 fois si perfusion toujours mauvaise",
          ]}
        />

        <FlowChevron />

        <FlowRibbon
          title="Réhydratation IV (4 h)"
          subtitle="Correction 50 % du déficit"
          gradient="from-cyan-400 via-sky-400 to-blue-500"
        />
        <FlowBlock
          title="Calcul du déficit"
          subtitle="Déficit (mL) = Poids × % × 10"
          items={[
            <div key="selector" className="space-y-2">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                <span>Déshydratation estimée</span>
                <span>{formatPercent(percent)}</span>
              </div>
              <input
                type="range"
                min={5}
                max={12}
                step={0.5}
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <p className="text-xs text-slate-600">
                Ajuster selon l&rsquo;évaluation clinique (5–10 %, jusqu&rsquo;à 12 % si forme très sévère).
              </p>
            </div>,
            <div key="deficit" className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-800">
              <p>
                Déficit total ≈ <strong>{formatMl(deficitMl)}</strong>
              </p>
              <p className="mt-1 text-slate-700">Correction initiale 50 % sur 4 h :</p>
              <ul className="mt-1 list-disc pl-4 space-y-1">
                <li>
                  Volume 4 h : <strong>{formatMl(initialCorrection)}</strong> ({formatMlPerHour(rate4h)})
                </li>
                <li>Soluté : NaCl 0,9 % ou Ringer Lactate (jamais G5 % seul)</li>
              </ul>
            </div>,
          ]}
        />

        <FlowChevron />

        <FlowRibbon
          title="Maintien après 4 h"
          subtitle="Formule 4-2-1 + déficit restant"
          gradient="from-sky-400 via-blue-500 to-indigo-500"
        />
        <FlowBlock
          title="Besoins hydriques"
          items={[
            <span key="maint">
              Débit de base : <strong>{formatMlPerHour(maintRate)}</strong> (4-2-1)
            </span>,
            <span key="remaining">
              Déficit restant ≈ {formatMl(remainingDeficit)} → ajouter ~
              <strong> {formatMlPerHour(remainingDeficit / 24)}</strong>
            </span>,
            <span key="total">
              Débit horaire proposé après 4 h : <strong>{formatMlPerHour(hourlyAfter4h)}</strong>
            </span>,
            "Surveiller natrémie, kaliémie ; ajouter KCl 0,5–1 mEq/kg/j dès reprise diurèse",
          ]}
        />

        <FlowChevron />

        <FlowRibbon
          title="Traitements associés"
          subtitle="Pas de lopéramide"
          gradient="from-emerald-400 via-green-500 to-lime-500"
        />
        <FlowBlock
          title="Symptomatiques"
          items={[
            <span key="onda">
              Ondansétron ≥ 2 ans : <strong>{formatMg(ondansetronDose)}</strong> (0,15 mg/kg, max 8 mg) IV/PO
            </span>,
            "Probiotiques recommandés : Lactobacillus GG ou Saccharomyces boulardii",
            "Zinc < 5 ans : 10 mg/j (< 6 mois) ou 20 mg/j (> 6 mois) pendant 10–14 j",
            "Pas d’AINS en contexte de déshydratation ; antibiotiques seulement si suspicion bactérienne",
          ]}
        />
        <FlowBlock
          title="Surveillance et orientation"
          items={[
            "Surveillance rapprochée : TA, TRC, diurèse, neurologique, ionogramme si atypies",
            "Hospitalisation : déshydratation sévère, < 3 mois, vomissements incoercibles, troubles neuro, comorbidités",
            "Sortie si réhydratation clinique, diurèse reprise, tolérance orale et parents informés (contrôle < 24–48 h)",
          ]}
        />
      </div>
    </div>
  );
}
