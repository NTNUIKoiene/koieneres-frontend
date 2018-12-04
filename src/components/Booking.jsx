import React from "react";
import Header from "./Header";
import styles from "./Booking.module.css";
import { Prompt } from "react-router-dom";
import { FontClassNames, ColorClassNames } from "@uifabric/styling";
import cabindates from "../data/cabindates";
import {
  TextField,
  PrimaryButton,
  DefaultButton,
  DetailsList,
  CheckboxVisibility,
} from "office-ui-fabric-react";

const Booking = props => {
  if (!props.auth.isAuthenticated) {
    props.history.push("/");
  }

  const columns = cabindates[0].status.map(d => {
    return {
      key: d.date.format("YYYY-MM-DD"),
      name: d.date.format("ddd DD.MM"),
      minWidth: 60,
      maxWidth: 60,
      onRender: item => {
        const count = item.status.filter(
          s => s.date.format("YYYY-MM-DD") === d.date.format("YYYY-MM-DD")
        )[0].occupied;
        return (
          <div className={styles.cell}>
            {count} / {item.size}
          </div>
        );
      },
    };
  });

  columns.unshift({
    key: "cabinname",
    name: "",
    minWidth: 60,
    isPadded: true,
    onRender: item => {
      return <div>{item.cabin}</div>;
    },
  });

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
          <DetailsList
            columns={columns}
            items={cabindates}
            checkboxVisibility={CheckboxVisibility.hidden}
          />
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
