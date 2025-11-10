"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import {
  findPosoByWeight,
  entriesOfSection,
  unitLine,
  formatNum,
  calcVolumeFromConc,
} from "@/data/posology";

/* ===============================
   Sections par protocole (posologie)
   =============================== */
const SECTION_MAP: Record<string, string[]> = {
  // Asthme aigu grave
  "aag": [
    "constantes",
    "iot",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
    "exacerbation_asthme",
  ],

  // Arrêt cardio-respiratoire (enfant)
  "acr-enfant": [
    "constantes",
    "iot",
    "acr",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
  ],

  // Anaphylaxie
  "anaphylaxie": [
    "constantes",
    "iot",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
  ],

  // Antalgiques (tolère les deux slugs)
  "antalgique": [
    "constantes",
    "antalgiques",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
  ],
  "antalgiques": [
    "constantes",
    "antalgiques",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
  ],

  // Choc hémorragique
  "choc-hemorragique": [
    "constantes",
    "iot",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
  ],

  // État de mal épileptique
  "eme": [
    "constantes",
    "iot",
    "isr",
    "perfusion_transfusion",
    "sedation",
    "etat_de_choc",
    "eme",
  ],
};

// normalisation + alias pour tolérer variations d’URL
function getSectionsForSlug(slug: string): string[] {
  const key = slug
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

  const aliases: Record<string, string> = {
    "arret-cardio": "acr-enfant",
    "arret-cardiorespiratoire": "acr-enfant",
    "asthme-severe": "aag",
    "choc-hemorragique-enfant": "choc-hemorragique",
  };

  const normalized = aliases[key] ?? key;
  return SECTION_MAP[normalized] ?? [];
}

/* ===============================
   Titres lisibles
   =============================== */
const TITLES: Record<string, string> = {
  constantes: "CONSTANTES",
  iot: "IOT",
  isr: "ISR",
  perfusion_transfusion: "PERF / TRANSF",
  sedation: "SÉDATION",
  etat_de_choc: "ÉTAT DE CHOC",
  exacerbation_asthme: "EXACERBATION ASTHME",
  acr: "ACR",
  eme: "EME",
  divers: "DIVERS",
};

type Props = { slug: string };

export default function PosologySections({ slug }: Props) {
  const weightKg = useAppStore((s) => s.weightKg) ?? 10;
  const setWeightKg = useAppStore((s) => s.setWeightKg);

  const entry = useMemo(() => findPosoByWeight(weightKg), [weightKg]);
  const sectionsToShow = getSectionsForSlug(slug);

  return (
    <div className="space-y-6">
      {/* Saisie du poids en haut (les fiches démarrent à 3 kg) */}
      <div>
        <label className="text-slate-600 text-sm">Poids (kg)</label>
        <input
          type="number"
          min={3}
          value={weightKg}
          onChange={(e) => setWeightKg(Number(e.target.value))}
          className="mt-1 w-full rounded-full border border-black/10 shadow-sm px-4 py-2"
        />
      </div>

      {!entry ? (
        <div className="text-sm text-slate-500">
          Aucune donnée posologique disponible pour {formatNum(weightKg, 0)} kg.
        </div>
      ) : (
        sectionsToShow.map((secKey) => (
          <SectionBlock key={secKey} entry={entry} sectionKey={secKey} />
        ))
      )}
    </div>
  );
}

/* =======================
   Rendu d’une section
   ======================= */
