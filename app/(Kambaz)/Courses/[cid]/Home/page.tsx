/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";

import Modules from "../Modules/page";
import CourseStatus from "./Status";

export default function Home() {
  const router = useRouter();
  const { cid } = useParams(); 
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector(
    (state: any) => state.enrollmentsReducer
  );

  
  const isEnrolled = enrollments.some(
    (e: any) => e.user === currentUser?._id && e.course === cid
  );

  
  useEffect(() => {
    if (!currentUser || !isEnrolled) {
      router.replace("/Dashboard");
    }
  }, [currentUser, isEnrolled, router]);

  
  if (!currentUser || !isEnrolled) {
    return null;
  }

 
  return (
    <div id="wd-home">
      <div className="d-flex" id="wd-home">
        <div className="flex-fill me-3">
          <Modules />
        </div>
        <div className="d-none d-lg-block">
          <CourseStatus />
        </div>
      </div>
    </div>
  );
}
