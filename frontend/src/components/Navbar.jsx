import { Link } from "@tanstack/react-router";

function Navbar() {
  const user = { username: "dummyuser" }; // Dummy user object

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          LinkShrink
        </Link>
        <div className="flex items-center">
          {user ? (
            <>
              <span className="text-gray-800 mr-4">{user.username}</span>
              <button
                onClick={() => {}}
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