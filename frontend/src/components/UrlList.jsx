import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserUrls } from "../api/user.api";
import { baseUrl } from "../utils/constants";

function UrlsList() {
  const [page, setPage] = useState(1);
  const [copiedUrl, setCopiedUrl] = useState(null); 
  const limit = 5;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userUrls", page],
    queryFn: () => getAllUserUrls(page, limit),
    keepPreviousData: true,
  });

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(baseUrl + text);
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 2000); 
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-600">Loading URLs...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">
        {error?.message || "Failed to load URLs"}
      </p>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl mx-auto flex flex-col gap-4 h-[calc(100vh-16rem)]">
      <h2 className="text-xl font-bold text-gray-800 px-6 pt-6">Your URLs</h2>

      {/* 🔹 Scrollable Table */}
      <div className="overflow-auto px-6 py-4 flex-1">
        <table className="w-full border border-gray-200 rounded-lg text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="text-left px-4 py-2">Short URL</th>
              <th className="text-left px-4 py-2">Original URL</th>
              <th className="text-center px-4 py-2">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {data?.urls?.length > 0 ? (
              data.urls.map((url) => (
                <tr key={url._id} className="border-t">
                  <td className="px-4 py-2 flex items-center gap-2">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {url.shortUrl}
                    </a>
                    <button
                      onClick={() => handleCopy(url.shortUrl)}
                      className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      {copiedUrl === url.shortUrl ? "Copied!" : "Copy"}
                    </button>
                  </td>
                  <td className="px-4 py-2 break-all">{url.fullUrl}</td>
                  <td className="px-4 py-2 text-center">{url.clicks}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-3 text-center text-gray-500">
                  No URLs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {page} of {data?.totalPages || 1}
        </span>

        <button
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          onClick={() =>
            setPage((prev) =>
              !data?.totalPages || page >= data.totalPages ? prev : prev + 1
            )
          }
          disabled={!data?.totalPages || page >= data.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UrlsList;

