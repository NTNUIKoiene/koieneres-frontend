import React, { useState } from "react";
import Header from "./Header";
import {
  MessageBar,
  MessageBarType,
  PrimaryButton
} from "office-ui-fabric-react";

import styles from "./ExtendedPeriods.module.css";

const ExtendedPeriod = props => {
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <Header currentPage={props.location.pathname} />
      <div className={styles.container}>
        {showError && (
          <MessageBar
            className={styles.error}
            messageBarType={MessageBarType.error}
          >
            Noe gikk galt!
          </MessageBar>
        )}
        <div className={styles.addContainer}>
          <h2>Utvid en periode:</h2>
          <PrimaryButton
            text="Lagre"
            onClick={null}
            iconProps={
              isLoading ? { iconName: "Hourglass" } : { iconName: "Save" }
            }
            disabled={isLoading}
          />
        </div>
        <div className={styles.dataContainer}>
          <h2>Eksisterende utvidelser:</h2>
        </div>
      </div>
    </div>
  );
};

export default ExtendedPeriod;
