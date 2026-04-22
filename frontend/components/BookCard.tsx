/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";

export default function BookCard({ book }: any) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 h-full flex flex-col">

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-black mb-3 line-clamp-2">
        {book.title}
      </h2>

      {/* DESCRIPTION */}
      <p className="text-lg text-gray-700 mb-4 line-clamp-2">
        {book.description}
      </p>

      {/* IMAGE */}
      {book.imageUrl && (
        <img
          src={book.imageUrl}
          alt={book.title}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}

      {/* RATING */}
      <div className="flex items-center justify-between mb-4 py-3 border-t border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span className="text-xl font-semibold text-black">
            {book.averageRating?.toFixed(1) || "0.0"}
          </span>
        </div>

        <div className="text-gray-600 text-lg">
          {book.ratingsCount || 0} reviews
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3 mt-auto">
        <Link href={`/book/${book.id}`} className="flex-1">
          <button className="w-full py-3 px-4 bg-black text-white text-lg font-semibold rounded hover:bg-gray-800">
            Read
          </button>
        </Link>

        <a
          href={book.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-4 bg-gray-200 text-black text-lg font-semibold rounded hover:bg-gray-300 text-center"
        >
          Download
        </a>
      </div>
    </div>
  );
}