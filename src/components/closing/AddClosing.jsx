import React, { useState } from "react";
import PropTypes from "prop-types";
import nb from "date-fns/locale/nb";
import { addDays, format } from "date-fns";
import { datePickerStrings } from "../../utils/DatePickerStrings";
import styles from "./Closing.module.css";
import { useAbortableRequest } from "../../hooks";
import {
  ComboBox,
  DatePicker,
  DayOfWeek,
  PrimaryButton,
  TextField
} from "office-ui-fabric-react";

const AddClosing = ({ isLoading, handleAddClosing, handleError }) => {
  const initialState = {
    selectedCabin: {
      key: 0,
      text: "Velg koie"
    },
    fromDate: new Date(),
    toDate: addDays(new Date(), 1),
    comment: ""
  };

  const [cabins, setCabins] = useState([]);
  const [state, setState] = useState(initialState);

  useAbortableRequest(
    "/api/cabin/",
    response => {
      const cabins = response.data.results.map(cabin => {
        return { key: cabin.id, text: cabin.name };
      });
      setCabins(cabins);
    },
    handleError
  );

  return (
    <div className={styles.addContainer}>
      <h2>Steng en koie:</h2>
      <ComboBox
        autoComplete="on"
        options={cabins}
        placeholder="Select or type an option"
        text={state.selectedCabin.text}
        onChange={(_, cabin) => setState({ ...state, selectedCabin: cabin })}
      />
      <DatePicker
        label="Fra"
        value={state.fromDate}
        onSelectDate={date => setState({ ...state, fromDate: date })}
        strings={datePickerStrings}
        firstDayOfWeek={DayOfWeek.Monday}
        formatDate={d => format(d, "dddd D MMM YYYY", { locale: nb })}
        minDate={new Date()}
      />
      <DatePicker
        label="Til"
        value={state.toDate}
        onSelectDate={date => setState({ ...state, toDate: date })}
        minDate={addDays(state.fromDate, 1)}
        string={datePickerStrings}
        firstDayOfWeek={DayOfWeek.Monday}
        formatDate={d => format(d, "dddd D MMM YYYY", { locale: nb })}
      />
      <TextField
        value={state.comment}
        onChange={e => setState({ ...state, comment: e.target.value })}
        label="Kommentar"
      />
      <PrimaryButton
        text="Lagre"
        onClick={() => {
          handleAddClosing(
            state.selectedCabin,
            state.fromDate,
            state.toDate,
            state.comment,
            () => setState(initialState)
          );
        }}
        iconProps={isLoading ? { iconName: "Hourglass" } : { iconName: "Save" }}
        disabled={
          state.comment === "" || state.selectedCabin.key === 0 || isLoading
        }
      />
    </div>
  );
};

AddClosing.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  handleAddClosing: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired
};

export default AddClosing;
