import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Section = "readHistory" | "reviews";

interface FilterControlsProps {
  activeSection: Section;
  sortOption: { [key in Section]: string };
  onSectionChange: (section: Section) => void;
  onSortChange: (value: string) => void;
}

export default function UserFilterControls({
  activeSection,
  sortOption,
  onSectionChange,
  onSortChange,
}: FilterControlsProps) {
  const getDropdownOptions = () => {
    switch (activeSection) {
      case "readHistory":
        return [
          { value: "latest", label: "Latest Read" },
          { value: "oldest", label: "Oldest Read" },
        ];
      case "reviews":
        return [
          { value: "latest", label: "Latest Review" },
          { value: "oldest", label: "Oldest Review" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
      <div className="flex items-center gap-2">
        <button
          className={`px-3 py-1 rounded-md text-xs md:text-sm font-medium transition ${
            activeSection === "readHistory"
              ? "bg-slate-800 text-white"
              : "bg-gray-200 text-slate-800 hover:bg-gray-300"
          }`}
          onClick={() => onSectionChange("readHistory")}
        >
          Read History
        </button>
        <button
          className={`px-3 py-1 rounded-md text-xs md:text-sm font-medium transition ${
            activeSection === "reviews"
              ? "bg-slate-800 text-white"
              : "bg-gray-200 text-slate-800 hover:bg-gray-300"
          }`}
          onClick={() => onSectionChange("reviews")}
        >
          Your Reviews
        </button>
      </div>

      <Select value={sortOption[activeSection]} onValueChange={onSortChange}>
        <SelectTrigger className="w-32 md:w-40 h-[1rem] text-xs md:text-sm bg-white">
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
  );
}
