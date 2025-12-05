/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useSelector } from "react-redux";
import { ListGroup } from "react-bootstrap";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const { todos } = useSelector((state: any) => state.todosReducer);
  
  return (
    <div id="wd-todo-list-redux" className="container mt-3">
      <h2 className="fw-bold">Todo List</h2>
      <ListGroup>
        <TodoForm />
        {todos.map((todo: any) => (
          <TodoItem 
            key={todo.id}
            todo={todo} 
          />
        ))}
      </ListGroup>
      <hr/>
    </div>
  );
}