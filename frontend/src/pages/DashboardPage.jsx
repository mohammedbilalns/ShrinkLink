import UrlForm from "../components/UrlForm";
import UrlsList from "../components/UrlList";

export default function Dashboard() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col bg-gradient-to-br from-[#f3f4ff] to-[#e0f7fa] text-gray-800">
      {/* 🔹 Header */}
      <div className="py-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          LinkShrink
        </h1>
      </div>

      {/* 🔹 Fixed Form Section */}
      <div className="px-4 flex justify-center sticky top-0 z-10 bg-gradient-to-br from-[#f3f4ff] to-[#e0f7fa] pb-4">
        <div className="w-full max-w-2xl">
          <UrlForm />
        </div>
      </div>

      {/* 🔹 Scrollable List */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="max-w-4xl mx-auto">
          <UrlsList />
        </div>
      </div>
    </div>
  );
}

