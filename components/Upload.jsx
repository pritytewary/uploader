"use client";
import { uploadObject } from "@/lib/storage/client";
import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const blobUrl = URL.createObjectURL(file);
      const fileName = file.name;
      const contentType = file.type;

      const uploadUrlResponse = await fetch("/api/upload/generate-upload-url", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          extension: fileName.split(".").pop(),
          contentType,
        }),
      });
      const uploadUrlJson = await uploadUrlResponse.json();

      await uploadObject({
        blobUrl,
        key: uploadUrlJson.data.key,
        signedUrl: uploadUrlJson.data.signedUrl,
        headers: uploadUrlJson.data.headers,
      });

      setUploadedUrl(`/api/upload/file?key=${uploadUrlJson.data.key}`);
    } catch (error) {
      setError("An error occurred during upload");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-blue-500 to-blue-700">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">File Upload</h2>
        <form onSubmit={handleUpload}>
          <div className="mb-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit rounded-md text-sm py-1 px-3 mt-3">
              {error}
            </div>
          )}
          {uploadedUrl && (
            <div className="mt-4 text-center">
              <p className="font-semibold text-green-500">
                File uploaded successfully! Here is the URL:
              </p>
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {uploadedUrl}
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
