/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import * as db from "../Database";

const initialState = {
  // your database enrollments array:
  // [ { _id: "1", user: "123", course: "RS101" }, ... ]
  enrollments: db.enrollments,
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, { payload: enrollments }) => {
      state.enrollments = enrollments;
    },
    enrollInCourse: (
      state,
      { payload }: { payload: { user: string; course: string } }
    ) => {
      const { user, course } = payload;

      // check if already enrolled
      const already = state.enrollments.some(
        (e: any) => e.user === user && e.course === course
      );
      if (!already) {
        // synthesize a simple _id for the new enrollment row
        const newId = crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);

        state.enrollments = [
          ...state.enrollments,
          { _id: newId, user, course },
        ] as any;
      }
    },

    unenrollFromCourse: (
      state,
      { payload }: { payload: { user: string; course: string } }
    ) => {
      const { user, course } = payload;

      state.enrollments = state.enrollments.filter(
        (e: any) => !(e.user === user && e.course === course)
      );
    },
  },
});

export const { setEnrollments, enrollInCourse, unenrollFromCourse } =
  enrollmentsSlice.actions;

export default enrollmentsSlice.reducer;
