"use client";

import { Question } from "@/lib/questions";
import { useState, useEffect } from "react";

interface QuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (questionId: number, selectedOption: number) => void;
  selectedAnswer: number | null;
}

export default function QuestionComponent({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  selectedAnswer,
}: QuestionProps) {
  const [isCopyBlocked, setIsCopyBlocked] = useState(false);

  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      setIsCopyBlocked(true);
      setTimeout(() => setIsCopyBlocked(false), 2000);
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+C, Ctrl+X, Ctrl+A
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "c" || e.key === "x" || e.key === "a")
      ) {
        e.preventDefault();
        setIsCopyBlocked(true);
        setTimeout(() => setIsCopyBlocked(false), 2000);
      }
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className="question-card"
      style={{
        width: "100%",
        maxWidth: "90vw",
        padding: "24px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        boxSizing: "border-box",
        userSelect: "none",
      }}
    >
      {/* Copy blocked warning */}
      {isCopyBlocked && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            backgroundColor: "#fee2e2",
            border: "1px solid #fca5a5",
            color: "#b91c1c",
            borderRadius: "6px",
          }}
        >
          Copying is not allowed during the exam!
        </div>
      )}

      {/* Question header */}
      <div style={{ marginBottom: "16px" }}>
        <p
          style={{
            fontSize: "14px",
            color: "#4b5563",
            marginBottom: "8px",
          }}
        >
          Question {questionNumber} of {totalQuestions}
        </p>
        <div
          style={{
            width: "100%",
            backgroundColor: "#e5e7eb",
            borderRadius: "9999px",
            height: "8px",
            marginTop: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: "#2563eb",
              height: "8px",
              borderRadius: "9999px",
              width: `${(questionNumber / totalQuestions) * 100}%`,
              transition: "width 0.3s ease-in-out",
            }}
          ></div>
        </div>
      </div>

      {/* Question text */}
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#1f2937",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(question.id, index)}
            style={{
              width: "100%",
              padding: "16px",
              textAlign: "left",
              borderRadius: "8px",
              border:
                selectedAnswer === index
                  ? "2px solid #2563eb"
                  : "2px solid #d1d5db",
              backgroundColor: selectedAnswer === index ? "#eff6ff" : "#f9fafb",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "18px",
              boxSizing: "border-box",
            }}
            onMouseOver={(e) => {
              if (selectedAnswer !== index) {
                e.currentTarget.style.borderColor = "#9ca3af";
              }
            }}
            onMouseOut={(e) => {
              if (selectedAnswer !== index) {
                e.currentTarget.style.borderColor = "#d1d5db";
              }
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border:
                    selectedAnswer === index
                      ? "2px solid #2563eb"
                      : "2px solid #9ca3af",
                  marginRight: "12px",
                  backgroundColor:
                    selectedAnswer === index ? "#2563eb" : "transparent",
                  flexShrink: 0,
                }}
              >
                {selectedAnswer === index && (
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "18px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
