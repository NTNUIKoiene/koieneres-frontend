import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { useReducer } from "react";
import { useAbortableRequest } from "../../hooks";
import Header from "../Header";
import AddClosing from "./AddClosing";
import { ExistingClosingCard, LoadingCard } from "./ExistingClosingCard";
import styles from "./Closing.module.css";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";
import axios from "axios";
import { BASE_URL } from "../../config";

const initalState = {
  isLoading: true,
  showError: false,
  fetchExistingClosings: true,
  existingClosings: []
};

const actions = {
  SET_IS_LOADING: "SET_IS_LOADING",
  SET_SHOW_ERROR: "SET_SHOW_ERROR",
  SET_EXISTING_CLOSINGS: "SET_EXISTING_CLOSINGS",
  FETCH_EXISTING_CLOSINGS: "FETCH_EXISTING_CLOSINGS"
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    case actions.SET_SHOW_ERROR:
      return { ...state, showError: action.payload };
    case actions.SET_EXISTING_CLOSINGS:
      return { ...state, existingClosings: action.payload };
    case actions.FETCH_EXISTING_CLOSINGS:
      return { ...state, fetchExistingClosings: !state.fetchExistingClosings };
    default:
      return { ...state };
  }
};

const Closing = props => {
  const [state, dispatch] = useReducer(reducer, initalState);

  useAbortableRequest(
    "GET",
    `${BASE_URL}/api/cabin-closings/`,
    response => {
      dispatch({
        type: actions.SET_EXISTING_CLOSINGS,
        payload: response.data.results
      });
      dispatch({ type: actions.SET_IS_LOADING, payload: false });
    },
    () => {
      dispatch({ type: actions.SET_SHOW_ERROR, payload: true });
      dispatch({ type: actions.SET_IS_LOADING, payload: false });
    },
    [state.fetchExistingClosings]
  );

  const deleteClosing = async id => {
    dispatch({ type: actions.SET_IS_LOADING, payload: true });
    try {
      await axios.delete(`${BASE_URL}/api/cabin-closings/${id}/`);
    } catch (_) {
      dispatch({ type: actions.SET_SHOW_ERROR, payload: true });
    } finally {
      dispatch({ type: actions.FETCH_EXISTING_CLOSINGS });
    }
  };

  const addClosing = async (
    selectedCabin,
    fromDate,
    toDate,
    comment,
    callback
  ) => {
    dispatch({ type: actions.SET_IS_LOADING, payload: true });
    dispatch({ type: actions.SET_SHOW_ERROR, payload: false });
    try {
      await axios.post(`${BASE_URL}/api/cabin-closings/`, {
        cabin: selectedCabin.key,
        fromDate: format(fromDate, "YYYY-MM-DD"),
        toDate: format(toDate, "YYYY-MM-DD"),
        comment: comment
      });
      callback();
    } catch (_) {
      dispatch({ type: actions.SET_SHOW_ERROR, payload: true });
    } finally {
      dispatch({ type: actions.FETCH_EXISTING_CLOSINGS });
    }
  };

  const loadingIndicators = Array(
    state.existingClosings.length === 0 ? 3 : state.existingClosings.length
  )
    .fill()
    .map((_, k) => <LoadingCard key={k} />);

  let existingClosingCards = state.existingClosings.map((c, k) => (
    <ExistingClosingCard
      key={k}
      closing={c}
      deleteClick={() => deleteClosing(c.id)}
      isLoading={state.isLoading}
    />
  ));

  if (existingClosingCards.length === 0) {
    existingClosingCards = <h3>Ingen koier er planlagt stengt.</h3>;
  }

  return (
    <div>
      <Header currentPage={props.location.pathname} />
      <div className={styles.container}>
        {state.showError && (
          <MessageBar
            className={styles.error}
            messageBarType={MessageBarType.error}
          >
            Noe gikk galt!
          </MessageBar>
        )}
        <AddClosing
          handleAddClosing={addClosing}
          isLoading={state.isLoading}
          handleError={() =>
            dispatch({ type: actions.SET_SHOW_ERROR, payload: true })
          }
        />
        <div className={styles.dataContainer}>
          <h2>Eksisterende Stenginger:</h2>
          {state.isLoading ? loadingIndicators : existingClosingCards}
        </div>
      </div>
    </div>
  );
};

Closing.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default Closing;
