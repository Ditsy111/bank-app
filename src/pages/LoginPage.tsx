import { useState } from "react";
import { loginApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      const token =
        await loginApi(
          email,
          password
        );

      login(token);

      navigate("/");

    } catch {

      setError(
        "Invalid email or password"
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">

      <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-sm">

        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border border-border rounded-lg px-3 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full border border-border rounded-lg px-3 py-2"
          />

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg"
          >
            Login
          </button>

          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">
              New here?{" "}
            </span>

            <Link
              to="/register"
              className="text-primary font-semibold hover:underline">
                Create an account
            </Link>
          </div>

        </form>
      </div>

    </div>
  );
}