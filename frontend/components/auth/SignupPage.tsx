'use client'
import Link from "next/link";
import AnimatedBookBackground from "../ui/book-background";

export default function SignupPage() {
  return (
    <>
      <AnimatedBookBackground />
      <div className="flex flex-col text-black items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md px-4 md:px-8 py-16 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Sign Up
          </h2>
          <form className="flex flex-col gap-4 w-full">
            <div className="flex flex-col">
              <label htmlFor="username" className="text-sm mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="px-4 py-2 rounded-md text-sm md:text-base border-2 border-slate-800 bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="px-4 py-2 border-2 border-slate-800 text-sm md:text-base rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="px-4 py-2 border-2 border-slate-800 rounded-md text-sm md:text-base bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="Create a password"
                required
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="confirmPassword"
                className="text-sm mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="px-4 py-2 rounded-md text-sm md:text-base border-2 border-slate-800 bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 px-4 py-2 text-sm md:text-base bg-slate-800 text-white font-semibold rounded-md hover:bg-slate-700 transition"
            >
              Sign Up
            </button>
          </form>

          <div className="text-sm text-center mt-4">
            Already logged in?{" "}
            <Link href="/login" className="font-bold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
