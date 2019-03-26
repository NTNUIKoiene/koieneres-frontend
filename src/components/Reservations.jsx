import React from "react";
import PropTypes from "prop-types";
import AdBlockerExtensionDetector from "@schibstedspain/sui-ad-blocker-extension-detector";
import { useState, useEffect } from "react";
import Header from "./Header";
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
import axios from "axios";
import { BASE_URL } from "../config";

const Reservations = props => {
  const [reservations, setReservations] = useState([]);
  const [showError, setShowError] = useState(false);

  //Filters
  const [reservationNumber, setReservationNumber] = useState("");
  const [onlyFuture, setOnlyFuture] = useState(false);
  const [onlyUnPaid, setOnlyUnPaid] = useState(false);

  // Pagination
  const resultsPerPage = 9;
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [pageCount, setpageCount] = useState(0);
  const [page, setpage] = useState(0);

  const [isFetching, setIsFetching] = useState(true);

  const fetchReservations = async (url, params, reset, forward) => {
    setShowError(false);
    setIsFetching(true);
    try {
      const data = (await axios.get(url, { params })).data;
      setNext(data.next);
      setPrevious(data.previous);
      setCount(data.count);
      setpageCount(Math.ceil(data.count / resultsPerPage));
      if (forward) {
        setpage(page + 1);
      } else {
        setpage(page - 1);
      }
      if (reset) {
        setpage(1);
      }
      setReservations(data.results);
    } catch (_) {
      setShowError(true);
    }
    setIsFetching(false);
  };

  const fetchInitialReservations = () => {
    let params = { limit: resultsPerPage };
    if (onlyFuture) {
      params = { ...params, after_date: `${format(new Date(), "YYYY-MM-DD")}` };
    }
    if (onlyUnPaid) {
      params = { ...params, is_paid: "false", should_pay: "true" };
    }
    if (reservationNumber.length > 0) {
      params = { ...params, id: reservationNumber };
    }
    fetchReservations(`${BASE_URL}/api/reservationdata/`, params, true, true);
  };

  const fetchNextReservations = () => {
    if (next) {
      fetchReservations(next, {}, false, true);
    }
  };
  const fetchPreviousReservations = () => {
    if (previous) {
      fetchReservations(previous, {}, false, false);
    }
  };

  useEffect(() => {
    fetchInitialReservations();
  }, [onlyFuture, onlyUnPaid]);

  const loadingIndicators = Array(resultsPerPage)
    .fill()
    .map((_, k) => <LoadingCard key={k} />);

  const reservationCards = reservations.map((r, i) => (
    <ReservationCard
      reservation={r}
      key={i}
      reload={fetchInitialReservations}
    />
  ));

  const noResultMessage = <h3>Ingen reservasjoner.</h3>;

  let cards = loadingIndicators;

  if (!isFetching) {
    cards = reservations.length === 0 ? noResultMessage : reservationCards;
  }

  return (
    <div>
      <Header currentPage={props.location.pathname} />
      {showError && (
        <MessageBar
          className={styles.error}
          messageBarType={MessageBarType.error}
        >
          Noe gikk galt!
        </MessageBar>
      )}
      <div className={styles.toolbar}>
        <div className={styles.filterContainer}>
          <TextField
            placeholder="Reservasjonsnummer"
            value={reservationNumber}
            onChange={e => setReservationNumber(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchInitialReservations()}
          />
          <Checkbox
            label="Bare fremtidige reservasjoner"
            checked={onlyFuture}
            onChange={(_, c) => setOnlyFuture(c)}
          />
          <Checkbox
            label="Bare ubetalte reservasjoner"
            checked={onlyUnPaid}
            onChange={(_, c) => setOnlyUnPaid(c)}
          />
          <Label>{count} treff</Label>
        </div>
        <div className={styles.paginationContainer}>
          <DefaultButton
            iconProps={{ iconName: "CaretSolidLeft" }}
            onClick={fetchPreviousReservations}
            ariaLabel="Previous page"
            disabled={previous === null}
          />
          <Label>
            {page} / {pageCount}
          </Label>
          <DefaultButton
            iconProps={{ iconName: "CaretSolidRight" }}
            onClick={fetchNextReservations}
            ariaLabel="Next page"
            disabled={next === null}
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

Reservations.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default Reservations;
