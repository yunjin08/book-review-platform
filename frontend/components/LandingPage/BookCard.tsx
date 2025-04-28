import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

interface BookCardProps {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
}

export default function BookCard({
  title,
  author,
  genre,
  rating,
  coverUrl,
}: BookCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md pb-2 md:p-4 hover:scale-105 transition-transform cursor-pointer">
      <div className="relative w-full" style={{ paddingBottom: "150%" }}>
        <Image
          src={coverUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-md mb-4"
        />
      </div>
      <h3 className="text-xs md:text-lg mx-2 text-black font-bold md:mb-1">
        {title}
      </h3>
      <p className="text-xs md:text-lg mx-2 text-gray-700 md:mb-1">
        by {author}
      </p>
      <p className="text-xs md:text-lg mx-2 text-gray-500 md:mb-2">{genre}</p>
      <div className="flex items-center mx-2 mt-auto">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`h-3 w-3 md:h-5 md:w-5 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
