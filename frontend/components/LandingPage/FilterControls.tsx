import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FaBook, FaPlus } from "react-icons/fa";

type Section = 'bookRate' | 'activeUsers' | 'mostReviewed'

interface FilterControlsProps {
  activeSection: Section;
  sortOption: { [key in Section]: string };
  onSectionChange: (section: Section) => void;
  onSortChange: (value: string) => void;
  onAddBookClick?: () => void;
}

export default function FilterControls({
  activeSection,
  sortOption,
  onSectionChange,
  onSortChange,
  onAddBookClick,
}: FilterControlsProps) {
    const getDropdownOptions = () => {
        switch (activeSection) {
            case 'bookRate':
                return [
                    { value: 'highest', label: 'Highest Rated' },
                    { value: 'lowest', label: 'Lowest Rated' },
                ]
            case 'activeUsers':
                return [
                    { value: 'most', label: 'Most Active' },
                    { value: 'least', label: 'Least Active' },
                ]
            case 'mostReviewed':
                return [
                    { value: 'most', label: 'Most Reviews' },
                    { value: 'least', label: 'Least Reviews' },
                ]
            default:
                return []
        }
    }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-3 md:px-24 xl:px-48 gap-2 md:gap-4">
      <div className="flex items-center gap-2">
        <button
          className={`px-3 py-1 rounded-md text-xs md:text-sm font-medium transition ${
            activeSection === "bookRate"
              ? "bg-slate-800 text-white"
              : "bg-gray-200 text-slate-800 hover:bg-gray-300"
          }`}
          onClick={() => onSectionChange("bookRate")}
        >
          Book Rate
        </button>
        <button
          className={`px-3 py-1 rounded-md text-xs md:text-sm font-medium transition ${
            activeSection === "activeUsers"
              ? "bg-slate-800 text-white"
              : "bg-gray-200 text-slate-800 hover:bg-gray-300"
          }`}
          onClick={() => onSectionChange("activeUsers")}
        >
          Active Users
        </button>
        <button
          className={`px-3 py-1 rounded-md text-xs md:text-sm font-medium transition ${
            activeSection === "mostReviewed"
              ? "bg-slate-800 text-white"
              : "bg-gray-200 text-slate-800 hover:bg-gray-300"
          }`}
          onClick={() => onSectionChange("mostReviewed")}
        >
          Most Reviewed
        </button>
        <Select value={sortOption[activeSection]} onValueChange={onSortChange}>
          <SelectTrigger className="w-32 md:w-40 text-xs md:text-sm bg-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {getDropdownOptions().map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-xs md:text-sm"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-row items-center gap-2 md:w-auto justify-start md:justify-end">
        <Button
          className="bg-slate-800 text-white hover:bg-slate-700 text-xs md:text-sm flex items-center gap-1 cursor-pointer"
          onClick={onAddBookClick} // Trigger modal
        >
          <FaBook className="w-3 h-3 md:w-4 md:h-4" />
          <span>Add Book</span>
          <FaPlus className="ml-3 w-2 h-2 md:w-3 md:h-3" />
        </Button>
      </div>
    </div>
  );
}
