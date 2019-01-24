import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/Login";
import Booking from "./components/Booking";
import Reservations from "./components/Reservations";
import Auth from "./auth";

const authModule = new Auth();

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route
            exact
            path="/"
            render={props => <Login {...props} auth={authModule} />}
          />
          <Route
            path="/reservations"
            render={props => <Reservations {...props} auth={authModule} />}
          />
          <Route
            path="/booking"
            render={props => <Booking {...props} auth={authModule} />}
          />
        </div>
      </Router>
    );
  }
}

export default App;
