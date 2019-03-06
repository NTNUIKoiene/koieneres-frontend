import React from "react";
import { useState, useEffect } from "react";
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
import AdBlockerExtensionDetector from "@schibstedspain/sui-ad-blocker-extension-detector";

const Reservations = props => {
  const [reservations, setReservations] = useState([]);

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

  const fetchReservations = async (url, reset, forward) => {
    setIsFetching(true);
    const data = await fetchAPIData(url);
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
    setIsFetching(false);
  };

  const fetchInitialReservations = () => {
    let parameters = "?";
    if (onlyFuture) {
      parameters =
        parameters + `after_date=${format(new Date(), "YYYY-MM-DD")}&`;
    }
    if (onlyUnPaid) {
      parameters = parameters + "is_paid=false&should_pay=true&";
    }
    if (reservationNumber.length > 0) {
      parameters = parameters + `id=${reservationNumber}&`;
    }
    parameters = parameters + `limit=${resultsPerPage}&`;
    fetchReservations(`/api/reservationdata/${parameters}`, true, true);
  };

  const fetchNextReservations = () => {
    if (next) {
      fetchReservations(next, false, true);
    }
  };
  const fetchPreviousReservations = () => {
    if (previous) {
      fetchReservations(previous, false, false);
    }
  };

  useEffect(() => {
    fetchInitialReservations();
  }, []);

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

export default Reservations;
