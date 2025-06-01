"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, CheckCircle, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ChapterQuizForm = ({ initialData, courseId, chapterId }) => {
  const router = useRouter();

  // Ensure quizzes is always initialized as an array
  const [quizzes, setQuizzes] = useState(
    Array.isArray(initialData.quizzes) ? initialData.quizzes : []
  );
  const [editingQuizIndex, setEditingQuizIndex] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startNewQuiz = () => {
    setQuestions([{ text: "", options: ["", "", "", ""], correctAnswer: "" }]);
    setEditingQuizIndex(null); // null = creating new quiz
  };

  const editQuiz = (index) => {
    setEditingQuizIndex(index);
    setQuestions(quizzes[index].questions);
  };

  const cancelEdit = () => {
    setEditingQuizIndex(null);
    setQuestions([]);
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { text: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    if (field === "text" || field === "correctAnswer") {
      updated[index][field] = value;
    } else {
      const [, optionIndex] = field.split("-");
      updated[index].options[optionIndex] = value;
    }
    setQuestions(updated);
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      let res;
      if (editingQuizIndex !== null) {
        const quizId = quizzes[editingQuizIndex].id;
        res = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/quiz/${quizId}`, {
          questions,
        });
        const updated = [...quizzes];
        updated[editingQuizIndex] = res.data;
        setQuizzes(updated);
      } else {
        res = await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/quiz`, {
          questions,
        });
        setQuizzes((prev) => [...prev, res.data]);
      }

      toast.success("Quiz saved");
      cancelEdit();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(`Error: ${error.response?.data?.error || "Something went wrong"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Ensure quizzes is an array before rendering
    if (!Array.isArray(quizzes)) {
      console.error("Invalid quizzes data:", quizzes);
      setQuizzes([]);
    }
  }, [quizzes]);

  return (
    <div className="mt-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chapter Quizzes</h2>
        <Button onClick={startNewQuiz}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Quiz
        </Button>
      </div>

      {/* Quiz List */}
      {Array.isArray(quizzes) && quizzes.length > 0 ? (
        quizzes.map((quiz, qIndex) => (
          <div key={quiz.id} className="bg-slate-100 p-4 rounded border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Quiz {qIndex + 1}</h3>
              <Button variant="ghost" size="sm" onClick={() => editQuiz(qIndex)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
            <ul className="space-y-2">
              {quiz.questions.map((q, i) => (
                <li key={i}>
                  <strong>{q.text}</strong>
                  <ul className="ml-4">
                    {q.options.map((opt, oi) => (
                      <li key={oi} className={opt.isCorrect ? "text-green-600" : ""}>
                        {opt.isCorrect && <CheckCircle className="inline h-4 w-4 mr-1" />}
                        {opt.text} {/* Ensure you're rendering the 'text' property of the option */}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No quizzes available for this chapter.</p>
      )}

      {/* Quiz Editor */}
      {questions.length > 0 && (
        <div className="bg-white border rounded p-4 space-y-4">
          <h3 className="font-semibold">{editingQuizIndex !== null ? "Edit Quiz" : "New Quiz"}</h3>

          {questions.map((q, i) => (
            <div key={i} className="space-y-2 border-b pb-4 mb-4">
              <Label>Question {i + 1}</Label>
              <Input
                placeholder="Question text"
                value={q.text}
                onChange={(e) => updateQuestion(i, "text", e.target.value)}
              />
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex space-x-2 items-center">
                  <Input
                    value={opt}
                    onChange={(e) => updateQuestion(i, `options-${oi}`, e.target.value)}
                  />
                  <Button
                    variant={opt === q.correctAnswer ? "default" : "outline"}
                    onClick={() => updateQuestion(i, "correctAnswer", opt)}
                  >
                    Correct
                  </Button>
                </div>
              ))}
              <Button variant="destructive" size="sm" onClick={() => removeQuestion(i)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Question
              </Button>
            </div>
          ))}

          <Button variant="ghost" onClick={addQuestion}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Question
          </Button>

          <div className="flex justify-end space-x-2">
            <Button onClick={cancelEdit} variant="outline">
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Quiz"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
