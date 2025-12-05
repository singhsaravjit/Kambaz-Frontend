import { useState } from "react";
import { FormControl, Form } from "react-bootstrap";

export default function ObjectStateVariable() {
  const [person, setPerson] = useState({ name: "Peter", age: 24 });
  
  return (
    <div className="container mt-3">
      <div className="border rounded p-3" style={{ maxWidth: "400px" }}>
        <h2 className="fw-bold">Object State Variables</h2>
        
        <pre className="bg-light p-3 rounded border">
          {JSON.stringify(person, null, 2)}
        </pre>
        
        <Form>
          <Form.Group className="mb-3">
            
            <FormControl
              value={person.name}
              onChange={(e) => setPerson({ ...person, name: e.target.value })}
              className="fw-bold"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            
            <FormControl
              value={person.age}
              type="number"
              onChange={(e) => setPerson({ ...person, age: parseInt(e.target.value) })}
              className="fw-bold"
            />
          </Form.Group>
        </Form>
      </div>
      <hr/>
    </div>
  );
}