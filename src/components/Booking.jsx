import React from "react";
import Header from "./Header";
import styles from "./Booking.module.css";
import { Prompt } from "react-router-dom";
import { FontClassNames, ColorClassNames } from "@uifabric/styling";
import { generateData } from "../data/cabindates";
import {
  TextField,
  PrimaryButton,
  DefaultButton,
  DetailsList,
  CheckboxVisibility,
  TooltipHost,
  DatePicker,
  Label
} from "office-ui-fabric-react";
import moment from "moment";

const Booking = props => {
  if (!props.auth.isAuthenticated) {
    props.history.push("/");
  }

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

  const day = moment();
  for (let i = 0; i < days; i++) {
    const key = day.format("YYYY-MM-DD");
    dataColumns.push({
      key,
      name: day.format("ddd DD.MM"),
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
    day.add(1, "day");
  }

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
            <DatePicker id="fromDate" />
            <Label htmlFor="toDate">til</Label>
            <DatePicker id="toDate" />
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
