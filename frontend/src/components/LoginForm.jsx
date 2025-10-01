import * as Label from "@radix-ui/react-label";
import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";
import { loginUser } from "../api/user.api";
import { useSelector } from "react-redux";

function LoginForm({ toggleForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
	const auth = useSelector((state) => state.auth)
	console.log(auth)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      setOpen(true);
      return;
    }
    setError("");
    try {
      await loginUser(email, password );
      
      setOpen(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to login.");
      setOpen(true);
    }
  };

  return (
    <Toast.Provider swipeDirection="right">
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
      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        className="bg-white border border-gray-300 rounded-lg px-4 py-3 shadow-lg"
      >
        <Toast.Title className="font-semibold text-gray-800">
          {error ? "Error" : "Success!"}
        </Toast.Title>
        <Toast.Description
          className={`text-sm ${error ? "text-red-600" : "text-gray-600"}`}
        >
          {error ? (
            <span>{error}</span>
          ) : (
            <span>Login successful!</span>
          )}
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-5 right-5 z-50 w-[300px] max-w-full outline-none" />
    </Toast.Provider>
  );
}

export default LoginForm;
