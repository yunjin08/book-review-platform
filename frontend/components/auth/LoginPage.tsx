'use client';

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
export default function LoginPage() {
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginButtonClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="flex flex-col bg-white text-black items-center justify-center min-h-screen p-4 gap-12">
      <div className="w-full max-w-md px-4 md:px-8 py-12 md:py-24 bg-slate-800 rounded-lg shadow-lg">
        <h2 className="text-lg md:text-2xl font-bold text-white mb-6 text-center">
          Login
        </h2>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleLoginButtonClick}>
          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm text-white mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="px-4 py-2 text-sm md:text-base rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Enter your username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm text-white mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="px-4 py-2 text-sm md:text-base rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 text-sm md:text-base bg-white text-slate-800 font-semibold rounded-md hover:bg-slate-100 transition"
          >
            Log In
          </button>

          <div className="text-sm text-white text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
