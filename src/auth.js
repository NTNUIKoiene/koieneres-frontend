/*
const fakeAuth = {
  isAuthenticated: true,
  authenticate(cb) {
    console.log("Logging in");
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    console.log("Logging out");
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  },
  userConfig: {
    isBoard: true,
    maxNights: 3
  }
};

*/
import { BASE_URL } from "./config";

export default class Auth {
  authenticated = false;
  token = localStorage.getItem("token");

  login = async (username, password) => {
    const response = await (await fetch(
      `${BASE_URL}/authorization/token-auth/`,
      {
        method: "POST",
        body: JSON.stringify({
          username,
          password
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    )).json();
    if (response.token) {
      localStorage.setItem("token", response.token);
      this.authenticated = true;
      return true;
    } else {
      this.authenticated = false;
      return false;
    }
  };
  logout = () => {
    localStorage.removeItem("token");
  };
}
