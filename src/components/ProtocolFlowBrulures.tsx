"use client";

import { useEffect, useMemo, useState } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 3;
const MAX_W = 120;
const DEFAULT_W = 20;
const MIN_SCB = 0;
const MAX_SCB = 80;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const clampScb = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return 0;
  return Math.min(Math.max(value as number, MIN_SCB), MAX_SCB);
};

const formatMl = (value: number) => `${value.toFixed(2)} mL`;
const formatMlPerHour = (value: number) => `${value.toFixed(2)} mL/h`;
const formatPercent = (value: number) => `${Number(value.toFixed(1))} %`;

export default function ProtocolFlowBrulures() {
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

  const [scb, setScb] = useState<number>(15);
  const scbPercent = clampScb(scb);

  const isInfant = useMemo(() => {
    const label = typeof ageLabel === "string" ? ageLabel.toLowerCase() : "";
    if (label.includes("mois") || label.includes("naissance") || label.includes("1 an")) return true;
    return weightKg < 10;
  }, [ageLabel, weightKg]);

  const initialHour1 = weightKg * 20;
  const initialHour2 = weightKg * 10;
  const parklandTotal = 4 * weightKg * scbPercent;
  const totalFirst8h = parklandTotal / 2;
  const totalNext16h = parklandTotal / 2;
  const infusedFirst2h = initialHour1 + initialHour2;
  const remainingFirst8h = Math.max(totalFirst8h - infusedFirst2h, 0);
  const remainingAfter2h = Math.max(parklandTotal - infusedFirst2h, 0);
  const first8hRate = remainingFirst8h / 6; // reste des 8 premières heures
  const next16hRate = totalNext16h / 16;

  const maintenanceRate = useMemo(() => {
    if (weightKg <= 10) return weightKg * 4;
    if (weightKg <= 20) return 40 + (weightKg - 10) * 2;
    return 60 + (weightKg - 20) * 1;
  }, [weightKg]);

  const diuresisTarget = weightKg * 1; // 1 mL/kg/h
  const diuresisMinimal = weightKg * 0.5; // 0,5 mL/kg/h

  const paracetamolLow = weightKg * 10;
  const paracetamolHigh = weightKg * 15;
  const paracetamolDailyMax = weightKg * 60;
  const morphineInitLow = weightKg * 0.05;
  const morphineInitHigh = weightKg * 0.1;
  const morphineBolus = weightKg * 0.01;
  const ketamineLow = weightKg * 0.25;
  const ketamineHigh = weightKg * 0.5;
  const midazolamLow = weightKg * 0.03;
  const midazolamHigh = weightKg * 0.05;
  const midazolamCapped = Math.min(midazolamHigh, 2);
  const cyanokitDose = weightKg * 70;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-orange-600 via-red-600 to-amber-600 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">
          Brûlures thermiques étendues
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          ≥ 10 % SCB (enfant)
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Stabiliser ABCDE, estimer la surface brûlée (hors 1er degré) et débuter remplissage + analgésie en prévenant l'hypothermie.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>

        <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                Surface corporelle brûlée (hors 1er degré)
              </p>
              <p className="text-xl font-semibold">{formatPercent(scbPercent)} SCB</p>
              <p className="text-xs text-white/80">
                Perfusion systématique si {isInfant ? "≥ 5 %" : "≥ 10 %"} ou tout signe de choc.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                min={MIN_SCB}
                max={MAX_SCB}
                step="0.5"
                value={scbPercent}
                onChange={(e) => setScb(Number(e.target.value))}
                className="h-11 w-24 rounded-xl border border-white/40 bg-white/90 px-3 text-right text-lg font-semibold text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              <span className="text-sm text-white/80">%</span>
            </div>
          </div>
          <div className="mt-3">
            <input
              type="range"
              min={MIN_SCB}
              max={MAX_SCB}
              step="1"
              value={scbPercent}
              onChange={(e) => setScb(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        </div>

        <p className="mt-3 text-sm text-white/80">
          Cooling uniquement dans les 15 premières minutes et si SCB &lt; 20 %, puis réchauffer et couvrir. Toute brûlure ≥ 10 % (≥ 5 % nourrisson) est orientée en hospitalisation ou CTB.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale ABCDE + estimation SCB"
            subtitle="Stabiliser d'abord, classer ensuite"
            gradient="from-orange-500 via-red-500 to-amber-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={[
                "Brûlure cervico-faciale, suies bucco-nasales, voix rauque/stridor ou incendie en milieu clos = suspicion d'inhalation.",
                "Intubation orotrachéale précoce si visage + inhalation suspectée, voix rauque/stridor/tirage, GCS < 9, détresse respiratoire ou choc.",
              ]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "Monitorage FR, SpO₂, auscultation systématique.",
                "Suspicion d'inhalation de fumées → O₂ 100 % au masque haute concentration. Sinon O₂ titrée (SpO₂ 94–98 %).",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={[
                "TA, FC, TRC, coloration, conscience : rechercher choc hypovolémique (tachycardie, TRC allongé, extrémités froides, TA basse, oligurie).",
                "Perfusion si SCB > 10 % enfant ou > 5 % nourrisson, ou dès le moindre signe de choc.",
              ]}
            />
            <FlowBlock
              title="D - Disability"
              items={[
                "Score de Glasgow, pupilles, convulsions. Penser intoxication CO/CN si contexte.",
              ]}
            />
            <FlowBlock
              title="E - Exposition"
              items={[
                "Déshabiller complètement tout en protégeant du froid.",
                "Estimer la SCB hors 1er degré : schéma de Lund & Browder pédiatrique ou règle de la paume (~1 %).",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates"
            subtitle="Limiter l'agression thermique et la douleur"
            gradient="from-amber-400 via-orange-500 to-red-500"
          />
          <FlowBlock
            title="Arrêt du processus + cooling ciblé"
            items={[
              "Éteindre flammes, retirer vêtements brûlants ou imprégnés, retirer bijoux/objets serrés.",
              "Cooling : eau tempérée 15–20 °C pendant 15–20 min dans les 15 min post-brûlure si SCB < 20 %.",
              "Stopper ou éviter le cooling si brûlure très étendue (> 20 %), hypothermie, nourrisson ou instabilité hémodynamique.",
            ]}
          />
          <FlowBlock
            title="Thermoprotection + oxygène"
            items={[
              "Sécher les zones indemnes, couvrir (couverture isotherme), chauffer l'ambulance/la salle, surveiller la température.",
              "O₂ masque haute concentration si suspicion inhalation ; sinon titrer SpO₂ 94–98 %. ",
            ]}
          />
          <FlowBlock
            title="Antalgie et anxiolyse initiales"
            items={[
              "Paracétamol systématique si pas de contre-indication.",
              "Morphine IV titrée pour douleur modérée/sévère ± kétamine analgésique ; MEOPA si disponible.",
              "Midazolam anxiolyse IV lente possible en équipe entraînée avec monitorage.",
            ]}
          />
          <FlowBlock
            title="Voies veineuses + protection locale"
            items={[
              "SCB ≥ 10 % enfant ou ≥ 5 % nourrisson → au moins 1-2 VVP ou voie IO, démarrer le remplissage.",
              "Ne pas arracher tissus collés ; couvrir avec compresses stériles NaCl 0,9 % ou pansements spécifiques brûlés.",
              "Brûlures étendues souvent laissées à l'air après nettoyage selon recommandations locales/CTB.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Remplissage vasculaire – Ringer Lactate"
            subtitle="Schéma initial puis Parkland modifié"
            gradient="from-emerald-500 via-teal-500 to-cyan-400"
          />
          <FlowBlock
            title="Phase initiale (0–2 h)"
            items={[
              <>1ère heure : <strong>{formatMl(initialHour1)}</strong> (20 mL/kg) en perfusion continue.</>,
              <>2ᵉ heure : <strong>{formatMl(initialHour2)}</strong> (10 mL/kg), réévaluer TA/FC/TS/diurèse.</>,
            ]}
          />
          <FlowBlock
            title="Phase 2–24 h (Parkland modifié)"
            items={[
              <>
                Volume total 24 h = 4 mL × poids × %SCB : <strong>{formatMl(parklandTotal)}</strong> (RL, hors 1er degré).
              </>,
              <>
                Volume restant après 2 h : <strong>{formatMl(remainingAfter2h)}</strong> à répartir.
              </>,
              <>
                8 premières heures depuis l'accident : 50 % = <strong>{formatMl(totalFirst8h)}</strong> ; reste sur 6 h ≈{" "}
                <strong>{formatMlPerHour(first8hRate)}</strong> après les 2 premières heures.
              </>,
              <>
                16 h suivantes : <strong>{formatMl(totalNext16h)}</strong> soit ≈ <strong>{formatMlPerHour(next16hRate)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Entretien + glucosé (schéma 4-2-1)"
            items={[
              <>
                Besoins de base : <strong>{formatMlPerHour(maintenanceRate)}</strong> en G5 % + électrolytes (surtout &lt; 20 kg).
              </>,
              "Associer les volumes d'entretien au RL de réanimation selon hémodynamique et diurèse.",
            ]}
          />
          <FlowBlock
            title="Objectifs de surveillance"
            items={[
              <>
                Diurèse cible : <strong>{formatMl(diuresisTarget)}</strong>/h (≥ 1 mL/kg/h) ; minimum{" "}
                <strong>{formatMl(diuresisMinimal)}</strong>/h (0,5 mL/kg/h).
              </>,
              "TA, FC, TRC, conscience, lactates si disponibles. Adapter les débits pour éviter sous- ou sur-réanimation.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Analgésie / anxiolyse"
            subtitle="Doses pondérées à titrer"
            gradient="from-purple-500 via-fuchsia-500 to-rose-400"
          />
          <FlowBlock
            title="Paracétamol"
            items={[
              <>
                10–15 mg/kg toutes les 6 h : <strong>{formatMg(paracetamolLow)}</strong> -{" "}
                <strong>{formatMg(paracetamolHigh)}</strong> par prise (max {formatMg(paracetamolDailyMax)} soit 60 mg/kg/j, sans dépasser la dose adulte).
              </>,
            ]}
          />
          <FlowBlock
            title="Morphine IV titrée"
            items={[
              <>
                Dose initiale : <strong>{formatMg(morphineInitLow)}</strong> - <strong>{formatMg(morphineInitHigh)}</strong> (0,05–0,1 mg/kg).
              </>,
              <>
                Bolus de titration : <strong>{formatMg(morphineBolus)}</strong> (0,01 mg/kg) toutes 5–7 min sous monitorage (FR, SpO₂, conscience).
              </>,
              "Prévoir naloxone 0,01–0,02 mg/kg IV en cas de dépression respiratoire induite.",
            ]}
          />
          <FlowBlock
            title="Kétamine analgésique"
            items={[
              <>
                0,25–0,5 mg/kg IV lent : <strong>{formatMg(ketamineLow)}</strong> - <strong>{formatMg(ketamineHigh)}</strong>, répétable si besoin (souvent associée à une faible dose de benzodiazépine).
              </>,
            ]}
          />
          <FlowBlock
            title="Midazolam (équipe entraînée)"
            items={[
              <>
                0,03–0,05 mg/kg IV lent : <strong>{formatMg(midazolamLow)}</strong> - <strong>{formatMg(midazolamHigh)}</strong>{" "}
                (max première dose ~2 mg : <strong>{formatMg(midazolamCapped)}</strong>).
              </>,
              "Surveillance respiratoire stricte. ",
            ]}
          />
          <FlowBlock
            title="MEOPA"
            items={[
              "Si disponible, utile pour soins locaux et mobilisations, selon protocole pédiatrique habituel.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Soins locaux + situations particulières"
            subtitle="Adapter selon âge et contexte"
            gradient="from-sky-500 via-blue-500 to-indigo-500"
          />
          <FlowBlock
            title="Soins locaux initiaux"
            items={[
              "Lavage doux à l'eau et savon antiseptique selon protocole local.",
              "Débridement/phlyctènes à discuter avec le chirurgien/CTB (dé-roof des phlyctènes rompues ou tendues).",
              "Pansements stériles non adhérents humidifiés NaCl 0,9 % ou pansements spécifiques. Éviter tulle gras pour grandes surfaces ; parfois laissé à l'air en pédiatrie selon CTB.",
            ]}
          />
          <FlowBlock
            title="Situations particulières"
            items={[
              "Nourrisson/prématuré : seuil de gravité plus bas (SCB > 5 %), réchauffement rigoureux, monitorage rapproché du remplissage.",
              "Comorbidités (cardiaque, rénale, neuro) : mêmes formules mais ajuster finement aux bilans et à la clinique pour éviter la surcharge.",
              <>
                Suspicion inhalation/cyanure : O₂ 100 % ; hydroxocobalamine (Cyanokit) souvent 70 mg/kg{" "}
                <strong>{formatMg(cyanokitDose)}</strong> (max dose adulte) en 10–20 min selon protocole local.
              </>,
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation et transfert"
            subtitle="Limiter les sorties du SAU aux formes < 10 %"
            gradient="from-slate-700 via-slate-800 to-slate-900"
          />
          <FlowBlock
            title="Hospitalisation (minimum)"
            items={[
              "Nourrisson : brûlure 5–10 % SCB.",
              "Enfant : brûlure 10–20 % SCB.",
              "Brûlure < 10 % mais localisation fonctionnelle (mains, pieds, visage, périnée, articulations), 3ᵉ degré, suspicion maltraitance ou lésions associées.",
            ]}
          />
          <FlowBlock
            title="Transfert CTB / réanimation pédiatrique"
            items={[
              "Nourrisson > 10 % SCB ou enfant > 20 % SCB.",
              "Brûlures de la face, mains, pieds, périnée, articulations majeures ou circulaires (membres/thorax).",
              "Suspicion/inhalation de fumées, détresse respiratoire ou hémodynamique, comorbidités graves.",
            ]}
          />
          <FlowBlock
            title="Sortie du SAU ?"
            items={[
              "Brûlures ≥ 10 % SCB : sortie domicile non recommandée.",
              "Sortie possible uniquement pour brûlures < 10 % sans localisation fonctionnelle ni 3ᵉ degré, sans lésions associées et avec conditions sociales adéquates.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitements à éviter"
            subtitle="Respect des recommandations SFAR/SFMU/GFRUP/SFETB"
            gradient="from-rose-500 via-red-500 to-orange-400"
          />
          <FlowBlock
            title="Ne pas faire"
            items={[
              "Pas d'antibioprophylaxie systémique d'emblée (hors contexte opératoire ou sepsis documenté).",
              "Pas de corticoïdes systémiques de routine pour la brûlure cutanée isolée.",
              "Pas de cooling prolongé ni eau glacée (risque d'hypothermie).",
              "Pas de topiques gras type Biafine® sur brûlures profondes/étendues ; pas de tulle gras en routine sur grandes surfaces pédiatriques.",
              "Pas d'infiltration de lidocaïne dans les tissus brûlés étendus.",
              "Prudence avec les AINS chez l'enfant brûlé (risque hémodynamique/rénal).",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