function SectionBlock({ entry, sectionKey }: { entry: any; sectionKey: string }) {
  const title = TITLES[sectionKey] ?? sectionKey.toUpperCase();

  // CONSTANTES
  if (sectionKey === "constantes") {
    const c = entry.constantes ?? entry.data?.constantes;
    const fcStr =
      c?.fc_min && c?.fc_max
        ? `${c.fc_min}-${c.fc_max}/min`
        : typeof c?.fc === "string"
        ? c.fc
        : "—";
    const frStr =
      c?.fr_min && c?.fr_max
        ? `${c.fr_min}-${c.fr_max}/min`
        : c?.fr
        ? `${c.fr}/min`
        : c?.fr_text ?? "—";

    return (
      <Card title={title}>
        <Rows>
          <Row label="FC" value={fcStr} />
          <Row label="PAS" value={c?.pas ? `${c.pas} mmHg` : "—"} />
          <Row label="FR" value={frStr} />
        </Rows>
      </Card>
    );
  }

  // IOT
  if (sectionKey === "iot") {
    const i = entry.iot ?? entry.data?.iot;
    const tubeText =
      i?.tube?.size || i?.tube?.type
        ? `${i.tube.type ?? ""} ${i.tube.size ?? ""}`.trim()
        : i?.sit ?? "—";

    const distanceText =
      typeof i?.distance_cm === "number" || typeof i?.distance_cm_min === "number"
        ? i?.distance_cm_min && i?.distance_cm_max
          ? `${i.distance_cm_min}-${i.distance_cm_max} cm`
          : i?.distance_cm
          ? `${i.distance_cm} cm`
          : "—"
        : i?.distance ?? "—";

    const sngText =
      typeof i?.sng_ch === "number" ? `${i.sng_ch} CH` : i?.sng ?? "—";

    return (
      <Card title={title}>
        <Rows>
          <Row label="Lame" value={i?.lame ?? "—"} />
          <Row label="Tube" value={tubeText} />
          <Row label="Distance" value={distanceText} />
          <Row label="SNG" value={sngText} />
        </Rows>
      </Card>
    );
  }

  // Récup brute (permet de gérer les sections “clé → texte”)
  const raw =
    (entry.sections && entry.sections[sectionKey]) ??
    entry[sectionKey] ??
    (entry.data && entry.data[sectionKey]) ??
    null;

  // 1) Cas “clé → texte” (ex. perfusion_transfusion dans certaines fiches)
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const entries = Object.entries(raw);
    const allStrings = entries.length > 0 && entries.every(([, v]) => typeof v === "string");
    if (allStrings) {
      return (
        <Card title={title} divided>
          {entries.map(([k, v]) => (
            <SimpleLine key={k} name={labelize(k)} text={String(v)} />
          ))}
        </Card>
      );
    }
  }

  // 2) Cas “médicaments / sous-objets”
  const pairs = entriesOfSection(entry, sectionKey);
  if (pairs.length > 0) {
    return (
      <Card title={title} divided>
        {pairs.map(([key, obj]) => (
          <DrugLine key={key} name={labelize(key)} data={obj} />
        ))}
      </Card>
    );
  }

  // 3) Fallback : affiche JSON lisible (utile tant que tout n’est pas normalisé)
  return (
    <Card title={title}>
      <pre className="px-4 py-3 text-xs text-slate-600 whitespace-pre-wrap">
        {raw ? (typeof raw === "object" ? JSON.stringify(raw, null, 2) : String(raw)) : "—"}
      </pre>
    </Card>
  );
}

/* =======================
   Lignes de rendu
   ======================= */
function SimpleLine({ name, text }: { name: string; text: string }) {
  return (
    <div className="px-4 py-3 text-sm">
      <div className="font-medium">{name}</div>
      <div className="text-xs text-slate-600 mt-1">• {text}</div>
    </div>
  );
}

