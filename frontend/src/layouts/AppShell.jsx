import { useState } from "react";
import {
  CheckSquare,
  Clock3,
  LayoutDashboard,
  Menu,
  Settings,
  TimerReset,
  X,
} from "lucide-react";
import { cn } from "../lib/utils/cn";
import UserMenu from "../components/ui/UserMenu";

const navItems = [
  { key: "overview", label: "Visão geral", icon: LayoutDashboard },
  { key: "tasks", label: "Tarefas", icon: CheckSquare },
  { key: "today", label: "Hoje", icon: Clock3 },
  { key: "overdue", label: "Atrasadas", icon: TimerReset },
  { key: "settings", label: "Configurações", icon: Settings },
];

function SidebarContent({
  activeKey,
  onNavigate,
  onLogout,
  onSettings,
  user,
  workspaceName,
  mobile = false,
}) {
  return (
    <div className="flex h-full flex-col">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
          TaskFlow
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {workspaceName || "Workspace de tarefas"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Um painel mais limpo, focado em operação diária e leitura rápida.
        </p>
      </div>

      <nav className="mt-10 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate?.(item.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition",
                activeKey === item.key
                  ? "bg-zinc-100 text-zinc-950"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100"
              )}
            >
              <Icon size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4">
          <p className="text-sm font-medium text-zinc-200">
            Workspace ativo
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            {workspaceName || "Workspace de tarefas"}
          </p>
        </div>

        <UserMenu
          user={user}
          onLogout={onLogout}
          onSettings={onSettings}
          compact={mobile}
        />
      </div>
    </div>
  );
}

export default function AppShell({
  children,
  activeKey = "tasks",
  onNavigate,
  onLogout,
  user,
  workspaceName,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleNavigate(key) {
    onNavigate?.(key);
    setMobileMenuOpen(false);
  }

  function handleSettings() {
    onNavigate?.("settings");
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-zinc-800/80 bg-zinc-900/60 px-5 py-6 backdrop-blur lg:flex lg:flex-col">
          <SidebarContent
            activeKey={activeKey}
            onNavigate={onNavigate}
            onLogout={onLogout}
            onSettings={handleSettings}
            user={user}
            workspaceName={workspaceName}
          />
        </aside>

        <div className="flex min-h-screen flex-col">
          <div className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/90 px-4 py-4 backdrop-blur lg:hidden">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
                TaskFlow
              </p>
              <p className="mt-1 text-sm font-medium text-zinc-100">
                {workspaceName || "Workspace"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <UserMenu
                user={user}
                onLogout={onLogout}
                onSettings={handleSettings}
                compact
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>

          {children}
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fechar menu"
          />

          <aside className="absolute left-0 top-0 h-full w-[88%] max-w-sm border-r border-zinc-800 bg-zinc-950 px-5 py-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            <SidebarContent
              activeKey={activeKey}
              onNavigate={handleNavigate}
              onLogout={onLogout}
              onSettings={handleSettings}
              user={user}
              workspaceName={workspaceName}
              mobile
            />
          </aside>
        </div>
      ) : null}
    </div>
  );
}