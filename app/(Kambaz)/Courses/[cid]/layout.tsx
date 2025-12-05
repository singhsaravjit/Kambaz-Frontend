/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useState, useEffect, useMemo } from "react";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import { FaAlignJustify } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import useHydrateUser from "../../hooks/useHydrateUser"; 


export default function CoursesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { cid } = useParams();


  const hydratedUser = useHydrateUser();

  
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { enrollments } = useSelector(
    (state: any) => state.enrollmentsReducer
  );

  const effectiveUser = currentUser || hydratedUser;

  const course = courses.find((course: any) => course._id === cid);

  const isEnrolled = useMemo(() => {
    if (!effectiveUser) return false;
    return enrollments?.some(
      (e: any) => e.user === effectiveUser._id && e.course === cid
    );
  }, [effectiveUser, enrollments, cid]);

  const [showNavigation, setShowNavigation] = useState(true);
  const toggleNavigation = () => setShowNavigation(!showNavigation);

  
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

 
    if (!effectiveUser) {
      router.replace("/Dashboard");
      return;
    }

    if (!isEnrolled) {
      router.replace("/Dashboard");
      return;
    }
  }, [ready, effectiveUser, isEnrolled, router]);

  if (!ready) {
    return null;
  }
  if (!effectiveUser || !isEnrolled) {
    return null;
  }

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify
          className="me-4 fs-4 mb-1"
          style={{ cursor: "pointer" }}
          onClick={toggleNavigation}
        />
        <Breadcrumb course={course?.name} />
      </h2>
      <hr />
      <div className="d-flex">
        {showNavigation && (
          <div className="d-none d-md-block">
            <CourseNavigation />
          </div>
        )}
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
