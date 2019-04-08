import React, { useState } from "react";
import {
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Calendar,
  Label,
  DayOfWeek,
  TextField,
  DefaultButton
} from "office-ui-fabric-react";
import { addDays, isWednesday, isThursday, format } from "date-fns";
import { datePickerStrings } from "../utils/DatePickerStrings";
import styles from "./ExtendedPeriods.module.css";
import axios from "axios";
import { BASE_URL } from "../config";
import { useAbortableRequest } from "../hooks";
import Card from "./common/Card";
import LoadingCard from "./common/LoadingCard";

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

const ExtendedPeriod = () => {
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [description, setDescription] = useState("");
  const [reservationDate, setReservationDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [extensions, setExtensions] = useState([]);

  const refetchExtendedPeriods = useAbortableRequest(
    "/api/extended-periods",
    response => {
      setExtensions(response.data.results);
      setIsLoading(false);
    },
    () => {
      setShowError(true);
      setIsLoading(false);
    }
  );

  const addExtension = async () => {
    // BUG: No error showing when post requests returns 400
    setShowError(false);
    setIsLoading(true);
    try {
      const payload = {
        reservationDate: format(reservationDate, "YYYY-MM-DD"),
        endDate: format(endDate, "YYYY-MM-DD"),
        description
      };
      await axios.post(`${BASE_URL}/api/extended-periods/`, payload);
      await refetchExtendedPeriods();
      setDescription("");
      setReservationDate(null);
      setEndDate(null);
    } catch (_) {
      setShowError(true);
    }
  };

  const deleteExtension = async id => {
    setShowError(false);
    setIsLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/extended-periods/${id}/`);
      await refetchExtendedPeriods();
    } catch (_) {
      setShowError(true);
    }
  };

  return (
    <div>
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
            disabled={isLoading || description.length === 0}
          />
        </div>
        <div className={styles.dataContainer}>
          <h2>Eksisterende utvidelser:</h2>
          {isLoading
            ? Array(extensions.length === 0 ? 3 : extensions.length)
                .fill()
                .map((_, k) => (
                  <LoadingCard
                    key={k}
                    template="s.ss"
                    buttonLabels={["Slett"]}
                  />
                ))
            : extensions.map((e, k) => (
                <Card key={k}>
                  <h3>{e.description}</h3>
                  <p>
                    Reservasjonsdato: {e.reservationDate}
                    <br />
                    Sluttdato: {e.endDate}
                  </p>
                  <DefaultButton
                    text="Slett"
                    iconProps={{ iconName: isLoading ? "Hourglass" : "Delete" }}
                    disabled={isLoading}
                    onClick={() => deleteExtension(e.id)}
                  />
                </Card>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ExtendedPeriod;
