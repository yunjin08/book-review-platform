import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Section = "bookRate" | "activeUsers" | "mostReviewed";

interface FilterControlsProps {
  activeSection: Section;
  sortOption: { [key in Section]: string };
  onSectionChange: (section: Section) => void;
  onSortChange: (value: string) => void;
}

export default function FilterControls({
  activeSection,
  sortOption,
  onSectionChange,
  onSortChange,
}: FilterControlsProps) {
  const getDropdownOptions = () => {
    switch (activeSection) {
      case "bookRate":
        return [
          { value: "highest", label: "Highest Rated" },
          { value: "lowest", label: "Lowest Rated" },
        ];
      case "activeUsers":
        return [
          { value: "most", label: "Most Active" },
          { value: "least", label: "Least Active" },
        ];
      case "mostReviewed":
        return [
          { value: "most", label: "Most Reviews" },
          { value: "least", label: "Least Reviews" },
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
