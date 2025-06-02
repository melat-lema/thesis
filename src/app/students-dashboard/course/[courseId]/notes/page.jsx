"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function ViewNotes() {
  const { courseId } = useParams();
  const [Notes, setNotes] = useState();
  const [stepCount, setStepCount] = useState(0);
  const route = useRouter();
  useEffect(() => {
    GetNotes();
  }, []);
  const GetNotes = async () => {
    const result = await axios.post("/api/study-type", {
      courseId: courseId,
    });
    setNotes(result?.data.chapters);
    console.log("Notes", result?.data);
  };

  return (
    Notes && (
      <div>
        <div className="flex gap-5 items-center">
          {stepCount != 0 && (
            <Button size="sm" onClick={() => setStepCount(stepCount - 1)}>
              Previous
            </Button>
          )}
          {Notes?.map((item, index) => (
            <div
              key={index}
              className={`w-full h-2 rounded-full
                ${index < stepCount ? "bg-black" : "bg-gray-200"}`}
            ></div>
          ))}
          <Button size="sm" onClick={() => setStepCount(stepCount + 1)}>
            Next
          </Button>
        </div>
        <div className="mt-10">
          <div dangerouslySetInnerHTML={{ __html: Notes[stepCount]?.notes }} />

          {Notes?.length == stepCount && (
            <div className="flex items-center gap-10 flex-col justify-center">
              <h2> End of Notes</h2>
              <Button onClick={() => route.back()}>Go back to Course Page</Button>
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default ViewNotes;
