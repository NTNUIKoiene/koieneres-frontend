import React from "react";
import PropTypes from "prop-types";
import styles from "./Card.module.css";

const Card = ({ children }) => <div className={styles.card}>{children}</div>;

Card.propTypes = {
  children: PropTypes.array.isRequired
};
export default Card;
