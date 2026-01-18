"use client";

import { useEffect, useRef, useState } from "react";
import QuestionComponent from "@/components/Question";
import Timer from "@/components/Timer";
import { questions, Question } from "@/lib/questions";
import {
  enterFullscreen,
  exitFullscreen,
  isFullscreenEnabled,
} from "@/lib/fullscreen";

interface Answer {
  questionId: number;
  selectedAnswer: number | null;
}

// Hardcoded interviewer mobile number - change this to the actual interviewer's number
const INTERVIEWER_PHONE = "+919876543210";

export default function ExamPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasSubmittedRef = useRef(false); // Track submission with ref instead of state
  const isExitingForSubmitRef = useRef(false); // Track intentional fullscreen exit with ref
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(
    questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: null,
    })),
  );
  const [examFinished, setExamFinished] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [warningShown, setWarningShown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [detailsEntered, setDetailsEntered] = useState(false);
  const [examFailed, setExamFailed] = useState(false);
  const [failureReason, setFailureReason] = useState<string | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);

      // If exam is running and they exit fullscreen (but not during intentional submission), mark as failed
      if (
        examStarted &&
        !examFinished &&
        isFullscreen &&
        !isNowFullscreen &&
        !isExitingForSubmitRef.current
      ) {
        setExamFailed(true);
        setFailureReason("Fullscreen exited");
        handleTimeUp();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [examStarted, examFinished, isFullscreen]);

  // Prevent window from losing focus and auto-submit on tab switch
  useEffect(() => {
    if (!examStarted || !isFullscreen || examFinished) return;

    let warningCount = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        warningCount++;
        setWarningShown(true);
        setTimeout(() => setWarningShown(false), 3000);

        // Mark as failed and auto-submit after 1 tab switch
        if (warningCount >= 1) {
          setExamFailed(true);
          setFailureReason("Browser tab switched");
          handleTimeUp();
        }
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (examStarted && !examFinished) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [examStarted, isFullscreen, warningShown, examFinished]);

  const startExam = async () => {
    if (!isFullscreenEnabled()) {
      alert("Fullscreen is not available on your device/browser");
      return;
    }

    if (containerRef.current) {
      try {
        await enterFullscreen(containerRef.current);
        setExamStarted(true);
      } catch (error) {
        alert("Failed to enter fullscreen. Please try again.");
      }
    }
  };

  const handleDetailsSubmit = () => {
    if (!userName.trim() || !userEmail.trim()) {
      alert("Please enter your name and email");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    setDetailsEntered(true);
  };

  const handleAnswer = (questionId: number, selectedOption: number) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === questionId
          ? { ...a, selectedAnswer: selectedOption }
          : a,
      ),
    );
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleTimeUp = async () => {
    isExitingForSubmitRef.current = true;
    await exitFullscreen();
    await autoSubmitExam();
  };

  const finishExam = async () => {
    isExitingForSubmitRef.current = true;
    await exitFullscreen();
    await autoSubmitExam();
  };

  const autoSubmitExam = async () => {
    // Prevent double submission using ref (synchronous check)
    if (hasSubmittedRef.current) {
      return;
    }
    hasSubmittedRef.current = true;

    setExamFinished(true);
    setSubmitting(true);

    try {
      // If exam failed (tab switch), score is 0
      let finalScore = 0;
      let answersWithCorrect;

      if (examFailed) {
        // Mark all answers as incorrect if exam failed
        answersWithCorrect = answers.map((answer) => {
          const question = questions.find((q) => q.id === answer.questionId)!;
          return {
            questionId: answer.questionId,
            selectedAnswer: answer.selectedAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect: false, // All marked as incorrect due to failure
          };
        });
      } else {
        // Calculate correct answers normally
        answersWithCorrect = answers.map((answer) => {
          const question = questions.find((q) => q.id === answer.questionId)!;
          return {
            questionId: answer.questionId,
            selectedAnswer: answer.selectedAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect: answer.selectedAnswer === question.correctAnswer,
          };
        });
        finalScore = answersWithCorrect.filter((a) => a.isCorrect).length;
      }

      const response = await fetch("/api/submit-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: INTERVIEWER_PHONE,
          userName,
          userEmail,
          score: finalScore,
          totalQuestions: questions.length,
          answers: answersWithCorrect,
          failureReason: examFailed
            ? "Tab switch detected - Exam marked as FAILED"
            : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const submitExam = async () => {
    // Prevent double submission using ref (synchronous check)
    if (hasSubmittedRef.current) {
      return;
    }
    hasSubmittedRef.current = true;

    setSubmitting(true);

    try {
      // Calculate correct answers
      const answersWithCorrect = answers.map((answer) => {
        const question = questions.find((q) => q.id === answer.questionId)!;
        return {
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect: answer.selectedAnswer === question.correctAnswer,
        };
      });

      const response = await fetch("/api/submit-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: INTERVIEWER_PHONE,
          userName,
          userEmail,
          score: answersWithCorrect.filter((a) => a.isCorrect).length,
          totalQuestions: questions.length,
          answers: answersWithCorrect,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        alert("Failed to submit exam");
      }
    } catch (error) {
      alert("Error submitting exam");
    } finally {
      setSubmitting(false);
    }
  };

  // Start screen - ask for details first
  if (!detailsEntered) {
    return (
      <div
        ref={containerRef}
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            padding: "32px",
            maxWidth: "480px",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "16px",
              color: "#1f2937",
            }}
          >
            Online Exam System
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              marginBottom: "24px",
              fontSize: "14px",
            }}
          >
            Please enter your details to proceed with the exam
          </p>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#374151",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d1d5db";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#374151",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d1d5db";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            onClick={handleDetailsSubmit}
            style={{
              width: "100%",
              backgroundColor: "#3b82f6",
              color: "white",
              fontWeight: "bold",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#3b82f6";
            }}
          >
            Continue to Exam Instructions
          </button>
        </div>
      </div>
    );
  }

  // Exam instructions screen
  if (!examStarted) {
    return (
      <div
        ref={containerRef}
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            padding: "32px",
            maxWidth: "480px",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "16px",
              color: "#1f2937",
            }}
          >
            Online Exam System
          </h1>
          <div
            style={{
              backgroundColor: "#eff6ff",
              borderLeft: "4px solid #3b82f6",
              padding: "16px",
              marginBottom: "24px",
              borderRadius: "6px",
            }}
          >
            <h2
              style={{
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "12px",
                fontSize: "16px",
              }}
            >
              Exam Instructions:
            </h2>
            <ul
              style={{
                fontSize: "14px",
                color: "#374151",
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                ✓ You will have 20 minutes to complete the exam
              </li>
              <li style={{ marginBottom: "8px" }}>
                ✓ There are 35 questions (25 conceptual + 10 code output
                prediction)
              </li>
              <li style={{ marginBottom: "8px" }}>
                ✓ You cannot copy or take screenshots
              </li>
              <li style={{ marginBottom: "8px" }}>
                ✓ The exam will run in fullscreen mode
              </li>
              <li style={{ marginBottom: "8px" }}>
                ✓ Your score will be automatically submitted to the interviewer
              </li>
              <li style={{ marginBottom: "8px" }}>
                ⚠️ Exiting fullscreen will result in AUTOMATIC FAIL (Score = 0)
              </li>
              <li style={{ marginBottom: "0px" }}>
                ⚠️ Toggling browser tab will result in AUTOMATIC FAIL (Score =
                0)
              </li>
            </ul>
          </div>
          <button
            onClick={startExam}
            style={{
              width: "100%",
              backgroundColor: "#3b82f6",
              color: "white",
              fontWeight: "bold",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#3b82f6";
            }}
          >
            Start Exam
          </button>
          <p
            style={{
              fontSize: "12px",
              color: "#9ca3af",
              textAlign: "center",
              marginTop: "16px",
            }}
          >
            Make sure you have 20 minutes available before starting
          </p>
        </div>
      </div>
    );
  }

  // Warning for losing focus
  if (warningShown && examStarted && !examFinished) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
        }}
      >
        <div
          style={{
            backgroundColor: "#dc2626",
            color: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
            maxWidth: "400px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            ⚠️ Warning
          </h2>
          <p style={{ marginBottom: "16px" }}>
            You have left the exam window! Stay in the exam to continue.
          </p>
          <p style={{ fontSize: "14px" }}>
            Leaving the exam multiple times will result in automatic submission.
          </p>
        </div>
      </div>
    );
  }

  // Exam in progress
  if (examStarted && !examFinished && !result) {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers.find(
      (a) => a.questionId === currentQuestion.id,
    );

    return (
      <div
        ref={containerRef}
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#eff6ff",
          background: "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
          padding: "16px",
          boxSizing: "border-box",
          margin: 0,
          overflow: "auto",
        }}
      >
        <Timer totalMinutes={20} onTimeUp={handleTimeUp} />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          <QuestionComponent
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            selectedAnswer={currentAnswer?.selectedAnswer ?? null}
          />
        </div>

        {/* Navigation and submission */}
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            style={{
              backgroundColor:
                currentQuestionIndex === 0 ? "#d1d5db" : "#4b5563",
              color: "white",
              fontWeight: "bold",
              padding: "8px 24px",
              border: "none",
              borderRadius: "6px",
              cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => {
              if (currentQuestionIndex !== 0) {
                e.currentTarget.style.backgroundColor = "#374151";
              }
            }}
            onMouseOut={(e) => {
              if (currentQuestionIndex !== 0) {
                e.currentTarget.style.backgroundColor = "#4b5563";
              }
            }}
          >
            ← Previous
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              backgroundColor: "white",
              borderRadius: "6px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            {currentQuestionIndex + 1} / {questions.length}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={finishExam}
              style={{
                backgroundColor: "#16a34a",
                color: "white",
                fontWeight: "bold",
                padding: "8px 24px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#15803d";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#16a34a";
              }}
            >
              Finish Exam
            </button>
          ) : (
            <button
              onClick={goToNextQuestion}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                fontWeight: "bold",
                padding: "8px 24px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#1d4ed8";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
              }}
            >
              Next →
            </button>
          )}
        </div>

        {/* Question counter */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                fontWeight: "bold",
                transition: "background-color 0.2s",
                border: "none",
                cursor: "pointer",
                backgroundColor:
                  answers[index].selectedAnswer !== null
                    ? "#22c55e"
                    : index === currentQuestionIndex
                      ? "#2563eb"
                      : "#d1d5db",
                color:
                  answers[index].selectedAnswer !== null ||
                  index === currentQuestionIndex
                    ? "white"
                    : "#374151",
              }}
              onMouseOver={(e) => {
                if (
                  answers[index].selectedAnswer === null &&
                  index !== currentQuestionIndex
                ) {
                  e.currentTarget.style.backgroundColor = "#9ca3af";
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor =
                  answers[index].selectedAnswer !== null
                    ? "#22c55e"
                    : index === currentQuestionIndex
                      ? "#2563eb"
                      : "#d1d5db";
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Results screen
  if (result) {
    const correctAnswers = result.score;
    const percentage = result.percentage;
    const isPassed = result.status === "PASSED";

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            padding: "32px",
            maxWidth: "480px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "16px",
              color: isPassed ? "#22c55e" : "#ef4444",
            }}
          >
            {isPassed ? "✓" : "✗"}
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "16px",
              color: isPassed ? "#16a34a" : "#dc2626",
            }}
          >
            {examFailed
              ? "ASSESSMENT FAILED"
              : isPassed
                ? "Assessment Complete!"
                : "Assessment Complete!"}
          </h1>
          {examFailed && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                borderLeft: "4px solid #dc2626",
                padding: "12px",
                marginBottom: "16px",
                borderRadius: "6px",
                textAlign: "left",
              }}
            >
              <p style={{ color: "#991b1b", fontSize: "14px", margin: 0 }}>
                ⚠️ Your exam was marked as FAILED.
                {failureReason === "Fullscreen exited" &&
                  " You exited fullscreen mode during the exam."}
                {failureReason === "Browser tab switched" &&
                  " You switched to another browser tab during the exam."}
              </p>
            </div>
          )}
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <p style={{ color: "#374151", marginBottom: "8px" }}>Your Score:</p>
            <p
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#2563eb",
                marginBottom: "8px",
              }}
            >
              {correctAnswers}/{questions.length}
            </p>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#1f2937",
              }}
            >
              {percentage}%
            </p>
          </div>
          <button
            onClick={() => {
              window.location.reload();
            }}
            style={{
              width: "100%",
              backgroundColor: "#3b82f6",
              color: "white",
              fontWeight: "bold",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#3b82f6";
            }}
          >
            Close Assessment
          </button>
        </div>
      </div>
    );
  }
}
