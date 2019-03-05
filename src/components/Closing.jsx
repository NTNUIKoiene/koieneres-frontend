import React from "react";
import nb from "date-fns/locale/nb";
import { addDays, format } from "date-fns";
import { datePickerStrings } from "../utils/DatePickerStrings";

import { useState, useEffect } from "react";
import Header from "./Header";
import styles from "./Closing.module.css";
import { fetchAPIData, deleteAPIData, postAPIData } from "../api";
import {
  DefaultButton,
  ComboBox,
  Label,
  DatePicker,
  DayOfWeek,
  PrimaryButton,
  TextField,
  MessageBar,
  MessageBarType
} from "office-ui-fabric-react";

const Closing = props => {
  const [cabins, setCabins] = useState([]);
  const [existingClosings, setExistingClosings] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(addDays(new Date(), 1));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState({
    key: 0,
    text: "Velg koie"
  });
  const [comment, setComment] = useState("");
  const [showError, setShowError] = useState(false);

  const fetchData = async () => {
    const cabinData = await fetchAPIData("/api/cabin/");
    const existingClosingsData = await fetchAPIData("/api/cabin-closings/");

    setCabins(
      cabinData.results.map(c => {
        return { key: c.id, text: c.name };
      })
    );
    setExistingClosings(existingClosingsData.results);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteClosing = async id => {
    setIsLoading(true);
    await deleteAPIData(`/api/cabin-closings/${id}/`);
    await fetchData();
    setIsLoading(false);
  };

  const addClosing = async () => {
    setShowError(false);
    setIsLoading(true);
    const payload = {
      cabin: selectedCabin.key,
      fromDate: format(fromDate, "YYYY-MM-DD"),
      toDate: format(toDate, "YYYY-MM-DD"),
      comment
    };
    try {
      await postAPIData("/api/cabin-closings/", payload);
      await fetchData();
    } catch (_) {
      setShowError(true);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Header currentPage={props.location.pathname} />
      <div className={styles.container}>
        {showError && (
          <MessageBar
            className={styles.error}
            messageBarType={MessageBarType.error}
          >
            Kunne ikke lagre stengingen!
          </MessageBar>
        )}
        <div className={styles.addContainer}>
          <h2>Steng en koie:</h2>
          <ComboBox
            autoComplete="on"
            options={cabins}
            placeholder="Select or type an option"
            text={selectedCabin.text}
            onChange={(_, o) => setSelectedCabin(o)}
          />
          <DatePicker
            label="Fra"
            value={fromDate}
            onSelectDate={d => setFromDate(d)}
            strings={datePickerStrings}
            firstDayOfWeek={DayOfWeek.Monday}
            formatDate={d => format(d, "dddd D MMM YYYY", { locale: nb })}
            minDate={new Date()}
          />
          <DatePicker
            label="Til"
            value={toDate}
            onSelectDate={d => setToDate(d)}
            minDate={fromDate}
            string={datePickerStrings}
            firstDayOfWeek={DayOfWeek.Monday}
            formatDate={d => format(d, "dddd D MMM YYYY", { locale: nb })}
          />
          <TextField
            value={comment}
            onChange={e => setComment(e.target.value)}
            label="Kommentar"
          />
          <PrimaryButton
            text="Lagre"
            onClick={addClosing}
            iconProps={
              isLoading ? { iconName: "Hourglass" } : { iconName: "Save" }
            }
            disabled={comment === "" || selectedCabin.key === 0 || isLoading}
          />
        </div>
        <div className={styles.dataContainer}>
          <h2>Eksisterende Stenginger:</h2>
          {existingClosings.map((c, k) => (
            <ExistingClosing
              key={k}
              closing={c}
              deleteClick={() => deleteClosing(c.id)}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ExistingClosing = ({ closing, deleteClick, isLoading }) => {
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

export default Closing;
