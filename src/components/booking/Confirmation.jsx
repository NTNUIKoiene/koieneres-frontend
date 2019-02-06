import React from "react";
import { Label, PrimaryButton, DefaultButton } from "office-ui-fabric-react";
import styles from "../Booking.module.css";
import { BASE_URL } from "../../config";

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
  onCancel,
  history
}) => {
  const payload = {
    membership_number: membershipNumber,
    name: name,
    phone: phone,
    email: email,
    comment: comment,
    should_pay: shouldPay,
    selected_dates: selectedDates
  };
  const onSubmit = async () => {
    await fetch(`${BASE_URL}/api/create-reservation/`, {
      method: "POST",
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    history.push("/booking");
  };

  return (
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
          <PrimaryButton className={styles.right} onClick={onSubmit}>
            Utfør Reservasjon
          </PrimaryButton>
          <DefaultButton className={styles.right} onClick={onCancel}>
            Avbryt
          </DefaultButton>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
