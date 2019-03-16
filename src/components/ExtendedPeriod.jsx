import React, { useState, useEffect } from "react";
import Header from "./Header";
import {
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Calendar,
  Label,
  DayOfWeek,
  TextField
} from "office-ui-fabric-react";
import { addDays, isWednesday, isThursday, format } from "date-fns";
import { datePickerStrings } from "../utils/DatePickerStrings";
import styles from "./ExtendedPeriods.module.css";
import axios from "axios";
import { BASE_URL } from "../config";
import Card from "./common/Card";

const computeRestrictedDates = acceptFn => {
  const dates = [];
  for (let i = 0; i < 365; i++) {
    const d = addDays(new Date(), i);
    if (!acceptFn(d)) {
      dates.push(d);
    }
  }
  return dates;
};

const restrictedListWednesday = computeRestrictedDates(isWednesday);
const restrictedListThursday = computeRestrictedDates(isThursday);

const ExtendedPeriod = props => {
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [description, setDescription] = useState("");
  const [reservationDate, setReservationDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [extensions, setExtensions] = useState([]);
  console.log("extensions: ", extensions);

  const fetchExtensions = async () => {
    setIsLoading(true);
    try {
      const data = (await axios.get(`${BASE_URL}/api/extended-periods`)).data
        .results;
      setExtensions(data);
    } catch (_) {
      setShowError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExtensions();
  }, []);

  const addExtension = async () => {
    setShowError(false);
    setIsLoading(true);
    try {
      const payload = {
        reservationDate: format(reservationDate, "YYYY-MM-DD"),
        endDate: format(endDate, "YYYY-MM-DD"),
        description
      };
      await axios.post(`${BASE_URL}/api/extended-periods/`, payload);
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
            Noe gikk galt!
          </MessageBar>
        )}
        <div className={styles.addContainer}>
          <h2>Utvid en periode:</h2>
          <Label htmlFor="resDate">Reservasjonsdato</Label>
          <Calendar
            id="resDate"
            strings={datePickerStrings}
            showMonthPickerAsOverlay={true}
            firstDayOfWeek={DayOfWeek.Monday}
            onSelectDate={d => setReservationDate(d)}
            value={reservationDate}
            showWeekNumbers={true}
            showGoToToday={false}
            minDate={new Date()}
            maxDate={addDays(new Date(), 365)}
            restrictedDates={restrictedListWednesday}
          />
          <Label htmlFor="endDate">Sluttdato</Label>
          <Calendar
            id="endDate"
            strings={datePickerStrings}
            showMonthPickerAsOverlay={true}
            firstDayOfWeek={DayOfWeek.Monday}
            onSelectDate={d => setEndDate(d)}
            value={endDate}
            showWeekNumbers={true}
            showGoToToday={false}
            minDate={reservationDate || new Date()}
            maxDate={addDays(new Date(), 365)}
            restrictedDates={restrictedListThursday}
          />
          <TextField
            label="Beskrivelse"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <PrimaryButton
            text="Lagre"
            onClick={addExtension}
            iconProps={
              isLoading ? { iconName: "Hourglass" } : { iconName: "Save" }
            }
            disabled={isLoading}
          />
        </div>
        <div className={styles.dataContainer}>
          <h2>Eksisterende utvidelser:</h2>
          {extensions.map((e, k) => (
            <Card key={k}>
              <h3>{e.description}</h3>
              <p>
                Reservasjonsdato: {e.reservationDate}
                <br />
                Sluttdato: {e.endDate}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExtendedPeriod;
