/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import * as client from "./client";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { FaPencil } from "react-icons/fa6";

export default function WorkingWithArraysAsynchronously() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [todos, setTodos] = useState<any[]>([]);
  
  const fetchTodos = async () => {
    const todos = await client.fetchTodos();
    setTodos(todos);
  };
  
  useEffect(() => {
    fetchTodos();
  }, []);

  const removeTodo = async (todo: any) => {
    try {
      setErrorMessage(null);
      const updatedTodos = await client.removeTodo(todo);
      setTodos(updatedTodos);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to remove todo");
      console.log(error);
    }
  };
  
  const createNewTodo = async () => {
    try {
      setErrorMessage(null);
      const todos = await client.createNewTodo();
      setTodos(todos);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to create todo");
    }
  };
  
  const postNewTodo = async () => {
    try {
      setErrorMessage(null);
      const newTodo = await client.postNewTodo({ title: "New Posted Todo", completed: false });
      setTodos([...todos, newTodo]);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to post todo");
    }
  };
  
  const deleteTodo = async (todo: any) => {
    try {
      setErrorMessage(null);
      await client.deleteTodo(todo);
      const newTodos = todos.filter((t) => t.id !== todo.id);
      setTodos(newTodos);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to delete todo");
      console.log(error);
    }
  };

  const editTodo = (todo: any) => {
    setErrorMessage(null);
    const updatedTodos = todos.map(
      (t) => t.id === todo.id ? { ...todo, editing: true } : t );
    setTodos(updatedTodos);
  };
  
  const updateTodo = async (todo: any) => {
    try {
      setErrorMessage(null);
      await client.updateTodo(todo);
      setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to update todo");
    }
  };


  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>
      {errorMessage && (<div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2">{errorMessage}</div>)}
      <h4>
        Todos 
        <FaPlusCircle onClick={postNewTodo} className="text-primary float-end fs-3" id="wd-post-todo" />
        <FaPlusCircle onClick={createNewTodo} className="text-success float-end fs-3 me-2" id="wd-create-todo" />
      </h4>
      <ListGroup>
        {todos.map((todo) => (
          <ListGroupItem key={todo.id} className="d-flex align-items-center">
            <input 
              type="checkbox" 
              checked={todo.completed} 
              className="form-check-input me-2"
              onChange={(e) => updateTodo({ ...todo, completed: e.target.checked })} 
            />
            {!todo.editing ? (
              <span style={{ 
                textDecoration: todo.completed ? "line-through" : "none",
                flex: 1
              }}>
                {todo.title}
              </span>
            ) : (
              <FormControl 
                className="flex-grow-1 me-2" 
                value={todo.title}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTodo({ ...todo, editing: false });
                  }
                }}
                onChange={(e) => updateTodo({ ...todo, title: e.target.value })}
                autoFocus
              />
            )}
            
            <FaPencil 
              onClick={() => editTodo(todo)} 
              className="text-primary ms-2 me-2" 
              style={{ cursor: 'pointer' }}
            />
            <TiDelete 
              onClick={() => deleteTodo(todo)} 
              className="text-danger fs-3" 
              id="wd-delete-todo" 
              style={{ cursor: 'pointer' }}
            />
            <FaTrash 
              onClick={() => removeTodo(todo)}
              className="text-danger ms-2" 
              id="wd-remove-todo"
              style={{ cursor: 'pointer' }}
            />
          </ListGroupItem>
        ))}
      </ListGroup> 
      <hr />
    </div>
  );
}
