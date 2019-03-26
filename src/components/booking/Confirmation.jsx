import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Label,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType
} from "office-ui-fabric-react";
import styles from "../Booking.module.css";
import { withRouter } from "react-router";
import axios from "axios";
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

  const [showError, setShowError] = useState(false);

  const onSubmit = async () => {
    setShowError(false);
    try {
      const { id } = (await axios.post(
        `${BASE_URL}/api/create-reservation/`,
        payload
      )).data;
      history.push(`/reservations/${id}`);
    } catch (_) {
      setShowError(true);
    }
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
        {showError && (
          <>
            <MessageBar
              messageBarType={MessageBarType.error}
              isMultiline={false}
            >
              Noe gikk galt, klarte ikke å lagre reservasjonen!
            </MessageBar>
            <br />
          </>
        )}

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

Confirmation.propTypes = {
  selectedDates: PropTypes.array.isRequired,
  membershipNumber: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  isBoard: PropTypes.bool.isRequired,
  shouldPay: PropTypes.bool.isRequired,
  comment: PropTypes.string.isRequired,
  totalPrice: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};
export default withRouter(Confirmation);
