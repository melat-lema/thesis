import React from "react";
import QuizSection from "../_components/QuizSection";

const QuizPage = ({ params }) => {
  return (
    <div className="p-6">
      <QuizSection courseId={params.courseId} />
    </div>
  );
};

export default QuizPage;
