import React from "react";
import PropTypes from "prop-types";
import styles from "./ReservationCard.module.css";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  DefaultButton,
  PrimaryButton,
  Modal,
  TextField,
  Checkbox
} from "office-ui-fabric-react";
import { BASE_URL } from "../../config";
import { useState } from "react";
import axios from "axios";

const ReservationCard = ({ reservation, reload }) => {
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

  const onEditConfirmClick = async () => {
    await axios.patch(`${BASE_URL}/api/reservationdata/${id}`, {
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
    await axios.patch(`${BASE_URL}/api/reservationdata/${id}`, {
      isPaid: true
    });
    reload();
  };

  if (reservation.reservationItems.length === 0) return null;
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
            <Link to={`/receipt/${id}`}>
              <DefaultButton
                iconProps={{ iconName: "PDF" }}
                className={styles.receiptBtn}
                ariaLabel="Receipt"
              >
                Kvittering
              </DefaultButton>
            </Link>
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

ReservationCard.propTypes = {
  reload: PropTypes.func.isRequired,
  reservation: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    shouldPay: PropTypes.bool.isRequired,
    isPaid: PropTypes.bool.isRequired,
    membershipNumber: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    totalPrice: PropTypes.number.isRequired
  }).isRequired
};

export default ReservationCard;
