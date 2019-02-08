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
import Auth from "./auth";

const authModule = new Auth();

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route
              exact
              path="/"
              render={props => <Login {...props} auth={authModule} />}
            />
            <PrivateRoute path="/reservations" component={Reservations} />
            <PrivateRoute path="/booking" component={Booking} />
            <Route component={NotFound} />
          </Switch>
        </div>
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

export default App;
