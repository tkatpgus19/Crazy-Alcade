import React from "react";

import { decrement, increment } from "./counterSlice";
import { useDispatch, useSelector } from "react-redux";

export function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <button
          aria-label="increment value"
          value
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <span> {count} </span>
        <button
          aria-label="decrement value"
          value
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div>
    </div>
  );
}
