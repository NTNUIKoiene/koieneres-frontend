import React from "react";
import { useState, useEffect } from "react";
import Header from "./Header";
import { BASE_URL } from "../config";
import ReservationCard from "./reservations/ReservationCard";
import LoadingCard from "./reservations/LoadingCard";
import styles from "./Reservations.module.css";

const Reservations = props => {
  const [reservations, setReservations] = useState([]);
  const [noRes, setNoRes] = useState(false);

  const fetchReservations = async () => {
    setReservations([]);
    const data = await (await fetch(`${BASE_URL}/api/reservationdata/`, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })).json();
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
