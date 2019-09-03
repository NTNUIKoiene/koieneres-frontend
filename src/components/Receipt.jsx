import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import styles from "./Receipt.module.css";
import { format } from "date-fns";

const ReceiptPage = props => {
  const reservationId = props.match.params.id;

  useEffect(() => {
    const getReceiptData = async () => {
      const { data } = await axios.get(
        `${BASE_URL}/api/publicreservationdata/${reservationId}/receipt/`
      );
      console.log(data);
    };
    getReceiptData();
  });

  return (
    <div className={styles.page}>
      <h1>Reservasjonskvittering</h1>
      <h2>Reservasjonsnummer: {reservationId}</h2>
      <h2>Reservasjonstidspunkt: </h2>
    </div>
  );
};

export default ReceiptPage;
