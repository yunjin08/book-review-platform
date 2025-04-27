import React from "react";
import UserCard from "./UserCard";

interface User {
  name: string;
  profilePicture: string;
  reviewsCount: number;
  bio: string;
}

// Test data for the users
const users: User[] = [
  {
    name: "John Doe",
    profilePicture: "",
    reviewsCount: 32,
    bio: "Book lover and passionate reviewer.",
  },
  {
    name: "Jane Smith",
    profilePicture: "",
    reviewsCount: 28,
    bio: "Sharing thoughts on every read, one book at a time.",
  },
  {
    name: "George Martin",
    profilePicture: "",
    reviewsCount: 24,
    bio: "Literature enthusiast and avid reviewer.",
  },
  {
    name: "Emma Brown",
    profilePicture: "",
    reviewsCount: 20,
    bio: "A reader who loves to explore new genres.",
  },
  {
    name: "Lucas White",
    profilePicture: "",
    reviewsCount: 18,
    bio: "Book reviewer and collector.",
  },
  {
    name: "Sophia Lee",
    profilePicture: "",
    reviewsCount: 15,
    bio: "Passionate about all things fiction and non-fiction.",
  },
];

export default function MostActiveSection() {
  return (
    <div className="flex flex-col w-full px-3 md:px-24 xl:px-72 pt-4 md:pt-8 pb-8 md:pb-16">
      <p className="text-2xl md:text-4xl font-bold mb-4">Most Active Users</p>
      <p className="text-xs md:text-lg text-justify mb-4">
        These are the users who have been leading the conversation, sharing
        their reviews, and keeping the community buzzing. From insightful
        critiques to passionate recommendations, these users are the ones
        contributing the most to the discussions. Want to see what’s shaping the
        book world? Check out the most active voices here!
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 w-full">
        {users.map((user, index) => (
          <UserCard
            key={index}
            name={user.name}
            profilePicture={user.profilePicture || "/logo.png"}
            reviewsCount={user.reviewsCount}
            bio={user.bio}
          />
        ))}
      </div>
    </div>
  );
}
