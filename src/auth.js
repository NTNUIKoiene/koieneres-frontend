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
  constructor() {
    this.authenticated = false;
    this.token = localStorage.getItem("token");
  }

  login = async (username, password) => {
    const response = await fetch(`${BASE_URL}/authorization/token-auth/`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const json = await response.json();
    if (response.status === 200) {
      this.token = json.token;
      localStorage.setItem("token", json.token);
      this.authenticated = true;
      return true;
    } else {
      this.authenticated = false;
      return false;
    }
  };
  logout = () => {
    localStorage.removeItem("token");
    this.authenticated = false;
    this.token = false;
  };

  refresh = async () => {
    const response = await fetch(
      `${BASE_URL}/authorization/token-auth/refresh/`,
      {
        method: "POST",
        body: JSON.stringify({
          token: this.token
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    const json = await response.json();
    if (response.status === 200) {
      this.token = json.token;
      localStorage.setItem("token", json.token);
      this.authenticated = true;
      return true;
    } else {
      localStorage.removeItem("token");
      this.authenticated = false;
      return false;
    }
  };
}
