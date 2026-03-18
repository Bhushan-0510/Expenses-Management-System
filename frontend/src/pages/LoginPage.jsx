import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import { Label, TextInput } from "../components/Input.jsx";
import { login, register } from "../services/auth.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await register(email, password, rememberMe);
      } else {
        await login(email, password, rememberMe);
      }
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || (mode === "signup" ? "Sign up failed" : "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  const isSignup = mode === "signup";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white w-full p-4 md:p-6 rounded-lg shadow" style={{ maxWidth: "480px" }}>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase text-gray-500">
            {isSignup ? "Create account" : "Welcome back"}
          </p>
          <h1 className="mt-1 text-lg font-semibold text-gray-900">
            {isSignup ? "Sign up to get started" : "Sign in to continue"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your spending with a calm, focused dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <TextInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="pe-5"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-600 hover:underline bg-transparent"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="rememberMe"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-slate-900"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="ml-2 text-sm text-gray-600" htmlFor="rememberMe">
              Remember me on this device
            </label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? (isSignup ? "Creating account..." : "Signing in...") : isSignup ? "Sign up" : "Sign in"}
          </Button>
        </form>

        <div className="mt-4 text-sm text-gray-500 text-center">
          {isSignup ? (
            <>
              Already have an account? {" "}
              <button
                type="button"
                className="text-slate-900 font-medium hover:underline p-0"
                onClick={() => setMode("login")}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              New here? {" "}
              <button
                type="button"
                className="text-slate-900 font-medium hover:underline p-0"
                onClick={() => setMode("signup")}
              >
                Create an account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

