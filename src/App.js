import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Booking from "./components/Booking";
import Reservations from "./components/Reservations";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Booking} />
          <Route path="/reservations" component={Reservations} />
          <Route exact path="/login" component={Login} />
        </div>
      </Router>
    );
  }
}

export default App;
