import React from "react";
import BookCard from "./BookCard";
import { Book } from "@/interface";


const books: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    rating: 5,
    cover_image: "/logo.png",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Historical Fiction",
    rating: 5,
    cover_image: "/logo.png",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    rating: 4,
    cover_image: "/logo.png",
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    rating: 5,
    cover_image: "/logo.png",
  },
  {
    id: 5,
    title: "Moby Dick",
    author: "Herman Melville",
    genre: "Adventure",
    rating: 3,
    cover_image: "/logo.png",
  },
  {
    id: 6,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    rating: 5,
    cover_image: "/logo.png",
  },
];

export default function BestRatedSection() {
  return (
    <div className="flex flex-col w-full text-black px-3 md:px-24 xl:px-72 pt-4 md:pt-8 pb-8 md:pb-16">
      <p className="text-2xl md:text-4xl font-bold mb-4">Highest Rated Books</p>
      <p className="text-xs md:text-lg text-justify mb-4">
        These are the absolute <i>bangers</i>: the books so good they had
        readers screaming, crying, throwing up (like in a good way). From
        timeless classics to hidden gems, dive in and see what all the hype is
        about, because your next favorite read might just be waiting here,
        matey!
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 w-full">
        {books.map((book, index) => (
          <BookCard
            key={index}
            title={book.title}
            author={book.author}
            genre={book.genre}
            rating={book.rating}
            coverUrl={book.cover_image || "/logo.png"}
          />
        ))}
      </div>
    </div>
  );
}
