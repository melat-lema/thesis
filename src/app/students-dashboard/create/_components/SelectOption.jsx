import { useState } from "react";

export default function SelectOption({ selectedStudyType }) {
  const Options = [
    { name: "Exam", icon: "/exam.png" },
    { name: "Job Interview", icon: "/job.png" },
    { name: "Practice", icon: "/practice.png" },
    { name: "Coding Prep", icon: "/code.png" },
    { name: "Other", icon: "/other.png" },
  ];

  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div>
      <h2 className="text-center mb-2 text-lg">
        For which you want to create your personal study material?
      </h2>
      <div className="grid grid-cols-2 mt-5 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {Options.map((option, index) => (
          <div
            key={index}
            className={`p-4 flex flex-col items-center justify-center border rounded-xl hover:border-blue-500 cursor-pointer ${
              option.name === selectedOption && "border-blue-500"
            }`}
            onClick={() => {
              setSelectedOption(option.name); // Update local state
              selectedStudyType(option.name); // Pass the selected value to the parent component
            }}
            role="button"
            aria-selected={option.name === selectedOption}
          >
            <img src={option.icon} alt={option.name} width={50} height={50} />
            <h2 className="text-sm mt-2">{option.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}