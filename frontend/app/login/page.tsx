"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.accessToken;
      localStorage.setItem("token", token);

      router.push("/");
    } catch (err) {
      setError("Invalid email or password");
      console.log("LOGIN ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-12 bg-white">
      <div className="w-full max-w-md">
        
        {/* CARD */}
        <div className="rounded-lg border border-gray-300 p-8 bg-white">
          
          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-3">
              Login
            </h1>
            <p className="text-xl text-gray-700">Sign in to your account</p>
          </div>

          {/* FORM */}
          <div className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-100 border border-red-300 text-red-700 text-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xl font-semibold text-black mb-3">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-5 py-4 rounded-lg border border-gray-300 text-xl text-black placeholder-gray-500 focus:outline-none focus:border-black"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xl font-semibold text-black mb-3">
                Password
              </label>
              <input
                type="password"
                className="w-full px-5 py-4 rounded-lg border border-gray-300 text-xl text-black placeholder-gray-500 focus:outline-none focus:border-black"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && login()}
              />
            </div>

            <button
              onClick={login}
              disabled={loading}
              className="w-full py-4 px-4 rounded-lg bg-black text-white text-xl font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-600 text-xl">New user?</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* REGISTER LINK */}
          <Link href="/register">
            <button className="w-full py-4 px-4 rounded-lg border-2 border-gray-300 text-black text-xl font-semibold hover:bg-gray-50">
              Create Account
            </button>
          </Link>
        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-600 text-lg mt-8">
          By signing in, you agree to our Terms
        </p>
      </div>
    </div>
  );
}