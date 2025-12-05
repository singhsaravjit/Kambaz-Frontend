const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
import React, { useState } from "react";
import { FormControl } from "react-bootstrap";

export default function WorkingWithArrays() {
  const API = `${HTTP_SERVER}/lab5/todos`;
  const [todo, setTodo] = useState({ id: "1",
     title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-09-09",
    completed: false,
   });
  
  // Separate state for each section to avoid interference
  const [todoIdToRetrieve, setTodoIdToRetrieve] = useState("1");
  const [todoIdToRemove, setTodoIdToRemove] = useState("1");
  const [todoToUpdate, setTodoToUpdate] = useState({ id: "1", title: "NodeJS Assignment" });
  const [todoCompletedUpdate, setTodoCompletedUpdate] = useState({ id: "1", completed: false });
  const [todoDescriptionUpdate, setTodoDescriptionUpdate] = useState({ id: "1", description: "Create a NodeJS server with ExpressJS" });

  return (
    <div id="wd-working-with-arrays">
      <h3>Working with Arrays</h3>
      <h4>Retrieving Arrays</h4>
      <a id="wd-retrieve-todos" className="btn btn-primary" href={API}>
        Get Todos </a><hr/>
         <h4>Retrieving an Item from an Array by ID</h4>
      <a id="wd-retrieve-todo-by-id" className="btn btn-primary float-end" href={`${API}/${todoIdToRetrieve}`}>
        Get Todo by ID
      </a>
      <FormControl id="wd-todo-id" value={todoIdToRetrieve} className="w-50"
        onChange={(e) => setTodoIdToRetrieve(e.target.value)} />
      <hr />
      <h3>Filtering Array Items</h3>
  <a id="wd-retrieve-completed-todos" className="btn btn-primary"
     href={`${API}?completed=true`}>
    Get Completed Todos
  </a><hr />
  <h3>Creating new Items in an Array</h3>
  <a id="wd-retrieve-completed-todos" className="btn btn-primary"
     href={`${API}/create`}>
    Create Todo
  </a><hr />
  <h3>Removing from an Array</h3>
<a id="wd-remove-todo" className="btn btn-primary float-end" href={`${API}/${todoIdToRemove}/delete`}>
   Remove Todo with ID = {todoIdToRemove} </a>
<FormControl value={todoIdToRemove} className="w-50" onChange={(e) => setTodoIdToRemove(e.target.value)}/><hr/>
<h3>Updating an Item in an Array</h3>
      <a href={`${API}/${todoToUpdate.id}/title/${todoToUpdate.title}`} className="btn btn-primary float-end">
        Update Todo</a>
      <FormControl value={todoToUpdate.id} className="w-25 float-start me-2"
        onChange={(e) => setTodoToUpdate({ ...todoToUpdate, id: e.target.value })}/>
      <FormControl value={todoToUpdate.title} className="w-50 float-start"
             onChange={(e) => setTodoToUpdate({ ...todoToUpdate, title: e.target.value }) }/>
      <br /><br /><hr />

      <h4>Updating Completed Property</h4>
      <a href={`${API}/${todoCompletedUpdate.id}/completed/${todoCompletedUpdate.completed}`} 
         className="btn btn-primary float-end">
        Update Completed
      </a>
      <FormControl value={todoCompletedUpdate.id} className="w-25 float-start me-2"
        onChange={(e) => setTodoCompletedUpdate({ ...todoCompletedUpdate, id: e.target.value })}/>
      <div className="form-check float-start">
        <input className="form-check-input" type="checkbox" 
          id="wd-todo-completed"
          checked={todoCompletedUpdate.completed} 
          onChange={(e) => setTodoCompletedUpdate({ ...todoCompletedUpdate, completed: e.target.checked })}/>
        <label className="form-check-label" htmlFor="wd-todo-completed">
          Completed
        </label>
      </div>
      <div style={{ clear: 'both' }}></div>
      <hr />

      <h4>Updating Description Property</h4>
      <a href={`${API}/${todoDescriptionUpdate.id}/description/${todoDescriptionUpdate.description}`} className="btn btn-primary float-end">
        Update Description</a>
      <FormControl value={todoDescriptionUpdate.id} className="w-25 float-start me-2"
        onChange={(e) => setTodoDescriptionUpdate({ ...todoDescriptionUpdate, id: e.target.value })}/>
      <FormControl value={todoDescriptionUpdate.description} className="w-25 float-start"
        onChange={(e) => setTodoDescriptionUpdate({ ...todoDescriptionUpdate, description: e.target.value })}/>
      <br /><br /><hr />

    </div>
);}
