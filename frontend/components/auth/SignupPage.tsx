import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex flex-col bg-white text-black items-center justify-center w-screen min-h-screen p-4">
      <div className="w-full max-w-xl px-4 md:px-8 py-16 bg-slate-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Sign Up
        </h2>
        <form className="flex flex-col gap-4 w-full">
          <div className="flex flex-col md:flex-row w-full gap-4 flex-1">
            <div className="flex flex-col flex-1">
              <label htmlFor="first_name" className="text-sm text-white mb-1">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                className="px-4 py-2 rounded-md text-sm md:text-base bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="First name"
                required
              />
            </div>
            <div className="flex flex-col w-full flex-1">
              <label htmlFor="last_name" className="text-sm text-white mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                className="px-4 py-2 rounded-md text-sm md:text-base bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm text-white mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="px-4 py-2 rounded-md text-sm md:text-base bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm text-white mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="px-4 py-2 text-sm md:text-base rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm text-white mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="px-4 py-2 rounded-md text-sm md:text-base bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="text-sm text-white mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="px-4 py-2 rounded-md text-sm md:text-base bg-white text-black focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 text-sm md:text-base bg-white text-slate-800 font-semibold rounded-md hover:bg-slate-100 transition cursor-pointer hover:opacity-80"
          >
            Sign Up
          </button>
        </form>

        <div className="text-sm text-white text-center mt-4">
          Already logged in?{" "}
          <Link href="/login" className="font-bold hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
