"use client";

import { useMemo, useState, useEffect } from "react";
import AgeWeightPicker, { estimateAgeFromWeight } from "@/components/AgeWeightPicker";
import { useAppStore } from "@/store/useAppStore";
import { computeDose } from "@/lib/dosing";
import { DOSING_RULES, WEIGHT_OVERRIDES } from "@/data/drugs";
import { formatMg } from "@/lib/units";

type Branch = "cv" | "resp";

const ACCENT = {
  red:    { header: "bg-[#E53935]", body: "bg-[#FDEAEA]", border: "border-[#E53935]" },
  orange: { header: "bg-[#EF6C00]", body: "bg-[#FFF1E7]", border: "border-[#EF6C00]" },
  yellow: { header: "bg-[#F9A825]", body: "bg-[#FFF8E1]", border: "border-[#F9A825]" },
  violet: { header: "bg-[#6A1B9A]", body: "bg-[#F3E5F5]", border: "border-[#6A1B9A]" },
  grey:   { header: "bg-[#455A64]", body: "bg-[#ECEFF1]", border: "border-[#455A64]" },
  green:  { header: "bg-[#2E7D32]", body: "bg-[#E8F5E9]", border: "border-[#2E7D32]" },
  pink:   { header: "bg-[#D81B60]", body: "bg-[#FCE4EC]", border: "border-[#D81B60]" },
} as const;

const MIN_W = 3;
const MAX_W = 60;
const clampW = (v: number) => Math.min(Math.max(v, MIN_W), MAX_W);

// Helpers d’affichage
const formatMl = (v: number) =>
  Number.isFinite(v) ? (v >= 1 ? `${Number(v.toFixed(1))} mL` : `${Number(v.toFixed(2))} mL`) : "—";
const formatDose = (v: number) => (Number.isFinite(v) ? formatMg(v) : "—");
const formatUg = (v: number) =>
  Number.isFinite(v) ? `${Number(v.toFixed(v < 10 ? 1 : 0))} µg` : "—";

