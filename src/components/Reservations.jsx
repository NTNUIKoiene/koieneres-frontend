import React from "react";
import { useState, useEffect } from "react";
import Header from "./Header";
import {BASE_URL} from "../config"
import ReservationCard from "./reservations/ReservationCard"
import styles from "./Reservations.module.css"

const Reservations = props => {

  const [reservations, setReservations ] = useState([])

  const fetchReservations = async () => {
    const data = await (await fetch(`${BASE_URL}/api/reservationdata/`, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
    })).json();
    setReservations(data.results)
  }

  useEffect(() => {
    fetchReservations()
  }, [])


  return (
    <div>
      <Header currentPage={props.location.pathname} />
      <main className={styles.cardcontainer}>
        {reservations.map((r, i) => <ReservationCard reservation={r} key={i}/>)}
      </main>
    </div>
  );
};

export default Reservations;
