import { useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  requestPasswordReset,
  resetPassword
} from "../api/authApi";
import AdminTransactionsPage from "../pages/AdminTransactionsPage";

export default function ForgotPasswordPage() {

  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleRequestOtp() {

    setError("");
    setMessage("");

    try {

      await requestPasswordReset(phoneNumber);

      setOtpSent(true);
      setMessage("OTP generated successfully");

    } catch {

      setError("Failed to request password reset");

    }
  }


  async function handleResetPassword(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {

      await resetPassword(
        phoneNumber,
        otp,
        newPassword
      );

      setMessage("Password reset successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch {

      setError("Invalid OTP or password reset failed");

    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="w-full max-w-md p-6">

        <h1 className="text-2xl font-bold mb-6">
          Forgot Password
        </h1>


        {!otpSent ? (

          <div>

            <label className="block mb-2">
              Phone Number
            </label>

            <input
              type="text"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value)
              }
              className="w-full border p-2 mb-4"
              placeholder="+917798454867"
            />

            <button
              type="button"
              onClick={handleRequestOtp}
              className="w-full bg-blue-600 text-white p-2"
            >
              Request OTP
            </button>

          </div>

        ) : (

          <form onSubmit={handleResetPassword}>

            <label className="block mb-2">
              OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              className="w-full border p-2 mb-4"
              placeholder="Enter OTP"
            />


            <label className="block mb-2">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              className="w-full border p-2 mb-4"
              placeholder="Enter new password"
            />


            <label className="block mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="w-full border p-2 mb-4"
              placeholder="Confirm new password"
            />


            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2"
            >
              Reset Password
            </button>

          </form>

        )}


        {message && (
          <p className="text-green-600 mt-4">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-600 mt-4">
            {error}
          </p>
        )}


        <div className="mt-6">

          <Link
            to="/login"
            className="text-blue-600"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}