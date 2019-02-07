import React from "react";
import { useState, useEffect } from "react";
import Header from "./Header";
import styles from "./Booking.module.css";
import { Prompt } from "react-router-dom";
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
import { BASE_URL } from "../config";

const Booking = props => {
  // Redirect to front page if not authenticated
  if (!props.auth.authenticated) {
    props.history.push("/");
  }

  const { userConfig } = props.auth;

  // General state
  const [errorText, setErrorText] = useState("");

  /*
      MATRIX SECTION
  */
  const [reservationData, setReservationData] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(addDays(new Date(), 0));
  const deltaDays = differenceInCalendarDays(toDate, fromDate);

  const fetchData = async () => {
    try {
      const statusData = await (await fetch(`${BASE_URL}/api/status/`)).json();
      const periodData = await (await fetch(
        `${BASE_URL}/api/reservation-period/`
      )).json();
      setToDate(new Date(periodData.to));
      setReservationData(statusData);
    } catch (_) {
      setErrorText("Klarte ikke å hente reservasjonsdata!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [selectedDates, setSelectedDates] = useState([]);

  const onCellClick = (name, dateKey, isSelected) => {
    setSelectedDates(
      getUpdatedSelectedDates(
        name,
        dateKey,
        isSelected,
        selectedDates,
        userConfig.maxNights
      )
    );
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
        />
      );
    })
  );

  /*
      CONTACT INFORMATION SECTION
  */
  // TODO: Remove default values
  const [membershipNumber, setMembershipNumber] = useState("01234");
  const [name, setName] = useState("Ola Nordmann");
  const [phone, setPhone] = useState("99887766");
  const [email, setEmail] = useState("ola.nordmann@example.com");

  /* 
      EXTRA INFORMATION SECTION
  */
  const [shouldPay, setShouldPay] = useState(true);
  const [comment, setComment] = useState("");

  const hasBeenEdited =
    membershipNumber !== "" ||
    name !== "" ||
    phone !== "" ||
    email !== "" ||
    comment !== "" ||
    selectedDates.length > 0;

  const canSubmitReservation =
    membershipNumber !== "" &&
    name !== "" &&
    phone !== "" &&
    email !== "" &&
    totalPrice > 0 &&
    selectedDates.length > 0;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <React.Fragment>
      <Prompt
        when={hasBeenEdited}
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
              membershipNumber={membershipNumber}
              name={name}
              phone={phone}
              email={email}
              isBoard={userConfig.isBoard}
              shouldPay={shouldPay}
              comment={comment}
              totalPrice={totalPrice}
              onCancel={() => setModalIsOpen(false)}
              history={props.history}
            />
          </Modal>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Booking;
