/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { usePathname, useParams } from "next/navigation";
import { useSelector } from "react-redux";

interface BreadcrumbProps {
  course: { 
    name: string;
    _id: string;
  } | undefined;
}

export default function Breadcrumb({ course }: BreadcrumbProps) {
  const pathname = usePathname();
  const params = useParams();
  const cid = params.cid as string;
  
  
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);

  const getCurrentSection = () => {
    
    if (pathname === `/Courses/${cid}` || pathname === `/Courses/${cid}/Home`) {
      return 'Home';
    }
   
    if (pathname.includes('/Assignments')) {
      const segments = pathname.split('/');
      const assignmentIndex = segments.indexOf('Assignments');
      const assignmentId = segments[assignmentIndex + 1];
      
      if (assignmentId) {
        const assignment = assignments.find((a: any) => a._id === assignmentId);
        const assignmentName = assignmentId === 'new' 
          ? 'New Assignment' 
          : (assignment?.title || assignmentId);
        return `Assignments > ${assignmentName}`;
      }
      return 'Assignments';
    }
    
    if (pathname.includes('/Quizzes')) {
      const segments = pathname.split('/');
      const quizIndex = segments.indexOf('Quizzes');
      const quizId = segments[quizIndex + 1];
      
      if (quizId) {
        const quiz = quizzes.find((q: any) => q._id === quizId);
        const quizName = quizId === 'new' 
          ? 'New Quiz' 
          : (quiz?.title || 'Quiz Details');
        
        // Check if we're in a sub-page (Edit, Preview, Take)
        const subPage = segments[quizIndex + 2];
        if (subPage) {
          return `Quizzes > ${quizName} > ${subPage}`;
        }
        return `Quizzes > ${quizName}`;
      }
      return 'Quizzes';
    }
    

    if (pathname.includes('/People')) {
      const segments = pathname.split('/');
      const peopleIndex = segments.indexOf('People');
      const view = segments[peopleIndex + 1];
      
      if (view) {
        return `People > ${view}`;
      }
      return 'People';
    }
    

    if (pathname.includes('/Modules')) return 'Modules';
    if (pathname.includes('/Grades')) return 'Grades';
    if (pathname.includes('/Piazza')) return 'Piazza';
    if (pathname.includes('/Zoom')) return 'Zoom';

    return 'Home';
  };

  return (
    <span>
      {course?.name || `Course ${cid}`} &gt; {getCurrentSection()}
    </span>
  );
}