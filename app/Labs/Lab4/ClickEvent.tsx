"use client"
import { Button } from "react-bootstrap";

const hello = () => {
  alert("Hello World!");
};

const lifeIs = (good: string) => {
  alert(`Life is ${good}`);
};

export default function ClickEvent() {
  return (
    <div id="wd-click-event" className="container mt-3">
      <div className="border rounded p-3" style={{ maxWidth: "400px" }}>
        <h2 className="fw-bold mb-3">Click Event</h2>
        
        <div className="d-grid gap-2">
          <Button 
            onClick={hello} 
            id="wd-hello-world-click"
            variant="primary"
            size="lg"
          >
            Hello World!
          </Button>
          
          <Button 
            onClick={() => lifeIs("Good!")}
            id="wd-life-is-good-click"
            variant="success"
            size="lg"
          >
            Life is Good!
          </Button>
          
          <Button 
            onClick={() => {
              hello();
              lifeIs("Great!");
            }} 
            id="wd-life-is-great-click"
            variant="info"
            size="lg"
          >
            Life is Great!
          </Button>
        </div>
      </div>
      <hr/>
    </div>
  );
}