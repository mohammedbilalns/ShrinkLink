import { Link } from "@tanstack/react-router";

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 bg-gradient-to-br from-emerald-50 to-teal-50">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-4">
        ShrinkLink
      </h1>
      <div className="text-center">
        <h2 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4">404</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
