/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import BookCard from "@/components/BookCard";

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await api.get("/books");
        setBooks(res.data);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  return (
    <div className="w-full bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-black mb-4">
              Discover Books
            </h1>
            <p className="text-2xl text-gray-700">
              Explore knowledge and ideas from readers like you
            </p>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="flex justify-center py-20">
              <p className="text-2xl text-gray-500">Loading...</p>
            </div>
          )}

          {/* GRID */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.length > 0 ? (
                books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-3xl text-gray-500 font-semibold">No books found</p>
                  <p className="text-xl text-gray-400 mt-2">Check back soon!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