function DrugLine({ name, data }: { name: string; data: any }) {
  // 1) Affichage numérique si présent (JSON normalisé)
  const dose =
    data?.dose_mg ??
    data?.dose_ug ??
    data?.dose_mg_per_h ??
    data?.dose_ug_per_min ??
    data?.dose_ug_per_kg_per_min ??
    data?.dose_mg_per_kg ??
    undefined;

  const doseUnit =
    typeof data?.dose_mg === "number" ? "mg" :
    typeof data?.dose_ug === "number" ? "µg" :
    typeof data?.dose_mg_per_h === "number" ? "mg/h" :
    typeof data?.dose_ug_per_min === "number" ? "µg/min" :
    typeof data?.dose_ug_per_kg_per_min === "number" ? "µg/kg/min" :
    typeof data?.dose_mg_per_kg === "number" ? "mg/kg" :
    undefined;

  const vol = data?.volume_ml as number | undefined;
  const rate = data?.rate_ml_per_h as number | undefined;
  const conc =
    data?.prep?.final_conc_mg_per_ml ??
    data?.prep?.stock_conc_mg_per_ml ??
    undefined;
  const computedVol = vol == null ? calcVolumeFromConc(data?.dose_mg, conc) : undefined;

  // 2) Champs texte (issus des cartes quand pas encore normalisés)
  const textFields: { label: string; key: string }[] = [
    { label: "Dose", key: "dose" },
    { label: "Bolus", key: "bolus" },
    { label: "Continu", key: "continu" },
    { label: "Volume", key: "volume" },
    { label: "Débit", key: "debit" },
    { label: "Dilution", key: "dilution" },
    { label: "Forme", key: "forme" },
    { label: "Prépa", key: "prep_text" },
    { label: "Durée", key: "duration" },
    { label: "Note", key: "note" },
    { label: "Dose", key: "dose_text" },
    { label: "Débit", key: "rate_text" },
  ];

  const hasNumeric =
    typeof dose === "number" ||
    typeof vol === "number" ||
    typeof rate === "number" ||
    typeof computedVol === "number";

  return (
    <div className="px-4 py-3 text-sm text-slate-800">
      <div className="font-medium">{name}</div>

      {/* Bloc numérique (si dispo) */}
      {hasNumeric && (
        <div className="mt-1 grid grid-cols-1 gap-1 text-[13px] text-slate-700">
          {typeof dose === "number" && (
            <div>
              <span className="text-slate-500">Dose&nbsp;:&nbsp;</span>
              <strong>{unitLine(dose, doseUnit)}</strong>
              {typeof data?.admin_over_min === "number" && (
                <span className="text-slate-500"> sur {formatNum(data.admin_over_min, 0)} min</span>
              )}
            </div>
          )}

          {(typeof vol === "number" || typeof computedVol === "number") && (
            <div>
              <span className="text-slate-500">Volume&nbsp;:&nbsp;</span>
              <strong>{formatNum(vol ?? computedVol, 2)} mL</strong>
              {typeof conc === "number" && (
                <span className="text-slate-500"> @ {formatNum(conc, 2)} mg/mL</span>
              )}
            </div>
          )}

          {typeof rate === "number" && (
            <div>
              <span className="text-slate-500">Débit&nbsp;:&nbsp;</span>
              <strong>{formatNum(rate, 2)} mL/h</strong>
            </div>
          )}
        </div>
      )}

      {/* Bloc texte (quand les champs numériques ne sont pas encore normalisés) */}
      <div className="mt-2 space-y-1 text-xs text-slate-600">
        {textFields.map(({ label, key }) =>
          typeof data?.[key] === "string" && data[key].trim() !== "" ? (
            <div key={key}>• {label} : {data[key]}</div>
          ) : null
        )}
      </div>
    </div>
  );
}

/* =======================
   Composants UI de base
   ======================= */
function Card({
  title,
  children,
  divided = false,
}: {
  title: string;
  children: React.ReactNode;
  divided?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white border border-black/10 shadow-sm">
      <div className="px-4 py-2 border-b text-xs tracking-wide text-slate-600">{title}</div>
      <div className={divided ? "divide-y" : ""}>{children}</div>
    </div>
  );
}

function Rows({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-3 text-sm text-slate-800 space-y-1">{children}</div>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

/* =======================
   Helpers libellés
   ======================= */
function labelize(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\bivse\b/i, "IVSE")
    .replace(/\bae\b/i, "AE")
    .replace(/\biv\b/i, "IV")
    .replace(/\bmgso4\b/i, "MgSO₄")
    .replace(/\bcee\b/i, "CEE")
    .replace(/\bid\b/i, "ID")
    .replace(/\bch\b/i, "CH")
    .replace(/\bpas\b/i, "PAS")
    .replace(/\bfr\b/i, "FR")
    .replace(/^\w/, (m) => m.toUpperCase());
}
