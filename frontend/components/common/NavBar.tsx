import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NavBar() {
  return (
    <nav className="md:sticky md:top-0 flex flex-col md:flex-row shadow-xl w-full px-6 md:px-12 xl:px-24 py-4 md:py-4 items-center justify-between bg-white gap-4 z-10">
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
        <div className="flex flex-row text-sm md:text-2xl font-bold hover:opacity-50 cursor-pointer w-full md:w-auto justify-between md:justify-center items-center">
          Library ni Jed
          <div className="flex md:hidden items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-slate-800 hover:opacity-50 transition cursor-pointer">
                  <FaUserCircle size={32} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => console.log("Navigate to read history")}
                >
                  View Read History
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => console.log("Navigate to ratings")}
                >
                  View Ratings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-500"
                  onClick={() => console.log("Logout user")}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="hidden relative md:flex flex-1 mx-6 max-w-md">
          <input
            type="text"
            placeholder="Search for books..."
            className="flex-1 py-1 rounded-2xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition w-full px-4"
          />
          <button
            className="bg-slate-800 h-full rounded-r-2xl absolute right-0 top-0 font-semibold px-3 transition cursor-pointer"
            onClick={() => {
              console.log("Search clicked");
            }}
          >
            <IoSearch size={20} className="text-white" />
          </button>
        </div>

        <div className="hidden md:flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-slate-800 hover:opacity-50 transition cursor-pointer">
                <FaUserCircle size={32} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => console.log("Navigate to read history")}
              >
                View Read History
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => console.log("Navigate to ratings")}
              >
                View Ratings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-500"
                onClick={() => console.log("Logout user")}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
