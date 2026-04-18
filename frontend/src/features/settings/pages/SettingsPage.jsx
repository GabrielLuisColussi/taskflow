import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../../layouts/AppShell";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Switch from "../../../components/ui/Switch";
import Toast from "../../../components/ui/Toast";
import { clearUserSession, getStoredUser } from "../../../lib/utils/auth-user";
import {
  getWorkspaceSettings,
  saveWorkspaceSettings,
} from "../../../lib/utils/workspace-settings";

export default function SettingsPage() {
  const navigate = useNavigate();
  const user = useMemo(() => getStoredUser(), []);
  const initialSettings = useMemo(() => getWorkspaceSettings(), []);

  const [form, setForm] = useState(initialSettings);
  const [toast, setToast] = useState({
    open: false,
    type: "success",
    message: "",
  });

  function showToast(type, message) {
    setToast({ open: true, type, message });
    window.setTimeout(() => {
      setToast((current) => ({ ...current, open: false }));
    }, 3000);
  }

  function handleNavigate(key) {
    if (key === "settings") return;

    if (key === "today") {
      navigate("/dashboard?view=today");
      return;
    }

    if (key === "overdue") {
      navigate("/dashboard?view=overdue");
      return;
    }

    navigate("/dashboard");
  }

  function handleLogout() {
    clearUserSession();
    navigate("/login", { replace: true });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextSettings = saveWorkspaceSettings({
      workspaceName: form.workspaceName?.trim() || "Workspace de tarefas",
      dailyGoal: Number(form.dailyGoal) || 5,
      showFocusBoard: Boolean(form.showFocusBoard),
      compactCards: Boolean(form.compactCards),
      defaultDisplayMode: form.defaultDisplayMode || "cards",
    });

    setForm(nextSettings);
    showToast("success", "Configurações salvas com sucesso.");
  }

  return (
    <>
      <AppShell
        activeKey="settings"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        user={user}
        workspaceName={form.workspaceName}
      >
        <header className="border-b border-zinc-800/80 bg-zinc-950/80 px-4 py-5 backdrop-blur md:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
              Preferências
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Configurações do workspace
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Ajuste comportamento, modo de exibição e preferências da sua área de trabalho.
            </p>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
                Geral
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Informações principais do seu ambiente.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Nome do workspace
                  </label>
                  <Input
                    value={form.workspaceName}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        workspaceName: event.target.value,
                      }))
                    }
                    placeholder="Ex.: Operação diária"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Meta de foco
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={form.dailyGoal}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        dailyGoal: event.target.value,
                      }))
                    }
                    placeholder="5"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
                Experiência
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Ajustes visuais e operacionais da dashboard.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Exibição padrão
                  </label>
                  <Select
                    value={form.defaultDisplayMode}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        defaultDisplayMode: event.target.value,
                      }))
                    }
                  >
                    <option value="cards">Cards</option>
                    <option value="table">Tabela</option>
                  </Select>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <Switch
                  checked={form.showFocusBoard}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      showFocusBoard: value,
                    }))
                  }
                  label="Mostrar painel de foco"
                  description="Exibe o bloco com Hoje, Atrasadas e Concluídas no topo da dashboard."
                />

                <Switch
                  checked={form.compactCards}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      compactCards: value,
                    }))
                  }
                  label="Usar modo compacto nos cards"
                  description="Reduz o espaço vertical dos cards da lista para uma leitura mais densa."
                />
              </div>
            </section>

            <div className="flex justify-end">
              <Button type="submit">Salvar configurações</Button>
            </div>
          </form>
        </main>
      </AppShell>

      <Toast open={toast.open} type={toast.type} message={toast.message} />
    </>
  );
}