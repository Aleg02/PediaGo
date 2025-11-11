"use client";

import { useMemo, type ReactNode } from "react";

import { useAppStore } from "@/store/useAppStore";
import { computeDose } from "@/lib/dosing";
import { DOSING_RULES, WEIGHT_OVERRIDES } from "@/data/drugs";
import { formatMg } from "@/lib/units";
import { estimateAgeFromWeight } from "@/components/AgeWeightPicker";

const CARD_STYLES = {
  red: {
    accent: "text-[#C62828]",
    border: "border-[#F5B4B4]",
    badgeBg: "bg-[#C62828]/10",
    badgeText: "text-[#C62828]",
  },
  yellow: {
    accent: "text-[#F9A825]",
    border: "border-[#F9D57B]",
    badgeBg: "bg-[#F9A825]/15",
    badgeText: "text-[#C77800]",
  },
  violet: {
    accent: "text-[#6A1B9A]",
    border: "border-[#D9B8EB]",
    badgeBg: "bg-[#6A1B9A]/15",
    badgeText: "text-[#4A148C]",
  },
  orange: {
    accent: "text-[#EF6C00]",
    border: "border-[#F7C29E]",
    badgeBg: "bg-[#EF6C00]/15",
    badgeText: "text-[#D84315]",
  },
  grey: {
    accent: "text-[#455A64]",
    border: "border-[#CFD8DC]",
    badgeBg: "bg-[#455A64]/15",
    badgeText: "text-[#37474F]",
  },
};

const MIN_WEIGHT_KG = 3;
const MAX_WEIGHT_KG = 60;
const DEFAULT_WEIGHT_KG = 10;

function formatMl(volumeMl: number) {
  if (!Number.isFinite(volumeMl)) return "-";
  if (volumeMl >= 1) {
    return `${Number(volumeMl.toFixed(1))} mL`;
  }
  return `${Number(volumeMl.toFixed(2))} mL`;
}

function formatUg(valueUg: number) {
  if (!Number.isFinite(valueUg)) return "-";
  return `${Number(valueUg.toFixed(valueUg < 10 ? 1 : 0))} µg`;
}

const formatDose = (value: number) => {
  return Number.isFinite(value) ? formatMg(value) : "—";
};

type FlowCardProps = {
  tone: keyof typeof CARD_STYLES;
  title: string;
  eyebrow?: string;
  badge?: string;
  bullets?: string[];
  children?: ReactNode;
  footer?: ReactNode;
};

