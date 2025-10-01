import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import { createShortUrl } from "../api/shortUrl.api";
import { useSelector } from "react-redux";
import { toast } from "sonner";

function UrlForm() {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState(""); 
  const [shortUrl, setShortUrl] = useState("");

  const auth = useSelector((state) => state.auth);
  const { isAuthenticated } = auth;

  const handleSubmit = async () => {
    if (!url.trim()) {
    	toast("Url is required");
      return;
    }
    try {
      const data = await createShortUrl(url, isAuthenticated ? slug : undefined);
      setShortUrl(data);
      try {
        await navigator.clipboard.writeText(data);
      } catch {
				toast("Failed to copy to clipboard.");
      }
			toast("URL: " + data + " copied to clipboard.");
     
    } catch (err) {
     console.error(err);
			toast(err?.response?.data?.message || "Failed to shorten URL.");
    }
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl px-6 py-6 w-full max-w-2xl flex flex-col gap-4">
        <Label.Root htmlFor="url" className="sr-only">
          Enter your long URL
        </Label.Root>
        <input
          id="url"
          type="url"
          placeholder="https://example.com/very-long-url-that-needs-shortening"
          required
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none w-full"
          onInput={(event) => setUrl(event.target.value)}
          value={url}
        />

        {/* 🔹 Show slug input only if authenticated */}
        {isAuthenticated && (
          <>
            <Label.Root htmlFor="slug" className="sr-only">
              Custom Slug
            </Label.Root>
            <input
              id="slug"
              type="text"
              placeholder="your-custom-slug"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none w-full"
              onInput={(event) => setSlug(event.target.value)}
              value={slug}
						/>
					</>
				)}

				<button
					onClick={handleSubmit}
					type="submit"
					className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition w-full sm:w-auto cursor-pointer"
				>
					Shorten URL
				</button>

			</div>

      <div className="mt-4 text-center min-h-[32px] flex items-center justify-center">
        {shortUrl && (
          <>
            <span className="font-semibold">Your short URL: </span>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {shortUrl}
            </a>
          </>
        )}
      </div>
    
    </>
  );
}

export default UrlForm;

