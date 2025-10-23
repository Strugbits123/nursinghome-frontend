"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://http://13.61.57.246:5000/api";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(""); // clear previous error

  try {
    const endpoint = isLogin ? `${API_URL}/api/auth/login` : `${API_URL}/api/auth/register`;
    const body = isLogin
      ? { email: email.trim().toLowerCase(), password: password.trim() }
      : {
          email: email.trim().toLowerCase(),
          password: password.trim(),
          fullName: fullName.trim(),
        };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Something went wrong");
      toast.error(data.message || "Something went wrong");
      return;
    }

    if (isLogin && data.token) {
      localStorage.setItem("token", data.token);
      toast.success("Logged in successfully!");
    } else {
      toast.success("Registered successfully!");
    }

    onOpenChange(false); // close modal
    setEmail("");
    setPassword("");
    setFullName("");
  } catch (err) {
    console.error(err);
    setError("Network error");
    toast.error("Network error");
  } finally {
    setLoading(false);
  }
};


  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in z-[9998]" />

        {/* Content */}
        <Dialog.Content
          className="fixed top-1/2 left-1/2 w-full max-w-md 
          -translate-x-1/2 -translate-y-1/2 
          rounded-2xl border border-[#f3f4f6] bg-white p-6 
          shadow-xl animate-in fade-in-90 zoom-in-95 
          z-[9999]"
        >
        <div className="relative mb-4 flex items-center justify-center">
          <Dialog.Title className="text-xl font-semibold text-[#c71f37] text-center">
            {isLogin ? "Login" : "Create Account"}
          </Dialog.Title>

          <Dialog.Close asChild>
            <button className="absolute right-0 top-0 p-1 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </Dialog.Close>
        </div>


          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#f3f4f6] p-2 focus:border-[#c71f37] focus:ring-[#c71f37]"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#f3f4f6] p-2 focus:border-[#c71f37] focus:ring-[#c71f37]"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#f3f4f6] p-2 focus:border-[#c71f37] focus:ring-[#c71f37]"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#c71f37] hover:bg-[#a9182c] text-white py-2 font-medium disabled:opacity-50"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-[#c71f37] font-medium hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-[#c71f37] font-medium hover:underline"
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}