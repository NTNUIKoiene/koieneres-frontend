import React from "react";
import { useState, useEffect } from "react";
import Header from "./Header";
import { BASE_URL } from "../config";
import ReservationCard from "./reservations/ReservationCard";
import LoadingCard from "./reservations/LoadingCard";
import styles from "./Reservations.module.css";
import {
  TextField,
  Checkbox,
  DefaultButton,
  PrimaryButton,
  MessageBar,
  MessageBarType
} from "office-ui-fabric-react";
import AdBlockerExtensionDetector from "@schibstedspain/sui-ad-blocker-extension-detector";

const Reservations = props => {
  const [reservations, setReservations] = useState([]);
  const [noRes, setNoRes] = useState(false);

  //Filters

  const [reservationNumber, setReservationNumber] = useState("");
  const [onlyFuture, setOnlyFuture] = useState(false);
  const [onlyUnPaid, setOnlyUnPaid] = useState(false);

  const clearFilter = () => {
    setReservationNumber("");
    setOnlyFuture(false);
    setOnlyUnPaid(false);
  };

  const fetchReservations = async () => {
    setReservations([]);
    let parameters = "?";
    if (onlyFuture) {
      parameters = parameters + "only_future=true&";
    }
    if (onlyUnPaid) {
      parameters = parameters + "only_unpaid=true&";
    }
    if (reservationNumber.length > 0) {
      parameters = parameters + `res_nr=${reservationNumber}&`;
    }
    const data = await (await fetch(
      `${BASE_URL}/api/reservationdata/${parameters}`,
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      }
    )).json();
    // TODO: Handle pagination
    if (data.results.length === 0) {
      setNoRes(true);
    }
    setReservations(data.results);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div>
      <Header currentPage={props.location.pathname} />
      <div className={styles.filterContainer}>
        <TextField
          placeholder="Reservasjonsnummer"
          value={reservationNumber}
          onChange={e => setReservationNumber(e.target.value)}
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
        <DefaultButton
          iconProps={{ iconName: "ClearFilter" }}
          text="Tøm filter"
          onClick={clearFilter}
        />
        <PrimaryButton
          iconProps={{ iconName: "Filter" }}
          text="Bruk filter"
          onClick={fetchReservations}
        />
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
          Array(9)
            .fill()
            .map((_, k) => <LoadingCard key={k} />)}
        {reservations.map((r, i) => (
          <ReservationCard reservation={r} key={i} reload={fetchReservations} />
        ))}
      </main>
    </div>
  );
};

export default Reservations;
