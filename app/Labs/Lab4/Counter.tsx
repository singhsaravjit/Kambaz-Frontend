import { useState } from "react";
import { Button } from "react-bootstrap";

export default function Counter() {
  const [count, setCount] = useState(7);
  console.log(count);
  
  return (
    <div className="container mt-3">
      <div className="border rounded p-3" style={{ maxWidth: "300px" }}>
        <h2 className="fw-bold">Counter: {count}</h2>
        <div className="d-flex gap-2">
          <Button 
            onClick={() => setCount(count + 1)}
            id="wd-counter-up-click"
            variant="success"
            size="lg"
          >
            Up
          </Button>
          <Button 
            onClick={() => setCount(count - 1)}
            id="wd-counter-down-click"
            variant="danger"
            size="lg"
          >
            Down
          </Button>
        </div>
      </div>
      <hr/>
    </div>
  );
}