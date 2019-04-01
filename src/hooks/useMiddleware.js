import { useState } from "react";

const compose = (...funcs) => {
  return arg => funcs.reduceRight((composed, fn) => fn(composed), arg);
};

const useMiddleware = (reducer, initalState, ...middlewares) => {
  if (typeof reducer !== "function") {
    throw new Error("Expected the reducer to be a function.");
  }
  const [state, setState] = useState(initalState);

  const dispatch = action => {
    const nextState = reducer(state, action);
    setState(nextState);
    return action;
  };
  const store = { getState: () => state, dispatch };
  const chain = middlewares.map(middleware => middleware(store));

  const wrappedDispatch = compose(...chain)(store.dispatch);
  return [state, wrappedDispatch];
};

export default useMiddleware;
