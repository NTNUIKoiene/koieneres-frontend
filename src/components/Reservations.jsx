import React from "react";
import { useState, useEffect } from "react";
import Header from "./Header";
import { BASE_URL } from "../config";
import ReservationCard from "./reservations/ReservationCard";
import LoadingCard from "./reservations/LoadingCard";
import styles from "./Reservations.module.css";
import { format } from "date-fns";
import {
  TextField,
  Checkbox,
  DefaultButton,
  PrimaryButton,
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

  const clearFilter = () => {
    setReservationNumber("");
    setOnlyFuture(false);
    setOnlyUnPaid(false);
  };

  // Pagination
  const resultsPerPage = 9;
  const [noRes, setNoRes] = useState(false);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [pageCount, setpageCount] = useState(0);
  const [page, setpage] = useState(0);
  const fetchReservations = async (url, reset, forward) => {
    setReservations([]);
    const data = await (await fetch(url, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })).json();
    if (data.results.length === 0) {
      setNoRes(true);
    }
    setNext(data.next);
    setPrevious(data.previous);
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
    fetchReservations(
      `${BASE_URL}/api/reservationdata/${parameters}`,
      true,
      true
    );
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

  return (
    <div>
      <Header currentPage={props.location.pathname} />
      <div className={styles.toolbar}>
        <div className={styles.filterContainer}>
          <TextField
            className={styles.toolbarItem}
            placeholder="Reservasjonsnummer"
            value={reservationNumber}
            onChange={e => setReservationNumber(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchInitialReservations()}
          />
          <Checkbox
            className={styles.toolbarItem}
            label="Bare fremtidige reservasjoner"
            checked={onlyFuture}
            onChange={(_, c) => setOnlyFuture(c)}
          />
          <Checkbox
            className={styles.toolbarItem}
            label="Bare ubetalte reservasjoner"
            checked={onlyUnPaid}
            onChange={(_, c) => setOnlyUnPaid(c)}
          />
          <DefaultButton
            className={styles.toolbarItem}
            iconProps={{ iconName: "ClearFilter" }}
            text="Tøm filter"
            onClick={clearFilter}
          />
          <PrimaryButton
            className={styles.toolbarItem}
            iconProps={{ iconName: "Filter" }}
            text="Bruk filter"
            onClick={fetchInitialReservations}
          />
        </div>
        <div className={styles.paginationContainer}>
          <DefaultButton
            className={styles.toolbarItem}
            iconProps={{ iconName: "CaretSolidLeft" }}
            onClick={fetchPreviousReservations}
            ariaLabel="Previous page"
            disabled={previous === null}
          />
          <Label className={styles.toolbarItem}>
            {page} / {pageCount}
          </Label>
          <DefaultButton
            className={styles.toolbarItem}
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
      <main className={styles.cardcontainer}>
        {noRes && "No results"}
        {reservations.length === 0 &&
          Array(resultsPerPage)
            .fill()
            .map((_, k) => <LoadingCard key={k} />)}
        {reservations.map((r, i) => (
          <ReservationCard
            reservation={r}
            key={i}
            reload={fetchInitialReservations}
          />
        ))}
      </main>
    </div>
  );
};

export default Reservations;
