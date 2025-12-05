/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const { todos } = useSelector((state: any) => state.todosReducer);
  
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  
  const deleteElement = (index: number) => {
    setArray(array.filter((item, i) => i !== index));
  };
  
  return (
    <div id="wd-array-state-variables" className="container mt-3">
      <div className="border rounded p-3">
        <h2>Array State Variable</h2>
        <Button 
          onClick={addElement}
          variant="success"
          className="mb-3"
        >
          Add Element
        </Button>
        
        <ListGroup className="mb-4">
          {array.map((item, index) => (
            <ListGroupItem 
              key={index}
              className="d-flex justify-content-between align-items-center"
            >
              <span className="fs-5 fw-bold">{item}</span>
              <Button 
                onClick={() => deleteElement(index)}
                variant="danger"
                size="sm"
              >
                Delete
              </Button>
            </ListGroupItem>
          ))}
        </ListGroup>

        <h3 className="mt-4">Todos from Redux:</h3>
        <ListGroup>
          {todos.map((todo: any) => (
            <ListGroupItem key={todo.id} className="fw-bold">
              {todo.title}
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
      <hr/>
    </div>
  );
}