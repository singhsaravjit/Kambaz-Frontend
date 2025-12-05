/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { Button, FormControl, ListGroupItem } from "react-bootstrap";

export default function TodoForm() {
  const { todo } = useSelector((state: any) => state.todosReducer);
  const dispatch = useDispatch();
  
  return (
    <ListGroupItem className="d-flex align-items-center gap-2">
      <FormControl 
        value={todo.title}
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
        style={{ maxWidth: "200px" }}
        className="fw-bold"
      />
      <Button 
        onClick={() => dispatch(updateTodo(todo))}
        id="wd-update-todo-click"
        variant="warning"
        className="text-dark fw-bold"
      > 
        Update 
      </Button>
      <Button 
        onClick={() => dispatch(addTodo(todo))}
        id="wd-add-todo-click"
        variant="success"
      > 
        Add 
      </Button>
    </ListGroupItem>
  );
}