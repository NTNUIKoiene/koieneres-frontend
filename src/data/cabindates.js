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

async function getData() {
  await new Promise(resolve => setTimeout(resolve, 150));
  return resData;
}

export { resData, getData };
