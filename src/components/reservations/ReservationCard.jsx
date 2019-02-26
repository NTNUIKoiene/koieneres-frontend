import React from "react";
import styles from "./ReservationCard.module.css";
import { format } from "date-fns";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react";
import { BASE_URL } from "../../config";
import { useState } from "react";

const ReservationCard = ({ reservation, reload }) => {
  if (reservation.reservationItems.length === 0) return null;
  const {
    id,
    name,
    createdAt,
    email,
    shouldPay,
    isPaid,
    membershipNumber,
    phone,
    totalPrice
  } = reservation;
  const cabin = reservation.reservationItems[0].cabin.name;
  const firstDate = reservation.reservationItems[0].date;
  const numberOfNights = reservation.reservationItems.length;
  const dates = reservation.reservationItems.map(r => r.date).join(", ");

  const [receiptButtonDisabled, setReceiptButtonDisabled] = useState(false);

  const onReceiptClick = async () => {
    setReceiptButtonDisabled(true);
    const data = await (await fetch(
      `${BASE_URL}/api/reservationdata/${id}/receipt/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      }
    )).blob();
    window.open(URL.createObjectURL(data));
    setReceiptButtonDisabled(false);
  };

  const [markAsPaidDisabled, setMarkAsPaidDisabled] = useState(false);

  const onMarkAsPaidClick = async () => {
    setMarkAsPaidDisabled(true);
    // TODO: api call
    reload();
    setMarkAsPaidDisabled(false);
  };

  return (
    <div className={styles.card}>
      <h3>{`#${id}: ${cabin}, ${firstDate} (${numberOfNights} ${
        numberOfNights === 1 ? "natt" : "netter"
      })`}</h3>
      <section className={styles.info}>
        <div>
          <span className={styles.label}>Reservasjonstidspunkt:</span>
          <span className={styles.value}>
            {format(new Date(createdAt), "YYYY-MM-DD HH:mm")}
          </span>
        </div>
        <hr />
        <div>
          <span className={styles.label}>Navn:</span>
          <span className={styles.value}>{name}</span>
        </div>
        <div>
          <span className={styles.label}>Medlemsnummer:</span>
          <span className={styles.value}>{membershipNumber}</span>
        </div>
        <div>
          <span className={styles.label}>Epost:</span>
          <span className={styles.value}>{email}</span>
        </div>
        <div>
          <span className={styles.label}>Telefon:</span>
          <span className={styles.value}>{phone}</span>
        </div>
        <hr />
        <div>
          <span className={styles.label}>Datoer:</span>
          <span className={styles.value}>{dates}</span>
        </div>
        <div>
          <span className={styles.label}>Totalpris:</span>
          <span className={styles.value}>{totalPrice} NOK</span>
        </div>
        <div>
          <span className={styles.label}>Betalingsstatus:</span>
          {shouldPay ? (
            isPaid ? (
              <span className={styles.value}>Betalt</span>
            ) : (
              <span className={styles.unpaid}>Ubeltalt</span>
            )
          ) : (
            <span className={styles.value}>Gratis</span>
          )}
        </div>
        <hr />
        <div>
          <DefaultButton
            iconProps={
              receiptButtonDisabled
                ? { iconName: "Hourglass" }
                : { iconName: "PDF" }
            }
            ariaLabel="Receipt"
            onClick={onReceiptClick}
            disabled={receiptButtonDisabled}
          >
            Kvittering
          </DefaultButton>
          {!isPaid &&
            shouldPay && (
              <PrimaryButton
                iconProps={
                  markAsPaidDisabled
                    ? { iconName: "Hourglass" }
                    : { iconName: "Money" }
                }
                ariaLabel="Mark as paid"
                text="Marker som betalt"
                className={styles.payBtn}
                disabled={markAsPaidDisabled}
                onClick={onMarkAsPaidClick}
              />
            )}
        </div>
      </section>
    </div>
  );
};

export default ReservationCard;
