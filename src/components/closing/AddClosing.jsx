import React, { useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import nb from "date-fns/locale/nb";
import { addDays, format } from "date-fns";
import { datePickerStrings } from "../../utils/DatePickerStrings";
import styles from "./Closing.module.css";
import {
  ComboBox,
  DatePicker,
  DayOfWeek,
  PrimaryButton,
  TextField
} from "office-ui-fabric-react";

const AddClosing = ({ cabins, isLoading, handleAddClosing }) => {
  const initalState = {
    selectedCabin: {
      key: 0,
      text: "Velg koie"
    },
    fromDate: new Date(),
    toDate: addDays(new Date(), 1),
    comment: ""
  };

  const actions = {
    SET_FROM_DATE: "SET_FROM_DATE",
    SET_TO_DATE: "SET_TO_DATE",
    SET_SELECTED_CABIN: "SET_SELECTED_CABIN",
    SET_COMMENT: "SET_COMMENT"
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case actions.SET_SELECTED_CABIN:
        return { ...state, selectedCabin: action.payload };
      case actions.SET_FROM_DATE:
        return { ...state, fromDate: action.payload };
      case actions.SET_TO_DATE:
        return { ...state, toDate: action.payload };
      case actions.SET_COMMENT:
        return { ...state, comment: action.payload };
      default:
        return { ...state };
    }
  };

  const [state, dispatch] = useReducer(reducer, initalState);

  return (
    <div className={styles.addContainer}>
      <h2>Steng en koie:</h2>
      <ComboBox
        autoComplete="on"
        options={cabins}
        placeholder="Select or type an option"
        text={state.selectedCabin.text}
        onChange={(_, o) =>
          dispatch({ type: actions.SET_SELECTED_CABIN, payload: o })
        }
      />
      <DatePicker
        label="Fra"
        value={state.fromDate}
        onSelectDate={d =>
          dispatch({ type: actions.SET_FROM_DATE, payload: d })
        }
        strings={datePickerStrings}
        firstDayOfWeek={DayOfWeek.Monday}
        formatDate={d => format(d, "dddd D MMM YYYY", { locale: nb })}
        minDate={new Date()}
      />
      <DatePicker
        label="Til"
        value={state.toDate}
        onSelectDate={d => dispatch({ type: actions.SET_TO_DATE, payload: d })}
        minDate={addDays(state.fromDate, 1)}
        string={datePickerStrings}
        firstDayOfWeek={DayOfWeek.Monday}
        formatDate={d => format(d, "dddd D MMM YYYY", { locale: nb })}
      />
      <TextField
        value={state.comment}
        onChange={e =>
          dispatch({ type: actions.SET_COMMENT, payload: e.target.value })
        }
        label="Kommentar"
      />
      <PrimaryButton
        text="Lagre"
        onClick={() => {
          handleAddClosing(
            state.selectedCabin,
            state.fromDate,
            state.toDate,
            state.comment
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
  cabins: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleAddClosing: PropTypes.func.isRequired
};

export default AddClosing;
