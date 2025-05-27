import React from "react";

function ChapterList({ course }) {
  const Chapters = course?.courseLayout?.chapters;
  return (
    <div className="mt-5">
      <h2 className="font-medium text-2xl mt-3">Chapter List</h2>

      <div className="mt-3 grid grid-cols-2 gap-4">
        {Chapters?.map((item, index) => (
          <div
            key={index}
            className="flex gap-5 items-center p-4 border shadow-md mb-2 rounded-lg cursor-pointer"
          >
            <h2 className="text-2xl"> {item?.black_emoji}</h2>
            <div key={index}>
              <h2 className="font-medium">{item?.chapter_title}</h2>
              <p className="text-sm text-black-400"> {item?.chapter_summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;
