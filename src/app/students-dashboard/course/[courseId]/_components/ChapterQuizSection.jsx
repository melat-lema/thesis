"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const ChapterQuizSection = ({ chapterId, courseId }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [chapterId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/quiz`);
      setQuiz(response.data);
    } catch (error) {
      setError("Failed to load quiz");
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: answer,
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const submitQuiz = async () => {
    try {
      const score = calculateScore();
      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/quiz/submit`, {
        quizId: quiz.id,
        score: score.percentage,
        answers: selectedAnswers,
      });
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz");
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Something went wrong</p>
          <button
            onClick={fetchQuiz}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-500">No quiz available for this chapter</p>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Quiz Results</h2>
          <div className="text-4xl font-bold text-primary mb-2">{score.percentage}%</div>
          <p className="text-gray-600">
            You got {score.correct} out of {score.total} questions correct
          </p>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-sm border">
              <div className="flex items-start gap-2">
                <span className="font-medium">{index + 1}.</span>
                <div className="flex-1">
                  <p className="font-medium mb-4">{question.text}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`flex items-center gap-2 p-2 rounded-md ${
                          selectedAnswers[index] === option.text
                            ? option.isCorrect
                              ? "bg-green-50 border border-green-200"
                              : "bg-red-50 border border-red-200"
                            : option.isCorrect
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50"
                        }`}
                      >
                        {option.isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : selectedAnswers[index] === option.text ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : null}
                        <span>{option.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              setShowResults(false);
              setSelectedAnswers({});
              setCurrentIndex(0);
            }}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Chapter Quiz</h2>
          <p className="text-sm text-gray-500 mt-1">{quiz.title}</p>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <div className="flex items-start gap-2">
          <span className="font-medium">{currentIndex + 1}.</span>
          <div className="flex-1">
            <p className="font-medium mb-4">{currentQuestion.text}</p>
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option.text)}
                  className={`w-full text-left p-3 rounded-md transition-colors ${
                    selectedAnswers[currentIndex] === option.text
                      ? "bg-primary text-white"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={previousQuestion}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={nextQuestion}
            disabled={currentIndex === quiz.questions.length - 1}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Question {currentIndex + 1} of {quiz.questions.length}
        </div>
      </div>

      {currentIndex === quiz.questions.length - 1 && (
        <div className="flex justify-center">
          <button
            onClick={submitQuiz}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default ChapterQuizSection;
