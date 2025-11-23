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

const formatMl = (value: number, digits = 1) => `${value.toFixed(digits)} mL`;
const formatLine = (mg: number, hours: number) => `${formatMg(mg)} sur ${hours} h`;

export default function ProtocolFlowIntoxParacetamol() {
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

  const [ingestionType, setIngestionType] = useState<"aigue" | "repetee">("aigue");
  const [doseMgKg, setDoseMgKg] = useState<number>(200);
  const [doseUnknown, setDoseUnknown] = useState(false);

  const nacCharge = weightKg * 150;
  const nacPerf2 = weightKg * 50;
  const nacPerf3 = weightKg * 100;

  const doseLabel = useMemo(() => {
    if (doseUnknown) return "Dose inconnue : prudence";
    if (doseMgKg >= 200) return "> 200 mg/kg (très toxique)";
    if (doseMgKg >= 150) return "> 150 mg/kg (toxique)";
    return `${doseMgKg.toFixed(0)} mg/kg`;
  }, [doseMgKg, doseUnknown]);

  const needNacImmediate = useMemo(() => {
    if (ingestionType === "aigue") {
      return doseUnknown || doseMgKg >= 150;
    }
    return doseUnknown || doseMgKg >= 90;
  }, [doseMgKg, doseUnknown, ingestionType]);

  const repeatedThreshold = 90;

  return (
    <div className="pb-8">
      <div className="rounded-3xl bg-gradient-to-b from-amber-600 via-orange-600 to-rose-600 px-4 pt-6 pb-5 text-white shadow-sm">
        <p className="text-[13px] uppercase tracking-[0.2em] text-white/70">Intoxication médicamenteuse</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide leading-tight">
          Intoxication au paracétamol – enfant
        </h1>
        <p className="text-sm text-white/85 mt-1">
          Calculer la dose ingérée, appliquer le nomogramme (ingestion aiguë), démarrer la NAC IV sans délai si seuils dépassés.
        </p>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampWeight(v ?? weightKg))}
          />
        </div>

        <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-3 space-y-3">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "aigue", label: "Ingestion aiguë (prise unique)" },
              { key: "repetee", label: "Ingestion répétée (24–48 h)" },
            ].map((opt) => {
              const active = ingestionType === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setIngestionType(opt.key as "aigue" | "repetee")}
                  className={`flex-1 min-w-[150px] rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-white bg-white text-slate-900 shadow"
                      : "border-white/50 bg-white/10 text-white hover:border-white/80"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-xl bg-white/10 border border-white/30 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">Dose estimée</p>
                <p className="text-lg font-semibold">{doseLabel}</p>
                <p className="text-xs text-white/80">
                  Aiguë : seuil toxique 150 mg/kg (très toxique &gt; 200). Répétée : &gt; 90 mg/kg/j.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={400}
                  step="10"
                  disabled={doseUnknown}
                  value={doseUnknown ? "" : doseMgKg}
                  onChange={(e) => setDoseMgKg(Number(e.target.value) || 0)}
                  className="h-11 w-24 rounded-xl border border-white/50 bg-white/90 px-3 text-right text-lg font-semibold text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:bg-white/60"
                  placeholder="mg/kg"
                />
                <span className="text-sm text-white/80">mg/kg</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-white/80">
              <input
                id="dose-unknown"
                type="checkbox"
                checked={doseUnknown}
                onChange={(e) => setDoseUnknown(e.target.checked)}
                className="h-4 w-4 rounded border-white/70 bg-white/20 text-white focus:ring-white"
              />
              <label htmlFor="dose-unknown">Dose inconnue / non fiable</label>
            </div>
            <div className="mt-3">
              <input
                type="range"
                min={0}
                max={400}
                step="10"
                disabled={doseUnknown}
                value={doseUnknown ? 0 : doseMgKg}
                onChange={(e) => setDoseMgKg(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <FlowRibbon
            title="Évaluation initiale ABCDE"
            subtitle="Calculer la dose ingérée et préparer NAC"
            gradient="from-amber-500 via-orange-500 to-rose-500"
          />
          <div className="space-y-3">
            <FlowBlock title="A - Airway" items={["Troubles de conscience rares, vérifier la perméabilité."]} />
            <FlowBlock
              title="B - Breathing"
              items={["O₂ si SpO₂ < 94 % → O₂ titré pour SpO₂ 94–98 %."]}
            />
            <FlowBlock
              title="C - Circulation"
              items={[
                "TA, TRC, perfusion généralement normaux ; déshydratation possible si vomissements.",
              ]}
            />
            <FlowBlock
              title="D - Disability"
              items={["Nausées, vomissements, douleurs abdominales (stade 1)."]}
            />
            <FlowBlock
              title="E - Exposition"
              items={["Rechercher comprimés manquants, calculer dose ingérée."]}
            />
          </div>
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Interrogatoire et bilans"
            subtitle="Heure précise, forme LP et co-intoxications"
            gradient="from-sky-500 via-blue-500 to-indigo-500"
          />
          <FlowBlock
            title="Interrogatoire clé"
            items={[
              "Heure exacte d’ingestion, dose, forme (comprimé/gouttes/sirop, LP), poids réel.",
              "Co-intoxications (ibuprofène, opiacés), ingestion chronique ?",
            ]}
          />
          <FlowBlock
            title="Bilans initiaux"
            items={[
              "Paracétamolémie à H4 post-ingestion (et H8 si LP).",
              "Bilan hépatique : ASAT/ALAT, TP/INR, bilirubine.",
              "Ionogramme, glycémie, créatinine, lactate.",
              "H4 avant = non interprétable sur nomogramme.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Décision NAC"
            subtitle="Seuils mg/kg et nomogramme de Rumack–Matthews"
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
          <FlowBlock
            title="Ingestion aiguë (prise unique)"
            items={[
              needNacImmediate
                ? "Dose toxique ou inconnue : NAC immédiate sans attendre la paracétamolémie."
                : "Dose annoncée < 150 mg/kg : attendre paracétamolémie à H4 et tracer sur nomogramme.",
              "Nomogramme valable uniquement pour ingestion aiguë unique, lecture à partir de 4 h.",
              "Si concentration au-dessus de la ligne de toxicité → NAC.",
            ]}
          />
          <FlowBlock
            title="Ingestion répétée (24–48 h)"
            items={[
              `NAC si > ${repeatedThreshold} mg/kg/j, si signes cliniques (vomissements/douleurs) ou cytolyse.`,
              "Paracétamolémie et bilan hépatique systématiques.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="N-acétylcystéine (NAC) IV – schéma 21 h"
            subtitle="Ne pas retarder si seuils dépassés ou dose inconnue"
            gradient="from-purple-500 via-fuchsia-500 to-rose-400"
          />
          <FlowBlock
            title="Perfusion 1 (charge)"
            items={[
              <>
                150 mg/kg sur 1 h → <strong>{formatLine(nacCharge, 1)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Perfusion 2"
            items={[
              <>
                50 mg/kg sur 4 h → <strong>{formatLine(nacPerf2, 4)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Perfusion 3"
            items={[
              <>
                100 mg/kg sur 16 h → <strong>{formatLine(nacPerf3, 16)}</strong>.
              </>,
            ]}
          />
          <FlowBlock
            title="Alternative 12 h"
            items={["Possible sur avis centre antipoison (CAPTV), non protocole standard."]}
          />
          <FlowBlock
            title="Vomissements sous NAC"
            items={[
              "Ralentir la perfusion ; ondansétron ≥ 2 ans 0,15 mg/kg si besoin.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Points essentiels"
            subtitle="Quand démarrer, quoi éviter"
            gradient="from-slate-700 via-slate-800 to-black"
          />
          <FlowBlock
            title="Ne pas retarder la NAC"
            items={[
              "Dose > 150 mg/kg (aiguë) ou > 90 mg/kg/j (répétée).",
              "Paracétamolémie toxique ou dose inconnue suspecte.",
              "Cytolyse biologique.",
            ]}
          />
          <FlowBlock
            title="Antalgiques"
            items={[
              "Paracétamol interdit jusqu’à normalisation du bilan.",
              "Ibuprofène possible seulement si bien hydraté et pas d’atteinte rénale.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Situations particulières"
            subtitle="Adapter surveillance et orientation"
            gradient="from-cyan-600 via-blue-700 to-slate-800"
          />
          <FlowBlock
            title="Nourrisson < 2 ans"
            items={[
              "Métabolisme différent mais mêmes seuils thérapeutiques ; surveillance rapprochée.",
              "Risque d’hypoglycémie plus rapide → glycémie fréquente.",
            ]}
          />
          <FlowBlock
            title="Adolescent / geste suicidaire"
            items={[
              "Avis psychiatrique obligatoire.",
            ]}
          />
          <FlowBlock
            title="Formes LP (libération prolongée)"
            items={[
              "Deux dosages sanguins H4 et H8, analyser la plus élevée sur nomogramme.",
              "NAC systématique en cas de doute.",
            ]}
          />
        </div>

        <FlowChevron />

        <div className="space-y-3">
          <FlowRibbon
            title="Orientation"
            subtitle="Hospitalisation ou réanimation selon gravité"
            gradient="from-emerald-600 via-teal-700 to-cyan-800"
          />
          <FlowBlock
            title="Hospitalisation systématique si"
            items={[
              "NAC démarrée ou paracétamolémie toxique.",
              "Cytolyse hépatique, co-intoxications, vomissements persistants.",
              "Adolescent (risque suicidaire).",
            ]}
          />
          <FlowBlock
            title="Réanimation si"
            items={[
              "TP < 50 %, hypoglycémie persistante, encéphalopathie hépatique.",
              "Lactates élevés, insuffisance rénale.",
            ]}
          />
          <FlowBlock
            title="Critères de sortie"
            items={[
              "Bilan hépatique normal après protocole NAC, paracétamolémie < 10 mg/L.",
              "Pas de vomissements, conscience normale.",
              "Situation sociale/psy fiable, suivi programmé 48–72 h.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
