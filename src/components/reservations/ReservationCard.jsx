import React from "react";
import styles from "./ReservationCard.module.css";
import { format } from "date-fns";
import {
  DefaultButton,
  PrimaryButton,
  Modal,
  TextField,
  Checkbox
} from "office-ui-fabric-react";
import { patchAPIData } from "../../api";
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
  const [markAsPaidDisabled, setMarkAsPaidDisabled] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [nameState, setNameState] = useState(name);
  const [membershipNumberState, setMembershipNumberState] = useState(
    membershipNumber
  );
  const [phoneState, setPhoneState] = useState(phone);
  const [emailState, setEmailState] = useState(email);
  const [isPaidState, setIsPaidState] = useState(isPaid);
  const [shouldPayState, setShouldPayState] = useState(shouldPay);

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

  const onEditConfirmClick = async () => {
    await patchAPIData("/api/reservationdata/" + id, {
      name: nameState,
      membershipNumber: membershipNumberState,
      phone: phoneState,
      email: emailState,
      shouldPay: shouldPayState,
      is_paid: isPaidState
    });
    setEditModalOpen(false);
    reload();
  };

  const onMarkAsPaidClick = async e => {
    setMarkAsPaidDisabled(true);
    await patchAPIData("/api/reservationdata/" + id, {
      isPaid: true
    });
    reload();
  };

  return (
    <div>
      <Modal isOpen={editModalOpen} onDismiss={() => setEditModalOpen(false)}>
        <div className={styles.editWrapper}>
          <h1>Rediger reservasjon</h1>
          <TextField
            label="Navn"
            value={nameState}
            onChange={e => setNameState(e.target.value)}
          />
          <TextField
            label="Medlemsnummer"
            value={membershipNumberState}
            onChange={e => setMembershipNumberState(e.target.value)}
          />
          <TextField
            label="Telefon"
            value={phoneState}
            onChange={e => setPhoneState(e.target.value)}
          />
          <TextField
            label="Epost"
            value={emailState}
            onChange={e => setEmailState(e.target.value)}
          />
          <Checkbox
            className={styles.editPayBtn}
            checked={shouldPayState}
            label="Koia skal betales for"
            onChange={e => setShouldPayState(!shouldPayState)}
          />
          {shouldPayState && (
            <Checkbox
              className={styles.editPayBtn}
              checked={isPaidState}
              label="Koia er betalt"
              onChange={e => setIsPaidState(!isPaidState)}
            />
          )}
          <PrimaryButton
            className={styles.confirmEditBtn}
            onClick={onEditConfirmClick}
          >
            Bekreft endring
          </PrimaryButton>
          <DefaultButton onClick={() => setEditModalOpen(false)}>
            Avbryt
          </DefaultButton>
        </div>
      </Modal>

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
              iconProps={{ iconName: "Edit" }}
              ariaLabel="Edit"
              className={styles.editBtn}
              onClick={() => {
                setEditModalOpen(true);
              }}
            >
              Rediger
            </DefaultButton>
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
            {!isPaid && shouldPay && (
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
    </div>
  );
};

export default ReservationCard;
