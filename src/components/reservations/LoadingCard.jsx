import React from "react";
import styles from "./ReservationCard.module.css";
import { DefaultButton, Shimmer } from "office-ui-fabric-react";

const LoadingCard = () => {
  return (
    <div className={styles.card}>
      <h3>
        <Shimmer width="100%" />
      </h3>
      <section className={styles.info}>
        <div>
          <Shimmer width="100%" height="25" />
        </div>
        <br />
        <div>
          <Shimmer width="100%" />
        </div>
        <div>
          <Shimmer width="100%" />
        </div>
        <div>
          <Shimmer width="100%" />
        </div>
        <div>
          <Shimmer width="100%" />
        </div>
        <br />
        <div>
          <Shimmer width="100%" />
        </div>
        <div>
          <Shimmer width="100%" />
        </div>
        <div>
          <Shimmer width="100%" />
        </div>
        <br />
        <div>
          <DefaultButton
            iconProps={{ iconName: "Edit" }}
            ariaLabel="Edit"
            text="Rediger"
            className={styles.editBtn}
            disabled
          />
          <DefaultButton
            iconProps={{ iconName: "PDF" }}
            ariaLabel="Receipt"
            text="Kvittering"
            disabled
          />
        </div>
      </section>
    </div>
  );
};

export default LoadingCard;
