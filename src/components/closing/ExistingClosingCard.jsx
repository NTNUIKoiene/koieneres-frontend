import React from "react";
import PropTypes from "prop-types";
import styles from "./Closing.module.css";
import { DefaultButton, Shimmer } from "office-ui-fabric-react";

const ExistingClosingCard = ({ closing, deleteClick, isLoading }) => {
  return (
    <div className={styles.card}>
      <h3>{closing.cabin.name}</h3>
      <div>
        <span className={styles.label}>Fra:</span>
        <span className={styles.value}>{closing.fromDate}</span>
      </div>
      <div>
        <span className={styles.label}>Til:</span>
        <span className={styles.value}>{closing.toDate}</span>
      </div>
      <div>
        <span className={styles.label}>Kommentar:</span>
        <span className={styles.value}>{closing.comment}</span>
      </div>
      <DefaultButton
        text="Slett"
        onClick={deleteClick}
        disabled={isLoading}
        iconProps={
          isLoading ? { iconName: "Hourglass" } : { iconName: "Delete" }
        }
      />
    </div>
  );
};

ExistingClosingCard.propTypes = {
  deleteClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  closing: PropTypes.shape({
    fromDate: PropTypes.string.isRequired,
    toDate: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    cabin: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const LoadingCard = () => (
  <div className={styles.card}>
    <h3>
      <Shimmer width="50%" />
    </h3>
    <section className={styles.info}>
      <div>
        <Shimmer width="100%" />
      </div>
      <div>
        <Shimmer width="100%" />
      </div>
      <div>
        <Shimmer width="100%" />
      </div>
    </section>
    <DefaultButton
      text="Slett"
      disabled={true}
      iconProps={{ iconName: "Delete" }}
    />
  </div>
);

export { ExistingClosingCard, LoadingCard };
