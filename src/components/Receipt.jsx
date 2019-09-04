import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import styles from "./Receipt.module.css";
import { format } from "date-fns";
import Barcode from "react-barcode";

/*

ean: "5901234123457"
  metadata:
  createdAt: "2002-07-18T10:33:39+02:00"
  createdBy: null
  email: "mail@example.com"
  id: 4565
  isPaid: true
  membershipNumber: "12345"
  name: "Ola Nordmann"
  phone: "99999999"
  reservationItems: Array(1)
  0: {cabin: {…}, date: "2002-07-20", members: 1, nonMembers: 1}
  length: 1
  shouldPay: true
  totalPrice: 60
  updatedAt: "2019-06-02T16:37:46.542261+02:00"


*/

const ReceiptPage = props => {
  const reservationId = props.match.params.id;
  const [reservationData, setReservationData] = useState();

  useEffect(() => {
    const getReceiptData = async () => {
      const { data } = await axios.get(
        `${BASE_URL}/api/publicreservationdata/${reservationId}/receipt/`
      );
      console.log(data);
      setReservationData(data);
    };
    getReceiptData();
  }, [reservationId]);

  if (!reservationData) return null;

  return (
    <div className={styles.page}>
      <h1>Reservasjonskvittering</h1>

      <h2>Reservasjonsnummer: {reservationId}</h2>
      <h2>
        Reservasjonstidspunkt:{" "}
        {format(reservationData.metadata.createdAt, "YYYY-MM-DD HH:mm")}
      </h2>
      <h2>Kontaktinformasjon:</h2>
      {reservationData.metadata.name}
      <br />
      {reservationData.metadata.email}
      <br />
      {reservationData.metadata.phone}
      <h2>Reservasjonsrader:</h2>
      <table>
        <tbody>
          <tr>
            <th>Koie</th>
            <th>Dato</th>
            <th>Antall medlemmer</th>
            <th>Antall ikkemedlemmer</th>
          </tr>
          {reservationData.metadata.reservationItems.map(item => (
            <tr key={item.date}>
              <td>{item.cabin.name}</td>
              <td>{item.date}</td>
              <td>{item.members}</td>
              <td>{item.nonMembers}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.totalPrice}>
        <h2>Totalpris: {reservationData.metadata.totalPrice} NOK</h2>
      </div>
      <div className={styles.barcode}>
        <Barcode value={reservationData.ean} options={{ format: "format" }} />
      </div>
      <button className={styles.printButton} onClick={() => window.print()}>
        Skriv ut kvittering
      </button>
    </div>
  );
};

export default ReceiptPage;
