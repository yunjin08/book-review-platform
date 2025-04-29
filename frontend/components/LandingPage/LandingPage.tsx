import React, { useState, Suspense, lazy } from "react";
import NavBar from "@/components/common/NavBar";
import BestRatedSection from "./BestRatedSection";
import Footer from "@/components/common/Footer";
import { Section } from "@/types";

const MostReviewedSection = lazy(() => import("./MostReviewedSection"));
const MostActiveSection = lazy(() => import("./MostActiveReviewers"));

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState<Section>("mostReviewed");
  
  // Function to handle section changes from the NavBar
  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "bookRate":
        return <BestRatedSection />;
      case "activeUsers":
        return <MostActiveSection />;
      case "mostReviewed":
        return <MostReviewedSection />;
      default:
        return <MostReviewedSection />; // Default fallback
    }
  };
  return (
    <div className="flex flex-col bg-white text-black w-screen min-h-screen">
      <NavBar activeSection={activeSection} onSectionChange={handleSectionChange}/>
      <Suspense fallback={<div>Loading...</div>}>
        {renderActiveSection()}
      </Suspense>
      <Footer />
    </div>
  );
}
