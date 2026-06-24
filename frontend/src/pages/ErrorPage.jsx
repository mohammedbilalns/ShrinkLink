import { Link } from "@tanstack/react-router";

const ErrorPage = ({ error }) => {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 bg-gradient-to-br from-emerald-50 to-teal-50">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-4">
        ShrinkLink
      </h1>
      <div className="text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-xl text-gray-600 mb-4 max-w-md">
          Something went wrong. We're working on fixing it.
        </p>
        {error && (
          <p className="text-sm text-gray-500 mb-8 max-w-md overflow-hidden">
            {error.message || error.toString()}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            Go Back Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
