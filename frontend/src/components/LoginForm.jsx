import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import { loginUser } from "../api/user.api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import {login} from "../store/slices/authSlice"
import {  useNavigate } from "@tanstack/react-router";

function LoginForm({ toggleForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
	const dispatch = useDispatch()
	const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required");
      return;
    }
    try {
      const data = await loginUser(email, password);	
			dispatch(login(data.user))
      toast.success("Login successful!");
			navigate({to:"/dashboard"})	
    } catch (err) {
      console.log("error from login",err);
      toast.error(err?.response?.data?.message || "Failed to login.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl px-6 py-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label.Root htmlFor="email" className="font-semibold">
            Email
          </Label.Root>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            onInput={(event) => setEmail(event.target.value)}
            value={email}
          />
        </div>
        <div>
          <Label.Root htmlFor="password">
            Password
          </Label.Root>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            onInput={(event) => setPassword(event.target.value)}
            value={password}
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition w-full cursor-pointer"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        Don't have an account?{" "}
        <button onClick={() => toggleForm('register')} className="text-blue-600 hover:underline cursor-pointer">
          Register
        </button>
      </p>
    </div>
  );
}

export default LoginForm;
