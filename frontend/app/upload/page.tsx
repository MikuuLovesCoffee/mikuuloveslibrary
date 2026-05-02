/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen,
  FileUp,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Protect page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

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
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await api.post("/books/upload", formData);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Upload failed. Please try again."
      );
    } finally {
      setLoading(false);
      if (!uploadSuccess) {
        setUploadProgress(0);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen py-12 px-4 relative">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/3 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(212, 165, 116, 0.08) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">BookSphere</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Upload a Book
          </h1>
          <p className="text-foreground-muted">Share knowledge with the community</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-8 shadow-lg"
        >
          <div className="space-y-6">
            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-error/10 border border-error/20"
                >
                  <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                  <span className="text-error text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Alert */}
            <AnimatePresence>
              {uploadSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-success/10 border border-success/20"
                >
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-success text-sm">Upload successful! Redirecting...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Book Title
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter the book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                className="input-field resize-none h-28"
                placeholder="Write a brief description of the book..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* File Upload Zone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Book File
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
                  dragActive 
                    ? "border-primary bg-primary/5" 
                    : file 
                      ? "border-success/50 bg-success/5"
                      : "border-glass-border hover:border-primary/50"
                }`}
              >
                <div className="p-8">
                  <AnimatePresence mode="wait">
                    {!file ? (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                      >
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center"
                        >
                          <FileUp className="w-8 h-8 text-primary" />
                        </motion.div>
                        <p className="text-foreground font-medium mb-1">
                          Drag and drop your file here
                        </p>
                        <p className="text-foreground-muted text-sm mb-4">or</p>
                        <label className="inline-block">
                          <span className="px-6 py-3 rounded-xl bg-primary text-background font-semibold cursor-pointer hover:bg-primary-hover transition-colors">
                            Browse Files
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.epub,.mobi,.doc,.docx"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                          />
                        </label>
                        <p className="text-foreground-muted text-xs mt-4">
                          Supports PDF, EPUB, MOBI, DOC, DOCX
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="file"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-7 h-7 text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground font-medium truncate">
                            {file.name}
                          </p>
                          <p className="text-foreground-muted text-sm">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          onClick={() => setFile(null)}
                          className="w-10 h-10 rounded-xl glass flex items-center justify-center text-foreground-muted hover:text-error hover:bg-error/10 transition-all"
                          aria-label="Remove file"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <AnimatePresence>
              {loading && uploadProgress > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-muted flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      Uploading...
                    </span>
                    <span className="text-foreground font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-background-secondary overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={upload}
              disabled={loading || !file || uploadSuccess}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-primary text-background font-semibold hover:bg-primary-hover disabled:opacity-50 transition-all shadow-glow"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
                />
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Book
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-foreground-muted text-sm mt-8"
        >
          By uploading, you confirm you have the right to share this content
        </motion.p>
      </div>
    </div>
  );
}
