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
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-4">
      <div className="card w-100 p-4 p-md-5" style={{maxWidth: '480px'}}>
        <div className="mb-4">
          <p className="small fw-semibold text-uppercase text-muted">
            {isSignup ? "Create account" : "Welcome back"}
          </p>
          <h1 className="mt-1 h5 fw-semibold text-dark">
            {isSignup ? "Sign up to get started" : "Sign in to continue"}
          </h1>
          <p className="mt-1 small text-muted">
            Track your spending with a calm, focused dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
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
          <div className="mb-3">
            <Label htmlFor="password">Password</Label>
            <div className="position-relative">
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
                className="position-absolute top-50 end-0 translate-middle-y btn btn-link small text-decoration-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label small" htmlFor="rememberMe">
              Remember me on this device
            </label>
          </div>
          {error && <p className="small text-danger">{error}</p>}
          <Button type="submit" className="w-100 mt-2" disabled={loading}>
            {loading ? (isSignup ? "Creating account..." : "Signing in...") : isSignup ? "Sign up" : "Sign in"}
          </Button>
        </form>

        <div className="mt-4 small text-muted text-center">
          {isSignup ? (
            <>
              Already have an account? {" "}
              <button
                type="button"
                className="btn btn-link p-0"
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
                className="btn btn-link p-0"
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

