import moment from "moment";

const dates = [
  {
    cabin: "Flåkoia",
    size: "11",
    memberPrice: 40,
    nonMemberPrice: 80,
    status: [
      {
        date: moment("2018-12-03"),
        occupied: 11,
      },
      {
        date: moment("2018-12-04"),
        occupied: 11,
      },
      {
        date: moment("2018-12-05"),
        occupied: 0,
      },
      {
        date: moment("2018-12-06"),
        occupied: 0,
      },
      {
        date: moment("2018-12-07"),
        occupied: 0,
      },
      {
        date: moment("2018-12-08"),
        occupied: 5,
      },
      {
        date: moment("2018-12-09"),
        occupied: 6,
      },
      {
        date: moment("2018-12-10"),
        occupied: 7,
      },
      {
        date: moment("2018-12-11"),
        occupied: 0,
      },
      {
        date: moment("2018-12-12"),
        occupied: 11,
      },
      {
        date: moment("2018-12-13"),
        occupied: 11,
      },
    ],
  },
  {
    cabin: "Holmså",
    size: "20",
    memberPrice: 40,
    nonMemberPrice: 80,
    status: [
      {
        date: moment("2018-12-03"),
        occupied: 0,
      },
      {
        date: moment("2018-12-04"),
        occupied: 0,
      },
      {
        date: moment("2018-12-05"),
        occupied: 0,
      },
      {
        date: moment("2018-12-06"),
        occupied: 18,
      },
      {
        date: moment("2018-12-07"),
        occupied: 18,
      },
      {
        date: moment("2018-12-08"),
        occupied: 18,
      },
      {
        date: moment("2018-12-09"),
        occupied: 20,
      },
      {
        date: moment("2018-12-10"),
        occupied: 20,
      },
      {
        date: moment("2018-12-11"),
        occupied: 0,
      },
      {
        date: moment("2018-12-12"),
        occupied: 0,
      },
      {
        date: moment("2018-12-13"),
        occupied: 0,
      },
    ],
  },
];

export default dates;
