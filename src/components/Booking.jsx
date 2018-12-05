import React from "react";
import { useState } from "react";
import Header from "./Header";
import styles from "./Booking.module.css";
import { Prompt } from "react-router-dom";
import { FontClassNames, ColorClassNames } from "@uifabric/styling";
import { generateData } from "../data/cabindates";
import { datePickerStrings } from "../utils/DatePickerStrings";
import { addDays, format, differenceInCalendarDays } from "date-fns";
import nb from "date-fns/locale/nb";
import {
  TextField,
  PrimaryButton,
  DefaultButton,
  DetailsList,
  CheckboxVisibility,
  TooltipHost,
  DatePicker,
  Label,
  DayOfWeek
} from "office-ui-fabric-react";

const Booking = props => {
  // Redirect to front page if not authenticated
  if (!props.auth.isAuthenticated) {
    props.history.push("/");
  }

  // State
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(addDays(new Date(), 13));
  const deltaDays = differenceInCalendarDays(toDate, fromDate);

  const days = 13;

  const resData = [
    generateData("Flåkoia", 11, days),
    generateData("Fosenkoia", 10, days),
    generateData("Heinfjordstua", 25, days),
    generateData("Hognabu", 6, days),
    generateData("Holmsåkoia", 20, days),
    generateData("Holvassgamma", 8, days),
    generateData("Iglbu", 10, days),
    generateData("Kamtjønnkoia", 6, days),
    generateData("Kåsen", 4, days),
    generateData("Lyngli", 13, days),
    generateData("Lynhøgen", 5, days),
    generateData("Mevasskoia", 5, days),
    generateData("Mortenskåten", 2, days),
    generateData("Nicokoia", 8, days),
    generateData("Rindalsløa", 4, days),
    generateData("Selbukåten", 2, days),
    generateData("Sonvasskoia", 8, days),
    generateData("Stabburet", 2, days),
    generateData("Stakkslettbua", 11, days),
    generateData("Telin", 9, days),
    generateData("Taagabu", 6, days),
    generateData("Vekvessætra", 20, days),
    generateData("Øvensenget", 8, days)
  ];

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
      onRender: item => {
        const count = item[key];
        let cellStyle = styles.cell;
        if (count === item.size) {
          cellStyle = styles.fullCell;
        } else if (count > 0) {
          cellStyle = styles.partialCell;
        }
        const tooltipText = `${item.cabinName}, ${key}`;
        return (
          <TooltipHost content={tooltipText}>
            <div className={cellStyle}>
              {count} / {item.size}
            </div>
          </TooltipHost>
        );
      }
    });
  }
  dataColumns.push({ key: "blank", name: "", minWidth: 0 });

  return (
    <React.Fragment>
      <Prompt
        when={false}
        message="Reservasjonen er ikke lagret, sikker på at du vil avbryte?"
      />

      <div>
        <Header currentPage={props.location.pathname} />
        <section className={styles.section}>
          <h2
            className={[FontClassNames.xLarge, ColorClassNames.themeDark].join(
              " "
            )}
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
              items={resData}
              checkboxVisibility={CheckboxVisibility.hidden}
            />
          </div>
        </section>
        <section className={styles.section}>
          <h2
            className={[FontClassNames.xLarge, ColorClassNames.themeDark].join(
              " "
            )}
          >
            Reservasjonsdetaljer
          </h2>
        </section>
        <section className={styles.section}>
          <h2
            className={[FontClassNames.xLarge, ColorClassNames.themeDark].join(
              " "
            )}
          >
            Kontaktinformasjon
          </h2>
          <TextField required label="Medlemsnummer (NTNUI / BIL)" />
          <TextField required label="Navn" />
          <TextField required label="Telefon" />
          <TextField required label="Epost" />
        </section>
        <section className={styles.section}>
          <PrimaryButton className={styles.right}>
            Utfør Reservasjon
          </PrimaryButton>
          <DefaultButton className={styles.right}>Avbryt</DefaultButton>
        </section>
      </div>
    </React.Fragment>
  );
};

export default Booking;
