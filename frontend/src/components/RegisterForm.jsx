import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import { registerUser } from "../api/user.api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../store/slices/authSlice";

function RegisterForm({ toggleForm }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    
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
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    if (password.trim() !== confirmPassword.trim()) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const data = await registerUser(name, email, password);
      dispatch(login(data.user));
      toast.success(data.message || "Registration successful!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err?.response?.data?.message || "Failed to register.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl px-6 py-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label.Root htmlFor="name" className="font-semibold">
            Name
          </Label.Root>
          <input
            id="name"
            type="text"
            placeholder="your name"
            required
            className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(event) => setName(event.target.value)}
            value={name}
            disabled={isLoading}
          />
        </div>
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
            className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            disabled={isLoading}
          />
        </div>
        <div>
          <Label.Root htmlFor="confirmPassword" className="font-semibold">
            Confirm Password
          </Label.Root>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(event) => setConfirmPassword(event.target.value)}
            value={confirmPassword}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        Already have an account?{" "}
        <button 
          onClick={() => toggleForm('login')} 
          className="text-blue-600 hover:underline cursor-pointer"
          disabled={isLoading}
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default RegisterForm;
