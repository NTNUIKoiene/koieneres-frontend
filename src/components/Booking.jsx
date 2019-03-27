import React from "react";
import PropTypes from "prop-types";
import { useState, useEffect, useReducer } from "react";
import Header from "./Header";
import styles from "./Booking.module.css";
import { FontClassNames, ColorClassNames } from "@uifabric/styling";
import { datePickerStrings } from "../utils/DatePickerStrings";
import { getUpdatedSelectedDates } from "../utils/Utils";
import { addDays, format, differenceInCalendarDays } from "date-fns";
import nb from "date-fns/locale/nb";
import {
  TextField,
  PrimaryButton,
  DefaultButton,
  DetailsList,
  CheckboxVisibility,
  DatePicker,
  Label,
  DayOfWeek,
  Shimmer,
  MessageBar,
  MessageBarType,
  Checkbox,
  Modal
} from "office-ui-fabric-react";
import BedSelector from "./booking/BedSelector";
import Cell from "./booking/Cell";
import Help from "./booking/Help";
import Confirmation from "./booking/Confirmation";
import {
  ContactInfo,
  contactInfoReducer,
  initialContactInfoState
} from "./booking/ContactInfo";
import { useUserConfig } from "../hooks";
import axios from "axios";
import { BASE_URL } from "../config";

const initialSelectedDates = [];

const selectedDatesReducer = (state, action) => {
  const { name, dateKey, all, number } = action.value;
  switch (action.type) {
    case "ADD_SELECTED_DATE":
      return getUpdatedSelectedDates(name, dateKey, false, state, 3);
    case "DELETE_SELECTED_DATE":
      return getUpdatedSelectedDates(name, dateKey, true, state, 3);
    case "SET_MEMBER_NUMBER":
      return state.map(sd => {
        if (all || sd.dateKey === dateKey) {
          return { ...sd, members: number };
        } else {
          return sd;
        }
      });
    case "SET_NON_MEMBER_NUMBER":
      return state.map(sd => {
        if (all || sd.dateKey === dateKey) {
          return { ...sd, nonMembers: number };
        } else {
          return sd;
        }
      });
    default:
      return state;
  }
};

