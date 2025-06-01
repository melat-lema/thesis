import React from "react";
import QASection from "../_components/QASection";

const QAPage = ({ params }) => {
  return (
    <div className="p-6">
      <QASection courseId={params.courseId} />
    </div>
  );
};

export default QAPage;
