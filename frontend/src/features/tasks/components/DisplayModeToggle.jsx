import { LayoutGrid, TableProperties } from "lucide-react";
import { cn } from "../../../lib/utils/cn";

const modes = [
  { value: "cards", label: "Cards", icon: LayoutGrid },
  { value: "table", label: "Tabela", icon: TableProperties },
];

export default function DisplayModeToggle({ value, onChange }) {
  return (
    <div
      className="inline-flex rounded-2xl border border-zinc-800 bg-zinc-900 p-1"
      role="tablist"
      aria-label="Modo de visualização"
    >
      {modes.map((mode) => {
        const Icon = mode.icon;
        const selected = value === mode.value;

        return (
          <button
            key={mode.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(mode.value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
              selected
                ? "bg-zinc-100 text-zinc-950"
                : "text-zinc-400 hover:text-zinc-100"
            )}
          >
            <Icon size={15} />
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}