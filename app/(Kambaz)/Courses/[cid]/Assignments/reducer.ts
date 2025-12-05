/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { createSlice } from "@reduxjs/toolkit";
import { assignments as dbAssignments } from "../../../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  assignments: dbAssignments,
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (state, { payload: assignments }) => {
      state.assignments = assignments;
    },
    addAssignment: (state, { payload: assignment }) => {
      
      const newAssignment: any = {
        _id: uuidv4(),
        title: assignment.title ?? "New Assignment",
        description: assignment.description ?? "",
        points: assignment.points ?? 100,
        dueDate: assignment.dueDate ?? "",
        availableFrom: assignment.availableFrom ?? "",
        availableUntil: assignment.availableUntil ?? "",
        
       
        dueDateInput: assignment.dueDateInput ?? "",
        availableFromDate: assignment.availableFromDate ?? "",
        availableUntilDate: assignment.availableUntilDate ?? "",
        
       
        group: assignment.group ?? "ASSIGNMENTS",
        displayGradeAs: assignment.displayGradeAs ?? "Percentage",
        submissionType: assignment.submissionType ?? "Online",
        
       
        textEntry: assignment.textEntry ?? false,
        websiteUrl: assignment.websiteUrl ?? true,
        mediaRecordings: assignment.mediaRecordings ?? false,
        studentAnnotation: assignment.studentAnnotation ?? false,
        fileUpload: assignment.fileUpload ?? false,
        
        assignTo: assignment.assignTo ?? "Everyone",
        course: assignment.course, 
      };
      state.assignments = [...state.assignments, newAssignment] as any;
    },

    deleteAssignment: (state, { payload: assignmentId }) => {
      state.assignments = state.assignments.filter(
        (a: any) => a._id !== assignmentId
      );
    },

    updateAssignment: (state, { payload: assignment }) => {
     
      state.assignments = state.assignments.map((a: any) =>
        a._id === assignment._id ? { ...a, ...assignment } : a
      ) as any;
    },

    editAssignment: (state, { payload: assignmentId }) => {
     
      state.assignments = state.assignments.map((a: any) =>
        a._id === assignmentId ? { ...a, editing: true } : a
      ) as any;
    },
  },
});

export const {
  setAssignments,
  addAssignment,
  deleteAssignment,
  updateAssignment,
  editAssignment,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
