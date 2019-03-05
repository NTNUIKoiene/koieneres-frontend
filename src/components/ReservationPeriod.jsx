import React from "react";
import { useState } from "react";
import Header from "./Header";
import styles from "./ReservationPeriod.module.css";
import Loader from "./common/Loader";

const ReservationPeriod = props => {
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <Header currentPage={props.location.pathname} />
      <div className={styles.container}>
        <div className={styles.add}>
          <h2>Ny Reservasjonsperiode</h2>
        </div>
        <div className={styles.display}>
          <h2>Eksisterende Reservasjonsperioder</h2>
          <Loader show={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ReservationPeriod;
