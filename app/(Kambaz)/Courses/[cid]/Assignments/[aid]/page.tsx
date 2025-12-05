/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Form, Row, Col, Card } from "react-bootstrap";
import { addAssignment, updateAssignment } from "../reducer";
import * as coursesClient from "../../../client";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();


  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const role = currentUser?.role;
  const canEdit = role === "FACULTY" || role === "ADMIN";

 
  const existing = assignments.find(
    (a: any) => a._id === aid && a.course === cid
  );

 
  const [formData, setFormData] = useState<any>({
    _id: undefined,
    title: "",
    description: "",
    points: 100,

   
    dueDate: "", 
    availableFrom: "", 
    availableUntil: "",

  
    group: "ASSIGNMENTS",
    displayGradeAs: "Percentage",
    submissionType: "Online",

    textEntry: false,
    websiteUrl: true,
    mediaRecordings: false,
    studentAnnotation: false,
    fileUpload: false,

    assignTo: "Everyone",

    course: cid,
  });

  useEffect(() => {
    if (aid === "new") {
      
      setFormData({
        _id: undefined,
        title: "",
        description: `The assignment is available online

Submit a link to the landing page of your Web application running on Netlify.

The landing page should include the following:

- Your full name and section
- Links to each of the lab assignments
- Link to the Kanbas application
- Links to all relevant source code repositories

The Kanbas application should include a link to navigate back to the landing page.`,
        points: 100,

        dueDate: "",
        availableFrom: "",
        availableUntil: "",

        group: "ASSIGNMENTS",
        displayGradeAs: "Percentage",
        submissionType: "Online",

        textEntry: false,
        websiteUrl: true,
        mediaRecordings: false,
        studentAnnotation: false,
        fileUpload: false,

        assignTo: "Everyone",

        course: cid,
      });
    } else {
      
      if (!existing) {
        router.replace(`/Courses/${cid}/Assignments`);
        return;
      }

      setFormData({
        _id: existing._id,
        title: existing.title ?? "",
        description: existing.description ?? "",
        points: existing.points ?? 100,

       
        dueDate: existing.dueDateInput ?? "",
        availableFrom: existing.availableFromDate ?? "",
        availableUntil: existing.availableUntilDate ?? "",

        group: existing.group ?? "ASSIGNMENTS",
        displayGradeAs: existing.displayGradeAs ?? "Percentage",
        submissionType: existing.submissionType ?? "Online",

        textEntry: existing.textEntry ?? false,
        websiteUrl: existing.websiteUrl ?? true,
        mediaRecordings: existing.mediaRecordings ?? false,
        studentAnnotation: existing.studentAnnotation ?? false,
        fileUpload: existing.fileUpload ?? false,

        assignTo: existing.assignTo ?? "Everyone",

        course: existing.course ?? cid,
      });
    }
    
  }, [aid, cid, existing]);


  const handleChange = (field: string, value: any) => {
    if (!canEdit) return;
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string) => {
    if (!canEdit) return;
    setFormData((prev: any) => ({ ...prev, [field]: !prev[field] }));
  };

 
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      return `${month} ${day} at 12:00am`;
    } catch (e) {
      return "";
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  const handleSave = async () => {
    if (!canEdit) {
      router.push(`/Courses/${cid}/Assignments`);
      return;
    }

    const assignmentData = {
      title: formData.title,
      course: cid,
      description: formData.description,
      points: formData.points,

      availableFrom: formatDateForDisplay(formData.availableFrom),
      dueDate: formatDateForDisplay(formData.dueDate),

      dueDateInput: formData.dueDate,
      availableFromDate: formData.availableFrom,
      availableUntilDate: formData.availableUntil,

      group: formData.group,
      displayGradeAs: formData.displayGradeAs,
      submissionType: formData.submissionType,

      textEntry: formData.textEntry,
      websiteUrl: formData.websiteUrl,
      mediaRecordings: formData.mediaRecordings,
      studentAnnotation: formData.studentAnnotation,
      fileUpload: formData.fileUpload,

      assignTo: formData.assignTo,
    };

    try {
      if (aid === "new") {
        const newAssignment = await coursesClient.createAssignment(cid as string, assignmentData);
        dispatch(addAssignment(newAssignment));
      } else {
        const updatedAssignment = await coursesClient.updateAssignment({
          _id: formData._id,
          ...assignmentData,
        });
        dispatch(updateAssignment(updatedAssignment));
      }
      router.push(`/Courses/${cid}/Assignments`);
    } catch (error) {
      console.error("Error saving assignment:", error);
    }
  };

  return (
    <div id="wd-assignments-editor" className="container-fluid mt-4">
      <Row>
        <Col md={10} className="mx-auto">
          <Form>
            
            <div className="mb-3">
              <Form.Label htmlFor="wd-name">Assignment Name</Form.Label>
              <Form.Control
                id="wd-name"
                type="text"
                className="form-control"
                value={formData.title}
                readOnly={!canEdit}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

         
            <div className="mb-4">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                id="wd-description"
                rows={10}
                style={{ lineHeight: "1.8" }}
                value={formData.description}
                readOnly={!canEdit}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

           
            <Row className="mb-3">
              <Col md={3} className="text-end">
                <Form.Label>Points</Form.Label>
              </Col>
              <Col md={9}>
                <Form.Control
                  id="wd-points"
                  type="number"
                  style={{ maxWidth: "300px" }}
                  value={formData.points}
                  readOnly={!canEdit}
                  onChange={(e) =>
                    handleChange("points", Number(e.target.value))
                  }
                />
              </Col>
            </Row>

          
            <Row className="mb-3">
              <Col md={3} className="text-end">
                <Form.Label>Assignment Group</Form.Label>
              </Col>
              <Col md={9}>
                <Form.Select
                  id="wd-group"
                  style={{ maxWidth: "100%" }}
                  value={formData.group}
                  disabled={!canEdit}
                  onChange={(e) => handleChange("group", e.target.value)}
                >
                  <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                  <option value="QUIZZES">QUIZZES</option>
                  <option value="EXAMS">EXAMS</option>
                  <option value="PROJECTS">PROJECTS</option>
                </Form.Select>
              </Col>
            </Row>

           
            <Row className="mb-3">
              <Col md={3} className="text-end">
                <Form.Label>Display Grade as</Form.Label>
              </Col>
              <Col md={9}>
                <Form.Select
                  id="wd-display-grade-as"
                  style={{ maxWidth: "100%" }}
                  value={formData.displayGradeAs}
                  disabled={!canEdit}
                  onChange={(e) =>
                    handleChange("displayGradeAs", e.target.value)
                  }
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Points">Points</option>
                  <option value="Complete/Incomplete">
                    Complete/Incomplete
                  </option>
                  <option value="Letter Grade">Letter Grade</option>
                </Form.Select>
              </Col>
            </Row>

           
            <Row className="mb-3">
              <Col md={3} className="text-end">
                <Form.Label>Submission Type</Form.Label>
              </Col>
              <Col md={9}>
                <Card className="p-3">
                  <Form.Select
                    id="wd-submission-type"
                    className="mb-3"
                    value={formData.submissionType}
                    disabled={!canEdit}
                    onChange={(e) =>
                      handleChange("submissionType", e.target.value)
                    }
                  >
                    <option value="Online">Online</option>
                    <option value="On Paper">On Paper</option>
                    <option value="No Submission">No Submission</option>
                  </Form.Select>

                  <div>
                    <h6 className="mb-3">Online Entry Options</h6>

                    <Form.Check
                      type="checkbox"
                      id="wd-text-entry"
                      label="Text Entry"
                      checked={!!formData.textEntry}
                      disabled={!canEdit}
                      onChange={() => handleCheckboxChange("textEntry")}
                      className="mb-2"
                    />

                    <Form.Check
                      type="checkbox"
                      id="wd-website-url"
                      label="Website URL"
                      checked={!!formData.websiteUrl}
                      disabled={!canEdit}
                      onChange={() => handleCheckboxChange("websiteUrl")}
                      className="mb-2"
                    />

                    <Form.Check
                      type="checkbox"
                      id="wd-media-recordings"
                      label="Media Recordings"
                      checked={!!formData.mediaRecordings}
                      disabled={!canEdit}
                      onChange={() => handleCheckboxChange("mediaRecordings")}
                      className="mb-2"
                    />

                    <Form.Check
                      type="checkbox"
                      id="wd-student-annotation"
                      label="Student Annotation"
                      checked={!!formData.studentAnnotation}
                      disabled={!canEdit}
                      onChange={() =>
                        handleCheckboxChange("studentAnnotation")
                      }
                      className="mb-2"
                    />

                    <Form.Check
                      type="checkbox"
                      id="wd-file-upload"
                      label="File Uploads"
                      checked={!!formData.fileUpload}
                      disabled={!canEdit}
                      onChange={() => handleCheckboxChange("fileUpload")}
                      className="mb-2"
                    />
                  </div>
                </Card>
              </Col>
            </Row>

            
            <Row className="mb-3">
              <Col md={3} className="text-end">
                <Form.Label>Assign</Form.Label>
              </Col>
              <Col md={9}>
                <div className="border rounded p-3">
                  <Form.Label htmlFor="wd-assign-to">Assign to</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      id="wd-assign-to"
                      className="pe-5"
                      style={{ backgroundColor: "#f8f8f8" }}
                      value={formData.assignTo}
                      readOnly={!canEdit}
                      onChange={(e) =>
                        handleChange("assignTo", e.target.value)
                      }
                    />
                    <span
                      className="position-absolute"
                      style={{
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#6c757d",
                      }}
                    >
                      ✕
                    </span>
                  </div>

               
                  <Form.Label htmlFor="wd-due-date" className="mt-3">
                    Due
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    id="wd-due-date"
                    value={formData.dueDate}
                    readOnly={!canEdit}
                    disabled={!canEdit}
                    onChange={(e) =>
                      handleChange("dueDate", e.target.value)
                    }
                  />

                  <Row className="mt-3">
                    <Col>
                      <Form.Label htmlFor="wd-available-from">
                        Available from
                      </Form.Label>
                      <Form.Control
                        type="date"
                        id="wd-available-from"
                        value={formData.availableFrom}
                        readOnly={!canEdit}
                        disabled={!canEdit}
                        onChange={(e) =>
                          handleChange("availableFrom", e.target.value)
                        }
                      />
                    </Col>
                    <Col>
                      <Form.Label htmlFor="wd-available-until">
                        Until
                      </Form.Label>
                      <Form.Control
                        type="date"
                        id="wd-available-until"
                        value={formData.availableUntil}
                        readOnly={!canEdit}
                        disabled={!canEdit}
                        onChange={(e) =>
                          handleChange("availableUntil", e.target.value)
                        }
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            <hr className="my-4" />

            
            <div className="text-end">
              {!canEdit ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Back
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
