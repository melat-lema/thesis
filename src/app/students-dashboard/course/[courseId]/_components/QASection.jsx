"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, ChevronDown } from "lucide-react";

const QASection = ({ courseId }) => {
  const [qaPairs, setQAPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [studyMaterial, setStudyMaterial] = useState(null);

  useEffect(() => {
    fetchStudyMaterial();
  }, [courseId]);

  const fetchStudyMaterial = async () => {
    try {
      const response = await axios.get(`/api/study-type?courseId=${courseId}`);
      setStudyMaterial(response.data);
      await fetchQA();
    } catch (error) {
      setError("Failed to load study material");
      console.error("Error fetching study material:", error);
    }
  };

  const fetchQA = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/ai-qa?courseId=${courseId}`);
      setQAPairs(response.data);
    } catch (error) {
      setError("Failed to load Q&A pairs");
      console.error("Error fetching Q&A pairs:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateQA = async () => {
    if (!studyMaterial) {
      setError("Study material not found");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/api/ai-qa", {
        courseId,
        topic: studyMaterial.topic || "General Course Content",
      });
      setQAPairs(response.data);
      setExpandedIndex(null);
    } catch (error) {
      setError("Failed to generate Q&A pairs");
      console.error("Error generating Q&A pairs:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
            onClick={generateQA}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (qaPairs.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-500">No Q&A pairs available</p>
        <button
          onClick={generateQA}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Generate Q&A
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Common Questions</h2>
          {studyMaterial && (
            <p className="text-sm text-gray-500 mt-1">Topic: {studyMaterial.topic}</p>
          )}
        </div>
        <button
          onClick={generateQA}
          className="text-primary hover:text-primary/90 transition-colors"
        >
          Generate New Q&A
        </button>
      </div>

      <div className="space-y-4">
        {qaPairs.map((qa, index) => (
          <div key={index} className="border rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">{qa.question}</span>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedIndex === index ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {expandedIndex === index && (
              <div className="px-6 py-4 bg-gray-50 border-t">
                <p className="text-gray-700 whitespace-pre-wrap">{qa.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QASection;
