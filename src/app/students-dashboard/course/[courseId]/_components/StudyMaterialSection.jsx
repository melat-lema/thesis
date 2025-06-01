import React, { useEffect, useState } from "react";
import MaterialCardItem from "./MaterialCardItem";
import Link from "next/link";
import axios from "axios";

function StudyMaterialSection({ courseId }) {
  const MaterialList = [
    {
      name: "Notes/Chapters",
      desc: "These are the notes for this course",
      icon: "/notebook.png",
      path: "/notes",
    },
    {
      name: "Flashcard",
      desc: "Flashcard to remember the concepts",
      icon: "/flashcard.jpg",
      path: "/flashcards",
      disabled: false,
    },
    {
      name: "Quiz",
      desc: "Great way to test your knowledge",
      icon: "/question.png",
      path: "/quiz",
      disabled: false,
    },
    {
      name: "Question/Answer",
      desc: "Help to practice your learning ",
      icon: "/q-and-a.png",
      path: "/qa",
      disabled: false,
    },
  ];
  const [studyMaterial, setStudyMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudyMaterial();
  }, [courseId]);

  const fetchStudyMaterial = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/study-type?courseId=${courseId}`);
      setStudyMaterial(response.data);
    } catch (error) {
      console.error("Error fetching study material:", error);
      setError("Failed to load study material");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-5">
        <h2 className="font-medium text-2xl mt-3">Study Material</h2>
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5">
        <h2 className="font-medium text-2xl mt-3">Study Material</h2>
        <div className="text-center text-red-500 mt-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h2 className="font-medium text-2xl mt-3">Study Material</h2>
      {studyMaterial && <p className="text-sm text-gray-500 mt-1">Topic: {studyMaterial.topic}</p>}

      <div className="grid grid-cols-4 gap-4 mt-4">
        {MaterialList.map((item, index) => (
          <Link
            key={index}
            href={item.disabled ? "#" : "/students-dashboard/course/" + courseId + item.path}
            className={item.disabled ? "cursor-not-allowed" : ""}
          >
            <MaterialCardItem key={index} item={item} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default StudyMaterialSection;
