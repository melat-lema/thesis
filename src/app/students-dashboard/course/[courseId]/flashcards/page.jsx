import React from "react";
import FlashcardSection from "../_components/FlashcardSection";

const FlashcardPage = ({ params }) => {
  return (
    <div className="container mx-auto p-6">
      <FlashcardSection courseId={params.courseId} />
    </div>
  );
};

export default FlashcardPage;
