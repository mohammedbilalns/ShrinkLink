import { Link, useNavigate } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { logoutUser } from "../api/user.api";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { queryClient } from "../main";
import { toast } from "sonner";

function Navbar() {
  const auth = useSelector((state) => state.auth);
  const { user, isAuthenticated } = auth;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries(["currentUser"]);
      queryClient.clear();
      dispatch(logout());
      navigate({ to: "/auth" });
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to logout");
    },
  });

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <nav
      className="bg-white/80 backdrop-blur-md shadow-md p-4 sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
          aria-label="ShrinkLink Home"
        >
          ShrinkLink
        </Link>
        <div className="flex items-center">
          {isAuthenticated ? (
            <>
              <span
                className="text-gray-800 mr-4"
                aria-label={`Logged in as ${user.name}`}
              >
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isLoading}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Logout"
              >
                {logoutMutation.isLoading ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out"
              aria-label="Login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
