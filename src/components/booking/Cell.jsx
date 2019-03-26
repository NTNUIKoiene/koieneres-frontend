import React from "react";
import PropTypes from "prop-types";
import styles from "../Booking.module.css";
import { TooltipHost } from "office-ui-fabric-react";

const Cell = ({ item, day, selectedDates, onCellClick }) => {
  if (!item.data[day]) return null;
  const count = item.data[day].booked;
  const isSelected = selectedDates.filter(
    sd => sd.name === item.name && day === sd.dateKey
  ).length;

  let cellStyle = styles.cell;
  if (count >= item.size) {
    cellStyle = styles.fullCell;
  } else if (count > 0) {
    cellStyle = styles.partialCell;
  }
  if (isSelected) {
    cellStyle = styles.selectedCell;
  }
  let tooltipText = `${item.name}, ${day}`;
  let clickFunction = () => onCellClick(item.name, day, isSelected);
  if (item.data[day].isClosed) {
    cellStyle = styles.closedCell;
    tooltipText = tooltipText + " (Stengt)";
    clickFunction = null;
  }

  return (
    <TooltipHost content={tooltipText}>
      <div className={cellStyle} onClick={clickFunction}>
        {count} / {item.size}
      </div>
    </TooltipHost>
  );
};

Cell.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    size: PropTypes.number.isRequired
  }).isRequired,
  day: PropTypes.string.isRequired,
  selectedDates: PropTypes.array.isRequired,
  onCellClick: PropTypes.func.isRequired
};

export default Cell;
