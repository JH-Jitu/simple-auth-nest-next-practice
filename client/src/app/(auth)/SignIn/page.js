"use client";
// SignIn.js
import Button from "@/components/Button/Button";
import useAuthAPI from "@/context/API/AuthAPI";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();
  const { loading, error, loginUser } = useAuthAPI();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loginUser(email, password).then((res) =>
      console.log({ "ei result ta ki hobe": res })
    );
  };

  return (
    <div className="bg-opacity-100 bg-gradient-to-r from-blue-900 via-blue-500 to-blue-100">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white bg-opacity-60 p-8 rounded-xl backdrop-blur-md w-full max-w-md animate-disExpand">
          <h2 className="text-2xl font-bold text-[#03032e] mb-6">LOG IN</h2>
          <p className="text-sm text-[#03032e] mb-6">
            Log in with your data that you entered during your registration
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-[#03032e] mb-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md text-[#03032e] placeholder-gray-400"
                placeholder="Your E-mail Address"
                onChange={handleChangeEmail}
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium text-[#03032e] mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md text-[#03032e] placeholder-gray-400"
                placeholder="Type your password"
                onChange={handleChangePassword}
                required
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-[#03032e]"
                >
                  Remember Me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Forgot Password?
              </a>
            </div>

            <Button
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              text="Sign In"
              fill
              onClick={handleSubmit}
              disabled={loading}
            />
          </form>

          {error && <p className="mt-4 text-red-500">{error}</p>}

          <p className="mt-4 text-center text-[#03032e]">
            Already have an account?
            <Link className="text-blue-500 hover:underline ml-1" href="/SignUp">
              SIGN UP
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