const Booking = props => {
  const cancelToken = axios.CancelToken;

  // General state
  const [errorText, setErrorText] = useState("");

  const userConfig = useUserConfig();

  // MATRIX SECTION

  const [reservationData, setReservationData] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(addDays(new Date(), 0));
  const deltaDays = differenceInCalendarDays(toDate, fromDate);

  useEffect(() => {
    let didCancel = false;
    const source = cancelToken.source();

    const fetchReservationPeriod = async () => {
      try {
        const periodData = (await axios.get(
          `${BASE_URL}/api/reservation-period/`,
          { cancelToken: source.token }
        )).data;
        setToDate(new Date(periodData.to));
      } catch (_) {
        if (!didCancel) {
          setErrorText("Klare ikke å hente reservasjonsperioden!");
        }
      }
    };
    fetchReservationPeriod();
    return () => {
      didCancel = true;
      source.cancel();
    };
  }, []);

  useEffect(() => {
    const source = cancelToken.source();
    let didCancel = false;
    const fetchReservationData = async () => {
      try {
        const status = (await axios.get(`${BASE_URL}/api/status/`, {
          cancelToken: source.token,
          params: {
            from: format(fromDate, "YYYY-MM-DD"),
            to: format(toDate, "YYYY-MM-DD")
          }
        })).data;
        setReservationData(status);
      } catch (_) {
        if (!didCancel) {
          setErrorText("Klarte ikke å hente reservasjonsstatus!");
        }
      }
    };
    fetchReservationData();
    return () => {
      source.cancel();
      didCancel = true;
    };
  }, [fromDate, toDate]);

  const [selectedDates, dispatchSelectedDates] = useReducer(
    selectedDatesReducer,
    initialSelectedDates
  );
  const onCellClick = (name, dateKey, isSelected) => {
    if (isSelected) {
      dispatchSelectedDates({
        type: "DELETE_SELECTED_DATE",
        value: { name, dateKey }
      });
    } else {
      dispatchSelectedDates({
        type: "ADD_SELECTED_DATE",
        value: { name, dateKey }
      });
    }
  };
  // Produce columns for data view
  const dataColumns = [
    {
      key: "name",
      name: "",
      minWidth: 100,
      maxWidth: 260,
      isRowHeader: true,
      onRender: item => {
        return <>{item.name}</>;
      }
    }
  ];

  // Produce a column for each day in range
  for (let i = 0; i <= deltaDays; i++) {
    const day = addDays(fromDate, i);
    const key = format(day, "YYYY-MM-DD");
    dataColumns.push({
      key,
      name: format(day, "ddd DD.MM", { locale: nb }),
      minWidth: 60,
      maxWidth: 60,
      onRender: item => (
        <Cell
          item={item}
          day={key}
          selectedDates={selectedDates}
          onCellClick={onCellClick}
        />
      )
    });
  }
  dataColumns.push({ key: "blank", name: "", minWidth: 0 });

  /*
      RESERVATION DETAIL SECTION
  */
  const selectedname =
    (selectedDates[0] && selectedDates[0].name) || "Ingen koie valgt";

  const selectedCabinResData =
    reservationData.filter(cabinData => cabinData.name === selectedname)[0] ||
    {};
  const memberPrice = selectedCabinResData.memberPrice || 0;
  const nonMemberPrice = selectedCabinResData.nonMemberPrice || 0;
  const numberOfBeds = selectedCabinResData.size || 0;
  const totalPrice = selectedDates.reduce(
    (acc, curr) =>
      acc + curr.members * memberPrice + curr.nonMembers * nonMemberPrice,
    0
  );
  const [sameForAllDates, setSameForAllDates] = useState(true);

  const isOverBooked = selectedDates
    .map(
      sd =>
        sd.members + sd.nonMembers >
        numberOfBeds - selectedCabinResData.data[sd.dateKey].booked
    )
    .includes(true);

  const updateBedsOnDate = (dateKey, number, isMember, all = false) => {
    if (isMember) {
      dispatchSelectedDates({
        type: "SET_MEMBER_NUMBER",
        value: {
          dateKey,
          all,
          number: isNaN(number) ? 0 : number
        }
      });
    } else {
      dispatchSelectedDates({
        type: "SET_NON_MEMBER_NUMBER",
        value: {
          dateKey,
          all,
          number: isNaN(number) ? 0 : number
        }
      });
    }
  };

  const bedSelectors = sameForAllDates ? (
    <BedSelector
      date={selectedDates[0]}
      updateBedsOnDate={updateBedsOnDate}
      title=" "
      maxSpaces={
        numberOfBeds -
        Math.max(
          ...selectedDates.map(d => selectedCabinResData.data[d.dateKey].booked)
        )
      }
      updateAll={true}
    />
  ) : (
    selectedDates.map((d, k) => {
      const maxSpaces =
        numberOfBeds - selectedCabinResData.data[d.dateKey].booked;
      return (
        <BedSelector
          date={d}
          key={k}
          updateBedsOnDate={updateBedsOnDate}
          maxSpaces={maxSpaces}
          updateAll={false}
        />
      );
    })
  );

  /*
      CONTACT INFORMATION SECTION
  */
  // TODO: Remove default numbers
  const [contactInfoState, contactInfoDispatch] = useReducer(
    contactInfoReducer,
    initialContactInfoState
  );

  /* 
      EXTRA INFORMATION SECTION
  */
  const [shouldPay, setShouldPay] = useState(true);
  const [comment, setComment] = useState("");

  // const hasBeenEdited =
  //   membershipNumber !== "" ||
  //   name !== "" ||
  //   phone !== "" ||
  //   email !== "" ||
  //   comment !== "" ||
  //   selectedDates.length > 0;

  const canSubmitReservation =
    contactInfoState.membershipNumber !== "" &&
    contactInfoState.name !== "" &&
    contactInfoState.phone !== "" &&
    contactInfoState.email !== "" &&
    totalPrice > 0 &&
    selectedDates.length > 0;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <>
      <div>
        <Header
          currentPage={props.location.pathname}
          helpComponent={<Help />}
        />
        {errorText.length > 0 && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            onDismiss={() => setErrorText("")}
            dismissButtonAriaLabel="Close"
          >
            {errorText}
          </MessageBar>
        )}
        <div className={styles.mainContent}>
          <section className={styles.tableSection}>
            <h2
              className={[
                FontClassNames.xLarge,
                ColorClassNames.themeDark
              ].join(" ")}
            >
              Velg koie og dato
            </h2>
            <div className={styles.dateContainer}>
              <Label htmlFor="fromDate">Vis datoer fra</Label>
              <DatePicker
                id="fromDate"
                value={fromDate}
                onSelectDate={d => setFromDate(d)}
                strings={datePickerStrings}
                firstDayOfWeek={DayOfWeek.Monday}
                formatDate={d => format(d, "dddd D MMM YYYY", { locale: nb })}
                minDate={new Date()}
              />
              <Label htmlFor="toDate">til</Label>
              <DatePicker
                id="toDate"
                value={toDate}
                onSelectDate={d => setToDate(d)}
                minDate={fromDate}
                string={datePickerStrings}
                firstDayOfWeek={DayOfWeek.Monday}
                formatDate={d => format(d, "dddd D MMM YYYY", { locale: nb })}
              />
            </div>
            <div className={styles.tableContainer}>
              <DetailsList
                columns={dataColumns}
                items={reservationData}
                checkboxVisibility={CheckboxVisibility.hidden}
                onRenderMissingItem={() => <Shimmer />}
                enableShimmer={true}
              />
            </div>
          </section>
          <section className={styles.bedsSection}>
            <h2
              className={[
                FontClassNames.xLarge,
                ColorClassNames.themeDark
              ].join(" ")}
            >
              Reservasjonsdetaljer
            </h2>
            {isOverBooked && (
              <MessageBar
                messageBarType={MessageBarType.warning}
                isMultiline={false}
              >
                En eller flere av datoene du har valgt er overbooket.
              </MessageBar>
            )}
            <Label>
              Koie: <b>{selectedname}</b>
            </Label>
            <Label>
              Datoer: <b>{selectedDates.map(sd => sd.dateKey).join(", ")}</b>
            </Label>
            <Label>
              Antall sengeplasser: <b>{numberOfBeds}</b>
            </Label>
            <Label>
              Pris per natt per person:{" "}
              <b>
                {memberPrice}/{nonMemberPrice} NOK (medlem/ikke medlem)
              </b>
            </Label>
            <Label>
              Totalpris: <b>{totalPrice} NOK</b>
            </Label>
            <Checkbox
              checked={sameForAllDates}
              label="Samme antall overnattinger hver dag"
              onChange={() => setSameForAllDates(!sameForAllDates)}
            />
            <div className={styles.bedSelectorContainer}>{bedSelectors}</div>
          </section>
          <ContactInfo
            state={contactInfoState}
            dispatch={contactInfoDispatch}
          />
          {userConfig.isBoard && (
            <section className={styles.styreSection}>
              <h2
                className={[
                  FontClassNames.xLarge,
                  ColorClassNames.themeDark
                ].join(" ")}
              >
                Annen Informasjon
              </h2>
              <Checkbox
                checked={shouldPay}
                label="Koia skal betales for"
                onChange={() => setShouldPay(!shouldPay)}
              />
              <TextField
                label="Kommentar"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </section>
          )}

          <section className={styles.bottomRow}>
            <PrimaryButton
              disabled={!canSubmitReservation}
              className={styles.right}
              onClick={() => setModalIsOpen(true)}
            >
              Utfør Reservasjon
            </PrimaryButton>
            <DefaultButton className={styles.right}>Avbryt</DefaultButton>
          </section>

          <Modal
            isOpen={modalIsOpen}
            onDismiss={() => setModalIsOpen(false)}
            containerClassName={styles.modal}
          >
            <Confirmation
              selectedDates={selectedDates}
              membershipNumber={contactInfoState.membershipNumber}
              name={contactInfoState.name}
              phone={contactInfoState.phone}
              email={contactInfoState.email}
              isBoard={userConfig.isBoard}
              shouldPay={shouldPay}
              comment={comment}
              totalPrice={totalPrice}
              onCancel={() => setModalIsOpen(false)}
            />
          </Modal>
        </div>
      </div>
    </>
  );
};

Booking.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default Booking;
