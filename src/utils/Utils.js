import { differenceInCalendarDays } from "date-fns";
/*
    On Cell Click, calculate the new valid list of selected dates. 
*/
function getUpdatedSelectedDates(
  cabinName,
  dateKey,
  isSelected,
  selectedDates
) {
  // Create new list of selected dates based on user action
  if (selectedDates.length === 0) {
    return [{ cabinName, dateKey, members: 0, nonMembers: 0 }];
  }
  let newSelectedDates = [];
  if (isSelected) {
    newSelectedDates = [...selectedDates].filter(
      sd => sd.cabinName !== cabinName || sd.dateKey !== dateKey
    );
  } else {
    newSelectedDates = [
      ...selectedDates,
      { cabinName, dateKey, members: 0, nonMembers: 0 }
    ];
  }
  newSelectedDates.sort(selectedDateComparator);
  // Check that the new list is valid
  for (let i = 0; i < newSelectedDates.length - 1; i++) {
    if (
      newSelectedDates[i].cabinName !== newSelectedDates[i + 1].cabinName ||
      differenceInCalendarDays(
        new Date(newSelectedDates[i + 1].dateKey),
        new Date(newSelectedDates[i].dateKey)
      ) !== 1
    ) {
      return [{ cabinName, dateKey, members: 0, nonMembers: 0 }];
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
