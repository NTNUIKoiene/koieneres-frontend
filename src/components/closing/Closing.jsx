import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { useReducer } from "react";
import { useAbortableRequest } from "../../hooks";
import Header from "../Header";
import AddClosing from "./AddClosing";
import { ClosedCabinCard, LoadingCard } from "./ClosedCabinCard";
import styles from "./Closing.module.css";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";
import axios from "axios";
import { BASE_URL } from "../../config";

const initalState = {
  isLoading: true,
  showError: false,
  closedCabins: []
};

const actions = {
  SET_IS_LOADING: "SET_IS_LOADING",
  SET_SHOW_ERROR: "SET_SHOW_ERROR",
  SET_CLOSED_CABINS: "SET_CLOSED_CABINS"
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    case actions.SET_SHOW_ERROR:
      return { ...state, showError: action.payload };
    case actions.SET_CLOSED_CABINS:
      return { ...state, closedCabins: action.payload };
    default:
      return { ...state };
  }
};

const Closing = props => {
  const [state, dispatch] = useReducer(reducer, initalState);

  const refetchClosedCabins = useAbortableRequest(
    "/api/cabin-closings/",
    response => {
      dispatch({
        type: actions.SET_CLOSED_CABINS,
        payload: response.data.results
      });
      dispatch({ type: actions.SET_IS_LOADING, payload: false });
    },
    () => {
      dispatch({ type: actions.SET_SHOW_ERROR, payload: true });
      dispatch({ type: actions.SET_IS_LOADING, payload: false });
    }
  );

  const deleteClosing = async id => {
    dispatch({ type: actions.SET_IS_LOADING, payload: true });
    try {
      await axios.delete(`${BASE_URL}/api/cabin-closings/${id}/`);
      await refetchClosedCabins();
    } catch (_) {
      dispatch({ type: actions.SET_SHOW_ERROR, payload: true });
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
      await refetchClosedCabins();
      callback();
    } catch (_) {
      dispatch({ type: actions.SET_SHOW_ERROR, payload: true });
    }
  };

  const loadingIndicators = Array(
    state.closedCabins.length === 0 ? 3 : state.closedCabins.length
  )
    .fill()
    .map((_, k) => <LoadingCard key={k} />);

  let closedCabinCards = state.closedCabins.map((c, k) => (
    <ClosedCabinCard
      key={k}
      closing={c}
      deleteClick={() => deleteClosing(c.id)}
      isLoading={state.isLoading}
    />
  ));

  if (closedCabinCards.length === 0) {
    closedCabinCards = <h3>Ingen koier er planlagt stengt.</h3>;
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
          <h2>Eksisterende stenginger:</h2>
          {state.isLoading ? loadingIndicators : closedCabinCards}
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
