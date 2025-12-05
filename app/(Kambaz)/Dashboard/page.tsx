/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as client from "../Courses/client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCourse,
  setCourses 
} from "../Courses/reducer";
import {
  setEnrollments,
  enrollInCourse,
  unenrollFromCourse,
} from "../Enrollments/reducer";
import useHydrateUser from "../hooks/useHydrateUser";
import Link from "next/link";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Row,
  Col,
  FormControl,
} from "react-bootstrap";

import { v4 as uuidv4 } from "uuid";

export default function Dashboard() {
  const dispatch = useDispatch();


  const hydratedUser = useHydrateUser();

  
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { enrollments } = useSelector(
    (state: any) => state.enrollmentsReducer
  );

  // Debug: log enrollments changes
  useEffect(() => {
    console.log("Enrollments updated:", enrollments);
  }, [enrollments]);

  
  const effectiveUser = currentUser || hydratedUser;

  
  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const [showAllCourses, setShowAllCourses] = useState<boolean>(false);

  const fetchCourses = async () => {
    try {
      console.log("Fetching courses, showAllCourses:", showAllCourses);
      const courses = showAllCourses 
        ? await client.fetchAllCourses()
        : await client.findMyCourses();
      console.log("Fetched courses:", courses.length);
      dispatch(setCourses(courses));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const enrollments = await client.findAllEnrollments();
      dispatch(setEnrollments(enrollments));
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };
  
  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([ ...courses, newCourse ]));
  };

  const onDeleteCourse = async (courseId: string) => {
    // Unenroll the current user from the course instead of deleting it
    if (!effectiveUser?._id) return;
    try {
      await client.unenrollFromCourse(effectiveUser._id, courseId);
      dispatch(
        unenrollFromCourse({
          user: effectiveUser._id,
          course: courseId,
        })
      );
      // Remove from displayed courses
      dispatch(setCourses(courses.filter((course: any) => course._id !== courseId)));
    } catch (error) {
      console.error("Error unenrolling from course:", error);
    }
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(setCourses(courses.map((c: any) => {
        if (c._id === course._id) { return course; }
        else { return c; }
    })));};


  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, [currentUser, showAllCourses]);

 
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

 
  const isEnrolled = (courseId: string) => {
    if (!effectiveUser?._id) return false;
    const enrolled = enrollments.some(
      (e: any) => {
        console.log(`Checking enrollment:`, { enrollmentUser: e.user, actualUser: effectiveUser._id, enrollmentCourse: e.course, actualCourse: courseId, match: e.user === effectiveUser._id && e.course === courseId });
        return e.user === effectiveUser._id && e.course === courseId;
      }
    );
    console.log(`isEnrolled check for course ${courseId}:`, enrolled, "user:", effectiveUser._id, "enrollments:", enrollments.length);
    return enrolled;
  };

  
  const canEdit =
    effectiveUser?.role === "FACULTY" || effectiveUser?.role === "ADMIN";

  
  const handleEnroll = async (courseId: string) => {
    if (!effectiveUser?._id) return;
    try {
      await client.enrollInCourse(effectiveUser._id, courseId);
      dispatch(
        enrollInCourse({
          user: effectiveUser._id,
          course: courseId,
        })
      );
      console.log("Enrolled in course:", courseId);
      console.log("Current enrollments:", enrollments);
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    if (!effectiveUser?._id) return;
    try {
      await client.unenrollFromCourse(effectiveUser._id, courseId);
      dispatch(
        unenrollFromCourse({
          user: effectiveUser._id,
          course: courseId,
        })
      );
    } catch (error) {
      console.error("Error unenrolling from course:", error);
    }
  };

 
  const handleAddCourse = () => {
    if (!canEdit) return;

    
    const newId = uuidv4();

   
    const newCourse = {
      ...course,
      _id: newId,
    };

   
    dispatch(addNewCourse(newCourse));

    
    if (effectiveUser?._id) {
      dispatch(
        enrollInCourse({
          user: effectiveUser._id,
          course: newId,
        })
      );
    }

   
    setCourse({
      _id: "0",
      name: "New Course",
      number: "New Number",
      startDate: "2023-09-10",
      endDate: "2023-12-15",
      image: "/images/reactjs.jpg",
      description: "New Description",
    });

    
  };

  
  if (!ready) {
    return null;
  }

  return (
    <div id="wd-dashboard">
     
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 id="wd-dashboard-title" className="mb-0">
            Dashboard
          </h1>
        </div>

        <div>
          <button
            className="btn btn-primary"
            id="wd-enrollments-toggle"
            onClick={() => setShowAllCourses(!showAllCourses)}
          >
            {showAllCourses
              ? "Show My Enrollments"
              : "Show All Enrollments"}
          </button>
        </div>
      </div>

      <hr />

    
      {canEdit && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={onAddNewCourse}
            >
              Add
            </button>

            <button
              className="btn btn-warning float-end me-2"
              id="wd-update-course-click"
              onClick={onUpdateCourse}
            >
              Update
            </button>
          </h5>

          <hr />
          <br />

          
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) =>
              setCourse({ ...course, name: e.target.value })
            }
          />

         
          <FormControl
            as="textarea"
            rows={3}
            className="mb-2"
            value={course.description}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />

          <hr />
        </>
      )}

     
      <h2 id="wd-dashboard-published">
        {showAllCourses
          ? `All Courses (${courses.length})`
          : `My Courses (${courses.length})`}
      </h2>
      <hr />

     
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.map((c: any) => {
            // Recalculate enrollment status on every render when enrollments change
            const enrolled = isEnrolled(c._id);

            return (
              <Col
                key={`${c._id}-${enrolled}`}
                className="wd-dashboard-course"
                style={{ width: "300px" }}
              >
                <Card>
                 
                  <Link
                    href={enrolled ? `/Courses/${c._id}/Home` : "/Dashboard"}
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    <CardImg
                      src={c.image}
                      variant="top"
                      width="100%"
                      height={160}
                    />
                    <CardBody className="card-body">
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {c.name}
                      </CardTitle>

                      <CardText
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        {c.description}
                      </CardText>

                     
                      <Button variant="primary" disabled={!enrolled}>
                        Go
                      </Button>

                     
                      {showAllCourses && (
                        <>
                          {enrolled ? (
                            <button
                              className="btn btn-danger float-end"
                              id={`wd-unenroll-${c._id}`}
                              onClick={(event) => {
                                event.preventDefault();
                                handleUnenroll(c._id);
                              }}
                            >
                              Unenroll
                            </button>
                          ) : (
                            <button
                              className="btn btn-success float-end"
                              id={`wd-enroll-${c._id}`}
                              onClick={(event) => {
                                event.preventDefault();
                                handleEnroll(c._id);
                              }}
                            >
                              Enroll
                            </button>
                          )}
                        </>
                      )}

                     
                      {canEdit && (
                        <>
                          <button
                            id="wd-delete-course-click"
                            className="btn btn-danger float-end me-2"
                            onClick={(event) => {
                              event.preventDefault();
                              onDeleteCourse(c._id);
                            }}
                          >
                            Delete
                          </button>

                          <button
                            id="wd-edit-course-click"
                            className="btn btn-warning me-2 float-end"
                            onClick={(event) => {
                              event.preventDefault();
                              setCourse(c);
                            }}
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </CardBody>
                  </Link>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
