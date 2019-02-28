import { BASE_URL } from "./config";

const fetchAPIData = async path => {
  return await (await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `JWT ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    }
  })).json();
};

const deleteAPIData = async path => {
  return await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `JWT ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    },
    method: "DELETE"
  });
};

const postAPIData = async (path, payload) => {
  return await (await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `JWT ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(payload)
  })).json();
};

export { fetchAPIData, deleteAPIData, postAPIData };
