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
import { default as BookingHelp } from "./components/booking/Help";

const Reservations = lazy(() =>
  import("./components/reservations/Reservations")
);
const Booking = lazy(() => import("./components/booking/Booking"));
const ExtendedPeriod = lazy(() => import("./components/ExtendedPeriod"));
const Closing = lazy(() => import("./components/closing/Closing"));

const withHeader = (Component, HelpComponent) => {
  const HigherOrderComponent = props => (
    <>
      <Header
        currentPage={props.location.pathname}
        helpComponent={HelpComponent ? <HelpComponent /> : undefined}
      />
      <Suspense
        fallback={
          <Spinner style={{ marginTop: 50 }} size={SpinnerSize.large} />
        }
      >
        <Component {...props} />
      </Suspense>
    </>
  );

  HigherOrderComponent.propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired
  };

  return HigherOrderComponent;
};

const authModule = new Auth();

const App = () => (
  <>
    <Router>
      <Switch>
        <PrivateRoute
          path="/booking"
          component={withHeader(Booking, BookingHelp)}
        />
        <PrivateRoute
          path="/reservations"
          component={withHeader(Reservations)}
        />
        <PrivateRoute path="/closing" component={withHeader(Closing)} />
        <PrivateRoute
          path="/extendedperiod"
          component={withHeader(ExtendedPeriod)}
        />
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
