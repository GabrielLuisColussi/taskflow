import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../../api/auth";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { saveUserSession } from "../../../lib/utils/auth-user";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await register(form);

      if (!response.success) {
        setMessage(response.message || "Erro ao cadastrar");
        return;
      }

      saveUserSession({
        token: response.data.token,
        email: form.email,
        name: form.name,
      });

      navigate("/dashboard", { replace: true });
    } catch {
      setMessage("Não foi possível criar a conta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden border-r border-zinc-800/80 bg-zinc-900/50 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
              TaskFlow
            </p>
            <h1 className="mt-6 max-w-lg text-5xl font-semibold tracking-tight">
              Crie um workspace organizado desde o primeiro acesso.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-zinc-400">
              Um fluxo de tarefas mais limpo, coerente e preparado para evoluir como produto de portfólio.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Fluxo de operação mais intuitivo",
              "Estrutura modular e escalável",
              "Interface mais próxima de SaaS profissional",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-4"
              >
                <CheckCircle2 size={18} className="text-emerald-300" />
                <span className="text-sm text-zinc-300">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500 lg:hidden">
              TaskFlow
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight lg:mt-0">
              Criar conta
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Monte seu ambiente de tarefas com uma estrutura mais profissional desde o primeiro acesso.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <Input
                placeholder="Seu nome"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
              />

              <Input
                placeholder="Seu e-mail"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
              />

              <Input
                type="password"
                placeholder="Crie uma senha"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
              />

              {message ? <p className="text-sm text-rose-300">{message}</p> : null}

              <Button type="submit" className="w-full" loading={isSubmitting}>
                Criar conta
                <ArrowRight size={16} />
              </Button>
            </form>

            <p className="mt-6 text-sm text-zinc-400">
              Já tem conta?{" "}
              <Link
                className="font-medium text-zinc-100 underline underline-offset-4"
                to="/login"
              >
                Entrar
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}