import { useState } from "react";
import UserProfileCard from "./userProfileCard";
import UserFilterControls from "./userFilterControls";
import ReadHistorySection from "./readHistorySection";
import UserReviewsSection from "./userReviewsSection";

interface UserPageProps {
  userId: string;
}

type Section = "readHistory" | "reviews";

export default function UserPage({ userId }: UserPageProps) {
  const [activeSection, setActiveSection] = useState<Section>("readHistory");
  const [sortOption, setSortOption] = useState<{ [key in Section]: string }>({
    readHistory: "latest",
    reviews: "latest",
  });

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setSortOption((prev) => ({
      ...prev,
      [section]: prev[section] || "latest",
    }));
  };
  const handleSortChange = (value: string) => {
    setSortOption({
      ...sortOption,
      [activeSection]: value,
    });
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "readHistory":
        return <ReadHistorySection />;
      case "reviews":
        return <UserReviewsSection />;
      default:
        return <ReadHistorySection />;
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <UserProfileCard userId={userId} />
      <div className="md:px-24 xl:px-72 xl:px-24 pt-4 md:pt-8">
        <UserFilterControls
          activeSection={activeSection}
          sortOption={sortOption}
          onSectionChange={handleSectionChange}
          onSortChange={handleSortChange}
        />
      </div>
      {renderActiveSection()}
    </div>
  );
}
