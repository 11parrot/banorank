import { useState } from "react";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      // 🔥 URL Inteligente: Detecta si está en producción (Render) o en tu PC local
      const BASE_URL = window.location.hostname === "localhost" 
        ? "http://localhost:3000" 
        : "https://banorank-backend.onrender.com";

      const url = mode === "login"
        ? `${BASE_URL}/api/auth/login`
        : `${BASE_URL}/api/auth/register`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      // ❌ ERROR HANDLING
      if (!res.ok || !data.token) {
        setError(data.error || "Error en autenticación");
        setLoading(false);
        return;
      }

      // 💾 Guardar token + username (IMPORTANTE PARA SOCKET)
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      
      // 🚀 Login al app
      onLogin(data.token);

    } catch (err) {
      setError("Error de conexión con el servidor");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-neutral-900">
      <div className="w-[380px] bg-zinc-950 border border-zinc-800 p-8 rounded-2xl">
        <h1 className="text-white text-3xl font-bold text-center">
          🚽 BañoRank
        </h1>

        <p className="text-gray-400 text-center text-sm mt-2">
          {mode === "login" ? "Login" : "Crear cuenta"}
        </p>

        <div className="mt-6 space-y-3">
          <input
            className="w-full p-3 bg-zinc-900 text-white rounded-lg"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full p-3 bg-zinc-900 text-white rounded-lg"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-orange-500 text-white p-3 rounded-lg disabled:opacity-50"
          >
            {loading
              ? "Cargando..."
              : mode === "login"
              ? "Entrar"
              : "Crear cuenta"}
          </button>

          <p
            className="text-center text-gray-400 text-sm cursor-pointer"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login"
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </p>
        </div>
      </div>
    </div>
  );
}