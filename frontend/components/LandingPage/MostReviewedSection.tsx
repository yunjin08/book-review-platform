'use client'
import React, { useEffect, lazy, useState, Suspense } from "react";
import { getBooks } from "@/services/book";

const BookCard = lazy(() => import("../common/BookCard"));

interface Book {
  title: string;
  author: string;
  genres: Array<{name: string}>;
  rating: number;
  coverUrl: string;
}

export default function MostReviewedSection() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getBooks({})
      .then((result) => {
        setBooks(result.objects);
      })
      .catch((err) => {
        console.error("Failed to fetch books:", err);
        setError("Failed to load books. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col w-full text-black px-3 md:px-24 xl:px-72 pt-4 md:pt-8 pb-8 md:pb-16">
      <p className="text-2xl md:text-4xl font-bold mb-4">Most Reviewed Books</p>
      <p className="text-xs md:text-lg text-justify mb-4">
        These are the books that everyone's had something to say about:
        the ones sparking conversations, inspiring debates, or... getting people
        to ranting about why it&apos;s one of the books of all-time (like any
        other is, <i>lol</i>). Want to be in on the talk? Check out what&apos;s
        got everyone buzzing!
      </p>

      {isLoading ? (
        <div className="w-full text-center py-12">
          <p className="text-lg">Loading books...</p>
        </div>
      ) : error ? (
        <div className="w-full text-center py-12">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      ) : books.length === 0 ? (
        <div className="w-full text-center py-64 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-xl mb-4">No books found</p>
          <p className="text-gray-500 mb-6">Be the first to add a review!</p>
          <a 
            href="/add-book" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add a Book
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 w-full">
          <Suspense fallback={<div>Loading book cards...</div>}>
            {books.map((book: Book, index: number) => (
              <BookCard
                key={index}
                title={book.title}
                author={book.author}
                genre={book.genres && book.genres.length > 0 ? book.genres[0].name : "Unknown"}
                rating={book.rating || 0}
                coverUrl={book.coverUrl || "/logo.png"}
              />
            ))}
          </Suspense>
        </div>
      )}
    </div>
  );
}