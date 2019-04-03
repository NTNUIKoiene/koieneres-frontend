import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { useState } from "react";
import { useAbortableRequest } from "../../hooks";
import Header from "../Header";
import AddClosing from "./AddClosing";
import { ClosedCabinCard, LoadingCard } from "./ClosedCabinCard";
import styles from "./Closing.module.css";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";
import axios from "axios";
import { BASE_URL } from "../../config";

const Closing = ({ location }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [closedCabins, setClosedCabins] = useState([]);

  const refetchClosedCabins = useAbortableRequest(
    "/api/cabin-closings/",
    response => {
      setClosedCabins(response.data.results);
      setIsLoading(false);
    },
    () => {
      setShowError(true);
      setIsLoading(false);
    }
  );

  const deleteClosing = async id => {
    setIsLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/cabin-closings/${id}/`);
      await refetchClosedCabins();
    } catch (_) {
      setShowError(true);
    }
  };

  const addClosing = async (
    selectedCabin,
    fromDate,
    toDate,
    comment,
    callback
  ) => {
    setIsLoading(true);
    setShowError(false);
    try {
      await axios.post(`${BASE_URL}/api/cabin-closings/`, {
        cabin: selectedCabin.key,
        fromDate: format(fromDate, "YYYY-MM-DD"),
        toDate: format(toDate, "YYYY-MM-DD"),
        comment: comment
      });
      await refetchClosedCabins();
      callback();
    } catch (_) {
      setShowError(true);
    }
  };

  const loadingIndicators = Array(
    closedCabins.length === 0 ? 3 : closedCabins.length
  )
    .fill()
    .map((_, k) => <LoadingCard key={k} />);

  let closedCabinCards = closedCabins.map((c, k) => (
    <ClosedCabinCard
      key={k}
      closing={c}
      deleteClick={() => deleteClosing(c.id)}
      isLoading={isLoading}
    />
  ));

  if (closedCabinCards.length === 0) {
    closedCabinCards = <h3>Ingen koier er planlagt stengt.</h3>;
  }

  return (
    <div>
      <Header currentPage={location.pathname} />
      <div className={styles.container}>
        {showError && (
          <MessageBar
            className={styles.error}
            messageBarType={MessageBarType.error}
          >
            Noe gikk galt!
          </MessageBar>
        )}
        <AddClosing
          handleAddClosing={addClosing}
          isLoading={isLoading}
          handleError={() => setShowError(true)}
        />
        <div className={styles.dataContainer}>
          <h2>Eksisterende stenginger:</h2>
          {isLoading ? loadingIndicators : closedCabinCards}
        </div>
      </div>
    </div>
  );
};

Closing.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default Closing;
