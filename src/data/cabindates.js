import moment from "moment";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateData(cabinName, size, nDays = 13) {
  const data = {
    cabinName,
    size,
    memberPrice: 40,
    nonMemberPrice: 80
  };
  const today = moment();
  for (let i = 0; i < nDays; i++) {
    const key = today.format("YYYY-MM-DD");
    data[key] = getRandomInt(0, size);
    today.add(1, "day");
  }
  return data;
}

export { generateData };
