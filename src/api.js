import { BASE_URL } from "./config";

const patchAPIData = async (path, payload) => {
  return await (await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `JWT ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    },
    method: "PATCH",
    body: JSON.stringify(payload)
  })).json();
};

export { patchAPIData };
