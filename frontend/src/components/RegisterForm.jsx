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
	const dispatch = useDispatch()
	const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error 
			return;
		}

		if(password.trim() !== confirmPassword.trim()){
			toast.error("Passwords do not match");
			return;
		}

		try {
			const data = await registerUser( name, email, password );	
			dispatch(login(data.user))
			toast.success(data.message || "Register successful!");
			navigate({to:"/dashboard"})
		} catch (err) {
			console.log(err);
			toast.error(err?.response?.data?.message || "Failed to register.");
		}
	};

	return (
      <div className="bg-white shadow-lg rounded-2xl px-6 py-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label.Root htmlFor="username" className="font-semibold">
              Name
            </Label.Root>
            <input
              id="name"
              type="text"
              placeholder="your name"
              required
              className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              onInput={(event) => setName(event.target.value)}
              value={name}
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
              onInput={(event) => setEmail(event.target.value)}
              value={email}
            />
          </div>
          <div>
            <Label.Root htmlFor="password" >
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
					   <div>
            <Label.Root htmlFor="password" >
              Confirm  Password
            </Label.Root>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              onInput={(event) => setConfirmPassword(event.target.value)}
              value={confirmPassword}
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition w-full cursor-pointer"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <button onClick={() => toggleForm('login')} className="text-blue-600 hover:underline cursor-pointer">
            Login
          </button>
        </p>
      </div>
        );
}

export default RegisterForm;
