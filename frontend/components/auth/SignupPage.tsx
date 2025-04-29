'use client'
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedBookBackground from "../ui/book-background";
import { useAuthStore } from "@/store/auth";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegisterButtonClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const data = {
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    };

    try {
      await register(data);
      router.push('/login');
    } catch (error) {
      console.error('Register failed:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <>
      <AnimatedBookBackground />
      <div className="flex flex-col text-black items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md px-4 md:px-8 py-16 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Sign Up
          </h2>
          {error && (
            <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          <form className="flex flex-col gap-3 w-full" onSubmit={handleRegisterButtonClick}>
            <div className="flex flex-col">
              <label htmlFor="username" className="text-sm mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border-2 border-slate-800 text-sm md:text-base rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="flex flex-1 gap-2">
              <div className="flex-1">
                <label htmlFor="first_name" className="text-sm mb-1 block">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-2 py-2 border-2 border-slate-800 text-sm md:text-base rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="last_name" className="text-sm mb-1 block">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-2 py-2 border-2 border-slate-800 text-sm md:text-base rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            Already have an account?{" "}
            <Link href="/login" className="font-bold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}