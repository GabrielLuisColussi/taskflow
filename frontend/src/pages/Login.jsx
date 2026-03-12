import { useState } from "react";
import { login } from "../api/auth";

export default function Login() {
    const [email, setEmail] = useState("gabriel@test.com");
    const [password, setPassword] = useState("123456");
    const [msg, setMsg] = useState("");

    async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    const res = await login({ email, password });
    if (!res.success) {
        setMsg(res.message || "Erro no login");
        return;
    }

    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
    }

    return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl p-6 bg-zinc-900 border border-zinc-800 shadow-lg">
            <h1 className="text-xl font-semibold">Login</h1>

            <div className="mt-4 space-y-3">
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
                <button type="submit" className="w-full rounded-xl bg-white text-zinc-950 p-3 font-semibold">
                    Entrar
                </button>
                {msg && <p className="text-red-400 text-sm">{msg}</p>}
            </div>
        </form>
    </div>
    );
}
