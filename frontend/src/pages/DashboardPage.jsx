import UrlForm from "../components/UrlForm";
import UrlsList from "../components/UrlList";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col bg-gradient-to-br from-emerald-50 to-teal-50 text-gray-800">
      {/* Header */}
      <div className="py-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
          ShrinkLink
        </h1>
        <p className="text-gray-600 mt-2">Create and manage your short URLs</p>
      </div>

      {/* Fixed Form Section */}
      <div className="px-4 flex justify-center pb-6">
        <div className="w-full max-w-2xl">
          <UrlForm />
        </div>
      </div>

      {/* Non-scrollable List Section */}
      <div className="flex-1 px-4 pb-6">
        <div className="max-w-4xl mx-auto">
          <Suspense
            fallback={
              <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl mx-auto flex flex-col">
                <div className="flex justify-between items-center px-6 pt-6 pb-4">
                  <h2 className="text-xl font-bold text-gray-800">Your URLs</h2>
                </div>
                <div className="px-6 pb-4">
                  <table className="w-full border border-gray-200 rounded-lg text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left px-4 py-2">Short URL</th>
                        <th className="text-left px-4 py-2">Original URL</th>
                        <th className="text-center px-4 py-2">Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, i) => (
                        <tr key={`skeleton-${i}`} className="border-t">
                          <td className="px-4 py-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                          </td>
                          <td className="px-4 py-2">
                            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <div className="h-4 bg-gray-200 rounded w-8 mx-auto animate-pulse"></div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-lg opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Previous
                  </button>
                  <span className="text-gray-700">Page 1 of 1</span>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-lg opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Next
                  </button>
                </div>
              </div>
            }
          >
            <UrlsList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
