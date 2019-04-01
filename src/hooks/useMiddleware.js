import { useReducer } from "react";

const compose = (...funcs) => {
  return arg => funcs.reduceRight((composed, fn) => fn(composed), arg);
};

const applyMiddleware = middlewares => {
  return createStore => (...args) => {
    const store = createStore(...args);
    const chain = middlewares.map(middleware =>
      middleware({
        getState: store.getState,
        dispatch: action => dispatch(action)
      })
    );
    const dispatch = compose(...chain)(store.dispatch);
    return { ...store, dispatch };
  };
};

const useMiddleware = (reducer, initalState, ...middlewares) => {
  if (typeof reducer !== "function") {
    throw new Error("Expected the reducer to be a function.");
  }
  const [state, dispatch] = useReducer(reducer, initalState);
  const createStore = () => ({ dispatch, getState: () => state });
  const { getState, dispatch: wrappedDispatch } = applyMiddleware(middlewares)(
    createStore
  )();
  return [getState(), wrappedDispatch];
};

export default useMiddleware;
