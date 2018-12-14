import React from "react";
import { TextField, DefaultButton, Label } from "office-ui-fabric-react";
import styles from "../Booking.module.css";

const BedSelector = ({
  date,
  title,
  maxSpaces,
  updateBedsOnDate,
  updateAll
}) => {
  if (!date) return null;
  return (
    <div className={styles.bedSelector}>
      <Label>{title || date.dateKey}</Label>
      <Label htmlFor="medlem">Antall NTNUI-medlemmer</Label>
      <div className={styles.fieldWithButtonContainer}>
        <TextField
          id="medlem"
          type="number"
          min="0"
          value={date.members}
          onChange={e =>
            updateBedsOnDate(date.dateKey, e.target.value, true, updateAll)
          }
        />
        <DefaultButton
          onClick={() =>
            updateBedsOnDate(date.dateKey, maxSpaces, true, updateAll)
          }
        >
          {maxSpaces}
        </DefaultButton>
      </div>
      <Label htmlFor="ikkemedlem">Antall BIL-/ikkemedlemmer</Label>
      <div className={styles.fieldWithButtonContainer}>
        <TextField
          id="ikkemedlem"
          type="number"
          min="0"
          value={date.nonMembers}
          onChange={e =>
            updateBedsOnDate(date.dateKey, e.target.value, false, updateAll)
          }
        />
        <DefaultButton
          onClick={() =>
            updateBedsOnDate(date.dateKey, maxSpaces, false, updateAll)
          }
        >
          {maxSpaces}
        </DefaultButton>
      </div>
    </div>
  );
};

export default BedSelector;
