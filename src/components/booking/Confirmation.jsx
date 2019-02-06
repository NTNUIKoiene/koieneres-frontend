import React from "react";
import { Label, PrimaryButton, DefaultButton } from "office-ui-fabric-react";
import styles from "../Booking.module.css";

const Confirmation = ({
  selectedDates,
  membershipNumber,
  name,
  phone,
  email,
  isBoard,
  shouldPay,
  comment,
  totalPrice,
  onConfirm,
  onCancel
}) => (
  <div>
    <h1>Bekreft Reservasjon</h1>
    <div>
      <Label>
        Koie: <b>{selectedDates[0].name}</b>
      </Label>
      <Label>
        Datoer:{" "}
        <b>
          {selectedDates
            .map(
              sd =>
                `${sd.dateKey} (${sd.members} medlemmer, ${
                  sd.nonMembers
                } ikkemedlemmer)`
            )
            .join(", ")}
        </b>
      </Label>
      <Label>
        Medlemsnummer: <b>{membershipNumber}</b>
      </Label>
      <Label>
        Navn: <b>{name}</b>
      </Label>
      <Label>
        Telefon: <b>{phone}</b>
      </Label>
      <Label>
        Email: <b>{email}</b>
      </Label>
      {isBoard && (
        <div>
          <Label>
            Reservasjonstype:{" "}
            <b>{shouldPay ? "Koia skal betales for" : "Gratisreservasjon"}</b>
          </Label>
          <Label>
            Kommentar: <b>{comment}</b>
          </Label>
        </div>
      )}
      <Label>
        Totalpris: <b>{totalPrice}</b>
      </Label>
      <div className={styles.right}>
        <PrimaryButton className={styles.right} onClick={onConfirm}>
          Utfør Reservasjon
        </PrimaryButton>
        <DefaultButton className={styles.right} onClick={onCancel}>
          Avbryt
        </DefaultButton>
      </div>
    </div>
  </div>
);

export default Confirmation;
