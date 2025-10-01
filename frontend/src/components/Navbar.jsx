import { Link, useNavigate } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { logoutUser} from "../api/user.api";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { queryClient } from "../main";
import { toast } from "sonner";

function Navbar() {
 
	const auth = useSelector(state => state.auth)
	const {user, isAuthenticated} = auth
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const logoutMutation = useMutation({
		mutationFn: logoutUser,	
		onSuccess: () => {
			toast.success("logged out successfully")

			navigate({to:"/auth"})
			dispatch(logout())

			queryClient.clear();

		}
	})
	const handleLogout = async () => {
		await logoutMutation.mutateAsync()	
	}
	
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          LinkShrink
        </Link>
        <div className="flex items-center">
          {isAuthenticated ? (
            <>
              <span className="text-gray-800 mr-4">{user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out"
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
