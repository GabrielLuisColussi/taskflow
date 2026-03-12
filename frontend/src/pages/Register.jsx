import { useState } from "react";
import { register } from "../api/auth";

export default function Register() {
  const [name, setName] = useState("Gabriel");
  const [email, setEmail] = useState("gabriel@test.com");
  const [password, setPassword] = useState("123456");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    const res = await register({ name, email, password });
    if (!res.success) {
      setMsg(res.message || "Erro ao cadastrar");
      return;
    }

    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl p-6 bg-zinc-900 border border-zinc-800">
        <h1 className="text-xl font-semibold">Criar conta</h1>

        <div className="mt-4 space-y-3">
          <input
            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
          />
          <input
            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
          />
          <button className="w-full rounded-xl bg-white text-zinc-950 p-3 font-semibold">
            Cadastrar
          </button>

          {msg && <p className="text-red-400 text-sm">{msg}</p>}

          <a className="text-sm text-zinc-400 underline" href="/login">
            Já tenho conta
          </a>
        </div>
      </form>
    </div>
  );
}
