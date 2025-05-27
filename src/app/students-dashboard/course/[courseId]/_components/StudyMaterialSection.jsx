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
      path: "/notes",
      disabled: true,
    },
    {
      name: "Quiz",
      desc: "Great way to test your knowledge",
      icon: "/question.png",
      path: "/notes",
      disabled: true,
    },
    {
      name: "Question/Answer",
      desc: "Help to practice your learning ",
      icon: "/q-and-a.png",
      path: "/notes",
      disabled: true,
    },
  ];
  const [studyNotes, setNotesContent] = useState();

  useEffect(() => {
    GetNotes();
  }, []);
  const GetNotes = async () => {
    const result = await axios.post("/api/study-type", {
      courseId: courseId,
    });
    console.log(result.data);
    setNotesContent(result.data);
  };

  return (
    <div className="mt-5">
      <h2 className="font-medium text-2xl mt-3">Study Material</h2>

      <div className="grid grid-cols-4 gap-4">
        {MaterialList.map((item, index) => (
          <Link key={index} href={"/students-dashboard/course/" + courseId + item.path}>
            <MaterialCardItem key={index} item={item} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default StudyMaterialSection;
