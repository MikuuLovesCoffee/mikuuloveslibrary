/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function BookPage() {
  const { id } = useParams();
  const bookId = id ? Number(id) : null;

  const [book, setBook] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [avg, setAvg] = useState(0);

  // 📌 LOAD BOOK
  useEffect(() => {
    api.get("/books").then((res) => {
      const found = res.data.find((b: any) => b.id == bookId);
      setBook(found);
    });
  }, [bookId]);

  // 📌 LOAD COMMENTS (CLEAN)
  const loadComments = async () => {
    if (!bookId) return;
    const res = await api.get(`/comments/${bookId}`);
    setComments(res.data);
  };

  useEffect(() => {
    loadComments();
  }, [bookId]);

  // 📌 LOAD RATING
  useEffect(() => {
    if (!bookId) return;
    api.get(`/ratings/${bookId}`).then((res) => {
      setAvg(res.data.average);
    });
  }, [bookId]);

  // 📌 SEND COMMENT (FIXED)
  const sendComment = async () => {
    if (!bookId || !text) return;

    await api.post("/comments", {
      bookId,
      content: text,
    });

    setText("");
    await loadComments(); // 🔥 correct refresh
  };

  // 📌 RATE
  const rate = async (value: number) => {
    if (!bookId) return;

    await api.post("/ratings", {
      bookId,
      value,
    });

    const res = await api.get(`/ratings/${bookId}`);
    setAvg(res.data.average);
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{book.title}</h1>
      <p>{book.description}</p>

      {/* PDF */}
      <a
        href={book.fileUrl}
        target="_blank"
        className="text-blue-500 block mt-2"
      >
        Open PDF
      </a>

      {/* RATING */}
      <div className="mt-4">
        <p>Rating: {avg.toFixed(1)}</p>

        <div className="flex gap-2 text-2xl">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => rate(n)}
              className={n <= avg ? "text-yellow-500" : "text-gray-400"}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* COMMENTS */}
      <div className="mt-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border w-full p-2"
          placeholder="Write comment..."
        />

        <button
          onClick={sendComment}
          className="bg-blue-500 text-white px-4 py-2 mt-2"
        >
          Send
        </button>

        <div className="mt-4 space-y-2">
          {comments.map((c: any) => (
            <div key={c.id} className="border p-2">
              <b>{c.user.email}</b>
              <p>{c.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}