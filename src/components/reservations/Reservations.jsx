import React from "react";
import PropTypes from "prop-types";
import AdBlockerExtensionDetector from "@schibstedspain/sui-ad-blocker-extension-detector";
import { useState, useEffect } from "react";
import Header from "../Header";
import ReservationCard from "./ReservationCard";
import LoadingCard from "./LoadingCard";
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
import { BASE_URL } from "../../config";

const Reservations = props => {
  // Data
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
  const [pageCount, setpageCount] = useState(1);
  const [page, setpage] = useState(1);

  const fetchReservations = async (url, params) => {
    try {
      setShowError(false);
      setIsLoading(true);
      const data = (await axios.get(url, { params })).data;
      setReservations(data.results);
      setNext(data.next);
      setPrevious(data.previous);
      setCount(data.count);
      setpageCount(Math.ceil(data.count / resultsPerPage));
    } catch (_) {
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const deriveParamsFromState = () => {
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
    return params;
  };

  useEffect(() => {
    fetchReservations(
      `${BASE_URL}/api/reservationdata/`,
      deriveParamsFromState()
    );
  }, [onlyFuture, onlyUnPaid]);

  const loadingIndicators = Array(resultsPerPage)
    .fill()
    .map((_, k) => <LoadingCard key={k} />);

  const reservationCards = reservations.map((r, i) => (
    <ReservationCard
      reservation={r}
      key={i}
      reload={() => {
        fetchReservations(
          `${BASE_URL}/api/reservationdata/`,
          deriveParamsFromState()
        );
        setpage(1);
      }}
    />
  ));

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
      <div className={styles.reservationContainer}>
        <div className={styles.toolbar}>
          <div className={styles.filterContainer}>
            <TextField
              placeholder="Reservasjonsnummer"
              value={reservationNumber}
              onChange={e => setReservationNumber(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  fetchReservations(
                    `${BASE_URL}/api/reservationdata/`,
                    deriveParamsFromState()
                  );
                }
              }}
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
              onClick={() => {
                fetchReservations(previous);
                setpage(page => page - 1);
              }}
              ariaLabel="Previous page"
              disabled={previous === null || page === 1 || isLoading}
            />
            <Label>
              {page} / {pageCount}
            </Label>
            <DefaultButton
              iconProps={{ iconName: "CaretSolidRight" }}
              onClick={() => {
                fetchReservations(next);
                setpage(page => page + 1);
              }}
              ariaLabel="Next page"
              disabled={next === null || page === pageCount || isLoading}
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
          {isLoading ? (
            loadingIndicators
          ) : reservations.length > 0 ? (
            reservationCards
          ) : (
            <h3>Ingen reservasjoner.</h3>
          )}
        </main>
      </div>
    </div>
  );
};

Reservations.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default Reservations;
