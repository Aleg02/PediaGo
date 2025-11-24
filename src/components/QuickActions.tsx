import React from "react";

type QuickAction = {
    label: string;
    emoji: string;
    query: string;
    color: string;
};

const ACTIONS: QuickAction[] = [
    { label: "Fièvre", emoji: "🌡️", query: "fievre", color: "bg-rose-50 text-rose-700 border-rose-100 hover:border-rose-200" },
    { label: "Convulsions", emoji: "⚡", query: "convulsion", color: "bg-amber-50 text-amber-700 border-amber-100 hover:border-amber-200" },
    { label: "Allergie", emoji: "🐝", query: "anaphylaxie", color: "bg-yellow-50 text-yellow-700 border-yellow-100 hover:border-yellow-200" },
    { label: "Cardio", emoji: "❤️", query: "cardio", color: "bg-red-50 text-red-700 border-red-100 hover:border-red-200" },
    { label: "Trauma", emoji: "🤕", query: "trauma", color: "bg-slate-50 text-slate-700 border-slate-100 hover:border-slate-200" },
    { label: "Intox", emoji: "🤢", query: "intoxication", color: "bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-200" },
];

interface QuickActionsProps {
    onSelect: (query: string) => void;
    className?: string;
}

export default function QuickActions({ onSelect, className = "" }: QuickActionsProps) {
    return (
        <div className={`grid grid-cols-3 gap-2 sm:gap-3 ${className}`}>
            {ACTIONS.map((action) => (
                <button
                    key={action.query}
                    onClick={() => onSelect(action.query)}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-sm active:scale-95 ${action.color}`}
                >
                    <span className="text-2xl mb-1" role="img" aria-label={action.label}>
                        {action.emoji}
                    </span>
                    <span className="text-xs font-semibold">{action.label}</span>
                </button>
            ))}
        </div>
    );
}
