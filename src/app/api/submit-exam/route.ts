import { NextRequest, NextResponse } from "next/server";

// Google Form Configuration
// 1. Create a Google Form with the following fields:
//    - Entry ID for "Student Name" (copy from form submission URL)
//    - Entry ID for "Email"
//    - Entry ID for "Phone Number"
//    - Entry ID for "Score"
//    - Entry ID for "Total Questions"
//    - Entry ID for "Percentage"
//    - Entry ID for "Status"
//    - Entry ID for "Answers" (JSON string)
//
// 2. Get your Google Form ID and Entry IDs:
//    - Open form in edit mode, open browser DevTools
//    - Fill test submission and watch Network tab
//    - Look for POST request to docs.google.com/forms/d/e/...
//    - Entry IDs will be in the request payload (e.g., "entry.1234567890")

// Replace these with your actual Google Form details
const GOOGLE_FORM_URL = process.env.GOOGLE_FORM_URL || ""; // e.g., "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse"
const ENTRY_STUDENT_NAME = process.env.ENTRY_STUDENT_NAME || "entry.123456789"; // Replace with actual entry ID
const ENTRY_EMAIL = process.env.ENTRY_EMAIL || "entry.987654321"; // Replace with actual entry ID
const ENTRY_PHONE = process.env.ENTRY_PHONE || "entry.555555555"; // Replace with actual entry ID
const ENTRY_SCORE = process.env.ENTRY_SCORE || "entry.444444444"; // Replace with actual entry ID
const ENTRY_TOTAL_QUESTIONS =
  process.env.ENTRY_TOTAL_QUESTIONS || "entry.333333333"; // Replace with actual entry ID
const ENTRY_PERCENTAGE = process.env.ENTRY_PERCENTAGE || "entry.222222222"; // Replace with actual entry ID
const ENTRY_STATUS = process.env.ENTRY_STATUS || "entry.111111111"; // Replace with actual entry ID
const ENTRY_ANSWERS = process.env.ENTRY_ANSWERS || "entry.666666666"; // Replace with actual entry ID

interface SubmitExamRequest {
  phoneNumber: string;
  userName: string;
  userEmail: string;
  score: number;
  totalQuestions: number;
  answers: {
    questionId: number;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitExamRequest = await request.json();

    // Validate input
    if (!body.phoneNumber || !body.userName || !body.userEmail) {
      return NextResponse.json(
        { error: "Phone number, user name, and email are required" },
        { status: 400 }
      );
    }

    // Calculate score
    const correctAnswers = body.answers.filter((a) => a.isCorrect).length;
    const percentage = Math.round((correctAnswers / body.totalQuestions) * 100);
    const status = percentage >= 60 ? "PASSED" : "FAILED";

    // Prepare data for Google Form
    const formData = new URLSearchParams();
    formData.append(ENTRY_STUDENT_NAME, body.userName);
    formData.append("Student Name", "vivek");
    formData.append(ENTRY_EMAIL, body.userEmail);
    formData.append(ENTRY_PHONE, body.phoneNumber);
    formData.append(ENTRY_SCORE, correctAnswers.toString());
    formData.append(ENTRY_TOTAL_QUESTIONS, body.totalQuestions.toString());
    formData.append(ENTRY_PERCENTAGE, percentage.toString());
    formData.append(ENTRY_STATUS, status);
    formData.append(
      ENTRY_ANSWERS,
      JSON.stringify(
        body.answers.map((a) => ({
          questionId: a.questionId,
          selected: a.selectedAnswer,
          correct: a.correctAnswer,
          isCorrect: a.isCorrect,
        }))
      )
    );

    // Submit to Google Form
    console.log({ GOOGLE_FORM_URL });
    if (GOOGLE_FORM_URL) {
      try {
        const googleResponse = await fetch(GOOGLE_FORM_URL, {
          method: "POST",
          body: formData,
          mode: "no-cors", // Important: Google Forms requires no-cors
        });
        console.log("Data submitted to Google Form successfully");
        console.log({ googleResponse });
      } catch (formError) {
        console.error("Error submitting to Google Form:", formError);
        // Continue anyway - form submission is best-effort
      }
    } else {
      console.warn(
        "GOOGLE_FORM_URL not configured. Data not sent to Google Form."
      );
    }

    // Return response to client
    return NextResponse.json(
      {
        success: true,
        message: "Exam submitted successfully",
        score: correctAnswers,
        totalQuestions: body.totalQuestions,
        percentage,
        status: status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting exam:", error);
    return NextResponse.json(
      { error: "Failed to submit exam" },
      { status: 500 }
    );
  }
}
