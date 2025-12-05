/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { createSlice } from "@reduxjs/toolkit";
import { quizzes as dbQuizzes } from "../../../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  quizzes: dbQuizzes,
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, { payload: quizzes }) => {
      state.quizzes = quizzes;
    },
    addQuiz: (state, { payload: quiz }) => {
      const newQuiz: any = {
        _id: uuidv4(),
        title: quiz.title ?? "New Quiz",
        description: quiz.description ?? "",
        quizType: quiz.quizType ?? "Graded Quiz",
        points: quiz.points ?? 0,
        assignmentGroup: quiz.assignmentGroup ?? "Quizzes",
        shuffleAnswers: quiz.shuffleAnswers ?? true,
        timeLimit: quiz.timeLimit ?? 20,
        multipleAttempts: quiz.multipleAttempts ?? false,
        attemptsAllowed: quiz.attemptsAllowed ?? 1,
        showCorrectAnswers: quiz.showCorrectAnswers ?? "After submission",
        accessCode: quiz.accessCode ?? "",
        oneQuestionAtATime: quiz.oneQuestionAtATime ?? true,
        webcamRequired: quiz.webcamRequired ?? false,
        lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering ?? false,
        dueDate: quiz.dueDate ?? "",
        dueDateInput: quiz.dueDateInput ?? "",
        availableDate: quiz.availableDate ?? "",
        availableDateInput: quiz.availableDateInput ?? "",
        untilDate: quiz.untilDate ?? "",
        untilDateInput: quiz.untilDateInput ?? "",
        published: quiz.published ?? false,
        questions: quiz.questions ?? [],
        course: quiz.course,
      };
      state.quizzes = [...state.quizzes, newQuiz] as any;
    },
    deleteQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.filter(
        (q: any) => q._id !== quizId
      );
    },
    updateQuiz: (state, { payload: quiz }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quiz._id ? { ...q, ...quiz } : q
      ) as any;
    },
    publishQuiz: (state, { payload: { quizId, published } }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quizId ? { ...q, published } : q
      ) as any;
    },
  },
});

export const {
  setQuizzes,
  addQuiz,
  deleteQuiz,
  updateQuiz,
  publishQuiz,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;

