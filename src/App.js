import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import Login from "./components/Login";
import Booking from "./components/Booking";
import Reservations from "./components/Reservations";
import NotFound from "./components/NotFound";
import Closing from "./components/Closing";
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

const Logout = props => {
  props.auth.logout();
  return <Redirect to="/" />;
};

export default App;
