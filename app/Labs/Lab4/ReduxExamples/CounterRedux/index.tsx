/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./counterReducer";
import { Button } from "react-bootstrap";

export default function CounterRedux() {
  const { count } = useSelector((state: any) => state.counterReducer);
  const dispatch = useDispatch();
  
  return (
    <div id="wd-counter-redux" className="container mt-3">
      <h2 className="fw-bold">Counter Redux</h2>
      <h3 className="fw-bold mb-3">{count}</h3>
      <div className="d-flex">
        <Button 
          onClick={() => dispatch(increment())}
          id="wd-counter-redux-increment-click"
          variant="outline-dark"
          className="me-0 rounded-0"
          style={{ borderRadius: "0" }}
        > 
          Increment 
        </Button>
        <Button 
          onClick={() => dispatch(decrement())}
          id="wd-counter-redux-decrement-click"
          variant="outline-dark"
          className="rounded-0"
          style={{ borderRadius: "0", borderLeft: "0" }}
        > 
          Decrement 
        </Button>
      </div>
      <hr/>
    </div>
  );
}