"use client";

type Props = {
  value: "list" | "grid";
  onChange: (v: "list" | "grid") => void;
};

export default function ViewToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
      {[
        { k: "list" as const, label: "Vue liste" },
        { k: "grid" as const, label: "Vue grille" },
      ].map((opt) => {
        const active = value === opt.k;
        return (
          <button
            key={opt.k}
            type="button"
            onClick={() => onChange(opt.k)}
            className={[
              "px-3 py-1.5 text-sm rounded-full transition-colors",
              active
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
