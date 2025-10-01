import * as Label from "@radix-ui/react-label";
import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";
import { createShortUrl } from "../api/shortUrl.api";

function UrlForm() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(""); 


  const handleSubmit = async () => {
    if (!url.trim()) {
      setError("Url is required");
      setOpen(true);
      return;
    }
    setError("");
    setShortUrl("");
    try {
      const data= await createShortUrl(url);
      setShortUrl(data);
      try {
        await navigator.clipboard.writeText(data);
      } catch {
        setError("Failed to copy to clipboard.");
      }
      setOpen(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to shorten URL.");
      setOpen(true);
    }
  };

  return (
    <Toast.Provider swipeDirection="right">
      <div className="bg-white shadow-lg rounded-2xl px-6 py-6 w-full max-w-2xl flex flex-col sm:flex-row gap-4 items-center">
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
        <button
          onClick={handleSubmit}
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition w-full sm:w-auto cursor-pointer"
        >
          Shorten URL
        </button>
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className="bg-white border border-gray-300 rounded-lg px-4 py-3 shadow-lg"
        >
          <Toast.Title className="font-semibold text-gray-800">
            {error ? "Error" : "Shortened!"}
          </Toast.Title>
          <Toast.Description
            className={`text-sm ${error ? "text-red-600" : "text-gray-600"}`}
          >
            {error ? (
              <span>{error}</span>
            ) : (
              <>
                <span>Short URL: </span>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {shortUrl}
                </a>
                <br />
                <span>Copied to clipboard.</span>
              </>
            )}
          </Toast.Description>
        </Toast.Root>
      </div>
      <div className="mt-4 text-center min-h-[32px] flex items-center justify-center">
        {shortUrl && !error && (
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
      <Toast.Viewport className="fixed bottom-5 right-5 z-50 w-[300px] max-w-full outline-none" />
    </Toast.Provider>
  );
}

export default UrlForm;