// Valeur calculée — style unique
function Calc({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-slate-900"> — {children}</strong>;
}

function Arrow() {
  return (
    <div className="flex justify-center" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-400">
        <path
          d="M12 4v16m0 0l-5-5m5 5l5-5"
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

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-center text-[13px] font-semibold text-slate-700 shadow-sm">
      {children}
    </div>
  );
}

function Block({
  tone,
  title,
  subtitle,
  children,
}: {
  tone: keyof typeof ACCENT;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const p = ACCENT[tone];
  return (
    <div className={`rounded-3xl overflow-hidden shadow-md border ${p.border}`}>
      <div className={`${p.header} px-4 py-3 text-white`}>
        <p className="text-[13px] font-semibold">{title}</p>
        {subtitle && <p className="text-[12px] text-white/90">{subtitle}</p>}
      </div>
      <div className={`${p.body} px-5 py-4 text-sm text-slate-800`}>{children}</div>
    </div>
  );
}

export default function ProtocolFlowAnaphylaxie() {
  // --- store
  const weightFromStore = useAppStore((s) => s.weightKg);
  const setWeightKg = useAppStore((s) => s.setWeightKg);
  const ageLabel = useAppStore((s) => s.ageLabel);
  const setAgeLabel = useAppStore((s) => s.setAgeLabel);

  const weightKg = clampW(
    Number.isFinite(weightFromStore ?? NaN) ? (weightFromStore as number) : 10
  );

  // ⚠️ Ne synchronise l’âge que si aucun âge n’est déjà présent (évite réinitialisation au retour d’onglet)
  useEffect(() => {
    if (!ageLabel) setAgeLabel(estimateAgeFromWeight(weightKg) ?? "");
  }, [weightKg, ageLabel, setAgeLabel]);

  // --- doses de base dépendantes du poids
  const adrenalineIm = useMemo(
    () =>
      computeDose(
        weightKg,
        DOSING_RULES["adrenaline-im"],
        WEIGHT_OVERRIDES["adrenaline-im"]
      ),
    [weightKg]
  );
  const adrIMmg = Number.isFinite(adrenalineIm.doseMg) ? adrenalineIm.doseMg : NaN;

  // Concentration paramétrable pour l’IM (par défaut 1 mg/mL)
  const ADRENALINE_IM_CONC_MG_PER_ML = 1;
  const adrIMvol = Number.isFinite(adrIMmg) ? adrIMmg / ADRENALINE_IM_CONC_MG_PER_ML : NaN;

  const solumedrolMin = weightKg * 1;
  const solumedrolMax = weightKg * 2;
  const polaramineMg = weightKg * 0.1;

  const ivseUgPerMin = weightKg * 0.1;
  const ivseMlPerMin = Number.isFinite(ivseUgPerMin) ? ivseUgPerMin / 20 : NaN; // 1 mg/50 mL = 20 µg/mL

  const glucagonMg = weightKg < 20 ? 0.5 : 1;
  const methyleneBlue = weightKg * 1.5; // mg (1.5 mg/kg IVL)

  // Calculs supplémentaires
  const fillNaClMl = weightKg * 20; // Remplissage 20 mL/kg
  const aerosolAdrMg = Math.min(weightKg * 0.1, 5); // VAS: 0,1 mg/kg (max 5 mg)
  const bolusAdrUg = weightKg * 1; // Bolus 1 µg/kg

  // Sortie : recommandations en fonction du poids
  const autoinjDoseUg = weightKg > 25 ? 300 : 150; // pour <7,5 kg: pas d'AMM -> on affiche règle générale
  const corticoOralMgPerDay = Math.min(weightKg * 1, 60);

  // --- UI state (branche par défaut = CV)
  const [branch, setBranch] = useState<Branch>("cv");

  return (
    <div className="w-full pb-6">
      {/* HEADER type ACR */}
      <div className="rounded-3xl bg-gradient-to-b from-[#E53935] to-[#FF7043] px-4 pt-6 pb-5 text-white shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
          <span>ANAPHYLAXIE</span>
          <span className="text-[20px]"></span>
        </h1>

        <div className="mt-4 bg-white rounded-3xl p-3 shadow-sm text-gray-900">
          <AgeWeightPicker
            ageLabel={ageLabel ?? ""}
            setAgeLabel={(v) => setAgeLabel(v)}
            weightKg={typeof weightFromStore === "number" ? weightFromStore : null}
            setWeightKg={(v) => setWeightKg(clampW(v ?? weightKg))}
          />
        </div>
      </div>

      {/* CONTENU PRINCIPAL : blocs sans grand fond autour */}
      <div className="mt-4 px-4 sm:px-6 space-y-6">
        {/* Antihistaminique & Corticoïde  */}
        <Block tone="orange" title="Antihistaminique & Corticoïde">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              Solumédrol : <strong>{formatDose(solumedrolMin)}</strong> –{" "}
              <strong>{formatDose(solumedrolMax)}</strong>
              <Calc>1–2 mg/kg IV</Calc>
            </li>
            <li>
              Polaramine : <strong>{formatDose(polaramineMg)}</strong>
              <Calc>0,1 mg/kg</Calc>{" "}
              <span className="text-xs text-rose-700">— ⚠️ hypoTA</span>
            </li>
          </ul>
        </Block>

        <Banner>Atteinte cardio-vasculaire ou respiratoire</Banner>

        {/* Bloc central Adrénaline IM + éviction */}
        <div className="rounded-3xl overflow-hidden shadow-md border border-[#E53935]">
          <div className="bg-[#E53935] px-4 py-3 text-white">
            <p className="text-[13px] font-semibold">Adrénaline IM 0,01 mg/kg</p>
            <p className="text-[12px] text-white/90">
              pure — (max 0,5 mg) · Face latéro-externe 1/3 moyen cuisse
            </p>
            <p className="text-[12px] mt-1">
              Dose calculée : <strong>{formatDose(adrIMmg)}</strong>
              <Calc>
                {formatMl(adrIMvol)} ({ADRENALINE_IM_CONC_MG_PER_ML} mg/mL)
              </Calc>
            </p>
          </div>
          <div className="bg-[#FDEAEA] px-5 py-3">
            <span className="inline-flex items-center rounded-full bg-[#F9A825] px-3 py-1 text-[12px] font-medium text-black/90 shadow-sm">
              éviction allergène
            </span>
          </div>
        </div>

        {/* Encadré symptômes GI */}
        <Block
          tone="yellow"
          title="Symptômes gastro-intestinaux importants ou persistants ?"
        >
          <p className="text-[13px]">+/− éviction allergène + surveillance</p>
        </Block>

        {/* Sélecteur de branche façon “pilule” comme ACR */}
        <div className="rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200 flex items-center">
          <button
            type="button"
            aria-pressed={branch === "cv"}
            onClick={() => setBranch("cv")}
            className={`flex-1 flex flex-col items-center justify-center rounded-full px-3 py-2 text-[11px] font-semibold transition
              ${
                branch === "cv"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
          >
            <span className="text-sm mb-0.5">❤️‍🔥</span>
            <span className="leading-tight text-center">
              Détresse
              <br />
              cardio-vasculaire
            </span>
          </button>

          <button
            type="button"
            aria-pressed={branch === "resp"}
            onClick={() => setBranch("resp")}
            className={`flex-1 flex flex-col items-center justify-center rounded-full px-3 py-2 text-[11px] font-semibold transition
              ${
                branch === "resp"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
          >
            <span className="text-sm mb-0.5">🫁</span>
            <span className="leading-tight text-center">
              Détresse
              <br />
              respiratoire
            </span>
          </button>
        </div>

        {/* --- BRANCHE CV --- */}
        {branch === "cv" && (
          <>
            <Block tone="violet" title="Détresse cardio-vasculaire">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>O₂, scope, VVP, ECG</li>
                <li>Trendelenburg</li>
                <li>
                  Remplissage NaCl 20 mL/kg
                  <Calc>{formatMl(fillNaClMl)}</Calc>
                </li>
              </ul>
            </Block>

            <Arrow />
            <Banner>Absence de réponse après 5–10 min</Banner>

            <Block
              tone="orange"
              title="Adrénaline IVSE : 0,1 µg/kg/min OU Adrénaline IV bolus"
            >
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  Bolus : 1 µg/kg toutes les 1–2’ (dilué)
                  <Calc>{formatUg(bolusAdrUg)}</Calc>
                </li>
                <li>
                  Débit IVSE (calcul) : <strong>{formatUg(ivseUgPerMin)}</strong>/min
                  {Number.isFinite(ivseMlPerMin) && (
                    <span className="text-xs text-slate-600">
                      {" "}
                      — 1 mg/50 mL (20 µg/mL) → {ivseMlPerMin.toFixed(2)} mL/min
                    </span>
                  )}
                </li>
              </ul>
            </Block>

            <Block tone="green" title="Poursuite remplissage">
              <p>NaCl 0,9 % selon réponse hémodynamique</p>
            </Block>

            <Block tone="red" title="Adrénaline IVSE">
              <p>Titrer selon clinique et TA.</p>
            </Block>

            <Block tone="grey" title="Appel réanimateur">
              <p>Escalade de prise en charge.</p>
            </Block>

            <Block
              tone="pink"
              title="↑ Adrénaline IVSE +/− NAD ≥ 0,1 µg/kg/min +/− Glucagon +/− Bleu de méthylène"
            >
              <ul className="list-disc space-y-1.5 pl-5">
                <li>NAD ≥ 0,1 µg/kg/min si hypotension réfractaire</li>
                <li>
                  Glucagon (si bêta-bloquant) :{" "}
                  <strong>{formatDose(glucagonMg)}</strong>
                  <Calc>0,03–0,1 mg/kg toutes 5’ (max 1 mg/dose)</Calc>
                </li>
                <li>
                  Bleu de méthylène : <strong>{formatDose(methyleneBlue)}</strong>
                  <Calc>1,5 mg/kg IVL</Calc>
                </li>
              </ul>
            </Block>
          </>
        )}

        {/* --- BRANCHE RESP --- */}
        {branch === "resp" && (
          <>
            <Block tone="violet" title="Détresse respiratoire">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>O₂, scope, VVP, ECG</li>
                <li>½ assis</li>
                <li>
                  VAS : aérosol adrénaline 0,1 mg/kg (max 5 mg)
                  <Calc>{formatDose(aerosolAdrMg)}</Calc>
                </li>
                <li>VAI : aérosol β₂</li>
              </ul>
            </Block>

            <Arrow />
            <Banner>Absence de réponse après 5–10 min</Banner>

            <Block tone="red" title="Adrénaline IM 0,01 mg/kg (max 0,5 mg)">
              <p>
                Dose calculée : <strong>{formatDose(adrIMmg)}</strong>
                <Calc>
                  {formatMl(adrIMvol)} ({ADRENALINE_IM_CONC_MG_PER_ML} mg/mL)
                </Calc>
              </p>
              <p className="mt-1">Poursuite aérosols</p>
            </Block>

            <Block tone="grey" title="Préparer IT + appel anesthésiste">
              <p>Anticiper voie aérienne difficile · Matériel prêt</p>
            </Block>
          </>
        )}

        {/* --- Sortie & Surveillance — UNIQUEMENT pour la branche RESP --- */}
        {branch === "resp" && (
          <>
            <Block tone="grey" title="Biologie & Surveillance">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  Tryptase : entre 30’ et H2 (tube sec) après début des symptômes puis H24
                </li>
                <li>
                  Surveillance scopée : min 6 h (risque biphasique) — 12–24 h si atteinte
                  sévère
                </li>
              </ul>
            </Block>

            <Block tone="grey" title="Sortie">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  Kit de 2 stylos auto-injecteurs (Anapen®) (150 µg de 7,5 à 25 kg — 300 µg
                  si &gt; 25 kg)
                  <Calc>dose conseillée : {formatUg(autoinjDoseUg)}</Calc>
                </li>
                <li>β₂ mimétiques inhalés (si bronchospasme)</li>
                <li>
                  Corticoïdes oraux 1 mg/kg/j (max 60 mg) 3 j
                  <Calc>{formatDose(corticoOralMgPerDay)} / jour × 3 j</Calc>
                </li>
                <li>Antihistaminiques 5 j</li>
                <li>Consultation allergologique (CR urgences)</li>
                <li>Conseils écrits / éviction allergène</li>
              </ul>
            </Block>
          </>
        )}
      </div>
    </div>
  );
}
