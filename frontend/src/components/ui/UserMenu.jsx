import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { cn } from "../../lib/utils/cn";

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function UserMenu({
  user,
  onLogout,
  onSettings,
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const initials = getInitials(user?.name);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "inline-flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-left text-zinc-100 transition hover:border-zinc-700 hover:bg-zinc-800",
          compact ? "justify-center px-2.5" : "w-full"
        )}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-950">
          {initials}
        </span>

        {!compact ? (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">
              {user?.name || "Workspace"}
            </span>
            <span className="block truncate text-xs text-zinc-400">
              {user?.email || "Seu ambiente"}
            </span>
          </span>
        ) : null}

        {!compact ? <ChevronDown size={16} className="text-zinc-500" /> : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 rounded-3xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
          <div className="rounded-2xl bg-zinc-900 px-4 py-3">
            <p className="text-sm font-medium text-zinc-100">
              {user?.name || "Workspace"}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              {user?.email || "Conta ativa"}
            </p>
          </div>

          <div className="mt-2 space-y-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onSettings?.();
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            >
              <Settings size={16} />
              Configurações
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            >
              <User size={16} />
              Minha conta
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-rose-200 transition hover:bg-rose-500/10"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}