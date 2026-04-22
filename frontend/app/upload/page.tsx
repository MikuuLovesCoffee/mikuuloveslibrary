/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function UploadPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // 🔥 PROTECT PAGE
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const upload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a book title");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a book description");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    setLoading(true);
    setError("");

    try {
      console.log("UPLOADING...");

      const res = await api.post("/books/upload", formData);

      console.log("SUCCESS:", res.data);

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err: any) {
      console.log("FULL ERROR:", err);
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);

      setError(
        err.response?.data?.message ||
        "Upload failed. Please try again."
      );
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-12 bg-white">
      <div className="w-full max-w-2xl">
        
        {/* CARD */}
        <div className="rounded-lg border border-gray-300 p-8 bg-white">
          
          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-3">
              Upload Book
            </h1>
            <p className="text-xl text-gray-700">Share a book with the community</p>
          </div>

          {/* FORM */}
          <div className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-100 border border-red-300 text-red-700 text-xl">
                {error}
              </div>
            )}

            {/* TITLE */}
            <div>
              <label className="block text-xl font-semibold text-black mb-3">
                Book Title
              </label>
              <input
                type="text"
                className="w-full px-5 py-4 rounded-lg border border-gray-300 text-xl text-black placeholder-gray-500 focus:outline-none focus:border-black"
                placeholder="Enter book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-xl font-semibold text-black mb-3">
                Description
              </label>
              <textarea
                className="w-full px-5 py-4 rounded-lg border border-gray-300 text-xl text-black placeholder-gray-500 focus:outline-none focus:border-black resize-none h-24"
                placeholder="Write a description about the book..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* FILE UPLOAD */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative rounded-lg border-2 border-dashed transition-all ${
                dragActive ? "border-black bg-gray-50" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="p-8 text-center">
                {!file ? (
                  <div>
                    <p className="text-3xl mb-3">📁</p>
                    <p className="text-xl font-semibold text-black">Drag and drop your file here</p>
                    <p className="text-gray-600 text-lg mt-2">or</p>
                    <label className="inline-block mt-3">
                      <span className="px-6 py-3 rounded-lg bg-black text-white text-lg font-semibold cursor-pointer hover:bg-gray-800">
                        Browse Files
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                    </label>
                    <p className="text-gray-600 text-base mt-4">PDF, EPUB, or other formats</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-4xl">✓</div>
                    <div className="text-left">
                      <p className="text-2xl font-semibold text-green-600">{file.name}</p>
                      <p className="text-lg text-gray-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="ml-auto text-2xl text-gray-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* PROGRESS BAR */}
            {loading && uploadProgress > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-black">Uploading...</span>
                  <span className="text-lg font-semibold text-black">{uploadProgress}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-300 overflow-hidden">
                  <div
                    className="h-full bg-black transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={upload}
              disabled={loading || !file}
              className="w-full py-4 px-4 rounded-lg bg-black text-white text-xl font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Book"}
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-600 text-lg mt-8">
          Help others discover amazing books
        </p>
      </div>
    </div>
  );
}