import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortOptions } from "@/interface";

type Section = "bookRate" | "activeUsers" | "mostReviewed";

export default function NavBar({ activeSection, onSectionChange }: { activeSection: Section; onSectionChange: (section: Section) => void }) {
  // State to track the selected sort option for each filter
  const [sortOption, setSortOption] = useState<SortOptions>({
    bookRate: "highest",
    activeUsers: "most",
    mostReviewed: "most"
  });

  // Handler for filter button clicks
  const handleFilterClick = (filter: Section) => {
    onSectionChange(filter);
  };

  // Handler for dropdown selection changes
  const handleSortChange = (value: string) => {
    setSortOption({
      ...sortOption,
      [activeSection]: value
    });
  };

  // Get the current sort options based on active filter
  const getDropdownOptions = () => {
    switch (activeSection) {
      case "bookRate":
        return [
          { value: "highest", label: "Highest Rated" },
          { value: "lowest", label: "Lowest Rated" }
        ];
      case "activeUsers":
        return [
          { value: "most", label: "Most Active" },
          { value: "least", label: "Least Active" }
        ];
      case "mostReviewed":
        return [
          { value: "most", label: "Most Reviews" },
          { value: "least", label: "Least Reviews" }
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="sticky top-0 flex flex-col md:flex-row shadow-xl w-full px-3 md:px-12 xl:px-24 py-4 md:py-4 items-center justify-between border-b-2 bg-white border-slate-800 gap-4 z-10">
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
        <div className="text-sm md:text-2xl font-bold hover:opacity-50 cursor-pointer">
          Library ni Jed
        </div>
        
        {/* Filter buttons and dropdown */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <button 
              className={`px-3 py-1 rounded-md text-xs md:text-sm font-medium transition ${activeSection === "bookRate" ? "bg-slate-800 text-white" : "bg-gray-200 text-slate-800 hover:bg-gray-300"}`}
              onClick={() => handleFilterClick("bookRate")}
            >
              Book Rate
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-xs md:text-sm font-medium transition ${activeSection === "activeUsers" ? "bg-slate-800 text-white" : "bg-gray-200 text-slate-800 hover:bg-gray-300"}`}
              onClick={() => handleFilterClick("activeUsers")}
            >
              Active Users
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-xs md:text-sm font-medium transition ${activeSection === "mostReviewed" ? "bg-slate-800 text-white" : "bg-gray-200 text-slate-800 hover:bg-gray-300"}`}
              onClick={() => handleFilterClick("mostReviewed")}
            >
              Most Reviewed
            </button>
          </div>
          
          <Select value={sortOption[activeSection]} onValueChange={handleSortChange}>
            <SelectTrigger className="w-32 md:w-40 h-[1rem] text-xs md:text-sm bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {getDropdownOptions().map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs md:text-sm">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <IoSearch size={20} className="text-white"/>
          </button>
        </div>

        <div className="flex items-center">
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
      
      {/* Mobile search bar */}
      <div className="flex md:hidden w-full relative">
        <input
          type="text"
          placeholder="Search for books..."
          className="flex-1 py-2 rounded-2xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition px-4 text-sm"
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
    </nav>
  );
}