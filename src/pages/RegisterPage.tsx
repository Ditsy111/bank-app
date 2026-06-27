import { useState } from "react";
import { registerApi } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");

  async function handleRegister(
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (password !== confirmPassword) {

      setError("Passwords do not match");

      return;
    }

    try {

      await registerApi(
        email,
        password
      );

      navigate("/login");

    } catch (error: any) {

  if (error.message.includes("400")) {
    setError("Password must be at least 6 characters");
  } else {
    setError("Registration failed");
  }

}
  }

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="w-full max-w-md p-6 border rounded-xl">

        <h1 className="text-3xl font-bold mb-6">
          Register
        </h1>

        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full border px-3 py-2 rounded"
          />

          {error && (
            <div className="text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded"
          >
            Register
          </button>

          <Link
            to="/login"
            className="text-primary"
          >
            Already have an account?
          </Link>

        </form>

      </div>

    </div>
  );
}