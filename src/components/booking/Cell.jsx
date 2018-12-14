import React from "react";

import styles from "../Booking.module.css";
import { TooltipHost } from "office-ui-fabric-react";

const Cell = ({ item, day, selectedDates, onCellClick }) => {
  const count = item[day];
  let cellStyle = styles.cell;
  if (count === item.size) {
    cellStyle = styles.fullCell;
  } else if (count > 0) {
    cellStyle = styles.partialCell;
  }
  const isSelected = selectedDates.filter(
    sd => sd.cabinName === item.cabinName && day === sd.dateKey
  ).length;
  if (isSelected) {
    cellStyle = styles.selectedCell;
  }

  const tooltipText = `${item.cabinName}, ${day}`;
  return (
    <TooltipHost content={tooltipText}>
      <div
        className={cellStyle}
        onClick={() => onCellClick(item.cabinName, day, isSelected)}
      >
        {count} / {item.size}
      </div>
    </TooltipHost>
  );
};

export default Cell;
