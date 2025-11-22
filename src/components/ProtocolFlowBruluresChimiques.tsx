"use client";

import { useEffect, useMemo, useState } from "react";

import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { FlowBlock, FlowChevron, FlowRibbon } from "@/components/flow/FlowParts";
import { formatMg } from "@/lib/units";
import { useAppStore } from "@/store/useAppStore";

const MIN_W = 3;
const MAX_W = 120;
const DEFAULT_W = 20;

const clampWeight = (value: number | null | undefined) => {
  if (!Number.isFinite(value ?? NaN)) return DEFAULT_W;
  return Math.min(Math.max(value as number, MIN_W), MAX_W);
};

const agentOptions = [
  "Agent inconnu / standard",
  "Acide fluorhydrique (HF)",
  "Base forte ou solvant corrosif",
];

export default function ProtocolFlowBruluresChimiques() {
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

  const [agent, setAgent] = useState<string>(agentOptions[0]);

  const isInfant = useMemo(() => {
    const label = typeof ageLabel === "string" ? ageLabel.toLowerCase() : "";
    if (label.includes("mois") || label.includes("naissance") || label.includes("1 an")) return true;
    return weightKg < 10;
  }, [ageLabel, weightKg]);

  const paracetamolLow = weightKg * 10;
  const paracetamolHigh = weightKg * 15;
  const paracetamolDailyMax = weightKg * 60;

  const morphineInitLow = weightKg * 0.05;
  const morphineInitHigh = weightKg * 0.1;
  const morphineBolus = weightKg * 0.01;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-emerald-700 via-cyan-600 to-sky-600 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Brûlures chimiques pédiatriques</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">Décontamination urgente</h1>
        <p className="text-sm text-white/85 mt-1">
          Brûlure chimique cutanée ou oculaire : sécuriser, rincer immédiatement et évaluer la gravité. Calcul automatique des
          antalgiques pondérés.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">Agent chimique</p>
            <select
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/40 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              {agentOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-white/80">
              Identifier le produit (acide/base/solvant) et conserver l’emballage si disponible. Informer le centre antipoison.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">Situations à haut risque</p>
            <ul className="mt-1 list-disc pl-4 space-y-1 text-sm text-white">
              <li>Localisation critique : visage/œil, mains/pieds, articulations, périnée.</li>
              <li>Surface même faible mais profonde ; inhalation ou ingestion chimique.</li>
              <li>Agent très corrosif ou toxique {isInfant ? "(nourrisson très vulnérable)" : "chez l’enfant"}.</li>
            </ul>
          </div>
        </div>

        <p className="mt-3 text-sm text-white/80">
          Rincer immédiatement (15–30 min minimum) à l’eau tiède ou sérum physiologique, protéger du froid et retirer les vêtements
          contaminés. Toute atteinte oculaire = rinçage prolongé + avis ophtalmo urgent.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale ABCDE + identification du produit"
            subtitle="Sécuriser d'abord le soignant et l'enfant"
            gradient="from-emerald-500 via-cyan-500 to-sky-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="A - Airway"
              items={[
                "Rechercher inhalation ou exposition en milieu clos : suie, brûlure cervico-faciale, voix rauque/stridor/tirage.",
                "IOT précoce si détresse respiratoire, inhalation suspectée ou altération de conscience (GCS < 9).",
              ]}
            />
            <FlowBlock
              title="B - Breathing"
              items={[
                "SpO₂, FR, tirage ; O₂ haut débit si détresse ou inhalation chimique.",
                "Surveillance du risque bronchospasme/œdème laryngé selon produit volatil.",
              ]}
            />
            <FlowBlock
              title="C - Circulation"
              items={[
                "FC, TA, TRC, signes de choc (hypotension, extrémités froides, oligurie).",
                "Voie veineuse, remplissage si instabilité ; surveiller hypothermie pendant rinçage prolongé.",
              ]}
            />
            <FlowBlock
              title="D - Disability"
              items={[
                "Conscience (GCS), pupilles, signes neurologiques ou toxiques selon agent (hypocalcémie HF, intoxication solvants).",
              ]}
            />
            <FlowBlock
              title="E - Exposition et surface"
              items={[
                "Retirer soigneusement vêtements/bijoux contaminés (découper si collés).",
                "Estimer la surface atteinte (paume ≈ 1 %) et la profondeur hors 1er degré ; noter localisation fonctionnelle.",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Mesures immédiates et décontamination"
            subtitle="Rinçage continu dès la première minute"
            gradient="from-teal-500 via-emerald-500 to-lime-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="Protection et retrait"
              items={[
                "Protéger le soignant (gants, lunettes). Éloigner l’enfant de la source, ventilation des lieux.",
                "Retirer vêtements/chaussures/bijoux contaminés, sans arracher la peau ; couvrir ensuite par pansement stérile non adhérent.",
              ]}
            />
            <FlowBlock
              title="Rinçage cutané/oculaire"
              items={[
                "Eau tiède ou NaCl 0,9 % abondant pendant ≥ 15–30 minutes, idéalement jusqu’à disparition de la sensation caustique.",
                "Brûlure oculaire : irrigation prolongée (15–30 min minimum) en maintenant les paupières ouvertes, puis examen ophtalmologique urgent.",
                agent === "Acide fluorhydrique (HF)"
                  ? "HF : après début de rinçage, appliquer précocement un gel de gluconate de calcium 2,5 % sur la zone (renouveler toutes les ~2 h) et surveiller l’ionogramme/calcium."
                  : "Si solution spécifique disponible (ex. Diphoterine®) : peut être utilisée après démarrage du rinçage, selon protocole local.",
              ]}
            />
            <FlowBlock
              title="À éviter"
              items={[
                "Pas d’eau glacée ni de refroidissement prolongé (risque d’hypothermie).",
                "Pas de neutralisation empirique acide/base ; pas de graisses, huiles, tulle gras ou pommades non validées.",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Traitement local, antalgie et surveillance"
            subtitle="Adapter au poids et au type d’agent"
            gradient="from-cyan-500 via-blue-500 to-indigo-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="Analgésie pondérée"
              items={[
                (
                  <span key="paracetamol">
                    Paracétamol : <strong>{formatMg(paracetamolLow)}</strong> à <strong>{formatMg(paracetamolHigh)}</strong> toutes les 6 h (max 24 h : <strong>{formatMg(paracetamolDailyMax)}</strong>).
                  </span>
                ),
                (
                  <span key="morphine">
                    Morphine IV : dose initiale <strong>{formatMg(morphineInitLow)}</strong> à <strong>{formatMg(morphineInitHigh)}</strong> (0,05–0,1 mg/kg) IV lente,
                    bolus de <strong>{formatMg(morphineBolus)}</strong> toutes 5–7 min selon douleur/tolérance (monitorage respi).
                  </span>
                ),
                "Associer MEOPA, distraction, et protocoles locaux d’analgésie ; adapter selon comorbidités et âge.",
              ]}
            />
            <FlowBlock
              title="Surveillance et bilans"
              items={[
                "Température (hypothermie), diurèse, électrolytes si agent toxique (ex : HF → Ca2+, K+, ECG).",
                "Évaluer l’évolution des lésions et la douleur ; pas d’application topique grasse sans avis spécialisé.",
                agent === "Base forte ou solvant corrosif"
                  ? "Bases fortes/solvants : surveiller lésions profondes et toxicité systémique, envisager centre antipoison/CTB."
                  : "Consulter le centre antipoison ou CTB en cas d’agent inconnu ou de symptômes systémiques.",
              ]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation, hospitalisation ou sortie"
            subtitle="Décider selon gravité, localisation et âge"
            gradient="from-amber-500 via-orange-500 to-red-400"
          />
          <div className="space-y-3">
            <FlowBlock
              title="Hospitalisation / transfert"
              items={[
                "Brûlure chimique étendue (ex : > 10 % SCB enfant ou > 5 % nourrisson) ou localisation critique (face/œil/mains/pieds/périnée/articulations).",
                "Agent hautement corrosif ou toxique, ingestion/inhalation, signes systémiques ou instabilité vitale → adresser en service spécialisé ou centre de brûlés.",
                "Nourrisson ou contexte socio-familial défavorable : seuil d’hospitalisation bas.",
              ]}
            />
            <FlowBlock
              title="Sortie possible"
              items={[
                "Brûlure limitée superficielle, non critique, sans agent toxique identifié et douleur contrôlée.",
                "Pansement stérile non adhérent, plan de soins locaux, information parentale et suivi programmé.",
                "Absence de progression ou complication attendue ; surveillance prolongée si base forte (lésions évolutives).",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
