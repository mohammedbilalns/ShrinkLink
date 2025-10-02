import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import { createShortUrl } from "../api/shortUrl.api";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { queryClient } from "../main";
import QRCodeGenerator from "./QrCode";
import { useMutation } from "@tanstack/react-query";

function UrlForm() {
	console.log("url form")
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [hasGeneratedLink, setHasGeneratedLink] = useState(false);

  const auth = useSelector((state) => state.auth);
  const { isAuthenticated } = auth;

  const createUrlMutation = useMutation({
    mutationFn: ({ url, slug }) =>
      createShortUrl(url, isAuthenticated ? slug : undefined),
    onSuccess: (data) => {
      setShortUrl(data);
      setHasGeneratedLink(true);
      queryClient.invalidateQueries("userUrls");

      navigator.clipboard
        .writeText(data)
        .then(() => {
          toast.success(`URL: ${data} copied to clipboard.`);
        })
        .catch(() => {
          toast.error("Failed to copy to clipboard.");
        });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to shorten URL.");
    },
  });

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
    if (shortUrl) {
      setShortUrl("");
      setHasGeneratedLink(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("URL is required");
      return;
    }

    // URL validation
    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    createUrlMutation.mutate({ url, slug });
  };

  const handleReset = () => {
    setShortUrl("");
    setHasGeneratedLink(false);
  };

	const handleUrlClick = (event) =>{
		event.preventDefault();
		setTimeout(() => queryClient.invalidateQueries("userUrls"), 1000);
		window.open(shortUrl, "_blank", "noopener,noreferrer");
	}
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="bg-white shadow-lg rounded-2xl px-6 py-6 w-full flex flex-col gap-4">
        <Label.Root htmlFor="url" className="text-sm font-medium text-gray-700">
          Enter your long URL
        </Label.Root>
        <input
          id="url"
          type="url"
          placeholder="https://example.com/very-long-url-that-needs-shortening"
          required
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none w-full"
          onChange={handleUrlChange}
          value={url}
          disabled={createUrlMutation.isLoading}
        />

        {isAuthenticated && (
          <>
            <Label.Root
              htmlFor="slug"
              className="text-sm font-medium text-gray-700"
            >
              Custom Slug (optional)
            </Label.Root>
            <input
              id="slug"
              type="text"
              placeholder="your-custom-slug"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none w-full"
              onChange={(event) => setSlug(event.target.value)}
              value={slug}
              disabled={createUrlMutation.isLoading}
            />
          </>
        )}
        {shortUrl && (
          <div className="flex justify-center align-center">
            <QRCodeGenerator value={shortUrl} />
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={createUrlMutation.isLoading || hasGeneratedLink}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition flex-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createUrlMutation.isLoading
              ? "Creating..."
              : hasGeneratedLink
                ? "Shorten URL"
                : "Shorten URL"}
          </button>
          {hasGeneratedLink && (
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 text-center min-h-[32px] flex items-center justify-center">
        {shortUrl && (
          <>
            <span className="font-semibold">Your short URL: </span>
            <a
              href={shortUrl}
							onClick={handleUrlClick} 
              className="text-blue-600 underline break-all ml-1"
            >
              {shortUrl}
            </a>
          </>
        )}
      </div>
    </form>
  );
}

export default UrlForm;
