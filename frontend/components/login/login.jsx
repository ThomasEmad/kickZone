"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SkillLevel from "./skillLevel.jsx";
import { authAPI } from "../../services/apiService.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(email, password);

      // Store user data and tokens
      if (response.data) {
        const userData = {
          username: response.data.username,
          email: response.data.email,
          id: response.data.id || null,
          type: response.data.type || "player",
        };

        const tokens = {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        };

        // Use the login function from useAuth hook
        login(userData, tokens);

        // Clear form data
        setEmail("");
        setPassword("");
        setPasswordConfirm("");
        setName("");
        setNumber("");
        setRole("");

        // Redirect based on user type
        if (userData.type === "player") {
          router.push("/player/stadiums");
        } else if (userData.type === "owner") {
          router.push("/owner/dashboard");
        } else if (userData.type === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/player/stadiums");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid email or password",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !passwordConfirm || !number || !role) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const signupData = {
        username: name,
        email,
        password,
        password2: passwordConfirm,
        phone_number: number,
        position: role,
        user_type: "player", // Default to player for sign up
      };

      console.log("Sending signup data:", signupData);

      const response = await authAPI.register(signupData);

      console.log("Register response:", response);

      if (response.status === 201 || response.status === 200) {
        // Account created successfully, switch to login
        setIsSignUp(false);
        setName("");
        setEmail("");
        setPassword("");
        setPasswordConfirm("");
        setNumber("");
        setRole("");
        setError("");
        alert("Account created successfully! Please login.");
      }
    } catch (err) {
      console.error("Registration error:", err);

      let errorMessage = "Error creating account. Please try again.";
      let fieldErrors = {};

      // Handle different error response formats
      if (err.response?.data) {
        const errorData = err.response.data;

        // If error is an object with field errors
        if (typeof errorData === "object" && !Array.isArray(errorData)) {
          // Check if this is a field error format from DRF
          const isFieldError = Object.values(errorData).some(
            (val) => Array.isArray(val) || typeof val === "string",
          );

          if (isFieldError) {
            // Map field errors to a readable format
            Object.entries(errorData).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                fieldErrors[field] = messages[0];
              } else {
                fieldErrors[field] = messages;
              }
            });

            // Create a formatted error message
            const errors = Object.entries(fieldErrors)
              .map(([field, message]) => {
                const fieldName = field.replace(/_/g, " ").toUpperCase();
                return `${fieldName}: ${message}`;
              })
              .join("\n");

            errorMessage =
              errors || "Error creating account. Please try again.";
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Login Tab */}
      {!isSignUp ? (
        <div className="space-y-5 sm:space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#004D03] mb-1 sm:mb-2">
              Login
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Sign in to book your favorite pitches
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Email Input */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg border-2 border-gray-300 focus:border-[#004D03] focus:outline-none transition-colors bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg border-2 border-gray-300 focus:border-[#004D03] focus:outline-none transition-colors bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">⚠️</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-700 text-sm sm:text-base mb-1">
                      Login Error
                    </h3>
                    <div className="text-red-600 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/forgetPassword"
                className="text-xs sm:text-sm text-[#004D03] hover:text-[#001D01] font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#004D03] to-[#006B0F] text-white py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span className="hidden sm:inline">Signing in...</span>
                  <span className="sm:hidden">Signing...</span>
                </>
              ) : (
                <>Sign In</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-2 sm:py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-white text-gray-600">or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setEmail("");
                  setPassword("");
                  setPasswordConfirm("");
                  setName("");
                  setNumber("");
                  setRole("");
                  setError("");
                }}
                className="text-[#004D03] font-bold hover:text-[#001D01] transition-colors"
              >
                Create New Account
              </button>
            </p>
          </div>
        </div>
      ) : (
        // Sign Up Tab
        <div className="space-y-5 sm:space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#004D03] mb-1 sm:mb-2">
              Create Account
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Join our community today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-3 sm:space-y-4">
            {/* Name Input */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg border-2 border-gray-300 focus:border-[#004D03] focus:outline-none transition-colors bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg border-2 border-gray-300 focus:border-[#004D03] focus:outline-none transition-colors bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Phone Input */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="+201234567890"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg border-2 border-gray-300 focus:border-[#004D03] focus:outline-none transition-colors bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg border-2 border-gray-300 focus:border-[#004D03] focus:outline-none transition-colors bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg border-2 border-gray-300 focus:border-[#004D03] focus:outline-none transition-colors bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Position Selection */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Select Your Position
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { value: "GK", label: "Goalkeeper" },
                  { value: "Defender", label: "Defender" },
                  { value: "Midfielder", label: "Midfielder" },
                  { value: "Striker", label: "Striker" },
                  { value: "Winger", label: "Winger" },
                  { value: "AllRounder", label: "All-Rounder" },
                ].map((position) => (
                  <label
                    key={position.value}
                    className={`flex items-center p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      role === position.value
                        ? "border-[#004D03] bg-[#004D03] bg-opacity-10 text-white"
                        : "border-gray-300  hover:border-[#004D03]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="position"
                      value={position.value}
                      checked={role === position.value}
                      onChange={(e) => setRole(e.target.value)}
                      className="mr-2 accent-[#004D03]"
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {position.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skill Level Component */}
            <SkillLevel />

            {/* Error Message */}
            {error && (
              <div className="p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">⚠️</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-700 text-sm sm:text-base mb-1">
                      Registration Error
                    </h3>
                    <div className="text-red-600 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#004D03] to-[#006B0F] text-white py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span className="hidden sm:inline">Creating Account...</span>
                  <span className="sm:hidden">Creating...</span>
                </>
              ) : (
                <>Create Account</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-2 sm:py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-white text-gray-600">or</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setEmail("");
                  setPassword("");
                  setPasswordConfirm("");
                  setName("");
                  setNumber("");
                  setRole("");
                  setError("");
                }}
                className="text-[#004D03] font-bold hover:text-[#001D01] transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
