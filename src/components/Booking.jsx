import React from "react";
import { useState, useEffect } from "react";
import Header from "./Header";
import styles from "./Booking.module.css";
import { Prompt } from "react-router-dom";
import { FontClassNames, ColorClassNames } from "@uifabric/styling";
import { getData } from "../data/cabindates";
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
  Checkbox
} from "office-ui-fabric-react";
import BedSelector from "./booking/BedSelector";
import Cell from "./booking/Cell";
import Help from "./booking/Help";

const Booking = props => {
  // Redirect to front page if not authenticated
  if (!props.auth.isAuthenticated) {
    props.history.push("/");
  }

  // General state
  const [errorText, setErrorText] = useState("");

  /*
      MATRIX SECTION
  */
  const [reservationData, setReservationData] = useState([]);
  useEffect(
    () => {
      getData()
        .then(data => {
          setReservationData(data);
        })
        .catch(() => {
          setErrorText("Klarte ikke å hente reservasjonsdata!");
        });
    },
    [setReservationData]
  );
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(addDays(new Date(), 13));
  const deltaDays = differenceInCalendarDays(toDate, fromDate);
  const [selectedDates, setSelectedDates] = useState([]);

  const onCellClick = (cabinName, dateKey, isSelected) => {
    setSelectedDates(
      getUpdatedSelectedDates(cabinName, dateKey, isSelected, selectedDates)
    );
  };

  // Produce columns for data view
  const dataColumns = [
    {
      key: "cabinname",
      name: "",
      minWidth: 100,
      maxWidth: 260,
      isRowHeader: true,
      onRender: item => {
        return <div>{item.cabinName}</div>;
      }
    }
  ];

  // Produce a column for each day in range
  for (let i = 0; i < deltaDays; i++) {
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
  const selectedCabinName =
    (selectedDates[0] && selectedDates[0].cabinName) || "Ingen koie valgt";
  const selectedCabinResData =
    reservationData.filter(
      cabinData => cabinData.cabinName === selectedCabinName
    )[0] || {};
  const numberOfBeds = selectedCabinResData.size || 0;
  const [sameForAllDates, setSameForAllDates] = useState(true);
  const isOverBooked = selectedDates
    .map(
      sd =>
        sd.members + sd.nonMembers >
        numberOfBeds - selectedCabinResData[sd.dateKey]
    )
    .includes(true);

  const updateBedsOnDate = (dateKey, value, isMember, all = false) => {
    let valueToSet = value;
    if (isNaN(valueToSet)) {
      valueToSet = 0;
    }

    const newSelectedDates = [];
    selectedDates.forEach(date => {
      if (date.dateKey === dateKey || all) {
        //Update
        if (isMember) {
          newSelectedDates.push({
            ...date,
            members: valueToSet
          });
        } else {
          newSelectedDates.push({
            ...date,
            nonMembers: valueToSet
          });
        }
      } else {
        newSelectedDates.push(date);
      }
    });
    setSelectedDates(newSelectedDates);
  };

  const bedSelectors = sameForAllDates ? (
    <BedSelector
      date={selectedDates[0]}
      updateBedsOnDate={updateBedsOnDate}
      title=" "
      maxSpaces={
        numberOfBeds -
        Math.max(...selectedDates.map(d => selectedCabinResData[d.dateKey]))
      }
      updateAll={true}
    />
  ) : (
    selectedDates.map((d, k) => {
      const maxSpaces = numberOfBeds - selectedCabinResData[d.dateKey];
      return (
        <BedSelector
          date={d}
          key={k}
          updateBedsOnDate={updateBedsOnDate}
          maxSpaces={maxSpaces}
        />
      );
    })
  );

  /*
      CONTACT INFORMATION SECTION
  */
  const [membershipNumber, setMembershipNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitReservation = () => {
    const payload = { membershipNumber, name, phone, email };
    return payload;
  };

  return (
    <React.Fragment>
      <Prompt
        when={false}
        message="Reservasjonen er ikke lagret, sikker på at du vil avbryte?"
      />

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
              Koie: <b>{selectedCabinName}</b>
            </Label>
            <Label>
              Datoer: <b>{selectedDates.map(sd => sd.dateKey).join(", ")}</b>
            </Label>
            <Label>
              Antall sengeplasser: <b>{numberOfBeds}</b>
            </Label>
            <Checkbox
              checked={sameForAllDates}
              label="Samme antall overnattinger hver dag"
              onChange={() => setSameForAllDates(!sameForAllDates)}
            />
            <div className={styles.bedSelectorContainer}>{bedSelectors}</div>
          </section>
          <section className={styles.infoSection}>
            <h2
              className={[
                FontClassNames.xLarge,
                ColorClassNames.themeDark
              ].join(" ")}
            >
              Kontaktinformasjon
            </h2>
            <TextField
              required
              label="Medlemsnummer (NTNUI / BIL)"
              value={membershipNumber}
              onChange={e => setMembershipNumber(e.target.value)}
            />
            <TextField
              required
              label="Navn"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <TextField
              required
              label="Telefon"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <TextField
              required
              label="Epost"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </section>
          <section className={styles.bottomRow}>
            <PrimaryButton
              className={styles.right}
              onClick={onSubmitReservation}
            >
              Utfør Reservasjon
            </PrimaryButton>
            <DefaultButton className={styles.right}>Avbryt</DefaultButton>
          </section>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Booking;
