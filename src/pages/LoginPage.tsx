import { useState } from "react";
import {
  loginApi,
  requestOtp
} from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useBank } from "../context/BankContext";

export default function LoginPage() {

  const navigate = useNavigate();

  const { login, verifyOtp } = useAuth();

  const { refreshData } = useBank();

  // =========================
  // EMAIL + PASSWORD
  // =========================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // PHONE + OTP
  // =========================

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  // =========================
  // ERROR
  // =========================

  const [error, setError] = useState("");

  // =========================
  // EMAIL/PASSWORD LOGIN
  // =========================

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError("");

    try {

      const response = await loginApi(
        email,
        password
      );

      await login(
        response.accessToken,
        response.refreshToken
      );

      await refreshData();

      navigate("/");

    } catch {

      setError(
        "Invalid email or password"
      );

    }
  }

  // =========================
  // REQUEST OTP
  // =========================

  async function handleRequestOtp() {

    setError("");

    try {

      await requestOtp(
        phoneNumber,
        "LOGIN"
      );

      setOtpSent(true);

    } catch {

      setError(
        "Failed to send OTP"
      );

    }
  }

  // =========================
  // VERIFY OTP
  // =========================

  async function handleVerifyOtp() {

    setError("");

    try {

      await verifyOtp(
        phoneNumber,
        otp,
        "LOGIN"
      );

      await refreshData();

      navigate("/");

    } catch {

      setError(
        "Invalid OTP"
      );

    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-background">

      <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-sm">

        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>


        {/* ================================= */}
        {/* EMAIL + PASSWORD LOGIN */}
        {/* ================================= */}

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
              setPassword(e.target.value)
            }
            className="w-full border border-border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg"
          >
            Login
          </button>

        </form>


        {/* ================================= */}
        {/* OR */}
        {/* ================================= */}

        <div className="flex items-center gap-3 my-6">

          <div className="flex-1 border-t border-border" />

          <span className="text-sm text-muted-foreground">
            OR
          </span>

          <div className="flex-1 border-t border-border" />

        </div>


        {/* ================================= */}
        {/* PHONE + OTP LOGIN */}
        {/* ================================= */}

        <div className="space-y-4">

          <h2 className="text-lg font-semibold">
            Login with Phone
          </h2>


          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber(e.target.value)
            }
            className="w-full border border-border rounded-lg px-3 py-2"
          />


          {!otpSent && (

            <button
              type="button"
              onClick={handleRequestOtp}
              className="w-full bg-primary text-white py-2 rounded-lg"
            >
              Send OTP
            </button>

          )}


          {otpSent && (

            <>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
                className="w-full border border-border rounded-lg px-3 py-2"
              />


              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full bg-primary text-white py-2 rounded-lg"
              >
                Verify OTP
              </button>

            </>

          )}

        </div>


        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {error && (

          <div className="text-red-500 text-sm mt-4">
            {error}
          </div>

        )}


        {/* ================================= */}
        {/* REGISTER */}
        {/* ================================= */}

        <div className="text-center mt-6">

          <span className="text-sm text-muted-foreground">
            New here?{" "}
          </span>

          <Link
            to="/register"
            className="text-primary font-semibold hover:underline"
          >
            Create an account
          </Link>

        </div>

      </div>

    </div>
  );
}