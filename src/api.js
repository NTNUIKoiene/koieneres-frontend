import { BASE_URL } from "./config";

const fetchAPIData = async path => {
  return await (await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `JWT ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    }
  })).json();
};

export { fetchAPIData };
