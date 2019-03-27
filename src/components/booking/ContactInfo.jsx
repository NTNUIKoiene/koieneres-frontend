import React from "react";
import styles from "../Booking.module.css";
import PropTypes from "prop-types";

import {
  TextField,
  FontClassNames,
  ColorClassNames
} from "office-ui-fabric-react";

const initialContactInfoState = {
  membershipNumber: "1234",
  name: "Espen Meidell",
  phone: "45243232",
  email: "espen.meidell@gmail.com"
};

const contactInfoReducer = (state, action) => {
  switch (action.type) {
    case "SET_MEMBERSHIP_NUMBER":
      return { ...state, membershipNumber: action.value };
    case "SET_NAME":
      return { ...state, name: action.value };
    case "SET_PHONE":
      return { ...state, phone: action.value };
    case "SET_EMAIL":
      return { ...state, email: action.value };
    default:
      return state;
  }
};

const ContactInfo = ({ state, dispatch }) => (
  <section className={styles.infoSection}>
    <h2
      className={[FontClassNames.xLarge, ColorClassNames.themeDark].join(" ")}
    >
      Kontaktinformasjon
    </h2>
    <TextField
      required
      label="Medlemsnummer (NTNUI / BIL)"
      value={state.membershipNumber}
      onChange={e =>
        dispatch({ type: "SET_MEMBERSHIP_NUMBER", value: e.target.value })
      }
    />
    <TextField
      required
      label="Navn"
      value={state.name}
      onChange={e => dispatch({ type: "SET_NAME", value: e.target.value })}
    />
    <TextField
      required
      label="Telefon"
      value={state.phone}
      onChange={e => dispatch({ type: "SET_PHONE", value: e.target.value })}
    />
    <TextField
      required
      label="Epost"
      value={state.email}
      onChange={e => dispatch({ type: "SET_EMAIL", value: e.target.value })}
    />
  </section>
);

ContactInfo.propTypes = {
  state: PropTypes.shape({
    membershipNumber: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired
};

export { ContactInfo, initialContactInfoState, contactInfoReducer };
