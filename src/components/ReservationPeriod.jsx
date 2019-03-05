import React from "react";
import { useState } from "react";
import Header from "./Header";
import styles from "./ReservationPeriod.module.css";
import Loader from "./common/Loader";
import {
  DatePicker,
  DayOfWeek,
  TextField,
  PrimaryButton,
  Label
} from "office-ui-fabric-react";
import { addDays, format } from "date-fns";
import { datePickerStrings } from "../utils/DatePickerStrings";
import nb from "date-fns/locale/nb";

const ReservationPeriod = props => {
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(addDays(new Date(), 1));
  const [title, setTitle] = useState("");

  return (
    <div>
      <Header currentPage={props.location.pathname} />
      <div className={styles.container}>
        <div className={styles.add}>
          <h2>Ny Reservasjonsperiode</h2>
          <p>
            I skjemaet under kan du legge til en ny reservasjonsperiode. Dette
            skal brukes hvis man av en eller annen grunn skal kunne reservere
            koier lenger frem i tid enn vanlig. Dette kan for eksempel være ved
            jule- eller sommerferier.
          </p>
          <DatePicker
            label="Fra"
            id="fromDate"
            value={fromDate}
            onSelectDate={d => setFromDate(d)}
            strings={datePickerStrings}
            firstDayOfWeek={DayOfWeek.Monday}
            formatDate={d => format(d, "dddd D MMM YYYY", { locale: nb })}
            minDate={new Date()}
          />
          <DatePicker
            label="Til"
            id="toDate"
            value={toDate}
            onSelectDate={d => setToDate(d)}
            minDate={fromDate}
            string={datePickerStrings}
            firstDayOfWeek={DayOfWeek.Monday}
            formatDate={d => format(d, "dddd D MMM YYYY", { locale: nb })}
          />
          <TextField
            label="Beskrivelse"
            onChange={e => setTitle(e.target.value)}
            value={title}
          />
          <PrimaryButton
            className={styles.addBtn}
            text="Lagre"
            iconProps={{ iconName: isLoading ? "Hourglass" : "Save" }}
            disabled={isLoading}
          />
        </div>
        <div className={styles.display}>
          <h2>Eksisterende Reservasjonsperioder</h2>
          <Loader show={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ReservationPeriod;
