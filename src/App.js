import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/Login";
import Booking from "./components/Booking";
import Reservations from "./components/Reservations";

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

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route
            exact
            path="/"
            render={props => <Login {...props} auth={fakeAuth} />}
          />
          <Route
            path="/reservations"
            render={props => <Reservations {...props} auth={fakeAuth} />}
          />
          <Route
            path="/booking"
            render={props => <Booking {...props} auth={fakeAuth} />}
          />
        </div>
      </Router>
    );
  }
}

export default App;
