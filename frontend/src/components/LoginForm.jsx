import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import { loginUser } from "../api/user.api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { useNavigate } from "@tanstack/react-router";

function LoginForm({ toggleForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    
    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await loginUser(email, password);
      dispatch(login(data.user));
      toast.success("Login successful!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err?.response?.data?.message || "Failed to login.");
    } finally {
      setIsLoading(false);
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
            className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            disabled={isLoading}
          />
        </div>
        <div>
          <Label.Root htmlFor="password" className="font-semibold">
            Password
          </Label.Root>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        Don't have an account?{" "}
        <button 
          onClick={() => toggleForm('register')} 
          className="text-emerald-600 hover:underline cursor-pointer"
          disabled={isLoading}
        >
          Register
        </button>
      </p>
    </div>
  );
}

export default LoginForm;
