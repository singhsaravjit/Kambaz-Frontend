import React from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { Button, ListGroupItem } from "react-bootstrap";

export default function TodoItem({ todo }: { todo: { id: string; title: string } }) {
  const dispatch = useDispatch();
  
  return (
    <ListGroupItem className="d-flex align-items-center gap-2">
      <div style={{ width: "200px" }} className="fw-bold">
        {todo.title}
      </div>
      <Button 
        onClick={() => dispatch(setTodo(todo))}
        id="wd-set-todo-click"
        variant="primary"
      > 
        Edit 
      </Button>
      <Button 
        onClick={() => dispatch(deleteTodo(todo.id))}
        id="wd-delete-todo-click"
        variant="danger"
      > 
        Delete 
      </Button>
    </ListGroupItem>
  );
}