function FlowCard({ tone, title, eyebrow, badge, bullets, children, footer }: FlowCardProps) {
  const palette = CARD_STYLES[tone];

  return (
    <div
      className={`rounded-3xl border bg-white px-5 py-6 shadow-[0_22px_40px_-30px_rgba(15,23,42,0.55)] sm:px-6 ${palette.border}`}
    >
      {eyebrow && (
        <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${palette.accent}`}>{eyebrow}</p>
      )}
      <div className="mt-1 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-tight text-slate-900">{title}</h3>
        {badge && (
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${palette.badgeBg} ${palette.badgeText}`}>
            {badge}
          </span>
        )}
      </div>
      {bullets && bullets.length > 0 && (
        <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-4">
          {bullets.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
      {children && <div className="mt-3 text-sm text-slate-700 space-y-2">{children}</div>}
      {footer && <div className="mt-4 text-xs text-slate-500">{footer}</div>}
    </div>
  );
}

function FlowConnector() {
  return (
    <div className="flex justify-center" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-300">
        <path
          d="M12 4v14m0 0l-4-4m4 4 4-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function BranchColumn({ steps }: { steps: FlowCardProps[] }) {
  return (
    <div className="space-y-5">
      {steps.map((step, idx) => (
        <div key={`${step.title}-${idx}`} className="space-y-4">
          <FlowCard {...step} />
          {idx < steps.length - 1 && <FlowConnector />}
        </div>
      ))}
    </div>
  );
}

export default function ProtocolFlowAnaphylaxie() {
  const weightFromStore = useAppStore((s) => s.weightKg);
  const ageLabelFromStore = useAppStore((s) => s.ageLabel);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);
  const resetStore = useAppStore((s) => s.reset);

  const weightKg =
    weightFromStore != null && Number.isFinite(weightFromStore)
      ? Math.min(Math.max(weightFromStore, MIN_WEIGHT_KG), MAX_WEIGHT_KG)
      : DEFAULT_WEIGHT_KG;

  const estimatedAgeLabel = estimateAgeFromWeight(weightKg);
  const displayedAgeLabel = ageLabelFromStore ?? estimatedAgeLabel ?? "—";

  const onWeightChange = (value: number) => {
    const clamped = Math.min(Math.max(value, MIN_WEIGHT_KG), MAX_WEIGHT_KG);
    setWeightKg(clamped);
    setAgeLabel(estimateAgeFromWeight(clamped));
  };

  const adrenalineIm = useMemo(
    () =>
      computeDose(weightKg, DOSING_RULES["adrenaline-im"], WEIGHT_OVERRIDES["adrenaline-im"]),
    [weightKg]
  );

  const adrenalineImDoseMg = Number.isFinite(adrenalineIm.doseMg) ? adrenalineIm.doseMg : NaN;
  const adrenalineImVolume = Number.isFinite(adrenalineImDoseMg) ? adrenalineImDoseMg / 1 : NaN; // 1 mg/mL

  const solumedrolRange = useMemo(() => {
    const min = weightKg * 1;
    const max = weightKg * 2;
    return { min, max };
  }, [weightKg]);

  const polaramineDoseMg = useMemo(() => weightKg * 0.1, [weightKg]);
  const remplissageVolumeMl = useMemo(() => weightKg * 20, [weightKg]);

  const adrenalineNebuliseeDoseMg = useMemo(() => Math.min(weightKg * 0.1, 5), [weightKg]);

  const adrenalineIvseUgPerMin = useMemo(() => weightKg * 0.1, [weightKg]);
  const adrenalineIvseMlPerMin = Number.isFinite(adrenalineIvseUgPerMin)
    ? adrenalineIvseUgPerMin / 20
    : NaN; // solution 1 mg/50 mL = 20 µg/mL

  const nadIvseUgPerMin = useMemo(() => weightKg * 0.2, [weightKg]);

  const glucagonDoseMg = useMemo(() => {
    if (weightKg < 20) return 0.5;
    if (weightKg <= 30) return 1;
    return 1;
  }, [weightKg]);

  const cardioSteps: FlowCardProps[] = [
    {
      tone: "grey",
      eyebrow: "Voie cardio-vasculaire",
      title: "Détresse cardio-vasculaire",
      badge: "Stabilisation",
      bullets: [
        "O₂ haute concentration, scope, VVP, ECG",
        `Remplissage NaCl 0,9 % ${formatMl(remplissageVolumeMl)} (20 mL/kg)`,
        "Position Trendelenburg, préparer amines vasopressives / intubation",
      ],
    },
    {
      tone: "yellow",
      eyebrow: "Escalade cardio-vasculaire",
      title: "Adrénaline IVSE 0,1 µg/kg/min",
      bullets: ["Surveillance continue, titrer selon réponse clinique"],
      children: (
        <>
          <p>
            Débit calculé : <strong>{formatUg(adrenalineIvseUgPerMin)}</strong> par minute pour {Number(weightKg.toFixed(1))} kg.
          </p>
          {Number.isFinite(adrenalineIvseMlPerMin) && (
            <p className="text-xs text-slate-500">
              Solution 1 mg/50 mL = 20 µg/mL → {Number(adrenalineIvseMlPerMin.toFixed(2))} mL/min.
            </p>
          )}
        </>
      ),
      footer: "Dose maximale cumulée : 0,5 mg.",
    },
    {
      tone: "red",
      eyebrow: "Renforcement hémodynamique",
      title: "Adrénaline IVSE + NAD 0,2 µg/kg/min",
      bullets: [
        "Réévaluer tension artérielle toutes les 2–3 minutes",
        "Associer autres vasopresseurs selon l’évolution",
      ],
      children: (
        <p>
          Débit NAD recommandé : <strong>{formatUg(nadIvseUgPerMin)}</strong> par minute (à adapter selon concentration).
        </p>
      ),
    },
  ];

  const respiratorySteps: FlowCardProps[] = [
    {
      tone: "violet",
      eyebrow: "Voie respiratoire",
      title: "Détresse respiratoire",
      badge: "Aérosols",
      bullets: [
        "Adrénaline nébulisée 0,1 mg/kg (max 5 mg)",
        "Salbutamol en aérosols répétés, O₂ humidifié",
        "Envisager VNI / IOT si épuisement",
      ],
      children: (
        <p>
          Dose calculée : <strong>{formatDose(adrenalineNebuliseeDoseMg)}</strong>.
        </p>
      ),
    },
    {
      tone: "orange",
      eyebrow: "Escalade respiratoire",
      title: "Poursuite des aérosols",
      bullets: [
        "Adrénaline nébulisée alternée ± salbutamol",
        "Ipratropium si bronchospasme sévère",
        "Kinésithérapie respiratoire à discuter",
      ],
    },
    {
      tone: "grey",
      eyebrow: "Réévaluation",
      title: "Surveillance & sortie",
      bullets: [
        "Observation minimale 6 h (risque biphasique)",
        "Cardio-monitoring ± saturométrie continue",
        "Prescription kit d’adrénaline auto-injectable",
      ],
    },
  ];

  const cardioInitialStep = cardioSteps[0]!;
  const cardioEscaladeSteps = cardioSteps.slice(1);
  const respiratoryInitialStep = respiratorySteps[0]!;
  const respiratoryEscaladeSteps = respiratorySteps.slice(1);

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-b from-[#FFF5F5] via-white to-white shadow-2xl">
        <div className="bg-[#C62828] px-6 py-6 text-white sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">Protocole</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">ANAPHYLAXIE</h2>
        </div>

        <div className="px-6 py-8 sm:px-8 sm:py-10 space-y-8">
          <section className="rounded-3xl border border-[#C62828]/25 bg-white/95 px-5 py-6 shadow-[0_16px_40px_-32px_rgba(198,40,40,0.65)] sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C62828]">Données patient</p>
                <p className="mt-1 text-sm text-slate-600">
                  Ajustez le poids pour recalculer automatiquement toutes les doses.
                </p>
              </div>
              <button
                type="button"
                onClick={resetStore}
                className="inline-flex items-center rounded-full border border-white/70 bg-[#C62828] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:bg-[#a61e1e]"
              >
                Réinitialiser
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#FFE1E1] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C62828]/80">Âge estimé</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">{displayedAgeLabel}</p>
              </div>
              <div className="rounded-2xl bg-[#FFE1E1] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C62828]/80">Poids</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">{Number(weightKg.toFixed(1))} kg</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C62828]/80" htmlFor="weight-slider">
                Ajuster le poids (3 à 60 kg)
              </label>
              <input
                id="weight-slider"
                type="range"
                min={MIN_WEIGHT_KG}
                max={MAX_WEIGHT_KG}
                step={0.5}
                value={weightKg}
                onChange={(event) => onWeightChange(Number(event.target.value))}
                className="mt-3 w-full accent-[#C62828]"
              />
              <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                <span>{MIN_WEIGHT_KG} kg</span>
                <span>{MAX_WEIGHT_KG} kg</span>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <FlowCard
              tone="red"
              eyebrow="Phase immédiate"
              title="Atteinte cardio-respiratoire"
              badge="Adrénaline"
              bullets={[
                "Adrénaline IM 0,01 mg/kg (max 0,5 mg)",
                "Injection face latéro-externe de la cuisse",
                "Éviction de l’allergène + surveillance rapprochée",
              ]}
              footer="Répéter toutes les 5 à 15 minutes si la détresse persiste."
            >
              <p>
                Dose calculée : <strong>{formatDose(adrenalineImDoseMg)}</strong>
                {Number.isFinite(adrenalineImVolume) && (
                  <>
                    {" "}→ <strong>{formatMl(adrenalineImVolume)}</strong> de solution 1 mg/mL.
                  </>
                )}
              </p>
            </FlowCard>

            <div className="grid gap-4 sm:grid-cols-2">
              <FlowCard
                tone="orange"
                title="Antihistaminique & corticoïde"
                bullets={[
                  `Solumédrol : ${formatDose(solumedrolRange.min)} – ${formatDose(solumedrolRange.max)} (1–2 mg/kg IV)`,
                  `Polaramine : ${formatDose(polaramineDoseMg)} (0,1 mg/kg)`,
                ]}
              />
              <FlowCard
                tone="yellow"
                title="Symptômes gastro-intestinaux persistants ?"
                bullets={["Nouvelle injection IM + surveillance hospitalière prolongée"]}
                footer="Surveillance rapprochée au moins 24 h si vomissements/diarrhées rebelles."
              />
            </div>
          </section>

          <section className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <BranchColumn steps={[cardioInitialStep]} />
              <BranchColumn steps={[respiratoryInitialStep]} />
            </div>

            <FlowCard
              tone="orange"
              title="Absence de réponse après 5–10 minutes"
              bullets={[
                "Contacter le réanimateur et préparer une voie centrale",
                "Renforcer le monitorage continu (ECG, TA invasive si possible)",
              ]}
              footer="Penser à vérifier l’accessibilité des voies aériennes et à reconsidérer l’étiologie."
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <BranchColumn steps={cardioEscaladeSteps} />
              <BranchColumn steps={respiratoryEscaladeSteps} />
            </div>

            <FlowCard
              tone="red"
              title="Escalade & antidotes"
              bullets={["Patient sous bêta-bloquant ou choc réfractaire"]}
            >
              <p>
                Glucagon IM/IV : <strong>{formatDose(glucagonDoseMg)}</strong> (répéter une fois si besoin).
              </p>
              <p className="text-xs text-slate-500">
                Surveillance invasive si possible, gaz du sang et lactates répétés, prévenir la réanimation.
              </p>
            </FlowCard>
          </section>
        </div>
      </div>
    </div>
  );
}
