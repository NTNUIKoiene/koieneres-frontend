import React from "react";
import nb from "date-fns/locale/nb";
import { addDays, format } from "date-fns";
import { datePickerStrings } from "../utils/DatePickerStrings";
import { useState, useEffect } from "react";
import Header from "./Header";
import styles from "./Closing.module.css";
import {
  DefaultButton,
  ComboBox,
  DatePicker,
  DayOfWeek,
  PrimaryButton,
  TextField,
  MessageBar,
  MessageBarType,
  Shimmer
} from "office-ui-fabric-react";
import axios from "axios";
import { BASE_URL } from "../config";

const Closing = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [cabins, setCabins] = useState([]);
  const [existingClosings, setExistingClosings] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(addDays(new Date(), 1));
  const [comment, setComment] = useState("");
  const [showError, setShowError] = useState(false);
  const [selectedCabin, setSelectedCabin] = useState({
    key: 0,
    text: "Velg koie"
  });

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const cabinData = (await axios.get(`${BASE_URL}/api/cabin/`)).data;
      const existingClosingsData = (await axios.get(
        `${BASE_URL}/api/cabin-closings/`
      )).data;
      setCabins(
        cabinData.results.map(c => {
          return { key: c.id, text: c.name };
        })
      );
      setExistingClosings(existingClosingsData.results);
    } catch (_) {
      setShowError(true);
    }

    setIsFetching(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteClosing = async id => {
    setIsLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/cabin-closings/${id}/`);
      await fetchData();
    } catch (_) {
      setShowError(true);
    }
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
      await axios.post(`${BASE_URL}/api/cabin-closings/`, payload);
      await fetchData();
    } catch (_) {
      setShowError(true);
    }
    setIsLoading(false);
  };

  const loadingIndicators = Array(3)
    .fill()
    .map((_, k) => <LoadingCard key={k} />);

  const closingCards = existingClosings.map((c, k) => (
    <ExistingClosing
      key={k}
      closing={c}
      deleteClick={() => deleteClosing(c.id)}
      isLoading={isLoading}
    />
  ));

  const noResultMessage = <h3>Ingen koier er planlagt stengt.</h3>;

  let cards = loadingIndicators;

  if (!isFetching) {
    cards = existingClosings.length === 0 ? noResultMessage : closingCards;
  }

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
          {cards}
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

const LoadingCard = () => (
  <div className={styles.card}>
    <h3>
      <Shimmer width="100%" />
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
    <br />
    <DefaultButton
      text="Slett"
      disabled={true}
      iconProps={{ iconName: "Delete" }}
    />
  </div>
);

export default Closing;
