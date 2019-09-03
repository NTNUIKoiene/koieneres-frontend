import React, { Suspense, lazy } from "react";
import PropTypes from "prop-types";
import Header from "./components/Header";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import Auth from "./auth";
import Login from "./components/Login";
import NotFound from "./components/NotFound";

const Reservations = lazy(() =>
  import("./components/reservations/Reservations")
);
const Booking = lazy(() => import("./components/booking/Booking"));
const ExtendedPeriod = lazy(() => import("./components/ExtendedPeriod"));
const Closing = lazy(() => import("./components/closing/Closing"));
const Receipt = lazy(() => import("./components/Receipt"));

const authModule = new Auth();

const App = () => (
  <>
    <Router>
      <Header />
      <Suspense
        fallback={
          <Spinner style={{ marginTop: 50 }} size={SpinnerSize.large} />
        }
      >
        <Switch>
          <PrivateRoute path="/booking" component={Booking} />
          <PrivateRoute path="/reservations" component={Reservations} />
          <PrivateRoute path="/closing" component={Closing} />
          <PrivateRoute path="/extendedperiod" component={ExtendedPeriod} />
          <Route path="/receipt/:id" component={Receipt} />
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
      </Suspense>
    </Router>
  </>
);

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
  component: Route.propTypes.component
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
