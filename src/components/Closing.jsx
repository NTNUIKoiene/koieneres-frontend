import React from "react";
import nb from "date-fns/locale/nb";
import { useState, useEffect } from "react";
import Header from "./Header";
import styles from "./Closing.module.css";
import { fetchAPIData } from "../api";
import { DefaultButton } from "office-ui-fabric-react";

const Closing = props => {
  const [cabins, setCabins] = useState([]);
  const [existingClosings, setExistingClosings] = useState([]);

  const fetchData = async () => {
    const cabinData = await fetchAPIData("/api/cabin/");
    const existingClosingsData = await fetchAPIData("/api/cabin-closings/");

    setCabins(cabinData.results);
    setExistingClosings(existingClosingsData.results);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Header currentPage={props.location.pathname} />
      <div className={styles.dataContainer}>
        <h2>Eksisterende Stenginger:</h2>
        {existingClosings.map((c, k) => (
          <ExistingClosing key={k} closing={c} />
        ))}
      </div>
    </div>
  );
};

const ExistingClosing = ({ closing }) => {
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
      <hr />
      <DefaultButton iconProps={{ iconName: "Delete" }} text="Slett" />
    </div>
  );
};

export default Closing;
