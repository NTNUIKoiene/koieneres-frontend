import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import Login from "./components/Login";
import Booking from "./components/booking/Booking";
import Reservations from "./components/reservations/Reservations";
import NotFound from "./components/NotFound";
import Closing from "./components/closing/Closing";
import ExtendedPeriod from "./components/ExtendedPeriod";
import Auth from "./auth";

const authModule = new Auth();

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <PrivateRoute path="/reservations" component={Reservations} />
          <PrivateRoute path="/booking" component={Booking} />
          <PrivateRoute path="/closing" component={Closing} />
          <PrivateRoute path="/extendedperiod" component={ExtendedPeriod} />
          <Route
            path="/logout"
            render={props => <Logout {...props} auth={authModule} />}
          />
          <Route
            exact
            path="/"
            render={props => <Login {...props} auth={authModule} />}
          />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authModule.authenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired
};

const Logout = props => {
  props.auth.logout();
  return <Redirect to="/" />;
};

Logout.propTypes = {
  auth: PropTypes.shape({
    logout: PropTypes.func.isRequired
  }).isRequired
};

export default App;
