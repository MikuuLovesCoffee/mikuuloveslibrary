/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Star, 
  Download, 
  BookOpen, 
  ArrowLeft, 
  Send, 
  User,
  Calendar,
  MessageCircle,
  ExternalLink
} from "lucide-react";

export default function BookPage() {
  const { id } = useParams();
  const bookId = id ? Number(id) : null;

  const [book, setBook] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [avg, setAvg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Load book
  useEffect(() => {
    if (!bookId) return;
    
    const loadBook = async () => {
      try {
        const res = await api.get("/books");
        const found = res.data.find((b: any) => b.id == bookId);
        setBook(found);
      } finally {
        setLoading(false);
      }
    };
    
    loadBook();
  }, [bookId]);

  // Load comments
  const loadComments = async () => {
    if (!bookId) return;
    const res = await api.get(`/comments/${bookId}`);
    setComments(res.data);
  };

  useEffect(() => {
    loadComments();
  }, [bookId]);

  // Load rating
  useEffect(() => {
    if (!bookId) return;
    api.get(`/ratings/${bookId}`).then((res) => {
      setAvg(res.data.average);
    });
  }, [bookId]);

  // Send comment
  const sendComment = async () => {
    if (!bookId || !text.trim()) return;

    setSubmittingComment(true);
    try {
      await api.post("/comments", {
        bookId,
        content: text,
      });

      setText("");
      await loadComments();
    } finally {
      setSubmittingComment(false);
    }
  };

  // Rate book
  const rate = async (value: number) => {
    if (!bookId) return;

    setUserRating(value);
    await api.post("/ratings", {
      bookId,
      value,
    });

    const res = await api.get(`/ratings/${bookId}`);
    setAvg(res.data.average);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-primary/40" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Book not found</h2>
          <p className="text-foreground-muted mb-6">The book you are looking for does not exist.</p>
          <Link href="/">
            <button className="px-6 py-3 rounded-xl bg-primary text-background font-semibold hover:bg-primary-hover transition-colors">
              Back to Library
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(212, 165, 116, 0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/">
            <button className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Library</span>
            </button>
          </Link>
        </motion.div>

        {/* Book Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Book Cover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-background-secondary border border-glass-border shadow-lg">
              {book.imageUrl ? (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <BookOpen className="w-20 h-20 text-primary/40" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Book Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="glass-card rounded-3xl p-8 h-full">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
                {book.title}
              </h1>

              {/* Rating Display */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(avg)
                          ? "text-primary fill-primary"
                          : "text-foreground-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold text-foreground">{avg.toFixed(1)}</span>
                <span className="text-foreground-muted">
                  ({book.ratingsCount || 0} ratings)
                </span>
              </div>

              {/* Description */}
              <p className="text-foreground-muted leading-relaxed mb-8">
                {book.description || "No description available for this book."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href={book.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background font-semibold hover:bg-primary-hover transition-all shadow-glow"
                >
                  <ExternalLink className="w-5 h-5" />
                  Open Book
                </motion.a>
                <motion.a
                  href={book.fileUrl}
                  download
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl glass font-semibold text-foreground hover:bg-glass-highlight transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Rating Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-foreground mb-4">Rate this book</h2>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => rate(star)}
                className="p-1 transition-colors"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoveredStar || userRating)
                      ? "text-primary fill-primary"
                      : "text-foreground-muted"
                  }`}
                />
              </motion.button>
            ))}
            <span className="ml-4 text-foreground-muted">
              {hoveredStar > 0
                ? `Rate ${hoveredStar} star${hoveredStar > 1 ? "s" : ""}`
                : userRating > 0
                ? `You rated ${userRating} star${userRating > 1 ? "s" : ""}`
                : "Click to rate"}
            </span>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Comment Input */}
          <div className="flex gap-3 mb-8">
            <div className="flex-1 relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input-field resize-none h-24 pr-14"
                placeholder="Share your thoughts about this book..."
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendComment}
                disabled={!text.trim() || submittingComment}
                className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-primary text-background flex items-center justify-center disabled:opacity-50 hover:bg-primary-hover transition-colors"
              >
                {submittingComment ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full"
                  />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            <AnimatePresence>
              {comments.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-foreground-muted text-center py-8"
                >
                  No comments yet. Be the first to share your thoughts!
                </motion.p>
              ) : (
                comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-2xl bg-background-secondary border border-glass-border"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {comment.user?.email || "Anonymous"}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-foreground-muted">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-foreground-muted leading-relaxed">
                      {comment.content}
                    </p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
