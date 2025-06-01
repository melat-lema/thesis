import React from "react";
import { motion } from "framer-motion";

const Flashcard = ({ flashcard, isFlipped, onFlip }) => {
  return (
    <div
      className="w-full h-[400px] perspective-1000 cursor-pointer"
      onClick={() => onFlip(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full transition-transform duration-500 transform-style-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Front of card */}
        <div
          className={`absolute w-full h-full backface-hidden p-8 rounded-xl bg-white shadow-xl border-2 border-gray-200 ${
            isFlipped ? "hidden" : "block"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Question</h3>
              <span className="text-sm text-gray-500">Click to flip</span>
            </div>
            <div className="flex-grow flex items-center justify-center">
              <p className="text-xl text-gray-700 text-center leading-relaxed">
                {flashcard.question}
              </p>
            </div>
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-500">Click to see answer</span>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={`absolute w-full h-full backface-hidden p-8 rounded-xl bg-white shadow-xl border-2 border-gray-200 rotate-y-180 ${
            isFlipped ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Answer</h3>
              <span className="text-sm text-gray-500">Click to flip</span>
            </div>
            <div className="flex-grow flex items-center justify-center">
              <p className="text-xl text-gray-700 text-center leading-relaxed">
                {flashcard.answer}
              </p>
            </div>
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-500">Click to see question</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;
