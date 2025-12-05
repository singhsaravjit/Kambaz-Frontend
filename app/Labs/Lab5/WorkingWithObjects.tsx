import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithObjects() {

    const [assignment, setAssignment] = useState({
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", completed: false, score: 0,
  });
  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`

  const [module, setModule] = useState({
    id: "CS101",
    name: "Introduction to Computer Science",
    description: "Learn the fundamentals of programming and computer science",
    course: "CS5610"
  });
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
      <h4>Retrieving Objects</h4>
      <a id="wd-retrieve-assignments" className="btn btn-primary"
         href={`${HTTP_SERVER}/lab5/assignment`}>
        Get Assignment
      </a><hr/>
      <h4>Retrieving Properties</h4>
      <a id="wd-retrieve-assignment-title" className="btn btn-primary"
         href={`${HTTP_SERVER}/lab5/assignment/title`}>
        Get Title
      </a><hr/>
      <h4>Modifying Properties</h4>
      <a id="wd-update-assignment-title"
         className="btn btn-primary float-end"
         href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
        Update Title </a>
      <FormControl className="w-75" id="wd-assignment-title"
        defaultValue={assignment.title} onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })}/>
      <hr />

      <h4>Modifying Assignment Score</h4>
      <a id="wd-update-assignment-score"
         className="btn btn-primary float-end"
         href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
        Update Score </a>
      <FormControl className="w-75" id="wd-assignment-score"
        type="number"
        value={assignment.score} onChange={(e) =>
          setAssignment({ ...assignment, score: parseInt(e.target.value) })}/>
      <hr />

      <h4>Modifying Assignment Completed</h4>
      <a id="wd-update-assignment-completed"
         className="btn btn-primary float-end"
         href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
        Update Completed </a>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" 
          id="wd-assignment-completed"
          checked={assignment.completed} 
          onChange={(e) =>
            setAssignment({ ...assignment, completed: e.target.checked })}/>
        <label className="form-check-label" htmlFor="wd-assignment-completed">
          Completed
        </label>
      </div>
      <hr />

      <h3>Working With Modules</h3>
      <h4>Retrieving Module</h4>
      <a id="wd-retrieve-module" className="btn btn-primary"
         href={`${MODULE_API_URL}`}>
        Get Module
      </a><hr/>
      
      <h4>Retrieving Module Name</h4>
      <a id="wd-retrieve-module-name" className="btn btn-primary"
         href={`${MODULE_API_URL}/name`}>
        Get Module Name
      </a><hr/>

      <h4>Modifying Module Name</h4>
      <div className="d-flex align-items-center mb-3">
        <FormControl className="flex-grow-1 me-2" id="wd-module-name"
          value={module.name} onChange={(e) =>
            setModule({ ...module, name: e.target.value })}/>
        <a id="wd-update-module-name"
           className="btn btn-primary"
           href={`${MODULE_API_URL}/name/${module.name}`}>
          Update Module Name </a>
      </div>
      <hr />

      <h4>Modifying Module Description</h4>
      <div className="d-flex align-items-center mb-3">
        <FormControl className="flex-grow-1 me-2" id="wd-module-description"
          value={module.description} onChange={(e) =>
            setModule({ ...module, description: e.target.value })}/>
        <a id="wd-update-module-description"
           className="btn btn-primary"
           href={`${MODULE_API_URL}/description/${module.description}`}>
          Update Module Description </a>
      </div>
      <hr />

    </div>
  );
}
