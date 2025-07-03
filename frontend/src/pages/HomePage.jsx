import * as React from "react";
import UrlForm from "../components/UrlForm";

export default function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-[#f3f4ff] to-[#e0f7fa] text-gray-800">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
        LinkShrink
      </h1>
      <p className="text-lg text-center mb-10 max-w-md">
        Transform your long URLs into short, shareable links in seconds
      </p>

      <UrlForm />

      {/* Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <p className="text-purple-600 font-bold text-xl">1M+</p>
          <p className="text-sm text-gray-600">Links shortened</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md">
          <p className="text-blue-600 font-bold text-xl">99.9%</p>
          <p className="text-sm text-gray-600">Uptime</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md">
          <p className="text-green-600 font-bold text-xl">Free</p>
          <p className="text-sm text-gray-600">Forever</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-xs text-gray-500 text-center">
        <p>
          © 2024 LinkShrink. Made with <span className="text-red-500">♥</span>{" "}
          for the web.
        </p>
        <div className="flex gap-4 justify-center mt-2 text-gray-400">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">API</a>
        </div>
      </footer>
    </main>
  );
}
