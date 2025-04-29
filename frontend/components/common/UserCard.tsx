import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

// Function to generate a random color based on user's initial
const getRandomColor = (initial) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-teal-500",
    "bg-indigo-500"
  ];
  const charCode = initial.charCodeAt(0);
  return colors[charCode % colors.length];
};

// Mocked user data for demonstration
const user = {
  name: "Sarah Johnson",
  profilePicture: "", // Empty string to simulate no profile picture
  reviewsCount: 42,
  bio: "Product designer and travel enthusiast",
  email: "sarah@gmail.com",
  memberSince: "Jan 2021",
  recentReviews: [
    { id: 1, title: "Great coffee shop", rating: 5 },
    { id: 2, title: "Loved the atmosphere", rating: 4 },
    { id: 3, title: "Excellent service", rating: 5 }
  ],
};

const Avatar = ({ name, profilePicture, className = "" }) => {
  if (profilePicture) {
    return (
      <img
        src={profilePicture}
        alt={name}
        className={`w-full h-full object-cover rounded-full ${className}`}
      />
    );
  }

  const initial = name ? name.charAt(0).toUpperCase() : "?";
  const bgColor = getRandomColor(initial);

  return (
    <div
      className={`flex items-center justify-center rounded-full ${bgColor} text-white font-bold ${className}`}
    >
      {initial}
    </div>
  );
};

export default function UserCardWithModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center p-8">
      {/* User Card */}
      <div 
        className="flex flex-col bg-white rounded-lg shadow-md p-4 hover:scale-105 transition-transform cursor-pointer w-64"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 mx-auto">
          <Avatar 
            name={user.name} 
            profilePicture={user.profilePicture} 
            className="w-full h-full text-3xl"
          />
        </div>
        <h3 className="text-lg font-bold mb-1 text-center">{user.name}</h3>
        <p className="text-sm text-gray-700 mb-2 text-center">{user.bio}</p>
        <p className="text-sm text-gray-500 text-center">
          Reviews: {user.reviewsCount}
        </p>
      </div>

      {/* Modal with User Details */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{user.name}</DialogTitle>
            <DialogDescription>User profile details</DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto">
                <Avatar 
                  name={user.name} 
                  profilePicture={user.profilePicture} 
                  className="w-full h-full text-6xl"
                />
              </div>
            </div>
            
            <div className="flex-grow">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Bio</h4>
                  <p className="text-sm">{user.bio}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">Email</h4>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">Member Since</h4>
                    <p className="text-sm">{user.memberSince}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Reviews ({user.reviewsCount})</h4>
                  <div className="mt-2 space-y-2">
                    {user.recentReviews.map(review => (
                      <div key={review.id} className="flex items-center justify-between">
                        <span className="text-sm">{review.title}</span>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-500">★</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}