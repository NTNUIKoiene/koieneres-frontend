import { differenceInCalendarDays } from "date-fns";
/*
    On Cell Click, calculate the new valid list of selected dates. 
*/
function getUpdatedSelectedDates(
  name,
  dateKey,
  deleteDate,
  selectedDates,
  maxNights
) {
  // Create new list of selected dates based on user action
  if (selectedDates.length === 0) {
    return [{ name, dateKey, members: 0, nonMembers: 0 }];
  }
  let newSelectedDates = [];
  if (deleteDate) {
    newSelectedDates = [...selectedDates].filter(
      sd => sd.name !== name || sd.dateKey !== dateKey
    );
  } else {
    newSelectedDates = [
      ...selectedDates,
      { name, dateKey, members: 0, nonMembers: 0 }
    ];
  }
  newSelectedDates.sort(selectedDateComparator);
  // Check that the new list is valid
  for (let i = 0; i < newSelectedDates.length - 1; i++) {
    if (
      newSelectedDates[i].name !== newSelectedDates[i + 1].name ||
      differenceInCalendarDays(
        new Date(newSelectedDates[i + 1].dateKey),
        new Date(newSelectedDates[i].dateKey)
      ) !== 1
    ) {
      return [{ name, dateKey, members: 0, nonMembers: 0 }];
    }
  }
  // Reset number of selected beds
  for (let i = 0; i < newSelectedDates.length; i++) {
    newSelectedDates[i].members = 0;
    newSelectedDates[i].nonMembers = 0;
  }
  // Ensure max number of nights is respected by removing first or last of list

  if (newSelectedDates.length > maxNights) {
    if (newSelectedDates[0].dateKey === dateKey) {
      return newSelectedDates.slice(0, newSelectedDates.length - 1);
    } else {
      return newSelectedDates.slice(1);
    }
  }
  return newSelectedDates;
}

function selectedDateComparator(a, b) {
  if (a.dateKey < b.dateKey) return -1;
  if (a.dateKey > b.dateKey) return 1;
  return 0;
}

export { getUpdatedSelectedDates, selectedDateComparator };
