import React, { useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

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
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for user's new rating
  const [newRating, setNewRating] = useState(0);
  // State for hovering over stars
  const [hoverRating, setHoverRating] = useState(0);
  // State for review text
  const [reviewText, setReviewText] = useState("");

  // Mock reviews for demonstration
  const mockReviews = [
    { user: "Jane Doe", rating: 4, comment: "Great read, highly recommend it!" },
    { user: "John Smith", rating: 5, comment: "One of my all-time favorites." },
    { user: "Alex Johnson", rating: 3, comment: "Decent story, but a bit slow in the middle." },
    { user: "Sarah Williams", rating: 4, comment: "The character development was excellent." },
    { user: "Mike Brown", rating: 5, comment: "Couldn't put it down. A masterpiece!" }
  ];

  const handleStarClick = (rating: number) => {
    setNewRating(rating);
  };

  const handleSubmitReview = () => {
    console.log("Review submitted:", { rating: newRating, comment: reviewText });
    // Here you would typically send the review to your backend
    // After successful submission, you might want to:
    setReviewText("");
    setNewRating(0);
    // Optionally close the modal or show a confirmation
    // setIsModalOpen(false);
  };

  return (
    <>
      <div 
        className="flex flex-col bg-white rounded-lg shadow-md pb-2 md:p-4 hover:scale-105 transition-transform cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md md:max-w-2xl max-h-[85vh] text-black bg-white overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink- border-b-2 border-slate-500">
            <DialogTitle className="text-xl md:text-2xl">{title}</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              by {author} · {genre}
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-grow pr-2">
            <div className="grid grid-cols-3 gap-4 my-4 border-2 border-slate-500 p-2 rounded-sm">
              <div className="col-span-1">
                <div className="relative w-full" style={{ paddingBottom: "150%" }}>
                  <Image
                    src={coverUrl}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <h3 className="text-lg font-bold mb-2">Book Summary</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Average Rating: {rating}/5
                </p>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Separator className="my-4 bg-slate-400" />

            <div>
              <h3 className="text-lg font-bold mb-2">Reviews</h3>
              <div className="space-y-4">
                {mockReviews.map((review, index) => (
                  <Card key={index} className="p-2 border-slate-500">
                    <CardContent className="p-0 pt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{review.user}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator className="my-4 bg-slate-400" />

            <div>
              <h3 className="text-lg font-bold mb-2">Submit Your Review</h3>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`h-6 w-6 cursor-pointer ${
                      i < (hoverRating || newRating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => handleStarClick(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
              <Textarea 
                placeholder="Write your review here..." 
                className="w-full h-24 mb-2 border-slate-500 ring-0 focus:ring-0"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 mt-4">
            <Button onClick={handleSubmitReview} disabled={newRating === 0 || !reviewText.trim()}>
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}