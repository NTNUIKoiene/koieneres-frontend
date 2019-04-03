import { useState } from "react";

const compose = (...funcs) => {
  return arg => funcs.reduceRight((composed, fn) => fn(composed), arg);
};

const useMiddleware = (reducer, initalState, ...middlewares) => {
  const [state, setState] = useState(initalState);

  const createStore = () => {
    let currentState = state;

    const getState = () => currentState;

    const dispatch = action => {
      const nextState = reducer(state, action);
      currentState = nextState;
      setState(nextState);
      return action;
    };
    return { getState, dispatch };
  };

  const store = createStore();
  const chain = middlewares.map(middleware => middleware(store));
  const dispatch = compose(...chain)(store.dispatch);
  return [state, dispatch];
};

export default useMiddleware;
