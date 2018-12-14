import React from "react";
import {
  TextField,
  DefaultButton,
  Label,
  TooltipHost
} from "office-ui-fabric-react";
import styles from "../Booking.module.css";

const BedSelector = ({
  date,
  title,
  maxSpaces,
  updateBedsOnDate,
  updateAll
}) => {
  if (!date) return null;

  const overbooked = date.members + date.nonMembers > maxSpaces;
  const className = overbooked
    ? styles.bedSelectorOverbooked
    : styles.bedSelector;

  return (
    <div className={className}>
      <Label>{title || date.dateKey}</Label>
      <Label htmlFor="medlem">Antall NTNUI-medlemmer</Label>
      <div className={styles.fieldWithButtonContainer}>
        <TextField
          id="medlem"
          type="number"
          min={0}
          value={date.members || "0"}
          valueAsNumber={true}
          onChange={e =>
            updateBedsOnDate(
              date.dateKey,
              e.target.valueAsNumber,
              true,
              updateAll
            )
          }
        />
        <TooltipHost content="Antall ledige senger denne datoen">
          <DefaultButton
            onClick={() =>
              updateBedsOnDate(date.dateKey, maxSpaces, true, updateAll)
            }
          >
            {maxSpaces}
          </DefaultButton>
        </TooltipHost>
      </div>
      <Label htmlFor="ikkemedlem">Antall BIL-/ikkemedlemmer</Label>
      <div className={styles.fieldWithButtonContainer}>
        <TextField
          id="ikkemedlem"
          type="number"
          min={0}
          value={date.nonMembers || "0"}
          valueAsNumber={true}
          onChange={e =>
            updateBedsOnDate(
              date.dateKey,
              e.target.valueAsNumber,
              false,
              updateAll
            )
          }
        />
        <TooltipHost content="Antall ledige senger denne datoen">
          <DefaultButton
            onClick={() =>
              updateBedsOnDate(date.dateKey, maxSpaces, false, updateAll)
            }
          >
            {maxSpaces}
          </DefaultButton>
        </TooltipHost>
      </div>
    </div>
  );
};

export default BedSelector;
