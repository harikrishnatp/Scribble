"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, RotateCcw, AlertCircle } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface VideoQuizProps {
  videoId: string;
  videoTitle: string;
  onSaveQuizAnswers?: (videoId: string, answers: Record<string, number>) => void;
}

export function VideoQuiz({ videoId, videoTitle, onSaveQuizAnswers }: VideoQuizProps) {
  // Sample quiz questions - in production these would come from props or API
  const [questions] = useState<QuizQuestion[]>([
    {
      id: "q1",
      question: "What is the main concept covered in this video?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      explanation: "This is the correct answer because...",
    },
    {
      id: "q2",
      question: "Which of the following best describes the topic?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 1,
      explanation: "This is the correct answer because...",
    },
    {
      id: "q3",
      question: "How would you apply this concept?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 2,
      explanation: "This is the correct answer because...",
    },
  ]);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (!submitted) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: optionIndex,
      }));
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowExplanations(true);
    if (onSaveQuizAnswers) {
      onSaveQuizAnswers(videoId, answers);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setShowExplanations(false);
  };

  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctAnswer
  ).length;
  const score = Math.round((correctCount / questions.length) * 100);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border border-zinc-700">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">Quiz: {videoTitle}</CardTitle>
              <p className="text-sm text-gray-400 mt-2">
                Test your understanding of this video
              </p>
            </div>
            {submitted && (
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{score}%</div>
                <div className="text-sm text-gray-400">
                  {correctCount} of {questions.length} correct
                </div>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {questions.map((question, idx) => {
          const isCorrect = answers[question.id] === question.correctAnswer;
          const isAnswered = answers[question.id] !== undefined;
          const userAnswerIndex = answers[question.id];

          return (
            <Card
              key={question.id}
              className="bg-zinc-900 border border-zinc-700 overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-400">
                        {idx + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white mb-4">
                      {question.question}
                    </h3>

                    <RadioGroup
                      value={
                        userAnswerIndex !== undefined
                          ? userAnswerIndex.toString()
                          : ""
                      }
                      onValueChange={(value) =>
                        handleAnswerSelect(question.id, parseInt(value))
                      }
                      disabled={submitted}
                    >
                      <div className="space-y-3">
                        {question.options.map((option, optionIdx) => {
                          const isSelected = userAnswerIndex === optionIdx;
                          const isOptionCorrect = optionIdx === question.correctAnswer;
                          let optionBgClass = "bg-zinc-800 border-zinc-700";

                          if (submitted) {
                            if (isOptionCorrect) {
                              optionBgClass =
                                "bg-green-950 border-green-700";
                            } else if (isSelected && !isCorrect) {
                              optionBgClass =
                                "bg-zinc-800 border-zinc-700";
                            }
                          }

                          return (
                            <div
                              key={optionIdx}
                              className={`flex items-center gap-3 p-3 rounded-lg border ${optionBgClass} cursor-pointer hover:border-gray-600 transition-colors`}
                              onClick={() =>
                                handleAnswerSelect(question.id, optionIdx)
                              }
                            >
                              <RadioGroupItem
                                value={optionIdx.toString()}
                                id={`${question.id}-${optionIdx}`}
                                className="flex-shrink-0"
                              />
                              <Label
                                htmlFor={`${question.id}-${optionIdx}`}
                                className="flex-1 cursor-pointer text-gray-300"
                              >
                                {option}
                              </Label>
                              {submitted && (
                                <>
                                  {isOptionCorrect && (
                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                  )}
                                  {isSelected && !isCorrect && (
                                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </RadioGroup>

                    {submitted && showExplanations && (
                      <div
                        className={`mt-4 p-3 rounded-lg border ${
                          isCorrect
                            ? "bg-green-950 border-green-700"
                            : "bg-yellow-950 border-yellow-700"
                        }`}
                      >
                        <div className="flex gap-2 mb-2">
                          {isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                          )}
                          <p
                            className={`text-sm font-semibold ${
                              isCorrect
                                ? "text-green-400"
                                : "text-yellow-400"
                            }`}
                          >
                            {isCorrect ? "Correct!" : "Incorrect"}
                          </p>
                        </div>
                        <p className="text-sm text-gray-300">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!submitted ? (
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="flex-1 bg-white text-black hover:bg-gray-200 font-semibold py-6"
          >
            Submit Quiz
          </Button>
        </div>
      ) : (
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 border-zinc-600 text-white hover:bg-zinc-800 py-6"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Quiz
          </Button>
          <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{score}%</div>
              <div className="text-sm text-gray-400">
                {correctCount}/{questions.length} correct
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
