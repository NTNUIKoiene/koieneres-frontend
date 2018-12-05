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

const resData = [
  generateData("Flåkoia", 11, 13),
  generateData("Fosenkoia", 10, 13),
  generateData("Heinfjordstua", 25, 13),
  generateData("Hognabu", 6, 13),
  generateData("Holmsåkoia", 20, 13),
  generateData("Holvassgamma", 8, 13),
  generateData("Iglbu", 10, 13),
  generateData("Kamtjønnkoia", 6, 13),
  generateData("Kåsen", 4, 13),
  generateData("Lyngli", 13, 13),
  generateData("Lynhøgen", 5, 13),
  generateData("Mevasskoia", 5, 13),
  generateData("Mortenskåten", 2, 13),
  generateData("Nicokoia", 8, 13),
  generateData("Rindalsløa", 4, 13),
  generateData("Selbukåten", 2, 13),
  generateData("Sonvasskoia", 8, 13),
  generateData("Stabburet", 2, 13),
  generateData("Stakkslettbua", 11, 13),
  generateData("Telin", 9, 13),
  generateData("Taagabu", 6, 13),
  generateData("Vekvessætra", 20, 13),
  generateData("Øvensenget", 8, 13)
];

const Booking = props => {
  // Redirect to front page if not authenticated
  if (!props.auth.isAuthenticated) {
    props.history.push("/");
  }

  // State
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(addDays(new Date(), 13));
  const deltaDays = differenceInCalendarDays(toDate, fromDate);
  const [selectedDates, setSelectedDates] = useState([]);

  const onCellClick = (cabinName, dateKey) => {
    const newState = [...selectedDates, { cabinName, dateKey }];
    setSelectedDates(newState);
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
      onRender: item => {
        const count = item[key];
        let cellStyle = styles.cell;
        if (count === item.size) {
          cellStyle = styles.fullCell;
        } else if (count > 0) {
          cellStyle = styles.partialCell;
        }
        const isMatching = selectedDates.filter(
          sd => sd.cabinName === item.cabinName && key === sd.dateKey
        ).length;
        if (isMatching) {
          cellStyle = styles.selectedCell;
        }

        const tooltipText = `${item.cabinName}, ${key}`;
        return (
          <TooltipHost content={tooltipText}>
            <div
              className={cellStyle}
              onClick={() => onCellClick(item.cabinName, key)}
            >
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
