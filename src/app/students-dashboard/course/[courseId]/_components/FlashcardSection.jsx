"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Flashcard from "./Flashcard";
import { Loader2, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

const FlashcardSection = ({ courseId }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMaterial, setStudyMaterial] = useState(null);

  useEffect(() => {
    fetchStudyMaterial();
  }, [courseId]);

  const fetchStudyMaterial = async () => {
    try {
      const response = await axios.get(`/api/study-type?courseId=${courseId}`);
      setStudyMaterial(response.data);
      await fetchFlashcards();
    } catch (error) {
      setError("Failed to load study material");
      console.error("Error fetching study material:", error);
    }
  };

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/flashcards?courseId=${courseId}`);
      setFlashcards(response.data);
    } catch (error) {
      setError("Failed to load flashcards");
      console.error("Error fetching flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateFlashcards = async () => {
    if (!studyMaterial) {
      setError("Study material not found");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/api/flashcards", {
        courseId,
        topic: studyMaterial.topic || "General Course Content",
      });
      setFlashcards(response.data);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      setError("Failed to generate flashcards");
      console.error("Error generating flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const previousCard = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const resetCards = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
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
          <p className="text-sm text-gray-500">
            If you're seeing an API key error, please make sure:
          </p>
          <ul className="text-sm text-gray-500 list-disc list-inside">
            <li>You have a valid Google AI API key</li>
            <li>The API key is properly set in your .env file</li>
            <li>The server has been restarted after adding the API key</li>
          </ul>
          <button
            onClick={generateFlashcards}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-500">No flashcards available</p>
        <button
          onClick={generateFlashcards}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Generate Flashcards
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Flashcards</h2>
          {studyMaterial && (
            <p className="text-sm text-gray-500 mt-1">Topic: {studyMaterial.topic}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={resetCards}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            title="Reset to first card"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={previousCard}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Previous card"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextCard}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Next card"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <Flashcard
          flashcard={flashcards[currentIndex]}
          isFlipped={isFlipped}
          onFlip={setIsFlipped}
        />
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>
          Card {currentIndex + 1} of {flashcards.length}
        </span>
        <button
          onClick={generateFlashcards}
          className="text-primary hover:text-primary/90 transition-colors"
        >
          Generate New Set
        </button>
      </div>
    </div>
  );
};

export default FlashcardSection;
