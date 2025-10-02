import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUserUrls } from "../api/user.api";
import { baseUrl } from "../utils/constants";
import { toast } from "sonner";

function UrlsList() {
  const [page, setPage] = useState(1);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const limit = 5;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["userUrls", page],
    queryFn: () => getAllUserUrls(page, limit),
    keepPreviousData: true,
    refetchOnMount: false,
    staleTime: 60 * 5000,
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to load URLs");
    },
  });

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(baseUrl + text);
      setCopiedUrl(text);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy URL");
    }
  };

  const handleRetry = () => {
    queryClient.invalidateQueries("userUrls");
  };
	const handleUrlClick = (shortUrl, event) =>{
		event.preventDefault();
		setTimeout(() => queryClient.invalidateQueries("userUrls"), 1000);
		window.open(baseUrl + shortUrl, "_blank", "noopener,noreferrer");
	}

  const placeholderRows = [...Array(limit)].map((_, i) => (
    <tr key={`placeholder-${i}`} className="border-t">
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
  ));

  // Mobile card view for URLs
  const MobileUrlCard = ({ url }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase">
          Short URL
        </span>
        <span className="text-xs font-semibold text-gray-500 uppercase">
          Clicks
        </span>
      </div>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 mr-2">
          <a
            href={baseUrl + url.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm break-all"
          >
            {baseUrl + url.shortUrl}
          </a>
          <button
            onClick={() => handleCopy(url.shortUrl)}
            className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 transition whitespace-nowrap"
            aria-label={`Copy ${baseUrl + url.shortUrl}`}
          >
            {copiedUrl === url.shortUrl ? "Copied!" : "Copy"}
          </button>
        </div>
        <span className="text-sm font-medium">{url.clicks}</span>
      </div>
      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
        Original URL
      </div>
      <div className="text-sm text-gray-700 break-all">{url.fullUrl}</div>
    </div>
  );

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full max-w-4xl mx-auto flex flex-col">
      <div className="flex justify-between items-center px-6 pt-6 pb-4">
        <h2 className="text-xl font-bold text-gray-800">Your URLs</h2>
        {isFetching && !isLoading && (
          <span className="text-sm text-gray-500">Updating...</span>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block px-6 pb-4 overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg text-sm min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 min-w-[200px]">Short URL</th>
              <th className="text-left px-4 py-2 min-w-[300px]">
                Original URL
              </th>
              <th className="text-center px-4 py-2 min-w-[80px]">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              placeholderRows
            ) : isError ? (
              <tr>
                <td colSpan="3" className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center">
                    <p className="text-red-500 mb-4">
                      {error?.response?.data?.message || "Failed to load URLs"}
                    </p>
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Try Again
                    </button>
                  </div>
                </td>
              </tr>
            ) : data?.urls?.length > 0 ? (
              data.urls.map((url) => (
                <tr
                  key={url._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={baseUrl + url.shortUrl}
												onClick={(event)=>handleUrlClick(url.shortUrl,event)}
                        className="text-blue-600 underline break-all"
                      >
                        {baseUrl + url.shortUrl}
                      </a>
                      <button
                        onClick={() => handleCopy(url.shortUrl)}
                        className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 transition whitespace-nowrap"
                        aria-label={`Copy ${baseUrl + url.shortUrl}`}
                      >
                        {copiedUrl === url.shortUrl ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 break-all">{url.fullUrl}</td>
                  <td className="px-4 py-2 text-center">{url.clicks}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center text-gray-500">
                    <svg
                      className="w-16 h-16 mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <p className="text-lg font-medium mb-1">No URLs found</p>
                    <p className="text-sm">
                      Create your first short URL to get started
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden px-6 pb-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(limit)].map((_, i) => (
              <div
                key={`mobile-placeholder-${i}`}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="px-4 py-8 text-center">
            <div className="flex flex-col items-center">
              <p className="text-red-500 mb-4">
                {error?.response?.data?.message || "Failed to load URLs"}
              </p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : data?.urls?.length > 0 ? (
          <div>
            {data.urls.map((url) => (
              <MobileUrlCard key={url._id} url={url} />
            ))}
          </div>
        ) : (
          <div className="px-4 py-8 text-center">
            <div className="flex flex-col items-center text-gray-500">
              <svg
                className="w-16 h-16 mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <p className="text-lg font-medium mb-1">No URLs found</p>
              <p className="text-sm">
                Create your first short URL to get started
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
        <button
          className="px-4 py-2 bg-gray-200 cursor-pointer rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || isFetching}
          aria-label="Previous page"
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {page} of {data?.totalPages || 1}
        </span>

        <button
          className="px-4 cursor-pointer py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
          onClick={() =>
            setPage((prev) =>
              !data?.totalPages || page >= data.totalPages ? prev : prev + 1,
            )
          }
          disabled={!data?.totalPages || page >= data.totalPages || isFetching}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UrlsList;
