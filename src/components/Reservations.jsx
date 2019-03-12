import React from "react";
import AdBlockerExtensionDetector from "@schibstedspain/sui-ad-blocker-extension-detector";
import { useEffect, useReducer } from "react";
import Header from "./Header";
import { fetchAPIData } from "../api";
import ReservationCard from "./reservations/ReservationCard";
import LoadingCard from "./reservations/LoadingCard";
import styles from "./Reservations.module.css";
import { format } from "date-fns";
import {
  TextField,
  Checkbox,
  DefaultButton,
  MessageBar,
  MessageBarType,
  Label
} from "office-ui-fabric-react";

const initalState = {
  isFetching: true,
  reservations: [],
  reservationNumber: "",
  onlyFuture: false,
  onlyUnPaid: false,
  resultsPerPage: 9,
  count: 0,
  next: null,
  previous: null,
  pageCount: 1,
  page: 1
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isFetching: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isFetching: false,
        reservations: action.payload.results,
        next: action.payload.next,
        previous: action.payload.previous,
        count: action.payload.count,
        pageCount: Math.ceil(action.payload.count / state.resultsPerPage)
      };
    case "ONLY_UNPAID_CHANGE":
      return { ...state, onlyUnPaid: action.payload };
    case "ONLY_FUTURE_CHANGE":
      return { ...state, onlyFuture: action.payload };
    default:
      throw new Error("Unkown action");
  }
};

const Reservations = props => {
  const [state, dispatch] = useReducer(reducer, initalState);

  const getParams = offset => {
    const encodeQueryData = data => {
      const ret = [];
      for (let d in data)
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
      return ret.join("&");
    };

    let base = {
      limit: state.resultsPerPage
    };
    if (state.onlyFuture) {
      base = { ...base, after_date: format(new Date(), "YYYY-MM-DD") };
    }
    if (state.onlyUnPaid) {
      base = { ...base, is_paid: false, should_pay: true };
    }
    if (state.reservationNumber.length > 0) {
      base = { ...base, id: state.reservationNumber };
    }
    return encodeQueryData(base);
  };

  const fetchReservations = async url => {
    dispatch({ type: "FETCH_INIT" });
    const data = await fetchAPIData(url);
    dispatch({ type: "FETCH_SUCCESS", payload: data });
  };

  useEffect(() => {
    const url = `/api/reservationdata/?${getParams()}`;
    fetchReservations(url);
  }, [state.onlyUnPaid, state.onlyFuture]);

  const loadingIndicators = Array(state.resultsPerPage)
    .fill()
    .map((_, k) => <LoadingCard key={k} />);

  const reservationCards = state.reservations.map((r, i) => (
    <ReservationCard
      reservation={r}
      key={i}
      reload={() => console.log("implement")}
    />
  ));

  const noResultMessage = <h3>Ingen reservasjoner.</h3>;

  let cards = loadingIndicators;

  if (!state.isFetching) {
    cards =
      state.reservations.length === 0 ? noResultMessage : reservationCards;
  }

  return (
    <div>
      <Header currentPage={props.location.pathname} />
      <div className={styles.toolbar}>
        <div className={styles.filterContainer}>
          <TextField
            placeholder="Reservasjonsnummer"
            value={state.reservationNumber}
            onChange={e => console.log("implement")}
            // onKeyDown={e => e.key === "Enter" && fetchInitialReservations()}
          />
          <Checkbox
            label="Bare fremtidige reservasjoner"
            checked={state.onlyFuture}
            onChange={(_, c) =>
              dispatch({ type: "ONLY_FUTURE_CHANGE", payload: c })
            }
          />
          <Checkbox
            label="Bare ubetalte reservasjoner"
            checked={state.onlyUnPaid}
            onChange={(_, c) =>
              dispatch({ type: "ONLY_UNPAID_CHANGE", payload: c })
            }
          />
          <Label>{state.count} treff</Label>
        </div>
        <div className={styles.paginationContainer}>
          <DefaultButton
            iconProps={{ iconName: "CaretSolidLeft" }}
            onClick={() => console.log(state.previous)}
            ariaLabel="Previous page"
            disabled={state.previous === null}
          />
          <Label>
            {state.page} / {state.pageCount}
          </Label>
          <DefaultButton
            iconProps={{ iconName: "CaretSolidRight" }}
            onClick={() => console.log("api/" + state.next.split("api/")[1])}
            ariaLabel="Next page"
            disabled={state.next === null}
          />
        </div>
      </div>
      <AdBlockerExtensionDetector>
        <div className={styles.adMessage}>
          <MessageBar messageBarType={MessageBarType.warning}>
            Skru av adblocker for å kunne åpne kvitteringene!
          </MessageBar>
        </div>
      </AdBlockerExtensionDetector>
      <main className={styles.cardcontainer}>{cards}</main>
    </div>
  );
};

export default Reservations;
