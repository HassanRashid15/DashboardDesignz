import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [status, setStatus] = useState("input"); // input, verifying, success, error, expired
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown
  const [isExpired, setIsExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  // Get email from location state (passed from signup)
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (timeLeft > 0 && status === "input") {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && status === "input") {
      setIsExpired(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, status]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setMessage("Please enter the verification code.");
      return;
    }

    if (isExpired) {
      setMessage("Code has expired. Please request a new code.");
      return;
    }

    setStatus("verifying");
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-email-code",
        {
          email: email,
          verificationCode: verificationCode,
        }
      );

      if (response.data.success) {
        // Don't store token or user data - redirect to login
        setStatus("success");
        setMessage(response.data.message);

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      setStatus("error");
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes("expired")) {
          setStatus("expired");
          setMessage(
            "Verification code has expired. Please request a new one."
          );
        } else {
          setMessage(errorMessage || "Invalid verification code.");
        }
      } else {
        setMessage("An error occurred while verifying your email.");
      }
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    setIsResending(true);
    try {
      await axios.post("http://localhost:5000/api/auth/resend-verification", {
        email,
      });
      setMessage(
        "Verification email sent successfully! Please check your inbox."
      );

      // Reset timer and expired state
      setTimeLeft(60);
      setIsExpired(false);
      setStatus("input");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to send verification email."
      );
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "input":
        return (
          <div>
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Verify Your Email
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a verification code to <strong>{email}</strong>
              </p>

              {/* Timer Display */}
              <div className="mt-4">
                {!isExpired ? (
                  <div className="text-sm">
                    <span className="text-gray-600">Code expires in: </span>
                    <span
                      className={`font-mono font-bold ${
                        timeLeft <= 10 ? "text-red-600" : "text-blue-600"
                      }`}
                    >
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-red-600 font-medium">
                    Code has expired
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    isExpired ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Enter the 6-digit code"
                  maxLength="6"
                  disabled={isExpired}
                />
              </div>

              <button
                type="submit"
                disabled={isExpired}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isExpired
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isExpired ? "Code Expired" : "Verify Email"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  onClick={resendVerification}
                  disabled={isResending}
                  className="font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </button>
              </p>
            </div>
          </div>
        );

      case "verifying":
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Verifying your email address...
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Email Verified!
            </h3>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
            <p className="mt-2 text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        );

      case "expired":
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Code Expired
            </h3>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
            <button
              onClick={resendVerification}
              disabled={isResending}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isResending ? "Sending New Code..." : "Get New Code"}
            </button>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Verification Failed
            </h3>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
            <button
              onClick={() => setStatus("input")}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {renderContent()}

          {status === "input" && (
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
