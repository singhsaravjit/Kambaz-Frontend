/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { add } from "./addReducer";
import { Button, FormControl } from "react-bootstrap";

export default function AddRedux() {
  const [a, setA] = useState(12);
  const [b, setB] = useState(23);
  const { sum } = useSelector((state: any) => state.addReducer);
  const dispatch = useDispatch();
  
  return (
    <div className="container mt-3" id="wd-add-redux">
      <div className="border rounded p-3" style={{ maxWidth: "300px" }}>
        <h2 className="fw-bold">Add Redux</h2>
        <h4 className="fw-bold text-center my-3">
          {a} + {b} = {sum}
        </h4>
        
        <div className="mb-2">
          <FormControl 
            type="number" 
            value={a}
            onChange={(e) => setA(parseInt(e.target.value))}
            className="fw-bold text-center"
          />
        </div>
        
        <div className="mb-2">
          <FormControl 
            type="number" 
            value={b}
            onChange={(e) => setB(parseInt(e.target.value))}
            className="fw-bold text-center"
          />
        </div>
        
        <Button 
          id="wd-add-redux-click"
          onClick={() => dispatch(add({ a, b }))}
          variant="primary"
          className="w-100"
        >
          Add Redux
        </Button>
      </div>
      <hr/>
    </div>
  );
}