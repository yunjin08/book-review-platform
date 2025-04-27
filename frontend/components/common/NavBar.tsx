import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

export default function NavBar() {
  return (
    <nav className="sticky top-0 flex flex-col md:flex-row w-full px-3 md:px-24 xl:px-72 py-4 md:py-4 items-center justify-between bg-slate-800 gap-4 z-10">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="text-sm md:text-2xl font-bold text-white hover:opacity-50 cursor-pointer">
          Library ni Jed
        </div>

        <div className="hidden md:flex flex-1 mx-6 w-1/3 self-center">
          <input
            type="text"
            placeholder="Search for books..."
            className="flex-1 p-2 rounded-l-2xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition w-1/3 px-4"
          />
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold p-2 rounded-r-md transition cursor-pointer"
            onClick={() => {
              console.log("Search clicked");
            }}
          >
            <IoSearch size={20} className="text-white" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="flex items-center text-white hover:opacity-50 transition cursor-pointer"
            onClick={() => {
              console.log("Go to user profile");
            }}
          >
            <FaUserCircle size={32} />
          </button>
        </div>
      </div>
      <div className="flex md:hidden w-full flex-1 mx-6 max-w-2xl self-center">
        <input
          type="text"
          placeholder="Search for books..."
          className="flex-1 p-2 rounded-l-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition text-sm md:text-base lg:text-lg"
        />
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold p-2 rounded-r-md transition cursor-pointer"
          onClick={() => {
            console.log("Search clicked");
          }}
        >
          <IoSearch size={20} className="text-white" />
        </button>
      </div>
    </nav>
  );
}
