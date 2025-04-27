import React from "react";
import NavBar from "@/components/common/NavBar";
import BestRatedSection from "./BestRatedSection";
import MostReviewedSection from "./MostReviewedSection";
import MostActiveSection from "./MostActiveReviewers";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <NavBar />
      <BestRatedSection />
      <MostReviewedSection />
      <MostActiveSection />
    </div>
  );
}
