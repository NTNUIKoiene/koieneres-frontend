import React, { useReducer } from "react";
import PropTypes from "prop-types";
import nb from "date-fns/locale/nb";
import { addDays, format } from "date-fns";
import { datePickerStrings } from "../../utils/DatePickerStrings";
import styles from "./Closing.module.css";
import { BASE_URL } from "../../config";
import { useAbortableRequest } from "../../hooks";
import {
  ComboBox,
  DatePicker,
  DayOfWeek,
  PrimaryButton,
  TextField
} from "office-ui-fabric-react";

const formActions = {
  SET_CABINS: "SET_CABINS",
  SET_FROM_DATE: "SET_FROM_DATE",
  SET_TO_DATE: "SET_TO_DATE",
  SET_SELECTED_CABIN: "SET_SELECTED_CABIN",
  SET_COMMENT: "SET_COMMENT",
  CLEAR_FORM: "CLEAR_FORM"
};

const formReducer = (state, action) => {
  switch (action.type) {
    case formActions.SET_CABINS:
      return { ...state, cabins: action.payload };
    case formActions.SET_SELECTED_CABIN:
      return { ...state, selectedCabin: action.payload };
    case formActions.SET_FROM_DATE:
      return { ...state, fromDate: action.payload };
    case formActions.SET_TO_DATE:
      return { ...state, toDate: action.payload };
    case formActions.SET_COMMENT:
      return { ...state, comment: action.payload };
    case formActions.CLEAR_FORM:
      return { ...initalFormState };
    default:
      return { ...state };
  }
};

const initalFormState = {
  cabins: [],
  selectedCabin: {
    key: 0,
    text: "Velg koie"
  },
  fromDate: new Date(),
  toDate: addDays(new Date(), 1),
  comment: ""
};

const AddClosing = ({ isLoading, handleAddClosing, handleError }) => {
  const [state, dispatch] = useReducer(formReducer, initalFormState);

  const handleSuccess = response => {
    const cabins = response.data.results.map(cabin => {
      return { key: cabin.id, text: cabin.name };
    });
    dispatch({ type: formActions.SET_CABINS, payload: cabins });
  };

  useAbortableRequest(
    "GET",
    `${BASE_URL}/api/cabin/`,
    handleSuccess,
    handleError,
    []
  );

  return (
    <div className={styles.addContainer}>
      <h2>Steng en koie:</h2>
      <ComboBox
        autoComplete="on"
        options={state.cabins}
        placeholder="Select or type an option"
        text={state.selectedCabin.text}
        onChange={(_, o) =>
          dispatch({ type: formActions.SET_SELECTED_CABIN, payload: o })
        }
      />
      <DatePicker
        label="Fra"
        value={state.fromDate}
        onSelectDate={d =>
          dispatch({ type: formActions.SET_FROM_DATE, payload: d })
        }
        strings={datePickerStrings}
        firstDayOfWeek={DayOfWeek.Monday}
        formatDate={d => format(d, "dddd D MMM YYYY", { locale: nb })}
        minDate={new Date()}
      />
      <DatePicker
        label="Til"
        value={state.toDate}
        onSelectDate={d =>
          dispatch({ type: formActions.SET_TO_DATE, payload: d })
        }
        minDate={addDays(state.fromDate, 1)}
        string={datePickerStrings}
        firstDayOfWeek={DayOfWeek.Monday}
        formatDate={d => format(d, "dddd D MMM YYYY", { locale: nb })}
      />
      <TextField
        value={state.comment}
        onChange={e =>
          dispatch({ type: formActions.SET_COMMENT, payload: e.target.value })
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
            state.comment,
            () => {
              dispatch({ type: formActions.CLEAR_FORM });
            }
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
